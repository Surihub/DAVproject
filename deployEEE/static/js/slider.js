
var currentYear = 2022;
function updatePlot(data) {
    var index1 = d3.select('#index1').node().value;
    var index2 = d3.select('#index2').node().value;
    updateScatterPlot(data,  index1, index2, currentYear);
}

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
    console.log(Array.isArray(total_data)); // true 출력
    console.log(currentYear);
    document.addEventListener('DOMContentLoaded', function() {
        var currentYear = 2010; // 초기 연도 설정
        console.log(currentYear);

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
                console.log("hssssssssssssssi!")
                console.log(currentYear);
                console.log("slider.js");
                var index1 = d3.select('#index1').node().value;
                var index2 = d3.select('#index2').node().value;
                updateScatterPlot(total_data,  index1, index2, currentYear);            });
            console.log(currentYear);
            
        d3.select('#yearSlider')
            .append('svg')
            .attr('width', 500)
            .attr('height', 100)
            .append('g')
            .attr('transform', 'translate(-300,500)')
            .call(slider);
        updatePlot(total_data);
    });
});