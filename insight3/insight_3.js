var countriesData = [
    { "label": "USA", "row": 9, "column": 2 },
    { "label": "CAN", "row": 8, "column": 2 },
    { "label": "MEX", "row": 10, "column": 2 },
    { "label": "GTM", "row": 11, "column": 2 },
    { "label": "KOR", "row": 8, "column": 26 },
    { "label": "CHN", "row": 7, "column": 25 },
    { "label": "JPN", "row": 7, "column": 28 },
    { "label": "MNG", "row": 6, "column": 28 },
    { "label": "FIN", "row": 2, "column": 18 },
    { "label": "NZL", "row": 22, "column": 27 },

    // ... 업데이트 해야 함(약 200개국)
];


// Set the dimensions of the grid
var width = 1500,
height = 1000,
gridSize = 50;

// 국가별 데이터로 버튼 생성하고 'gridContainer'안에 넣기
countriesData.forEach(function(country) {
    var btn = document.createElement("button");
    btn.innerHTML = country.label;
    btn.style.backgroundColor = country.color;
    btn.style.gridRowStart = country.row;
    btn.style.gridColumnStart = country.column;
    btn.onclick = function() { plotCountryData(country.label); };
    document.getElementById("gridContainer").appendChild(btn);
});





// Load the data, 전체 국가 산점도 그리기
d3.csv('backdated SDG Index.csv').then(function(data) {
// d3.csv('SDR 2023 Data.csv').then(function(data) {
    // Populate dropdown menus
    populateDropdowns();

    // Initial plot
    updateScatterPlot(data, 'population', 'SDG Index Score');  // Default indices for initial plot

    // Event listeners for dropdown changes
    d3.select('#index1').on('change', function() {
        updatePlot(data);
    });
    d3.select('#index2').on('change', function() {
        updatePlot(data);
    });
});

// year = 2022...
function populateDropdowns() {
    const options = ['population','SDG Index Score','Goal 1 Score','Goal 2 Score','Goal 3 Score','Goal 4 Score','Goal 5 Score','Goal 6 Score','Goal 7 Score','Goal 8 Score','Goal 12 Score','Goal 13 Score'];
    options.forEach(function(option) {

        d3.select('#index1').append('option').text(option).attr('value', option);
        d3.select('#index2').append('option').text(option).attr('value', option);
    });
}

function plotCountryData(countryCode) {
    d3.csv('backdated SDG Index.csv').then(function(data) {
        // Filter data for the selected country
        var countryData = data.filter(function(d) {
            return d['Country Code ISO3'] === countryCode; // Adjust the property name as per your CSV
        });
        var index1 = d3.select('#index1').node().value;
        var index2 = d3.select('#index2').node().value;
        updateScatterPlot(countryData, index1, index2);
        // updateScatterPlot(countryData, 'population', 'SDG Index Score');
        // index1, 2 input으로 받도록 추가
    });
}

function updatePlot(data) {
    var index1 = d3.select('#index1').node().value;
    var index2 = d3.select('#index2').node().value;
    updateScatterPlot(data, index1, index2);
}

// 마우스 오버 이벤트 처리 함수
// function mouseover(event, d) {
//     // 현재 마우스 오버된 점의 크기와 색상 변경
//     d3.select(this)
//       .transition()
//       .duration(150)
//       .attr('r', 5)
//       .attr('fill', '#ff5722');  // 색상을 변경 (예: 빨간색)
  
//     // 다른 모든 점을 회색으로 변경
//     circles.filter((_, i, nodes) => nodes[i] !== this)
//       .transition()
//       .duration(150)
//       .attr('fill', '#ccc');
  
//     // 툴팁 표시
//     tooltip
//       .style('opacity', '0.8')
//       .html(ind_x+':'+ d[ind_x]
//       + '<br/>' + ind_y + ':' + d[ind_y]
//       + '<br/>' + "country" + ':' + d.country)
//       .style('left', (event.x + 10) + 'px')
//       .style('top', (event.y - 80) + 'px');
//   }
  
