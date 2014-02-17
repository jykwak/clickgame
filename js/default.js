// Initialize my ko view
$(document).ready(function () {
    try{
        //window.localStorage.setItem("inventory", "");
        load();
        // Apply datamodel binding
        ko.applyBindings(koClickView);
        // Start gameloop
        requestAnimFrame(gameLoop);
        // Start update money loop
        updateMoney();
        // Autosave
        // alert(ko);
        
    } catch (e) {
        window.status = e.message;
    }
});

// Save tries to save game data using local storage
function save() {
    
    try {
        if (typeof (localStorage) === 'undefined') {
            alert('Your browser does not support HTML5 localStorage. Try upgrading.');
        } else {
            try {
                window.localStorage.setItem("currency", totalCurrency.toString());
                window.localStorage.setItem("cps", CPS.toString());
                window.localStorage.setItem("inventory", ko.toJSON(koClickView));
            } catch (e) {
                if (e === QUOTA_EXCEEDED_ERR) {
                    alert('Quota exceeded!');
                }
            }
        }
    } catch (e) {
        window.status = e.message;
    }

    lastSave = new Date();
}

function load() {
    try {
        window.status = "loading...";
        if (typeof (localStorage) != 'undefined') {
            var savedCurrency = parseInt(window.localStorage.getItem("currency"));
            var savedCps = parseFloat(window.localStorage.getItem("cps"));
            var inventory = window.localStorage.getItem("inventory");

            if (!isNaN(savedCurrency)) {
                totalCurrency = savedCurrency;
            }
            if(!isNaN(savedCps)){
                CPS = savedCps;
            }
            if(inventory.length > 10){
                //loadKoData(inventory);
                koClickView.buttons = ko.observableArray([]);
                loadKoData(JSON.parse(inventory).buttons);
                //debugger;
            }
        } else {
            //Save a different way
            window.status = "ELSE";
        }
    }
    catch (e) {
        window.status = e.message;
    }
}

function reset() {

}

// Setup game variables
var totalCurrency = new Number();
var CPS = new Number();
var lastSave = new Date();
var AUTO_SAVE_INTERVAL = 4000;

// Animate the click circle
// For iPhone use the onTouchStart instead of onMouseDown
function mouseDown(e) {
    showClick(1);
    $("#clickArea").removeClass("clickAnimationCircle").addClass("clickAnimationCircle");
    totalCurrency += 1;
}

function mouseUp(e) {
    setTimeout(function () { $('#clickArea').removeClass("clickAnimationCircle"); }, 150);
}

function showClick(num) {
    var obj = document.createElement("p");
    obj.setAttribute("class", "clickAnimationPlus");
    obj.innerText = "+" + num;
    document.getElementById("clickArea").appendChild(obj);
    setTimeout(destroyClick, 300, obj);
}

function destroyClick(obj) {
    document.getElementById("clickArea").removeChild(obj);
}

// Map the the best option for performance available
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame ||
           window.msRequestAnimationFrame ||
           function (callback) {
                window.setTimeout(callback, 1000 / 60);
           };
})();


function gameLoop() {
    $("#totalCurrency").text(accounting.formatMoney(totalCurrency, "$", 0));
    $("#totalCps").text(accounting.formatNumber(CPS, 1, ","));
    requestAnimFrame(gameLoop);
    var currentTime = new Date();
    var timeSinceSave = currentTime - lastSave
    if(timeSinceSave > AUTO_SAVE_INTERVAL){
        save();
    }
        
}

function updateMoney() {
    totalCurrency += CPS;
    setTimeout(updateMoney, 1000);
}