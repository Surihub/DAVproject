// D3.js를 사용하기 위해 라이브러리를 가져옵니다.
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// 데이터를 불러옵니다.
d3.csv("mergedata2.csv").then(data => {

  // 드롭다운 메뉴에 고유한 문항 추가
  const Indicators = d3.select("#Indicator");
  const uniqueIndicators = [...new Set(data.map(d => d.Indicators))];
  const Nations = d3.select("#nations");
 
  Indicators
    .selectAll('option')
    .data(uniqueIndicators)
    .join('option')
    .attr("value", d => d)
    .text(d => d);
    
  updateVisualization();

  function updateVisualization() {

    d3.select(".canvas").selectAll("*").remove();

    // Set up SVG dimensions
    var svgWidth = 650, svgHeight = 700;
    var margin = { top: 20, right: 20, bottom: 60, left: 60 };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
    
    const Indicator = Indicators.node().value;  

      
    // 선택한 문항에 따라 데이터 필터링
    const filteredData = data.filter(d =>
      d.Indicators.toUpperCase() === Indicator.toUpperCase()
    );

    const uniqueCountries = [...new Set(filteredData.map(d => d.GeoAreaName))];
        
    Nations
    .selectAll("option")
    .data(uniqueCountries)
    .join('option')
    .attr("value", d => d)
    .text(d => d);

    const Nation = Nations.node().value;


    // 스케일과 선 생성기 설정
    const xScale = d3.scaleLinear()
      .domain([d3.min(filteredData, d => d.TimePeriod), d3.max(filteredData, d => d.TimePeriod)])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([d3.min(filteredData, d => d.MeanValue), d3.max(filteredData, d => d.MeanValue)])
      .range([height, 0]);
    
    const canvas = d3.select(".canvas");
    const svg = canvas.append('svg')
      .attr('height', svgWidth)
      .attr('width', svgHeight);
    
      
    const line = d3.line()
      .x(d => xScale(d.TimePeriod))
      .y(d => yScale(d.MeanValue));  

    const defaultCountryData = filteredData.filter(d => d.GeoAreaName === "ALL");
  
    const newdata1 = defaultCountryData.filter(d => d.class === 'underdeveloped country');  
    const newdata2 = defaultCountryData.filter(d => d.class === 'developing country');  
    const newdata3 = defaultCountryData.filter(d => d.class === 'Developed country'); 
    const newdata4 = filteredData.filter(d => d.GeoAreaName === Nation ||d.GeoAreaName ==='ALL');

    // 데이터에서 고유한 클래스 추출
    const uniqueClasses = [...new Set(data.map(d => d.class))];

    // 색상 스케일 정의 (클래스별로 다른 색상 부여)
    const colorScale = d3.scaleOrdinal()
      .domain(uniqueClasses)
      .range(d3.schemeCategory10);  

  
    // 선 그래프 그리기
    svg.append("path")
      .data([newdata1])
      .join("path")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke",  "blue")

    // 선 그래프 그리기
    svg.append("path")
      .data([newdata2])
      .join("path")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke",  "orange")

    // 선 그래프 그리기
    svg.append("path")
      .data([newdata3])
      .join("path")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke",  "green")

    svg.selectAll("circle")
      .data(newdata4)
      .join('circle')
      .attr('cx', d => xScale(d.TimePeriod))
      .attr('cy', d => yScale(d.MeanValue))
      .attr('r', d => 3)
      .attr('fill', d => colorScale(d.class))
      .on('mouseover', mouseover) // 마우스 오버 이벤트 처리 함수를 연결합니다.
      .on('mouseout', mouseout);   // 마우스 아웃 이벤트 처리 함수를 연결합니다.
    
    // x 축과 y 축을 생성합니다.
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);  

    // x 축과 y 축을 SVG에 추가하고 위치를 설정합니다.
    const gx = svg.append('g')
      .attr('transform', translate(0, height - margin.bottom+59)) // 위치 설정
      .call(xAxis);

    const gy = svg.append('g')
      .attr('transform', translate(margin.left-59, 0))
      .call(yAxis);

    // 좌표 이동을 위한 함수입니다.
    function translate(x, y) {
      return 'translate(' + x + ', ' + y + ')';
    }
    
    // 범례의 위치와 크기 설정
    const legendX = svgWidth - 40;
    const legendY = 20;
    const legendRectSize = 18;
    const legendSpacing = 4;
    
    // 범례 요소 생성
    const legend = svg.selectAll('.legend')
      .data(uniqueClasses)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(${legendX},${legendY + i * (legendRectSize + legendSpacing)})`);
    
    // 범례 색상 사각형
    legend.append('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .style('fill', d => colorScale(d));
    
    // 범례 텍스트
    legend.append('text')
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .text(d => d);  

    // 툴팁을 생성하고 초기 투명도를 설정합니다.
    const tooltip = d3.select('.canvas').append('div')
      .attr('class', 'tooltip')
      .style('opacity', '0')
      .style('width', '250px');
      

    // 마우스 오버 이벤트 처리 함수입니다.
    function mouseover(event, d) {
    tooltip
      .style('opacity', '1')
      .html('Year: ' + d.TimePeriod + '<br/> \
              Country Name: ' + d.GeoAreaName + '<br/> \
              Value: ' + d.MeanValue)
      .style('left', (d3.pointer(event)[0] + 700) + 'px') // 툴팁의 위치를 설정
      .style('top', (d3.pointer(event)[1] + 50) + 'px'); // d3.pointer(event) 이벤트가 일어난 위치 정보를 받아올 수 있음
    }

    // 마우스 아웃 이벤트 처리 함수입니다.
    function mouseout(event) {
      tooltip
        .style('opacity', '0')
        .style('left', '0px') // 다른 위치로 멀리 보내놓지 않으면 보이진 않지만 툴팁이 존재하여 툴팁 아래 있는 데이터 선택이 불가함.
        .style('top', '0px');
    }

  
  }
  // 드롭다운 값이 변경될 때 updateVisualization 함수 호출

  Indicators.on('change', updateVisualization);
  Nations.on('change', updateVisualization);

});
