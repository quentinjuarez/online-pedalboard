// // Start off by initializing a new context.
// var ctxMetronome = new(window.AudioContext || window.webkitAudioContext)();

// function MetronomeInit() {
//     this.beats = 4;
//     this.tempo = 120;
//     this.high = 440;
//     this.low = 300;
//     this.noteLength = 0.1; //s
//     this.secondsPerBeat = 60.0 / this.tempo;
//     this.isPlaying = false;
//     this.vol = ctxMetronome.createGain();
//     this.osc = ctxMetronome.createOscillator();
//     this.osc.connect(this.vol);
//     this.vol.connect(ctxMetronome.destination);
//     this.gain = 0.1;
//     this.vol.gain.value = 0;
//     this.osc.start();
// };

// PlayNote = function() {
//     if (this.beatNumber % this.beats === 0) { //1er temps
//         this.osc.frequency.value = this.high;
//         console.log("bip")
//     } else if (this.beatNumber % this.beats === 1) { //2e temps
//         this.osc.frequency.value = this.low;
//         console.log("boup")
//     } else if (this.beatNumber % this.beats === 2) { //3e temps
//         this.osc.frequency.value = this.low;
//         console.log("boup")
//     } else { //4e temps
//         this.osc.frequency.value = this.low;
//         console.log("boup")
//     }
//     this.vol.gain.value = this.gain;
//     setTimeout(function() { this.vol.gain.value = 0; }, this.noteLength * 1000);
//     this.beatNumber += 1;
// }

// StartMetronome = function() {
//     this.isPlaying = !this.isPlaying;

//     if (this.isPlaying) {
//         this.beatNumber = 0;
//         this.timer = setInterval(function() { PlayNote() }, (this.secondsPerBeat) * 1000);
//     } else {
//         clearInterval(this.timer);
//         this.vol.gain.value = 0;
//     }

// }

// changeTempo = function(element) {
//     this.tempo = element.value;
//     this.secondsPerBeat = 60.0 / this.tempo;
//     clearInterval(this.timer);
//     this.timer = setInterval(function() { PlayNote() }, (this.secondsPerBeat) * 1000);
// }

// changeBeats = function(element) {
//     this.beats = element.value;
// }

// changeVolume = function(element) {
//     this.gain = element.value;
// }