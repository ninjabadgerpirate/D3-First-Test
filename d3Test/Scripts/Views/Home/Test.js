define(function (require) {
    var d3 = require('d3');

    var diameter = 960;

    var svg = d3.select("#DataVisualization").append("svg")
        .attr("width", diameter)
        .attr("height", diameter);

    svg.append("circle") // attach a circle
        .attr("cx", 200) // position the x-centre
        .attr("cy", 100) // position the y-centre
        .attr("r", 50) // set the radius
        .style("opacity", .6)
        .style("fill", "blue") // set the fill colour 
        .style("fill-opacity", .4) // set the fill opacity
        .style("stroke", "red")
        .style("stroke-opacity", .8) // set the stroke opacity
        .style("stroke-dasharray", ("10,3")); // make the stroke dashed

    svg.append("line")                 // attach a line
        .style("stroke", "black")         // colour the line
        .style("stroke-width", 20)        // adjust line width
        .style("stroke-linecap", "butt")  // stroke-linecap type
        .attr("x1", 200)     // x position of the first end of the line
        .attr("y1", 350)      // y position of the first end of the line
        .attr("x2", 300)     // x position of the second end of the line
        .attr("y2", 350);     // y position of the second end of the line

    svg.append("line")                  // attach a line
        .style("stroke", "black")          // colour the line
        .style("stroke-width", 20)         // adjust line width
        .style("stroke-linecap", "round")  // stroke-linecap type
        .attr("x1", 200)     // x position of the first end of the line
        .attr("y1", 450)      // y position of the first end of the line
        .attr("x2", 300)     // x position of the second end of the line
        .attr("y2", 450);     // y position of the second end of the line

    svg.append("line")                   // attach a line
        .style("stroke", "black")           // colour the line
        .style("stroke-width", 20)          // adjust line width
        .style("stroke-linecap", "square")  // stroke-linecap type
        .attr("x1", 200)     // x position of the first end of the line
        .attr("y1", 550)      // y position of the first end of the line
        .attr("x2", 300)     // x position of the second end of the line
        .attr("y2", 550);     // y position of the second end of the line

    svg.append("polyline")       // attach a polyline
        .style("stroke", "black")   // colour the line
        .style("fill", "none")      // remove any fill colour
     .style("stroke-width", 20)  // colour the line
     .style("stroke-linejoin", "round")  // shape the line join
        .attr("points", "300,50, 400,150, 500,50");  // x,y points 

    svg.append("text")            // append text
        .style("fill", "black")      // make the text black
        .style("writing-mode", "tb") // set the writing mode
        .style("glyph-orientation-vertical", 0)
        .attr("x", 200)         // set x position of left side of text
        .attr("y", 25)          // set y position of bottom of text
        .text("Hello World");   // define the text to display
});