const RED = 'rgba(255,0,0,1)';
const YELLOW = 'rgba(255,255,0,1)';
const GREEN = 'rgba(0,255,0,1)';
const WHITESMOKE = 'rgba(245,245,245,1)';

const NORTH = 0;
const NORTHWEST = 1;
const CENTRAL = 2;
const SOUTH = 3;
const SOUTHWEST = 4;

const YAXRED = 0;
const YAXYELLO = 1;
const YAXGREEN = 2;
const XAXREG = 3;
const XAXAREA = 4;
const XAXSCHOOL = 5;
const XAXSCHID = 6;

const CRITICAL = "<= 15";
const ACCEPTABLE = "WITHIN 16 AND 25";
const GREAT = ">=26";

var LAST_CLICK = null;

var dPkCounts;
var dRegCounts;
var dAreaCounts;
var dSchoolCounts;
var dAreaBooks;
var dSchoolBooks;
var ddReg;
var hRegName;

var selReg = "",
    selArea = "",
    selSchool = "";
var arrRACounts = null;
var arrASCounts = null;
var sBCR;
var sBCA;
var nBCR;
var nBCA;
var sCount = [];

window.onload = function () {
        LAST_CLICK = performance.now();
        dPkCounts = document.getElementById('dPkCounts');
        dRegCounts = document.getElementById('dRegCounts');
        dAreaCounts = document.getElementById('dAreaCounts');
        dSchoolCounts = document.getElementById('dSchoolCounts');
        dAreaBooks = document.getElementById('dAreaBooks');
        dSchoolBooks = document.getElementById('dSchoolBooks');
        ddReg = document.getElementById('ddReg');
        hRegName = document.getElementById('hRegSelected');
        sBCA = document.getElementById('spanBadCountArea');
        sBCR = document.getElementById('spanBadCountReg')
        nBCA = document.getElementById('iDaysOldArea');
        nBCR = document.getElementById('iDaysOldReg')
        ddReg.addEventListener('change', onRegChange);
        loadPkBar();
        loadRegBar();
        dRegCounts.on('plotly_click', regClick);

    } //end onload

function regClick(data) {
    selReg = data.points[0].x;
    hRegName.innerHTML = selReg;
    window.location.hash = "secArea";
    ddReg.value = selReg;
    onRegChange(ddReg);
} //end function regClick

function onRegChange(data) {
    document.getElementById('hAreaSelected').innerHTML = "Click One"
    selReg = ddReg.value;
    hRegName.innerHTML = selReg;
    loadAreaBar(selReg);
    var days = nBCR.value
    updateBadSchoolCount(selReg, selArea, days);
} //end function onRegChange

function updateBadSchoolCount(iReg, iArea, iDays) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "./data/data_fetchCountNotUpdated.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    console.log("areaName=" + encodeURIComponent(iArea));
    xhr.send("areaName=" + encodeURIComponent(iArea) +
        "&regName=" + encodeURIComponent(iReg) +
        "&days=" + encodeURIComponent(iDays));
    xhr.onload = function () {
            if (xhr.status === 200) {
                // Success! Do something with the response data
                var data = JSON.parse(xhr.responseText);
                sBCR.innerHTML = data[0].rCount + " of " + data[2].tRCount;
                sBCA.innerHTML = data[1].aCount + " of " + data[2].tACount;
            } else {
                // Error! Handle the error
                sBCR.parentNode.innerHTML =
                    ("Request failed with status code: " + xhr.status +
                        "<br><h1>Contact TCF Tech Team or DDR Solutions!</h1>");
            }
        } //end xhr onload

} //end function updateBadSchoolCount

function areaClick(data) {
    var CURR_CLICK = performance.now();
    document.getElementById('hSchoolSelected').innerHTML = "";
    dAreaBooks.innerHTML = "";
    dSchoolBooks.innerHTML = "";
    Plotly.purge('dSchoolCounts');
    selArea = data.points[0].y;
    document.getElementById('hAreaSelected').innerHTML = selArea;
    if ((CURR_CLICK - LAST_CLICK) < 1000) { //its a double click 
        window.location.hash = "secSchool"
        document.getElementById('hAreaSelected2').innerHTML = selArea;
        loadSchoolBar(selArea);
    }
    var days = nBCA.value
    updateBadSchoolCount(selReg, selArea, days);
    LAST_CLICK = CURR_CLICK;
    loadAreaDetails(selArea);
}

function schoolClick(data) {
    selSchool = data.points[0].y;
    document.getElementById('hSchoolSelected').innerHTML = selSchool;
    var selSchId = data.points[0].customdata;
    console.log(selSchId);
    /*loadSchoolInventory*/
    loadSchoolInvent(selSchId);
}

function loadAreaDetails(iArea) {
    //Fetch Area Details from POST Request first
    dAreaBooks.innerHTML = "";
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "./data/data_fetchareaschoolsinvent.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    console.log("areaName=" + encodeURIComponent(iArea));
    xhr.send("areaName=" + encodeURIComponent(iArea));
    xhr.onload = function () {
            if (xhr.status === 200) {
                // Success! Do something with the response data
                document.getElementById('dAreaBooks').innerHTML = (xhr.responseText);
            } else {
                // Error! Handle the error
                document.getElementById('dAreaBooks').innerHTML =
                    ("Request failed with status code: " + xhr.status +
                        "<br><h1>Contact TCF Tech Team or DDR Solutions!</h1>");
            }
        } //end xhr onload
} //end function loadAreaDetails

function loadPkBar() {
    var data = [{
        x: [CRITICAL, ACCEPTABLE, GREAT],
        y: [cCount[0].cRed, cCount[0].cYellow, cCount[0].cGreen],
        marker: {
            color: [RED, YELLOW, GREEN],
        }, //end marker
        text: [cCount[0].cRed.toString(), cCount[0].cYellow.toString(),
            cCount[0]
            .cGreen.toString()
        ],
        textfont: {
            size: 60
        },
        textposition: 'auto',
        type: 'bar'
    }]; //end data array
    Plotly.newPlot('dPkCounts', data, {
        title: 'Country Wide Stats',
        paper_bgcolor: WHITESMOKE,
        xaxis: {
            title: 'Book Category Count',
            titlefont: {
                size: 34
            },
            tickfont: {
                size: 24
            }
        }, //end xaxis
        yaxis: {
            tickfont: {
                size: 24
            }
        }, //end yaxis

    });
} //end function loadPkBar


function loadRegBar() {
    var xAxis = []
    var yRed = [],
        yYellow = [],
        yGreen = [];

    for (var i = rCount.length - 1; i >= 0; i--) {
        xAxis[i] = rCount[i].region;
        yRed[i] = rCount[i].cRed;
        yYellow[i] = rCount[i].cYellow;
        yGreen[i] = rCount[i].cGreen;
    } //end for i

    tracesRed = {
            x: xAxis,
            y: yRed,
            marker: {
                color: RED,
            }, //end marker
            text: yRed.map(String),
            textfont: {
                size: 30
            },
            textposition: 'auto',
            type: 'bar',
            name: CRITICAL
        } //end trace Red	

    tracesYellow = {
            x: xAxis,
            y: yYellow,
            marker: {
                color: YELLOW,
            }, //end marker
            text: yYellow.map(String),
            textfont: {
                size: 30
            },
            textposition: 'auto',
            type: 'bar',
            name: ACCEPTABLE
        } //end traceYellow	

    tracesGreen = {
            x: xAxis,
            y: yGreen,
            marker: {
                color: GREEN,
            }, //end marker
            text: yGreen.map(String),
            textfont: {
                size: 30
            },
            textposition: 'auto',
            type: 'bar',
            name: GREAT
        } //end traceYellow	

    Plotly.newPlot('dRegCounts', [tracesRed, tracesYellow, tracesGreen], {
        title: 'Region Wide Book Status',
        xaxis: {
            title: 'Regions',
            titlefont: {
                size: 34
            },
            tickfont: {
                size: 24
            }
        },
        yaxis: {
            tickfont: {
                size: 24
            }
        },
        barmode: 'group',
    });

} //end loagRegBar

function loadAreaBar(iSelReg) {
    if (arrRACounts == null) prepareRegAreaData();
    var r = regStrToConst(iSelReg);
    if (r < 0) {
        alert("Contact DDR Solutions. Some error has occured!");
        return;
    }

    tracesRed = {
            y: arrRACounts[r][XAXAREA],
            x: arrRACounts[r][YAXRED],
            marker: {
                color: RED,
            }, //end marker
            text: arrRACounts[r][YAXRED].map(String),
            textfont: {
                size: 30
            },
            textposition: 'auto',
            orientation: 'h',
            type: 'bar',
            name: CRITICAL
        } //end trace Red	

    tracesYellow = {
            y: arrRACounts[r][XAXAREA],
            x: arrRACounts[r][YAXYELLO],
            marker: {
                color: YELLOW,
            }, //end marker
            text: arrRACounts[r][YAXYELLO].map(String),
            textfont: {
                size: 30
            },
            textposition: 'auto',
            orientation: 'h',
            type: 'bar',
            name: ACCEPTABLE
        } //end traceYellow	

    tracesGreen = {
            y: arrRACounts[r][XAXAREA],
            x: arrRACounts[r][YAXGREEN],
            marker: {
                color: GREEN,
            }, //end marker
            text: arrRACounts[r][YAXGREEN].map(String),
            textfont: {
                size: 30
            },
            textposition: 'auto',
            orientation: 'h',
            type: 'bar',
            name: GREAT
        } //end traceYellow	

    Plotly.newPlot('dAreaCounts', [tracesRed, tracesYellow, tracesGreen], {
        title: 'Area wise Book Status',
        xaxis: {
            title: 'Areas',
            titlefont: {
                size: 20
            },
            tickfont: {
                size: 20
            }

        },
        yaxis: {
            tickfont: {
                size: 16
            },
            tickangle: 0,
            ticklabeloverflow: 'hide past domain',
            ticklabelposition: 'inside'
        },
        barmode: 'group',
    });
    dAreaCounts.on('plotly_click', areaClick);
}

function prepareRegAreaData() {
    arrRACounts = [];
    for (var i = 0; i < 5; i++) {
        arrRACounts[i] = [];
        for (var j = 0; j < 5; j++)
            arrRACounts[i][j] = [];
    }

    for (var i = 0; i < aCount.length; i++) {
        var r = regStrToConst(aCount[i].region);
        arrRACounts[r][XAXREG][i] = aCount[i].region;
        arrRACounts[r][XAXAREA][i] = aCount[i].area;
        arrRACounts[r][YAXRED][i] = aCount[i].cRed;
        arrRACounts[r][YAXYELLO][i] = aCount[i].cYellow;
        arrRACounts[r][YAXGREEN][i] = aCount[i].cGreen;
    }
}

function loadSchoolInvent(iSelSchId) {
    //Fetch School Details from POST Request first
    dSchoolBooks.innerHTML = "";
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "./data/data_fetchSchoolInvent.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    console.log("schID=" + encodeURIComponent(iSelSchId));
    xhr.send("schID=" + encodeURIComponent(iSelSchId));
    xhr.onload = function () {
            if (xhr.status === 200) {
                // Success! Do something with the response data

                document.getElementById('dSchoolBooks').innerHTML = (xhr.responseText);
                //console.log(xhr.responseText);
            } else {
                // Error! Handle the error
                document.getElementById('dSchoolCounts').innerHTML =
                    ("Request failed with status code: " + xhr.status +
                        "<br><h1>Contact TCF Tech Team or DDR Solutions!</h1>");
            }
        } //end xhr onload
} //end loadSchoolInvent

function loadSchoolBar(iSelArea) {

    //Fetch School Details from POST Request first
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "./data/data_fetchSchoolsGraph.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    console.log("areaName=" + encodeURIComponent(iSelArea));
    xhr.send("areaName=" + encodeURIComponent(iSelArea));
    xhr.onload = function () {
            if (xhr.status === 200) {
                // Success! Do something with the response data
                sCount = JSON.parse(xhr.responseText);
                //console.log(xhr.responseText);
                /*--Populate Plotly Graphs for Schools in the selected Area*/
                prepareAreaSchoolData(iSelArea);
                plotSchoolBar();
            } else {
                // Error! Handle the error
                document.getElementById('dSchoolCounts').innerHTML =
                    ("Request failed with status code: " + xhr.status +
                        "<br><h1>Contact TCF Tech Team or DDR Solutions!</h1>");
            } //end else
        } //end xhr onload
} //end loadSchoolBar

function plotSchoolBar() {
    tracesRed = {
            y: arrASCounts[XAXSCHOOL],
            x: arrASCounts[YAXRED],
            customdata: arrASCounts[XAXSCHID],
            marker: {
                color: RED,
            }, //end marker
            text: arrASCounts[YAXRED].map(String),
            textfont: {
                size: 30
            },
            textposition: 'top',
            orientation: 'h',
            type: 'bar',
            name: CRITICAL
        } //end trace Red	

    tracesYellow = {
            y: arrASCounts[XAXSCHOOL],
            x: arrASCounts[YAXYELLO],
            customdata: arrASCounts[XAXSCHID],
            marker: {
                color: YELLOW,
            }, //end marker
            //text: arrASCounts[YAXYELLO].map(String),
            textfont: {
                size: 30
            },
            textposition: 'top',
            orientation: 'h',
            type: 'bar',
            name: ACCEPTABLE
        } //end traceYellow	

    tracesGreen = {
            y: arrASCounts[XAXSCHOOL],
            x: arrASCounts[YAXGREEN],
            customdata: arrASCounts[XAXSCHID],
            marker: {
                color: GREEN,
            }, //end marker
            text: arrASCounts[YAXGREEN].map(String),
            textfont: {
                size: 30
            },
            textposition: 'auto',
            orientation: 'h',
            type: 'bar',
            name: GREAT
        } //end traceYellow	

    Plotly.newPlot('dSchoolCounts', [tracesRed, tracesYellow, tracesGreen], {
        title: 'School Book Status',
        height: arrASCounts[XAXSCHOOL].length * 80,
        xaxis: {
            title: 'Title Status Count',
            titlefont: {
                size: 20
            },
            tickfont: {
                size: 20
            }

        },
        yaxis: {
            title: 'Schools',
            tickfont: {
                size: 18
            },
            tickangle: 0,
            ticklabeloverflow: 'hide past domain',
            ticklabelposition: 'inside',
            automargin: true
        },
        barmode: 'group',
        paper_bgcolor: WHITESMOKE,
        plot_bgcolor: WHITESMOKE
    });
    dSchoolCounts.on('plotly_click', schoolClick);

}

function prepareAreaSchoolData() {
    arrASCounts = [];
    for (var j = 0; j < 7; j++)
        arrASCounts[j] = [];

    for (var i = 0; i < sCount.length; i++) {
        arrASCounts[XAXREG][i] = sCount[i].region;
        arrASCounts[XAXAREA][i] = sCount[i].cluster;
        arrASCounts[YAXRED][i] = sCount[i].cRed;
        arrASCounts[YAXYELLO][i] = sCount[i].cYellow;
        arrASCounts[YAXGREEN][i] = sCount[i].cGreen;
        arrASCounts[XAXSCHOOL][i] = sCount[i].school;
        arrASCounts[XAXSCHID][i] = sCount[i].sch_id
    }
}



function regStrToConst(reg) {
    switch (reg) {
    case 'North':
        return NORTH;
    case 'North West':
        return NORTHWEST;
    case 'Central':
        return CENTRAL;
    case 'South West':
        return SOUTHWEST;
    case 'South':
        return SOUTH;
    default:
        return -1;
    }
}

function regConsToStr(reg) {
    switch (reg) {
    case NORTH:
        return 'North';
    case NORTHWEST:
        return 'North West';
    case CENTRAL:
        return 'Central';
    case SOUTHWEST:
        return 'South West';
    case SOUTH:
        return 'South';
    default:
        return -1;
    }
}

function sBCAChange(e) {
    nBCR.value = nBCA.value;
}

function sBCRChange(e) {
    nBCA.value = nBCR.value;
}

function onBtnDownload(e) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "./data/data_fetchCountNotUpdated.php", true);
    xhr.responseType = "blob";
    xhr.onload = function (e) {
        if (this.status === 200) {
            var blob = new Blob([this.response], {
                type: 'text/csv'
            });
            var a = document.createElement('a');
            a.style = "display: none";
            document.body.appendChild(a);
            a.href = window.URL.createObjectURL(blob);
            a.download = "data.csv";
            a.click();
        }
    };
    xhr.send();
}