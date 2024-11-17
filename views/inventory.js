var dBookContainer;
var showModalBtn;
var modal;
var closeBtn;
var cancelBtn;
var saveBtn;
var sBookContainer; //selected book container
var sBook; //selected book to update the available field when modal saveBtn is clicked
window.onload = function() {
        dBookContainer = document.getElementById('dBookContainer');
        showModalBtn = document.getElementById("showModal");
        modal = document.getElementById("myModal");
        closeBtn = document.getElementsByClassName("close")[0];
        cancelBtn = document.getElementById("cancelBtn");
        saveBtn = document.getElementById("saveBtn");
        populateBooks(dBookContainer);
        closeBtn.addEventListener("click", function() {
            modal.style.display = "none";
        }); //end closeBtn onClick
        cancelBtn.addEventListener("click", function() {
            modal.style.display = "none";
        }); //end cancelBtn onClick
        saveBtn.addEventListener("click", function() {
            const inputNumber = document.getElementById("inputNumber").value;

            if (!validateNumber(inputNumber)) {this.disabled = true; return;}
            //Post Request
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "../data/data_updateInventory.php", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function() {
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    console.log("Table updated successfully");
                }
            }; //end onreadyStateChange function
            sBook.available = inputNumber;
            xhr.send("book=" + JSON.stringify(sBook));
            //Cosmatics
            sBookContainer.children[1].innerHTML = inputNumber;
            sBookContainer.children[1].style.backgroundColor = "lightseagreen";
            console.log(inputNumber);
            modal.style.display = "none"
        }); //end saveBtn onClick
        window.addEventListener("click", function(event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        }); //end window onClick
    } //end onload
function populateBooks(e) {
    if (tcfUnitBooks == null) {
        e.innerHTML += "<h1>Error: Contact TCF HeadOffice!</h1>"
    }
    e.parentNode.style.height = "auto";
    if (Array.isArray(tcfUnitBooks)) {
        tcfUnitBooks.sort(function(a, b) {
                if (a.Subject !== b.Subject) {
                    return a.Subject.localeCompare(b.Subject);
                } else {
                    return a.class - b.class;
                }
            }) //end sort
        tcfUnitBooks.forEach(function(row) {
            e.innerHTML += '<div id="' + row.sch_invent_id +
                '" class ="hflexBook" onClick="onBookClick(this)" data_book=\'' + JSON.stringify(row) +
                '\' data_class="' + row.class + '" data_subject="'+ row.Subject+'" ><h3 id="' + row.id + '" class="bookTitle">' +
                row.Book_Title + '</h3><h4 class="bookavl" id="avl_' + row.id + '">' +
                row.available + '</h4></div>';
        }); //end foreach
    } //end if isArray
} //end populateBooks
function onBookClick(e) {
    sBook = JSON.parse(e.getAttribute('data_book'));
    sBookContainer = e;
    console.log("Success!" + sBook);
    modal.children[0].children[1].innerHTML = sBook.Book_Title + "<br>کی تعداد اندراج کریں <br>";
    modal.style.display = "block";
    saveBtn.disabled = true;
    var iTextNum = document.getElementById('inputNumber');
    iTextNum.value = e.children[1].innerHTML;
    iTextNum.focus();
    iTextNum.select();
}

function iNumChange(e) {
    if (e.value != "") {
        e.parentNode.children[2].disabled = false;
        saveBtn.disabled = false;
    } else {
        e.parentNode.children[2].disabled = true;
        saveBtn.disabled = true;
    }
    if (e.value.indexOf(".") == -1) {
        e.parentNode.children[2].disabled = false;
        saveBtn.disabled = false;
    } else {
        e.parentNode.children[2].disabled = true;
        saveBtn.disabled = true;
    }
    if(validateNumber(e.value)){
        e.parentNode.children[2].disabled = false;
        saveBtn.disabled = false;
    } else {
        e.parentNode.children[2].disabled = true;
        saveBtn.disabled = true;
    }
}//end function iNumChange

function validateNumber(num){
	return	/^([0-9]|[1-9]\d+)$/.test(num);
}//end function valiidateNumber