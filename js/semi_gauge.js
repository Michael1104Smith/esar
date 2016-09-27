
function draw_semi_gague(cur_val,tar_val,chart_id,str) {
	var total_val = cur_val+tar_val;

    var gaugeOptions = {

        chart: {
            type: 'solidgauge'
        },

        title: null,

        pane: {
            center: ['50%', '85%'],
            size: '100%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },

        tooltip: {
            enabled: false
        },

        // the value axis
        yAxis: {
            stops: [
                [0.1, '#55BF3B'], // green
                [0.5, '#DDDF0D'], // yellow
                [0.9, '#DF5353'] // red
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickPixelInterval: 400,
            tickWidth: 0,
            title: {
                y: -70
            },
            labels: {
                y: 16
            }
        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        }
    };

    // The speed gauge
    $(chart_id).highcharts(Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: total_val,
            title: {
                text: str
            }
        },

        credits: {
            enabled: false
        },

        series: [{
            name: '',
            data: [cur_val],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:15px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                       '<span style="font-size:12px;color:silver"></span></div>'
            },
            tooltip: {
                valueSuffix: ' km/h'
            }
        }]
    }));


    $(chart_id+' .highcharts-axis-labels text:nth-child(2)').html(total_val);
    var y_pos = $(chart_id+' .highcharts-axis-labels text:nth-child(1)').attr("y");
    var x_pos = parseInt($(chart_id+' .highcharts-axis-labels text:nth-child(1)').attr("x"));
    var width = parseInt($(chart_id+' svg').attr("width"));
    $(chart_id+' .highcharts-axis-labels text:nth-child(1)').attr("x",x_pos-15);
    x_pos += width-110;
    $(chart_id+' .highcharts-axis-labels text:nth-child(2)').attr("y",y_pos);
    $(chart_id+' .highcharts-axis-labels text:nth-child(2)').attr("x",x_pos);
    $(chart_id+' .highcharts-axis text').attr("y",30);

}