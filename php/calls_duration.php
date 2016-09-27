<?php

$servername = "Esar-gmbh.de";
$username = "d01f0af2";
$password = "eVBywttgP6PmNenv";
$dbname = "d01f0af2";
$filterId = $_POST['filterId'];

// Create connection
$conn = @mysqli_connect($servername, $username, $password, $dbname);
// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$sql = "SELECT SUM(dauer) AS call_count FROM calls WHERE YEAR(time_of_call) = YEAR(NOW()) AND MONTH(time_of_call) = MONTH(NOW())";
if($filterId != 0){
	$sql = "SELECT SUM(dauer) AS call_count FROM calls,targets WHERE YEAR(time_of_call) = YEAR(NOW()) AND MONTH(time_of_call) = MONTH(NOW()) AND vorname=consultantName AND consultantId='".$filterId."'";
}
$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) > 0) {
    // output data of each row
    while($row = mysqli_fetch_assoc($result)) {
        echo $row['call_count'];
    }
} else {
    echo "0";
}

mysqli_close($conn);