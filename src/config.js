export default {
    type: "network",
    version: "1.0",
    data: "data.json",
    legend: {
        edgeLabel: "",
        colorLabel: "",
        nodeLabel: ""
    },
    features: {
        search: true,
        groupSelectorAttribute: false,
        hoverBehavior: "default"
    },
    informationPanel: {
        imageAttribute: "profileimageurl"
    },
    sigma: {
        drawingProperties: {
            defaultEdgeType: "curve",
            defaultHoverLabelBGColor: "#002147",
            defaultLabelBGColor: "#ddd",
            activeFontStyle: "bold",
            defaultLabelColor: "#000",
            labelThreshold: 10,
            defaultLabelHoverColor: "#fff",
            fontStyle: "bold",
            hoverFontStyle: "bold",
            defaultLabelSize: 12
        },
        graphProperties: {
            maxEdgeSize: 0.2,
            minEdgeSize: 0.1,
            minNodeSize: 2,
            maxNodeSize: 40
        },
        mouseProperties: {
            maxRatio: 20,
            minRatio: 0.75
        }
    }
};
