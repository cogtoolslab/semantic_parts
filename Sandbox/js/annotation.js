paper.install(window);
window.onload = function() { 
  paper.setup('myCanvas');

  //Storing SVG data for JSON file in sketch
 sketchNo = 1;

  var sketch = data[sketchNo].svgData;
  var c=0;
  //Sketch Display 
  var pathArray = new Array;
  for (var i = 0; i< sketch.length; i++) {
    pathArray[i] = new Path(sketch[i]);
    pathArray[i].strokeColor = 'black';
    //Increasing stroke width to make it clickable
    pathArray[i].strokeWidth = 5;

  };

   $("#List").empty

  
//Setting already clicked property of all strokes to false
  for(var i =0;i<pathArray.length;i++){
    pathArray[i].alreadyClicked =false;
  }

  // Attach click event handlers to every stroke (i.e., Path)

  //Introducing unclickable variable to mute sketch during menu input
  var unclickable = false;

  _.forEach(pathArray, function(p) {
    p.onClick = function(event) {
      if(p.alreadyClicked==false && unclickable == false){
      $('#menu').menu("enable");
      unclickable = true
      p.strokeColor = 'red';
      p.alreadyClicked = true;
      testObj.SVGstring[c]= p;
      console.log(c,testObj);
     
    }}
});
  _.forEach(pathArray, function(p) {
    p.onMouseEnter = function(event) {
      if(p.alreadyClicked == false && unclickable == false){
      p.strokeColor = 'yellow';
     }
    }
});

  _.forEach(pathArray, function(p){
    p.onMouseLeave = function(event) {
      if(p.alreadyClicked == false && unclickable == false){
      p.strokeColor = 'black'; 
    }}
  }); 





  //Creating object for final export of stroke and label data
  var testObj = new Object();
  testObj.partlabel =[];
  testObj.SVGstring = [];

  //Code for segment level highlight, might return to this 
 
/*var path;
var MasterPath = new Path();
function onMouseDrag(event) {
    var hitResult = project.hitTestAll(event.point, hitOptions);
    console.log('hitResult (' + hitResult.length + ')' , hitResult);
    if(hitResult){
    path = new Path({segments: hitResult});
    MasterPath = MasterPath.unite(path);
    MasterPath.strokeColor = 'yellow';
    MasterPath.strokeWidth = 5;
    console.log("MP",MasterPath._children);
    //console.log(MasterPath.exportSVG({asString: true}))

    } else {
    console.log("Oops")
  }
}


  //TestPath = pathArray[2]; 
  TestPath.onMouseEnter = function(event){
       newPath = new Path(TestPath.segments[0],TestPath.segments[1]);
       newPath.strokeColor = 'blue';
       newPath.strokeWidth = 8;} */  




  //Menu Interface



     _.forEach(data[sketchNo].parts, function(p){
        var li = $("<li><div>" + p +"</div></li>" );
        li.appendTo("#List");
    });


  //Disabling enter Key
  $("#dialog-form").submit(function(event) {
      event.preventDefault();
      });
     
 //Free response text box for 'Other' Option

      $( "#dialog-form" ).dialog({
      autoOpen: false,
      height: 400,
      width: 350,
      modal: true,
      buttons: {
        Submit: function(){
        var UI = $("#partName").val();
        testObj.partlabel[c]=UI
         c++;
         $(this).dialog("close")
         if(c==pathArray.length){
        for (var i = 0; i<pathArray.length; i++){
    svgstring = pathArray[i].exportSVG({asString: true})
    var start = svgstring.indexOf('d="')+3;
    testObj.SVGstring[i] = svgstring.substring(start, svgstring.indexOf('"',start))
     $("#List").empty
     }
    console.log(JSON.stringify(testObj));
  }
;
        }
      }
    });



    
     $("#List").menu();({ 
      disabled: true,
      modal: true,
      //items: "> :not(.ui-widget-header)",
      select : function(event, ui){
        unclickable = false;
        var text = ui.item.text();
        if(text!='Other'){
        console.log(text);
        testObj.partlabel[c]=text;
        c++;
        if(c==pathArray.length){
          for (var i = 0; i<pathArray.length; i++){
    svgstring = pathArray[i].exportSVG({asString: true})
    var start = svgstring.indexOf('d="')+3;
    testObj.SVGstring[i] = svgstring.substring(start, svgstring.indexOf('"',start));
     $("#List").empty
     }
    console.log(JSON.stringify(testObj));
  }
}
        else if(text == 'Other'){
        $("#dialog-form").dialog("open");
          }
        $("#menu").menu("disable");
     

      }
    });
    

 /* function onResize(event) {
    // Whenever the window is resized, recenter the path:

  }; 
  */

};

