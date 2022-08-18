function Art(config, ranges) {
    this.config = config;
    this.t = 0;

    this.draw = function(soundwave, amplitude) {
        this.soundAnalysis(soundwave);
        let sections = 5;
        let buffer = 5;
        let sectionHeight = height / sections - buffer;

        let section = 0;
        drawGraph(soundwave, color(50 * section), color("blue"), section * (sectionHeight + buffer), section * (sectionHeight + buffer) + sectionHeight);
        section++;

        drawLogGraph(soundwave, color(50 * section), color("magenta"), section * (sectionHeight + buffer), section * (sectionHeight + buffer) + sectionHeight);
        section++;

        drawGraph(this.avgs, color(50 * section), color("green"), section * (sectionHeight + buffer), section * (sectionHeight + buffer) + sectionHeight);
        section++;

        drawGraph(this.ranges, color(50 * section), color("purple"),section * (sectionHeight + buffer), section * (sectionHeight + buffer) + sectionHeight);
        section++;
    };


    this.avgs = [];
    this.ranges = [];
    this.runningAvg = 0;
    this.runningRangeAvg = 0;

    this.soundAnalysis = function(soundwave) {
        let sampleMin = 0;
        let sampleMax = 0;
        let sampleSum = 0;
        for (let i = 0; i < soundwave.length; i++) {
            let value = soundwave[i];
            sampleMin = min(sampleMin, value);
            sampleMax = max(sampleMax, value);
            sampleSum += abs(value);
        }
        let sampleAvg = 2 * sampleSum / soundwave.length;
        let range = sampleMax - sampleMin;

        this.avgs.push(sampleAvg);
        this.ranges.push(range);
        while (this.avgs.length > this.config.windowSize) {
            this.avgs.shift();
            this.ranges.shift();
        }
        this.runningAvg = this.avgs.reduce((acc, x) => acc + x, 0) / this.avgs.length;
        this.runningRangeAvg = this.ranges.reduce((acc, x) => acc + x, 0) / this.ranges.length;

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

function drawGraph(data, bg, fg, top, bottom) {
    noStroke();
    fill(bg);
    rect(0, top, width, bottom - top);
    noFill();
    stroke(fg);
    beginShape();
    for (let i = 0; i < data.length; i++) {
        let x = map(i, 0, data.length, 0, width);
        let y = map(data[i], -1, 1, bottom, top);
        curveVertex(x, y);
    }
    endShape();
}

function drawLogGraph(data, bg, fg, top, bottom) {
    noStroke();
    fill(bg);
    rect(0, top, width, bottom - top);
    noFill();
    stroke(fg);
    beginShape();
    for (let i = 0; i < data.length; i++) {
        let x = map(log(i), 0, log(data.length), 0, width);
        let y = map(data[i], -1, 1, bottom, top);
        curveVertex(x, y);
    }
    endShape();
}
