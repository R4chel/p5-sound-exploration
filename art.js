function Art(config, ranges) {
    this.config = config;

    this.draw = function(soundwave, amplitude) {
        noFill();
        stroke(this.stroke);
        if (this.drawBackground) {
            background(this.background);
        }
        beginShape();
        for (let i = 0; i < soundwave.length; i++) {
            let x = map(i, 0, soundwave.length, 0, width);
            let y = map(soundwave[i], -1, 1, height, 0);
            curveVertex(x, y);
        }
        endShape();
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
