
const tooltip = d3.select('.canvas').append('div')
                .attr('class', 'tooltip')
                .style('opacity', '0')
                .style('position', 'absolute')  // 절대 위치 설정
                .style('pointer-events', 'none');  // 툴팁은 마우스 이벤트를 무시


// function updateScatterPlot(data, index1, index2, year) {
function updateScatterPlot(data, index1, index2, year, selectedCountry) {
    // total_data에서 선택된 연도의 데이터 필터링
    var filteredData = data.filter(d => d.year === year);    // Clear existing SVG content
    d3.select("svg").selectAll("*").remove();

    // Set up SVG dimensions
    var svgWidth = 500, svgHeight = 400;
    var margin = { top: 20, right: 20, bottom: 60, left: 60 };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Create scaling functions
    var x = d3.scaleLinear()
        .domain([0, 100])
        .range([0, width]);

    var y = d3.scaleLinear()
        .domain([0, 100])
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

    // // 연도에 따른 색상 스케일 정의
    // var colorScale = d3.scaleLinear()
    //     .domain([d3.min(filteredData, d => d.year), d3.max(filteredData, d => d.year)]) // 데이터에서 최소, 최대 연도를 기준으로 설정
    //     .range(["red", "blue"]); // 연도가 작을 때는 연한 파란색, 크면 진한 파란색

    var circles = g.selectAll(".dot")
        .data(filteredData, function(d) { return d.id || d[index1] + d[index2]; });

    // // Enter + update selection
    // circles.enter().append("circle")
    //     .attr("class", "dot")
    //     .attr("cx", svgWidth / 2) // Start new circles from the center
    //     .attr("cy", svgHeight / 2)
    //     .attr("r", 0) // Start with radius 0
    //     .merge(circles) // Merge enter and update selections
    //     // .transition() // Apply transition
    //     // .duration(1000)
    //     .attr("cx", d => x(d[index1]))
    //     .attr("cy", d => y(d[index2]))
    //     .attr("r", 5)
    //     .attr("fill", d => colorScale(d.year)); // 색상 적용
        // 모든 데이터에 대한 점 그리기
        // 각 지역별로 색상을 정의합니다.
        var regionColors = {
            'E. Europe & C. Asia':'#748C70',
            'MENA':'#aac7a5',
            'Sub-Saharan Africa':'#87aa81',
            'LAC':'#628d5b',
            'OECD':'#4f634c',
            'East & South Asia':'#8ca887',
            'Oceania':'#658360',
            // 필요에 따라 더 추가할 수 있습니다.
        };


        g.selectAll(".dot")
            .data(filteredData)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => x(d[index1]))
            .attr("cy", d => y(d[index2]))
            .attr("r", d => d.ISO3 === selectedCountry ? 10 : 5) // 선택된 국가에 대해서만 큰 점
            .attr("fill", d => d.ISO3 === selectedCountry ? "red" : regionColors[d.region]); // 선택된 국가에 대해서만 다른 색상
            console.log("hihihi");
            console.log(selectedCountry);
    // // 선택된 국가가 있을 경우 해당 국가에 대한 점 크기 증가
    // if (selectedCountry) {
    //     console.log('gg');
    //     console.log(filteredData.length);
    //     g.selectAll(".dot")
    //         .data(filteredData)
    //         .enter().append("circle")
    //         .attr("class", "dot")
    //         .attr("cx", d => x(d[index1]))
    //         .attr("cy", d => y(d[index2]))
    //         .attr("r", d => d.ISO3 === selectedCountry ? 10 : 5) // 선택된 국가에 대해서만 큰 점
    //         .attr("fill", d => d.ISO3 === selectedCountry ? "red" : 'grey'); // 선택된 국가에 대해서만 다른 색상
    //         console.log(selectedCountry);
    //     } else{
    //         console.log(filteredData.length);
    //         g.selectAll(".dot")
    //         .data(filteredData)
    //         .enter().append("circle")
    //         .attr("class", "dot")
    //         .attr("cx", d => x(d[index1]))
    //         .attr("cy", d => y(d[index2]))
    //         .attr("r", 5) // 기본 점의 크기
    //         .attr("fill", d => regionColors[d.region]); // 기본 색상 적용
    //     }
    // if (selectedCountry) {
    //     g.selectAll(".dot")
    //         .data(filteredData)
    //         .enter().append("circle")
    //         .attr("class", "dot")
    //         .attr("cx", d => x(d[index1]))
    //         .attr("cy", d => y(d[index2]))
    //         .attr("r", 5) // 기본 점의 크기
    //         .attr("fill", d => regionColors[d.region]); // 기본 색상 적용
    //     g.selectAll(".selectedDot")
    //         .data(filteredData.filter(d => d.ISO3 === selectedCountry))
    //         .enter().append("circle")
    //         .attr("class", "selectedDot")
    //         .attr("cx", d => x(d[index1]))
    //         .attr("cy", d => y(d[index2]))
    //         .attr("r", 10) // 선택된 국가의 점 크기
    //         .attr("fill", "red"); // 선택된 국가의 점 색상
    // }

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


