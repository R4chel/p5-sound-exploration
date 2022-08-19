let art, config;
let peakDetect;
let peakDetectSensitive; 

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
    peakDetect = new p5.PeakDetect(undefined, undefined,undefined, 20);
    peakDetect.onPeak(triggerBeat);

    peakDetectSensitive = new p5.PeakDetect(undefined,undefined,0.04, 20);
    peakDetectSensitive.onPeak(triggerBeat2);
    mic.connect(fft);
    amplitude = new p5.Amplitude();
    amplitude.setInput(mic);
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
    peakDetect.update(fft);

    peakDetectSensitive.update(fft);

    let amplitudeLevel = mic.getLevel();
    let ampLevel = amplitude.getLevel();
    if(ampLevel != amplitudeLevel){
        console.log("amps", amplitudeLevel, ampLevel);
    }

    for (let i = 0; i < ranges.length; i++) {
        let range = ranges[i];
        frequencies[range] = fft.getEnergy(range);
    }

    art.draw(soundwave, amplitudeLevel, frequencies, spectrum);
    
}

function triggerBeat(val){
   //  console.log("BEAT", val);
    fill(random(255), random(255), random(255));

    circle(floor(random(width)), floor(random(height)),val * 100);
}
function triggerBeat2(val){
    // console.log("BEAT2", val);
    if(val < 0.35){
        
    fill(random(255), random(255), random(255));
    square(floor(random(width)), floor(random(height)),val * 500);
    }
}
// This is a fix for chrome:
// https://github.com/processing/p5.js-sound/issues/249
function touchStarted() {
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume();
    }
}
