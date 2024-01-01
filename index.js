const square = 60; // default. Snake (head and body) size
const FPS = 250; // setInterval use milliseconds
const px = "px";
const deg = "deg";
const teta = 90; // the snake always turns 90° from its current orientation (+/- | "left/right")
const bgColor = ["#00ff00", "#00dd00"];

function rotate(deltaA, oldA){
    let r = oldA + deltaA;
    if(r == 360) r = 0;
    return r;
}

function Div(o){
    let d = document.createElement("div");
    if(o){
        if(o.id){ d.setAttribute("id", o.id); }
        if(o.cls){ d.setAttribute("class", o.cls); }
    }
    return d;
}

class Apple{
    constructor(where){
        if(!where){where = document.body;} // append it in the body by default, or it will fail below (when append to => undefined)
        this.x = null;
        this.y = null;
        this.el = Div({id: "apple"});
        this.el.style.width = square + px;
        this.el.style.height = square + px;
        this.el.style.backgroundImage = "URL(images/apple.png)";
        this.el.style.backgroundPosition = "center";
        this.el.style.backgroundSize = "90%";
        this.el.style.backgroundRepeat = "no-repeat";
        this.el.style.display = "inline-block";
        this.el.style.position = "absolute";
        where.append(this.el);
    }
    remove(){
        this.el.remove();
    }
    getGlobalCoords(){
        return {x: this.x, y: this.y};
    }
    setGlobalCoords(coords){
        this.x = coords.x;
        this.y = coords.y;
    }
}

class Grid{
    constructor(size){
        this.size = size; // how many rows and cols, since it is a square. 
        this.elWrapper = Div({id: "grid-wr"});
        this.elWrapper.style.width = square * size + px;
        this.elWrapper.style.height = square * size + px;

        this.childEls = [];
        this.create();
    }
    create(){
        let cell;
        for(let i = 0; i < this.size; i++){
            for(let j = 0; j < this.size; j++){
                cell = Div({cls: "grid-cell", id: "r" + i + "c" + j});
                cell.style.backgroundColor = bgColor[i%2? j%2 : (j+1)%2];
                cell.style.width = square + px;
                cell.style.height = square + px;
                this.childEls.push(cell);
                this.elWrapper.append(this.childEls[i*this.size+j]);
            }
        }
    }
    destroy(){
        this.elWrapper.remove();
        delete this;
    }
    getWidth(){
        return parseInt(this.elWrapper.style.width, 10);
    }
}

class Body{
    constructor(){
        this.width = square;
        this.height = square;
        this.x = -600;
        this.y = -600;
        this.el = Div({cls: "snake-body"});
        this.updateElPosition();
        this.setElSize();
    }
    getSize(){
        return this.width; // the widht and height should be the same, in that version ... will probably never had, from me, other version!!!
    }
    setSize(){
        this.width = w || square;
        this.height = h || w || square;
        this.setElSize();
    }
    setElSize(){
        this.el.style.width = this.width + px;
        this.el.style.height = this.height + px;
    }
    getPosition(){
        return {x:this.x, y:this.y};
    }
    setPosition(x,y){
        this.x = x;
        this.y = y;
        this.updateElPosition();
    }
    updateElPosition(){
        this.el.style.left = this.x + px;
        this.el.style.top = this.y + px;
    }
}

class Head extends Body{
    // diffference between body and head is only visual. Head has eyes and 2 rounded corner.
    constructor(){
        super();
        this.el.classList.remove("snake-body");
        this.el.classList.add("snake-head");
        this.el.setAttribute("id", "head");
        // round 2 corner for the head
        this.el.style.borderTopRightRadius = (square / 2) * 0.75 + px;
        this.el.style.borderBottomRightRadius = (square / 2) * 0.75 + px;
        // add eyes to the snake head!!! (visual)
        this.el.append(Div({cls: "eye"}), Div({cls: "eye"}));
        // left eye
        this.el.childNodes[0].style.width = "10px";
        this.el.childNodes[0].style.height = "10px";
        this.el.childNodes[0].style.borderRadius = "50%";
        this.el.childNodes[0].style.position = "absolute";
        this.el.childNodes[0].style.right = "25%";
        this.el.childNodes[0].style.top = "25%";
        // right eye
        this.el.childNodes[1].style.width = "10px";
        this.el.childNodes[1].style.height = "10px";
        this.el.childNodes[1].style.borderRadius = "50%";
        this.el.childNodes[1].style.position = "absolute";
        this.el.childNodes[1].style.right = "25%";
        this.el.childNodes[1].style.bottom = "25%";
    }
}

class Snake{
    constructor(parent){
        this.parent = parent; // grid, for score
        this.movingHandlerId = null;
        this.currentDirection = "e"; // possible value: n,e,s,o => nord, sud, est, ouest
        this.oldAngle = 0; // start oriented to the east
        this.els = [new Head(), new Body(), new Body()]; // default snake length. 3 since i push 3 part here
        this.bodySize = this.els[0].getSize();
        this.apple = null;
        this.score = 0;
        this.scoreEl = Div({id: "score-display"});

        this.createScoreEl();
        this.setStartPosition();
        this.genFood();
    }
    createScoreEl(){
        document.body.append(this.scoreEl);
        this.scoreEl.innerText = "Score: 0";
        this.scoreEl.style.width = this.parent.getWidth() + px;
    }
    updateScore(){
        this.score += 10;
        this.scoreEl.innerText = "Score: " + this.score;
    }
    grow(){
        this.els.push(new Body());
        document.body.append(this.els[this.els.length -1].el);
    }
    move(){
        // that is call by setInterval, which make "auto move" the snake. So must move all part of the snake a each "tick"
        // fist copy head coord to previousCoords.
        let previousCoords = this.els[0].getPosition(); // position of head "old" will change
        let currentCoords;
        // update head
        //look for direction, and move in that direction for the Head
        if(this.currentDirection == "n"){
            this.els[0].y = previousCoords.y - square;
            // y do not change. It go up, not left or right!
        }
        if(this.currentDirection == "s"){
            this.els[0].y = previousCoords.y + square;
            // y do not change. It go down, not left or right!
        }
        if(this.currentDirection == "e"){
            // x do not change. It go east, not up or down!
            this.els[0].x = previousCoords.x + square;
        }
        if(this.currentDirection == "o"){
            // x do not change. It go east, not up or down!
            this.els[0].x = previousCoords.x - square;
        }

        // did it meet an apple? 
        this.detectEatFood(); // did it hit/eat an apple?
        // check if hit the a wall?
        if(this.passGridLimit()) return; // yes ... game over. (nothing more to do)
        // check if hit himself
        if(this.hasTouchedItsTail()) return; // yes ... game over 

        this.els[0].updateElPosition(); // head position : special case.
        // then all other body parts. (reverse) Take position of their ahead neighbour (which it is store in tmp)
        for(let i = this.els.length - 1; i > 1; i--){
            currentCoords = this.els[i-1].getPosition();
            this.els[i].setPosition(currentCoords.x, currentCoords.y);
        }
        this.els[1].setPosition(previousCoords.x, previousCoords.y); // Special case: head was move first, so its previouscoords was "Saves/copied".
    }
    turn(direction){ // user command the snake to turn
        // must exits a better simpler solution for this. ??? !
        if(direction == "e"){
            if(this.currentDirection == "e" || this.currentDirection == "o" ) return; // nothing to do
            if(this.currentDirection == "n"){
                this.oldAngle = rotate(teta, this.oldAngle);
                this.els[0].el.style.transform = "rotate(" + this.oldAngle + deg + ")";
                this.currentDirection = "e";
            }
            if(this.currentDirection == "s"){
                this.oldAngle = rotate(-teta, this.oldAngle);
                this.els[0].el.style.transform = "rotate(" + this.oldAngle + deg + ")";
                this.currentDirection = "e";
            }
        }

        if(direction == "o"){
            if(this.currentDirection == "e" || this.currentDirection == "o" ) return; // nothing to do
            if(this.currentDirection == "n"){
                this.oldAngle = rotate(-teta, this.oldAngle);
                this.els[0].el.style.transform = "rotate(" + this.oldAngle + deg + ")";
                this.currentDirection = "o";
            }
            if(this.currentDirection == "s"){
                this.oldAngle = rotate(teta, this.oldAngle);
                this.els[0].el.style.transform = "rotate(" + this.oldAngle + deg + ")";
                this.currentDirection = "o";
            }
        }

        if(direction == "n"){
            if(this.currentDirection == "n" || this.currentDirection == "s" ) return; // nothing to do
            if(this.currentDirection == "e"){
                this.oldAngle = rotate(-teta, this.oldAngle);
                this.els[0].el.style.transform = "rotate(" + this.oldAngle + deg + ")";
                this.currentDirection = "n";
            }
            if(this.currentDirection == "o"){
                this.oldAngle = rotate(teta, this.oldAngle);
                this.els[0].el.style.transform = "rotate(" + this.oldAngle + deg + ")";
                this.currentDirection = "n";
            }
        }

        if(direction == "s"){
            if(this.currentDirection == "n" || this.currentDirection == "s" ) return; // nothing to do
            if(this.currentDirection == "e"){
                this.oldAngle = rotate(teta, this.oldAngle);
                this.els[0].el.style.transform = "rotate(" + this.oldAngle + deg + ")";
                this.currentDirection = "s";
            }
            if(this.currentDirection == "o"){
                this.oldAngle = rotate(-teta, this.oldAngle);
                this.els[0].el.style.transform = "rotate(" + this.oldAngle + deg + ")";
                this.currentDirection = "s";
            }
        }
    }
    setStartPosition(){
        // on "init" (constructor) set the position of all the strating blocks of the snake: head and body part.
        let startingPoint = 5; // "5" around the middle, for now, grid size is 11 col and 11 row
        let bodyPart;
        for(let i = 0; i < this.els.length; i++){
            bodyPart = this.els[i];
            bodyPart.setPosition(this.bodySize * startingPoint - (i * this.bodySize), this.bodySize * startingPoint); 
            document.body.append(bodyPart.el);
        }
    }
    passGridLimit(){
        let currentPosition = this.els[0].getPosition();
        if(currentPosition.x < 0 || currentPosition.y < 0 || currentPosition.x >= window.grid.size * square || currentPosition.y >= window.grid.size * square){
            // game over
            clearInterval(this.movingHandlerId);
            this.movingHandlerId = null;
            setTimeout(()=>{this.gameOver();},100); // call "game over"
            return true;
        }
        return false; // didn't hit a wall
    }
    isOnSnakeBody(){
        for(let i = 0, coords, appleCoords; i < this.els.length; i++){
            coords = this.els[i].getPosition();
            appleCoords = this.apple.getGlobalCoords();
            if(appleCoords.x == coords.x && appleCoords.y == coords.y){
                this.apple.remove(); // bad apple, on snake, remove.
                return true; // find an overlap, bad apple, need to generate another position.
            }
        }
        return false;
    }
    genFood(){
        let x,y, r,c; // row, col
        do{
            x = Math.random() * (square * window.grid.size);
            y = Math.random() * (square * window.grid.size);
            // make sure they are multiple of square
            c = Math.floor(x / square); // gen the col in which to show the apple
            r = Math.floor(y / square); // gen the row in which to show the apple
            this.apple = new Apple(document.querySelector("#r" + r + "c" + c)); // i need it on snake object because i access it in method: this.isOnSnakeBody()
            this.apple.setGlobalCoords({x: c * square, y: r * square});
        }while(this.isOnSnakeBody()) // check if snake body occupied that cell, if yes, generate another random coord for the apple.
        return this.apple;
    }
    detectEatFood(){
        let coords = this.els[0].getPosition(); // head 
        let appleCoords = this.apple.getGlobalCoords(); // apple
        if(appleCoords.x == coords.x && appleCoords.y == coords.y){ // Hited! They ocupy the same coords/cell.
            this.grow();
            this.apple.remove(); // remove the apple, the snake eaten it.
            this.updateScore(); // basic score support
            this.genFood(); // add a new apple to get and eat.
        }
    }
    hasTouchedItsTail(){
        for(let i = 1, head = this.els[0].getPosition(), body; i < this.els.length; i++){
            body = this.els[i].getPosition();
            if(head.x == body.x && head.y == body.y){
                clearInterval(this.movingHandlerId);
                this.movingHandlerId = null;
                setTimeout(()=>{this.gameOver();},100); // call "game over"
                return true; // find an overlap, bad apple, need to generate another position.
            }
        }
        return false;
    }
    destroy(){
        // remove snake dom elements
        for(let i = 0; i < this.els.length; i++){
            this.els[i].el.remove();
        }
    }
    gameOver(){
        var msg = Div({id: "game-over"});
        msg.style.textAlign = "center";
        var tn = document.createElement("text");
        tn.innerText = "Game Over\n";
        tn.style.fontSize = "24px";
        var btn = document.createElement("button");
        btn.innerText = "Try Again";
        msg.append(tn, btn);
        document.body.append(msg);
        btn.addEventListener("click", ()=>{
            this.destroy();
            window.grid.destroy();
            msg.remove();
            this.scoreEl.remove(); // remove score.
            window.grid = new Grid(11);
            document.body.append(window.grid.elWrapper);
            window.snake = new Snake(window.grid); // start over
            window.snake.movingHandlerId = setInterval((e)=>{window.snake.move();}, FPS); // start it!
        }, false);
    }
}

window.grid = new Grid(11);
document.body.append(window.grid.elWrapper);
// create a snake
window.snake = new Snake(window.grid);
window.snake.movingHandlerId = setInterval((e)=>{window.snake.move();}, FPS);