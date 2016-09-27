<?php

$servername = "Esar-gmbh.de";
$username = "d01f0af2";
$password = "eVBywttgP6PmNenv";
$dbname = "d01f0af2";
$filterId = $_POST['filterId'];
$type_name = $_POST['type_name'];

// Create connection
$conn = @mysqli_connect($servername, $username, $password, $dbname);
// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$sql = "SELECT SUM(".$type_name.") AS ".$type_name." FROM targets";
if($filterId != 0){
	$sql = "SELECT ".$type_name." FROM targets WHERE consultantId=".$filterId;
}
$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) > 0) {
    // output data of each row
    while($row = mysqli_fetch_assoc($result)) {
        echo $row[$type_name];
    }
} else {
    echo "0";
}

mysqli_close($conn);