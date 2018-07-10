paper.install(window);
window.onload = function() { 
  paper.setup('myCanvas');

 
  var sketchNo = 0; 
  var unclickable = false;
  var dict;
  var results;
  var selectedArray;
  var sketch;
  var pathArray;
  var c;
  trial();

  function display(){
  var sketch = data[sketchNo].svgData;
  pathArray = new Array;
  for (var i = 0; i< sketch.length; i++) {
    pathArray[i] = new Path(sketch[i]);
    pathArray[i].strokeColor = 'black';
    //Increasing stroke width to make it clickable
    pathArray[i].strokeWidth = 10;


       _.forEach(pathArray, function(p) {
    p.onClick = function(event) {
      if(p.alreadyClicked==false && unclickable == false){
      selectedArray=p;  
      $('#List').menu("enable");
      unclickable = true
      p.strokeColor = 'orange';
     // p.alreadyClicked = true;
     //testObj.SVGstring[c]= p;
  
     
    }}
});
  _.forEach(pathArray, function(p) {
    p.onMouseEnter = function(event) {
      console.log("ENTERED");
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

  };
//Setting already clicked property of all strokes to false
  for(var i =0;i<pathArray.length;i++){
    pathArray[i].alreadyClicked = false;
  };

  console.log(project.activeLayer.children);
  
  }

   function listgen(){
      $("#List").empty();
    _.forEach(data[sketchNo].parts, function(p){
        var li = $("<li><div>" + p +"</div></li>" );
        li.appendTo("#List");

    });
     var other = $("<li><div>" + "Other" +"</div></li>" );
        other.appendTo("#List");}



     function menugen(){
 // $("#dialog-form").submit(function(event) {
   //   event.preventDefault();
   //   });
     
 //Free response text box for 'Other' Option
     
     $("#List").menu({ 
      disabled: true,
      modal: true,
      //items: "> :not(.ui-widget-header)",
      select : function(event, ui){
        
        var text = ui.item.text();
        if(text!='Other'){
        unclickable = false;
        selectedArray.strokeColor= 'green';
        selectedArray.alreadyClicked=true;

        console.log(text);
        //testObj.partlabel[c]=text;
        svgstring = selectedArray.exportSVG({asString: true});
        var start = svgstring.indexOf('d="')+3;
        dict.push({"svgString": svgstring.substring(start, svgstring.indexOf('"',start)),
                   "label": text});
        c++;
        if(c==pathArray.length){
          var category = data[sketchNo].category;
          var tempObj={};
          tempObj[category] = dict;
         results.push(tempObj);
         results = JSON.stringify(results)
    console.log(results);
    console.log(JSON.parse(results)[0].smiley);
      sketchNo++;
      c=0;
      project.activeLayer.removeChildren();
      paper.view.draw();
      //display();
      if(sketchNo<data.length){
      $("#List").menu("destroy");
      trial();}
     
     
      console.log(pathArray);
  }
}
        else if(text == 'Other'){
        $("#dialog-form").dialog("open");
          }
        $("#List").menu("disable");
     

      }
    });







      $( "#dialog-form" ).dialog({
      autoOpen: false,
      height: 400,
      width: 350,
      modal: true,
      buttons: 


       
       {

          "Back": function(){
        selectedArray.strokeColor = 'black';
        unclickable = false;
        $("#dialog-form").dialog("close");
       } ,

        Submit: function(){
        console.log(selectedArray);
        selectedArray.strokeColor = 'green';
        selectedArray.alreadyClicked = true;
        unclickable = false;
        var UI = $("#partName").val();
        svgstring = selectedArray.exportSVG({asString: true});
        var start = svgstring.indexOf('d="')+3;
        dict.push({"svgString": svgstring.substring(start, svgstring.indexOf('"',start)),
                   "label": UI});
      
        //testObj.partlabel[c]=UI
         c++;
         $(this).dialog("close")
         if(c==pathArray.length){
          var category = data[sketchNo].category;

          var tempObj={};
          tempObj[category] = dict;
         results.push(tempObj);
         results = JSON.stringify(results)
    console.log(results);
    console.log(JSON.parse(results)[0].smiley);
    $("#List").empty;
    console.log(results);
    sketchNo++;
    display();
  }
;
        }
      
     
      }
    });



    
   }    




 
 
  //Storing SVG data for JSON file in sketch
  function trial(){

  dict = [];
   results = [];
   selectedArray;
   sketch;
   pathArray;
   c=0;
 
  //Sketch Display 
  display();
  listgen();
  menugen();

  // Attach click event handlers to every stroke (i.e., Path)

  //Introducing unclickable variable to mute sketch during menu input

 





  //Creating object for final export of stroke and label data
  //var testObj = new Object();
  //testObj.partlabel =[];
  //testObj.SVGstring = [];

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


   

    



 

 }








   
 
  function onMouseDown(){
    console.log("MD");
    project.activeLayer.children[0].strokeColor = 'blue';
  }


    

 /* function onResize(event) {
    // Whenever the window is resized, recenter the path:

  }; 
  */

};

