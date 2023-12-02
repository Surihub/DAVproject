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
const total_data = await d3.csv("SDR.csv", function(d) {
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
const country_info = await d3.csv("country_info.csv", function(d) {
    return {
        ISO2: d.ISO2,
        ISO3: d.ISO3,
        country: d.country,
        nrow: +d.nrow,
        ncol: +d.ncol,
        regions: d.regions
    };
});

country_info.forEach(function(country) {
    var btn = document.createElement("button");
    btn.innerHTML = country.ISO2;
    var regionColor = regionColors[country.regions];
    btn.style.backgroundColor = regionColor || 'gray';

    btn.style.gridRowStart = country.nrow;
    btn.style.gridColumnStart = country.ncol;
    btn.onclick = function() { plotCountryData(country.ISO3); };

    // 툴팁 요소 생성 및 초기 스타일 설정
    var tooltip = document.createElement("span");
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
updateScatterPlot(total_data, 'goal4', 'goal13', currentYear);  // Default indices for initial plot

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

    var countryData = total_data.filter(function(d) {
        return d['ISO3'] === countryCode;
    });
    var index1 = d3.select('#index1').node().value;
    var index2 = d3.select('#index2').node().value;
    var selectedCountry = countryCode || null;
    updateScatterPlot(countryData,  index1, index2, currentYear, countryCode);

    };

function updatePlot(data) {
    var index1 = d3.select('#index1').node().value;
    var index2 = d3.select('#index2').node().value;
    updateScatterPlot(data,  index1, index2, currentYear);
}

