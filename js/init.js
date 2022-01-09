document.body.className = "color dark-theme";
var sample = new Effects();
var context;
var theme = "dark";

const toggle = document.querySelector(".toggleInput");
toggle.addEventListener("click", (event) => {
  if (theme == "dark") {
    document.body.className = "color light-theme";
    theme = "light";
  } else {
    document.body.className = "color dark-theme";
    theme = "dark";
  }
});

const startTitleEl = document.querySelector(".startBtn");
const startContainerEl = document.querySelector(".startContainer");
const footerContainerEl = document.querySelector("#footer");
const pedalboardContainerEL = document.querySelector(".pedalboardContainer")
startTitleEl.addEventListener("click", (event) => {
  context = new (window.AudioContext || window.webkitAudioContext)();
  startContainerEl.remove(); //remove start
  footerContainerEl.remove();
  pedalboardContainerEL.style.setProperty("width", "100%");
  pedalboardContainerEL.style.setProperty("height", "100%");
  pedalboardContainerEL.style.setProperty("display", "flex");
  pedalboardContainerEL.style.setProperty("opacity", "1");

  // debut.style.setProperty('cursor', "default");

  sample.Init();
});
//
