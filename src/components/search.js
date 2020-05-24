export var Search = element => {
    this.input = element.find("input[name=search]");
    this.state = element.find(".state");
    this.results = element.find(".results");
    this.exactMatch = false;
    this.lastSearch = "";
    this.searching = false;
    var b = this;
    this.input.focus(function() {
        var a = $(this);
        a.data("focus") || (a.data("focus", true), a.removeClass("empty"));
        b.clean();
    });
    this.input.keydown(function(a) {
        if (13 == a.which)
            return (
                b.state.addClass("searching"), b.search(b.input.val()), false
            );
    });
    this.state.click(function() {
        var a = b.input.val();
        b.searching && a == b.lastSearch
            ? b.close()
            : (b.state.addClass("searching"), b.search(a));
    });
    this.dom = element;
    this.close = function() {
        this.state.removeClass("searching");
        this.results.hide();
        this.searching = false;
        this.input.val(""); //SAH -- let's erase string when we close
        nodeNormal();
    };
    this.clean = function() {
        this.results.empty().hide();
        this.state.removeClass("searching");
        this.input.val("");
    };
    this.search = function(a) {
        var b = false,
            c = [],
            b = this.exactMatch
                ? ("^" + a + "$").toLowerCase()
                : a.toLowerCase(),
            g = RegExp(b);
        this.exactMatch = false;
        this.searching = true;
        this.lastSearch = a;
        this.results.empty();
        if (2 >= a.length)
            this.results.html(
                "<i>You must search for a name with a minimum of 3 letters.</i>"
            );
        else {
            sigma_instance.iterNodes(function(a) {
                g.test(a.label.toLowerCase()) &&
                    c.push({
                        id: a.id,
                        name: a.label
                    });
            });
            c.length ? ((b = true), nodeActive(c[0].id)) : (b = showCluster(a));
            a = ["<b>Search Results: </b>"];
            if (1 < c.length)
                for (var d = 0, h = c.length; d < h; d++)
                    a.push(
                        '<a href="#' +
                            c[d].name +
                            '" onclick="nodeActive(\'' +
                            c[d].id +
                            "')\">" +
                            c[d].name +
                            "</a>"
                    );
            0 == c.length && !b && a.push("<i>No results found.</i>");
            1 < a.length && this.results.html(a.join(""));
        }
        if (c.length != 1) this.results.show();
        if (c.length == 1) this.results.hide();
    };
};
