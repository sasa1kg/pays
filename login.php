<?php
	//application specific variables
	$clientId = "41a888d71e754ee99167eaebecace9c1";
	$domain = "pays-system.com";

	//redirect url for the user to authenticate 
	//itself using the fi-ware oauth
	$newURL = "http://185.23.171.43/oauth2/authorize"
		. "?response_type=code"
		. "&client_id=". $clientId
		. "&state=xyz"
		. "&redirect_uri=http%3A%2F%2F".$domain
		. "%2Fcallback.php";

	//actual redirect
	header('Location: '.$newURL);
?>