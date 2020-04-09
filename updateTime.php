<?php
    header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

    ini_set("session.cookie_httponly", 1);//to prevent session hijacking
    
    //Because you are posting the data via fetch(), php has to retrieve it elsewhere.
    $json_str = file_get_contents('php://input');
    //This will store the data into an associative array
    $json_obj = json_decode($json_str, true);

    //Get variables from js 
    $userid = $json_obj['userid'];
    $games = $json_obj['games']; 
    
    require 'database.php'; //establish a database connection to execute sql commands
					
    $stmt = $mysqli->prepare("
                            Update users
                            set games_played = ?
                            where id = ?
                            ");

    // print a error if sql failed        
    if(!$stmt){
        //printf("<p class='error'>Query Prep Failed: %s\n </p>", $mysqli->error);
        echo json_encode(array(
            "success" => false,
            "message" => "Query0 Prep Failed: $mysqli->error"
        ));
        exit;
    }

    // Bind the parameter
	$stmt->bind_param('ss', $games, $userid);      
    $stmt->execute();

    $stmt->close();
    
    //return to js
    echo json_encode(array(
        "success" => true
    ));
?>