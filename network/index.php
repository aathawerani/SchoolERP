<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="icon" type="image/png" href="../images/favicon.png">
		<link rel="shortcut icon" type="image/png" href="../images/favicon.png">
		<link rel="stylesheet" href="../css/main.css">
		<link rel="stylesheet" href="./second.css">
		<title>TCF Network</title>
		<!-- The Following Script was used to generate data that was later converted
		to a JS Array of Jsons. -->
		<!-- 		<script type="text/javascript">
		var dataSchools = <?php
						/*			include 'data_npdata.php';
			getSchools();
			$rows = array();
			while($row = $tcf_school->fetch_assoc()){
				$rows[] = $row;
			}
			echo json_encode($rows);
			dbClose();
		*/		?>;
		</script> -->
		<script type="text/javascript" src="arraySchools.js"></script>
		<script type="text/javascript" src="https://js.api.here.com/v3/3.1/mapsjs-core.js"></script>
		<script type="text/javascript" src="https://js.api.here.com/v3/3.1/mapsjs-service.js"></script>
		<script type="text/javascript" src="https://js.api.here.com/v3/3.1/mapsjs-ui.js"></script>
		<script type="text/javascript" src="https://js.api.here.com/v3/3.1/mapsjs-mapevents.js"></script>
		<script type="text/javascript" src="https://js.api.here.com/v3/3.1/mapsjs-clustering.js"></script>
		<link rel="stylesheet" type="text/css"
			href="https://js.api.here.com/v3/3.1/mapsjs-ui.css" />
			<script defer type="text/javascript" src="schplan.js"></script>
		</head>
		<body>
			<header>
				<div class="hflex">
					<img src="../images/logo.svg" style="width: 140px;">
					<h1 class="title">&nbsp&nbspNetwork Planning App</h1>
				</div>
			</header>
			<section id="secPk" name="secPk" class="bigSection">
				<div class="vflex" style="width: 100%; height: 80vh; min-height: 80vh;">
					<div class="hflex" style="height: 100%; min-height: 100%; width: 100%; flex-wrap: nowrap;">
						<div class="vflex" style="width: 80%;">
							<div id="dMap" class="bigbars" href="#secMap" >
							</div>
							<!-- ADD ANY UI ELEMENTS TO MAP -->
							<!-- 							<input type="range" id="zoomLevel" id="example" step="0.2" min="1" max="15" value="5.5"
							oninput="sliderZoomMoved(this)"> -->
						</div>
						<div class="vflex" style="width: 20%;">
							<div id="dClusterBox"></div>
							<h1 class="title">E-Compounds</h1>
						<div id="dSchBoxes">
						</div>
						</div>
					</div>
					
					<div class="hflex" class="secFooter" style="align-items: baseline;">
						<select name ='sReg' id ='sReg' class = 'menu'>
							<option selected value="All">All</option>
							<option value = "North">North</option>
							<option value = "North West">North West</option>
							<option value = "Central">Central</option>
							<option value = "South">South</option>
							<option value = "South West">South West</option>
						</select>
						<label for="sCity">City:</label>
						<select id="sCity" class = 'menu'>
							<option selected disabled hidden value="Select">Select One</option>
						</select>
						<label for="sArea">Area:</label>
						<select id="sArea" class = 'menu'>
							<option selected disabled hidden value="Select">Select One</option>
						</select>
						<label for="sCluster">Cluster:</label>
						<select id="sCluster" class = 'menu'>
							<option selected disabled hidden value="Select">Select One</option>
						</select>
					</div>
				</div>
			</section>
			<div class="hflex" class="" >
				<!-- 				<a id="btnGoHome" href="#secPk" class="float"><span class="my-float">HOME</span></a> -->
				<div id="printInfo">
				</div>
			</div>
		</body>
	</html>