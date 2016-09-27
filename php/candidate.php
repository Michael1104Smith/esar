<?php                                                       
    // Defining the basic cURL function
    function curl($url) {
        $ch = curl_init();  // Initialising cURL
        curl_setopt($ch, CURLOPT_URL, $url);    // Setting cURL's URL option with the $url variable passed into the function
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE); // Setting cURL's option to return the webpage data
        $data = curl_exec($ch); // Executing the cURL request and assigning the returned data to the $data variable
        curl_close($ch);    // Closing cURL
        return $data;   // Returning the data from the function
    }

    function coverert2($str){
        if((int)$str<10){
            $str = "0".$str;
        }
        return $str;
    }
?>

<?php

    define('CLIENT_ID', '1d3c2905-de8f-45f0-bb4f-5c4a7275d4c4');
    define('CLIENT_SECRET', 'bocbFbIn1lzDhdJuX3b4vNpRDUOfHHsK');
    define('USER', 'eSARGmbH.api');
    define('PASS', 'paris_430');

    function getAuthCode(){
        $url = 'https://auth.bullhornstaffing.com/oauth/authorize?client_id='.CLIENT_ID.'&response_type=code&action=Login&username='.USER.'&password='.PASS;
        $curl = curl_init( $url );
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HEADER, true);
        //curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_AUTOREFERER, true);
        curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 120);
        curl_setopt($curl, CURLOPT_TIMEOUT, 120);

        $content = curl_exec( $curl );
        curl_close( $curl );//die($content);

        if(preg_match('#Location: (.*)#', $content, $r)) {
            $l = trim($r[1]);
            $temp = preg_split("/code=/", $l);
            $authcode = $temp[1];
        }

        return $authcode;
    }

    function doBullhornAuth($authCode){
         $url = 'https://auth.bullhornstaffing.com/oauth/token?grant_type=authorization_code&code='.$authCode.'&client_id='.CLIENT_ID.'&client_secret='.CLIENT_SECRET;

        $options = array(
        CURLOPT_RETURNTRANSFER => 1,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => array()
        );

        $ch = curl_init( $url );
        curl_setopt_array( $ch, $options );
        $content = curl_exec( $ch );

        curl_close( $ch ); //die($content);

        return $content;

    }

    function doBullhornLogin($accessToken){
        $url = 'https://rest.bullhornstaffing.com/rest-services/login?version=*&access_token='.$accessToken;
        $curl = curl_init( $url );
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

        $content = curl_exec( $curl );
        curl_close( $curl );
        return $content;
    }

    try {
        $authCode = getAuthCode();//echo $authCode;die;
        $auth = doBullhornAuth($authCode);//echo $auth;die;
        $tokens = json_decode($auth);//print '<pre>';print_r($tokens);die;
        $session = doBullhornLogin($tokens->access_token);
    } catch (Exception $e) {
        error_log($e->getMessage());
    }

?>

<?php

    set_time_limit(0);
    if (ob_get_level() == 0) ob_start();

    $RT_Url = json_decode($session);
    $cur_date = getdate();

    $year = $cur_date["year"];
    $mon = coverert2($cur_date["mon"]);
    $mday = coverert2($cur_date["mday"]);
    $hours = coverert2($cur_date["hours"]);
    $minutes = coverert2($cur_date["minutes"]);
    $seconds = coverert2($cur_date["seconds"]);
    $endDate = $year.$mon.$mday.$hours.$minutes.$seconds;

    $dateAdded = "%20["."20140101000000"."%20TO%20".$endDate."]&fields=id,dateAdded,owner";

    $restUrl = $RT_Url->{"restUrl"};
    $queryUrl = "search/Candidate?query=dateAdded:".$dateAdded;
    $BhRestToken = $RT_Url->{"BhRestToken"};
    $pageUrl  = $restUrl.$queryUrl."&BhRestToken=".$BhRestToken;
    $required_data = curl($pageUrl);
    $json = json_decode($required_data);
    // print_r($json);
    // echo "<br/><br/>";
    $total = (int)($json->{"total"});
    $loopCnt = $total / 500;
    $output = array();
    $output["total"] = $total;
    $output_data = array();
    for($i = 0; $i < $loopCnt; $i++){
        $start = $i * 500;
        $dataUrl = $pageUrl."&start=".$start."&count=500";
        $required_data = curl($dataUrl);
        $json = json_decode($required_data);
        $data = $json->{"data"};
        $output_data []= $data;
    }

    $restCnt = $total - $loopCnt*500;
    if($restCnt > 0){
        $dataUrl = $pageUrl."&start=".($i*500)."&count=".$restCnt;
        $required_data = curl($dataUrl);
        $json = json_decode($required_data);
        $data = $json->{"data"};
        $output_data []= $data;
    }
    $output["data"] = $output_data;

    $json_file_output = str_replace("\\","",json_encode($output, JSON_UNESCAPED_SLASHES));
    // print_r($json_file_output);
    $required_data_file = fopen("../data/candidate.json","w");
    fwrite($required_data_file , $json_file_output);
    fclose($required_data_file);
    ob_end_flush();
?>