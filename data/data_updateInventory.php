<?php
  $data = json_decode($_POST["book"], true);
  $tcf23db = NULL;

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

  $sql = "UPDATE tcf_sch_inventory SET available = '".$data["available"]."' WHERE sch_invent_id = ".$data["sch_invent_id"];
  
  if ($tcf23db->query($sql) === TRUE) {
    echo "Record updated successfully";
  } else {
    echo "Error updating record: " . $tcf23db->error;
  }
  
  $tcf23db->close();
?>
