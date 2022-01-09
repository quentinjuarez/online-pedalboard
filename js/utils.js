function lerp(x, y, a) {
  return x * (1 - a) + y * a; //iterpaltion linéaire
}

function invlerp(a, b, v) {
  return clamp((v - a) / (b - a)); //inverse
}

function clamp(v, min = 0, max = 1) {
  return Math.min(max, Math.max(min, v));
}

function writeColor(deg) {
  localStorage.setItem("color", JSON.stringify(deg));
}

function readColor() {
  const deg = JSON.parse(localStorage.getItem("color"));

  return deg === null ? 190 : parseInt(deg);
}

function addConfigLS(config) {
  const configs = getConfigsLS();

  localStorage.setItem("configs", JSON.stringify([...configs, config]));
}

function saveConfigLS(config, id) {
  const configs = getConfigsLS();

  if (id > configs.length) return;

  configs[id] = config;
  localStorage.setItem("configs", JSON.stringify([...configs]));
}

function resetConfigLS(configId) {
  const configs = getConfigsLS();

  localStorage.setItem("configs", JSON.stringify(configs.splice(configId, 1)));
}

function getConfigsLS() {
  const configs = JSON.parse(localStorage.getItem("configs"));

  return configs === null ? [] : configs;
}

function normalize(param) {
  size = 3;
  num = Math.round(Number(param) * 100);
  str = num.toString();
  while (str.length < size) str = "0" + str;
  return str;
}

function normalizeState(state) {
  return state ? "100" : "000";
}

function denormalize(s) {
  num = parseInt(s);
  return num / 100;
}

function denormalizeState(state) {
  return state == "100" ? true : false;
}

defaultParams = [
  0.8, 0, 0.35, 0.5, 0.5, 0.5, 0.5, 0.2, 0.2, 0.4, 0.2, 0, 0.5, 0,
];

function paramsToConfig(params, states) {
  let config = "";
  params.forEach((param) => {
    config += normalize(param);
  });
  states.forEach((state) => {
    config += normalizeState(state);
  });
  return config;
}

function configToParams(config) {
  arr = config.match(/.{1,3}/g);
  params = [];
  states = [];
  arr.forEach((el, index) => {
    if (index < 14) {
      params.push(denormalize(el));
    } else {
      states.push(denormalizeState(el));
    }
  });

  return [params, states];
}

function hslToHex(h, s, l) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function addTitleLS(title) {
  const titles = getTitlesLS();

  localStorage.setItem("titles", JSON.stringify([...titles, title]));
}

function saveTitleLS(title, id) {
  const titles = getTitlesLS();

  if (id > titles.length) return;

  titles[id] = title;
  localStorage.setItem("titles", JSON.stringify([...titles]));
}

function getTitlesLS() {
  const titles = JSON.parse(localStorage.getItem("titles"));

  return titles === null ? [] : titles;
}
