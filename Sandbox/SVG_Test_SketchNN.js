paper.install(window);

window.onload = function() { 
  paper.setup('myCanvas');

var myPath;

function onMouseDown(event) {
  myPath = new Path();
  myPath.strokeColor = 'black';
}

function onMouseDrag(event) {
  myPath.add(event.point);
}

function onMouseUp(event) {
  var myCircle = new Path.Circle({
    center: event.point,
    radius: 10
  });
  myCircle.strokeColor = 'black';
  myCircle.fillColor = 'white';
}
}