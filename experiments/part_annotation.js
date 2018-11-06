


//Sketch Annotation tool


jsPsych.plugins['part_annotation'] = (function(){
  //totalBonus variable to carry-over bonus amount between trials
  var totalBonus=0;
  var plugin = {};
  //intializing drag state checker and array of selected array
  var dragStat=false;
  //initializing array of selected strokes as empty
  var selectedArray=[];
  var colorChecked = false;
  plugin.info = {
    name: 'part_annotation',
    parameters: {
    }
  }
  plugin.trial = function(display_element, trial) {
  //More initializations
  var dict= [];
  var results=[];
  var timeClicked;
  var timeLabeled;
  var tool = new Tool();
  var totalSplines;
  var Bonus=0;
  var tempSketch=[];
  var sketch=[];
  var pathArray=new Array;
  var splineArray;   
  var clickable=true;
  var c=0;
  var numOthers=0;
  var otherColor;
  var colNo = 0;
  var numLitStrokes=0;
  var confettiCount= 200; 
  var similarityThreshold=0.9; 
  var colorFlag = false;
  var splineArcLengthThreshold = 18;
  var maxSameColStrokes
  colorChecked=false;
  var bout=0
  var instCountArr
  var partList

  //Setting colors for the menu items ROYGBIV from left to right
  //Setting RGB values to interpolate between 
  var left = [237, 56, 8];
  var right = [56, 209, 237];


  //Putting function calls and HTML elements of the jsPsych display element within a 1 second timeout

  setTimeout(function() {
    //Setting up HTML for each trial
    display_element.innerHTML += ('<a id="downloadAnchorElem" style="display:none"></a>\
      <div class ="wrapper"></div><p id= "bonusMeter" style="font-size:25px;text-align:left; float:left;">Bonus: $ '+ totalBonus.toFixed(3)+'</p>\
      <p id="trialNum"style="text-align:right; font-size:25px"> '+(trial.trialNum+1)+" of "+trial.num_trials+'</p><div id="main_container" style="width:1000px;height:600px; margin:auto;"> \
      <div id= "upper_container" style="margin:auto; width:800px">\
      <div style="float:right; padding-top:43px;left:0px"><ul id="List" style="margin:auto; float:left"></ul>\
      <div style="float:left; padding-top:0px;left:0px"><ul id="InstCount" style="margin:auto;"></ul></div></div>\
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
      Clicking continue will end the current round. \
      Please make sure you have labeled all the parts that you can. \
      Click back to continue labeling the sketch.\
      </div>\
      <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">\
      </fieldset>\
      </form>\
      </div> \
      </div>\
      <div id= "colorCheck" title="Are you sure?">It looks like you used the same label for a lot of strokes! Why not take a second to check\
      your labeling just to be sure? Once you are done, click on the "next sketch" button again to continue</div>');

    paper.setup('myCanvas');
    partList = trial.parts.toString().split(',');
    instCountArr = Array.apply(null, Array(partList.length+2)).map(Number.prototype.valueOf,0);
    console.log("This is the arr", instCountArr)
    listgen();
    menugen();
    display();
  }, 1000);



//Ending trial and creating trial data to be sent to db. Also resetting HTML elements
var end_trial = function(results) {

 var time = Date.now();
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
     colname: 'chairs4',
     iterationName: 'run0_chairs4',
     bonus: totalBonus,
     time: time,
     numSplines: totalSplines,
     condition: trial.condition,
     sameAnnotflag:colorFlag,
     numStrokes: trial.numStrokes,
     trialNum: trial.trialNum,
     originalGameID : trial.gameID,     
     originalCondition: trial.condition,     
     originalOutcome: trial.outcome,     
     originalTrialNum:trial.originalTrialNum,
     originalResponse:trial.response,
     annotations: results
   });
   console.log(trial_data);

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
      components[i] = Math.round(left[i] + (right[i] - left[i]) * colNo/(partList.length));
    }
    return('"'+"rgb"+"("+components[0]+","+components[1]+","+components[2]+")"+'"');
  }



  //function for setting the color of the menu items
  function setColor(li) {
    li.css("background-color", color_interpolate(left, right, colNo));
    colNo++;
  };


  //Confetti creator for when all strokes are labeled
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



  //Dropping created confetti
  function drop(x) {
   $('.confetti-'+x).animate({
    top: "100%",
    left: "+="+Math.random()*15+"%"
  }, Math.random()*3000 + 3000, function() {
    //reset(x);
  });
 }
 //Resetting confetti to cycle
 function reset(x) {
  $('.confetti-'+x).animate({
    "top" : -Math.random()*20+"%",
    "left" : "-="+Math.random()*15+"%"
  }, 0, function() {
    drop(x);             
  });
}


//Checking to make sure too many stokes have not been annotated with the same label
function sameColorCheck(pathArray){
  if(colorChecked==true){
      // console.log("second pass");
      return(false);
    }
    var sameColStrokesArr=[]
    
    for(var i=0;i<dict.length;i++){
      var sameColStrokes=1;
       // console.log(dict.length,dict[i].label,dict[0].label);
       _.forEach(dict, function(p){
        if(p.label==dict[i].label){
         sameColStrokes++;
       }
     })
       sameColStrokesArr[i]=sameColStrokes
     }
     maxSameColStrokes = Math.max.apply(Math, sameColStrokesArr) 
     console.log(sameColStrokesArr)

     if(maxSameColStrokes/dict.length>=similarityThreshold){
      return(true);
    }else{return(false)}


  }


//------Main Display function for Canvas events------//

function display(){  

//Hiding bonusmeter and progress marker if its the training trial

if(trial.training==true){
  $("#bonusMeter").text('');
  $("#trialNum").text('');
}




  //Highlighting the target image in context
  $($('.row img')[0]).css({"border-width": "10px", "border-color": "red"});


  //Creating the 'next sketch' button
  $("#nextButton").click(function(){
    console.log("colorChecked",colorChecked)
    if(c==pathArray.length&& sameColorCheck(pathArray)==false){
      var dataURL = document.getElementById('myCanvas').toDataURL();
      dataURL = dataURL.replace('data:image/png;base64,',''); 
      var category = trial.category;
      _.forEach(pathArray, function(p){
        if(p.alreadyClicked==false){
          svgstring = p.exportSVG({asString: true});
          var start = svgstring.indexOf('d="')+3;
          dict.push({"svgString": svgstring.substring(start, svgstring.indexOf('"',start)),
            "label": NaN, 
            "strokeColor": p.strokeColor, 
            "timeClicked" : NaN, 
            "timeLabeled": Date.now(), 
            "cumulativeSplineNum" : p.strokeNum, 
            "strokeNum":p.masterStrokeNum, 
            "withinStrokeSplineNum": p.withinStrokeSplineNum,
            "boutNum":NaN,
            "partBoutNum":NaN });

        }
      })
      var tempObj={};
      tempObj[category] = dict;
      tempObj["png"] = dataURL;
      results.push(tempObj);
      results = JSON.stringify(results)
      //resetting canvas and menu elements
      project.activeLayer.removeChildren();
      paper.view.draw();
      $("#List").menu("destroy");
      $("#InstCount").menu("destroy")
      $("#dialog-form").dialog("destroy");
      $("#confirmContinue").dialog("destroy");

      //Some code to download the results json locally for checking purposes
      /*

      var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(results);
      var dlAnchorElem = document.getElementById('downloadAnchorElem');
      dlAnchorElem.setAttribute("href",     dataStr     );
      dlAnchorElem.setAttribute("download", "scene.json");
      dlAnchorElem.click();

      */

      end_trial(results);


      //Opening a confirmation box if all strokes haven't been labeled
    }else if(c==pathArray.length){
      colorFlag=true;
      $("#colorCheck").dialog("open");

    }else if(trial.training==false&&c<pathArray.length){
      $('#confirmContinue').dialog("open")}}
      );



  //----------Displaying the sketch and setting stroke properties--------//

  var svg = trial.svg;
  //console.log("trial.svg looks like this", trial.svg[0][0])
  var numPaths=0;
  for(var k=0;k<svg.length;k++){

    //converting data to absolute coordinates
    splineArray = Snap.path.toCubic(Snap.path.toAbsolute(svg[k]));
    var copy = Snap.path.toCubic(Snap.path.toAbsolute(svg[k]));
    //console.log(copy);

    //formatting spline data to be able to create paper js paths from them
    var numSplines = 0;
    for(i=0; i<splineArray.length; i++){
      if(splineArray[i][0]=='M'&&splineArray[i+1][0]!='M'){
        tempSketch[numSplines] = (splineArray[i].concat(splineArray[i+1]));
        numSplines++;
        i++
      } else if(splineArray[i][0]=='M'&&splineArray[i+1][0]=='M'){
        tempSketch[numSplines] = splineArray[i];
        numSplines++
      } 
      else if (splineArray[i][0]=='C'){
       splineArray[i].unshift("M",copy[i-1][5],copy[i-1][6]); 
       tempSketch[numSplines] = splineArray[i];
       numSplines++;
     }
   }

   //Stringifying path data
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

  //Checking splines pairwise within strokes to concatenate small splines
  var j = tempPath.length-1;
  while(j>0){
    if(tempPath[j].length<splineArcLengthThreshold||tempPath[j-1].length<splineArcLengthThreshold){
      tempPath[j]= tempPath[j-1].join(tempPath[j]);
      tempPath.splice(j,1);
    }
    j--
  }

  //Setting properties for the splines

  for (var i = numPaths; i< (tempPath.length+numPaths); i++) {
    pathArray[i] = tempPath[i-numPaths];
    pathArray[i].strokeColor = "rgb(0,0,0)";
    pathArray[i].strokeWidth = 5;
    pathArray[i].masterStrokeNum = k; //Stroke Num
    //already clicked tracks if a stroke has been labeled
    pathArray[i].alreadyClicked = false;
    //highlit tracks whether a stroke is ready to be labeled
    pathArray[i].highlit=false;
    pathArray[i].strokeNum=i; //spline Num
    pathArray[i].withinStrokeSplineNum = i-numPaths; //Spline index within stroke
  };

  numPaths= numPaths+tempPath.length;
  tempSketch=[];
  sketch=[];
}

totalSplines= numPaths;




   //-----------Click and Hover event handlers----------//


   _.forEach(pathArray, function(p) {
    //Single click handlers
    p.onClick = function(event) {
      if(clickable == true){ 

        //Normal single click labeling for labeled and unlabeled strokes


        //if(p.alreadyClicked==false && p.highlit==false){
          if(p.highlit==false){
            p.highlit=true;
            selectedArray[numLitStrokes]=p;  
            timeClicked = Date.now();
            $('#List').menu("enable");
            selectedArray[numLitStrokes].strokeColor = "rgb(200,200,200)";
            numLitStrokes++;
            console.log("array of selected strokes",selectedArray)}


        // Currently deprecated code for selecting an already labeled stroke

        /*
        else if(p.alreadyClicked==true && selectedArray.length==0){
          clickable = false;
          p.strokeColor= '#660000';
          selectedArray[numLitStrokes]=p;
          c--;
          if(dict.length>0){
            $('#List').menu("enable");
            for(var i=0; i<dict.length; i++){
              if(p.strokeNum==dict[i].cumulativeSplineNum){
                var changed =false;
            //Changing menu color properties of previous label to distinguish it from others and to match it to current stroke color
            for(var j=0; j<$('#List li').length-2;j++){
              if($('li div')[j].innerHTML==dict[i].label){
                $($('li div')[j]).css("background-color", "#660000");
                $($('li div')[j]).css("color", "#f4d142");
                $($('li div')[j]).css("border-width", 3);
                $($('li div')[j]).css("border-color", "black");
                changed = true;
              } }
              if(dict[i].label=="unknown"){
                $($('li div')[$('#List li').length-2]).css("background-color", "#660000");
                $($('li div')[$('#List li').length-2]).css("color", "#f4d142");
                $($('li div')[$('#List li').length-2]).css("border-width", 3);
                $($('li div')[$('#List li').length-2]).css("border-color", "black");
                changed = true;
              }

              else if(changed==false){
                $($('li div')[$('#List li').length-1]).css("background-color", "#660000");
                $($('li div')[$('#List li').length-1]).css("color", "#f4d142");
                $($('li div')[$('#List li').length-1]).css("border-width", 3);
                $($('li div')[$('#List li').length-1]).css("border-color", "black");
              }
              dict.splice(i,1);
              console.log(dict);}
            }
          } 
        }
        */


      //Deselecting a stroke that was accidentally highlighted

      //else if(p.alreadyClicked== false && p.highlit==true){
        else if(p.highlit==true){ 
          numLitStrokes--;
          if(p.alreadyClicked==false){
            p.strokeColor= "rgb(0,0,0)";
            p.highlit=false;
          } else if(p.alreadyClicked==true){
            for(var i=0; i<dict.length;i++){
              if(p.strokeNum==dict[i].cumulativeSplineNum){
                console.log(p.strokeNum, dict[i].cumulativeSplineNum)
                p.strokeColor=dict[i].strokeColor
                p.highlit=false
              }
            }

          }

          if(selectedArray.length>0){
            for(var i=0; i<selectedArray.length;i++){
              if(p.strokeNum==selectedArray[i].strokeNum){
               selectedArray.splice(i,1);
               if(selectedArray.length==0){
                 $('#List').menu("disable");
               }
             } }}

           }

         }}

       });



  //Setting drag state to true for drag selector
  tool.onMouseDrag= function(event){

   if(clickable == true){


     dragStat=true;
   }}

 //Setting states for when mouse is lifted after dragging and activating menus
 tool.onMouseUp = function(event){




   console.log("colorchecked",colorChecked)
   //timeClicked = Date.now();
   if(clickable == true){
    console.log("selectedArrayBefore", selectedArray)

    if(dragStat==true && selectedArray.length!=0){

     console.log(timeClicked);
     $('#List').menu("enable");
     _.forEach(selectedArray, function(p){
      p.highlit = true;
      p.strokeColor = "rgb(200,200,200)";});
   }
   dragStat=false;





 } }


  //Hover events for entering and exiting strokes

  _.forEach(pathArray, function(p) {
    p.onMouseEnter = function(event) {

     if(clickable == true){
        //When entering a stroke during dragging
        //if(p.alreadyClicked == false && p.highlit==false && dragStat==true){
          if(p.highlit==false && dragStat==true){  
            timeClicked = Date.now();
            p.highlit=true;
            selectedArray[numLitStrokes]=p;
            selectedArray[numLitStrokes].strokeColor = "rgb(100,100,100)";
            numLitStrokes++
          }
        //When entering a stroke while not dragging 
        //else if (p.alreadyClicked == false && p.highlit==false && dragStat==false){
          else if (p.highlit==false && dragStat==false){  
            p.strokeColor = "rgb(100,100,100)";
          }
        }
      }});

  _.forEach(pathArray, function(p){
    //Setting stroke color back to black on exit from stroke, if not dragging
    p.onMouseLeave = function(event) {
     if(clickable == true){
      //if(p.alreadyClicked == false && p.highlit==false && dragStat==false){
       if(p.highlit==false && dragStat==false){
        if(p.alreadyClicked==false){
         p.strokeColor = "rgb(0,0,0)"; 
       }else if(p.alreadyClicked==true){
        for(var i=0; i<dict.length;i++){
          if(p.strokeNum==dict[i].cumulativeSplineNum){
            p.strokeColor=dict[i].strokeColor
          }
        }
      }
    }else if(p.highlit==false&&dragStat==true){
      timeClicked = Date.now();
      p.highlit=true;
      selectedArray[numLitStrokes]=p;
      selectedArray[numLitStrokes].strokeColor = "rgb(100,100,100)";
      numLitStrokes++

    }
  }
} }); 
}



  //Generating the list of par labels 
  function listgen(){
    colNo=0
    instCountInd=0
    
    $("#List").empty();
    $("#InstCount").empty();
    var partList = trial.parts.toString().split(',');
    _.forEach(partList, function(p){
      var li = $("<li><div>" + p +"</div></li>" );
      console.log("hey is this fine?",instCountArr)
      var inst= $("<li><div id='"+instCountInd+"'>" + instCountArr[instCountInd] +"</div></li>" );
      instCountInd++
      setColor(li);
      li.appendTo("#List");
      inst.appendTo("#InstCount");

    });
    var unk = $("<li><div>" + "I can't tell"+"</div></li>" )

    var inst= $("<li><div id='"+instCountInd+"'>" + instCountArr[instCountInd]+"</div></li>" );
    instCountInd++
    setColor(unk);
    unk.appendTo("#List");
    inst.appendTo("#InstCount");
    var other = $("<li><div>" + "Other" +"</div></li>" );

    var inst= $("<li><div id='"+instCountInd+"'>" + instCountArr[instCountInd]+"</div></li>" );
    //instCountInd++
    setColor(other);
    other.appendTo("#List");
    inst.appendTo("#InstCount");

  }

  //Function for creating menu and free response box widgets from the list created by listgen()
  function menugen(){
    //disabling enter key submit 
    $("#dialog-form").submit(function(event) {
      event.preventDefault();
    });

     //Populating the menu
     //Creating functions for menu interaction






     $("#InstCount").menu({
       disabled: true,
     })







     
     $("#List").menu({ 
      disabled: true,
      modal: true,
      select : function(event, ui){

        clickable = true;
        //Refreshing the menu on each click;
        listgen();
        $("#List").menu("refresh");
        $("#InstCount").menu("refresh")
        //Retrieving text element of selected option
        var text = ui.item.text();

        console.log($("#InstCount"))
        if(text!='Other'&& text!="I can't tell"){
          var loc

          for(var i=0;i<partList.length;i++){
            if(text==partList[i]){
              loc=i

            }
          }


          var tempBouts = []
          var tempMaxBout = 0
          var boutCount= 0
          var numRelabeled=0


          _.forEach(dict,function(p){
            if(p.label==text){
             //tempdict[boutCount]=p
             tempBouts[boutCount] = p.partBoutNum
             boutCount= boutCount+1}})
            //console.log(tempBouts)

            tempMaxBout= Math.max.apply(Math, tempBouts) 
            //console.log(tempMaxBout)


            partBoutNum = tempMaxBout+1
            if (partBoutNum<0){
              partBoutNum=0
            }
            instCountArr[loc]=partBoutNum+1
            listgen();
            $("#List").menu("refresh");
            $("#InstCount").menu("refresh")

            //console.log(partBoutNum)
            console.log("array of highlit strokes on menu click",selectedArray)

            _.forEach(selectedArray,function(p){ 
              var toRemove = false
              var removeLoc
              p.highlit=false;
              p.sendToBack();
              for(var i =0; i<dict.length;i++){
                if(p.strokeNum==dict[i].cumulativeSplineNum){
                  toRemove=true
                  removeLoc=i
                }

              }
              if(toRemove==false){

            //Setting stroke color to the color of the menu item
            p.strokeColor= ui.item.css("background-color");
            p.alreadyClicked=true;
            
            svgstring = p.exportSVG({asString: true});
            var start = svgstring.indexOf('d="')+3;
            numLitStrokes=0;
            



            dict.push({"svgString": svgstring.substring(start, svgstring.indexOf('"',start)),
              "label": text, "strokeColor": p.strokeColor, "timeClicked" : timeClicked, "timeLabeled": Date.now(), "cumulativeSplineNum" : p.strokeNum, "strokeNum":p.masterStrokeNum, 
              "withinStrokeSplineNum": p.withinStrokeSplineNum, "boutNum":bout, "partBoutNum":partBoutNum});
            



            //console.log(dict);
            p.strokeWidth=5;
          }else if(toRemove==true){
            dict.splice(removeLoc,1)
            p.strokeColor= ui.item.css("background-color");
            p.alreadyClicked=true;
            svgstring = p.exportSVG({asString: true});
            var start = svgstring.indexOf('d="')+3;
            numLitStrokes=0; 
            dict.push({"svgString": svgstring.substring(start, svgstring.indexOf('"',start)),
              "label": text, "strokeColor": p.strokeColor, "timeClicked" : timeClicked, "timeLabeled": Date.now(), "cumulativeSplineNum" : p.strokeNum, "strokeNum":p.masterStrokeNum, 
              "withinStrokeSplineNum": p.withinStrokeSplineNum, "boutNum":bout, "partBoutNum":partBoutNum});
            p.strokeWidth=5;
            numRelabeled++
             //selectedArray.splice(selectedArray.indexOf(p),1)

           }

         }); 

            bout=bout+1
            console.log(dict)
            




            c=c+selectedArray.length - numRelabeled;
          //Progress marker updates and checking for whether confetti should fall
          if(c==pathArray.length){
            if(trial.training==false){
             totalBonus = totalBonus+0.02;
           }
           for (var i = 0; i < confettiCount; i++) {
            create(i);
          }}
          $(".progress-bar").css("width", (c/pathArray.length)*100 + '%');
          $(".progress-bar").attr('aria-valuenow', (c/pathArray.length)*100);
          $('.progress-bar').html(c+" out of " +pathArray.length +' labeled');

          if(trial.training==false){
            Bonus=Math.round(c*0.002*1000)/1000;
            $('#bonusMeter').html("Bonus: $ "+(Bonus+totalBonus).toFixed(3));
          }

          for( var i = 0; i<pathArray.length; i++){
            if(pathArray[i].alreadyClicked == false){
              pathArray[i].strokeWidth = Math.max(5,(c/(pathArray.length))*13);
            }
          }

          selectedArray=[];
        }
        else if(text == 'Other'){

          //Calling free entry box
          otherColor = ui.item.css("background-color");
          $("#dialog-form").dialog("open");
        } else if(text =="I can't tell"){
          var loc=partList.length

          var tempBouts = []
          var tempMaxBout = 0
          var boutCount= 0
          var numRelabeled=0


          _.forEach(dict,function(p){
            if(p.label=="unknown"){
             //tempdict[boutCount]=p
             tempBouts[boutCount] = p.partBoutNum
             boutCount= boutCount+1}})
            //console.log(tempBouts)

            tempMaxBout= Math.max.apply(Math, tempBouts) 
            //console.log(tempMaxBout)


            partBoutNum = tempMaxBout+1
            if (partBoutNum<0){
              partBoutNum=0
            }
            instCountArr[loc]=partBoutNum+1
            listgen();
            $("#List").menu("refresh");
            $("#InstCount").menu("refresh")





            _.forEach(selectedArray,function(p){ 
              p.highlit=false;
              p.sendToBack();
              var toRemove = false
              var removeLoc

              for(var i =0; i<dict.length;i++){
                if(p.strokeNum==dict[i].cumulativeSplineNum){
                  toRemove=true
                  removeLoc=i
                }
              }

              if(toRemove==false){


            //Setting stroke color to the color of the menu item
            p.strokeColor= ui.item.css("background-color");
            p.alreadyClicked=true;
            svgstring = p.exportSVG({asString: true});
            var start = svgstring.indexOf('d="')+3;
            numLitStrokes=0;
            dict.push({"svgString": svgstring.substring(start, svgstring.indexOf('"',start)),
              "label": "unknown", 
              "strokeColor": p.strokeColor,
              "timeClicked" : timeClicked, 
              "timeLabeled": Date.now(), 
              "cumulativeSplineNum" : p.strokeNum, 
              "strokeNum":p.masterStrokeNum, 
              "withinStrokeSplineNum": p.withinStrokeSplineNum,
              "boutNum":bout,
              "partBoutNum":partBoutNum
            });
            console.log(dict);
            p.strokeWidth=5;
          }else if(toRemove==true){
            dict.splice(removeLoc,1)
            p.strokeColor= ui.item.css("background-color");
            p.alreadyClicked=true;
            svgstring = p.exportSVG({asString: true});
            var start = svgstring.indexOf('d="')+3;
            numLitStrokes=0; 
            dict.push({"svgString": svgstring.substring(start, svgstring.indexOf('"',start)),
              "label": "unknown", "strokeColor": p.strokeColor, "timeClicked" : timeClicked, "timeLabeled": Date.now(), "cumulativeSplineNum" : p.strokeNum, "strokeNum":p.masterStrokeNum, 
              "withinStrokeSplineNum": p.withinStrokeSplineNum, "boutNum":bout, "partBoutNum":partBoutNum});
            p.strokeWidth=5;
            numRelabeled++
             //selectedArray.splice(selectedArray.indexOf(p),1)

           }

         });  
            bout=bout+1      

            c=c+selectedArray.length- numRelabeled;
            if(c==pathArray.length){
             if(trial.training==false){
               totalBonus = totalBonus+0.02;
             }
             for (var i = 0; i < confettiCount; i++) {
              create(i);
            }}
          //Progress marker updates and checking for whether confetti should fall
          $(".progress-bar").css("width", (c/pathArray.length)*100 + '%');
          $(".progress-bar").attr('aria-valuenow', (c/pathArray.length)*100);
          $('.progress-bar').html(c+" out of " +pathArray.length +' labeled');

          if(trial.training==false){
            Bonus=Math.round(c*0.002*1000)/1000;
            $('#bonusMeter').html("Bonus: $ "+(Bonus+totalBonus).toFixed(3));
          }

          for( var i = 0; i<pathArray.length; i++){
            if(pathArray[i].alreadyClicked == false){
              pathArray[i].strokeWidth = Math.max(5,(c/(pathArray.length))*13);
            }
          }
          

          selectedArray=[];

        }
          //Closing menu after selection
          $("#List").menu("disable");


        }
      });


  //dialog form for checking if the participant really wants to progress when all strokes not labeled

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
            "label": NaN, "strokeColor": p.strokeColor, "timeClicked" : NaN, "timeLabeled": Date.now(), "cumulativeSplineNum" : p.strokeNum, "strokeNum":p.masterStrokeNum, "withinStrokeSplineNum": p.withinStrokeSplineNum,
            "boutNum": NaN, "partBoutNum":NaN});
          console.log(dict);
        }
      })
      var tempObj={};
      tempObj[category] = dict;
      tempObj["png"] = dataURL;
      results.push(tempObj);
      results = JSON.stringify(results)
      //resetting canvas and menu elements
      project.activeLayer.removeChildren();
      paper.view.draw();
      $("#List").menu("destroy");
      $("#InstCount").menu("destroy")
      $("#dialog-form").dialog("destroy");
      $("#confirmContinue").dialog("destroy");
      end_trial(results);


    }
  }
})

  //Free response dialog box 

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
        _.forEach(selectedArray, function(p){
          if(p.alreadyClicked==false){
            p.strokeColor = 'rgb(0,0,0)';
            p.highlit=false
          }else if(p.alreadyClicked==true){
            for(var i=0; i<dict.length;i++){
              if(p.strokeNum==dict[i].cumulativeSplineNum){
                console.log(p.strokeNum, dict[i].cumulativeSplineNum)
                p.strokeColor=dict[i].strokeColor
                p.highlit=false
              }
            }

          }
        })
        //unclickable = false;
        $("#dialog-form").dialog("close");
        //$("#List").menu("enable");
        numLitStrokes=0; 
        selectedArray=[]
      } ,

      Submit: function(ui){
        numOthers++
        var loc = partList.length+1


        var tempBouts = []
        var tempMaxBout = 0
        var boutCount= 0
        var numRelabeled=0



        console.log("array of highlit strokes on menu click",selectedArray)
        var UI = $("#partName").val();
        if(UI==""){
         UI="unknown"
       }

       _.forEach(dict,function(p){
        if(p.label==UI){
             //tempdict[boutCount]=p
             tempBouts[boutCount] = p.partBoutNum
             boutCount= boutCount+1}})
            //console.log(tempBouts)

            tempMaxBout= Math.max.apply(Math, tempBouts) 
            //console.log(tempMaxBout)


            partBoutNum = tempMaxBout+1
            if (partBoutNum<0){
              partBoutNum=0
            }
            //console.log(partBoutNum)
            instCountArr[loc]= numOthers
            listgen();
            $("#List").menu("refresh");
            $("#InstCount").menu("refresh")


            _.forEach(selectedArray,function(p){ 
              var toRemove = false
              var removeLoc
              p.highlit=false;
              p.sendToBack();
              for(var i =0; i<dict.length;i++){
                if(p.strokeNum==dict[i].cumulativeSplineNum){
                  toRemove=true
                  removeLoc=i
                }

              }
              if(toRemove==false){

            //Setting stroke color to the color of the menu item
            console.log(ui)
            p.strokeColor= otherColor;
            p.alreadyClicked=true;
            
            svgstring = p.exportSVG({asString: true});
            var start = svgstring.indexOf('d="')+3;
            numLitStrokes=0;
            



            dict.push({"svgString": svgstring.substring(start, svgstring.indexOf('"',start)),
              "label": UI, "strokeColor": p.strokeColor, "timeClicked" : timeClicked, "timeLabeled": Date.now(), "cumulativeSplineNum" : p.strokeNum, "strokeNum":p.masterStrokeNum, 
              "withinStrokeSplineNum": p.withinStrokeSplineNum, "boutNum":bout, "partBoutNum":partBoutNum});
            



            //console.log(dict);
            p.strokeWidth=5;
          }else if(toRemove==true){
            dict.splice(removeLoc,1)
            p.strokeColor= otherColor;
            p.alreadyClicked=true;
            svgstring = p.exportSVG({asString: true});
            var start = svgstring.indexOf('d="')+3;
            numLitStrokes=0; 
            dict.push({"svgString": svgstring.substring(start, svgstring.indexOf('"',start)),
              "label": UI, "strokeColor": p.strokeColor, "timeClicked" : timeClicked, "timeLabeled": Date.now(), "cumulativeSplineNum" : p.strokeNum, "strokeNum":p.masterStrokeNum, 
              "withinStrokeSplineNum": p.withinStrokeSplineNum, "boutNum":bout, "partBoutNum":partBoutNum});
            p.strokeWidth=5;
            numRelabeled++
             //selectedArray.splice(selectedArray.indexOf(p),1)

           }

         }); 

            bout=bout+1
            console.log(dict)
            

            c=c+selectedArray.length - numRelabeled;
          //Progress marker updates and checking for whether confetti should fall
          if(c==pathArray.length){
            if(trial.training==false){
             totalBonus = totalBonus+0.02;
           }
           for (var i = 0; i < confettiCount; i++) {
            create(i);
          }}
          $(".progress-bar").css("width", (c/pathArray.length)*100 + '%');
          $(".progress-bar").attr('aria-valuenow', (c/pathArray.length)*100);
          $('.progress-bar').html(c+" out of " +pathArray.length +' labeled');

          if(trial.training==false){
            Bonus=Math.round(c*0.002*1000)/1000;
            $('#bonusMeter').html("Bonus: $ "+(Bonus+totalBonus).toFixed(3));
          }

          for( var i = 0; i<pathArray.length; i++){
            if(pathArray[i].alreadyClicked == false){
              pathArray[i].strokeWidth = Math.max(5,(c/(pathArray.length))*13);
            }
          }

          selectedArray=[];























        /*

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
            "label": UI, "strokeColor": p.strokeColor, "timeClicked" : timeClicked, "timeLabeled": Date.now(), "cumulativeSplineNum" : p.strokeNum, "strokeNum":p.masterStrokeNum, "withinStrokeSplineNum": p.withinStrokeSplineNum});
          console.log(dict); 
        });        
        c=c+selectedArray.length;
        if(c==pathArray.length){
         if(trial.training==false){
           totalBonus = totalBonus+0.02;
         }
         for (var i = 0; i < confettiCount; i++) {
          create(i);}}
        //progress bar update
        $(".progress-bar").css("width", (c/pathArray.length)*100 + '%');
        $(".progress-bar").attr('aria-valuenow', (c/pathArray.length)*100);
        $('.progress-bar').html(c+" out of "+pathArray.length +' labeled');


        if(trial.training==false){
          Bonus=Math.round(c*0.002*1000)/1000;
          $('#bonusMeter').html("Bonus: $ "+(Bonus+totalBonus).toFixed(3));
        }
        selectedArray=[]; */

        $(this).dialog("close");
      }
    }
  });
$("#colorCheck").dialog({
  autoOpen: false,
  height: 400,
  width: 350,
  modal: true,
  open : function(event, ui){
    originalContent = $("#colorCheck").html();
  },
  buttons:{
    "Ok": function(){
      colorChecked=true;
      $(this).dialog("close");
      console.log("colorchecked",colorChecked);
      ;
    },
  }
})

}    
}
return plugin;
})();

