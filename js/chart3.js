function leapYear(year){
  	return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

function getIndex(date){
	var month_arr = [31,28,31,30,31,30,31,31,30,31,30,31];
	var year = date.getFullYear();
	var ind = 0;
	for(k = 2014; k < year; k++){
		if(leapYear(k)){
			ind += 366;
		}else{
			ind += 365;
		}
	}
	var month = date.getMonth();
	for (k = 0; k < month; k++){
		ind += month_arr[k];
	}
	if(month > 2 && leapYear(year)){
		ind++;
	}
	ind += date.getDate()-1;
	// console.log(date+":::"+ind+":"+year+":"+month+":"+month_arr[0]+":"+date.getDate());
	return ind;
}

Date.prototype.addDays = function(days) {
	var dat = new Date(this.valueOf())
	dat.setDate(dat.getDate() + days);
	return dat;
}

function getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    var endDate = stopDate;
    endDate.setHours(14);
    while (currentDate <= stopDate) {
    	currentDate.setHours(13);
        dateArray.push( new Date (currentDate) )
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}


function drawChart3(filterId, id_name,type_name){
    var seriesOptions = [];
	/**
	 * Create the chart when all data is loaded
	 * @returns {undefined}
	 */
	function createChart() {
		var today_date = new Date();

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

// get all notes
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
            name: "Contacts",
            data: output_data,
            type:'areaspline',
            color:"#17394d"
        };

        console.log(output_data);


		output_data = [];

		for(i = 0; i<range.length; i++){
			var tmp_arr = [];
			tmp_arr[0] = range[i].getTime();
			tmp_arr[1] = 0;
			output_data.push(tmp_arr);
		}
// get prescreen
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
				if((filterId == 0 || read_obj.commentingPerson.id == filterId) && (read_obj.action == 'Prescreen' || read_obj.action == 'prescreen') && (read_obj.personReference._subtype == type_name)){
					var date1 = new Date(read_obj.dateAdded);
					var dateIndex = getIndex(date1);
					output_data[dateIndex][1]++;
				}
			}
		}

        seriesOptions[2] = {
            name: "Prescreens",
            data: output_data,
            type:'areaspline',
            color:"#a5a6a2"
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

        seriesOptions[3] = {
            name: "Quali",
            data: output_data,
            type:'areaspline',
            color:"#d0624e"
        };


		$.getJSON('data/candidate.json',function(candidate){

			HideSearchOverlay();

			output_data = [];

			for(i = 0; i<range.length; i++){
				var tmp_arr = [];
				tmp_arr[0] = range[i].getTime();
				tmp_arr[1] = 0;
				output_data.push(tmp_arr);
			}
//get new candidates
			total_num = candidate["total"];
			loop_cnt = Math.round(total_num/500);
			if(loop_cnt > total_num/500) loop_cnt--;
			data = candidate["data"];
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
	            name: "New Contacts",
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