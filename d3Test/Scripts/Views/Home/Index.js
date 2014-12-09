define(function (require) {
    var d3 = require('d3');
    var $ = require('jquery');

    var $Year = $("#Year");
    var $Month = $("#Month");
    var $SubmitBtn = $("#SubmitBtn");
    var $btnSeperate = $("#btnSeperate");
    var mustAnimate = true;

    $SubmitBtn.click(function (e) {
        e.preventDefault();
        reloadData();
        return false;
    });

    $btnSeperate.click(function (e) {
        e.preventDefault();

        mustAnimate = false;
        seperateData();

        return false;
    });

    var width = 1060,
    height = 800,
    padding = 1.5, // separation between same-color nodes
    clusterPadding = 6, // separation between nodes
    maxRadius = 5;

    var svg = d3.select("#DataVisualization").append("svg")
                .attr("width", width)
                .attr("height", height);

    var n = 200, // total number of nodes
        m = 1; // number of distinct clusters

    var color = d3.scale.category10()
        .domain(d3.range(m));

    // The largest node for each cluster.
    var clusters = new Array(m);

    reloadData();
    colorChange();

    function colorChange() {
        var recolor = function () {
            svg.select("circle")
              .transition()
              .duration(3000)
              .attr("fill", "hsl(" + (Math.random() * 360) + ",100%,50%)")
              .each("end", recolor);
        };
    }

    function changeData() {
        svg.selectAll("circle")
            .transition()
            .delay(function(d, i) {
                return i * 20;
            })
            .duration(500)
            .attr("r", function(d, i) {
                return (Math.random() * 7) + "%";
            });
    }

    function reloadData() {
        var year = $("option:selected", $Year).val();
        var month = $("option:selected", $Month).val();

        d3.json("/api/SalesTtb?year=" + year + "&month=" + month +"&count=20", function(error, root) {
            var nodes = root.map(function(x) {
                var i = Math.floor(Math.random() * m),
                    r = Math.log(x.TTB) * maxRadius,
                    d = { cluster: i, radius: r, text: x.BouquetPrefix, count: x.TTB, bouquetType: x.BouquetType };
                if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;

                return d;
            });

            // Use the pack layout to initialize node positions.
            d3.layout.pack()
                .sort(null)
                .size([width, height])
                .children(function(d) { return d.values; })
                .value(function(d) { return d.radius * d.radius; })
                .nodes({
                    values: d3.nest()
                        .key(function(d) { return d.cluster; })
                        .entries(nodes)
                });

            var force = d3.layout.force()
                .nodes(nodes)
                .size([width, height])
                .gravity(.02)
                .charge(0)
                .on("tick", tick)
                .start();

            var node = svg.selectAll("circle")
                .data(nodes)
                .enter().append("circle")
                .filter(function(d) { return d.count > 1; })
                .style("fill", function(d) {
                    return color(d.bouquetType);
                })
                //.on("mouseover", function (d) {
                //    console.log("ds - MouseOver");
                //    d3.select("#tooltip")
                //        .style("left", d3.event.pageX + "px")
                //        .style("top", d3.event.pageY + "px")
                //        .style("opacity", 1)
                //        .select("#value")
                //        .text(d.count);
                //})
                //.on("mouseout", function() {
                //    console.log("ds - MouseOut");
                //    d3.select("#tooltip")
                //        .style("opacity", 0);
                //})
                .call(force.drag);

            var label = svg.selectAll("g")
                .data(nodes)
                .enter().append("g")
                .filter(function(d) { return d.count > 1; })
                .call(force.drag);

            var fontSize = 5;

            label.append("text")
                .style("text-anchor", "middle")
                .style("font-size", function (d) { return Math.max(fontSize, d.r / 2) + "px"; })
                .style("width", function(d) { return d.r + "px"; })
                .text(function(d) { return d.text; });

            label.append("text")
                .attr("dy", function (d) { return Math.max(fontSize, d.r / 2) + "px"; })
                .style("text-anchor", "middle")
                .style("font-size", function (d) { return Math.max(fontSize, d.r / 4) + "px"; })
                .style("width", function(d) { return d.r + "px"; })
                .text(function(d) { return d.count; });

            node.transition()
                .duration(750)
                .delay(function(d, i) { return i * 5; })
                .attrTween("r", function(d) {
                    var i = d3.interpolate(0, d.radius);
                    return function(t) { return d.radius = i(t); };
                });

            function tick(e) {
                    node
                      //Gravity changed to match wider dimensions
                      .each(gravity(e.alpha * .1))
                      .each(collide(.5))
                      //Max min to stay within bounding box
                      .attr("cx", function (d) { return d.x = Math.max(d.r, Math.min(width - d.r, d.x)); })
                      .attr("cy", function (d) { return d.y = Math.max(d.r, Math.min(height - d.r, d.y)); });

                    label
                        .each(gravity(e.alpha * .1))
                        .each(collide(.5))
                        .attr("transform", function (d) {
                            var x = Math.max(d.r, Math.min(width - d.r, d.x));
                            var y = Math.max(d.r, Math.min(height - d.r, d.y));

                            return 'translate(' + x + ',' + y + ')';
                        });
            }

            // Move d to be adjacent to the cluster node.
            function cluster(alpha) {
                return function(d) {
                    var cluster = clusters[d.cluster];
                    if (cluster === d) return;
                    var x = d.x - cluster.x,
                        y = d.y - cluster.y,
                        l = Math.sqrt(x * x + y * y),
                        r = d.radius + cluster.radius;
                    if (l != r) {
                        l = (l - r) / l * alpha;
                        d.x -= x *= l;
                        d.y -= y *= l;
                        cluster.x += x;
                        cluster.y += y;
                    }
                };
            }

            // Resolves collisions between d and all other circles.
            function collide(alpha) {
                var quadtree = d3.geom.quadtree(nodes);
                return function(d) {
                    var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
                        nx1 = d.x - r,
                        nx2 = d.x + r,
                        ny1 = d.y - r,
                        ny2 = d.y + r;
                    quadtree.visit(function(quad, x1, y1, x2, y2) {
                        if (quad.point && (quad.point !== d)) {
                            var x = d.x - quad.point.x,
                                y = d.y - quad.point.y,
                                l = Math.sqrt(x * x + y * y),
                                r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
                            if (l < r) {
                                l = (l - r) / l * alpha;
                                d.x -= x *= l;
                                d.y -= y *= l;
                                quad.point.x += x;
                                quad.point.y += y;
                            }
                        }
                        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                    });
                };
            }

            // Custom gravity to favor a non-square aspect ratio.
            function gravity(alpha) {
                var cx = width / 2,
                    cy = height / 2,
                    ax = alpha / 4,
                    ay = alpha;
                return function(d) {
                    d.x += (cx - d.x) * ax;
                    d.y += (cy - d.y) * ay;
                };
            }

            colorChange();
        });
    } //End JSON

    function seperateData() {
        svg.selectAll("circle").each(function (d, i) {
            switch (d.bouquetType) {
                case "Card Bundle":
                    d3.select(this)
                        .transition()
                        .duration(550)
                        .styleTween("color", function() { return d3.interpolate("red", "blue"); })
                        .attr("cx", 100)
                        .attr("cy", 560)
                        .delay(function () {
                            return i * 100;
                        });
                    break;
                //case "Lifestyle":
                //    d3.select(this).transition()
                //    .styleTween("color", function () { return d3.interpolate("red", "blue"); })
                //    .attr("cx", 600)
                //    .attr("cy", 560)
                //    .duration(750);
                //    break;
                //case "Health":
                //    d3.select(this).transition()
                //    .styleTween("color", function () { return d3.interpolate("red", "blue"); })
                //    .attr("cx", 600)
                //    .attr("cy", 560)
                //    .duration(750);
                //    break;
                //case "Automotive":
                //    d3.select(this).transition()
                //    .styleTween("color", function () { return d3.interpolate("red", "blue"); })
                //    .attr("cx", 600)
                //    .attr("cy", 560)
                //    .duration(750);
                //    break;
                //default:
                //    d3.select(this).transition()
                //    .styleTween("color", function () { return d3.interpolate("blue", "green"); })
                //    .attr("cx", 200)
                //    .attr("cy", 460)
                //    .duration(750);
                //    break;
            }
        });
    }
});