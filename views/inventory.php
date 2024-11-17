<!DOCTYPE html>
<html lang="ur">
	<head>
		<?php include '../data/data_inventory.php';?>
		<?php
			dbconnect();
			getSchoolBooks($_GET["schoolid"]);
		?>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Book Inventory</title>
		<link rel="icon" type="image/png" href="../images/favicon.png">
		<link rel="shortcut icon" type="image/png" href="../images/favicon.png">
		<link rel="stylesheet" href="../css/mobile.css">
		<script type="text/javascript">
		const schoolId = <?php echo $_GET['schoolid'];?>;
		const schooolName = "<?php echo $_GET['schoolname'];?>";
		var tcfUnitBooks = <?php
		$rows = array();
		while ($row = mysqli_fetch_assoc($GLOBALS['tcfSchoolBooks'])) {
			$rows[] = $row;
		}
		echo json_encode($rows);
		dbClose();
		?>;
		</script>
		<script type="text/javascript" src="inventory.js"></script>
	</head>
	<body>
		<div id="rootContainer" class="vflex">
			<h1 class="pageTitle">اسکول  ID: <?php echo $_GET['schoolid']."<br>".$_GET['schoolname']?><br>کتابوں کی تعداد  کی تصدیق کریں</h1>
			<div id="dBookContainer" class="vflex">
				
			</div>
		</div>
		<!-- Floation POP UP Confirmation Window-->
		<div id="myModal" class="modal">
			<div class="modal-content">
				<span class="close">&times;</span>
				<h5 class="modalMsg"></h5>
				<div class="modal-footer">
					<button id="cancelBtn" class="modalBtn">&times</button>
					<input type="number" step="1" id="inputNumber" style="width: 50%; height: 1.5cm;" oninput="iNumChange(this)">
					<button id="saveBtn" class="modalBtn" disabled="true">✓</button>
				</div>
			</div>
		</div>
		<a href="../index.html" class="float">
			<p class="my-float">مکمل
			</p>
		</a>
	</body>
</html>