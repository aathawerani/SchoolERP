<?php
$areaName = urldecode(($_POST["areaName"]));
$tcf23db = NULL;
$data = NULL;
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
$sql = $tcf23db->prepare("SELECT  SUM(CASE WHEN i.available <= 15 THEN 1 ELSE 0 END) as cRed, 
  SUM(CASE WHEN i.available >= 16 AND available <= 25 THEN 1 ELSE 0 END) as cYellow, 
  SUM(CASE WHEN i.available > 25 THEN 1 ELSE 0 END) as cGreen, s.name as school, s.area, s.sch_id, s.cluster
  FROM tcf_sch_inventory i 
  JOIN tcf_school s ON i.sch_id = s.sch_id
  JOIN tcf_books b ON i.book_id = b.id
  WHERE s.area= ? AND s.closed_year IS NULL AND s.totalactiveunits > 0
  GROUP BY school
  ORDER BY cluster;");
$sql->bind_param("s",$areaName);

$sql->execute();
$data = $sql->get_result();

if ($data) {
  $rows = array();
  while ($row = $data->fetch_assoc()) {
    $rows[] = $row;
  }//end while
  echo json_encode(mb_convert_encoding($rows, "UTF-8","UTF-8"));

/*  $tcf23db->query('INSERT INTO logger (text) VALUES ("'.$areaName.'");');
  $tcf23db->query('INSERT INTO logger (text) VALUES ("'.implode(", ",$rows[0]).'");');
*/
  $tcf23db->close();
} 
else {
  die ("{'Error': 'Error Finding Record, " . $tcf23db->error . " + ".$areaName."'\n".$sql."}");
  $tcf23db->close();
}//end else

?>
