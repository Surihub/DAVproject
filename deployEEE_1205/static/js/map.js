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
    var colorScale = d3.scaleSequential(d3.interpolateRdYlGn)
        .domain(populationExtent);
        console.log('color');
        // console.log(colorScale);

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


    // 툴팁을 생성하고 초기 투명도를 설정합니다.
    const tooltip = d3.select('.canvas').append('div')
      .attr('class', 'tooltip')
      .style('opacity', '0')
      .style('width', '200px');
      

    // 마우스 오버 이벤트 처리 함수입니다.
    function mouseover(event, d) {
        tooltip
        .style('opacity', '1')
        .html(d.country + d.sdgIndexScore)
        .style('left', (d3.pointer(event)[0] + 0) + 'px') // 툴팁의 위치를 설정
        .style('top', (d3.pointer(event)[1] + 0) + 'px'); // d3.pointer(event) 이벤트가 일어난 위치 정보를 받아올 수 있음
    }

    // 마우스 아웃 이벤트 처리 함수입니다.
    function mouseout(event) {
      tooltip
        .style('opacity', '0')
        .style('left', '0px') // 다른 위치로 멀리 보내놓지 않으면 보이진 않지만 툴팁이 존재하여 툴팁 아래 있는 데이터 선택이 불가함.
        .style('top', '0px');
    }

  
  }
