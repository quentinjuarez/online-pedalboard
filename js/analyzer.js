var isVisualizer = true;
var isTuner = true;



function drawVisualizer() {
  sample.visualizer.width = 200;
  sample.visualizer.height = 200;
  requestAnimationFrame(drawVisualizer);

  const bufferLength = sample.analyserNode.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  sample.analyserNode.getByteFrequencyData(dataArray);
  const width = sample.visualizer.width;
  const height = sample.visualizer.height;

  reduite = (bufferLength * 3000) / context.sampleRate;

  const barWidth = width / reduite;

  const canvasContext = sample.visualizer.getContext("2d");
  canvasContext.clearRect(0, 0, width, height);


  var primaryColor = hslToHex(readColor(),100,70);
  var primaryDarkColor = hslToHex(readColor(),100,25);

  if (isVisualizer) {
    var g = canvasContext.createLinearGradient(0, 0, 0, height);
    // g.addColorStop(0, "#2f62ba");
    g.addColorStop(0, primaryDarkColor);
    g.addColorStop(0.5, primaryDarkColor);
    g.addColorStop(1,primaryColor );
    dataArray.forEach((item, index) => {
      if (index < reduite) {
        const y = (item / 255) * height;
        const x = barWidth * index;
        canvasContext.fillStyle = g;
        canvasContext.fillRect(x, height - y, barWidth, y);
      }
    });
  }
}

function toggleVisualizer() {
  isVisualizer = !isVisualizer;
}

function toggleTuner() {
  isTuner = !isTuner;
}

function drawTuner() {
  sample.tuner.width = 200;
  sample.tuner.height = 200;

  requestAnimationFrame(drawTuner);

  const bufferLength = sample.tunerNode.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  sample.tunerNode.getByteFrequencyData(dataArray);
  const width = 200;
  const height = 200;

  const canvasContext = sample.tuner.getContext("2d");
  canvasContext.clearRect(0, 0, width, height);

  var harm = Math.max(...dataArray);
  if (isTuner) {
    freq = (dataArray.indexOf(harm) * context.sampleRate) / bufferLength / 2;
    canvasContext.fillStyle = "white";
    canvasContext.font = "50px 'Barlow' , sans-serif";
    var r = findNote(freq);

    if (r === -1) {
      canvasContext.clearRect(0, 0, width, height);
    } else {
      var noteDetected = noteArray[r][1];
      var freqDetected = noteArray[r][0];

      var diff = freq - freqDetected;
      var heightNote = freq > freqDetected ? 1 : -1;
      canvasContext.fillText(
        `${noteDetected}`,
        noteDetected.length == 2 ? 65 : 50,
        120
      );
      var primaryColor = hslToHex(readColor(),100,70);
      if (Math.abs(diff) < 1) {
        triangle(50, 50, "left", primaryColor, canvasContext);
        triangle(150, 50, "right", primaryColor, canvasContext);
      } else {
        triangle(
          50,
          50,
          "left",
          heightNote == -1 ? primaryColor : "gray",
          canvasContext
        );
        triangle(
          150,
          50,
          "right",
          heightNote == 1 ? primaryColor : "gray",
          canvasContext
        );
      }

      drawRange(3 * diff, canvasContext);
    }
  }
}

function triangle(x, y, pos, color, context) {
  context.beginPath();
  if (pos == "right") {
    context.moveTo(x, y);
    context.lineTo(x + 25, y - 10);
    context.lineTo(x + 25, y + 10);
    context.closePath();
  } else if (pos == "left") {
    context.moveTo(x, y);
    context.lineTo(x - 25, y - 10);
    context.lineTo(x - 25, y + 10);
    context.closePath();
  }

  context.lineWidth = 5;
  context.strokeStyle = "#fff";
  context.stroke();

  // the fill color
  context.fillStyle = color;
  context.fill();
}

function drawRange(x, context) {
  context.beginPath();
  context.moveTo(60, 50);
  context.lineTo(140, 50);
  context.stroke();

  context.beginPath();
  context.moveTo(100 + x, 45);
  context.lineTo(100 + x, 55);
  context.stroke();
}

function findNote(e) {
  if (254.285 >= e) {
    if (89.903 >= e) {
      for (var r = 0; 17 >= r; r++)
        if (e > noteBorders[r][0] && e <= noteBorders[r][1]) return r;
    } else
      for (var r = 18; 35 >= r; r++)
        if (e > noteBorders[r][0] && e <= noteBorders[r][1]) return r;
  } else if (719.225 >= e) {
    for (var r = 36; 53 >= r; r++)
      if (e > noteBorders[r][0] && e <= noteBorders[r][1]) return r;
  } else
    for (var r = 54; 71 >= r; r++)
      if (e > noteBorders[r][0] && e <= noteBorders[r][1]) return r;
  return -1;
}
noteBorders = [
  [31.786, 33.676],
  [33.676, 35.678],
  [35.678, 37.8],
  [37.8, 40.047],
  [40.047, 42.429],
  [42.429, 44.952],
  [44.952, 47.624],
  [47.624, 50.456],
  [50.456, 53.457],
  [53.457, 56.635],
  [56.635, 60.003],
  [60.003, 63.571],
  [63.571, 67.351],
  [67.351, 71.356],
  [71.356, 75.599],
  [75.599, 80.095],
  [80.095, 84.857],
  [84.857, 89.903],
  [89.903, 95.249],
  [95.249, 100.915],
  [100.915, 106.915],
  [106.915, 113.27],
  [113.27, 120.005],
  [120.005, 127.14],
  [127.14, 134.7],
  [134.7, 142.71],
  [142.71, 151.195],
  [151.195, 160.185],
  [160.185, 169.71],
  [169.71, 179.805],
  [179.805, 190.5],
  [190.5, 201.825],
  [201.825, 213.825],
  [213.825, 226.54],
  [226.54, 240.01],
  [240.01, 254.285],
  [254.285, 269.405],
  [269.405, 285.42],
  [285.42, 302.395],
  [302.395, 320.38],
  [320.38, 339.43],
  [339.43, 359.61],
  [359.61, 380.995],
  [380.995, 403.65],
  [403.65, 427.65],
  [427.65, 453.08],
  [453.08, 480.02],
  [480.02, 508.565],
  [508.565, 538.81],
  [538.81, 570.85],
  [570.85, 604.79],
  [604.79, 640.755],
  [640.755, 678.86],
  [678.86, 719.225],
  [719.225, 761.99],
  [761.99, 807.3],
  [807.3, 855.305],
  [855.305, 906.165],
  [906.165, 960.05],
  [960.05, 1017.135],
  [1017.135, 1077.6],
  [1077.6, 1141.7],
  [1141.7, 1209.6],
  [1209.6, 1281.5],
  [1281.5, 1357.7],
  [1357.7, 1438.45],
  [1438.45, 1524],
  [1524, 1614.6],
  [1614.6, 1710.6],
  [1710.6, 1812.35],
  [1812.35, 1920.1],
  [1920.1, 2034.25],
];

var noteArray = [
  [32.703, "C1"],
  [34.648, "C1#"],
  [36.708, "D1"],
  [38.891, "D1#"],
  [41.203, "E1"],
  [43.654, "F1"],
  [46.249, "F1#"],
  [48.999, "G1"],
  [51.913, "G1#"],
  [55, "A1"],
  [58.27, "A1#"],
  [61.735, "B1"],
  [65.406, "C2"],
  [69.296, "C2#"],
  [73.416, "D2"],
  [77.782, "D2#"],
  [82.407, "E2"],
  [87.307, "F2"],
  [92.499, "F2#"],
  [97.999, "G2"],
  [103.83, "G2#"],
  [110, "A2"],
  [116.54, "A2#"],
  [123.47, "B2"],
  [130.81, "C3"],
  [138.59, "C3#"],
  [146.83, "D3"],
  [155.56, "D3#"],
  [164.81, "E3"],
  [174.61, "F3"],
  [185, "F3#"],
  [196, "G3"],
  [207.65, "G3#"],
  [220, "A3"],
  [233.08, "A3#"],
  [246.94, "B3"],
  [261.63, "C4"],
  [277.18, "C4#"],
  [293.66, "D4"],
  [311.13, "D4#"],
  [329.63, "E4"],
  [349.23, "F4"],
  [369.99, "F4#"],
  [392, "G4"],
  [415.3, "G4#"],
  [440, "A4"],
  [466.16, "A4#"],
  [493.88, "B4"],
  [523.25, "C5"],
  [554.37, "C5#"],
  [587.33, "D5"],
  [622.25, "D5#"],
  [659.26, "E5"],
  [698.46, "F5"],
  [739.99, "F5#"],
  [783.99, "G5"],
  [830.61, "G5#"],
  [880, "A5"],
  [932.33, "A5#"],
  [987.77, "B5"],
  [1046.5, "C6"],
  [1108.7, "C6#"],
  [1174.7, "D6"],
  [1244.5, "D6#"],
  [1318.5, "E6"],
  [1396.9, "F6"],
  [1480, "F6#"],
  [1568, "G6"],
  [1661.2, "G6#"],
  [1760, "A6"],
  [1864.7, "A6#"],
  [1975.5, "B6"],
];
