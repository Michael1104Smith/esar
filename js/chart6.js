function drawChart6(id_name,type_name){
    var seriesOptions = [];
	/**
	 * Create the chart when all data is loaded
	 * @returns {undefined}
	 */
	function createChart() {

	    $(id_name).highcharts('StockChart', {

	        rangeSelector: {
	            selected: 4
	        },

	        yAxis: {
	            labels: {
	                formatter: function () {
	                    return this.value;
	                }
	            },
	            plotLines: [{
	                value: 0,
	                width: 2,
	                color: 'silver'
	            }]
	        },
            legend: {
	            // layout: 'vertical',
	            // backgroundColor: '#FFFFFF',
	            // align: 'right',
	            // verticalAlign: 'top',
	            // floating: true,
	            // y: 45,
                enabled: true,
            },

	        plotOptions: {
	            series: {
	                compare: ''
	            }
	        },

	        tooltip: {
	            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y:.0f}</b><br/>',
	            valueDecimals: 2
	        },

	        series: seriesOptions
	    });
	}

	$.getJSON('data/notes.json',function(notes){
		
		HideSearchOverlay();

		var output_data = [];
		var range = getDates(new Date('2014-01-01'),new Date());
		total_num = notes["total"];
		loop_cnt = Math.round(total_num/500);
		if(loop_cnt > total_num/500) loop_cnt--;

		name_index = 0;
		for (name_index = 0; name_index < user_names.length; name_index++){
			output_data = [];

			for(i = 0; i<range.length; i++){
				var tmp_arr = [];
				tmp_arr[0] = range[i].getTime();
				tmp_arr[1] = 0;
				output_data.push(tmp_arr);
			}

			data = notes["data"];
			for(i = 0; i <= loop_cnt; i++){

				var inter_cnt = 500;
				if(i == loop_cnt){
					inter_cnt = total_num - loop_cnt*500;
				}
				for(j = 0; j < inter_cnt; j++){
					var read_obj = data[i][j];
					if(!read_obj) break;
					var date1 = new Date(read_obj.dateAdded);
					var dateIndex = getIndex(date1);
					if(read_obj.commentingPerson.id == userValueArr[name_index]){
						for(k = 0; k < note_names.length; k++){
							if(read_obj.action == note_names[k]){
								break;
							}
						}
						if(k < note_names.length){
							output_data[dateIndex][1] += notes_values[k];
						}
					}
				}
			}

	        seriesOptions[name_index] = {
	            name: user_names[name_index],
	            data: output_data,
	            // type:'areaspline',
	            color:note_colors[name_index]
	        };

		}

	    createChart();
	});
}