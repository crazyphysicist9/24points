<?php
    header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

	ini_set("session.cookie_httponly", 1);//to prevent session hijacking

	$json_str = file_get_contents('php://input');
	$json_obj = json_decode($json_str, true);

	require 'database.php'; //establish a database connection to execute sql commands
					
	// Use a prepared statement
	$stmt = $mysqli->prepare("SELECT username, games_played, best_score FROM users order by best_score");

    if(!$stmt){
        //printf("<p class='error'>Query Prep Failed: %s\n </p>", $mysqli->error);
        echo json_encode(array(
            "success" => false,
            "message" => "Query0 Prep Failed: $mysqli->error"
        ));
        exit;
    }

	// Bind the parameter
	// $stmt->bind_param('s', $username);      
	$stmt->execute();

	// Bind the results
	$stmt->bind_result($username, $games_played, $best_score);
    $stmt->fetch();
    
    $response = array();

    $ite = 0; 
    while($stmt->fetch()){

            $record = array(
                "username" => $username, 
                "games_played" => $games_played, 
                "best_score" => $best_score
            );
            // $record["username"] = $username; 
            // $record["games_played"] = $games_played; 
            // $record["best_score"] = $best_score; 
            $key = "record".$ite; 
            $response[$key] = $record; 
            $ite++; 
    }
    $lask = "record".$ite; 
    // $response[$last] = {"username": "test", "games_played": 1, "best_score": 2:09};
    $response['success'] = true; 

    

    
    echo json_encode($response);

    exit; 
?>