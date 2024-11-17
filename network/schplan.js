//-- Objects for HereWeGo Map Api --// 
var platform; //Api specific 
var map; //Map object rendered in the div
var layerNormal; //Layers for the map
var ui; //User interface elements such as zoom and layer selection
var behavior; //mouse behaviors on the map.

//--HTML ELEMENTS REFERENCES--//
const dMap = document.getElementById('dMap'); //div for map
const dSchBoxes = document.getElementById('dSchBoxes'); //div for school boxes
const dClusterBox = document.getElementById('dClusterBox'); //Div to show Cluster Info

//--Select HTML Tags(drop down boxes)--//
const sReg = document.getElementById('sReg');
const sCity = document.getElementById('sCity');
const sArea = document.getElementById('sArea');
const sCluster = document.getElementById('sCluster');


// Custom Icon for our marker
var icon;

//--Array Holder for Select Boxes--//
var sCities;
var sAreas;
var sClusters;
var fileteredSchools;

//--Misc Constants --//
const REG = 0;
const CITY = 1;
const AREA = 2;
const CLUSTER = 3;
const PK_CENTER = {
    lat: 29.9300,
    lng: 68.3120
};
const PK_ZOOM = 5.8;
const ZM_CITY = 9;
const ZM_AREA = 13;
const ZM_CLUSTER = 15.8;

//--Global Vars--//
var mpObjsArr;

//--Here We GO strings--//
var apikey = 'ZekTI9oa3W9o6UnujqnzL47yUg2blrvlrjxbCzjtDNo';

window.onload = function () {
        icon = new H.map.Icon('./images/marker.svg', {
            size: {
                w: 32,
                h: 32
            }
        });
        platform = new H.service.Platform({
            'apikey': apikey
        });

        layerNormal = platform.createDefaultLayers();

        map = new H.Map(dMap, layerNormal.vector.normal.map, {
            zoom: PK_ZOOM,
            center: PK_CENTER //center for pakistan
        }); //End Constructor H.Map

        // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
        behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
        startClustering(map, dataSchools);
        ui = H.ui.UI.createDefault(map, layerNormal);
        //makeData();
        fileteredSchools = dataSchools;
        //--Add EventListeners to Drop Downs--//
        sReg.addEventListener('change', onChangeSReg);
        sCity.addEventListener('change', onChangeSCity);
        sArea.addEventListener('change', onChangeSArea);
        sCluster.addEventListener('change', onChangeSCluster);
        loadDropdown(fileteredSchools, CITY);
        loadDropdown(fileteredSchools, AREA);
        loadDropdown(fileteredSchools, CLUSTER);

    } //end onload

/**
 * onChange function for the Zoom Slider. change the zoom level. 
 *
 * @param      {Object}  e       default event}
 */
function sliderZoomMoved(e) {
    map.setZoom(e.value);
}


/**
 * Display clustered markers on a map
 *
 * @param {H.Map} map A HERE Map instance within the application
 * @param {Object[]} data Raw data that contains eCompunds
 */
function startClustering(map, data) {
    // First we need to create an array of DataPoint objects,
    // for the ClusterProvider
    var dataPoints = data.map(function (item) {
        return new H.clustering.DataPoint(item.latitude, item.longitude, null,
            item);
    });
    // Create a clustering provider with custom options for clusterizing the input
    var clusteredDataProvider = new H.clustering.Provider(dataPoints, {
        clusteringOptions: {
            eps: 12,
            minWeight: 1.5
        },
        // Maximum radius of the neighbourhood
        // minimum weight of points required to form a cluster        

        //icon: icon, // Custom icon for the cluster
        theme: CUSTOM_THEME,
        max: 24,
        min: 0
    }); //end clusteredDataProvider

    // Note that we attach the event listener to the cluster provider, and not to
    // the individual markers
    clusteredDataProvider.addEventListener('tap', onClusterMarkerClick);

    // Create a layer tha will consume objects from our clustering provider
    var clusteringLayer = new H.map.layer.ObjectLayer(clusteredDataProvider);
    // Add the clusteringLayer which has our clusteredDataProvideder to map
    map.addLayer(clusteringLayer);


} //end function startClustering 

/***
 * Making a Custom Theme for Clustering API 
 */
// Custom clustering theme description object.
// Object should implement H.clustering.ITheme interface
var CUSTOM_THEME = {
        getClusterPresentation: function (cluster) {
            // Get DataPoints from our cluster
            var dataPoints = [];
            // Iterate through all points which fall into the cluster and store references to them
            cluster.forEachDataPoint(dataPoints.push.bind(dataPoints));
            var firstDataPoint = dataPoints[0],
                // Get a reference to data object that DataPoint holds
                data = dataPoints;

            // Create a marker from a random point in the cluster
            var clusterMarker = new H.map.Marker(cluster.getPosition(), {
                icon: new H.map.Icon(cMarkerSvg.replace('{text}', dataPoints.length)
                    .replace('{color}', getRegColor(firstDataPoint.a.data.region)), { //options
                        size: {
                            w: 50,
                            h: 50
                        },
                        anchor: {
                            x: 15,
                            y: 30
                        }
                    }),

                // Set min/max zoom with values from the cluster,
                // otherwise clusters will be shown at all zoom levels:
                min: cluster.getMinZoom(),
                max: cluster.getMaxZoom()
            });

            // Link data from the random point from the cluster to the marker,
            // to make it accessible inside onMarkerClick
            clusterMarker.setData(data);
            return clusterMarker;
        },

        getNoisePresentation: function (noisePoint) {
            // Get a reference to data object our noise points
            var data = noisePoint.getData();
            // Create a marker for the noisePoint
            var noiseMarker = new H.map.Marker(noisePoint.getPosition(), {
                icon: new H.map.Icon(eMarkerSvg.replace('{color}',
                    getRegColor(data.region)), { //options
                    size: {
                        w: 50,
                        h: 50
                    },
                    anchor: {
                        x: 15,
                        y: 30
                    }
                }),
                // Use min zoom from a noise point
                // to show it correctly at certain zoom levels:
                min: noisePoint.getMinZoom(),
                max: 24
            });

            // Link a data from the point to the marker
            // to make it accessible inside onMarkerClick
            noiseMarker.setData(data);
            noiseMarker.addEventListener('tap',
                onMrkrCompoundClick);
            return noiseMarker;
        }
    } //end function

function onMrkrCompoundClick(e) {
    // Get position of the "clicked" marker
    var position = e.target.getGeometry();
    // Get the data associated with that marker
    var data = e.target.getData();
    var bubble = onMrkrCompoundClick.bubble;
    var content = '<div class="bbl"><h2 class="bblh2">' + data.campus +
        ' &nbsp(' + data.schools.length + ')</h2>';
    data.schools.forEach((sch) => {
            content += '<h4 class="bblh4"> Shift ' + sch.shift +
                '<span class="bblp"> &nbsp&nbsp M:' + sch.m +
                ' &nbsp F:' + sch.f + '</span></h4>';
        }) //end for each
    content += '</div>';

    // For all markers create only one bubble, if not created yet
    if (!bubble) {
        var bubble = new H.ui.InfoBubble({
            lat: data.latitude,
            lng: data.longitude
        }, {
            content: content
        }); //end bubble
        ui.addBubble(bubble);
        // Cache the bubble object
        onMrkrCompoundClick.bubble = bubble;
    } else {
        // Reuse existing bubble object
        bubble.setPosition(position);
        bubble.setContent(content)
        bubble.open();
    }
    /*    // Move map's center to a clicked marker
        map.setCenter(position, true);*/
}

function onClusterMarkerClick(e) {
    // Get position of the "clicked" marker
    var position = e.target.getGeometry();
    // Get the data associated with that marker
    var data = e.target.getData();
    if (!data.length) return;
    var bubble = onClusterMarkerClick.bubble;
    var firstData = data[0].getData();
    var content = '<div class="bbl"><h2 class="bblh2">' + firstData.area +
        ' >>>&nbsp' +
        firstData.cluster + '</h2>' +
        '<h3 class="bblh3">' + data.length + '</h3></div>';

    // For all markers create only one bubble, if not created yet
    if (!bubble) {
        var bubble = new H.ui.InfoBubble({
            lat: firstData.latitude,
            lng: firstData.longitude
        }, {
            content: content
        }); //end bubble
        ui.addBubble(bubble);
        // Cache the bubble object
        onClusterMarkerClick.bubble = bubble;
    } else {
        // Reuse existing bubble object
        bubble.setPosition(position);
        bubble.setContent(content)
        bubble.open();
    }
    // Move map's center to a clicked marker
    map.setCenter(position, true);
}

/***
 * Handling Drop Down Selection Events for All Selection Boxes
 */
function onChangeSReg(e) {
    if (sReg.value == 'All') {
        fileteredSchools = dataSchools;
        map.setCenter(PK_CENTER);
        map.setZoom(PK_ZOOM);
    } //end if
    else
        fileteredSchools = dataSchools.filter((sch) => sch.region == sReg
            .value);
    loadDropdown(fileteredSchools, CITY);
    loadDropdown(fileteredSchools, AREA);
    loadDropdown(fileteredSchools, CLUSTER);
} //end onChangeSReg

function onChangeSCity(e) {
    if (sCity.value == 'Select') return;
    fileteredSchools = dataSchools.filter((sch) => sch.city == sCity.value);
    loadDropdown(fileteredSchools, AREA);
    loadDropdown(fileteredSchools, CLUSTER);
    //--Fly to the City--//
    flyToAverageCenter(fileteredSchools, ZM_CITY, map);
    //-- Landed to The City --//

} //end onChangeSReg

function onChangeSArea(e) {
    if (sArea.value == 'Select') return;
    fileteredSchools = dataSchools.filter((sch) => sch.area == sArea.value);
    loadDropdown(fileteredSchools, CLUSTER);
    //--Fly to the Area--//
    flyToAverageCenter(fileteredSchools, ZM_AREA, map);
    //-- Landed to The Area --//

} //end onChangeSReg

function onChangeSCluster(e) {
    if (sCluster.value == 'Select') return;
    //--Zoom in the Map to show the cluster center and all eCompounds in it--//
    fileteredSchools = dataSchools.filter((sch) => sch.cluster ==
        sCluster.value);

    //-- Add Cluster Infor --//
    let sum = {
        all: {
            m: 0,
            f: 0,
            oputil: 0,
            totalactiveunits: 0
        },
        pr: {
            m: 0,
            f: 0,
            oputil: 0,
            totalactiveunits: 0
        },
        sc: {
            m: 0,
            f: 0,
            oputil: 0,
            totalactiveunits: 0
        }
    };

    for (let i = 0; i < fileteredSchools.length; ++i) {
        fileteredSchools[i].schools.forEach(sch => {
            sum.all.m += sch.m;
            sum.all.f += sch.f;
            sum.all.oputil += sch.oputil;
            sum.all.totalactiveunits += sch.totalactiveunits

            sum.pr.m += sch.type == "PR" ? sch.m : 0;
            sum.pr.f += sch.type == "PR" ? sch.f : 0;
            sum.pr.oputil += sch.type == "PR" ? sch.oputil : 0;
            sum.pr.totalactiveunits += sch.type == "PR" ? sch.totalactiveunits :
                0;

            sum.sc.m += sch.type == "SC" ? sch.m : 0;
            sum.sc.f += sch.type == "SC" ? sch.f : 0;
            sum.sc.oputil += sch.type == "SC" ? sch.oputil : 0;
            sum.sc.totalactiveunits += sch.type == "SC" ? sch.totalactiveunits :
                0;
        });

    } //for i

    dClusterBox.innerHTML = '';
    dClusterBox.innerHTML = '<h2>' + sCluster.value + '</h2>'
    dClusterBox.innerHTML += makeClusterTable(sum);

    //-- Add Schools to the Div
    dSchBoxes.innerHTML = '';
    fileteredSchools.forEach(filldSchBox);
    //-- Show Routes --//
    getDistances(fileteredSchools) //Uses here we go rounting api
        //--Fly to the Area--//
    flyToAverageCenter(fileteredSchools, ZM_CLUSTER, map);
    //-- Landed to The Area --//

} //end onChangeSReg

function getDistances(schs) {
    let url = 'https://matrix.router.hereapi.com/v8/matrix?async=false&apikey={YOUR_API_KEY}';
    url = url.replace('{YOUR_API_KEY}', apikey);

    let origins = schs.map((sch) => ({
            "lat": Number(sch.latitude),
            "lng": Number(sch.longitude)
        }) //end =>
    ); //end map
    origins.sort((a, b) => {
        return a.lng - b.lng;
    });
    let points = origins.slice();
    points.push(points[0]);
    addPolylineToMap(map, points);

    /*let req = {
            "origins": origins,
            "regionDefinition": {
                "type": "circle",
                "center": {
                    "lat": origins[0].lat,
                    "lng": origins[0].lng
                },
                "radius": 10000
            }
        }*/ //end req
    let req = {
        "origins": origins,
        "regionDefinition": {
            "type": "world"
        }
    };



    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            console.log(response);
        } else {
            console.log("POST: ERROR: " + xhr.status);
            console.log("Resonse: " + xhr.responseText);
        }
    };

    const data = (JSON.stringify(req));
    //xhr.send(data);

} //end function getDistances


function addPolylineToMap(map, points) {
    if (mpObjsArr)
        map.removeObject(mpObjsArr);

    var lineString = new H.geo.LineString();

    points.forEach((point) => {

        lineString.pushPoint({
            lat: point.lat,
            lng: point.lng
        })
    }); //end forEach
    let pl = new H.map.Polyline(
        lineString, {
            style: {
                lineWidth: 4
            }
        }
    )
    mpObjsArr = map.addObject(pl); //end addOBject
} //end function addPolylineToMap

function loadDropdown(arr, id) {
    let dropdown = null;
    let unique = null;
    switch (id) {
    case CITY:
        unique = [...new Set(arr.map(item => item.city))];
        dropdown = sCity;
        break;
    case AREA:
        unique = [...new Set(arr.map(item => item.area))];
        dropdown = sArea;
        break;
    case CLUSTER:
        unique = [...new Set(arr.map(item => item.cluster))];
        dropdown = sCluster;
        break;
    default:
        return;
    } //end switch;
    dropdown.innerHTML = '';

    let opt = null;
    if (unique.length != 1) {
        opt = document.createElement("option");
        opt.textContent = 'Select';
        opt.value = 'Select';
        opt.disabled = true;
        opt.selected = true;
        opt.hidden = true;
        dropdown.appendChild(opt);
        unique.forEach(function (sch) {
            opt = document.createElement("option");
            opt.textContent = sch;
            opt.value = sch;
            dropdown.appendChild(opt);
        }); //end foreach
    } //end if unique.length
    else {
        opt = document.createElement("option");
        opt.textContent = unique[0];
        opt.value = unique[0];
        opt.disabled = true;
        opt.selected = true;
        dropdown.appendChild(opt);
    }
} //end function loadSCity

function flyToAverageCenter(arr, zmlvl, mp) {
    if (arr.length > 0) {
        arr.sort((a, b) => {
            return a.longitude - b.longitude
        });
        var bbox = new H.geo.Rect(
            (parseFloat(arr[0].latitude) - 0.01),
            arr[0].longitude,
            (parseFloat(arr[arr.length - 1].latitude) + 0.01),
            arr[arr.length - 1].longitude
        );
        //ANIMATE Zoom and Center
        mp.getViewModel().setLookAtData({
            bounds: bbox
        }, true);
    } //end if
    else { //Calculate Average LAT and LNG
        let sumLat = arr.reduce((sum, ecmp) =>
            sum + parseFloat(ecmp.latitude),
            0);
        let sumLng = arr.reduce((sum, ecmp) =>
            sum + parseFloat(ecmp.longitude),
            0);
        let mapCenterObj = {
            lat: sumLat / arr.length,
            lng: sumLng / arr.length
        };
        //ANIMATE Zoom and Center
        mp.getViewModel().setLookAtData({
            center: mapCenterObj,
            zoom: ZM_CLUSTER
        }, true);
    } //end else
} //end function flyToAverageCenter


function filldSchBox(eCmpnd) {
    let isClosed = eCmpnd.closed_year == null ? '' : 'closed';
    let schBox = `<details class="eCmpndBox" ` + isClosed + ` ><summary>` +
        eCmpnd.campus +
        ' <span class="bblp"> ' + (eCmpnd.schools.length) +
        `<span></summary>`;
    for (let i = 0; i < eCmpnd.schools.length; i++) {
        schBox += (makeInfoTable(eCmpnd.schools[i]));
    }
    schBox += `</details>`;
    dSchBoxes.innerHTML += schBox;
}

function makeInfoTable(sch) {
    let tbl =
        `<div class="schBox"><table class="{delete} infoTbl">
                    <thead><tr><th title="Field #1">ID</th>
                    <th title="Field #2">shift</th>
                    <th title="Field #3">type</th>
                    <th title="Field #4">CC Code</th>
                </tr></thead>
                <tbody><tr>
                    <td>{sch_id}</td>
                    <td>{shift}</td>
                    <td>{type}</td>
                    <td>{cost_center_code}</td>
                </tr>
                <tr><th title="Field #5">Units</th>
                <th title="Field #6">Active</th>
                <th title="Field #7">Classes</th>
                <th title="Field #8">Cap</th>
            </tr>
            <tr>
                <td>{totalunits}</td>
                <td>{totalactiveunits}</td>
                <td>{activeclasses}</td>
                <td>{capacity}</td>
            </tr>
            <tr>
                <th title="Field #9">Appssr</th>
                <th title="Field #10">Op Util</th>
                <th title="Field #11">m</th>
                <th title="Field #12">f</th>
            </tr>
            <tr>
                <td>{appssr}</td>
                <td>{oputil}</td>
                <td>{m}</td>
                <td>{f}</td>
            </tr>
        </tbody></table></div><hr>`;
    tbl = tbl.replace("{sch_id}", sch.sch_id);
    tbl = tbl.replace("{shift}", sch.shift);
    tbl = tbl.replace("{type}", sch.type);
    tbl = tbl.replace("{cost_center_code}", sch.cost_center_code);
    tbl = tbl.replace("{totalunits}", sch.totalunits);
    tbl = tbl.replace("{totalactiveunits}", sch.totalactiveunits);
    tbl = tbl.replace("{activeclasses}", sch.activeclasses);
    tbl = tbl.replace("{capacity}", sch.capacity);
    tbl = tbl.replace("{appssr}", sch.appssr);
    tbl = tbl.replace("{oputil}", sch.oputil);
    tbl = tbl.replace("{m}", Math.round((sch.m / (sch.m + sch.f)) * 100));
    tbl = tbl.replace("{f}", Math.round((sch.f / (sch.m + sch.f)) * 100));
    if (sch.closed_year != null) tbl = tbl.replace("{delete} ", 'isDel ');
    else tbl = tbl.replace("{delete} ", '');
    return tbl;
}

function makeClusterTable(cluster) {
    let tbl =
        `<table class="tg">
                <thead>
                  <tr>
                    <th class="tg-5qt9"></th>
                    <th class="tg-5qt9">Stds</th>
                    <th class="tg-5qt9">M</th>
                    <th class="tg-5qt9">F</th>
                    <th class="tg-5qt9">Opp Util</th>
                    <th class="tg-5qt9">Active Units</th>
                </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="tg-zz6y">All</td>
                    <td class="tg-iprn">{allStd}</td>
                    <td class="tg-iprn">{allM}</td>
                    <td class="tg-iprn">{allF}</td>
                    <td class="tg-iprn">{allOputil}</td>
                    <td class="tg-iprn">{allactive}</td>
                  </tr>
                  <tr>
                    <td class="tg-zz6y" style="background-color:lightgray;">PR</td>
                    <td class="tg-x420">{prStd}</td>
                    <td class="tg-x420">{prM}</td>
                    <td class="tg-x420">{prF}</td>
                    <td class="tg-x420">{prOputil}</td>                    
                    <td class="tg-x420">{practive}</td>                    
                  </tr>
                  <tr>
                    <td class="tg-zz6y">SC</td>
                    <td class="tg-iprn">{scStd}</td>
                    <td class="tg-iprn">{scM}</td>
                    <td class="tg-iprn">{scF}</td>
                    <td class="tg-iprn">{scOputil}</td>                    
                    <td class="tg-iprn">{scactive}</td>                    
                  </tr>
                </tbody>
                </table>`
    tbl = tbl.replace("{allStd}", cluster.all.m + cluster.all.f);
    tbl = tbl.replace("{allM}", Math.round((cluster.all.m / (cluster.all.m +
            cluster.all
            .f)) *
        100));
    tbl = tbl.replace("{allF}", Math.round((cluster.all.f / (cluster.all.m +
            cluster.all
            .f)) *
        100));
    tbl = tbl.replace("{allOputil}", cluster.all.oputil);
    tbl = tbl.replace(
        "{allactive}", cluster.all.totalactiveunits);


    tbl = tbl.replace("{prStd}", cluster.pr.m + cluster.pr.f);
    tbl = tbl.replace(
        "{prM}", Math.round((cluster.pr.m / (cluster.pr.m + cluster.pr
            .f)) * 100)
    );
    tbl = tbl
        .replace("{prF}", Math.round((cluster.pr.f / (cluster.pr.m +
                cluster.pr.f)) *
            100));
    tbl =
        tbl.replace("{prOputil}", cluster.pr.oputil);
    tbl = tbl.replace("{practive}",
        cluster.pr.totalactiveunits);


    tbl = tbl.replace("{scStd}", cluster.sc.m + cluster.sc.f);
    tbl = tbl.replace(
        "{scM}", Math.round((cluster.sc.m / (cluster.sc.m + cluster.sc
            .f)) * 100)
    );
    tbl = tbl
        .replace("{scF}", Math.round((cluster.sc.f / (cluster.sc.m +
                cluster.sc.f)) *
            100));
    tbl =
        tbl.replace("{scOputil}", cluster.sc.oputil);
    tbl = tbl.replace("{scactive}",
        cluster.sc.totalactiveunits);
    return tbl;
} //end fucntion makeEcmpndTable



function getRegColor(reg) {
    switch (reg) {
    case 'Central':
        return "#9b0000";
    case 'South':
        return "#168ea3";
    case 'South West':
        return "#e09335";
    case 'North':
        return "#5da313";
    case 'North West':
        return "#80f207";
    default:
        return "#dc6edd";
    } //end switch

}
/*
 * The makeData function is to be used in conjunction with the HTML php array dataSchools fetched
 * from the database. 
 */
/*function makeData() {
    // Create a new array to hold the eCompounds
    var eCompounds = [];

    // Loop through the dataSchools array
    for (var i = 0; i < dataSchools.length; i++) {

        // Get the current school object
        var school = dataSchools[i];

        // Check if the eCompound already exists in the eCompounds array
        var eCompoundIndex = eCompounds.findIndex(function (e) {
            return e.ecompound_no === school.ecompound_no;
        });

        // If the eCompound does not exist, create a new eCompound object and add it to the eCompounds array
        if (eCompoundIndex === -1) {
            var eCompound = {
                ecompound_no: school.ecompound_no,
                address: school.address,
                district: school.district,
                city: school.city,
                region: school.region,
                town: school.town,
                area: school.area,
                cluster: school.cluster,
                campus_id: school.campus_id,
                campus: school.campus,
                longitude: school.longitude,
                latitude: school.latitude,
                schools: []
            };
            eCompounds.push(eCompound);
            eCompoundIndex = eCompounds.length - 1;
        }

        // Add the current school object to the eCompound's schools array
        var schoolObject = {
            sch_id: school.sch_id,
            name: school.name,
            shift: school.shift,
            type: school.type,
            est_year: school.est_year,
            is_deleted: school.is_deleted,
            closed_year: school.closed_year,
            cost_center_code: school.cost_center_code,
            build_donor: school.build_donor,
            totalunits: school.totalunits,
            totalactiveunits: school.totalactiveunits,
            fk_sch_id: school.fk_sch_id,
            activeclasses: school.activeclasses,
            capacity: school.capacity,
            appssr: school.appssr,
            oputil: school.oputil,
            m: school.m,
            f: school.f
        };
        eCompounds[eCompoundIndex].schools.push(schoolObject);
    }

    // Now the eCompounds array will contain objects for each eCompound, with an array of nested school objects for each eCompound
    document.getElementById("printInfo").innerHTML = JSON.stringify(eCompounds);

}*/

var cMarkerSvg =
    '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="18" stroke="{color}" stroke-width="2" fill="white"/><text x="6" y="23" fill="black">{text}</text></svg>';

var eMarkerSvg =
    `<svg version="1.1" xmlns="http://www.w3.org/2000/svg">
    <g id="Vivid.JS" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Vivid-Icons" transform="translate(-125.000000, -643.000000)">
            <g id="Icons" transform="translate(37.000000, 169.000000)">
                <g id="map-marker" transform="translate(78.000000, 468.000000)">
                    <g transform="translate(10.000000, 6.000000)">
                        <path d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z" id="Shape" fill="{color}">
</path>
                        <circle id="Oval" fill="#080888" fill-rule="nonzero" cx="14" cy="14" r="7">
</circle>
                    </g>
                </g>
            </g>
        </g>
    </g>
</svg>`;