
jsPsych.plugins['part_annotation'] = (function(){
  var totalBonus=0;
  var plugin = {};
  //intializing drag state checker and array of selected array
  var dragStat=false;
  //initializing array of selected strokes as empty
  var selectedArray=[];
  plugin.info = {
    name: 'part_annotation',
    parameters: {
    }
  }
  plugin.trial = function(display_element, trial) {
   var tool = new Tool();
   //More initializations
   var dict=[];
   var results=[];
   var tempSketch=[];
   var Bonus=totalBonus;
   var sketch=[];
   var pathArray=new Array;
   var c=0;
   var timeClicked;
   var clickable=true;
   var otherColor;
   var colNo = 0;
   var numLitStrokes=0; 
   var splineArray;   
   var timeLabeled;
   
    //Setting colors for the menu items ROYGBIV from left to right
    //var colors = ["#ff6666","#ffaa80","#ffb3ba","#ffdfba", "#ffffba", "#baffc9", "#bae1ff", "#bf80ff", "#f9bcff"];
    
    //Setting RGB values to interpolate between 
    var left = [237, 56, 8];
    var right = [56, 209, 237];
    
    


    //Putting function calls and HTML elements of the jsPsych display element within a 1 second timeout

    setTimeout(function() {
      //Setting up HTML for each trial
      display_element.innerHTML += ('<div class ="wrapper"></div><p id= "bonusMeter" style="font-size:25px;text-align:left; float:left;">Bonus: '+ Bonus + ' cents</p>\
        <p id="trialNum"style="text-align:right; font-size:25px"> '+(trial.trialNum+1)+" of "+trial.num_trials+'</p><div id="main_container" style="width:1000px;height:600px; margin:auto;"> \
        <div id= "upper_container" style="margin:auto; width:710px">\
        <div style="float:right; padding-top:43px;left:5px"><ul id="List" style="margin:auto;"></ul></div>\
        <div id="canvas_container" style="width:300px;display:absolute;margin:auto;">\
        <p id="Title" style="color:black;height:10%">'+ trial.category+'</p> \
        <canvas id="myCanvas" style="border: 2px solid #000000; border-radius:10px"  \
        resize="true" ></canvas> \
        <button id = "nextButton" type="button" style="float:bottom;height:10%">Next Sketch</button> \
        </div></div>\
        <div class="progress" style="float:bottom; margin-top:2px;margin-bottom:2px;"> \
        <div id= "progressbar" class="progress-bar" role="progressbar" \
        style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%\
        </div>\
        </div>\
        <div class="row" style = "float:bottom; display:table;x">\
        <img src='+trial.renders[0]+' style= "border:2px solid #000000;height:20%; width:20%;">\
        <img src='+trial.renders[1]+' style= "border:2px solid #000000;height:20%; width:20%;">\
        <img src='+trial.renders[2]+' style= "border:2px solid #000000;height:20%; width:20%;">\
        <img src='+trial.renders[3]+' style= "border:2px solid #000000;height:20%; width:20%;">\
        </div>\
        </div> \
        <div id="dialog-form" title="Enter Part Label">\
        <form>\
        <fieldset> \
        <label for="partName">Part Name</label>\
        <input type="text" name="partName" id="partName" \
        placeholder="Type your part label here" \
        class="text ui-widget-content ui-corner-all"> \
        <div id ="confirmContinue" title= "Move on to next sketch?">\
        Clicking continue will end the current trial. \
        Please make sure you have labeled all the parts that you can. \
        Click back to continue labeling the sketch.\
        </div>\
        <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">\
        </fieldset>\
        </form>\
        </div> \
        </div>');
      
            paper.setup('myCanvas');
      listgen();
      menugen();
      display();
    }, 1000);
    



    
//Ending trial and creating trial data to be sent to db. Also resetting HTML elements
var end_trial = function(results) {
 selectedArray=[];
 if(trial.training==false){
 totalBonus=totalBonus+Bonus;
}
 var turkInfo = jsPsych.turk.turkInfo();

      // gather the data to store for the trial
      var trial_data = _.extend({}, trial, {
      	wID: turkInfo.workerId,
      	hitID: turkInfo.hitId,
      	aID : turkInfo.assignmentId,
      	dbname: 'svgAnnotation',
      	colname: 'examples',
        iterationName: 'testing',
        results: results
      });

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };


   //Interpolating between the two values provided to generate colors for label menu
   function color_interpolate (left, right, colNo) {
    var partList = trial.parts.toString().split(',');
    var components = [];
    for (var i = 0; i < 3; i++) {
      console.log(partList.length);
      components[i] = Math.round(left[i] + (right[i] - left[i]) * colNo/(partList.length+2));
    }
    return('"'+"rgb"+"("+components[0]+","+components[1]+","+components[2]+")"+'"');
  }



//function for setting the color of the menu items
function setColor(li) {
  li.css("background-color", color_interpolate(left, right, colNo));
  colNo++;
};



function create(i) {
  var width = Math.random() * 8;
  var height = width * 0.4;
  var colourIdx = Math.ceil(Math.random() * 3);
  var colour = "red";
  switch(colourIdx) {
    case 1:
      colour = "yellow";
      break;
    case 2:
      colour = "blue";
      break;
    default:
      colour = "red";
  }
  $('<div class="confetti-'+i+' '+colour+'"></div>').css({
    "width" : width+"px",
    "height" : height+"px",
    "top" : -Math.random()*20+"%",
    "left" : Math.random()*100+"%",
    "opacity" : Math.random()+0.5,
    "transform" : "rotate("+Math.random()*360+"deg)"
  }).appendTo('.wrapper');  
  
  drop(i);
}

function drop(x) {
  $('.confetti-'+x).animate({
    top: "100%",
    left: "+="+Math.random()*15+"%"
  }, Math.random()*3000 + 3000, function() {
    reset(x);
  });
}

function reset(x) {
  $('.confetti-'+x).animate({
    "top" : -Math.random()*20+"%",
    "left" : "-="+Math.random()*15+"%"
  }, 0, function() {
    drop(x);             
  });
}

    //Main Display function for Canvas events
    function display(){  



      if(trial.training==true){
        $("#bonusMeter").text('');
        $("#trialNum").text('');
      }

/*$( "#List" ).position({
        my: "center top",
        at: "right center",
        of: "#main_container"
      })*/

      //Highlighting the target image in context
      $($('.row img')[0]).css({"border-width": "10px", "border-color": "red"});

      //Creating the 'next sketch' button
      $("#nextButton").click(function(){
        if(c==pathArray.length){
          var dataURL = document.getElementById('myCanvas').toDataURL();
      dataURL = dataURL.replace('data:image/png;base64,',''); 
      var category = trial.category;
      _.forEach(pathArray, function(p){
        if(p.alreadyClicked==false){
          svgstring = p.exportSVG({asString: true});
          var start = svgstring.indexOf('d="')+3;
          dict.push({"svgString": svgstring.substring(start, svgstring.indexOf('"',start)),
            "label": "NA", "strokeColor": p.strokeColor, "Time clicked" : "NA", "Time labeled": Math.floor(Date.now() / 1000), "strokeNum" : p.strokeNum});

        }
      })
      var tempObj={};
      tempObj[category] = dict;
      tempObj["png"] = dataURL;
      results.push(tempObj);
      console.log(results);
      results = JSON.stringify(results)
      console.log(results);
      //resetting canvas and menu elements
      project.activeLayer.removeChildren();
      paper.view.draw();
      $("#List").menu("destroy");
      $("#dialog-form").dialog("destroy");
      $("#confirmContinue").dialog("destroy");
      end_trial(results);

        }else if(trial.training==false&&c<pathArray.length){
        $('#confirmContinue').dialog("open")}}
        );



    //Displaying the sketch and setting stroke properties
    var svg = trial.svg;
    var numPaths=0;
    
for(var k=0;k<svg.length;k++){
    //converting data to absolute coordinates

    splineArray = Snap.path.toAbsolute(svg[k]);
    var copy = Snap.path.toAbsolute(svg[k]);
    //formatting spline data to be able to create paper js paths from them
    var numSplines = 0;
    for(i=0; i<splineArray.length; i++){
      if(splineArray[i][0]=='M'){
        tempSketch[numSplines] = (splineArray[i].concat(splineArray[i+1]));
        numSplines++;
        i++
      } else if (splineArray[i][0]=='C'){
       splineArray[i].unshift("M",copy[i-1][5],copy[i-1][6]); 
       tempSketch[numSplines] = splineArray[i];
       numSplines++;
     }
   }
   var numSplines = 0;
   _.forEach(tempSketch, function(f){
    sketch[numSplines]=f.toString();
    numSplines++
  })


  //Actually displaying the sketch

tempPath = new Array;
for(var i =0; i<sketch.length;i++){
tempPath[i] = new Path(sketch[i]);
}


console.log("pretemppath length", tempPath.length);
var j = tempPath.length-1;
while(j>0){
  if(tempPath[j].length<13||tempPath[j-1].length<13){
    tempPath[j]= tempPath[j-1].join(tempPath[j]);
    tempPath.splice(j,1);
      }
      j--
}
console.log("posttemppath length", tempPath.length);





  for (var i = numPaths; i< (tempPath.length+numPaths); i++) {
    pathArray[i] = tempPath[i-numPaths];
 console.log("This is the length of spline "+i+" "+pathArray[i].length)


    pathArray[i].strokeColor = "rgb(0,0,0)";
    pathArray[i].strokeWidth = 5;
   

      //already clicked tracks if a stroke has been labeled
      pathArray[i].alreadyClicked = false;
      //highlit tracks whether a stroke is ready to be labeled
      pathArray[i].highlit=false;
      //Appending a stroke number to each stroke
      pathArray[i].strokeNum=i; 
      
    };

/*var j = sketch.length+numPaths-2;
while(j>0){
  if(pathArray[j].length<12){
    pathArray[j]= pathArray[j].join(pathArray[j+1]);
    pathArray.splice(j+1,1);
    j--
  }
   pathArray[j].strokeColor = "rgb(0,0,0)";
   pathArray[j].strokeWidth = 5;
   

      //already clicked tracks if a stroke has been labeled
      pathArray[j].alreadyClicked = false;
      //highlit tracks whether a stroke is ready to be labeled
      pathArray[j].highlit=false;
      //Appending a stroke number to each stroke
      pathArray[j].strokeNum=j;
      j--
}*/






    numPaths= numPaths+tempPath.length;
    tempSketch=[];
    sketch=[];
   console.log("this is pathArray", pathArray);
}
   

/*

*/

   //Click and Hover event handlers


   _.forEach(pathArray, function(p) {
    //Single click handlers
    p.onClick = function(event) {
      if(clickable == true){ 
        //Selecting a new stroke that hasn't been labeled
        //Normal single click labeling
        if(p.alreadyClicked==false && p.highlit==false){
          p.highlit=true;
          selectedArray[numLitStrokes]=p;  
          timeClicked = Math.floor(Date.now() / 1000);
          $('#List').menu("enable");
          selectedArray[numLitStrokes].strokeColor = "rgb(200,200,200)";
          numLitStrokes++;}
        //Reselecting an already labeled stroke
        else if(p.alreadyClicked==true && selectedArray.length==0){
          clickable = false;
          p.strokeColor= '#660000';
          selectedArray[numLitStrokes]=p;
          console.log(dict);
          c--;
          if(dict.length>0){
            $('#List').menu("enable");
            for(var i=0; i<dict.length; i++){
              if(p.strokeNum==dict[i].strokeNum){
                var changed =false;
            //Changing menu color properties of previous label to distinguish it from others and to match it to current stroke color
            for(var j=0; j<$('#List li').length-1;j++){
              if($('li div')[j].innerHTML==dict[i].label){
                $($('li div')[j]).css("background-color", "#660000");
                $($('li div')[j]).css("color", "#f4d142");
                $($('li div')[j]).css("border-width", 3);
                $($('li div')[j]).css("border-color", "black");
                changed = true;
              } }
              if(changed==false){
                $($('li div')[$('#List li').length-1]).css("background-color", "#660000");
                $($('li div')[$('#List li').length-1]).css("color", "#f4d142");
                $($('li div')[$('#List li').length-1]).css("border-width", 3);
                $($('li div')[$('#List li').length-1]).css("border-color", "black");
              }
              dict.splice(i,1);}
            }
          } 
        }
        //Deselecting a stroke that was accidentally highlighted
        else if(p.alreadyClicked== false && p.highlit==true){
          numLitStrokes--;
          p.strokeColor= "rgb(0,0,0)";
          p.highlit=false;
          if(selectedArray.length>0){
            for(var i=0; i<selectedArray.length;i++){
              if(p.strokeNum==selectedArray[i].strokeNum){
               selectedArray.splice(i,1);
               if(selectedArray.length==0){
                 $('#List').menu("disable");
               }
             } }}
             console.log(selectedArray);

           }

         }}

       });

//Setting drag state to true for drag selector
tool.onMouseDrag= function(event){
 if(clickable == true){
   dragStat=true;
   console.log("MD", dragStat);

 }  }
 //Setting states for when mouse is lifted after dragging    
 tool.onMouseUp = function(event){
   if(clickable == true){
    if(dragStat==true && selectedArray.length!=0){
      timeClicked = Math.floor(Date.now() / 1000);
      $('#List').menu("enable");
      _.forEach(selectedArray, function(p){
        p.highlit = true;
        p.strokeColor = "rgb(200,200,200)";});
    }
    dragStat=false;

  } }

  _.forEach(pathArray, function(p) {
    p.onMouseEnter = function(event) {
     if(clickable == true){
        //When entering a stroke during dragging
        if(p.alreadyClicked == false && p.highlit==false && dragStat==true){
          p.highlit=true;
          selectedArray[numLitStrokes]=p;
          selectedArray[numLitStrokes].strokeColor = "rgb(100,100,100)";
          numLitStrokes++
        }
        //When entering a stroke while not dragging 
        else if (p.alreadyClicked == false && p.highlit==false && dragStat==false){
          console.log("general enter", dragStat)
          p.strokeColor = "rgb(100,100,100)";
        }
      }
    }});

  _.forEach(pathArray, function(p){
    //Setting stroke color back to black on exit from stroke, if not dragging
    p.onMouseLeave = function(event) {
     if(clickable == true){
      if(p.alreadyClicked == false && p.highlit==false && dragStat==false){
        p.strokeColor = "rgb(0,0,0)"; 
      }}
    } }); 
}

    //generating the menu 
    function listgen(){
      colNo=0
      $("#List").empty();
      var partList = trial.parts.toString().split(',');
      _.forEach(partList, function(p){
        var li = $("<li><div>" + p +"</div></li>" );
        setColor(li);
        li.appendTo("#List");

      });
      var unk = $("<li><div>" + "I can't tell" +"</div></li>" )
      setColor(unk);
      unk.appendTo("#List")
      var other = $("<li><div>" + "Other" +"</div></li>" );
      setColor(other);
      other.appendTo("#List");
      
    }
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
      select : function(event, ui){
        console.log(dict);
        clickable = true;
        //Refreshing the menu on each click;
        listgen();
        $("#List").menu("refresh");
        //Retrieving text element of selected option
        var text = ui.item.text();
        if(text!='Other'&& text!="I can't tell"){

          _.forEach(selectedArray,function(p){ 
            p.highlit=false;
            p.sendToBack();
            //Setting stroke color to the color of the menu item
            p.strokeColor= ui.item.css("background-color");
            p.alreadyClicked=true;
            
            svgstring = p.exportSVG({asString: true});
            var start = svgstring.indexOf('d="')+3;
            numLitStrokes=0;
            dict.push({"svgString": svgstring.substring(start, svgstring.indexOf('"',start)),
              "label": text, "strokeColor": p.strokeColor, "Time clicked" : timeClicked, "Time labeled": Math.floor(Date.now() / 1000), "strokeNum" : p.strokeNum});
            p.strokeWidth=5;
           // p.selected=false;



         });        

          c=c+selectedArray.length;
          //Progress bar update
          if(c==pathArray.length){
         for (var i = 0; i < 300; i++) {
  create(i);
}}
          
          $(".progress-bar").css("width", (c/pathArray.length)*100 + '%');
          $(".progress-bar").attr('aria-valuenow', (c/pathArray.length)*100);
          $('.progress-bar').html(c+" out of " +pathArray.length +' labeled');

          if(trial.training==false){

          Bonus=Math.round(Bonus+c*0.05*100)/100;
          $('#bonusMeter').html("Bonus: "+Bonus+" cents");
}
          /*if(c>(0.6*pathArray.length)){
            for( var i = 0; i<pathArray.length; i++){
              if(pathArray[i].alreadyClicked == false){
                pathArray[i].strokeWidth = 12;
              }
            }
          }*/

          for( var i = 0; i<pathArray.length; i++){
            if(pathArray[i].alreadyClicked == false){
              pathArray[i].strokeWidth = Math.max(5,(c/(pathArray.length))*13);
            }
          }
          

          selectedArray=[];
        }
        else if(text == 'Other'){
          //Calling dialog box
          otherColor = ui.item.css("background-color");
          $("#dialog-form").dialog("open");
        } else if(text =="I can't tell"){
         _.forEach(selectedArray,function(p){ 
          p.highlit=false;
          p.sendToBack();
            //Setting stroke color to the color of the menu item
            p.strokeColor= ui.item.css("background-color");
            p.alreadyClicked=true;
            svgstring = p.exportSVG({asString: true});
            var start = svgstring.indexOf('d="')+3;
            numLitStrokes=0;
            dict.push({"svgString": svgstring.substring(start, svgstring.indexOf('"',start)),
              "label": "unknown", "strokeColor": p.strokeColor, "Time clicked" : timeClicked, "Time labeled": Math.floor(Date.now() / 1000), "strokeNum" : p.strokeNum});


            p.strokeWidth=5;




          });        

         c=c+selectedArray.length;
         if(c==pathArray.length){
         for (var i = 0; i < 300; i++) {
  create(i);
}}
          //Progress bar update
          $(".progress-bar").css("width", (c/pathArray.length)*100 + '%');
          $(".progress-bar").attr('aria-valuenow', (c/pathArray.length)*100);
          $('.progress-bar').html(c+" out of " +pathArray.length +' labeled');

          for( var i = 0; i<pathArray.length; i++){
            if(pathArray[i].alreadyClicked == false){
              pathArray[i].strokeWidth = Math.max(5,(c/(pathArray.length))*13);
            }
          }
          

          selectedArray=[];

        }
          //Closing menu after selectioni
          $("#List").menu("disable");


        }
      });


  //Free response dialog box 

  $("#confirmContinue").dialog({
    autoOpen: false,
    height: 400,
    width: 350,
    modal: true,
    buttons : {
      "Back": function(){
       $("#confirmContinue").dialog("close");
     },
     "Continue" : function(){
      var dataURL = document.getElementById('myCanvas').toDataURL();
      dataURL = dataURL.replace('data:image/png;base64,',''); 
      var category = trial.category;
      _.forEach(pathArray, function(p){
        if(p.alreadyClicked==false){
          svgstring = p.exportSVG({asString: true});
          var start = svgstring.indexOf('d="')+3;
          dict.push({"svgString": svgstring.substring(start, svgstring.indexOf('"',start)),
            "label": "NA", "strokeColor": p.strokeColor, "Time clicked" : "NA", "Time labeled": Math.floor(Date.now() / 1000), "strokeNum" : p.strokeNum});

        }
      })
      var tempObj={};
      tempObj[category] = dict;
      tempObj["png"] = dataURL;
      results.push(tempObj);
      console.log(results);
      results = JSON.stringify(results)
      console.log(results);
      //resetting canvas and menu elements
      project.activeLayer.removeChildren();
      paper.view.draw();
      $("#List").menu("destroy");
      $("#dialog-form").dialog("destroy");
      $("#confirmContinue").dialog("destroy");
      end_trial(results);


    }
  }
})

  $( "#dialog-form" ).dialog({
    autoOpen: false,
    height: 400,
    width: 350,
    modal: true,
    open : function(event, ui) { 
      originalContent = $("#dialog-form").html();
    },
    close : function(event, ui) {
      $("#dialog-form").html(originalContent);
    },
    buttons: 
    {

      "Back": function(){
        selectedArray.strokeColor = 'black';
        //unclickable = false;
        $("#dialog-form").dialog("close");
        $("#List").menu("enable");
      } ,

      Submit: function(ui){

        clickable = true;
        _.forEach(selectedArray,function(p){ 
          p.highlit=false;
          p.strokeColor= otherColor;
          //p.selected=false;
          p.alreadyClicked=true;
          p.strokeWidth=5;
          var UI = $("#partName").val();
          if(UI==""){
            UI="unknown"
          }
          svgstring = p.exportSVG({asString: true});
          var start = svgstring.indexOf('d="')+3;
          numLitStrokes=0;
          dict.push({"svgString": svgstring.substring(start, svgstring.indexOf('"',start)),
            "label": UI, "strokeColor": p.strokeColor, "Time clicked" : timeClicked, "Time labeled": Math.floor(Date.now() / 1000), "strokeNum" : p.strokeNum});

        });        
        c=c+selectedArray.length;
         if(c==pathArray.length){
         for (var i = 0; i < 300; i++) {
  create(i);}}
        //progress bar update
        $(".progress-bar").css("width", (c/pathArray.length)*100 + '%');
        $(".progress-bar").attr('aria-valuenow', (c/pathArray.length)*100);
        $('.progress-bar').html(c+" out of "+pathArray.length +' labeled');
         if(c==pathArray.length){
          $('.gif').fadeIn(400);
          setTimeout(function(){ $('.gif').fadeOut(500);; }, 4000);
        }
        selectedArray=[];

        $(this).dialog("close");
      }
    }
  });
}    

}
return plugin;
})();

