paper.install(window);

window.onload = function() { 
  paper.setup('myCanvas');

  //var newPath
  //Storing SVG data for JSON file in smile
  var smile = smiley['svgData'];

  //Iterating over the length of the SVG string and storing each stroke in a different thisBinding

  var pathArray = new Array;
  for (var i = 0; i< smile.length; i++) {
    // this["marker"+i] = new Path(smile[i]);
    // this["marker"+i].strokeColor = 'black';
    // //Increasing stroke width to make it clickable
    // this["marker"+i].strokeWidth = 8;

    pathArray[i] = new Path(smile[i]);
    pathArray[i].strokeColor = 'black';
    //Increasing stroke width to make it clickable
    pathArray[i].strokeWidth = 8;

  };
   

  console.log(pathArray[2].exportSVG({asString: true}));
  TestPath = pathArray[2]; //setting this.marker0 to a new variable name since there are issues otherwise

  //The commented out function below is for segment wise highlighting. You'll notice the need for
  //changing the this.marker0 variable name here, since "this" refers to something else in the function I think
  /*TestPath.onMouseEnter = function(event){
       newPath = new Path(TestPath.segments[0],TestPath.segments[1]);
       newPath.strokeColor = 'blue';
       newPath.strokeWidth = 8;} */  

  //highlight  helper functions

  TestPath.alreadyClicked = false;

  TestPath.onClick = function(event){
     TestPath.strokeColor = 'red';
     TestPath.alreadyClicked = true;
  };

  //Code for hover highlight
  TestPath.onMouseEnter = function(event){
  if(TestPath.alreadyClicked == false){
   TestPath.strokeColor= 'blue';}
  };

  TestPath.onMouseLeave = function(event){
    // if(TestPath.strokeColor != 'red'){
    //   console.log(TestPath.strokeColor);
    //   TestPath.strokeColor = 'black';
    // }
    if(TestPath.alreadyClicked == false){
      console.log(TestPath.strokeColor);
      TestPath.strokeColor = 'black';
    }

  };
   
  var myPath;

  // drawing helper functions
  function onMouseDown(event) {
  myPath = new Path();
  myPath.strokeColor = 'black';
  console.log('mouse is down');
  }


  function onMouseDrag(event) {
  myPath.add(event.point);
  console.log('dragging mouse');

  }

  function onMouseUp(event) {
  myPath.add(event.point);
  myPath.strokeColor = 'red';
  myPath.simplify(10);
  console.log(myPath.exportSVG({asString: true}));


  CurveData = myPath.curves;
  showIntersections(myPath, myPath);
  //console.log(CurveData[5].point1, CurveData[5].point2, CurveData[5].handle1, CurveData[5].handle2);
  }


  function showIntersections(path1, path2) {
    var intersections = myPath.getIntersections(myPath);
    for (var i = 0; i < intersections.length; i++) {
        new Path.Circle({
            center: intersections[i].point,
            radius: 5,
            fillColor: '#009dec'
        })
     }
   };


  function onResize(event) {
    // Whenever the window is resized, recenter the path:
    smilepath.position = view.center;

  };  


}