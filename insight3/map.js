function plotCountryData(countryCode) {
    d3.csv('backdated SDG Index.csv').then(function(data) {
        // Filter data for the selected country
        console.log('성공!!');
        var countryData = data.filter(function(d) {
            return d['Country Code ISO3'] === countryCode; // Adjust the property name as per your CSV
        });
        updateScatterPlot(countryData, 'population', 'SDG Index Score');
        // index1, 2 input으로 받도록 추가
    });
}

function updateScatterPlot(data, index1, index2) {
    // Clear existing SVG content
    d3.select("svg").selectAll("*").remove();

    // Set up SVG dimensions
    var svgWidth = 800, svgHeight = 600;
    var margin = { top: 20, right: 20, bottom: 60, left: 60 };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Create scaling functions
    var x = d3.scaleLinear()
        .domain([d3.min(data, d => +d[index1]), d3.max(data, d => +d[index1])])
        .range([0, width]);

    var y = d3.scaleLinear()
        .domain([d3.min(data, d => +d[index2]), d3.max(data, d => +d[index2])])
        .range([height, 0]);

    // Append 'g' element to the SVG
    var g = d3.select("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // X and Y axes
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .call(d3.axisLeft(y));

    // Bind data to circles
    var circles = g.selectAll(".dot")
        .data(data, function(d) { return d.id || d[index1] + d[index2]; });

    // Enter + update selection
    circles.enter().append("circle")
        .attr("class", "dot")
        .attr("cx", svgWidth / 2) // Start new circles from the center
        .attr("cy", svgHeight / 2)
        .attr("r", 0) // Start with radius 0
        .merge(circles) // Merge enter and update selections
        .transition() // Apply transition
        .duration(500)
        .attr("cx", d => x(d[index1]))
        .attr("cy", d => y(d[index2]))
        .attr("r", 5);

    // Exit selection
    circles.exit()
        .transition()
        .duration(500)
        .attr("cx", svgWidth / 2) // End at the center
        .attr("cy", svgHeight / 2)
        .attr("r", 0) // Shrink to radius 0
        .remove();
    // Axis labels
    g.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text(index1);

    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(index2);
}


