var engaged = {
  start_v: false,
  filter_l: false,
  filter_m: false,
  filter_h: false,
  delay_m: false,
  delay_s: false,
  delay_f: false,
  reverb_m: false,
  reverb_t: false,
  cab_g: false,
  cab_t: false,
  over_d: false,
  over_v: false,
  over_t: false,
  // metro_t: false,
  // metro_b: false,
  // metro_v: false,
};
var prevY = {
  start_v: null,
  filter_l: null,
  filter_m: null,
  filter_h: null,
  delay_m: null,
  delay_s: null,
  delay_f: null,
  reverb_m: null,
  reverb_t: null,
  cab_g: null,
  cab_t: null,
  over_d: null,
  over_v: null,
  over_t: null,
  // metro_t: null,
  // metro_b: null,
  // metro_v: null,
};

function initTicks(id) {
  idhash = `#${id}_ticks`;

  var ticks = document.querySelector(idhash);
  var nb = parseInt(ticks.getAttribute("data-nb-ticks"));

  for (let i = 0; i < nb; i++) {
    deg = lerp(0, 300, invlerp(0, nb - 1, i));
    tick = document.createElement("div");
    tick.innerHTML = `<div class="tick" data-deg="${
      deg + 30
    }" name="${id}_tick" style="transform: rotate(${deg + 30}deg); ">
                        </div>`;
    ticks.appendChild(tick);
  }
}

function setActiveTicks(min, max, val, id, type = false) {
  name = `${id}_tick`;
  ticks = document.getElementsByName(name); //name="start_v_tick"
  val = lerp(0, 300, invlerp(min, max, val));

  for (let i = 0; i < ticks.length; i++) {
    let deg = parseInt(ticks[i].getAttribute("data-deg"));
    if (type) {
      if (deg - 30 == val) {
        ticks[i].className = "tick active";
      } else {
        ticks[i].className = "tick";
      }
    } else {
      if (deg - 31 < val) {
        ticks[i].className = "tick active";
      } else {
        ticks[i].className = "tick";
      }
    }
  }
}

function setKnob(knob, min, max, value) {
  let decimal = invlerp(min, max, value);
  let squashed = lerp(0, 300, decimal); //pourcentage entre 0 et 300
  //input.value = value;
  knob.style.setProperty("--percentage", squashed);
}

function engage(event, id) {
  engaged[id] = true;
  prevY[id] = event.clientY;
  event.preventDefault();
}

function disengage(event, id) {
  engaged[id] = false;
}

function rotaryMove(Y, input, id, wheel = false) {
  //Y return the position of the mouse
  if (engaged[id]) {
    if (prevY[id] - Y === 0) {
      return;
    }
    if (!wheel) {
      let goingUp = prevY[id] >= Y; //true or false si up ou down
      prevY[id] = Y;

      let diff = input.min < 0 ? input.min / -100 : input.max / 100; //si le knob va dans les négatifs
      diff = diff < input.step ? input.step : diff; //plus petite différence est un step
      input.value = Number(input.value) + diff * (goingUp ? 1 : -1); //change imput value

      input.dispatchEvent(
        //déclanche l'event (ecoutable plus haut)
        new Event("input", {
          bubbles: true,
          cancelable: true,
        })
      );
    } else {
      diff = (Y * input.step) / 100;

      //let diff = test < 0 ? input.min : input.max;
      input.value = Number(input.value) - diff;
      input.dispatchEvent(
        //déclanche l'event (ecoutable plus haut)
        new Event("input", {
          bubbles: true,
          cancelable: true,
        })
      );
    }
  }
}

function Knob(knob, input, id) {
  //init
  setKnob(knob, input.min, input.max, input.value);
  initTicks(id);

  //modifie la valeur et l'apparence des que l'input est modifié

  knob.addEventListener("mousedown", (event) => {
    engage(event, id);
  }); //autorise changement de valeur si on clic sur le knob
  knob.addEventListener("touchstart", (event) => {
    engage(event, id);
  });
  knob.addEventListener("wheel", (event) => {
    engage(event, id);
  });

  window.addEventListener("mouseup", (event) => {
    disengage(event, id);
  }); //desautorise si la souris est relaché sur l'ecran
  window.addEventListener("touchend", (event) => {
    disengage(event, id);
  });

  //event lorsqu'on bouge la souris
  window.addEventListener("mousemove", (event) => {
    rotaryMove(event.clientY, input, id);
  });

  window.addEventListener("touchmove", (event) => {
    rotaryMove(event.touches[0].clientY, input, id);
  });

  window.addEventListener("wheel", (event) => {
    rotaryMove(event.deltaY, input, id, (wheel = true));
    disengage(event, id);
  });

  setActiveTicks(input.min, input.max, input.value, id);
}

const knobs = [
  document.querySelector("#start_k_v"), //0
  document.querySelector("#filter_k_l"),
  document.querySelector("#filter_k_m"),
  document.querySelector("#filter_k_h"),
  document.querySelector("#delay_k_m"),
  document.querySelector("#delay_k_s"), //5
  document.querySelector("#delay_k_f"),
  document.querySelector("#reverb_k_m"),
  document.querySelector("#reverb_k_t"),
  document.querySelector("#cab_k_g"),
  document.querySelector("#cab_k_t"), //10
  document.querySelector("#over_k_d"),
  document.querySelector("#over_k_v"),
  document.querySelector("#over_k_t"),
  // document.querySelector('#metro_k_t'),
  // document.querySelector('#metro_k_b'),
  // document.querySelector('#metro_k_v'),
];

const inputs = [
  document.querySelector("#start_i_v"), //0
  document.querySelector("#filter_i_l"),
  document.querySelector("#filter_i_m"),
  document.querySelector("#filter_i_h"),
  document.querySelector("#delay_i_m"),
  document.querySelector("#delay_i_s"), //5
  document.querySelector("#delay_i_f"),
  document.querySelector("#reverb_i_m"),
  document.querySelector("#reverb_i_t"),
  document.querySelector("#cab_i_g"),
  document.querySelector("#cab_i_t"), //10
  document.querySelector("#over_i_d"),
  document.querySelector("#over_i_v"),
  document.querySelector("#over_i_t"),
  // document.querySelector('#metro_i_t'),
  // document.querySelector('#metro_i_b'),
  // document.querySelector('#metro_i_v'),
];

const ids = [
  "start_v",
  "filter_l",
  "filter_m",
  "filter_h",
  "delay_m",
  "delay_s",
  "delay_f",
  "reverb_m",
  "reverb_t",
  "cab_g",
  "cab_t",
  "over_d",
  "over_v",
  "over_t",
  // "metro_t",
  // "metro_b",
  // "metro_v"
];

const toggles = [
  document.querySelector("#start_active"),
  document.querySelector("#over_active"),
  document.querySelector("#filter_active"),
  document.querySelector("#delay_active"),
  document.querySelector("#reverb_active"),
  document.querySelector("#cab_active"),
];

//input volume
inputs[0].addEventListener("input", (event) => {
  sample.changeVolume(event.target.value);
  setKnob(knobs[0], inputs[0].min, inputs[0].max, event.target.value);
  setActiveTicks(inputs[0].min, inputs[0].max, event.target.value, ids[0]);
}); //modifie la valeur et l'apparence des que l'input est modifié

//eq low
inputs[1].addEventListener("input", (event) => {
  sample.changeGainFreq(event.target.value, "low");
  setKnob(knobs[1], inputs[1].min, inputs[1].max, event.target.value);
  setActiveTicks(inputs[1].min, inputs[1].max, event.target.value, ids[1]);
}); //modifie la valeur et l'apparence des que l'input est modifié

//eq mid
inputs[2].addEventListener("input", (event) => {
  sample.changeGainFreq(event.target.value, "mid");
  setKnob(knobs[2], inputs[2].min, inputs[2].max, event.target.value);
  setActiveTicks(inputs[2].min, inputs[2].max, event.target.value, ids[2]);
}); //modifie la valeur et l'apparence des que l'input est modifié

//eq high
inputs[3].addEventListener("input", (event) => {
  sample.changeGainFreq(event.target.value, "high");
  setKnob(knobs[3], inputs[3].min, inputs[3].max, event.target.value);
  setActiveTicks(inputs[3].min, inputs[3].max, event.target.value, ids[3]);
}); //modifie la valeur et l'apparence des que l'input est modifié

//delay mix
inputs[4].addEventListener("input", (event) => {
  sample.changeDelayMix(event.target.value);
  setKnob(knobs[4], inputs[4].min, inputs[4].max, event.target.value);
  setActiveTicks(inputs[4].min, inputs[4].max, event.target.value, ids[4]);
}); //modifie la valeur et l'apparence des que l'input est modifié

//delay speed
inputs[5].addEventListener("input", (event) => {
  sample.changeDelaySpeed(event.target.value);
  setKnob(knobs[5], inputs[5].min, inputs[5].max, event.target.value);
  setActiveTicks(inputs[5].min, inputs[5].max, event.target.value, ids[5]);
}); //modifie la valeur et l'apparence des que l'input est modifié

//delay feedback
inputs[6].addEventListener("input", (event) => {
  sample.changeDelayFeedback(event.target.value);
  setKnob(knobs[6], inputs[6].min, inputs[6].max, event.target.value);
  setActiveTicks(inputs[6].min, inputs[6].max, event.target.value, ids[6]);
}); //modifie la valeur et l'apparence des que l'input est modifié

//reverb mix
inputs[7].addEventListener("input", (event) => {
  sample.changeReverbMix(event.target.value);
  setKnob(knobs[7], inputs[7].min, inputs[7].max, event.target.value);
  setActiveTicks(inputs[7].min, inputs[7].max, event.target.value, ids[7]);
}); //modifie la valeur et l'apparence des que l'input est modifié

//reverb type
inputs[8].addEventListener("input", (event) => {
  sample.changeReverbType(event.target.value);
  setKnob(knobs[8], inputs[8].min, inputs[8].max, event.target.value);
  setActiveTicks(
    inputs[8].min,
    inputs[8].max,
    event.target.value,
    ids[8],
    (type = true)
  );
}); //modifie la valeur et l'apparence des que l'input est modifié

//cab gain
inputs[9].addEventListener("input", (event) => {
  sample.changeCabGain(event.target.value);
  setKnob(knobs[9], inputs[9].min, inputs[9].max, event.target.value);
  setActiveTicks(inputs[9].min, inputs[9].max, event.target.value, ids[9]);
}); //modifie la valeur et l'apparence des que l'input est modifié

//cab type
inputs[10].addEventListener("input", (event) => {
  sample.changeCabType(event.target.value);
  setKnob(knobs[10], inputs[10].min, inputs[10].max, event.target.value);
  setActiveTicks(
    inputs[10].min,
    inputs[10].max,
    event.target.value,
    ids[10],
    (type = true)
  );
}); //modifie la valeur et l'apparence des que l'input est modifié

//overdrive
inputs[11].addEventListener("input", (event) => {
  sample.changeOverdrive(event.target.value);
  setKnob(knobs[11], inputs[11].min, inputs[11].max, event.target.value);
  setActiveTicks(inputs[11].min, inputs[11].max, event.target.value, ids[11]);
}); //modifie la valeur et l'apparence des que l'input est modifié

//overdrive volume
inputs[12].addEventListener("input", (event) => {
  sample.changeOverdriveVolume(event.target.value);
  setKnob(knobs[12], inputs[12].min, inputs[12].max, event.target.value);
  setActiveTicks(inputs[12].min, inputs[12].max, event.target.value, ids[12]);
}); //modifie la valeur et l'apparence des que l'input est modifié

//overdrive volume
inputs[13].addEventListener("input", (event) => {
  sample.changeOverdriveVolume(event.target.value);
  setKnob(knobs[13], inputs[13].min, inputs[13].max, event.target.value);
  setActiveTicks(
    inputs[13].min,
    inputs[13].max,
    event.target.value,
    ids[13],
    (type = true)
  );
}); //modifie la valeur et l'apparence des que l'input est modifié
// //metronome tempo
// inputs[13].addEventListener('input', event => {
//     changeTempo(event.target);
//     setKnob(knobs[13], inputs[13].min, inputs[13].max, event.target.value);
// }); //modifie la valeur et l'apparence des que l'input est modifié

// //metronome meter
// inputs[14].addEventListener('input', event => {
//     changeBeats(event.target);
//     setKnob(knobs[14], inputs[14].min, inputs[14].max, event.target.value);
// }); //modifie la valeur et l'apparence des que l'input est modifié

// //metronome meter
// inputs[15].addEventListener('input', event => {
//     changeVolume(event.target);
//     setKnob(knobs[15], inputs[15].min, inputs[15].max, event.target.value);
// }); //modifie la valeur et l'apparence des que l'input est modifié

for (i = 0; i < knobs.length; i++) {
  Knob(knobs[i], inputs[i], ids[i]);
}

function setActivePedal(input, state) {
  input.checked = state;
}

function loadValues(params, states) {
  for (i = 0; i < knobs.length; i++) {
    setKnob(knobs[i], inputs[i].min, inputs[i].max, params[i]);
    if (i == 8 || i == 10 || i == 13) {
      setActiveTicks(
        inputs[i].min,
        inputs[i].max,
        params[i],
        ids[i],
        (type = true)
      );
    } else {
      setActiveTicks(inputs[i].min, inputs[i].max, params[i], ids[i]);
    }
  }

  for (i = 0; i < toggles.length; i++) {
    setActivePedal(toggles[i], states[i]);
  }
}
