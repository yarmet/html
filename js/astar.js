/**
 * Created by ruslan on 27.06.2017.
 */

var Action = {PUT_WALL: 0, REMOVE_WALL: 1, PUT_START_POINT: 2, PUT_END_POINT: 3, selected: null};

var Class = {
    STONG_WALL: 'strongWall',
    WALL: 'wall',
    START_POINT: 'startPoint',
    END_POINT: 'endPoint',
    OPEN: 'open',
    CLOSED: 'closed',
    PATH: 'path'
};


var putWallBtn = document.getElementById('putWall');
putWallBtn.onclick = function () {
    paintButton(this);
    Action.selected = Action.PUT_WALL;
};

var removeWallBtn = document.getElementById('removeWall')
removeWallBtn.onclick = function () {
    paintButton(this);
    Action.selected = Action.REMOVE_WALL;
};

var putStartPointBtn = document.getElementById('putStartPoint')
putStartPointBtn.onclick = function () {
    paintButton(this);
    Action.selected = Action.PUT_START_POINT;
};

var putEndPointBtn = document.getElementById('putEndPoint')
putEndPointBtn.onclick = function () {
    paintButton(this);
    Action.selected = Action.PUT_END_POINT;
};

var clearAllBtn = document.getElementById('clearAll')
clearAllBtn.onclick = function () {
    clearPath();
};
var runBtn = document.getElementById('run')
runBtn.onclick = function () {
    start();
};


var paintButton = function () {
    var prevClickedButton = null;
    return function (btn) {
        if (prevClickedButton !== null) {
            prevClickedButton.classList.remove("btn-primary");
            prevClickedButton.classList.add("btn-default");
        }
        btn.classList.remove("btn-default");
        btn.classList.add("btn-primary");
        prevClickedButton = btn;
    }
}();


var delaySelectButton = document.getElementById("select");
var algoTypeButton = document.getElementById("algo");
var table = document.getElementById('table');

var TABLE_WIDTH = 100;
var TABLE_HEIGHT = 50;

var mousePressed = false;
var startPoint = false;
var endPoint = false;


document.addEventListener('mousedown', function () {
    mousePressed = true;
});

document.addEventListener('mouseup', function () {
    mousePressed = false;
});


for (var i = 0; i < TABLE_HEIGHT; i++) {
    var row = table.insertRow(i);
    for (var j = 0; j < TABLE_WIDTH; j++) {
        var cell = row.insertCell(j);
        cell.onmouseover = mouseDrug;
        cell.onmousedown = mouseDown;
        if (i === 0 || i === TABLE_HEIGHT - 1 || j === 0 || j === TABLE_WIDTH - 1) cell.classList.add(Class.STONG_WALL);
    }
}

var prevStartPoint = null;
var prevEndPoint = null;


function addPointsInTable(cell) {
    if (!cell.classList.contains(Class.STONG_WALL)) {
        switch (Action.selected) {
            case Action.PUT_WALL: {
                if (cell.className === '') {
                    cell.classList.add(Class.WALL);
                }
                break;
            }
            case Action.PUT_START_POINT: {
                if (cell.className === '') {
                    if (prevStartPoint !== null) {
                        prevStartPoint.classList.remove(Class.START_POINT);
                    }
                    cell.classList.add(Class.START_POINT);
                    startPoint = true;
                    prevStartPoint = cell;
                }
                break;
            }
            case Action.PUT_END_POINT: {
                if (cell.className === '') {
                    if (prevEndPoint !== null) {
                        prevEndPoint.classList.remove(Class.END_POINT);
                    }
                    cell.classList.add(Class.END_POINT);
                    endPoint = true;
                    prevEndPoint = cell;
                }
                break;
            }
            case Action.REMOVE_WALL: {
                cell.classList.remove(Class.WALL);
                break;
            }
        }
    }
}


function mouseDrug() {
    if (mousePressed) {
        addPointsInTable(this)
    }
}

function mouseDown() {
    addPointsInTable(this)
    return false;
}


function blockAllButtons(block) {
    runBtn.disabled = block;
    clearAllBtn.disabled = block;
    delaySelectButton.disabled = block;
    algoTypeButton.disabled = block;
    putWallBtn.disabled = block;
    removeWallBtn.disabled = block;
    putStartPointBtn.disabled = block;
    putEndPointBtn.disabled = block;
}


function Point(value, x, y) {
    this.inOpenList = false;
    this.inClossedList = false;
    this.startPoint = false;
    this.endPoint = false;
    this.parent = this;
    this.h = 0;
    this.g = 0;
    this.f = 0;
    this.Name = value;
    this.x = x;
    this.y = y;
    this.value = 2000000;
}

Point.prototype.setValue = function (value) {
    this.value = value;
};

Point.prototype.getValue = function () {
    return this.value;
};


Point.prototype.getG = function () {
    return this.g;
};

Point.prototype.getParent = function () {
    return this.parent;
};

Point.prototype.setParent = function (parent) {
    this.parent = parent;
};

Point.prototype.getF = function () {
    return this.f;
};

Point.prototype.isStartPoint = function () {
    return this.startPoint;
};

Point.prototype.setStartPoint = function () {
    this.startPoint = true;
};

Point.prototype.isEndPoint = function () {
    return this.endPoint;
};

Point.prototype.setEndPoint = function () {
    this.endPoint = true;
};

Point.prototype.getX = function () {
    return this.x;
};

Point.prototype.getY = function () {
    return this.y;
};

Point.prototype.getName = function () {
    return this.Name;
};


Point.prototype.setHGF = function (h, g) {
    this.h = h * 10;
    this.g = g + this.parent.g;
    this.f = this.h + this.g;

};

Point.prototype.addOpenList = function () {
    this.inOpenList = true;
};

Point.prototype.isInOpenList = function () {
    return this.inOpenList;
};

Point.prototype.addClossedList = function () {
    this.inClossedList = true;
    this.inOpenList = false;
};

Point.prototype.isInClossedList = function () {
    return this.inClossedList;
};
//--------------------------------------------------------------------------------------

function clearPath() {
    for (i = 0; i < TABLE_HEIGHT; i++) {
        for (j = 0; j < TABLE_WIDTH; j++) {
            var curTD = table.rows[i].cells[j];
            if (curTD.className === Class.OPEN || curTD.className === Class.CLOSED || curTD.className === Class.PATH) {
                curTD.className = '';
            }
        }
    }
}


function start() {
    var delay = parseInt(delaySelectButton.options[delaySelectButton.selectedIndex].value);
    var AlgoType = algoTypeButton.options[algoTypeButton.selectedIndex].value;


    if (!startPoint && !endPoint) {
        alert('нужно выставить стартовую  и  конечную точку');
        return;
    }

    if (!startPoint) {
        alert('нужно выставить стартовую точку');
        return;
    }
    if (!endPoint) {
        alert('нужно выставить конечную точку');
        return;
    }

    blockAllButtons(true);
    clearPath();

    var array = [TABLE_HEIGHT];
    var openList = [];
    var closedList = [];
    var targetPoint;
    var parentPoint;

    for (var row = 0; row < TABLE_HEIGHT; row++) {
        array[row] = [TABLE_WIDTH];
        for (var col = 0; col < TABLE_WIDTH; col++) {
            var tmp = table.rows[row].cells[col];
            if (tmp.className === Class.STONG_WALL || tmp.className === Class.WALL) {
                array[row][col] = new Point('#', col, row);
            } else if (tmp.className === Class.START_POINT) {
                var point = new Point('S', col, row);
                point.setStartPoint();
                point.setValue(0);
                array[row][col] = point;
                openList.push(point);
            } else if (tmp.className === Class.END_POINT) {
                var point = new Point('E', col, row);
                point.setEndPoint();
                targetPoint = point;
                array[row][col] = point;
            } else {
                array[row][col] = new Point('0', col, row);
            }
        }
    }


    if (AlgoType === 'Astar') {
        var timer = setInterval(function () {
            if (openList.length !== 0 && targetPointNotInOpenList()) {
                parentPoint = getMinElemenent();
                addInClossedListAndDeleteFromOpenList(parentPoint);
                checkPoint(-1, 0);
                checkPoint(-1, -1);
                checkPoint(0, -1);
                checkPoint(1, -1);
                checkPoint(1, 0);
                checkPoint(1, 1);
                checkPoint(0, 1);
                checkPoint(-1, 1);
            } else {
                clearInterval(timer);
                printAStar();
            }
        }, delay);
    } else if (AlgoType === 'wave') {
        var timer = setInterval(function () {
            if (openList.length !== 0 && targetPointNotInOpenList()) {
                for (var property in openList) {
                    parentPoint = openList[property];
                    addInClossedListAndDeleteFromOpenList(parentPoint);
                    addPointInList(-1, 0);
                    addPointInList(0, -1);
                    addPointInList(1, 0);
                    addPointInList(0, 1);
                }
            } else {
                clearInterval(timer);
                printWave();
            }
        }, delay * 3);
    }


    // методы для wave =========================================================
    function addPointInList(x, y) {

        var tmpX = parentPoint.getX() + x;
        var tmpY = parentPoint.getY() + y;
        var verifiablePoint = array[tmpY][tmpX];
        if (verifiablePoint.getName() !== '#' && !verifiablePoint.isInClossedList()) {
            verifiablePoint.setValue(parentPoint.getValue() + 1);
            addInOpenList(verifiablePoint);
        }
    }


    function printWave() {
        if (targetPointNotInOpenList()) {
            alert("путь не найден");
            blockAllButtons(false);
            return;
        }
        while (targetPoint.getValue() > 1) {
            if (check(targetPoint, -1, -1)) continue;
            if (check(targetPoint, 1, -1)) continue;
            if (check(targetPoint, 1, 1)) continue;
            if (check(targetPoint, -1, 1)) continue;
            if (check(targetPoint, -1, 0)) continue;
            if (check(targetPoint, 0, -1)) continue;
            if (check(targetPoint, 1, 0)) continue;
            check(targetPoint, 0, 1);
        }
        blockAllButtons(false);
    }


    function check(point, x, y) {
        var tmpX = point.getX() + x;
        var tmpY = point.getY() + y;
        var verifiablePoint = array[tmpY][tmpX];

        if (verifiablePoint.getValue() < point.getValue()) {
            table.rows[verifiablePoint.getY()].cells[verifiablePoint.getX()].className = Class.PATH;
            targetPoint = verifiablePoint;
            return true;
        }
        return false;
    }

    //==методы для А стар ======================================================

    function printAStar() {
        if (targetPointNotInOpenList()) {
            alert("путь не найден");
            blockAllButtons(false);
            return;
        }
        var parent = targetPoint.getParent();

        while (!parent.isStartPoint()) {
            table.rows[parent.getY()].cells[parent.getX()].className = Class.PATH;
            targetPoint = parent;
            parent = targetPoint.getParent();
        }
        blockAllButtons(false);
    }


    function targetPointNotInOpenList() {
        for (var property  in openList) {
            if (openList[property].isEndPoint()) {
                return false;
            }
        }
        return true;
    }


    function addInOpenList(point) {
        var curTD = table.rows[point.getY()].cells[point.getX()];
        if (curTD.className !== Class.START_POINT && curTD.className !== Class.END_POINT) {
            curTD.className = Class.OPEN;
        }
        point.addOpenList();
        openList.push(point);
    }


    function deleteFromOpenList(tmp) {
        for (var property in openList) {
            if (openList[property] === tmp) {
                delete openList[property];
            }
        }
    }


    function addInClossedListAndDeleteFromOpenList(point) {
        var curTD = table.rows[point.getY()].cells[point.getX()];
        if (curTD.className !== Class.START_POINT && curTD.className !== Class.END_POINT) {
            curTD.className = Class.CLOSED;
        }
        point.addClossedList();
        closedList.push(point);
        deleteFromOpenList(point);
    }


    function getMinElemenent() {
        var minF = 2000000000;
        var tmp = null;
        for (var property in openList) {
            if (minF > openList[property].getF()) {
                minF = openList[property].getF();
                tmp = openList[property];
            }
        }
        return tmp;
    }


    function checkPoint(x, y) {
        var tmpX = parentPoint.getX() + x;
        var tmpY = parentPoint.getY() + y;
        var verifiablePoint = array[tmpY][tmpX];
        if (verifiablePoint.getName() !== '#' && !verifiablePoint.isInClossedList()) {
            var currG = x !== 0 && y !== 0 ? 14 : 10;
            var h = Math.abs(tmpX - targetPoint.getX()) + Math.abs(tmpY - targetPoint.getY());
            if (verifiablePoint.isInOpenList()) {
                // стоимость от новой закрытой точки
                var newG = parentPoint.getG() + currG;
                // прыдущая стоимость
                var oldG = verifiablePoint.getG();
                if (newG <= oldG) {
                    verifiablePoint.setParent(parentPoint);
                    verifiablePoint.setHGF(h, currG);
                }
            } else {
                verifiablePoint.setParent(parentPoint);

                verifiablePoint.setHGF(h, currG);
                addInOpenList(verifiablePoint);
            }
        }
    }
};

