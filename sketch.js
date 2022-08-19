let art, config;

let mic, fft, amplitude;

let avgs = [];
let ranges = [];
let rmss = [];
let normVols = [];
let amps = [];
let micVols = [];

let seed;
// seed = 0;
let canvasSize;
// canvasSize = 1000;

let backgroundColor;

function setup() {
    config = new Config({ seed });

    angleMode(RADIANS);
    ellipseMode(RADIUS);
    rectMode(CORNER);
    
    backgroundColor = color(floor(random(255)));
    let canvas = createCanvas(config.canvasWidth, config.canvasHeight);

    art = new Art(config, ranges);

    mic = new p5.AudioIn();
    fft = new p5.FFT();
    mic.connect(fft);
    amplitude = new p5.Amplitude();
    amplitude.setInput(mic);
    mic.start();
}

function keyPressed(event) {
    if (isFinite(event.key)) {
        art.keyPress(parseInt(event.key));
    }

}

function draw() {

    let spectrum = fft.analyze();
    let soundwave = fft.waveform();


    soundAnalysis(soundwave);

    // let precision = 5;
    // if(ampLevel.toFixed(precision) != amplitudeLevel.toFixed(precision)){
    //     console.log("amps", amplitudeLevel.toFixed(precision+1), ampLevel.toFixed(precision+1), rms.toFixed(precision));
    // }


    background(backgroundColor);

    let xAxis = height/2;
    let yAxis = width *0.05;
    strokeWeight(2);
    stroke(color("black"));
    line(0,xAxis,width, xAxis);
    line(yAxis,0,yAxis,height);
    let x0 = yAxis;
    let x1 = 0.95*width;
    let y0 = xAxis;
    let y1= -height;
    strokeWeight(0.5);
    for(let i = -1; i <= 1; i+=0.02){
        let y = map(i, 0, .1, y0, y1);
        text(i.toString(), yAxis - 30, y);
        line(yAxis, y, width, y ); 
    }
    noFill();
    strokeWeight(1);
    // stroke("teal");
    // graph(soundwave, x0,x1,y0,y1);
    stroke("purple");
    graph(amps, x0,x1,y0,y1);
    stroke("pink");
    graph(micVols, x0,x1,y0,y1);
    stroke("orange");
    graph(normVols, x0,x1,y0,y1);
    stroke("red");
    graph(rmss, x0,x1,y0,y1);
    stroke("teal");
    graph(avgs, x0,x1,y0,y1);


}

function graph(data, x0, x1, y0, y1){
    beginShape();
    for(let i = 0; i < data.length; i++)
    {
        let x = map(i, 0, data.length, x0, x1);
        let y = map(data[i], 0, .1, y0, y1);
        curveVertex(x,y);
    }
    endShape();
}

let volMax = 0.001;
function soundAnalysis(soundwave){
    let sampleMin = 0;
    let sampleMax = 0;
    let sampleSum = 0;
    let squareSum = 0;
    let normalizedSquareSum = 0;
    for (let i = 0; i < soundwave.length; i++) {
        let value = soundwave[i];
        sampleMin = min(sampleMin, value);
        sampleMax = max(sampleMax, value);
        sampleSum += abs(value);
        squareSum += value ** 2;
        normalizedSquareSum += Math.max(Math.min(value / volMax, 1), -1) ** 2;
        
    }
    let sampleAvg = 2 * sampleSum / soundwave.length;
    let range = sampleMax - sampleMin;

    let rms = Math.sqrt(squareSum / soundwave.length);
    let normalizedRms = Math.sqrt(normalizedSquareSum / soundwave.length);
    volMax = max(normalizedRms, volMax);
    let volume = rms;
    let volNorm = Math.max(Math.min(volume / volMax, 1), 0);

    avgs.push(sampleAvg);
    ranges.push(range);
    rmss.push(rms);
    normVols.push(volNorm);
    amps.push(amplitude.getLevel());
    micVols.push(mic.getLevel());
    while (avgs.length > config.windowSize) {
        avgs.shift();
        ranges.shift();
        rmss.shift();
        normVols.shift();
        amps.shift();
        micVols.shift();
    }
    return volNorm;
}



// This is a fix for chrome:
// https://github.com/processing/p5.js-sound/issues/249
function touchStarted() {
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume();
    }
}
