//import Component from './js_models/component.class'
var myCar;
var myObstacles = [];


function startGame() {
    var carHeight = 70;
    var carWidth = 40;
    var roadWidth = 350;
    var roadHeight = 560;
    myCar = new Component(carWidth, carHeight, "../images/player_car.png", roadWidth / 2 - carWidth - 7, roadHeight - carHeight - 30, "image");
    myRoad = new Component(roadWidth, roadHeight, "../images/road-1.png", 0, 0, "background");
    myGameArea.start();
}

function updateGameArea() {
    myCar.speedX = 0;
    myCar.speedY = 0;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myCar.crashWith(myObstacles[i])) {
            myGameArea.stop();
            return;
        }
    }

    myRoad.speedY = 2;
    myGameArea.frameNo += 1;
    // if (myGameArea.frameNo == 1 || everyinterval(300)) {
    //     x = myGameArea.canvas.width;
    //     minGap = 50;
    //     maxGap = 200;
    //     gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
    //     myObstacles.push(new Component(carWidth, carHeight, , x, 0, "image"));
    // }
    // for (i = 0; i < myObstacles.length; i += 1) {
    //     myObstacles[i].x += -1;
    //     myObstacles[i].update();
    // }
    if (myGameArea.keys && myGameArea.keys[37]) {
        myCar.speedX = -1.5;
    }
    if (myGameArea.keys && myGameArea.keys[39]) {
        myCar.speedX = 1.5;
    }
    if (myGameArea.keys && myGameArea.keys[38]) {
        myRoad.speedY = 3.5;
    }
    if (myGameArea.keys && myGameArea.keys[40]) {
        myRoad.speedY = 1;
    }
    myGameArea.clear();
    myRoad.newPos();
    myRoad.update();
    myCar.newPos();
    myCar.update();

    // myScore.text = "SCORE: " + myGameArea.frameNo;
    // myScore.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {
        return true;
    }
    return false;
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 350;
        this.canvas.height = 560;
        //this.canvas.style.cursor = "none";
        this.frameNo = 0;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 10);
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type != "keyup");
        })

    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    }
}

function Component(width, height, color, x, y, type) {
    if (type == "image" || type == "background") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.type = type;
    this.color = color;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.update = function () {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else if (type == "image" || type == "background") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            if (type == "background") {
                ctx.drawImage(this.image, this.x, this.y - this.height, this.width, this.height);
            }
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.type == "background") {
            if (this.y >= (this.height)) {
                this.y = 0;
            }
        } else {
            this.hitSides();
        }
    };
    this.hitSides = function () {
        if (this.x <= 50) {
            this.x = 50;
        }
        if (this.x >= 350 - this.width - 50) {
            this.x = 350 - this.width - 50;
        }
    }
    this.crashWith = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y + (this.height);
        var mybottom = this.y;
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y + (otherobj.height);
        var otherbottom = otherobj.y;
        var crash = true;
        if ((mybottom > othertop) ||
            (mytop < otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}