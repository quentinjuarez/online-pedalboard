const range = document.getElementById("color-range");
pickerState = false;
prevX = null;

function engageColor(event) {
  pickerState = true;
  prevX = event.clientX;
  event.preventDefault();
  var rect = range.getBoundingClientRect();
  min = rect.left;
  max = rect.right;
  deg = Math.round(lerp(0, 360, invlerp(min, max, prevX)));
  document.body.setAttribute("style", `--color-deg: ${deg} !important;`);
  writeColor(deg);
}

function disengageColor(event) {
  pickerState = false;
}

function colorMove(X) {
  //Y return the position of the mouse
  if (pickerState) {
    if (prevX - X === 0) {
      return;
    }
    var rect = range.getBoundingClientRect();
    min = rect.left;
    max = rect.right;
    deg = Math.round(lerp(0, 360, invlerp(min, max, X)));
    document.body.setAttribute("style", `--color-deg: ${deg} !important;`);
    prevX = X;
    writeColor(deg);
  }
}

//modifie la valeur et l'apparence des que l'input est modifié
document.body.setAttribute("style", `--color-deg: ${readColor()} !important;`);

range.addEventListener("mousedown", (event) => {
  engageColor(event);
}); //autorise changement de valeur si on clic sur le picker
range.addEventListener("touchstart", (event) => {
  engageColor(event);
});
// range.addEventListener("wheel", (event) => {
//   engageColor(event);
// });

window.addEventListener("mouseup", (event) => {
  disengageColor(event);
}); //desautorise si la souris est relaché sur l'ecran
window.addEventListener("touchend", (event) => {
  disengageColor(event);
});

//event lorsqu'on bouge la souris
window.addEventListener("mousemove", (event) => {
  colorMove(event.clientX);
});

window.addEventListener("touchmove", (event) => {
  colorMove(event.touches[0].clientX);
});

// window.addEventListener("wheel", (event) => {
//   colorMove(event.deltaY, (wheel = true));
//   disengageColor(event);
// });
