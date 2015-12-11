<?php
	//get the code from url
	$code = $_GET["code"];
	
	//application specific declarations
	$domain = "pays-system.com";
	$clientId = "41a888d71e754ee99167eaebecace9c1";
	$clientSecret = "17a97490fb804cb29935bb8c0a141c4a";

	//access token url
	$url = 'http://185.23.171.43/oauth2/token';
	$user_retrieve_url = 'http://185.23.171.43/user?access_token=';
	
	//payload params for the request token
	$payload = http_build_query(
		array(
			'grant_type' => 'authorization_code',
			'code' => $code,
			'redirect_uri' => 'http://'. $domain . '/callback.php',
			'client_id' => $clientId,
			'client_secret' => $clientSecret
		)
	);

	//extra header for the request
	$header = array("Content-Type" => "application/x-www-form-urlencoded", "Authorization"=>"Basic");
  
  	//actual request implementation
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_MUTE, 1);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
	curl_setopt($ch, CURLOPT_USERPWD, $clientId . ":" . $clientSecret); 
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	$output = curl_exec($ch);
	curl_close($ch);

	//get the access token from the json response
	$jsonData = json_decode($output,true);
	$access_token = $jsonData["access_token"];


	//get user data from url
	$ch_user = curl_init($user_retrieve_url .$access_token);
	curl_setopt($ch_user, CURLOPT_MUTE, 1);
	curl_setopt($ch_user, CURLOPT_SSL_VERIFYHOST, 0);
	curl_setopt($ch_user, CURLOPT_SSL_VERIFYPEER, 0);
	curl_setopt($ch_user, CURLOPT_GET, 1);
	curl_setopt($ch_user, CURLOPT_RETURNTRANSFER, 1);
	$user_output = curl_exec($ch_user);
	curl_close($ch_user);

	$user_jsonData = json_decode($user_output, true);
	$user_id = $user_jsonData["id"];
	$user_roles = $user_jsonData["roles"];
	//check roles and redirect to a correct page
	foreach ($user_roles as $u_role) {
	   if ($u_role['name'] === 'pays_admin') {
			header('Location: http://www.' .$domain . '/admin/#redirection?token=' .$access_token . '&id=' .$user_id .'&role=admin');
			break;
		} else if ($u_role['name'] === 'pays_buyer') {
			header('Location: http://www.' .$domain . '/#/redirection/token/' .$access_token . '/id/' .$user_id .'/role/C');
			break;
		} else if ($u_role['name'] === 'pays_distributor') {
			header('Location: http://www.' .$domain . '/#/redirection/token/' .$access_token . '/id/' .$user_id .'/role/T');
			break;
		} else if ($u_role['name'] === 'pays_farmer') {
			header('Location: http://www.' .$domain . '/#/redirection/token=' .$access_token . '/id/' .$user_id .'/role/F');
			break;
		} else {
			continue;
		}
	}
?>