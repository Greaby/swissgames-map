import "./style/main.scss";
import config from "./config";

import { sigma } from "./sigma";

import { Search } from "./components/search";

let close_button = document.querySelector(".returntext");
let info_pane = document.querySelector("#attributepane");
let info_name = document.querySelector("#attributepane .name");
let info_link = document.querySelector("#attributepane .link ul");
let info_data = document.querySelector("#attributepane .data");

let show_pane = () => {
    info_pane.classList.add("open");
};

let hide_pane = () => {
    info_pane.classList.remove("open");
};

let search = null; //new Search($("#search"));

let sigma_instance = sigma
    .init(document.querySelector("#sigma-canvas"))
    .drawingProperties(config.sigma.drawingProperties)
    .graphProperties(config.sigma.graphProperties)
    .mouseProperties(config.sigma.mouseProperties);

window.sigma_instance = sigma_instance;

sigma_instance.parseJson(document.querySelector("body").dataset.graph, () => {
    sigma_instance.bind("upnodes", node => {
        show_pane();
        nodeActive(node.content[0]);
    });

    sigma_instance.iterEdges(edge => {
        edge.attr.color = edge.color;
    });

    sigma_instance.iterNodes(node => {
        node.attr.color = node.color;
    });
    sigma_instance.draw();

    // find active node
    let hash = window.location.hash.substr(1);
    if (0 < hash.length) {
        search.exactMatch = true;
        search.search(a);
        search.clean();
    }
});

// zoom buttons
let zoom_in = document.querySelector("#zoom .in");
let zoom_out = document.querySelector("#zoom .out");

let zoom_to = value => {
    sigma_instance.zoomTo(
        window.innerWidth / 2,
        window.innerHeight / 2,
        sigma_instance._core.mousecaptor.ratio * value
    );
};

zoom_in.addEventListener("click", e => {
    e.preventDefault();
    zoom_to(1.5);
});

zoom_out.addEventListener("click", e => {
    e.preventDefault();
    zoom_to(0.5);
});

// close button
close_button.addEventListener("click", e => {
    e.preventDefault();
    hide_pane();
    display_full_graph();
});

let display_full_graph = () => {
    sigma_instance.iterEdges(edge => {
        edge.hidden = false;
    });
    sigma_instance.iterNodes(node => {
        node.attr.lineWidth = false;
        node.hidden = false;
    });

    sigma_instance.draw();

    window.location.hash = "";
};

let nodeActive = id => {
    let selected_node = sigma_instance._core.graph.nodesIndex[id];

    //sigma_instance.neighbors = {};
    sigma_instance.detail = true;

    let outgoing = [];
    let incoming = [];

    sigma_instance.iterEdges(edge => {
        if (edge.source == selected_node.id) {
            outgoing.push(edge.target);
        } else if (edge.target == selected_node.id) {
            incoming.push(edge.source);
        }

        edge.attr.lineWidth = false;
        edge.hidden = false;
        edge.attr.color = "rgba(0, 0, 0, 1)";
    });

    let mutual = outgoing.filter(e => incoming.indexOf(e) !== -1);

    sigma_instance.iterNodes(node => {
        node.hidden = true;
    });

    var createList = list => {
        let nodes = list.map(index => {
            let node = sigma_instance._core.graph.nodesIndex[index];
            node.hidden = false;
            node.attr.lineWidth = false;

            if (index != selected_node.id) {
                return node;
            }
        });

        nodes.sort((a, b) => {
            return a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1;
        });

        return nodes.map(
            node =>
                '<li class="membership"><a href="#' +
                node.label +
                '" onmouseover="sigma_instance._core.plotter.drawHoverNode(sigma_instance._core.graph.nodesIndex[\'' +
                node.id +
                "'])\" onclick=\"nodeActive('" +
                node.id +
                '\')" onmouseout="sigma_instance.refresh()">' +
                node.label +
                "</a></li>"
        );
    };

    let content = [];

    content.push("<h2>Mututal (" + mutual.length + ")</h2>");

    mutual.length > 0
        ? (content = content.concat(createList(mutual)))
        : content.push("No mutual links<br>");

    content.push("<h2>Incoming (" + incoming.length + ")</h2>");
    incoming.length > 0
        ? (content = content.concat(createList(incoming)))
        : content.push("No incoming links<br>");

    content.push("<h2>Outgoing (" + outgoing.length + ")</h2>");
    outgoing.length > 0
        ? (content = content.concat(createList(outgoing)))
        : content.push("No outgoing links<br>");

    // display selected node
    selected_node.hidden = false;
    selected_node.attr.lineWidth = 6;
    selected_node.attr.strokeStyle = "#000000";

    sigma_instance.draw();

    info_link.innerHTML = content.join("");

    let f = selected_node.attr;
    if (f.attributes) {
        var image_attribute = config.informationPanel.imageAttribute;

        let e = [];
        for (var attr in f.attributes) {
            var d = f.attributes[attr],
                h = "";
            if (attr != image_attribute) {
                h =
                    "<span><strong>" +
                    attr +
                    ":</strong> " +
                    d +
                    "</span><br/>";
            }

            e.push(h);
        }

        if (image_attribute) {
            info_name.innerHTML =
                '<a href="https://twitter.com/' +
                selected_node.label +
                '" target="_blank" ><img src=' +
                f.attributes[image_attribute] +
                ' style="vertical-align:middle" /> <span onmouseover="sigma_instance._core.plotter.drawHoverNode(sigma_instance._core.graph.nodesIndex[\'' +
                selected_node.id +
                '\'])" onmouseout="sigma_instance.refresh()">' +
                selected_node.label +
                "</span></a>";
        } else {
            info_name.innerHTML =
                "<div><span onmouseover=\"sigma_instance._core.plotter.drawHoverNode(sigma_instance._core.graph.nodesIndex['" +
                selected_node.id +
                '\'])" onmouseout="sigma_instance.refresh()">' +
                selected_node.label +
                "</span></div>";
        }

        // Image field for attribute pane
        info_data.innerHTML = e.join("");
    }

    window.location.hash = selected_node.label;
};
