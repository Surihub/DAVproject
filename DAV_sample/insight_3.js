// Load the data
d3.csv('owid_10.csv').then(function(data) {
    // Populate dropdown menus
    populateDropdowns();

    // Initial plot
    updateScatterPlot(data, 'gdp', 'co2');  // Default indices for initial plot

    // Event listeners for dropdown changes
    d3.select('#index1').on('change', function() {
        updatePlot(data);
    });
    d3.select('#index2').on('change', function() {
        updatePlot(data);
    });
});

function populateDropdowns() {
    const options = ['year', 'eduyear', 'gdp', 'literacy', 'energy', 'co2', 'gas', 'coal', 'oil'];
    options.forEach(function(option) {
        d3.select('#index1').append('option').text(option).attr('value', option);
        d3.select('#index2').append('option').text(option).attr('value', option);
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

    // Create a scaling function for the X axis
    var x = d3.scaleLinear()
        .domain([d3.min(data, d => +d[index1]), d3.max(data, d => +d[index1])])
        .range([0, width]);

    // Create a scaling function for the Y axis
    var y = d3.scaleLinear()
        .domain([d3.min(data, d => +d[index2]), d3.max(data, d => +d[index2])])
        .range([height, 0]);

    // Append a 'g' element to the SVG and transform it to leave margins for the axes
    var g = d3.select("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // X axis
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Y axis
    g.append("g")
        .call(d3.axisLeft(y));

    // Plotting data points
    g.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", function(d) { return x(d[index1]); })
        .attr("cy", function(d) { return y(d[index2]); })
        .attr("r", 5);

    // Add axis labels
    g.append("text")             
        .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
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


function updatePlot(data) {
    var index1 = d3.select('#index1').node().value;
    var index2 = d3.select('#index2').node().value;
    updateScatterPlot(data, index1, index2);
}
