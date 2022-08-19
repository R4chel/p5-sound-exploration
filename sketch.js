let art, config;

let mic, fft, amplitude;
let ranges = ["bass", "lowMid", "mid", "highMid", "treble"];

let seed;
// seed = 0;
let canvasSize;
// canvasSize = 1000;


function setup() {
    config = new Config({ seed });

    angleMode(RADIANS);
    ellipseMode(RADIUS);
    rectMode(CORNER);
    
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

    let amplitudeLevel = mic.getLevel();
    let ampLevel = amplitude.getLevel();
    let precision = 5;
    if(ampLevel.toFixed(precision) != amplitudeLevel.toFixed(precision)){
        console.log("amps", amplitudeLevel.toFixed(precision+1), ampLevel.toFixed(precision+1));
    }

}

function soundAnalysis(){
    
}


// This is a fix for chrome:
// https://github.com/processing/p5.js-sound/issues/249
function touchStarted() {
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume();
    }
}
