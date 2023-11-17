// D3.js를 사용하기 위해 라이브러리를 가져옵니다.
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const width = 500;
const height = 500;

// 데이터를 불러옵니다.
d3.csv("mergedata.csv").then(data => {

  // 드롭다운 메뉴에 고유한 문항 추가
  const indicatorsDropdown = d3.select("#IndicatorsDropdown");
  const uniqueIndicators = [...new Set(data.map(d => d.Indicators))];

  indicatorsDropdown
    .selectAll('option')
    .data(uniqueIndicators)
    .join('option')
    .attr("value", d => d)
    .text(d => d);

  // SVG 요소 추가
  const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);  

  function updateVisualization() {

    const Indicators = indicatorsDropdown.node().value;

    // 선택한 문항에 따라 데이터 필터링
    const filteredData = data.filter(d =>
      d.Indicators.toUpperCase() === Indicators.toUpperCase()
    );

    // 드롭다운 메뉴 업데이트
    const nationDropdown = d3.select("#nationDropdown");

    // 국가 목록 생성
    const uniqueCountries = [...new Set(filteredData.map(d => d.GeoAreaName))];


    nationDropdown
    //   .append("select")
      .selectAll("option")
      .data(uniqueCountries)
      .join('option')
      .text(d => d);


    // 드롭다운 메뉴 변경 이벤트 처리
    nationDropdown
      .select("select")
      .on("change", function() {
        const selectedCountry = d3.select(this).property("value");
        // 선택된 국가에 대한 추가 동작 수행
        console.log("Selected Country:", selectedCountry);
      });

    // 스케일과 선 생성기 설정
    const xScale = d3.scaleLinear()
      .domain([d3.min(filteredData, d => d.TimePeriod), d3.max(filteredData, d => d.TimePeriod)])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([d3.min(filteredData, d => d.MeanValue), d3.max(filteredData, d => d.MeanValue)])
      .range([height, 0]);

    const line = d3.line()
      .x(d => xScale(d.TimePeriod))
      .y(d => yScale(d.MeanValue));
    
    svg.selectAll("path").remove();

    const colorScale = d3.scaleOrdinal(d3.schemeTableau10); // 색상 스케일  
    colorScale.domain(["underdeveloped country", "developing country", "Developed country"]);  

    const defaultCountry = "ALL"; // default 설정

    const defaultCountryData = filteredData.filter(d => d.GeoAreaName === defaultCountry);

    const newdata1 = defaultCountryData.filter(d => d.class === 'underdeveloped country');  
    const newdata2 = defaultCountryData.filter(d => d.class === 'developing country');  
    const newdata3 = defaultCountryData.filter(d => d.class === 'Developed country');  
  

    // 선 그래프 그리기
    svg.append("path")
      .data([newdata1])
      .join("path")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke",  "red")
      .on('mouseover', mouseover) // 마우스 오버 이벤트 처리 함수를 연결합니다.
      .on('mouseout', mouseout);   // 마우스 아웃 이벤트 처리 함수를 연결합니다.

    // 선 그래프 그리기
    svg.append("path")
      .data([newdata2])
      .join("path")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke",  "blue")
      .on('mouseover', mouseover) // 마우스 오버 이벤트 처리 함수를 연결합니다.
      .on('mouseout', mouseout);   // 마우스 아웃 이벤트 처리 함수를 연결합니다.;

    // 선 그래프 그리기
    svg.append("path")
      .data([newdata3])
      .join("path")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke",  "green")
      .on('mouseover', mouseover) // 마우스 오버 이벤트 처리 함수를 연결합니다.
      .on('mouseout', mouseout);   // 마우스 아웃 이벤트 처리 함수를 연결합니다.;

    // 툴팁을 생성하고 초기 투명도를 설정합니다.
    const tooltip = d3.select('.canvas').append('div')
      .attr('class', 'tooltip')
      .style('opacity', '0');

    // 마우스 오버 이벤트 처리 함수입니다.
    function mouseover(event, d) {
      tooltip
        .style('opacity', '1')
        .html('class: ' + d + '<br/> \
                nation: ALL')
        .style('left', (d3.pointer(event)[0] + 10) + 'px') // 툴팁의 위치를 설정
        .style('top', (d3.pointer(event)[1] + 40) + 'px'); // d3.pointer(event) 이벤트가 일어난 위치 정보를 받아올 수 있음
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

  indicatorsDropdown.on('change', updateVisualization);
});
