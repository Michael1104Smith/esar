

function draw_circle_gague1(filterId,id_name,type_name) {

	call_cur = dauer_cur = call_tar = dauer_tar = 10;

	$.post("php/calls_call.php",{filterId:filterId}).done(function(call_cur_result){

	//Calls_call php start
		call_cur = call_cur_result;

		$.post("php/calls_duration.php",{filterId:filterId}).done(function(dauer_cur_result){

		// Calls_duration php start

			dauer_cur = dauer_cur_result;

			$.post("php/target.php",{filterId:filterId, type_name:"phoneCall"}).done(function(call_tar_result){

			// phoneCall start

				call_tar = call_tar_result;

				$.post("php/target.php",{filterId:filterId, type_name:"phoneDuration"}).done(function(dauer_tar_result){

					HideSearchOverlay();

					// phoneDuration start

					dauer_tar = dauer_tar_result;

					call_y = call_cur/call_tar*100;
					dauer_y = dauer_cur/dauer_tar*100;

					if(call_y > 100) call_y = 100;
					if(dauer_y > 100) dauer_y = 100;

					Highcharts.chart(id_name, {

					    chart: {
					        type: 'solidgauge',
					        marginTop: 50
					    },

					    title: {
					        text: type_name,
					        style: {
					            fontSize: '18px'
					        }
					    },

					    tooltip: {
					        borderWidth: 0,
					        backgroundColor: 'none',
					        shadow: false,
					        style: {
					            fontSize: '12px'
					        },
					        pointFormat: '<div style="text-align:center;width:30px;">{series.name}<br><span style="font-size:1.5em; color: {point.color}; font-weight: bold">{point.val1}</span><span> von {point.val2}</span></div>',
					        positioner: function (labelWidth, labelHeight) {
					            return {
					                x: 150-labelWidth/2,
					                y: 130
					            };
					        }
					    },

					    pane: {
					        startAngle: 0,
					        endAngle: 360,
					        background: [{ // Track for Move
					            outerRadius: '112%',
					            innerRadius: '93%',
					            backgroundColor: "rgba(209,98,78,0.3)",
					            opacity:0.3,
					            borderWidth: 0
					        }, { // Track for Exercise
					            outerRadius: '92%',
					            innerRadius: '73%',
					            backgroundColor: "rgba(23,57,77,0.3)",
					            borderWidth: 0
					        }]
					    },

					    yAxis: {
					        min: 0,
					        max: 100,
					        lineWidth: 0,
					        tickPositions: []
					    },

					    plotOptions: {
					        solidgauge: {
					            borderWidth: '20px',
					            dataLabels: {
					                enabled: false
					            },
					            linecap: 'butt',
					            stickyTracking: false
					        }
					    },

					    series: [{
					        name: 'Calls',
					        borderColor:"#d0624e",
					        data: [{
					            color: "#d0624e",
					            radius: '100%',
					            innerRadius: '100%',
					            y: call_y,
					        	val1: call_cur,
					        	val2: call_tar
					        }]
					    }, {
					        name: 'Callduration',
					        borderColor: "#17394d",
					        data: [{
					            color: "#17394d",
					            radius: '80%',
					            innerRadius: '80%',
					            y: dauer_y,
					        	val1: dauer_cur,
					        	val2: dauer_tar
					        }]
					    }]
					});

					// phoneDuration end
				});

			// phoneCall end
			});


		// Calls_duration php start
		});

	//Calls_call phpend
	});
}

function draw_circle_gague3(filterId,id_name,type_name) {
	// var total_val = cur_val+tar_val;
	can_cur = new_can_cur = pre_cur = qua_cur = 0;
	can_tar = new_can_tar = pre_tar = qua_tar = 290;
	today_date = new Date();

	$.post("php/target.php",{filterId:filterId, type_name:"cadidateContacts"}).done(function(can_tar_result){

		can_tar = parseInt(can_tar_result);

		$.post("php/target.php",{filterId:filterId, type_name:"candidateNewCandidate"}).done(function(new_can_tar_result){

			new_can_tar = parseInt(new_can_tar_result);

			$.post("php/target.php",{filterId:filterId, type_name:"candidatePrescreen"}).done(function(pre_tar_result){

				pre_tar = parseInt(pre_tar_result);

				$.post("php/target.php",{filterId:filterId, type_name:"candidateQuali"}).done(function(qua_tar_result){

					qua_tar = parseInt(qua_tar_result);

					$.getJSON('data/notes.json',function(notes){
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
								if((filterId == 0 || read_obj.commentingPerson.id == filterId) && (read_obj.personReference._subtype == type_name) && (today_date.getFullYear() == date1.getFullYear())
									&& (today_date.getMonth() == date1.getMonth())){
									can_cur++;
									if(read_obj.action == 'Prescreen' || read_obj.action == 'prescreen'){
										pre_cur++;
									}
									if(read_obj.action == 'Quali' || read_obj.action == 'quali'){
										qua_cur++;
									}
								}
							}
						}


						$.getJSON('data/candidate.json',function(candidate){

							HideSearchOverlay();

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
									if((filterId == 0 || read_obj.owner.id == filterId) && (today_date.getFullYear() == date1.getFullYear())	&& (today_date.getMonth() == date1.getMonth())){
										new_can_cur++;
									}
								}
							}

							can_y = Math.round(can_cur/can_tar*100);
							new_can_y = Math.round(new_can_cur/new_can_tar*100);
							pre_y = Math.round(pre_cur/pre_tar*100);
							qua_y = Math.round(qua_cur/qua_tar*100);

							if(can_y > 100) can_y = 100;
							if(new_can_y > 100) new_can_y = 100;
							if(pre_y > 100) pre_y = 100;
							if(qua_y > 100) qua_y = 100;

							Highcharts.chart(id_name, {

						        chart: {
						            type: 'solidgauge',
						            marginTop: 50
						        },

						        title: {
						            text: type_name,
						            style: {
						                fontSize: '18px'
						            }
						        },

						        tooltip: {
						            borderWidth: 0,
						            backgroundColor: 'none',
						            shadow: false,
						            style: {
						                fontSize: '12px'
						            },
						            pointFormat: '<div style="text-align:center;width:30px;">{series.name}<br><span style="font-size:1.5em; color: {point.color}; font-weight: bold">{point.val1}</span><span> von {point.val2}</span></div>',
						            positioner: function (labelWidth, labelHeight) {
						                return {
						                    x: 150-labelWidth/2,
						                    y: 130
						                };
						            }
						        },

						        pane: {
						            startAngle: 0,
						            endAngle: 360,
						            background: [{ // Track for Move
						                outerRadius: '112%',
						                innerRadius: '93%',
						                backgroundColor: "rgba(23,57,77,0.3)",
						                opacity:0.3,
						                borderWidth: 0
						            }, { // Track for Exercise
						                outerRadius: '92%',
						                innerRadius: '73%',
						                backgroundColor: "rgba(15,85,120,0.3)",
						                borderWidth: 0
						            }, { // Track for Stand
						                outerRadius: '72%',
						                innerRadius: '53%',
						                backgroundColor: "rgba(165,166,162,0.3)",
						                borderWidth: 0
						            }, { // Track for Stand
						                outerRadius: '52%',
						                innerRadius: '33%',
						                backgroundColor: "rgba(208,98,78,0.3)",
						                borderWidth: 0
						            }]
						        },

						        yAxis: {
						            min: 0,
						            max: 100,
						            lineWidth: 0,
						            tickPositions: []
						        },

						        plotOptions: {
						            solidgauge: {
						                borderWidth: '20px',
						                dataLabels: {
						                    enabled: false
						                },
						                linecap: 'butt',
						                stickyTracking: false
						            }
						        },

						        series: [{
						            name: 'Candidates',
						            borderColor:"#17394d",
						            data: [{
						                color: "#17394d",
						                radius: '100%',
						                innerRadius: '100%',
						                y: can_y,
						            	val1: can_cur,
						            	val2: can_tar
						            }]
						        }, {
						            name: 'New candis',
						            borderColor: "#0f5578",
						            data: [{
						                color: "#0f5578",
						                radius: '80%',
						                innerRadius: '80%',
						                y: new_can_y,
						            	val1: new_can_cur,
						            	val2: new_can_tar
						            }]
						        },{
						            name: 'Prescreens',
						            borderColor: "#a5a6a2",
						            data: [{
						                color: "#a5a6a2",
						                radius: '60%',
						                innerRadius: '60%',
						                y: pre_y,
						            	val1: pre_cur,
						            	val2: pre_tar
						            }]
						        }, {
						            name: 'Qualis',
						            borderColor: "#d0624e",
						            data: [{
						                color: "#d0624e",
						                radius: '40%',
						                innerRadius: '40%',
						                y: qua_y,
						            	val1: qua_cur,
						            	val2: qua_tar
						            }]
						        }]
						    });
						});
					});

				});


			});


		});

	});



}



function draw_circle_gague4(filterId,id_name,type_name) {
	// var total_val = cur_val+tar_val;
	cli_cur = new_cli_cur = job_cur = 0;
	cli_tar = new_cli_tar = job_tar = 290;
	today_date = new Date();

	$.post("php/target.php",{filterId:filterId, type_name:"clientContacts"}).done(function(cli_tar_result){

		cli_tar = parseInt(cli_tar_result);

		$.post("php/target.php",{filterId:filterId, type_name:"clientNewClient"}).done(function(new_cli_tar_result){

			new_cli_tar = parseInt(new_cli_tar_result);

			$.post("php/target.php",{filterId:filterId, type_name:"clientJobquali"}).done(function(job_tar_result){

				job_tar = parseInt(job_tar_result);

				$.getJSON('data/notes.json',function(notes){
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
							if((filterId == 0 || read_obj.commentingPerson.id == filterId) && (read_obj.personReference._subtype == type_name) && (today_date.getFullYear() == date1.getFullYear())
								&& (today_date.getMonth() == date1.getMonth())){
								cli_cur++;
								if(read_obj.action == 'Quali' || read_obj.action == 'quali'){
									job_cur++;
								}
							}
						}
					}


					$.getJSON('data/client.json',function(client){

						HideSearchOverlay();

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
								if((filterId == 0 || read_obj.owner.id == filterId) && (today_date.getFullYear() == date1.getFullYear()) && (today_date.getMonth() == date1.getMonth())){
									new_cli_cur++;
								}
							}
						}

						cli_y = Math.round(cli_cur/cli_tar*100);
						new_cli_y = Math.round(new_cli_cur/new_cli_tar*100);
						job_y = Math.round(job_cur/job_tar*100);

						if(cli_y > 100) cli_y = 100;
						if(new_cli_y > 100) new_cli_y = 100;
						if(job_y > 100) job_y = 100;

						Highcharts.chart(id_name, {

					        chart: {
					            type: 'solidgauge',
					            marginTop: 50
					        },

					        title: {
					            text: type_name,
					            style: {
					                fontSize: '18px'
					            }
					        },

					        tooltip: {
					            borderWidth: 0,
					            backgroundColor: 'none',
					            shadow: false,
					            style: {
					                fontSize: '12px'
					            },
					            pointFormat: '<div style="text-align:center;width:30px;">{series.name}<br><span style="font-size:1.5em; color: {point.color}; font-weight: bold">{point.val1}</span><span> von {point.val2}</span></div>',
					            positioner: function (labelWidth, labelHeight) {
					                return {
					                    x: 150-labelWidth/2,
					                    y: 130
					                };
					            }
					        },

					        pane: {
					            startAngle: 0,
					            endAngle: 360,
					            background: [{ // Track for Move
					                outerRadius: '112%',
					                innerRadius: '93%',
					                backgroundColor: "rgba(23,57,77,0.3)",
					                opacity:0.3,
					                borderWidth: 0
					            }, { // Track for Exercise
					                outerRadius: '92%',
					                innerRadius: '73%',
					                backgroundColor: "rgba(15,85,120,0.3)",
					                borderWidth: 0
					            }, { // Track for Stand
					                outerRadius: '72%',
					                innerRadius: '53%',
					                backgroundColor: "rgba(165,166,162,0.3)",
					                borderWidth: 0
					            }]
					        },

					        yAxis: {
					            min: 0,
					            max: 100,
					            lineWidth: 0,
					            tickPositions: []
					        },

					        plotOptions: {
					            solidgauge: {
					                borderWidth: '20px',
					                dataLabels: {
					                    enabled: false
					                },
					                linecap: 'butt',
					                stickyTracking: false
					            }
					        },

					        series: [{
					            name: 'Clients',
					            borderColor:"#17394d",
					            data: [{
					                color: "#17394d",
					                radius: '100%',
					                innerRadius: '100%',
					                y: cli_y,
					            	val1: cli_cur,
					            	val2: cli_tar
					            }]
					        }, {
					            name: 'New Managers',
					            borderColor: "#0f5578",
					            data: [{
					                color: "#0f5578",
					                radius: '80%',
					                innerRadius: '80%',
					                y: new_cli_y,
					            	val1: new_cli_cur,
					            	val2: new_cli_tar
					            }]
					        }, {
					            name: 'Job Qualis',
					            borderColor: "#a5a6a2",
					            data: [{
					                color: "#a5a6a2",
					                radius: '60%',
					                innerRadius: '60%',
					                y: job_y,
					            	val1: job_cur,
					            	val2: job_tar
					            }]
					        }]
					    });
					});
				});



			});


		});

	});



}



function draw_circle_gague5(filterId,id_name,type_name) {

	short_cur = send_cur = inter_cur = offer_cur = new_cur = 0;
	short_tar = send_tar = inter_tar = offer_tar = new_tar = 290;
	today_date = new Date();

    $.post("php/target.php",{filterId:filterId, type_name:"jobShortlist"}).done(function(short_tar_result){

		short_tar = parseInt(short_tar_result);

		$.post("php/target.php",{filterId:filterId, type_name:"jobNewJob"}).done(function(new_tar_result){

			new_tar = parseInt(new_tar_result);

			$.post("php/target.php",{filterId:filterId, type_name:"jobInterview"}).done(function(inter_tar_result){

				inter_tar = parseInt(inter_tar_result);

				$.post("php/target.php",{filterId:filterId, type_name:"jobOffer"}).done(function(offer_tar_result){

					offer_tar = parseInt(offer_tar_result);

					$.post("php/target.php",{filterId:filterId, type_name:"jobSendout"}).done(function(send_tar_result){

						send_tar = send_tar_result;

						$.getJSON('data/submissions.json',function(submissions){
							total_num = submissions["total"];
							loop_cnt = Math.round(total_num/500);
							if(loop_cnt > total_num/500) loop_cnt--;
							data = submissions["data"];
							for(i = 0; i <= loop_cnt; i++){

								var inter_cnt = 500;
								if(i == loop_cnt){
									inter_cnt = total_num - loop_cnt*500;
								}
								for(j = 0; j < inter_cnt; j++){
									var read_obj = data[i][j];
									if(!read_obj) break;
									var date1 = new Date(read_obj.dateAdded);
									if((filterId == 0 || read_obj.sendingUser.id == filterId) && (today_date.getFullYear() == date1.getFullYear())
										&& (today_date.getMonth() == date1.getMonth())){
										// if(read_obj.status == "Shortlisted"){
											short_cur++;
										// }
										if(read_obj.status == "Offer liegt vor"){
											offer_cur++;
										}
										if(read_obj.status == "Sendout"){
											send_cur++;
										}
									}
								}
							}


							$.getJSON('data/job.json',function(job){

								HideSearchOverlay();

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
										if((filterId == 0 || read_obj.owner.id == filterId) && (today_date.getFullYear() == date1.getFullYear()) && (today_date.getMonth() == date1.getMonth())){
											new_cur++;
											inter_cur += parseInt(read_obj.interviews.total);
										}
									}
								}

								short_y = Math.round(short_cur/short_tar*100);
								new_y = Math.round(new_cur/new_tar*100);
								inter_y = Math.round(inter_cur/inter_tar*100);
								offer_y = Math.round(offer_cur/offer_tar*100);
								send_y = Math.round(send_cur/send_tar*100);

								if(short_y > 100) short_y = 100;
								if(new_y > 100) new_y = 100;
								if(inter_y > 100) inter_y = 100;
								if(offer_y > 100) offer_y = 100;
								if(send_y > 100) send_y = 100;

								Highcharts.chart(id_name, {

							        chart: {
							            type: 'solidgauge',
							            marginTop: 50
							        },

							        title: {
							            text: type_name,
							            style: {
							                fontSize: '18px'
							            }
							        },

							        tooltip: {
							            borderWidth: 0,
							            backgroundColor: 'none',
							            shadow: false,
							            style: {
							                fontSize: '12px'
							            },
							            pointFormat: '<div style="text-align:center;width:30px;">{series.name}<br><span style="font-size:1.5em; color: {point.color}; font-weight: bold">{point.val1}</span><span> von {point.val2}</span></div>',
							            positioner: function (labelWidth, labelHeight) {
							                return {
							                    x: 150-labelWidth/2,
							                    y: 130
							                };
							            }
							        },

							        pane: {
							            startAngle: 0,
							            endAngle: 360,
							            background: [{ // Track for Move
							                outerRadius: '112%',
							                innerRadius: '93%',
							                backgroundColor: "rgba(23,57,77,0.3)",
							                opacity:0.3,
							                borderWidth: 0
							            }, { // Track for Exercise
							                outerRadius: '92%',
							                innerRadius: '73%',
							                backgroundColor: "rgba(15,85,120,0.3)",
							                borderWidth: 0
							            }, { // Track for Stand
							                outerRadius: '72%',
							                innerRadius: '53%',
							                backgroundColor: "rgba(165,166,162,0.3)",
							                borderWidth: 0
							            }, { // Track for Stand
							                outerRadius: '52%',
							                innerRadius: '33%',
							                backgroundColor: "rgba(208,98,78,0.3)",
							                borderWidth: 0
							            }, { // Track for Stand
							                outerRadius: '32%',
							                innerRadius: '13%',
							                backgroundColor: "rgba(232,220,84,0.3)",
							                borderWidth: 0
							            }]
							        },

							        yAxis: {
							            min: 0,
							            max: 100,
							            lineWidth: 0,
							            tickPositions: []
							        },

							        plotOptions: {
							            solidgauge: {
							                borderWidth: '20px',
							                dataLabels: {
							                    enabled: false
							                },
							                linecap: 'butt',
							                stickyTracking: false
							            }
							        },

							        series: [{
							            name: 'Shortlist',
							            borderColor:"#17394d",
							            data: [{
							                color: "#17394d",
							                radius: '100%',
							                innerRadius: '100%',
							                y: short_y,
							            	val1: short_cur,
							            	val2: short_tar
							            }]
							        }, {
							            name: 'Neue Jobs',
							            borderColor: "#0f5578",
							            data: [{
							                color: "#0f5578",
							                radius: '80%',
							                innerRadius: '80%',
							                y: new_y,
							            	val1: new_cur,
							            	val2: new_tar
							            }]
							        },{
							            name: 'Interviews',
							            borderColor: "#a5a6a2",
							            data: [{
							                color: "#a5a6a2",
							                radius: '60%',
							                innerRadius: '60%',
							                y: inter_y,
							            	val1: inter_cur,
							            	val2: inter_tar
							            }]
							        }, {
							            name: 'Offers',
							            borderColor: "#d0624e",
							            data: [{
							                color: "#d0624e",
							                radius: '40%',
							                innerRadius: '40%',
							                y: offer_y,
							            	val1: offer_cur,
							            	val2: offer_tar
							            }]
							        }, {
							            name: 'Sendouts',
							            borderColor: "#e8dc54",
							            data: [{
							                color: "#e8dc54",
							                radius: '20%',
							                innerRadius: '20%',
							                y: send_y,
							            	val1: send_cur,
							            	val2: send_tar
							            }]
							        }]
							    });
							});
						});

					});

				});


			});


		});

	});

}

var activity_tar_arr = [0,0,0,0,0,0,0,0];

function draw_circle_gague6(filterId,id_name,type_name,val_index) {

	var activity_cur = activity_tar_arr[val_index] = 0;
	var today_date = new Date();

	$.post("php/target.php",{filterId:filterId, type_name:"activity"}).done(function(activity_tar_result){

		// Activity Target Start

		activity_tar_arr[val_index] = activity_tar_result;

		$.getJSON('data/notes.json',function(notes){
			
			HideSearchOverlay();

			//Activity Current Start
			var data = notes["data"];
			var total_num = notes["total"];
			var loop_cnt = Math.round(total_num/500);
			if(loop_cnt > total_num/500) loop_cnt--;
			var i;
			activity_cur = 0;
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
					if((read_obj.commentingPerson.id == filterId) && (today_date.getFullYear() == date1.getFullYear()) && (today_date.getMonth() == date1.getMonth())){
						for(k = 0; k < note_names.length; k++){
							if(read_obj.action == note_names[k]){
								break;
							}
						}
						if(k < note_names.length){
							activity_cur += notes_values[k];
						}
					}
				}
			}

			if(activity_tar_arr[val_index] != 0){
				activity_y = activity_cur/activity_tar_arr[val_index]*100;
			}else{
				activity_y = 100;
			}

			if(activity_y > 100) activity_y = 100;

			Highcharts.chart(id_name, {

			    chart: {
			        type: 'solidgauge',
			        marginTop: 30
			    },

			    title: {
			        text: type_name,
			        style: {
			            fontSize: '15px'
			        }
			    },

			    tooltip: {
			        borderWidth: 0,
			        backgroundColor: 'none',
			        shadow: false,
			        style: {
			            fontSize: '10px'
			        },
			        pointFormat: '<div style="text-align:center;width:30px;">{series.name}<br><span style="font-size:1.5em; color: {point.color}; font-weight: bold">{point.val1}</span><span> von {point.val2}</span></div>',
			        positioner: function (labelWidth, labelHeight) {
			            return {
			                x: 70-labelWidth/2,
			                y: 45
			            };
			        }
			    },

			    pane: {
			        startAngle: 0,
			        endAngle: 360,
			        background: [{ // Track for Move
			            outerRadius: '112%',
			            innerRadius: '85%',
			            backgroundColor: "rgba(23,57,77,0.3)",
			            opacity:0.3,
			            borderWidth: 0
			        }]
			    },

			    yAxis: {
			        min: 0,
			        max: 100,
			        lineWidth: 0,
			        tickPositions: []
			    },

			    plotOptions: {
			        solidgauge: {
			            borderWidth: '12px',
			            dataLabels: {
			                enabled: false
			            },
			            linecap: 'butt',
			            stickyTracking: false
			        }
			    },

			    series: [{
			        name: 'Activity',
			        borderColor:note_colors[val_index],
			        data: [{
			            color: note_colors[val_index],
			            radius: '100%',
			            innerRadius: '100%',
			            y: activity_y,
			        	val1: activity_cur,
			        	val2: activity_tar_arr[val_index]
			        }]
			    }]
			});
			//Activity Current End
		});

		// Activity Target End
	});
}

function draw_circle_gague7(filterId,id_name,type_name,val_index) {

	dauer_cur = dauer_tar = 10;

	$.post("php/calls_duration.php",{filterId:filterId}).done(function(dauer_cur_result){

	// Calls_duration php start

		dauer_cur = dauer_cur_result;

		$.post("php/target.php",{filterId:filterId, type_name:"phoneDuration"}).done(function(dauer_tar_result){

			// phoneDuration start

			dauer_tar = dauer_tar_result;

			if(dauer_tar != 0){
				dauer_y = dauer_cur/dauer_tar*100;
			}else{
				dauer_y = 100;
			}

			if(dauer_y > 100) dauer_y = 100;

			Highcharts.chart(id_name, {

			    chart: {
			        type: 'solidgauge',
			        marginTop: 30
			    },

			    title: {
			        text: type_name,
			        style: {
			            fontSize: '15px'
			        }
			    },

			    tooltip: {
			        borderWidth: 0,
			        backgroundColor: 'none',
			        shadow: false,
			        style: {
			            fontSize: '10px'
			        },
			        pointFormat: '<div style="text-align:center;width:30px;">{series.name}<br><span style="font-size:1.5em; color: {point.color}; font-weight: bold">{point.val1}</span><span> von {point.val2}</span></div>',
			        positioner: function (labelWidth, labelHeight) {
			            return {
			                x: 70-labelWidth/2,
			                y: 45
			            };
			        }
			    },

			    pane: {
			        startAngle: 0,
			        endAngle: 360,
			        background: [{ // Track for Move
			            outerRadius: '112%',
			            innerRadius: '85%',
			            backgroundColor: "rgba(23,57,77,0.3)",
			            opacity:0.3,
			            borderWidth: 0
			        }]
			    },

			    yAxis: {
			        min: 0,
			        max: 100,
			        lineWidth: 0,
			        tickPositions: []
			    },

			    plotOptions: {
			        solidgauge: {
			            borderWidth: '12px',
			            dataLabels: {
			                enabled: false
			            },
			            linecap: 'butt',
			            stickyTracking: false
			        }
			    },

			    series: [{
			        name: 'Callduration',
			        borderColor:note_colors[val_index],
			        data: [{
			            color: note_colors[val_index],
			            radius: '100%',
			            innerRadius: '100%',
			            y: dauer_y,
			        	val1: dauer_cur,
			        	val2: dauer_tar
			        }]
			    }]
			});

			// phoneDuration end
		});


	// Calls_duration php start
	});
}