let art, config;

let mic, fft, amplitude;
let ranges = ["bass", "lowMid", "mid", "highMid", "treble"];
let frequencies = new Object();

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

    let smoothing = 0.8;
    mic = new p5.AudioIn();
    fft = new p5.FFT(smoothing);

    mic.connect(fft);
    // amplitude = new p5.Amplitude();
    // amplitude.setInput(mic);
    // amplitude.toggleNormalize(true);

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

    for (let i = 0; i < ranges.length; i++) {
        let range = ranges[i];
        frequencies[range] = fft.getEnergy(range);
    }

    art.draw(soundwave, amplitudeLevel, frequencies);
}

// This is a fix for chrome:
// https://github.com/processing/p5.js-sound/issues/249
function touchStarted() {
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume();
    }
}
