function drawChart5(filterId, id_name,type_name){
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

	$.getJSON('data/submissions.json',function(notes){
		var output_data = [];
		var range = getDates(new Date('2014-01-01'),new Date());

		for(i = 0; i<range.length; i++){
			var tmp_arr = [];
			tmp_arr[0] = range[i].getTime();
			tmp_arr[1] = 0;
			output_data.push(tmp_arr);
		}
// Total number of Submissions (Shortlist) per day from submissions.json
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
				if((filterId == 0 || read_obj.sendingUser.id == filterId)){
					output_data[dateIndex][1]++;
				}
			}
		}

        seriesOptions[0] = {
            name: "Shortlisted",
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
		
// Total number of Sendouts per day from submissions.json
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
				if((filterId == 0 || read_obj.sendingUser.id == filterId) && (read_obj.status == "Sendout")){
					var date1 = new Date(read_obj.dateAdded);
					var dateIndex = getIndex(date1);
					output_data[dateIndex][1]++;
				}
			}
		}

        seriesOptions[4] = {
            name: "Sendouts",
            data: output_data,
            type:'areaspline',
            color:"#E8DC54"
        };
		
// get Offers
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
				if((filterId == 0 || read_obj.sendingUser.id == filterId) && (read_obj.status == "Offer liegt vor")){
					var date1 = new Date(read_obj.dateAdded);
					var dateIndex = getIndex(date1);
					output_data[dateIndex][1]++;
				}
			}
		}

        seriesOptions[3] = {
            name: "Offers",
            data: output_data,
            type:'areaspline',
            color:"#d0624e"
        };


		$.getJSON('data/job.json',function(job){
			
			HideSearchOverlay();

//Total number of new jobs per day from jobs.json
			output_data = [];

			for(i = 0; i<range.length; i++){
				var tmp_arr = [];
				tmp_arr[0] = range[i].getTime();
				tmp_arr[1] = 0;
				output_data.push(tmp_arr);
			}
			total_num = job["total"];
			loop_cnt = Math.round(total_num/60);
			if(loop_cnt > total_num/60) loop_cnt--;
			data = job["data"];
			for(i = 0; i <= loop_cnt; i++){

				var inter_cnt = 60;
				if(i == loop_cnt){
					inter_cnt = total_num - loop_cnt*60;
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
	            name: "Neue Jobs",
	            data: output_data,
	            type:'areaspline',
            	color:"#0f5578"
	        };

//get total number of interviews
			output_data = [];

			for(i = 0; i<range.length; i++){
				var tmp_arr = [];
				tmp_arr[0] = range[i].getTime();
				tmp_arr[1] = 0;
				output_data.push(tmp_arr);
			}
			total_num = job["total"];
			loop_cnt = Math.round(total_num/60);
			if(loop_cnt > total_num/60) loop_cnt--;
			data = job["data"];
			for(i = 0; i <= loop_cnt; i++){

				var inter_cnt = 60;
				if(i == loop_cnt){
					inter_cnt = total_num - loop_cnt*60;
				}
				for(j = 0; j < inter_cnt; j++){
					var read_obj = data[i][j];
					if(!read_obj) break;
					var date1 = new Date(read_obj.dateAdded);
					var dateIndex = getIndex(date1);
					if(filterId == 0 || read_obj.owner.id == filterId){
						output_data[dateIndex][1] += parseInt(read_obj.interviews.total);
					}
				}
			}

	        seriesOptions[2] = {
	            name: "Interviews",
	            data: output_data,
	            type:'areaspline',
            	color:"#a5a6a2"
	        };

	        // As we're loading the data asynchronously, we don't know what order it will arrive. So
	        // we keep a counter and create the chart when all the data is loaded.

	        createChart();
		});
	});
}