<?php
    header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

	ini_set("session.cookie_httponly", 1);//to prevent session hijacking

	$json_str = file_get_contents('php://input');
	$json_obj = json_decode($json_str, true);

	// acquire vars from json structure
	$userid = $json_obj['userid'];
    $score = $json_obj['score'];
    
    $isUpdated = false; 

	// Check to see if the username and password are valid.  (You learned how to do this in Module 3.)
	require 'database.php'; //establish a database connection to execute sql commands
					
	// Use a prepared statement
    $stmt = $mysqli->prepare("SELECT username, best_score, time FROM users WHERE id=?");

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
	$stmt->bind_param('s', $userid);      
	$stmt->execute();

	// Bind the results
	$stmt->bind_result($username, $best_score, $time);
    $stmt->fetch();
    
    $time++; 

    if ($best_score > $score || $best_score == NULL) {
        // Use a prepared statement
        $stmt1 = $mysqli->prepare("UPDATE users
                                    SET best_score = ?, time = ?
                                    WHERE id = ?;
                                ");

        // print a error if sql failed        
        if(!$stmt1){
            //printf("<p class='error'>Query Prep Failed: %s\n </p>", $mysqli->error);
            echo json_encode(array(
                "success" => false,
                "message" => "Query1 Prep Failed: $mysqli->error"
            ));
            exit;
        }

        // Bind the parameter
        $stmt1->bind_param('sss', $score, $time, $userid);
        $stmt1->execute();
        $stmt1->close();

        $isUpdated = true; 
    }else{
        // Use a prepared statement
        $stmt1 = $mysqli->prepare("UPDATE users
                                    SET time = ?
                                    WHERE id = ?;
                                ");

        // print a error if sql failed        
        if(!$stmt1){
            //printf("<p class='error'>Query Prep Failed: %s\n </p>", $mysqli->error);
            echo json_encode(array(
                "success" => false,
                "message" => "Query2 Prep Failed: $mysqli->error"
            ));
            exit;
        }

        // Bind the parameter
        $stmt1->bind_param('ss', $time, $userid);
        $stmt1->execute();
        $stmt1->close();
    }

    $stmt2 = $mysqli->prepare("SELECT username, best_score, time FROM users");

    // print a error if sql failed        
    if(!$stmt2){
        //printf("<p class='error'>Query Prep Failed: %s\n </p>", $mysqli->error);
        echo json_encode(array(
            "success" => false,
            "message" => "Query Prep Failed: $mysqli->error"
        ));
        exit;
    }

    // Bind the parameter
	// $stmt2->bind_param('s', $userid);      
	$stmt2->execute();

	// Bind the results
	$stmt2->bind_result($arrUsername, $arrBest_score, $arrTime);
    $stmt2->fetch();
    
    $response = array(); 
    
    while($stmt2->fetch()){

            $record = array();
            $record["username"] = $arrUsername; 
            $record["score"] = $arrBest_score; 
            $record["time"] = $arrTime; 
            array_push($response, $record);
            //$current_response=array("event_$ite" => $current_event);
            //array_push($response_array, $current_response);
            // $current_event_id="event_".$ite;
            // $response_array[$current_event_id]=$current_event;
            // $ite=$ite+1; 
    
    }

    $response["isUpdated"] = $isUpdated; 
    $response["success"] = true; 

    echo json_encode($response);
?>