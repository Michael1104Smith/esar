function drawChart4(filterId, id_name,type_name){
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
		var output_data = [];
		var range = getDates(new Date('2014-01-01'),new Date());

		for(i = 0; i<range.length; i++){
			var tmp_arr = [];
			tmp_arr[0] = range[i].getTime();
			tmp_arr[1] = 0;
			output_data.push(tmp_arr);
		}
// get all clients
		total_num = notes["total"];
		loop_cnt = Math.round(total_num/500);
		if(loop_cnt > total_num/500) loop_cnt--;
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
				if((filterId == 0 || read_obj.commentingPerson.id == filterId) && (read_obj.personReference._subtype == type_name)){
					output_data[dateIndex][1]++;
				}
			}
		}

        seriesOptions[0] = {
            name: "Clients",
            data: output_data,
            type:'areaspline',
            color:"#17394d"
        };


		output_data = [];

		for(i = 0; i<range.length; i++){
			var tmp_arr = [];
			tmp_arr[0] = range[i].getTime();
			tmp_arr[1] = 0;
			output_data.push(tmp_arr);
		}
// get quali
		total_num = notes["total"];
		loop_cnt = Math.round(total_num/500);
		if(loop_cnt > total_num/500) loop_cnt--;
		data = notes["data"];
		for(i = 0; i <= loop_cnt; i++){

			var inter_cnt = 500;
			if(i == loop_cnt){
				inter_cnt = total_num - loop_cnt*500;
			}
			for(j = 0; j < inter_cnt; j++){
				var read_obj = data[i][j];
				if(!read_obj) break;
				if((filterId == 0 || read_obj.commentingPerson.id == filterId) && (read_obj.action == 'Quali' || read_obj.action == 'quali') && (read_obj.personReference._subtype == type_name)){
					var date1 = new Date(read_obj.dateAdded);
					var dateIndex = getIndex(date1);
					output_data[dateIndex][1]++;
				}
			}
		}

        seriesOptions[2] = {
            name: "Job Quali",
            data: output_data,
            type:'areaspline',
            color:"#a5a6a2"
        };


//get new managers
		$.getJSON('data/client.json',function(client){
			
			HideSearchOverlay();

			output_data = [];

			for(i = 0; i<range.length; i++){
				var tmp_arr = [];
				tmp_arr[0] = range[i].getTime();
				tmp_arr[1] = 0;
				output_data.push(tmp_arr);
			}

			total_num = client["total"];
			loop_cnt = Math.round(total_num/500);
			if(loop_cnt > total_num/500) loop_cnt--;
			data = client["data"];
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
					if(filterId == 0 || read_obj.owner.id == filterId){
						output_data[dateIndex][1]++;
					}
				}
			}


	        seriesOptions[1] = {
	            name: "New Managers",
	            data: output_data,
	            type:'areaspline',
            	color:"#0f5578"
	        };

	        // As we're loading the data asynchronously, we don't know what order it will arrive. So
	        // we keep a counter and create the chart when all the data is loaded.

	        createChart();
		});
	});
}