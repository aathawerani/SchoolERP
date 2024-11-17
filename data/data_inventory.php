<?php
$tcf23db = NULL;
$tcfSchoolBooks = NULL; //all book in use by a unit

function dbConnect(){
	//if already connected do nothing and return;
	if(!(is_null($GLOBALS['tcf23db']) || $GLOBALS['tcf23db']->connect_errno)) return;
	//else connect to database
	include 'data_connection.php';
	$GLOBALS['tcf23db'] = mysqli_connect($hostname, $user, $pwd, $dbname);
	//check for errors
	if (mysqli_connect_errno()) {
	    echo "Something went wrong. Contact TCF Administrator. Provide the following.<br>";
	    echo mysqli_connect_error();
	    exit();
	}//end if
}//end dbconnet

function getSchoolBooks($schId){
	if(is_null($GLOBALS['tcf23db'])) dbConnect();

	mysqli_query($GLOBALS['tcf23db'],'SET CHARACTER SET utf8');
	if ($GLOBALS['tcfSchoolBooks']  = mysqli_query($GLOBALS['tcf23db'],"SELECT b.Book_Title, i.available, b.id, b.class, b.Subject, i.sch_invent_id, i.sch_id FROM tcf_sch_inventory i JOIN tcf_books b ON i.book_id = b.id WHERE i.sch_id = ".$schId." ORDER BY `b`.`Subject` ASC, `b`.`class` ASC;")) {
		
  		//echo "Returned rows are: " . mysqli_num_rows($GLOBALS['tcf_units']);
  		//echo "JSON Error:" . json_last_error_msg();
	}//end if
	else {
		echo "<h6>Some serious error has occured contact Headoffice<br>Error: ".
			mysqli_error($GLOBALS['tcf23db'])."</h6><br>";
	}//end else
}//end getAllSchools

function dbClose(){
	mysqli_close($GLOBALS['tcf23db']);
}

?>