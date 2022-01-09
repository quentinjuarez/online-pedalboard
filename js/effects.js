function Effects() {
  this.isPlaying = false;
  this.lowfreq = 100;
  this.midfreq = 1000;
  this.highfreq = 2000;

  this._volState = false;
  this._overState = false;
  this._eqState = true;
  this._delayState = true;
  this._reverbState = true;
  this._cabState = true;
  // this._tunerState = true;
  // this._visualState = true;

  this._gainInput = 0.8;

  this._overType = 0;
  this._overDrive = 0.34;
  this._overVol = 0.5;

  this._lowEQ = 0.5;
  this._midEQ = 0.5;
  this._highEQ = 0.5;

  this._delayFeed = 0.2;
  this._delayMix = 0.2;
  this._delaySpeed = 0.4;

  this._reverbMix = 0.2;
  this._reverbType = 0;

  this._cabGain = 0.5;
  this._cabType = 0;
}

Effects.prototype.initEQ = function () {
  this.EQdry = context.createGain();
  this.EQwet = context.createGain();

  this.setFilter(this._eqState);
  // this.EQdry.gain.value = 0;
  // this.EQwet.gain.value = 2;

  this.lowGain = context.createGain();
  this.lowGain.gain.value = this._lowEQ;
  this.midGain = context.createGain();
  this.midGain.gain.value = this._midEQ;
  this.highGain = context.createGain();
  this.highGain.gain.value = this._highEQ;

  this.low = context.createBiquadFilter();
  this.low.type = "lowpass";
  this.low.frequency.value = this.lowfreq;
  this.mid = context.createBiquadFilter();
  this.mid.type = "bandpass";
  this.mid.frequency.value = this.midfreq;
  this.high = context.createBiquadFilter();
  this.high.type = "highpass";
  this.high.frequency.value = this.highfreq;

  this.EQout = context.createGain();
  this.EQout.gain.value = 1;
};

Effects.prototype.initReverb = async function () {
  this.ReverbDry = context.createGain();
  this.ReverbWet = context.createGain();
  this.setReverb(this._reverbState);
  // this.ReverbDry.gain.value = 0;
  // this.ReverbWet.gain.value = 1;

  this.mixIn = context.createGain();
  this.mixOut = context.createGain();
  this.mixIn.gain.value = 1 - this._reverbMix;
  this.mixOut.gain.value = this._reverbMix;

  this.ReverbOut = context.createGain();

  this.reverb = context.createConvolver();
  let response;

  response = await fetch("impulse/reverb/Spring 1.wav");

  let arraybuffer = await response.arrayBuffer();
  this.reverb.buffer = await context.decodeAudioData(arraybuffer);
};

Effects.prototype.initCab = async function () {
  this.CabDry = context.createGain();
  this.CabWet = context.createGain();
  this.setCab(this._cabState);
  // this.CabDry.gain.value = 0;
  // this.CabWet.gain.value = 1;

  this.CabOut = context.createGain();

  this.CabGain = context.createGain();
  this.CabGain.gain.value = this._cabGain * 2 + 1;

  this.cab = context.createConvolver();
  let response;

  response = await fetch("impulse/amp/AC30 normal sm57.wav");

  let arraybuffer = await response.arrayBuffer();
  this.cab.buffer = await context.decodeAudioData(arraybuffer);
};

Effects.prototype.initOverdrive = function () {
  this.OverDry = context.createGain();
  this.OverWet = context.createGain();
  this.toggleOverdrive(this._overState);
  // this.OverDry.gain.value = 1;
  // this.OverWet.gain.value = 0;

  this.OverOut = context.createGain();

  this.overdrive = context.createWaveShaper();

  this.OverVol = context.createGain();
  this.OverVol.gain.value = this._overVol * 2;

  this.overdrive.curve = this.makeDistortionCurve(this._overDrive);
  this.overdrive.oversample = "4x";
};

Effects.prototype.initDelay = async function () {
  this.DelayDry = context.createGain();
  this.DelayWet = context.createGain();
  this.toggleFilter(this._eqState);
  // this.DelayDry.gain.value = 0;
  // this.DelayWet.gain.value = 1;

  this.DelayMix = context.createGain();
  this.DelayMix.gain.value = this._delayMix;

  this.DelayFeedback = context.createGain();
  this.DelayFeedback.gain.value = this._delayFeed;

  this.DelaySpeed = context.createDelay(1.5);
  this.DelaySpeed.delayTime.value = this._delaySpeed;

  this.DelayOut = context.createGain();
  this.DelayOut.gain.value = 1;
};

Effects.prototype.initVisual = function () {
  this.analyserNode = new AnalyserNode(context, {
    fftSize: 2048,
  });
  this.tunerNode = new AnalyserNode(context, {
    fftSize: 32768,
  });
  this.visualizer = document.getElementById("visualizer");
  this.tuner = document.getElementById("tunercanvas");
};

Effects.prototype.connect = function () {
  console.log("Connect started");
  // source -> gain -> eq -> eq gain -> destination
  this.source.connect(this.input);

  this.input.connect(this.volume);

  this.volume.connect(this.OverDry);
  this.volume.connect(this.OverWet);

  this.volume.connect(this.tunerNode).connect(context.destination);

  this.OverWet.connect(this.overdrive);
  this.overdrive.connect(this.OverVol);
  this.OverVol.connect(this.OverOut);

  this.OverDry.connect(this.OverOut);

  this.OverOut.connect(this.EQdry);
  this.OverOut.connect(this.EQwet);

  this.EQwet.connect(this.low);
  this.EQwet.connect(this.mid);
  this.EQwet.connect(this.high);

  this.low.connect(this.lowGain);
  this.mid.connect(this.midGain);
  this.high.connect(this.highGain);

  this.lowGain.connect(this.EQout);
  this.midGain.connect(this.EQout);
  this.highGain.connect(this.EQout);

  this.EQdry.connect(this.EQout);

  this.EQout.connect(this.DelayDry);
  this.EQout.connect(this.DelayWet);

  this.EQout.connect(this.ReverbDry);
  this.EQout.connect(this.ReverbWet);

  this.DelayWet.connect(this.DelayOut);
  this.DelayWet.connect(this.DelaySpeed);
  this.DelaySpeed.connect(this.DelayMix);
  this.DelaySpeed.connect(this.DelayFeedback);
  this.DelayFeedback.connect(this.DelaySpeed);
  this.DelayMix.connect(this.DelayOut);

  this.DelayOut.connect(this.ReverbDry);
  this.DelayOut.connect(this.ReverbWet);

  this.ReverbWet.connect(this.reverb);
  this.ReverbWet.connect(this.mixIn);

  this.reverb.connect(this.mixOut);

  this.mixIn.connect(this.ReverbOut);
  this.ReverbDry.connect(this.ReverbOut);
  this.mixOut.connect(this.ReverbOut);

  this.ReverbOut.connect(this.CabDry);
  this.ReverbOut.connect(this.CabWet);

  this.CabWet.connect(this.cab);

  this.cab.connect(this.CabGain);

  this.CabGain.connect(this.CabOut);
  this.CabDry.connect(this.CabOut);

  this.CabOut.connect(this.analyserNode).connect(context.destination);
  this.CabOut.connect(context.destination);

  console.log("Connect finished");
};

Effects.prototype.Init = async function () {
  console.log("Initialisation Started");
  //microphone
  stream = await navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: false,
    })
    .catch((e) => onError("Couldn't connect to your microphone"));

  this.source = context.createMediaStreamSource(stream);

  this.input = context.createGain();
  this.setInput(this._volState);

  this.volume = context.createGain();
  this.volume.gain.value = this._gainInput;

  // Create the filter.
  this.initOverdrive();
  this.initEQ();
  this.initDelay();
  this.initReverb();
  this.initCab();
  this.initVisual();
  this.connect();

  console.log("Initialisation Finished");
  drawVisualizer();
  drawTuner();
};

//  this._volState = 0;
//   this._overState = 0;
//   this._eqState = 1
//   this._delayState = 1;
//   this._reverbState = 1;
//   this._cabState = 1;
//   this._tunerState = 1;
//   this._visualState = 1;

//--------------INPUT-----------------------
Effects.prototype.play = async function () {
  this.input.gain.value = 1;
};

Effects.prototype.stop = function () {
  this.input.gain.value = 0;
};

Effects.prototype.toggle = function () {
  this.isPlaying ? this.stop() : this.play();
  this.isPlaying = !this.isPlaying;
};

Effects.prototype.setInput = function (state) {
  this._volState = state;
  if (this._volState) {
    this.input.gain.value = 1;
  } else {
    this.input.gain.value = 0;
  }
};

//---------------OVER-------------------------------
Effects.prototype.toggleOverdrive = function () {
  if (this.OverWet.gain.value == 1) {
    this.OverWet.gain.value = 0;
    this.OverDry.gain.value = 1;
  } else {
    this.OverWet.gain.value = 1;
    this.OverDry.gain.value = 0;
  }
};

Effects.prototype.setOver = function (state) {
  this._overState = state;
  if (this._overState) {
    this.OverWet.gain.value = 0;
    this.OverDry.gain.value = 1;
  } else {
    this.OverWet.gain.value = 1;
    this.OverDry.gain.value = 0;
  }
};

//-----------------FILTER-------------------------
Effects.prototype.toggleFilter = function () {
  if (this.EQwet.gain.value == 1) {
    this.EQwet.gain.value = 0;
    this.EQdry.gain.value = 1;
  } else {
    this.EQwet.gain.value = 2;
    this.EQdry.gain.value = 0;
  }
};

Effects.prototype.setFilter = function (state) {
  // sample.setFilter(!sample._eqState)
  this._eqState = state;
  if (this._eqState) {
    this.EQwet.gain.value = 1;
    this.EQdry.gain.value = 0;
  } else {
    this.EQwet.gain.value = 0;
    this.EQdry.gain.value = 1;
  }
};

//-------------------DELAY----------------------
Effects.prototype.toggleDelay = function () {
  if (this.DelayWet.gain.value == 1) {
    this.DelayWet.gain.value = 0;
    this.DelayDry.gain.value = 1;
  } else {
    this.DelayWet.gain.value = 1;
    this.DelayDry.gain.value = 0;
  }
};

Effects.prototype.setDelay = function (state) {
  this._delayState = state;
  if (this._delayState) {
    this.DelayWet.gain.value = 1;
    this.DelayDry.gain.value = 0;
  } else {
    this.DelayWet.gain.value = 0;
    this.DelayDry.gain.value = 1;
  }
};
//-------------------REVERB-------------------------
Effects.prototype.toggleReverb = function () {
  if (this.ReverbWet.gain.value == 1) {
    this.ReverbWet.gain.value = 0;
    this.ReverbDry.gain.value = 1;
  } else {
    this.ReverbWet.gain.value = 1;
    this.ReverbDry.gain.value = 0;
  }
};

Effects.prototype.setReverb = function (state) {
  this._reverbState = state;
  if (this._reverbState) {
    this.ReverbWet.gain.value = 1;
    this.ReverbDry.gain.value = 0;
  } else {
    this.ReverbWet.gain.value = 0;
    this.ReverbDry.gain.value = 1;
  }
};

//-------------------CAB----------------------
Effects.prototype.toggleCab = function () {
  if (this.CabWet.gain.value == 1) {
    this.CabWet.gain.value = 0;
    this.CabDry.gain.value = 1;
  } else {
    this.CabWet.gain.value = 1;
    this.CabDry.gain.value = 0;
  }
};

Effects.prototype.setCab = function (state) {
  this._cabState = state;
  if (this._cabState) {
    this.CabWet.gain.value = 1;
    this.CabDry.gain.value = 0;
  } else {
    this.CabWet.gain.value = 0;
    this.CabDry.gain.value = 1;
  }
};

//------------------CHANGE VALUES--------------------
Effects.prototype.changeGainFreq = function (value, type) {
  switch (type) {
    case "low":
      this._lowEQ = value;
      this.lowGain.gain.value = this._lowEQ;
      break;
    case "mid":
      this._midEQ = value;
      this.midGain.gain.value = this._midEQ;
      break;
    case "high":
      this._highEQ = value;
      this.highGain.gain.value = this._highEQ;
      break;
  }
};

Effects.prototype.changeVolume = function (value) {
  this._gainInput = value;
  this.volume.gain.value = this._gainInput;
};

Effects.prototype.changeReverbMix = function (value) {
  this._reverbMix = value;
  this.mixIn.gain.value = 1 - Number(this._reverbMix);
  this.mixOut.gain.value = Number(this._reverbMix);
};

Effects.prototype.changeReverbType = async function (value) {
  var folder = "impulse/reverb/";
  // let IRs = [];
  // fs.readdir(testFolder, (err, files) => {
  //     files.forEach(file => {
  //         IRs.push(file);
  //     });
  // });

  let response;
  let arraybuffer;

  this._reverbType = value;

  if (value == 0) {
    response = await fetch("impulse/reverb/Small Drum Room.wav");
  } else if (value == 0.25) {
    response = await fetch("impulse/reverb/Room 1.wav");
  } else if (value == 0.5) {
    response = await fetch("impulse/reverb/Spring 1.wav");
  } else if (value == 0.75) {
    response = await fetch("impulse/reverb/Conic Long Echo Hall.wav");
  }

  arraybuffer = await response.arrayBuffer();
  this.reverb.buffer = await context.decodeAudioData(arraybuffer);
};

Effects.prototype.changeDelayMix = function (value) {
  this._delayMix = value;
  this.DelayMix.gain.value = this._delayMix;
};

Effects.prototype.changeDelayFeedback = function (value) {
  this._delayFeed = value;
  this.DelayFeedback.gain.value = this._delayFeed * this._delayFeed;
};

Effects.prototype.changeDelaySpeed = function (value) {
  this._delaySpeed = value;
  this.DelaySpeed.delayTime.value = this._delaySpeed;
};

Effects.prototype.changeCabType = async function (value) {
  let response;
  let arraybuffer;

  this._cabType = value;
  if (value == 0) {
    response = await fetch("impulse/amp/AC30 normal sm57.wav");
  } else if (value == 0.25) {
    response = await fetch(
      "impulse/amp/Celestion Classic Lead Clean Tube sm57.wav"
    );
  } else if (value == 0.5) {
    response = await fetch(
      "impulse/amp/Celestion G12T75 Clean Solid State sm57.wav"
    );
  } else if (value == 0.75) {
    response = await fetch("impulse/amp/1960 G12M25 sm57.wav");
  }

  arraybuffer = await response.arrayBuffer();
  this.cab.buffer = await context.decodeAudioData(arraybuffer);
};

Effects.prototype.changeCabGain = function (value) {
  //1:3
  this._cabGain = value;
  this.CabGain.gain.value = this._cabGain * 2 + 1;
};

Effects.prototype.changeOverdriveVolume = function (value) {
  //0:2
  this._overVol = value;
  this.OverVol.gain.value = this._overVol * 2;
};

Effects.prototype.changeOverdrive = function (value) {
  this._overDrive = value;
  this.overdrive.curve = this.makeDistortionCurve(
    this._overDrive,
    this._overType
  );
};

Effects.prototype.changeOverdriveId = function (value) {
  this._overType = value;
  this.overdrive.curve = this.makeDistortionCurve(
    this._overDrive,
    this._overType * 5
  );
};

// function dist0(amount){
//     var n_samples = 44100;
//     var curve = new Float32Array(n_samples);
//     var deg = Math.PI / 180;
//     let x;
//     amount=amount*100;
//     for (let i = 0; i < n_samples; i++) {
//         x = (i * 2) / n_samples - 1;
//         curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
//     }
//     return curve;
// }

function dist0(amount) {
  var n_samples = 44100;
  var curve = new Float32Array(n_samples);
  amount = Math.min(amount, 0.9999);
  var k = (2 * amount) / (1 - amount),
    i,
    x;
  for (i = 0; i < n_samples; i++) {
    x = (i * 2) / n_samples - 1;
    curve[i] = ((1 + k) * x) / (1 + k * Math.abs(x));
  }
  return curve;
}

function dist1(amount) {
  var n_samples = 44100;
  var curve = new Float32Array(n_samples);
  var i, x, y;
  for (i = 0; i < n_samples; i++) {
    x = (i * 2) / n_samples - 1;
    y = (0.5 * Math.pow(x + 1.4, 2) - 1) * (y >= 0 ? 5.8 : 1.2);
    curve[i] = tanh(y);
  }
  return curve;
}
function dist2(amount) {
  var n_samples = 44100;
  var curve = new Float32Array(n_samples);
  var i,
    x,
    y,
    a = 1 - amount;
  for (i = 0; i < n_samples; i++) {
    x = (i * 2) / n_samples - 1;
    y = x < 0 ? -Math.pow(Math.abs(x), a + 0.04) : Math.pow(x, a);
    curve[i] = tanh(y * 2);
  }
  return curve;
}

function dist3(amount) {
  var n_samples = 44100;
  var curve = new Float32Array(n_samples);
  var i,
    x,
    y,
    abx,
    a = 1 - amount > 0.99 ? 0.99 : 1 - amount;
  for (i = 0; i < n_samples; i++) {
    x = (i * 2) / n_samples - 1;
    abx = Math.abs(x);
    if (abx < a) {
      y = abx;
    } else if (abx > a) {
      y = a + (abx - a) / (1 + Math.pow((abx - a) / (1 - a), 2));
    } else if (abx > 1) {
      y = abx;
    }
    curve[i] = sign(x) * y * (1 / ((a + 1) / 2));
  }
  return curve;
}

function dist4(amount) {
  // fixed curve, amount doesn't do anything, the distortion is just from the drive
  var n_samples = 44100;
  var curve = new Float32Array(n_samples);
  var i, x;
  for (i = 0; i < n_samples; i++) {
    x = (i * 2) / n_samples - 1;
    if (x < -0.08905) {
      curve[i] =
        (-3 / 4) *
          (1 -
            Math.pow(1 - (Math.abs(x) - 0.032857), 12) +
            (1 / 3) * (Math.abs(x) - 0.032847)) +
        0.01;
    } else if (x >= -0.08905 && x < 0.320018) {
      curve[i] = -6.153 * (x * x) + 3.9375 * x;
    } else {
      curve[i] = 0.630035;
    }
  }
  return curve;
}

function dist5(amount) {
  var n_samples = 44100;
  var curve = new Float32Array(n_samples);
  var a = 2 + Math.round(amount * 14),
    // we go from 2 to 16 bits, keep in mind for the UI
    bits = Math.round(Math.pow(2, a - 1)),
    // real number of quantization steps divided by 2
    i,
    x;
  for (i = 0; i < n_samples; i++) {
    x = (i * 2) / n_samples - 1;
    curve[i] = Math.round(x * bits) / bits;
  }
  return curve;
}

var waveshaperAlgorithms = [dist0, dist1, dist2, dist3, dist4, dist5];

Effects.prototype.makeDistortionCurve = function (amount) {
  //0.2 * 5 =1 etc -> 0:5
  return waveshaperAlgorithms[this._overType * 5](amount);
};

Effects.prototype.loadConfig = function (params, states) {
  // sample._gainInput, //0

  // sample._lowEQ,
  // sample._midEQ,
  // sample._highEQ,

  // sample._delayMix,
  // sample._delaySpeed,//5
  // sample._delayFeed,

  // sample._reverbMix,
  // sample._reverbType,

  // sample._cabGain,
  // sample._cabType,//10

  // sample._overVol,
  // sample._overDrive,
  // sample._overType,//13
  this.changeVolume(params[0]);

  this.changeGainFreq(params[1], "low");
  this.changeGainFreq(params[2], "mid");
  this.changeGainFreq(params[3], "high");

  this.changeDelayMix(params[4]);
  this.changeDelaySpeed(params[5]);
  this.changeDelayFeedback(params[6]);

  this.changeReverbMix(params[7]);
  this.changeReverbType(params[8]);

  this.changeCabGain(params[9]);
  this.changeCabType(params[10]);

  this.changeOverdriveVolume(params[11]);
  this.changeOverdrive(params[12]);
  this.changeOverdriveId(params[13]);

  //console.log(states)
  this.setInput(states[0]);
  this.setOver(states[1]);
  this.setFilter(states[2]);
  this.setDelay(states[3]);
  this.setReverb(states[4]);
  this.setCab(states[5]);
};
