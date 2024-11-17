<?php
$areaName = urldecode(($_POST["areaName"]));
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

  $sql = $tcf23db->prepare("SELECT  SUM(CASE WHEN i.available <= 15 THEN 1 ELSE 0 END) as cRed, 
    SUM(CASE WHEN i.available >= 16 AND available <= 25 THEN 1 ELSE 0 END) as cYellow, 
    SUM(CASE WHEN i.available > 25 THEN 1 ELSE 0 END) as cGreen, b.Book_Title, b.class
    FROM tcf_sch_inventory i 
    JOIN tcf_school s ON i.sch_id = s.sch_id
    JOIN tcf_books b ON i.book_id = b.id
    WHERE s.area= ? AND s.closed_year IS NULL AND s.totalactiveunits > 0
    GROUP BY b.id
    ORDER BY b.Subject, b.class , b.Book_Title;");
  $sql->bind_param("s",$areaName);

  $sql->execute();
  $data = $sql->get_result();
  
  if ($data) {
    echo "
    <table class=\"greenTable\">
      <tr>
        <th>Book Title</th>
        <th>Class</th>
        <th>cRed</th>
        <th>cYellow</th>
        <th>cGreen</th>
      </tr>
    ";
    while ($row = $data->fetch_assoc()) {
        $cRed = $row['cRed'];
        $cYellow = $row['cYellow'];
        $cGreen = $row['cGreen'];
        $total = $cRed + $cYellow + $cGreen;
        $highlight = ($cRed / $total) > 0.2;
        echo '<tr>
          <td>'. $row['Book_Title']. '</td>
          <td>'. $row['class']. '</td>
          <td '; if ($highlight) echo 'class="row_alert"';echo '>'. $cRed. '</td>
          <td>'. $cYellow. '</td>
          <td>'. $cGreen. '</td>
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
