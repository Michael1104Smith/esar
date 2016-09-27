<?php
    $username = "d01def52";
    $password = "AHvvfeuXG4PJcAe9";
    $host = "esar-gmbh.de";
    $database="d01def52";

    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);

    $myquery = "
		SELECT
			COUNT(call_id) AS Calls,
			SUM(ROUND(dauer/60)) AS Duration,
			DATE(time_of_call) AS Date
			from manual_calls
			GROUP BY Date";


    $query = mysql_query($myquery);

    if ( ! $query ) {
        echo mysql_error();
        die;
    }

    $data = array();

    for ($x = 0; $x < mysql_num_rows($query); $x++) {
        $data[] = mysql_fetch_assoc($query);
    }

    echo json_encode($data);

    mysql_close($server);
?>