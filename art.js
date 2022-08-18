function Art(config, ranges) {
    this.config = config;

    this.draw = function(soundwave, amplitude) {
        let sections = 2;
        let buffer = 5;
        let sectionHeight = height / sections - buffer;
        
        let section =0;
        drawGraph(soundwave, color(0), color("blue"), section*(sectionHeight+buffer), section*(sectionHeight+buffer) +sectionHeight);
    };

    this.keyPress = function(key) {
        switch (key) {
            case 0:
                this.reset();
                break;
            case 1:
                this.drawBackground = !this.drawBackground;
                break;
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            default:
                console.log("Key not supported", key);
        }

    };


    this.reset = function() {
        this.shapes = [];
        this.drawBackground = true;
        this.background = color(floor(random(255)));
        this.stroke = color(random(255), random(255), random(255));
        background(this.background);
    };
    this.reset();
}

function drawGraph(data, bg, fg, top, bottom){
    noStroke();
    fill(bg);
    rect(0, top, width, bottom-top);
    noFill();
    stroke(fg);
    beginShape();
    for (let i = 0; i < data.length; i++) {
        let x = map(i, 0, data.length, 0, width);
        let y = map(data[i],-1, 1, bottom, top);
        curveVertex(x, y);
    }
    endShape();
}
