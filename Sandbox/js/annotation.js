paper.install(window);
window.onload = function() { 
  paper.setup('myCanvas');

//initializing global vars

var sketchNo = 0; 
var unclickable = false;
var dict;
var results;
var selectedArray;
var sketch;
var pathArray;
var c;
var timeClicked;

  //calling the first trial by default
  trial();

  //Main Functions

  //This retrieves SVG data and presents the sketch on the canvas
  //Also contains handlers for highlight and click highlight events

  function display(){
    //displaying the indexed sketch through SVG data
    var sketch = data[sketchNo].svgData;
    pathArray = new Array;
    for (var i = 0; i< sketch.length; i++) {
      pathArray[i] = new Path(sketch[i]);
      pathArray[i].strokeColor = 'black';
    //Increasing stroke width to make it clickable
    pathArray[i].strokeWidth = 5;

   //Click and Hover event handlers
   _.forEach(pathArray, function(p) {
    p.onClick = function(event) {
      if(p.alreadyClicked==false && unclickable == false){
        selectedArray=p;  
        timeClicked = Math.floor(Date.now() / 1000);
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

  //Setting already clicked property of all strokes to false
  pathArray[i].alreadyClicked = false;

};
}


  //Function for creating lists in HTML from dictionary for menu widget

  function listgen(){
    $("#List").empty();
    _.forEach(data[sketchNo].parts, function(p){
      var li = $("<li><div>" + p +"</div></li>" );
      li.appendTo("#List");

    });
    var other = $("<li><div>" + "Other" +"</div></li>" );
    other.appendTo("#List");}

   //Function for creating menu and free response box widgets from the list created by listgen()

   function menugen(){

    //disabling enter key submit 
    $("#dialog-form").submit(function(event) {
      event.preventDefault();
    });

     //Populating the menu
     
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
          svgstring = selectedArray.exportSVG({asString: true});
          var start = svgstring.indexOf('d="')+3;
          dict.push({"svgString": svgstring.substring(start, svgstring.indexOf('"',start)),
           "label": text, "Time clicked" : timeClicked, "Time labeled": Math.floor(Date.now() / 1000)});
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
      }
    }
    else if(text == 'Other'){
      $("#dialog-form").dialog("open");
    }
    $("#List").menu("disable");


  }
});

  //Free response dialog box 

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
         "label": UI, "Time clicked" : timeClicked,  "Time labeled": Math.floor(Date.now() / 1000)});
        c++;
        $(this).dialog("close")
        if(c==pathArray.length){
          var category = data[sketchNo].category;
          var tempObj={};
          tempObj[category] = dict;
          results.push(tempObj);
          results = JSON.stringify(results)
          console.log(results);
          sketchNo++;
          c=0;
          project.activeLayer.removeChildren();
          paper.view.draw();

          if(sketchNo<data.length){
            $("#List").menu("destroy");
            trial();}
          }
          ;
        }
      }
    });
}    

  //Generating trials using helper functions

  function trial(){
    dict = [];
    results = [];
    selectedArray;
    sketch;
    pathArray;
    c=0;

    display();
    listgen();
    menugen();

  }

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
}}
 function onResize(event) {
    // Whenever the window is resized, recenter the path:

  }; 
  */

};

