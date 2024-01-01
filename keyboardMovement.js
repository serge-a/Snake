function manageInputUserKeys(e){
    switch(e.key){
        case "ArrowUp":
        case "w":
            // do somenthing
            snake.turn("n"); // tourne vers le nord
            //console.log("i push 'w' or 'ArrowUp'");
            break;
        case "ArrowDown":
        case "s":
            // do somethin else
            snake.turn("s"); // tourne vers le sud
            //console.log("i push 's' or 'ArrowDown'");
            break;
        case "ArrowLeft":
        case "a":
            // do somethin else
            snake.turn("o"); // tourne vers l'ouest
            //console.log("i push 'a' or 'ArrowLeft'");
            break;
        case "ArrowRight":
        case "d":
            // do somethin else
            snake.turn("e"); // tourne vers le l'est
            //console.log("i push 'd' or 'ArrowRight'");
            break;
        default: 
            console.log(e.key);
            break;  
    }
}
document.body.addEventListener("keyup", (e)=>{ manageInputUserKeys(e); }, false);