var sRegion, sArea, sCluster, sSchool;// selected region by user
var regContainer;//flex container for region buttons
var areaContainer;//
var h1AreaConTitle;
var arrAreaList;
var arrAreas;
var clusterContainer;
var h1ClusterConTitle;
var arrClusterList;
var arrClusters;
var schoolContainer;
var h1SchoolConTitle;
var arrSchoolList;
var arrSchools;
var arrUnitList;
var arrUnits

window.onload = function(){
	regContainer = document.getElementById('regContainer');
	areaContainer = document.getElementById('areaContainer');
	h1AreaConTitle = document.getElementById('h1AreaConTitle');
	clusterContainer = document.getElementById('clusterContainer');
	h1ClusterConTitle = document.getElementById('h1ClusterConTitle');
	schoolContainer = document.getElementById('schoolContainer');
	h1SchoolConTitle = document.getElementById('h1SchoolConTitle');
}//end window.load

function btnRegionClick(ilaqa){
	sRegion = ilaqa;
	regContainer.style.display = "none";
	areaContainer.style.display = "flex";
	h1AreaConTitle.innerHTML = "Region "+sRegion;
	arrAreaList = tcf_schools.filter(obj=>obj.region == sRegion);
	arrAreas = arrAreaList.map(item => item.area)
				.filter((value, index, self) => self.indexOf(value) === index);
	populateAreas(areaContainer,sRegion);
}//end btnRegionClick

function populateAreas(e, ilaqa){
	arrAreas.sort();
	arrAreas.forEach(function(row){
		e.innerHTML += '<div id="lvl2b" class="hflex"><button class="abtn" type="button" onclick="btnAreaClick(\''+row+'\')">'+row+'</button></div>';
	})//end foreach
}//end function populateAreas

function btnAreaClick(ilaqa){
	sArea = ilaqa;
	areaContainer.style.display = "none";
	clusterContainer.style.display = "flex";
	h1ClusterConTitle.innerHTML = "Region "+sRegion+", "+sArea;
	arrClusterList = arrAreaList.filter(obj=>obj.area == sArea);
	arrClusters = arrClusterList.map(item => item.cluster)
					.filter((value, index, self) => self.indexOf(value) === index);
	populateClusters(clusterContainer,sArea);
}//end btnAreaClick

function populateClusters(e, ilaqa){
/*	if(arrClusters.length >20) e.parentNode.parentNode.style.height = "280%";
	else if(arrClusters.length >15) e.parentNode.parentNode.style.height = "180%";
	else if(arrClusters.length >10) e.parentNode.parentNode.style.height = "120%";
*/	e.parentNode.parentNode.style.height = ""+arrClusters.length * 80+"px";
	arrClusters.sort();
	arrClusters.forEach(function(row){
		e.innerHTML += '<div id="lvl2c" class="hflex"><button class="abtn" type="button" onclick="btnClusterClick(\''+row+'\')">'+row+'</button></div>';
	})//end foreach
}//end populateClusters

function btnClusterClick(ilaqa){	
	sCluster = ilaqa;
	clusterContainer.style.display = "none";
	schoolContainer.style.display = "flex";
	h1SchoolConTitle.innerHTML = "Region "+sRegion+", "+sArea+", "+sCluster;
	arrSchoolList = arrAreaList.filter(obj=>obj.cluster == sCluster);
	arrSchools = arrSchoolList.map(item => JSON.stringify([item.name, item.sch_id]));
	arrSchools = arrSchools.filter((value, index, self) => self.indexOf(value) === index).map(JSON.parse);
	populateSchools(schoolContainer,sCluster);
}// end btnClusterClick

function populateSchools(e, ilaqa){
	console.log("Success!"+ilaqa);
	arrSchools.sort((a, b) => a[1] -  b[1]);
	e.parentNode.parentNode.style.height = ""+arrSchools.length * 95+"px";
    if(arrSchools.length < 4) e.parentNode.parentNode.style.height = "450px";
	arrSchools.forEach(function(row){
		e.innerHTML += '<div id="lvl2d" class="hflex"><button class="abtn" type="button" onclick="btnSchoolClick([\''+row[0]+'\','+row[1]+'])">اسکول ID:'+row[1]+'<br><br>'+row[0]+'</button></div>';
	})//end foreach
}

function btnSchoolClick(iskool){
	sSchool  = iskool;
	console.log("Success School!"+sSchool);
	window.alert("آپ کا انتخاب ہے  \n"+sSchool[1]+": , "+sSchool[0]+", "+sCluster+", "+sArea+", "+sRegion);
	window.location.href = "./inventory.php?schoolid="+iskool[1]+"&schoolname="+iskool[0];
}

/*function populateUnits(e,iskool){
	arrUnits.sort();
	e.parentNode.parentNode.style.height = ""+arrUnits.length * 280+"px";
	arrUnits.forEach(function(row){
		e.innerHTML += '<div id="lvl2e" class="hflex"><button class="abtn" type="button" onclick="btnUnitClick([\''+row[0]+'\','+row[1]+'])"><u>یونٹ  ID: '+row[1]+'</u><br>'+row[0]+'</button></div>';
	})//end foreach
}
*/
function btnUnitClick(yunat){
	window.alert("یونٹ ID: "+yunat[1]+"\n نام : "+yunat[0]);
}