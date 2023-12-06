console.log("insight_3.js loaded")

// D3.js를 사용하기 위해 라이브러리를 가져옵니다.
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// 캔버스의 너비와 높이, 여백 설정
const width = 600;
const height = 500;
const marginTop = 30;
const marginRight = 30;
const marginBottom = 30;
const marginLeft = 30;
const gridSize = 50;



// 지표 데이터 새로 불러오기
const total_data = d3.csv("/static/data/SDR.csv", function(d) {
    return {
        ISO2: d['ISO2'],
        ISO3: d['ISO3'],
        country: d['country'],
        year: +d['year'],
        population: +d['population'],
        sdgIndexScore: +d['SDG Index Score'],
        goal4: +d['Goal 4 Score'],
        goal8: +d['Goal 8 Score'],
        goal12: +d['Goal 12 Score'],
        goal13: +d['Goal 13 Score'],
        region: d['Regions used for the SDR'],
        nrow: +d['nrow'],
        ncol: +d['ncol']

    };
}).then(function(total_data) {
    document.addEventListener('DOMContentLoaded', function() {
        updatePlot(total_data);
        populateDropdowns();
        plotCountryData(countryCode);
        updateScatterPlot(total_data, index1, index2, year, selectedCountry)
        var currentYear = 2010; // 초기 연도 설정

        var slider = d3
            .sliderHorizontal()
            .min(2000)
            .max(2022)
            .step(1)
            .width(500)
            .displayValue(false)
            .on('onchange', val => {
                currentYear = val;
                d3.select('#yearValue').text("연도: " + val);
                console.log("현재 연도!")
                console.log(currentYear);
                console.log("slider.js");
                var index1 = d3.select('#index1').node().value;
                var index2 = d3.select('#index2').node().value;
                updateScatterPlot(total_data,  index1, index2, currentYear);            });
            console.log(currentYear);
            
        d3.select('#yearSlider')
            .append('svg')
            .attr('width', 400)
            .attr('height', 100)
            .append('g')
            .call(slider);
        updatePlot(total_data);
    });
});






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

// 지표 데이터 새로 불러오기
const country_info = await d3.csv("/static/data/country_info.csv", function(d) {
    return {
        ISO2: d.ISO2,
        ISO3: d.ISO3,
        country: d.country,
        nrow: +d.nrow,
        ncol: +d.ncol,
        regions: d.regions
    };
});

function numberToColorScale(value, min, max) {
    const scale = d3.scaleSequential()
                    .domain([min, max])
                    .interpolator(d3.interpolateBlues);  // 파란색 그라데이션
    return scale(value);
}

country_info.forEach(function(country) {
    const btn = document.createElement("button");
    btn.innerHTML = country.ISO2;
    const regionColor = regionColors[country.regions];
    // btn.style.backgroundColor = regionColor || 'gray'; //지도 색 해당하는 부분
    btn.style.backgroundColor = numberToColorScale(country.population, 0, 100);  
    

    btn.style.gridRowStart = country.nrow;
    btn.style.gridColumnStart = country.ncol;
    btn.onclick = function() { plotCountryData(country.ISO3); };

    // 툴팁 요소 생성 및 초기 스타일 설정
    const tooltip = document.createElement("span");
    tooltip.className = "tooltip";
    tooltip.style.display = "none"; // 기본적으로 툴팁 숨김
    tooltip.innerHTML = "Country: " + country['country'] + "<br>Region: " + country.regions;
    btn.appendChild(tooltip);

    // 마우스 오버 이벤트
    btn.onmouseover = function() {
        tooltip.style.display = "block";
    };

    // 마우스 아웃 이벤트
    btn.onmouseout = function() {
        tooltip.style.display = "none";
    };

    document.getElementById("gridContainer").appendChild(btn);
});

// Event listeners for dropdown changes
d3.select('#index1').on('change', function() {
    updatePlot(total_data);
});

d3.select('#index2').on('change', function() {
    updatePlot(total_data);
});

populateDropdowns();



console.log(currentYear);
console.log("insight_3.js");
updatePlot(total_data);
// updateScatterPlot(total_data, 'goal4', 'goal13', currentYear);  // Default indices for initial plot

// year = 2022...
function populateDropdowns() {
    // const options = [population, sdgIndexScore]
    const options_x = ['goal4', 'goal8', 'goal12', 'goal13'];
    const options_y = ['goal12', 'goal13', 'goal4', 'goal8'];
    // const options = ['population','SDG Index Score','Goal 1 Score','Goal 2 Score','Goal 3 Score','Goal 4 Score','Goal 5 Score','Goal 6 Score','Goal 7 Score','Goal 8 Score','Goal 12 Score','Goal 13 Score'];
    options_x.forEach(function(option) {
        d3.select('#index1').append('option').text(option).attr('value', option);
    });
    options_y.forEach(function(option) {
        d3.select('#index2').append('option').text(option).attr('value', option);
    });
}

function plotCountryData(countryCode) {
    var index1 = d3.select('#index1').node().value;
    var index2 = d3.select('#index2').node().value;
    console.log(currentYear);
    updateScatterPlot(total_data, index1, index2, currentYear, countryCode);
};

function updatePlot(data) {
    
    var index1 = d3.select('#index1').node().value;
    var index2 = d3.select('#index2').node().value;
    updateScatterPlot(data,  index1, index2, currentYear);
}

///////////////////////////////////slider
console.log("slider.js loaded");

var currentYear = 2022;



///////////////////map

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
