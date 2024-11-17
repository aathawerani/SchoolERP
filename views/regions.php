<!DOCTYPE html>
<html lang="ur">
<head>
	<?php include '../data/data_school.php';?>
	<?php 	
		dbconnect();
		getOnlySChools(); 	
	?>

	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Book Inventory</title>
	<link rel="stylesheet" href="../css/mobile.css">
	<link rel="icon" type="image/png" href="../images/favicon.png">
	<link rel="shortcut icon" type="image/png" href="../images/favicon.png">
	<script type="text/javascript">
  		var tcf_schools = <?php 
  		$rows = array();
  		while ($row = mysqli_fetch_assoc($GLOBALS['tcf_school'])) {
  			$rows[] = $row;
  		}
  		echo json_encode($rows);
  		dbClose();
		?>;
	</script>
	<script type="text/javascript" src="regions.js"></script>
</head>
<body>
<div id="regContainer" class="vflex">
		<div class="hflex" style="height: 12%; align-content: center; ">
			<img src="../images/logo.svg" style="padding: 20% 25%;">
		</div>
        <div id="lvl2a" class="hflex">
		<!--
		<button class="btn" type="button" onclick="btnRegionClick('PS - North')">PS North</button>
		-->
		</div>
        
		<div id="lvl2a" class="hflex">
		<button class="btn" type="button" onclick="btnRegionClick('North West')">North<br>West</button>
		<button class="btn" type="button" onclick="btnRegionClick('North')">North</button>
		</div>

		<div id="lvl2b" class="hflex">
		<button class="btn" type="button" onclick="btnRegionClick('Central')">Central</button>
		</div>
		
		<div id="lvl2b" class="hflex">
		<button class="btn" type="button" onclick="btnRegionClick('South West')">South<br>West</button>
		<button class="btn" type="button" onclick="btnRegionClick('South')">South</button>
		</div>

		<div id="lvl2b" class="hflex">	
        <!--
		<button class="btn" type="button" onclick="btnRegionClick('PS - South')">PS South</button>
        -->
		</div>
</div>
<div id="areaContainer" class="vflex" style="display: none;">
		<div id="lvl2areaCon" class="hflex">
			<h1 class="title" id="h1AreaConTitle">Region </h1>
		</div>
</div>

<div id="clusterContainer" class="vflex" style="display: none;">
		<div id="lvl2clusterCon" class="hflex">
			<h1 class="title" id="h1ClusterConTitle">Area </h1>
		</div>
</div>


<div id="schoolContainer" class="vflex" style="display: none;">
		<div id="lvl2schoolCon" class="hflex">
			<h1 class="title" id="h1SchoolConTitle">Cluster </h1>
		</div>
</div>

<div id="unitContainer" class="vflex" style="display: none;">
		<div id="lvl2unitCon" class="hflex">
			<h1 class="title" id="h1UnitConTitle">School </h1>
		</div>
</div>


</body>
</html>