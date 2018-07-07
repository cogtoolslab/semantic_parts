paper.install(window);
window.onload = function() { 
  paper.setup('myCanvas');
  
   //var newPath
  //Storing SVG data for JSON file in smile
  var smile = smiley['svgData'];
  var c=0;
  //Sketch Display 
  var pathArray = new Array;
  for (var i = 0; i< smile.length; i++) {
    pathArray[i] = new Path(smile[i]);
    pathArray[i].strokeColor = 'black';
    //Increasing stroke width to make it clickable
    pathArray[i].strokeWidth = 5;

  };

  console.log("SEG", pathArray[0].segments);

  for(var i =0;i<pathArray.length;i++){
    pathArray[i].alreadyClicked =false;
  }

  // Attach click event handlers to every stroke (i.e., Path)
  var unclickable = false;

  _.forEach(pathArray, function(p) {
    p.onClick = function(event) {
      if(p.alreadyClicked==false && unclickable == false){
      $('#menu').menu("enable");
      unclickable = true
      p.strokeColor = 'red';
      p.alreadyClicked = true;
      testObj.sub2[c]= p;
      console.log(c,testObj);
     
    }}
});
  _.forEach(pathArray, function(p) {
    p.onMouseEnter = function(event) {
      if(p.alreadyClicked == false && unclickable == false){
      p.strokeColor = 'blue';
     }
    }
});

  _.forEach(pathArray, function(p){
    p.onMouseLeave = function(event) {
      if(p.alreadyClicked == false && unclickable == false){
      p.strokeColor = 'black'; 
    }}
  }); 





  //Testing objects to create final json file for export
  var testObj = new Object();
  testObj.sub1 =[];
  testObj.sub2 = [];
  /*for (var i = 0; i<pathArray.length; i++){
    svgstring = pathArray[i].exportSVG({asString: true})
    var start = svgstring.indexOf('d="')+3;
    testObj.sub2[i] = svgstring.substring(start, svgstring.indexOf('"',start))
     }*/
     //Checking stuff
     //console.log(JSON.parse(JSON.stringify(testObj)));
     

 
var path;
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





  $("#dialog-form").submit(function(event) {
      event.preventDefault();
      });

      $("#Test").dialog({
      autoOpen: false,
      modal: true,
      show: { 
        effect: "fade",
        duration: 500
      },
      buttons : {
        terminate: function(){
          $(this).dialog("close");
        },
      }
     });

     $("#Test").dialog("widget")            
     .find(".ui-dialog-titlebar-close") 
     .hide(); 
     

      $( "#dialog-form" ).dialog({
      autoOpen: false,
      height: 400,
      width: 350,
      modal: true,
      buttons: {
        Submit: function(){
        var UI = $("#partName").val();
        testObj.sub1[c]=UI
         c++;
         $(this).dialog("close")
         if(c==pathArray.length){
        for (var i = 0; i<pathArray.length; i++){
    svgstring = pathArray[i].exportSVG({asString: true})
    var start = svgstring.indexOf('d="')+3;
    testObj.sub2[i] = svgstring.substring(start, svgstring.indexOf('"',start))
     }
    console.log(JSON.stringify(testObj));
  }
;
        }
      }
    });



    $( function() {
    $( "#menu" ).menu({ 
      disabled: true,
      modal: true,
      items: "> :not(.ui-widget-header)",
      select : function(event, ui){
        unclickable = false;
        var text = ui.item.text();
        if(text!='Other'){
        console.log(text);
        testObj.sub1[c]=text;
        c++;
        if(c==pathArray.length){
          for (var i = 0; i<pathArray.length; i++){
    svgstring = pathArray[i].exportSVG({asString: true})
    var start = svgstring.indexOf('d="')+3;
    testObj.sub2[i] = svgstring.substring(start, svgstring.indexOf('"',start))
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
  } );


  

 
 

 // // Code for click highlight
 //  pathArray[3].onClick = function(event){
 //   pathArray[3].strokeColor = 'red';
 //   pathArray.alreadyClicked[3] = true;
    

 //  };
 //  //Code for hover highlight

  
 //  pathArray[3].onMouseEnter = function(event){
 //  if(pathArray.alreadyClicked[3] == false){
 //    pathArray[3].strokeColor= 'blue';}
 //  };


 //  pathArray[3].onMouseLeave = function(event){
 //    // if(TestPath.strokeColor != 'red'){
 //    //   console.log(TestPath.strokeColor);
 //    //   TestPath.strokeColor = 'black';
 //    // }
 //    if(pathArray.alreadyClicked[3] == false){
 //      pathArray[3].strokeColor = 'black';

 //     };
 //  }; 

 /* function onResize(event) {
    // Whenever the window is resized, recenter the path:

  }; 
  */

};

