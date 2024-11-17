<?php
    $tcf23db = NULL;
    $data = NULL;

      //if not already connected try connecting;
    include 'data_connection.php';
    if((is_null($tcf23db) || $tcf23db->connect_errno)){
        $tcf23db = new mysqli($hostname, $user, $pwd, $dbname);
        //check for errors
        if ($tcf23db->connect_error) {
        echo "Something went wrong. Contact TCF Administrator. Provide the following.<br>";
        die("Connection Error: ".$tcf23db->connect_error);
        }//end if connect_error
    }//end if isNull
    
    $tcf23db->set_charset("utf8");

if($_SERVER['REQUEST_METHOD'] != 'GET'){

    $areaName = urldecode(($_POST["areaName"]));
    $regName = urldecode(($_POST["regName"]));
    $daysOld = urldecode(($_POST["days"]));
    $sqlArea = $tcf23db->prepare("SELECT COUNT(i2.sch_id) as aCount FROM (
                          SELECT i.sch_id, MAX(i.modified) AS latest FROM 
                          tcf_sch_inventory i 
                          JOIN tcf_school s ON i.sch_id = s.sch_id
                          WHERE s.area = ? AND s.closed_year IS NULL AND s.totalactiveunits > 0
                          GROUP BY s.sch_id) i2
                          WHERE latest > DATE_SUB(DATE(NOW()), INTERVAL ? DAY);");//end prepare
    $sqlArea->bind_param("si",$areaName,$daysOld);

    $sqlReg = $tcf23db->prepare("SELECT COUNT(i2.sch_id) as rCount FROM (
                          SELECT i.sch_id, MAX(i.modified) AS latest FROM 
                          tcf_sch_inventory i 
                          JOIN tcf_school s ON i.sch_id = s.sch_id
                          WHERE s.region = ? AND s.closed_year IS NULL AND s.totalactiveunits > 0
                          GROUP BY s.sch_id) i2
                          WHERE latest > DATE_SUB(DATE(NOW()), INTERVAL ? DAY);"
                    );//end prepare
    $sqlReg->bind_param("si",$regName,$daysOld);

    $sqlCount = $tcf23db->prepare("SELECT 
                      SUM(CASE WHEN Region = ? THEN 1 ELSE 0 END) AS tRCount,
                      SUM(CASE WHEN Area = ? THEN 1 ELSE 0 END) AS tACount
                      FROM tcf_school WHERE closed_year IS NULL AND totalactiveunits > 0;"
                  );//end prepare
    $sqlCount->bind_param("ss",$regName, $areaName);
    
    $rows = array();
    $rows[] = json_decode('{"rCount":0}');
    $rows[] = json_decode('{"aCount":0}');

    $sqlReg->execute(); 
    $dataR = $sqlReg->get_result();
    if($dataR){
      $rows[0] = $dataR->fetch_assoc();
      $sqlArea->execute();
      $dataA = $sqlArea->get_result();
      if($dataA) {
        $rows[1] = $dataA->fetch_assoc();
      }
      $sqlCount->execute();
      $dataCount = $sqlCount->get_result();
      if($dataCount) $rows[2] = $dataCount->fetch_assoc();

      echo json_encode($rows);
        /*$tcf23db->query('INSERT INTO logger (text) VALUES ("'.$areaName.': '.$daysOld.'");');*/
        $dataA->free_result();
        $dataR->free_result();
        $dataCount->free_result();

    } else {
      die ("{'Error': 'Error Finding Record, " . $tcf23db->error . " + ".$regName."'\n".$sql."}");
      $tcf23db->close();  
    }
    $tcf23db->close();
    exit();
}//if server method
else{
  /*-------------------------------------------------------------
                    IT IS A GET REQUEST
  -------------------------------------------------------------*/
  //Save Dump data in csv file and return the file
  $sql = "SELECT `tcf_school`.`region` AS `region`, `tcf_school`.`area` AS `area`, `tcf_school`.`name` AS `name`, `tcf_school`.`totalunits` AS `totalunits`, `tcf_books`.`class` AS `class`, `tcf_books`.`Subject` AS `Subject`, `tcf_books`.`Book_Title` AS `Book_Title`, `tcf_sch_inventory`.`available` AS `available` 
    FROM ((`tcf_school` join `tcf_sch_inventory` on(`tcf_school`.`sch_id` = `tcf_sch_inventory`.`sch_id`)) 
    join `tcf_books` on(`tcf_sch_inventory`.`book_id` = `tcf_books`.`id`)) ;";
  $result = NULL;
  if($result = $tcf23db->query($sql) ) {
    header("Content-Type: text/csv");
    header("Content-Disposition: attachment; filename={'data.csv'}");

    $csvFile = fopen('php://output', 'w');

    fputcsv($csvFile, array('region','area','name','totalunits','class','Subject','Book_Title','available'));

    while ($row = $result->fetch_assoc()) {
        fputcsv($csvFile, $row);
    }

    fclose($csvFile);
    $result->free_result();
    $tcf23db->close();
    exit();
  }else {
    echo "<h6>Some serious error has occured contact Headoffice<br>Error: ".
      mysqli_error($tcf23db)."</h6><br>";    
  }
  
}//end else
?>