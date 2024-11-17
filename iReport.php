<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<script type="text/javascript" src="./css/plotlymin.js"></script>
		<?php include './data/data_reports.php';
						dbConnect();
						getCountryWideCount();
						getRegionWideCount();
						getAreaWideCount();
						//downloadAll();
						dbClose();
		?>
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="icon" type="image/png" href="./images/favicon.png">
		<link rel="shortcut icon" type="image/png" href="./images/favicon.png">
		<link rel="stylesheet" href="./css/main.css">
		<title>TCF Planning</title>
		<script type="text/javascript">
		var cCount = <?php
						$rows = array();
						while ($row = mysqli_fetch_assoc($GLOBALS['cCount'])) {
							$rows[] = $row;
						}
		echo json_encode($rows);?>;
		var rCount = <?php
						$rows = array();
						while ($row = mysqli_fetch_assoc($GLOBALS['rCount'])) {
							$rows[] = $row;
						}
		echo json_encode($rows);?>;
		var aCount = <?php
						$rows = array();
						while ($row = mysqli_fetch_assoc($GLOBALS['aCount'])) {
							$rows[] = $row;
						}
		echo json_encode($rows);?>;
		</script>
		<script type="text/javascript" src="iReport.js"></script>
	</head>
	<body>
		<!-----------------------------------------------------------------
				CONTRY WIDE SECTION
		------------------------------------------------------------------>
		<section id="secPk" name="secPk" class="bigSection">
			<div class="hflex">
				<img src="./images/logo.svg" style="width: 140px;">
				<h1>&nbsp&nbspPlanning App</h1>
				<div class="hflex" style="justify-content: flex-end; flex-grow: 1; width: auto;">
				<button title="download" class="btn" onclick="onBtnDownload()">Download Excel</a>
				</div>
			</div>
			<div class="vflex" style="width: 100%; height: 80vh; min-height: 80vh;">
				<div id="dPkCounts" class="bigbars" href="#secReg"></div>
				<div class="hflex" class="secFooter" style="align-items: baseline;">
					<a id="btnGoToRegions" href="#secReg" class="btn">GO TO REGIONS</a>
				</div>
			</div>
		</section>
		<!-----------------------------------------------------------------
				REGION WIDE SECTION
		------------------------------------------------------------------>
		<section id="secReg" name="secReg" class="bigSection">
			<div class="vflex" style="width: 100%; height: 95vh; min-height: 95vh;">
				<div id="dRegCounts" class="bigbars"></div>
			</div>
		</section>
		<!-----------------------------------------------------------------
				AREA WIDE SECTION
		------------------------------------------------------------------>
		<section id="secArea" name="secArea" class="bigSection">
			<div class="hflex" class="secHeader" style="justify-content: space-between;">
				<div class="hflex" style="width: 35%;">
					<!-- <h2>Region: </h2> -->
					<select name ='ddReg' id ='ddReg' class = 'menu'>Select Region
						<option selected disabled hidden>Select Region</option>
						<option value = "North">North</option>
						<option value = "North West">North West</option>
						<option value = "Central">Central</option>
						<option value = "South">South</option>
						<option value = "South West">South West</option>
					</select>
					<h2 >Area: </h2>
					<h2 id="hAreaSelected" style="color: darkgreen; padding: 4px;">Click One</h2>
				</div>
				<div class="hflex" style="justify-content: flex-end; width: 40%; align-items: baseline;">
					<h2 id="hBadSchoolCountReg"><span id="spanBadCountReg" class="badCount" >0</span>
					schools in region have updated in last 
					</h2>
					<input type="number" step="1" min="1" max="30" id="iDaysOldReg" class="numDays" value="2" onchange="sBCRChange()">
					<h2>days</h2>
<!-- 					<a id="aGetCountReg" onclick="btnGetBadCount" class="btn">GO</a> -->
				</div>
				<div class="hflex" style="align-items: baseline; width: auto; flex-grow: 1; flex-shrink: 1; justify-content: flex-end;">
				<a id="btnGoToRegions" href="#secReg" class="btn">GO TO REGIONS</a>
				</div>
			</div>
			<div class="hflex">
				<div class="vflex" style="width: 35%; height: 90vh; min-height: 90vh; overflow: scroll;">
					<div id="dAreaCounts" class="bigbars"></div>
				</div>
				<div class="vflex" id="dAreaBooks" style="width: 65%; height: 90vh; min-height: 90vh; overflow:scroll;">
					
				</div>
			</div>
		</section>
		<!---------------------------------------------------------
			Section to Handle Schools Status after AREA is selected
		------------------------------------------------------------>
		<section id="secSchool" name="secSchool" class="bigSection">
			<div class="hflex" class="secHeader" style="justify-content: space-between; align-items: baseline;">
				<div class="hflex" style="width: 61%;">
					<h2 >Region: </h2>
					<h2 id="hRegSelected" style="color: darkgreen; padding: 4px;">Scroll up and select</h2>
					<h2 >&nbsp&nbspArea: </h2>
					<h2 id="hAreaSelected2" style="color: darkgreen; padding: 4px;">Scroll up and double click Graph</h2>
					<h2 >&nbsp&nbspSchool: </h2>
					<h2 id="hSchoolSelected" style="color: darkgreen; padding: 4px;">Click graph below</h2>
				</div>
				<div class="hflex" style="justify-content: flex-end; width: 28%;">
					<h2 id="hBadSchoolCountArea"><span id="spanBadCountArea" class="badCount" >0</span>
					schools have updated in last 
					</h2>
					<input type="number" step="1" min="1" max="30" id="iDaysOldArea" class="numDays" value="2"
					onchange="sBCAChange()">
					<h2>days</h2>
<!-- 					<a id="aGetCountArea" onclick="btnGetBadCount" class="btn">GO</a> -->
				</div>
				<a id="btnGoToArea" href="#secArea" class="btn">Area Selection</a>
			</div>
			<div class="hflex">
				<div class="vflex" style="width: 40%; height: 88vh; min-height: 88vh; overflow: scroll;">
					<div id="dSchoolCounts" class="bigbars"></div>
				</div>
				<div class="vflex" id="dSchoolBooks" style="width: 60%; height: 88vh; min-height: 88vh; overflow:scroll;">
					
				</div>
			</div>
		</section>
		<div class="hflex" class="secFooter" >
			<a id="btnGoHome" href="#secPk" class="float"><span class="my-float">HOME</span></a>
		</div>
	</body>
</html>