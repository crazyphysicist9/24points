<?php
    header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

	ini_set("session.cookie_httponly", 1);//to prevent session hijacking

	$json_str = file_get_contents('php://input');
	$json_obj = json_decode($json_str, true);

	// acquire vars from json structure
	$userid = $json_obj['userid'];
    $score = $json_obj['score'];
    
    // $isUpdated = false; 

	// Check to see if the username and password are valid.  (You learned how to do this in Module 3.)
	require 'database.php'; //establish a database connection to execute sql commands
					
    $stmt=$mysqli->prepare("
                            Update users
                            set best_score = ?
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
	$stmt->bind_param('ss', $score, $userid);      
    $stmt->execute();
    $stmt->close();
    
    //return to js
    echo json_encode(array(
        "success" => true, 
        "best" => $score
    ));
?>