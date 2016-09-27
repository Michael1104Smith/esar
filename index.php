<html>
<head>
    <title>eSAR Anrufstatistiken</title>
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/graphs/main.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css">
    <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" media="all" rel="stylesheet" type="text/css">

</head>
<body>
<div class="search_overlay"><i class="fa fa-spinner fa-spin"></i></div>
<header>
    <input type="button" style="position:absolute;line-height: normal;top: 30px;left: 30px;" class="refresh_btn btn-default" value="Refresh"/>
<!--     <input type="button" style="position:absolute;line-height: normal;top: 30px;left: 150px;" class="btn-default" value="Create"/> -->
    <select class="sel_user" style="position:absolute;line-height: normal;top: 30px;left: 150px;">
        <option value="0">(Alle)</option>
        <option value="2">Shezan</option>
        <option value="3">Regina</option>
        <option value="4">Nikolas</option>
        <option value="5">Kathinka</option>
        <option value="238">Lorenz</option>
        <option value="1160">Maximilian</option>
        <option value="5409">Nona</option>
        <option value="13855">Anna</option>
    </select>
    <h1>eSAR Anrufstatistiken</h1>
</header>
<!--Twitter Bootstrap Grid System-->

<div class="container-fluid">
    <div class="row">
        <div class="col-lg-12 graph">
            <h1>Calls + Callduration</h1>
            <!--Calls per day-->
            <div id="calls" class="col-lg-9">
                <div id="calls-info">
                    <!--legend-->
                    <div id="keys">
                        <p>
                            <span class="key-text">Number of calls</span>
                            <span class="key" id="call-key"></span>
                        </p>
                        <p>
                            <span class="key-text">Duration of calls</span>
                            <span class="key" id="duration-key"></span>
                        </p>
                    </div>
                <!--shows you what happened on a particular day-->
                    <div id="current-data">
                        <h2></h2>
                    </div>
                </div>
            </div>
            <div class="col-lg-3">
                <div id="chart1_gauge" style="width: 300px; height: 300px;"></div>
            </div>
        </div>
        <div class="col-lg-12 graph">
            <h1 style="margin-bottom:50px;">Candidate</h1>
            <div id="chart3" class="col-lg-9" style="height: 400px;"></div>
            <div class="col-lg-3">
                <div id="chart3_gauge" style="width: 300px; height: 300px;"></div>
            </div>
            <!--Telefonzeit-->
        </div>
        <div class="col-lg-12 graph">
            <h1 style="margin-bottom:50px;">Clients</h1>
            <div id="chart4" class="col-lg-9" style="height: 400px;"></div>
            <div class="col-lg-3">
                <div id="chart4_gauge" style="width: 300px; height: 300px;"></div>
            </div>
            <!--Kandidatenkontakte-->
        </div>
        <div class="col-lg-12 graph">
            <h1 style="margin-bottom:50px;">Jobs</h1>
            <div id="chart5" class="col-lg-9" style="height: 400px;"></div>
            <div class="col-lg-3">
                <div id="chart5_gauge" style="width: 300px; height: 300px;"></div>
            </div>
            <!--Kundenkontakte-->
        </div>
        <div class="col-lg-12 graph">
            <h1 style="margin-bottom:50px;">Activity</h1>
            <div id="chart6" class="col-lg-9" style="height: 400px;"></div>
            <div class="col-lg-3">
                <div id="chart6_gauge1" class="chart6_gagues"></div>
                <div id="chart6_gauge2" class="chart6_gagues"></div>
                <div id="chart6_gauge3" class="chart6_gagues"></div>
                <div id="chart6_gauge4" class="chart6_gagues"></div>
                <div id="chart6_gauge5" class="chart6_gagues"></div>
                <div id="chart6_gauge6" class="chart6_gagues"></div>
                <div id="chart6_gauge7" class="chart6_gagues"></div>
                <div id="chart6_gauge8" class="chart6_gagues"></div>
            </div>
            <!--Kundenkontakte-->
        </div>
    </div><!--ROW-->
</div><!--CONTAINER-->

<!--Scripts-->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script src="js/bootstrap.min.js"></script>
<script src="js/bootstrap-checkbox.min.js"></script>
<script src="js/calls.js"></script>
<script src="js/gauge.js"></script>
<script src="js/highstock.js"></script>
<script src="js/chart3.js"></script>
<script src="js/chart4.js"></script>
<script src="js/chart5.js"></script>
<script src="js/chart6.js"></script>
<script src="js/highcharts-more.js"></script>
<script src="js/solid-gauge.js"></script>
<script src="js/semi_gauge.js"></script>
<script src="js/circle_gauge.js"></script>
<script tyle="text/javascript">
    var userValueArr = [2,3,4,5,238,1160,5409,13855];
    var note_colors = ["#5a9fd3","#ef791f","#a5a6a2","#fec70e","#B0171F","#FF3E96","#4B0082","#4169E1","#63B8FF","#00B2EE","#00EE00","#CD6600","#388E8E","#8E8E38"];
    var note_names = ["Quali","Prescreen","Cold Call","Candidate Visit","Client Visit","Nicht erreicht","Kontaktanfrage geschickt","Angeschrieben"
                        ,"Email","Aktiver Prozess","IV-Vor/Nachbereitung","Erfolg","Ohne Erfolg"];
    var user_names = ["Shezan","Regina","Nikolas","Kathinka","Lorenz","Maximillian","Nona","Anna"];
    var userFlagArr = [];
    var notes_values = [30,5,5,45,90,1,3,3,3,3,15,2,2];

    var hideCnt = 0;

    function drawCircleGagues(val){
        draw_circle_gague1(val,'chart1_gauge','Calls');
        draw_circle_gague3(val,'chart3_gauge','Candidate');
        draw_circle_gague4(val,'chart4_gauge','ClientContact');
        draw_circle_gague5(val,'chart5_gauge','Jobs');
    }

    function drawCharts(val){
        drawChart3(val,'#chart3','Candidate');
        drawChart4(val,'#chart4','ClientContact');
        drawChart5(val,'#chart5','Job');
    }

    function drawActivityGauges(){
        for (i = 0; i < userValueArr.length; i++){
            var idName = 'chart6_gauge'+(i+1);
            draw_circle_gague6(userValueArr[i],idName,user_names[i],i);
        }
    }

    function drawAllFirstCharts(val){
        drawCharts(val);
        drawCircleGagues(val);
        drawActivityGauges();
        drawChart6('#chart6',"Activity");
    }

    function HideSearchOverlay(){
        hideCnt++;
        if(hideCnt == 8 + userValueArr.length){
            $('.search_overlay').hide();
            hideCnt = 0;
        }
    }

    $(document).ready(function(){
        // $(':checkbox').checkboxpicker();
        for (i = 0; i < userValueArr.length; i++){
            userFlagArr.push(true);
        }

        $('.search_overlay').show();
        drawAllFirstCharts(0);

        $('.refresh_btn').click(function(){    
            $('.search_overlay').show();
            $.ajax({url: "php/notes.php", success: function(result){
                $.ajax({url: "php/candidate.php", success: function(result){
                    $.ajax({url: "php/client.php", success: function(result){
                        $.ajax({url: "php/job.php", success: function(result){
                            $.ajax({url: "php/submissions.php", success: function(result){
                                drawAllFirstCharts(0);
                            }});
                        }});
                    }});
                }});
            }});
        });

        $('.sel_user').on('change', function() {
            $('.search_overlay').show();
            drawAllFirstCharts($(this).val());
        });


        $('body').on('click', function(e) {
            var obj = $(e.target);

            if (obj.closest('.highcharts-legend-item').length) {
                var userName = obj.closest('.highcharts-legend-item').find("text").html();
                for(k = 0; k < userValueArr.length; k++){
                    if(userName == user_names[k]){
                        break;
                    }
                }
                if(userFlagArr[k] == true){
                    userFlagArr[k] = false;
                    $('#chart6_gauge'+(k+1)).hide();
                }else{
                    userFlagArr[k] = true;
                    $('#chart6_gauge'+(k+1)).show();
                }
            }
        });
    });
</script>

</body>
</html>
