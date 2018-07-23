
jsPsych.plugins['part_annotation'] = (function(){

  var plugin = {};
  //intializing drag state checker and array of selected array
  var dragStat=false;
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
   var sketch=[];
   var pathArray;
   var c=0;
   var timeClicked;
   var clickable=true;
   var otherColor;
   var colNo = 0;
   var numLitStrokes=0; 
   var splineArray;   
   var timeLabeled;
    //Setting colors for the menu items ROYGBIV from left to right
    var colors = ["#ff6666","#ffaa80","#ffb3ba","#ffdfba", "#ffffba", "#baffc9", "#bae1ff", "#bf80ff", "#f9bcff"];

    var left = [255, 153, 51];
    var right = [0, 204, 153];
    
    


    //Putting function calls and HTML elements of the jsPsych display element within a 1 second timeout

    setTimeout(function() {
      display_element.innerHTML += '<div><canvas id="myCanvas" style="border: 2px solid #000000;"  \
      width= "300px" height= "300px" resize="true" ></canvas> \
      <ul id="List"></ul><div id="dialog-form" title="Enter Part Label">\
      <form><fieldset><label for="partName">Part Name</label>\
      <input type="text" name="partName" id="partName" placeholder="Type your part label here" class="text ui-widget-content ui-corner-all"> \
      <div id ="confirmContinue" title= "Move on to next sketch?">Clicking continue will load the next sketch for annotation. Please make sure you have labeled all the parts that you can. \
      Click back to continue labeling the sketch.</div>\
      <!-- Allow form submission with keyboard without duplicating the dialog button --><input type="submit" tabindex="-1" style="position:absolute; top:-1000px"></fieldset>\
      </form></div> <div class="progress"><div id= "progressbar" class="progress-bar" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div></div>\
      <button id = "nextButton" type="button">Next Sketch</button> \
      </div>'; 
      display_element.innerHTML += "<p id='Title' style='color:red;'>"+ trial.category+"</p>";
      paper.setup('myCanvas');
      listgen();
      menugen();
      display();
    }, 1000);
    














    
//Ending trial and creating trial data to be sent to db. Also resetting HTML elements
var end_trial = function(results) {
 selectedArray=[];
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



    function color_interpolate (left, right, colNo) {
      var partList = trial.parts.toString().split(',');
      var components = [];
      for (var i = 0; i < 3; i++) {
        console.log(partList.length);
        components[i] = Math.round(left[i] + (right[i] - left[i]) * colNo/(partList.length+1));
      }
      return('"'+"rgb"+"("+components[0]+","+components[1]+","+components[2]+")"+'"');
    }



//function for setting the color of the menu items
function setColor(li) {
  li.css("background-color", color_interpolate(left, right, colNo));
  colNo++;
}

    //Main Display function for Canvas events
    function display(){  

      $("#nextButton").click(function(){
        $('#confirmContinue').dialog("open")}
        );



    //Displaying the sketch and setting stroke properties
    var svg = trial.svg;
    splineArray = Snap.path.toAbsolute(svg);
    var copy = Snap.path.toAbsolute(svg);
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
   var numSplines = 0
   _.forEach(tempSketch, function(f){
    sketch[numSplines]=f.toString();
    numSplines++
  })

   console.log(sketch);

   pathArray = new Array;
   for (var i = 0; i< sketch.length; i++) {
    pathArray[i] = new Path(sketch[i]);
    pathArray[i].strokeColor = "rgb(150,150,150)";
    pathArray[i].strokeWidth = 5;
      //already clicked tracks if a stroke has been labeled
      pathArray[i].alreadyClicked = false;
      //highlit tracks whether a stroke is ready to be labeled
      pathArray[i].highlit=false;
      //Appending a stroke number to each stroke
      pathArray[i].strokeNum=i;
      
    };






   //Click and Hover event handlers


   _.forEach(pathArray, function(p) {
    //Single click handlers
    p.onClick = function(event) {
      if(clickable == true){ 
        //Selecting a new stroke that hasn't been labeled
        if(p.alreadyClicked==false && p.highlit==false){
          p.highlit=true;
          selectedArray[numLitStrokes]=p;  
          timeClicked = Math.floor(Date.now() / 1000);
          $('#List').menu("enable");
          selectedArray[numLitStrokes].strokeColor = "rgb(0,0,0)";
          numLitStrokes++;}
        //Reselecint an already labeled stroke  
        else if(p.alreadyClicked==true){
          clickable = false;
          p.strokeColor= '#660000';
          selectedArray[numLitStrokes]=p;
          console.log(dict);
          c--;
          if(dict.length>0){
            $('#List').menu("enable");
            for(var i=0; i<dict.length; i++){
              if(p.strokeNum==dict[i].strokeNum){
            //Changing menu color properties of previous label to distinguish it from others and to match it to current stroke color
            for(var j=0; j<$('#List li').length-1;j++){
              if($('li div')[j].innerHTML==dict[i].label){
                $($('li div')[j]).css("background-color", "#660000");
                $($('li div')[j]).css("color", "#f4d142");
                $($('li div')[j]).css("border-width", 3);
                $($('li div')[j]).css("border-color", "black");
              }}
            }
          }
        } 
      }
        //Deselecting a stroke that was accidentally highlighted
        else if(p.alreadyClicked== false && p.highlit==true){
          numLitStrokes--;
          p.strokeColor='black';
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
        p.strokeColor = "rgb(0,0,0)";});
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
          selectedArray[numLitStrokes].strokeColor = "rgb(50,50,50)";
          numLitStrokes++
        }
        //When entering a stroke while not dragging 
        else if (p.alreadyClicked == false && p.highlit==false && dragStat==false){
          console.log("general enter", dragStat)
          p.strokeColor = "rgb(75,75,75)";
        }
      }
    }});

  _.forEach(pathArray, function(p){
    //Setting stroke color back to black on exit from stroke, if not dragging
    p.onMouseLeave = function(event) {
     if(clickable == true){
      if(p.alreadyClicked == false && p.highlit==false && dragStat==false){
        p.strokeColor = "rgb(150,150,150)"; 
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
      var other = $("<li><div>" + "Other" +"</div></li>" );
      setColor(other);
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
      select : function(event, ui){
        console.log(dict);
        clickable = true;
        //Refreshing the menu on each click;
        listgen();
        $("#List").menu("refresh");
        //Retrieving text element of selected option
        var text = ui.item.text();
        if(text!='Other'){

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









          });        

          c=c+selectedArray.length;
          //Progress bar update
          $(".progress-bar").css("width", (c/pathArray.length)*100 + '%');
          $(".progress-bar").attr('aria-valuenow', (c/pathArray.length)*100);
          $('.progress-bar').html(c+" out of " +pathArray.length +' labeled');

          if(c>(0.7*pathArray.length)){
            for( var i = 0; i<pathArray.length; i++){
              if(pathArray[i].alreadyClicked == false){
                pathArray[i].strokeWidth = 10;
              }
            }
          }

          selectedArray=[];
          if(c==pathArray.length){
           //Getting png "snapshot" of the fully labeled sketch 
           var dataURL = document.getElementById('myCanvas').toDataURL();
           dataURL = dataURL.replace('data:image/png;base64,',''); 
           var category = trial.category;
           var tempObj={};
           tempObj[category] = dict;
           tempObj["png"] = dataURL
           results.push(tempObj);

            //console.log(dict[0].label);
            results = JSON.stringify(results)
            console.log(results);
            //resettting canvas and other menu elements
            project.activeLayer.removeChildren();
            paper.view.draw();
            $("#List").menu("destroy");
            $("#confirmContinue").dialog("destroy");
            $("#dialog-form").dialog("destroy");
            end_trial();
          }
        }
        else if(text == 'Other'){
          //Calling dialog box
          otherColor = ui.item.css("background-color");
          $("#dialog-form").dialog("open");
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
      end_trial();


        }
      }
    })

  $( "#dialog-form" ).dialog({
    autoOpen: false,
    height: 400,
    width: 350,
    modal: true,
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
          p.alreadyClicked=true;
          var UI = $("#partName").val();
          svgstring = p.exportSVG({asString: true});
          var start = svgstring.indexOf('d="')+3;
          numLitStrokes=0;
          dict.push({"svgString": svgstring.substring(start, svgstring.indexOf('"',start)),
            "label": UI, "strokeColor": p.strokeColor, "Time clicked" : timeClicked, "Time labeled": Math.floor(Date.now() / 1000), "strokeNum" : p.strokeNum});

        });        
        c=c+selectedArray.length;
        //progress bar update
        $(".progress-bar").css("width", (c/pathArray.length)*100 + '%');
        $(".progress-bar").attr('aria-valuenow', (c/pathArray.length)*100);
        $('.progress-bar').html(c+" out of "+pathArray.length +' labeled');
        selectedArray=[];
        $(this).dialog("close");
        if(c==pathArray.length){
          //getting png 'snapshot' of fully labeled sketch
          var dataURL = document.getElementById('myCanvas').toDataURL();
          dataURL = dataURL.replace('data:image/png;base64,',''); 
          var category = trial.category;
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
          end_trial();

        }
        ;
      }
    }
  });
}    

}
return plugin;
})();

