paper.install(window);
window.onload = function() { 
  paper.setup('myCanvas');
  
  //var newPath
  //Storing SVG data for JSON file in smile
  var smile = smiley['svgData'];
  
  //Sketch Display 

  var pathArray = new Array;
  for (var i = 0; i< smile.length; i++) {
    pathArray[i] = new Path(smile[i]);
    pathArray[i].strokeColor = 'black';
    //Increasing stroke width to make it clickable
    pathArray[i].strokeWidth = 5;

  };

 

  //Testing objects to create final json file for export
  var testObj = new Object();
  testObj.sub1 =[];
  testObj.sub2 = [];
  for (var i = 0; i<pathArray.length; i++){
    testObj.sub1[i] = i;
    svgstring = pathArray[i].exportSVG({asString: true})
    var start = svgstring.indexOf('d="')+3;
    testObj.sub2[i] = svgstring.substring(start, svgstring.indexOf('"',start))
     }
     //Checking stuff
  console.log(JSON.parse(JSON.stringify(testObj)).sub1);
  
  function onMouseDown(event) {
   console.log("MD")
   for(var i= 0; i< pathArray.length; i++){
   if (pathArray[i].contains(event.point)) {
    pathArray[i].strokeWidth = 10;
 } else {
   return;
 };
 };
 };


 var hitOptions = {
    segments: true,
    stroke: true,
    fill: true,
    tolerance: 5,
};

  //TestPath = pathArray[2]; 
  //The commented out function below is for segment wise highlighting. You'll notice the need for
  //changing the this.marker0 variable name here, since "this" refers to something else in the function I think
  /*TestPath.onMouseEnter = function(event){
       newPath = new Path(TestPath.segments[0],TestPath.segments[1]);
       newPath.strokeColor = 'blue';
       newPath.strokeWidth = 8;} */  


isfalse = function(element){
    if(element == false){
      return true;
    }
    else {
      return false;
    }
  }
 


  //highlight  helper functions

  pathArray.alreadyClicked = new Array(pathArray.length);
  pathArray.alreadyClicked.fill(false);

  //Conditional statement for final version
 if(pathArray.alreadyClicked.some(isfalse) == true){

 }
 
 

 // Code for click highlight
  pathArray[3].onClick = function(event){
   pathArray[3].strokeColor = 'red';
   pathArray.alreadyClicked[3] = true;
    

  };
  //Code for hover highlight

  
  pathArray[3].onMouseEnter = function(event){
  if(pathArray.alreadyClicked[3] == false){
    pathArray[3].strokeColor= 'blue';}
  };


  pathArray[3].onMouseLeave = function(event){
    // if(TestPath.strokeColor != 'red'){
    //   console.log(TestPath.strokeColor);
    //   TestPath.strokeColor = 'black';
    // }
    if(pathArray.alreadyClicked[3] == false){
      pathArray[3].strokeColor = 'black';

     };
  }; 
  

 /* function onResize(event) {
    // Whenever the window is resized, recenter the path:

  }; 
  */
};

