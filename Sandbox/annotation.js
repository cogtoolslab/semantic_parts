paper.install(window);
window.onload = function() { 
  paper.setup('myCanvas');


  


  //var newPath
  //Storing SVG data for JSON file in smile
  var smile = smiley['svgData'];
  /*base = new CompoundPath(smile.join());
  base.strokeColor = 'red';
  base.strokeWidth = 10;*/
  //Iterating over the length of the SVG string and storing each stroke in a different thisBinding

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
    testObj.sub2[i] = pathArray[i].exportSVG({asString: true}).substring(44, pathArray[i].exportSVG({asString: true}).indexOf('"',44));
  }
  console.log(JSON.parse(JSON.stringify(testObj)).sub1);
  svgstring = pathArray[2].exportSVG({asString: true});
  var start = svgstring.indexOf('d="')+3;
  console.log(svgstring.substring(start, svgstring.indexOf('"',start)));
  console.log(svgstring);
  

  //TestPath = pathArray[2]; 
  //The commented out function below is for segment wise highlighting. You'll notice the need for
  //changing the this.marker0 variable name here, since "this" refers to something else in the function I think
  /*TestPath.onMouseEnter = function(event){
       newPath = new Path(TestPath.segments[0],TestPath.segments[1]);
       newPath.strokeColor = 'blue';
       newPath.strokeWidth = 8;} */  


 
  //highlight  helper functions




  isfalse = function(element){
    if(element == false){
      return true;
    }
    else {
      return false;
    }
  }

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
  


  function onResize(event) {
    // Whenever the window is resized, recenter the path:

  }; 
  
};

