console.log("slider.js loaded");

window.currentYear = 2022;
function updatePlot(data) {
    var index1 = d3.select('#index1').node().value;
    var index2 = d3.select('#index2').node().value;
    updateScatterPlot(data,  index1, index2, window.currentYear);
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
    document.addEventListener('DOMContentLoaded', function() {
        window.currentYear = 2010; // 초기 연도 설정
        console.log(window.currentYear);

        var slider = d3
            .sliderHorizontal()
            .min(2000)
            .max(2022)
            .step(1)
            .width(500)
            .displayValue(false)
            .on('onchange', val => {
                window.currentYear = val;
                console.log('window');
                console.log(window.currentYear);
                d3.select('#yearValue').text("<연도: " + val+">");
                var index1 = d3.select('#index1').node().value;
                var index2 = d3.select('#index2').node().value;
                updateScatterPlot(total_data,  index1, index2, window.currentYear);
            });
            console.log(window.currentYear);
            
        d3.select('#yearSlider')
            .append('svg')
            .attr('width', 400)
            .attr('height', 100)
            .append('g')
            .call(slider);
        updatePlot(total_data);
    });
});






