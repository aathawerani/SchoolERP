<?php
$schID = urldecode(($_POST["schID"]));
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

  $sql = $tcf23db->prepare("SELECT  b.Book_Title, b.class, i.available, b.id
      FROM tcf_sch_inventory i 
      JOIN tcf_school s ON i.sch_id = s.sch_id
      JOIN tcf_books b ON i.book_id = b.id
      WHERE s.sch_id= ?
      GROUP BY b.id
      ORDER BY b.Subject, b.class , b.Book_Title;");
  $sql->bind_param("i",$schID);

  $sql->execute();
  $data = $sql->get_result();
  
  if ($data) {
    echo "
    <table class=\"greenTable\">
      <tr>
        <th>Book Title</th>
        <th>Available</th>
        <th>Class</th>
      </tr>
    ";
    while ($row = $data->fetch_assoc()) {
        $available = $row['available'];
        if($available <= 15) $highlight = 'cRed';
        else if ($available > 15 && $available <=25) $highlight = 'cYellow';
        else $highlight = 'cGreen';
        echo '<tr class="'.$highlight.'">
          <td>'. $row['Book_Title']. '</td>
          <td>'. $available. '</td>
          <td>'. $row['class']. '</td>
        </tr>';        
    }//end while

    echo "</table>";
    
    $tcf23db->close();

  } 
  else {
    die ("{'Error': 'Error Finding Record, " . $tcf23db->error . " + ".$areaName."'\n".$sql."}");
    $tcf23db->close();
  }
  
  ?>
