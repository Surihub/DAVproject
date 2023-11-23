// scatterplot.js

// D3.js 라이브러리를 CDN에서 불러옴
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// 캔버스의 너비와 높이, 여백 설정
const width = 500;
const height = 500;
const marginTop = 30;
const marginRight = 30;
const marginBottom = 30;
const marginLeft = 80;

// D3의 컬러 스케일 설정
const color = d3.scaleOrdinal(d3.schemeTableau10);


// 이 부분은 사용자가 정의해야 함
const selectedCountries = ['South Korea', 'Japan', 'Qatar', 'United States', 'China']; 


// 툴팁 생성 및 초기 투명도 설정
const tooltip = d3.select('.canvas').append('div')
                .attr('class', 'tooltip')
                .style('opacity', '0');


// 드롭다운 요소 선택
var xSelect = d3.select('#x-axis-select');
var ySelect = d3.select('#y-axis-select');
console.log(xSelect)

const data = await d3.csv("owid_10.csv");

var filteredData = data.filter(d => selectedCountries.includes(d.country));


// 초기 x축과 y축 지표 설정
var ind_x = xSelect.node().value;
var ind_y = ySelect.node().value;

// 드롭다운 이벤트 리스너 설정
xSelect.on('change', updateChart);
ySelect.on('change', updateChart);
console.log(ind_y)


// 기존 코드 ...
let x, y, svg, gx, gy;

// 차트 업데이트 함수
function updateChart() {
  // 선택된 x축과 y축 지표 업데이트
  ind_x = xSelect.node().value;
  ind_y = ySelect.node().value;

  // 새로운 데이터 필터링
  filteredData = data.filter(d => selectedCountries.includes(d.country));

  // 스케일 다시 설정
  x.domain([d3.min(filteredData, d => +d[ind_x]), d3.max(filteredData, d => +d[ind_x])]);
  y.domain([d3.min(filteredData, d => +d[ind_y]), d3.max(filteredData, d => +d[ind_y])]);

  // 데이터 바인딩 및 업데이트
  var circles = svg.selectAll("circle")
    .data(filteredData);

  // 새로운 데이터에 대한 원 추가
  circles.enter().append("circle")
    .attr("cx", d => x(+d[ind_x]))
    .attr("cy", d => y(+d[ind_y]))
    .attr("r", 5)  // 초기 반지름 값 설정
    .attr("fill", d => color(d.country));

  // 기존 원의 데이터 업데이트
  circles.transition()
    .duration(750)
    .attr("cx", d => x(+d[ind_x]))
    .attr("cy", d => y(+d[ind_y]))
    .attr("r", d => d.gdp/2000);  // 원의 반지름 업데이트 (GDP에 비례하여)

  // 더 이상 필요 없는 원 제거
  circles.exit().remove();

  // x축과 y축 업데이트
  gx.transition().duration(750).call(d3.axisBottom(x));
  gy.transition().duration(750).call(d3.axisLeft(y));
}




// 데이터 로드를 위한 비동기 함수
(async function() {
  // CSV 파일에서 데이터 로드
  const data = await d3.csv("owid_10.csv");
  const filteredData = data.filter(d => selectedCountries.includes(d.country));

  // x축과 y축 스케일 설정
  const x = d3.scaleLinear()
    .domain([d3.min(filteredData, d => +d[ind_x]), d3.max(filteredData, d => +d[ind_x])])
    .range([marginLeft, width - marginRight]);

  const y = d3.scaleLinear()
    .domain([d3.min(filteredData, d => +d[ind_y]), d3.max(filteredData, d => +d[ind_y])])
    .range([height - marginBottom, marginTop]);

  // SVG 캔버스 생성
  const canvas = d3.select(".canvas");
  const svg = canvas.append('svg')
    .attr('height', height)
    .attr('width', width);

  // 데이터 포인트를 나타내는 원 생성
  const circles = svg.selectAll("circle")
    .data(filteredData)
    .join('circle')
      .attr('cx', d => x(+d[ind_x]))
      .attr('cy', d => y(+d[ind_y]))
      .attr('r', 5)
      .attr('fill', d => color(d.country))
      .on('mouseover', mouseover)
      .on('mouseout', mouseout);

  // x축과 y축 생성
  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);

  // x축과 y축 SVG 캔버스에 추가
  const gx = svg.append('g')
    .attr('transform', `translate(0, ${height - marginBottom})`)
    .call(xAxis);

  const gy = svg.append('g')
    .attr('transform', `translate(${marginLeft}, 0)`)
    .call(yAxis);

  // 좌표 변환 함수
  function translate(x, y) {
    return 'translate(' + x + ', ' + y + ')';
  }
// 마우스 오버 이벤트 처리 함수
function mouseover(event, d) {
  // 현재 마우스 오버된 점의 크기와 색상 변경
  d3.select(this)
    .transition()
    .duration(150)
    .attr('r', 5)
    .attr('fill', '#ff5722');  // 색상을 변경 (예: 빨간색)

  // 다른 모든 점을 회색으로 변경
  circles.filter((_, i, nodes) => nodes[i] !== this)
    .transition()
    .duration(150)
    .attr('fill', '#ccc');

  // 툴팁 표시
  tooltip
    .style('opacity', '0.8')
    .html(ind_x+':'+ d[ind_x]
    + '<br/>' + ind_y + ':' + d[ind_y]
    + '<br/>' + "country" + ':' + d.country)
    .style('left', (event.x + 10) + 'px')
    .style('top', (event.y - 80) + 'px');
}


// 마우스 아웃 이벤트 처리 함수
function mouseout() {
  // 현재 마우스 아웃된 점의 크기와 색상을 원래대로 복원
  d3.select(this)
    .transition()
    .duration(150)
    // .attr('r', 5)
    .attr('fill', d => color(d.country));  // 원래의 색상으로 복원

  // 다른 모든 점의 색상을 원래대로 복원
  circles.filter((_, i, nodes) => nodes[i] !== this)
    .transition()
    .duration(150)
    .attr('fill', d => color(d.country));

  // 툴팁 숨기기
  tooltip
    .style('opacity', '0')
    .style('left', '0px')
    .style('top', '0px');
}


  
})();
