<?php
$tcf23db = NULL;
$tcf_school = NULL;

function dbConnect(){
	include '../data/data_connection.php';

	if((is_null($GLOBALS['tcf23db']) || $GLOBALS['tcf23db']->connect_errno)){
		$GLOBALS['tcf23db'] = new mysqli($hostname, $user, $pwd, $dbname);
		//check for errors
		if ($GLOBALS['tcf23db']->connect_error) {
			echo "Something went wrong. Contact TCF Administrator. Provide the following.<br>";
			die("Connection Error: ".$GLOBALS['tcf23db']->connect_error);
		}//end if connect_error
	}//end if isNull
}//end dbconnet

function getSchools(){
	if(is_null($GLOBALS['tcf23db'])) dbConnect();
	$sqlSchools = $GLOBALS['tcf23db']->prepare(
		"SELECT *  FROM tcf_school JOIN tcf_npdata ON sch_id = fk_sch_id;"
	);//end preparing query
	$sqlSchools->execute();
	$GLOBALS['tcf_school'] = $sqlSchools->get_result();
}//end getSchools

function dbClose(){
    $GLOBALS['tcf23db']->close();
}