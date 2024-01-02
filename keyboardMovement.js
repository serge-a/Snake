function manageInputUserKeys(e){
    switch(e.key){
        case "ArrowUp":
        case "w":
            snake.turn("n"); // tourne vers le nord
            break;
        case "ArrowDown":
        case "s":
            snake.turn("s"); // tourne vers le sud
            break;
        case "ArrowLeft":
        case "a":
            snake.turn("o"); // tourne vers l'ouest
            break;
        case "ArrowRight":
        case "d":
            snake.turn("e"); // tourne vers le l'est
            break;
        case "Enter":
            if(window.gameOver){
                window.reset();
            }
            break;
        default:
            console.log(e.key);
            break;
    }
}
document.body.addEventListener("keyup", (e)=>{ manageInputUserKeys(e); }, false);
