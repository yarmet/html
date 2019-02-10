/**
 * Created by ruslan on 26.06.2017.
 */

var prevClickedTD = null;
var table = document.getElementById('table');
var A = [9];

for (var i = 0, row; row = table.rows[i]; i++) {
    for (var j = 0, col; col = row.cells[j]; j++) {
        if (i === 2 || i === 5) {
            col.classList.add("BoldBottomLine");
        }
        if (j === 2 || j === 5) {
            col.classList.add("BoldRightLine");
        }
        col.onclick = fokusTD;
    }
};


function fokusTD() {
    if (prevClickedTD != null) {
        prevClickedTD.classList.remove("yellow");
    }
    this.classList.add("yellow");
    prevClickedTD = this;
};


document.onkeypress = function (e) {
    e = e || window.event;
    var charCode = String.fromCharCode((typeof e.which == "number") ? e.which : e.keyCode);
    if (prevClickedTD != null) {
        if (charCode >= 1 && charCode <= 9) {
            prevClickedTD.innerHTML = charCode;
        } else {
            prevClickedTD.innerHTML = "";
        }
    }
};


document.getElementById("calculate").onclick = function () {
    for (var i = 0, row; row = table.rows[i]; i++) {
        A[i] = [9]
        for (var j = 0, col; col = row.cells[j]; j++) {
            A[i][j] = col.innerHTML;
        }
    }
    calculateValues();
    fillTable();
}


function findValuesFromHorizontalLine(i) {
    var list = [];
    for (var j = 0; j < 9; j++) {
        if (A[i][j] != 0) {
            list.push(A[i][j]);
        }
    }
    return list;
}


function findValuesFromVerticalLine(i) {
    var list = [];
    for (var j = 0; j < 9; j++) {
        if (A[j][i] != 0) {
            list.push(A[j][i]);
        }
    }
    return list;
}


function findValuesFromMiniSquare(t, r) {
    var list = [];

    if (t > 6) t = 6;
    if (t > 3 && t < 6) t = 3;
    if (t > 0 && t < 3) t = 0;

    if (r > 6) r = 6;
    if (r > 3 && r < 6) r = 3;
    if (r > 0 && r < 3) r = 0;

    for (var i = t; i < t + 3; i++) {
        for (var j = r; j < r + 3; j++) {
            if (A[i][j] !== 0) {
                list.push(A[i][j]);
            }
        }
    }
    return list;
}


function quickFind(array, val) {
    for (var index in array) {
        if (array[index] == val) {
            return true;
        }
    }
    return false;
}


function selectPossibleValue(verticalLineValues, horizontalLineValues, squareValues) {
    var temp = 0;
    for (var val = 1; val < 10; val++) {
        if (!quickFind(horizontalLineValues, val) && !quickFind(verticalLineValues, val) && !quickFind(squareValues, val)) {
            if (temp == 0) {
                temp = val;
            } else {
                return 0;
            }
        }
    }
    return temp;
}


function calculateValues() {
    var findValue = false;

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (A[i][j] == 0) {
                var temp = selectPossibleValue(findValuesFromVerticalLine(j), findValuesFromHorizontalLine(i), findValuesFromMiniSquare(i, j));
                if (temp > 0) {
                    A[i][j] = temp;
                    findValue = true;
                }
            }
        }
    }
    if (findValue) {
        calculateValues();
    }
};

function fillTable() {
    for (var i = 0, row; row = table.rows[i]; i++) {
        for (var j = 0, col; col = row.cells[j]; j++) {
            col.innerHTML = A[i][j];
        }
    }
};