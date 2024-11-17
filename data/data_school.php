<?php
$tcf23db = NULL;
$tcf_school = NULL;
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

function getAllSchools(){
	if(is_null($GLOBALS['tcf23db'])) dbConnect();

	mysqli_query($GLOBALS['tcf23db'],'SET CHARACTER SET utf8');
	if ($GLOBALS['tcf_units']  = mysqli_query($GLOBALS['tcf23db'], "SELECT * FROM tcf_units")) {
  		//echo "Returned rows are: " . mysqli_num_rows($GLOBALS['tcf_units']);
  		//echo "JSON Error:" . json_last_error_msg();
	}//end if
	else{
		echo "<h6>Some serious error has occured contact Headoffice<br>Error: ".
			mysqli_error($GLOBALS['tcf23db'])."</h6><br>";
	}
}//end getAllSchools

//Gets info of all schools but not the units
function getOnlySchools(){
	if(is_null($GLOBALS['tcf23db'])) dbConnect();
	mysqli_query($GLOBALS['tcf23db'],'SET CHARACTER SET utf8');

	if ($GLOBALS['tcf_school']  = mysqli_query($GLOBALS['tcf23db'], "SELECT sch_id, name, region, area, cluster, shift, type  FROM tcf_school
		WHERE closed_year IS NULL AND totalactiveunits > 0;")) {
  		//echo "Returned rows are: " . mysqli_num_rows($GLOBALS['tcf_units']);
  		//echo "JSON Error:" . json_last_error_msg();
	}
	else{
		echo "<h6>Some serious error has occured contact Headoffice<br>Error: ".
			mysqli_error($GLOBALS['tcf23db'])."</h6><br>";
	}
}

function dbClose(){
	mysqli_close($GLOBALS['tcf23db']);
}
?>