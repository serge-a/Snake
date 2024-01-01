class CoordsNotif{
    constructor(x,y){
        this.x = x || null;
        this.y = y || null;
        this.el = document.createElement("div"); // Div({cls: "show-coords NE"});
        this.el.setAttribute("class", "show-coords NE");
    }
    getEl(){
        return this.el;
    }
    updateCoords(e){
        this.x = e.x;
        this.y = e.y;
        this.el.innerText = "(" + this.x + "," + this.y + ")";
    }
    setCoords(x,y){
        this.x = x;
        this.y = y;
    }
    changePosition(anchor){
        if(!anchor) anchor = "NE"; // nord est : top right corner // default

        switch(anchor){
            case "NE": // nord est 
                this.el.classList.remove("NO", "SE", "SO");
                this.el.classList.add("NE");
                break;

            case "NO": // nord ouest
                this.el.classList.remove("NE", "SE", "SO");
                this.el.classList.add("NO");
                break;

            case "SE": // sud est
                this.el.classList.remove("NE", "NO", "SO");
                this.el.classList.add("SE");
                break;

            case "SO": // sud ouest
            this.el.classList.remove("NE", "NO", "SE");
                this.el.classList.add("SO");
                break;
        }
    }
    show(){
        this.el.style.display = "inline-block";
    }
    hide(){
        this.el.style.display = "none";
    }
    remove(){
        this.el.remove(); // remove from the dom.
    }
}

// show mouse cursor coords
let coordsNotif = new CoordsNotif();
document.body.append(coordsNotif.getEl());
document.addEventListener("mousemove", (e)=>{coordsNotif.updateCoords(e);}, true);