const newConfig = document.getElementById("new-config");
const containerConfig = document.querySelector("#configs");

defaultPlaceholders = ["Preset A", "Preset B", "Preset C", "Preset D"];

function addConfig(id = null) {
  currentParams = [
    sample._gainInput,

    sample._lowEQ,
    sample._midEQ,
    sample._highEQ,

    sample._delayMix,
    sample._delaySpeed,
    sample._delayFeed,

    sample._reverbMix,
    sample._reverbType,

    sample._cabGain,
    sample._cabType,

    sample._overVol,
    sample._overDrive,
    sample._overType,
  ];
  currentState = [
    sample._volState,
    sample._overState,
    sample._eqState,
    sample._delayState,
    sample._reverbState,
    sample._cabState,
  ];
  if (id == null) {
    addConfigLS(paramsToConfig(currentParams, currentState));
  } else {
    saveConfigLS(paramsToConfig(currentParams, currentState), id);
  }
}

function initConfigs() {
  configs = getConfigsLS();
  n = configs.length;
  while (n < 4) {
    addConfig();
    n = n + 1;
    addTitleLS("");
  }
  setTitle(0);
}

// function addConfigEl() {
//   var configs = getConfigsLS();
//   let configEl = document.createElement("div");
//   configEl.className = "configs__config";
//   configEl.innerHTML = `${configs.length}`;
//   configEl.setAttribute("id", `config_${configs.length - 1}`);
//   configEl.addEventListener("click", (event) => {
//     let id = parseInt(event.target.id.split("_")[1]);
//     loadConfig(id);
//   });
//   containerConfig.appendChild(configEl);
// }

function loadConfig(id) {
  configs = getConfigsLS();
  [params, states] = configToParams(configs[id]);
  //console.log(params);
  sample.loadConfig(params, states);
  loadValues(params, states);
}

presetLabels = document.querySelectorAll("label[id^=preset_]");
presetInputs = [
  document.querySelector("#config_a"),
  document.querySelector("#config_b"),
  document.querySelector("#config_c"),
  document.querySelector("#config_d"),
];

presetTitle = document.querySelector("#preset_title");

presetLabels.forEach((preset, index) => {
  preset.addEventListener("mousedown", clickHandler, true);
  preset.addEventListener("mouseup", cancelHandler, true);
});

var pressTimer = null;
function clickHandler(e) {
  pressTimer = setTimeout(() => {
    let id = e.target.id.split("_")[1];
    addConfig(id);
    setTitle(id);
    pressTimer = null;
    setAnimPreset(id);
  }, 600);
}

function cancelHandler(e) {
  if (pressTimer !== null) {
    clearTimeout(pressTimer);
    let id = e.target.id.split("_")[1];
    setActivePreset(id);
    setTitle(id);
    return loadConfig(id);
  }
}

function setActivePreset(id) {
  presetInputs.forEach((preset, index) => {
    if (index !== id) {
      preset.checked = false;
    } else {
      preset.checked = true;
    }
  });
}

function saveTitle(value) {
  console.log("change");
  switch (presetTitle.placeholder) {
    case "Preset A":
      saveTitleLS(value, 0);
      break;
    case "Preset B":
      saveTitleLS(value, 1);
      break;
    case "Preset C":
      saveTitleLS(value, 2);
      break;
    case "Preset D":
      saveTitleLS(value, 3);
      break;

    default:
      break;
  }
}

function setTitle(id) {
  titles = getTitlesLS();
  presetTitle.placeholder = defaultPlaceholders[id];
  presetTitle.value = titles[id] ? titles[id] : "";
}

function AnimPreset(id) {
  n = 200;
  setTimeout(() => {
    presetInputs[id].checked = false;
  }, n);
  setTimeout(() => {
    presetInputs[id].checked = true;
  }, 2 * n);
  setTimeout(() => {
    presetInputs[id].checked = false;
  }, 3 * n);
  setTimeout(() => {
    presetInputs[id].checked = true;
  }, 4 * n);
  setTimeout(() => {
    presetInputs[id].checked = false;
  }, 5 * n);
  setTimeout(() => {
    presetInputs[id].checked = true;
  }, 6 * n);
}

function setAnimPreset(id) {
  presetInputs.forEach((preset, index) => {
    if (index != id) {
      preset.checked = false;
    } else {
      AnimPreset(id);
    }
  });
}

initConfigs();
