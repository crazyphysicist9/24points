//initial function
$(document).ready(function(){
    // to bind listeners
    $("#btnLoginSubmit").click(login);
    $("#btnRegisterSubmit").click(register);
    $("#btnRetry").click(retry);
    $("#btnLogout").click(logout);
    $("#btnStart").click(start);
    $("#btnAnswer").click(checkAnswer);
    $("#btnGuest").click(start);
   
    
    // to hide some divs to proper layout
    $("#divNumbers").hide();
    $("#divFeedback").hide();
    $("#divAnswer").hide();
    $("#divLeader").hide();
    $("#divRetry").hide();
    $("#divStart").hide();
    $("#divLogout").hide();
    $("#seconds").hide();

    window.round = 0; 
    window.username = null; 
    window.isLogged = false; 
    window.userid = 0; 
    window.isPlayed = false; 
    window.best = 999; 
    window.games = 0; 
    window.seconds = 0;
    var el = document.getElementById('seconds');

    function incrementSeconds() {
        window.seconds += 1;
        el.innerText = "Time score " + window.seconds + " seconds.";
    }

    var cancel = setInterval(incrementSeconds, 1000);
})

// log in
function login(){
    const username = $("#inLoginUsername").val(); // Get the username from the form
    const password = $("#inLoginPassword").val(); // Get the password from the form

    // Make a URL-encoded string for passing POST data:
    const data = { 'username': username, 'password': password};

    firebase.auth().signInWithEmailAndPassword(username, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });
    firebase.auth().onAuthStateChanged(function(user) {
        // console.log(user);
        if (user) {
          // User is signed in.
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
          // ...
          //alert(username+"signed in");
        } else {
          // User is signed out.
          // ...
        }
    });


    fetch("login.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 
                'content-type': 'application/json',
                'Accept': 'application/json'
            } 
    })
        .then(response => response.json())
        .then(
            data =>{
                if (data.success){
                    // actions after successfully logged in
                    alert("You are logged in. Enjoy!");
                    $("#divLogin").hide();      
                    $("#divRegister").hide();
                    $("#divStart").show();
                    $("#divLogout").show();
                    $("#divGuest").hide();      
                    if (data['best_score'] == 9999){
                        $("#divPB").text("Personal Best: No Record");
                    }else{
                        $("#divPB").text("Personal Best: "+data['best_score']);
                    }
                    
                    window.token = data.token;
                    window.username = data.username; 
                    window.isLogged = true; 
                    window.userid = data.user_id;
                    window.games = data.games_played; 
                    window.best = data.best_score; 


                    if (isPlayed) {
                        updateScore(); 
                        updateTime(); 
                        disLeader();
                    }
                }
                else{
                    alert("You are not logged in due to " + data.message);
                }
            }
        )
        .catch(error => console.error('Error:',error))
}

//function to log current user out
function logout(){
    fetch('logout.php', {
        method: "GET"
    })
    .then(response => response.json())
    .then(
        data => {
            if (data.success){
                window.round = 0; 
                window.username = null; 
                window.isLogged = false; 
                window.userid = 0; 
                window.isPlayed = false; 
                window.best = 999; 
                window.games = 0; 
                $("#divLogout").hide();
                $("#seconds").hide();
                $("#divPB").hide();
            }
        }
    )
    alert("You have successully logged out.");
    // actions after logged out
}   

//function to create new account
function register(){
    const username = $("#inRegisterUsername").val(); // Get the username from the form
    const password = $("#inRegisterPassword").val(); // Get the password from the form

    // Make a URL-encoded string for passing POST data:
    const data = { 'username': username, 'password': password }; 

    fetch("register.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    // This the way to print response text in the console log
    // .then(data => data.text())
    // .then(text => console.log(text))
    .then(response => response.json())
    .then(
        data => {
            if (data.success){
                // actions after registered
                $("#divRegister").hide();
                alert("You have succesfully signed up. You can now log in.");
            }
        }
    )
    .catch(error => console.error('Error:',error))
}

// function to re-play the game
function retry(){
    window.round = 0; 
    start();
}

//function to log current user out
function logout(){
    fetch('logout.php', {
        method: "GET"
    })
    alert("You have successully logged out.");
    $("#divNumbers").hide();
    $("#divFeedback").hide();
    $("#divAnswer").hide();
    $("#divLeader").hide();
    $("#divRetry").hide();
    $("#divLogin").show();
    $("#divRegister").show();
    $("#divStart").hide();
    $("#inLoginUsername").val("");
    $("#inLoginPassword").val("");
    $("#inRegisterUsername").val("");
    $("#inRegisterPassword").val("");
    $("#divPB").hide();
}   

function start(){
    $("#divNumbers").show();
    $("#divFeedback").show();
    $("#divAnswer").show();
    $("#divLeader").hide();
    $("#divRetry").hide();
    $("#divLogout").hide()
    newRound(); 
    $("#seconds").show();
    window.seconds=0;
}

function newRound() {
    generateNumbers(); 
}

function checkSolution(cnt, numbers){
    if (cnt != 0){
        $("#tdNum1").text(numbers[0]);
        $("#tdNum2").text(numbers[1]);
        $("#tdNum3").text(numbers[2]);
        $("#tdNum4").text(numbers[3]);
        $("#divStart").hide();
        $("#divAnswer").show();
        window.round++;
        $("#divRound").text("This is Round "+window.round);
        $("#divFeedback").text("");
    }else{
        generateNumbers();
    }
}

function generateNumbers() {
        let numbers=[]; 
        for (let i=0; i<4; i++){
            numbers[i] = Math.floor(Math.random() * 12) + 1;
        }
    
        // compile the url
        let site = "https://helloacm.com/api/24/?a="+numbers[0]+"&b="+numbers[1]+"&c="+numbers[2]+"&d="+numbers[3]


        // send numbers to API to verify if solution exists
        fetch(site)
        .then(function(response) {
            return response.json();
          })
          .then(function(myJson) {
            console.log(myJson);
            checkSolution(myJson.cnt, numbers); 
          });
        // This the way to print response text in the console log
        // .then(data => data.text())
        // .then(text => console.log(text))
        
        // .catch(error => console.error('Error:',error))
    // }
    
}

function checkAnswer() {
    let input = $("#inAnswer");
    if(/^[\d(]+.*[\d)]+$/.test(input.val())==false){
        alert("Invalid expression! Cannot end input with operators.")
    }
    else if (eval(input.val()) == 24 && window.round<3){
        generateNumbers();
        $("#inAnswer").val("");
        $("#divFeedback").text("Correct");
    }
    else if(eval (input.val()) == 24 && window.round == 3){
        finishGame(); 
        // alert("done!");
        $("#divRound").hide();
        $("#inAnswer").val("");
        $("#divStart").hide();
        $("#divFeedback").hide();
        $("#divAnswer").hide();
        $("#divLeader").show();
        $("#divRetry").show();
        $("#divNumbers").hide();
        $("#seconds").hide();
        $("#divLogout").show()
    }
    else if(eval(input.val()) != 24){
        $("#divFeedback").text("Wrong answer. Please try again.");
        $("#inAnswer").val("");
    }
}

function finishGame() {

    window.isPlayed = true; 
    if (window.isLogged) {
        updateScore(); 
        updateTime();
        disLeader(); 
        $("#seconds").hide();

    }else{
        $("#divLogin").show();
        alert("You can log or sign up in to record your score. "); 
    }
}

function updateScore() {
    window.score = window.seconds; // TODO: commen after timer enabled
    const data = { 'userid': window.userid, 'score': window.score}; 
    alert("Your Score: "+window.seconds);
    if (window.best>window.score) {
        fetch("updateScore.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        // This the way to print response text in the console log
        // .then(data => data.text())
        // .then(text => console.log(text))
        .then(response => response.json())
        .then(
            data => {
                console.log("updatescore says: "+data);
                if (data.success){
                    // actions after registered
                    //alert(data.best);
                    $("#divPB").text("Personal Best: "+window.seconds);
                    //alert("Your Score: "+window.seconds);
                }
            }
        )
        .catch(error => console.error('Error:',error))
    }

    
}

function updateTime() { 

    let games = window.games +1; 

    const data = { 'userid': window.userid, "games": games};

    fetch("updateTime.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    // This the way to print response text in the console log
    // .then(data => data.text())
    // .then(text => console.log(text))
    .then(response => response.json())
    .then(
        data => {
            if (data.success){
                // actions after registered
            }
        }
    )
    .catch(error => console.error('Error:',error))
}

function disLeader() {
    const data={}; 

    fetch("disLeader.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    // This the way to print response text in the console log
    // .then(data => data.text())
    // .then(text => console.log(text))
    .then(response => response.json())
    .then(
        data => {
            console.log(data);
            if (data.success){
                generateLeader(data);
                
            }
        }
    )
    .catch(error => console.error('Error:',error))
}

function generateLeader(data) {
    let $div = $("#divLeader"); 
    $div.empty();
    let $table = $("<table></table>");
    let $th1 = $("<th></th>").text("Rank");
    let $th2 = $("<th></th>").text("User");
    let $th3 = $("<th></th>").text("Games Played");
    let $th4 = $("<th></th>").text("Best Time");
    let $thRow = $("<tr></tr>"); 
    $thRow.append($th1);
    $thRow.append($th2);
    $thRow.append($th3);
    $thRow.append($th4);
    $table.append($thRow);

    let length = Object.keys(data).length-1;


    for (let ite = 0; ite<length; ite++) {
        let key = "record"+ite; 
            let $row = $("<tr></tr>");
            let $tdI = $("<td></td>");

            
            $tdI.text(ite+1);
            $row.append($tdI); 
            let $tdName = $("<td></td>");
            $tdName.text(data[key]['username']);
            $row.append($tdName);
            let $tdGames = $("<td></td>");
            $tdGames.text(data[key]['games_played']);
            $row.append($tdGames);
            let $tdScore = $("<td></td>");
            $tdScore.text(data[key]['best_score']);
            $row.append($tdScore);
            $table.append($row); 
        
    }
    $div.append($table);
}