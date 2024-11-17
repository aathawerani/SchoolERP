<?php
$tcf23db = NULL;
$tcfSchoolBooks = NULL; //all book in use by a unit
$cCount = NULL;//count of red yellow green books country wide
$rCount = NULL;//count of red yellow green books Region Wide
$aCount = NULL;

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

function getCountryWideCount(){
	if(is_null($GLOBALS['tcf23db'])) dbConnect();

	mysqli_query($GLOBALS['tcf23db'],'SET CHARACTER SET utf8');
	if ($GLOBALS['cCount']  = mysqli_query($GLOBALS['tcf23db'],
		"SELECT 	SUM(CASE WHEN available < 15 THEN 1 ELSE 0 END) as cRed, 
		SUM(CASE WHEN available >= 16 AND available <= 25 THEN 1 ELSE 0 END) as cYellow, 
		SUM(CASE WHEN available > 25 THEN 1 ELSE 0 END) as cGreen 
		FROM tcf_sch_inventory i JOIN tcf_school s ON i.sch_id = s.sch_id
		WHERE region!='PS - North' AND region!='PS - South' AND region!='PS - North' AND region!='Test Region for App' AND s.closed_year IS NULL AND s.totalactiveunits > 0;")) {
		
  		//echo "Returned rows are: " . mysqli_num_rows($GLOBALS['tcf_units']);
  		//echo "JSON Error:" . json_last_error_msg();
	}//end if
	else {
		echo "<h6>Some serious error has occured contact Headoffice<br>Error: ".
			mysqli_error($GLOBALS['tcf23db'])."</h6><br>";
	}//end else
}//end getCountryWideCount

function getRegionWideCount(){
	if(is_null($GLOBALS['tcf23db'])) dbConnect();

	mysqli_query($GLOBALS['tcf23db'],'SET CHARACTER SET utf8');
	if ($GLOBALS['rCount']  = mysqli_query($GLOBALS['tcf23db'],
		"SELECT 	s.region, SUM(CASE WHEN i.available < 15 THEN 1 ELSE 0 END) as cRed, 
			SUM(CASE WHEN i.available >= 16 AND available <= 25 THEN 1 ELSE 0 END) as cYellow, 
			SUM(CASE WHEN i.available > 25 THEN 1 ELSE 0 END) as cGreen   
		FROM tcf_sch_inventory i JOIN tcf_school s ON i.sch_id = s.sch_id 
		WHERE region!='PS - North' AND region!='PS - South' AND region!='PS - North' AND region!='Test Region for App' AND s.closed_year IS NULL AND s.totalactiveunits > 0
		GROUP BY region;"))
	{
		//Do Nothing for now;
	}//end if
	else {
		echo "<h6>Some serious error has occured contact Headoffice<br>Error: ".
			mysqli_error($GLOBALS['tcf23db'])."</h6><br>";
	}//end else

}

function getAreaWideCount(){
	if(is_null($GLOBALS['tcf23db'])) dbConnect();

	mysqli_query($GLOBALS['tcf23db'],'SET CHARACTER SET utf8');
	if ($GLOBALS['aCount']  = mysqli_query($GLOBALS['tcf23db'],
		"SELECT s.region, s.area, SUM(CASE WHEN i.available <= 15 THEN 1 ELSE 0 END) as cRed, 
			SUM(CASE WHEN i.available >= 16 AND available <= 25 THEN 1 ELSE 0 END) as cYellow, 
			SUM(CASE WHEN i.available > 25 THEN 1 ELSE 0 END) as cGreen 
			FROM tcf_sch_inventory i JOIN tcf_school s ON i.sch_id = s.sch_id 
			WHERE region!='PS - North' AND region!='PS - South' AND region!='PS - North' AND region!='Test Region for App' AND s.closed_year IS NULL AND s.totalactiveunits > 0
			GROUP BY region, area;"))
	{
		//Do Nothing for now;
	}//end if
	else {
		echo "<h6>Some serious error has occured contact Headoffice<br>Error: ".
			mysqli_error($GLOBALS['tcf23db'])."</h6><br>";
	}//end else

}


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


function downloadAll(){
	if(is_null($GLOBALS['tcf23db'])) dbConnect();
	$sql = "SELECT `tcf_school`.`region` AS `region`, `tcf_school`.`area` AS `area`, `tcf_school`.`name` AS `name`, `tcf_school`.`totalunits` AS `totalunits`, `tcf_books`.`class` AS `class`, `tcf_books`.`Subject` AS `Subject`, `tcf_books`.`Book_Title` AS `Book_Title`, `tcf_sch_inventory`.`available` AS `available` 
		FROM ((`tcf_school` join `tcf_sch_inventory` 
				on(`tcf_school`.`sch_id` = `tcf_sch_inventory`.`sch_id`
					AND `tcf_school`.closed_year IS NULL 
					AND `tcf_school`.totalactiveunits > 0
				)
		) 
		join `tcf_books` on(`tcf_sch_inventory`.`book_id` = `tcf_books`.`id`)) ;";
	if($result = mysqli_query($GLOBALS['tcf23db'],$sql)){
		$csvFile = fopen('./data.csv', 'w');
		fputcsv($csvFile, array('region','area','name','totalunits','class','Subject','Book_Title','available'));
		while ($row = mysqli_fetch_assoc($result)) {
    		fputcsv($csvFile, $row);
		}
		fclose($csvFile);
	}else {
		echo "<h6>Some serious error has occured contact Headoffice<br>Error: ".
			mysqli_error($GLOBALS['tcf23db'])."</h6><br>";		
	}
}

function dbClose(){
	mysqli_close($GLOBALS['tcf23db']);
}

?>