const tooltip = d3.select('.canvas').append('div')
                .attr('class', 'tooltip')
                .style('opacity', '0')
                .style('position', 'absolute')  // 절대 위치 설정
                .style('pointer-events', 'none');  // 툴팁은 마우스 이벤트를 무시

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

// function updateScatterPlot(data, index1, index2, year) {
function updateScatterPlot(data, index1, index2, year, selectedCountry) {
    // total_data에서 선택된 연도의 데이터 필터링
    var filteredData = data.filter(d => d.year === year);    
    // Clear existing SVG content
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

    var circles = g.selectAll(".dot")
        .data(data, function(d) { return d.id || d[index1] + d[index2]; });


    // 인구수에 따른 색상 스케일 설정
    //http://using-d3js.com/04_05_sequential_scales.html
    var populationExtent = d3.extent(filteredData, d => d.sdgIndexScore); // 인구수의 최소값과 최대값 계산
    var colorScale = d3.scaleSequential(d3.interpolateRainbow)
        .domain(populationExtent);
        console.log('color');
        console.log(colorScale);

    // 모든 데이터를 사용하여 점들을 다시 그립니다.
    g.selectAll(".dot")
        .data(filteredData)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d[index1]))
        .attr("cy", d => y(d[index2]))
        .attr("r", d => d.ISO3 === selectedCountry ? 10 : 5) // 선택된 국가는 더 큰 점
        .attr("fill", d => d.ISO3 === selectedCountry ? "red" : colorScale(d.sdgIndexScore)) // 선택된 국가는 빨간색, 그 외에는 색상 스케일 적용
        .attr("stroke", d => d.ISO3 === selectedCountry ? "black" : "none") // 선택된 국가에만 테두리 적용
        .attr("stroke-width", 2);

    // plotCountryData 함수 내부 코드는 동일하게 유지합니다.

            console.log(selectedCountry);

        // let selectedCircle = null;
        // let selectedCircle_name = null;


        
        // if (selectedCircle_name !== currentCircle_name){
        //     // 새로운 원을 클릭하면 크기를 증가시키고 빨간색으로 표시
        //     currentCircle.attr('r', d => 10);
        //     currentCircle.attr('fill', 'red')
        //     selectedCircle = currentCircle;
        //     showTooltip(event, d);
        //     isTooltipFixed = true;
        // } else {
        //     // 같은 원을 다시 클릭하면 선택 해제
        //     selectedCircle = null;
        //     hideTooltip();
        //     isTooltipFixed = false;
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
