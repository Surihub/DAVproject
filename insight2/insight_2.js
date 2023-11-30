// script.js
// D3.js를 사용하여 산점도 그리기
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


// 캔버스의 너비와 높이, 여백 설정
const width = 600;
const height = 500;
const marginTop = 30;
const marginRight = 30;
const marginBottom = 30;
const marginLeft = 30;


const total_data = await d3.csv("econ_inequality_SDGs_231130.csv", function(d) {
    return {
        country: d.Country_Name,
        year: +d.year,
        giniIndex: +d.gini_index,
        sdgIndexScore: +d.SDG_Index_Score,
        population: +d.population,
        region: d.Region,
        incomeGroup: d.IncomeGroup,
        yearAlpha: +d.year_alpha, 
        class: d.class2
    };
});

const regressionData = await d3.json("regression_results.json");
//console.log(regressionData)

const x = d3.scaleLinear()
            .domain([
              d3.min(total_data, d => d.giniIndex),
              d3.max(total_data, d => d.giniIndex)
            ])
            .range([marginLeft, width - marginRight])      
          
const y = d3.scaleLinear()
          .domain([
            d3.min(total_data, d => d.sdgIndexScore),
            d3.max(total_data, d => d.sdgIndexScore)
          ])
          .range([height-marginBottom, marginTop])

const canvas = d3.select(".canvas")
const svg = canvas.append('svg')
                  .attr('height', height)
                  .attr('width', width);

let currentYear = 2000;
const grouped = ["Developed country", "developing country", "underdeveloped country"];

let years = [];
for (let year = 2000; year <= 2022; year+=3) {
    years.push(year);
}

// D3의 컬러 스케일 설정
//const color = d3.scaleOrdinal(d3.schemeTableau10);
const colorScale = d3.scaleOrdinal()
.domain(grouped)
.range(d3.schemeCategory10);  





// noUiSlider 슬라이더 구현
function createSlider() {
    const sliderElement = document.getElementById('time-slider');

    noUiSlider.create(sliderElement, {
        start: 2000,
        connect: true,
        range: {
            'min': 2000,
            'max': 2022
        },
        step:1,
        format: {
          to: function(value) {
            return value.toFixed(0);
          },
          from: function(value) {
            return Number(value);
          }
        },
        pips: {
            mode: 'values',
            stepped: true,
            values: years, // 연도를 여기에 추가
            density: 5
        }
    });

    sliderElement.noUiSlider.on('update', function (values, handle) {
        currentYear = Number(values[handle]);
        updateChart(currentYear);
    });
}


//축 세팅
const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y);
    
const gx = svg.append('g')
                .attr('transform', translate(0, height-marginBottom))
               .call(xAxis);
    
const gy = svg.append('g')
                .attr('transform', translate(marginLeft, 0))
                .call(yAxis);
    
function translate(x, y) {
      return 'translate(' + x + ', ' + y + ')';
    }


// 범례의 위치와 크기 설정
const legendX = width - 150;
const legendY = 20;
const legendRectSize = 18;
const legendSpacing = 4;

// 범례 요소 생성
const legend = svg.selectAll('.legend')
    .data(grouped)
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



svg.append('text')
   .attr('class', 'x-axis-label')  // CSS 클래스 추가 (스타일링 용)
   .attr('x', width / 2)  // 가로 가운데 정렬
   .attr('y', height + 20)  // X 축 아래에 위치
   .attr('text-anchor', 'middle')  // 텍스트 가운데 정렬
   .text('Gini Index');  // X 축 이름 텍스트

svg.append('text')
   .attr('class', 'y-axis-label')  // CSS 클래스 추가 (스타일링 용)
   .attr('x', -height / 2)  // 세로 가운데 정렬 및 90도 회전
   .attr('y', -5)  // Y 축 왼쪽에 위치
   .attr('text-anchor', 'middle')  // 텍스트 가운데 정렬
   .attr('transform', 'rotate(-90)')  // 90도 회전
   .text('SDG Index Score');  // Y 축 이름 텍스트

const tooltip = d3.select('.canvas').append('div')
                .attr('class', 'tooltip')
                .style('opacity', '0')
                .style('position', 'absolute')  // 절대 위치 설정
                .style('pointer-events', 'none');  // 툴팁은 마우스 이벤트를 무시

const tooltipLine = d3.select('.canvas').append('div')
                .attr('class', 'tooltipLine')
                .style('opacity', '0')
                .style('position', 'absolute')  // 절대 위치 설정
                .style('pointer-events', 'none');  // 툴팁은 마우스 이벤트를 무시



function updateChart(currentYear) {
    svg.selectAll("line").remove();
    svg.selectAll(".year-title").remove();
    svg.selectAll(".slope-text").remove();

    const year_text = svg.append('text')
        .attr('class', 'year-title')  // CSS 클래스 추가 (스타일링 용)
        .attr('x', width / 2)  // 가로 가운데 정렬
        .attr('y', height - 480)  // X 축 아래에 위치
        .attr('text-anchor', 'middle')  // 텍스트 가운데 정렬
        .text('year - '+currentYear);  // X 축 이름 텍스트


    const filteredData = total_data.filter(d => d.year==currentYear)
    const filteredData2 = regressionData[currentYear]

    const circles = svg.selectAll("circle")
    .data(filteredData)
    .join('circle')
        .attr('cx', d => x(d.giniIndex))
        .attr('cy', d => y(d.sdgIndexScore))
        .attr('r', d=> (Math.log(d.population)-6)*0.6-1)
        .attr('fill', d => colorScale(d.class))
        .on('mouseover', mouseover)
        .on('mouseout', mouseout);
    
    console.log(regressionData)

    // 회귀선 데이터를 배열로 변환
    let regressionLinesData = Object.entries(filteredData2).map(([grouped, {slope, intercept}]) => {
        return {
            grouped: grouped,
            slope: slope,
            intercept: intercept
        };
    });
    let isTooltipFixed = false;
    let selectedLine = null; 


    // 회귀선 추가 (각 소득 수준 그룹별로)
    grouped.forEach(income_group => {
        // 현재 그룹에 대한 데이터 필터링
        const groupData = regressionLinesData.find(d => d.grouped === income_group);

        const y1 = y(groupData.slope * x.domain()[0] +groupData.intercept);
        const y2 = y(groupData.slope * x.domain()[1] + groupData.intercept);
        
        const line = svg.append('line')
        .attr('x1', x(x.domain()[0]))
        .attr('y1', y1)
        .attr('x2', x(x.domain()[1]))
        .attr('y2', y2)
        .attr('stroke', colorScale(income_group))
        .attr('stroke-width', 3)  
        .on('click', (event) => clickLine(event, groupData))  
        .on('mouseover', (event) => mouseoverLine(event, groupData))
        .on('mouseout', (event) => mouseoutLine(event,))
        .on('click', (event) => {
            if (selectedLine) {
                // 이전에 선택된 선이 있으면 두께를 원래대로 복원
                selectedLine.attr('stroke-width', 3);
            }

            if (selectedLine !== line) {
                // 새로운 선을 클릭하면 두께를 두껍게 설정
                line.attr('stroke-width', 6);
                selectedLine = line;
                showTooltip(event, groupData); // 툴팁 표시
                isTooltipFixed = true;
            } else {
                // 같은 선을 다시 클릭하면 선택 해제
                selectedLine = null;
                hideTooltip();
                isTooltipFixed = false;
            }})

            const canvasRect = svg.node().getBoundingClientRect();
            const xPosition = canvasRect.left + x(x.domain()[1]);
            const yPosition = canvasRect.top + y(groupData.slope * x.domain()[1] + groupData.intercept);
        

            //기울기 표시
            const slope_text = svg.append('text')
                .attr('class', 'slope-text')  // CSS 클래스 추가 (스타일링 용)
                .attr('x', xPosition-360)  // 가로 가운데 정렬
                .attr('y', yPosition-240)  // X 축 아래에 위치
                .attr('stroke', colorScale(income_group))
                .attr('text-anchor', 'middle')  // 텍스트 가운데 정렬
                .text(groupData.slope);  // X 축 이름 텍스트

    });







    // 산점도 마우스오버
    function mouseover(event, d) {
        const tooltipWidth = tooltip.node().offsetWidth;
        const tooltipHeight = tooltip.node().offsetHeight;
        const xPosition = d3.pointer(event)[0] + canvas.node().getBoundingClientRect().left;  // 캔버스의 왼쪽 위치 추가
        const yPosition = d3.pointer(event)[1] + canvas.node().getBoundingClientRect().top;  // 캔버스의 상단 위치 추가
        
        tooltip
            .style('opacity', '1')
            .html('Country: ' + d.country + '<br/> \
                    Gini index: ' + d.giniIndex + '<br/> \
                    SDG index score: ' + d.sdgIndexScore + '<br/> \
                    Group: ' + d.class + '<br/> \
                    Population: ' + (d.population/1000000).toFixed(1)+'m')
            .style('left', (xPosition - tooltipWidth / 2 + 130) + 'px')  // 툴팁의 가로 중앙 정렬
            .style('top', (yPosition - tooltipHeight +30) + 'px');  // 마우스 위로 조금 올림
        }
    // 산점도 마우스아웃
    function mouseout(event) {
    tooltip
        .style('opacity', '0')
        .style('left', '0px')
        .style('top', '0px')
    }

    // 회귀선 마우스오버
    function mouseoverLine(event, groupData) {
        if (!isTooltipFixed) { // 툴팁이 고정되지 않은 경우에만 표시
            showTooltip(event, groupData);
        }
    }
    // 회귀선 마우스아웃
    function mouseoutLine(event) {
        if (!isTooltipFixed) { // 툴팁이 고정되지 않은 경우에만 숨김
            hideTooltip();
        }
    }

    // 회귀선 클릭 이벤트 핸들러
    function clickLine(event, groupData) {
        if (!isTooltipFixed) {
            showTooltip(event, groupData); // 툴팁 표시 및 고정
            isTooltipFixed = true; // 툴팁 고정 설정
        } else {
            hideTooltip(); // 툴팁 숨김 및 고정 해제
            isTooltipFixed = false; // 툴팁 고정 해제
        }
    }

    // 회귀선 툴팁을 표시하는 함수
    function showTooltip(event, groupData) {
        const canvasRect = svg.node().getBoundingClientRect();
        const xPosition = canvasRect.left + x(x.domain()[1]);
        const yPosition = canvasRect.top + y(groupData.slope * x.domain()[1] + groupData.intercept);

        tooltipLine
            .style('opacity', '1')
            .html('Group: ' + groupData.grouped + '<br/> \
                    Slope: ' + groupData.slope.toFixed(2) + '<br/> \
                    Intercept: ' + groupData.intercept.toFixed(2))
            .style('left', xPosition +20 + 'px')
            .style('top', yPosition + 'px');
    }

    // 회귀선 툴팁을 숨기는 함수
    function hideTooltip() {
        tooltipLine
            .style('opacity', '0')
            .style('left', '0px')
            .style('top', '0px');
    }


}





createSlider();
updateChart(currentYear);