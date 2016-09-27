<?php
define('CLIENT_ID', '1d3c2905-de8f-45f0-bb4f-5c4a7275d4c4');
define('CLIENT_SECRET', 'bocbFbIn1lzDhdJuX3b4vNpRDUOfHHsK');
define('USER', 'eSARGmbH.api');
define('PASS', 'paris_430');

function getAuthCode()
{
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

function doBullhornAuth($authCode)
{
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

function doBullhornLogin($accessToken)
{
$url = 'https://rest.bullhornstaffing.com/rest-services/login?version=*&access_token='.$accessToken;
$curl = curl_init( $url );
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
//curl_setopt($curl, CURLOPT_HEADER, true);
//curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
//curl_setopt($curl, CURLOPT_AUTOREFERER, true);
//curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 120);
//curl_setopt($curl, CURLOPT_TIMEOUT, 120);

$content = curl_exec( $curl );
curl_close( $curl );
return $content;
}

try {
$authCode = getAuthCode();//echo $authCode;die;
$auth = doBullhornAuth($authCode);//echo $auth;die;
$tokens = json_decode($auth);//print '<pre>';print_r($tokens);die;
$session = doBullhornLogin($tokens->access_token);
echo $session;die;
} catch (Exception $e) {
error_log($e->getMessage());
}