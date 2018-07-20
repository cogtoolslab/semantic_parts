
jsPsych.plugins['part_annotation'] = (function(){

  var plugin = {};
  var dragStat=false;
  var selectedArray=[];
  plugin.info = {
    name: 'part_annotation',
    parameters: {
    }
  }
  plugin.trial = function(display_element, trial) {
   var tool = new Tool();

    //paper.install(window);
    //window.onload = function() {

      var dict=[];
      var results=[];
      var sketch;
      var pathArray;
      var c=0;
      var timeClicked;
      var clickable=true;
      var otherColor;
      var colNo = 0;
      var numLitStrokes=0;    
      var timeLabeled;
      var colors = ["#ff6666","#ffaa80","#ffb3ba","#ffdfba", "#ffffba", "#baffc9", "#bae1ff", "#bf80ff", "#f9bcff"];


      setTimeout(function() {
        display_element.innerHTML += '<div><canvas id="myCanvas" style="border: 2px solid #000000;" display = "block" \
        width= "300px" height= "300px" resize="false" ></canvas> \
        <ul id="List"></ul><div id="dialog-form" title="Enter Part Label">\
        <form><fieldset><label for="partName">Part Name</label>\
        <input type="text" name="partName" id="partName" placeholder="Type your part label here" class="text ui-widget-content ui-corner-all"> \
        <!-- Allow form submission with keyboard without duplicating the dialog button --><input type="submit" tabindex="-1" style="position:absolute; top:-1000px"></fieldset>\
        </form></div> <div class="progress"><div id= "progressbar" class="progress-bar" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div></div>\
        </div>'; 
        paper.setup('myCanvas');
        listgen();
        menugen();
        display();
      }, 1000);

    //var sketchNo = 0; 


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

    function setRandomColor(li) {
      li.css("background-color", colors[colNo]);
      colNo++;
    }
    function display(){  
    //displaying the indexed sketch through SVG data
    var sketch = trial.svg;
    pathArray = new Array;
    for (var i = 0; i< sketch.length; i++) {
      pathArray[i] = new Path(sketch[i]);
      pathArray[i].strokeColor = 'black';
    //Increasing stroke width to make it clickable
    pathArray[i].strokeWidth = 7;
    pathArray[i].alreadyClicked = false;
    pathArray[i].highlit=false;
    pathArray[i].strokeNum=i;

  };

  

  


   //Click and Hover event handlers

   //highlight remover

   _

   _.forEach(pathArray, function(p) {

    p.onClick = function(event) {
      if(clickable == true){ 
        if(p.alreadyClicked==false && p.highlit==false){
          p.highlit=true;
          selectedArray[numLitStrokes]=p;  
          timeClicked = Math.floor(Date.now() / 1000);
          $('#List').menu("enable");
        //unclickable = true
        selectedArray[numLitStrokes].strokeColor = 'orange';
        numLitStrokes++;
     // p.alreadyClicked = true;
     //testObj.SVGstring[c]= p;
     console.log(selectedArray);


   }
   else if(p.alreadyClicked==true){
    clickable = false;
    p.strokeColor= 'orange';
    selectedArray[numLitStrokes]=p;
    console.log(dict);
    //p.alreadyClicked= false;
    c--;
    if(dict.length>0){
      $('#List').menu("enable");
      for(var i=0; i<dict.length; i++){
          //console.log( "this is lit stroke num", p.strokeNum)
          if(p.strokeNum==dict[i].strokeNum){
           for(var j=0; j<$('#List li').length-1;j++){
            if($('li div')[j].innerHTML==dict[i].label){
              $($('li div')[j]).css("background-color", "#660000");
              $($('li div')[j]).css("color", "#f4d142");
              $($('li div')[j]).css("border-width", 3);
              $($('li div')[j]).css("border-color", "black");
              $($('li div')[j]).css("text-shadow", "2px 2px 2px");

              
            }}
            console.log(dict);
            dict.splice(i,1);
            console.log(dict);

            if(dict.length==0){
             // $('#List').menu("disable");
             console.log($('#List li').length);
           }
           break;
                //console.log(dict);
              }
            }
          } 
        }
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
       /* else if(p.alreadyClicked== false && p.highlit==false){
         p.highlit == true; 
        selectedArray[numLitStrokes]=p;  
        timeClicked = Math.floor(Date.now() / 1000);
        $('#List').menu("enable");
        //unclickable = true
        selectedArray[numLitStrokes].strokeColor = 'orange';
        numLitStrokes++;

      } */

    }}
   //else if(p.alreadyClicked==true && unclickable==false){
   // $("#reset").dialog("open");

   //   }

 });


   tool.onMouseDrag= function(event){
     if(clickable == true){
       dragStat=true;
       console.log("MD", dragStat);

     }  }
     tool.onMouseUp = function(event){
       console.log("clickable:",clickable,"drag stat:", dragStat, "selectedArray:", selectedArray)
       if(clickable == true){
        if(dragStat==true && selectedArray.length!=0){
          console.log("Mouse is up+ selectedArray", selectedArray);
          timeClicked = Math.floor(Date.now() / 1000);
          $('#List').menu("enable");
        //unclickable = true;
        //numLitStrokes=0;
        _.forEach(selectedArray, function(p){
          p.highlit = true;
          p.strokeColor = 'orange';});

      }
      dragStat=false;

     // console.log(sele);

   } }

   _.forEach(pathArray, function(p) {
    p.onMouseEnter = function(event) {
     if(clickable == true){
        //console.log(p.alreadyClicked, p.highlit, dragStat);
        if(p.alreadyClicked == false && p.highlit==false && dragStat==true){

          p.highlit=true;
          selectedArray[numLitStrokes]=p;
          selectedArray[numLitStrokes].strokeColor = 'yellow';
          numLitStrokes++
        } else if (p.alreadyClicked == false && p.highlit==false && dragStat==false){
          console.log("general enter", dragStat)
          p.strokeColor = 'yellow';
        }
      }
    }});

   _.forEach(pathArray, function(p){

    p.onMouseLeave = function(event) {
     if(clickable == true){
      if(p.alreadyClicked == false && p.highlit==false && dragStat==false){
        p.strokeColor = 'black'; 
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
        setRandomColor(li);
        li.appendTo("#List");

      });
      var other = $("<li><div>" + "Other" +"</div></li>" );
      setRandomColor(other);
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
        console.log(dict);
        clickable = true;
        listgen();
        $("#List").menu("refresh");
        var text = ui.item.text();
        if(text!='Other'){

          _.forEach(selectedArray,function(p){ 
            p.highlit=false;
            p.strokeColor= ui.item.css("background-color");
            p.alreadyClicked=true;
            svgstring = p.exportSVG({asString: true});
            var start = svgstring.indexOf('d="')+3;
            numLitStrokes=0;
            dict.push({"svgString": svgstring.substring(start, svgstring.indexOf('"',start)),
              "label": text, "Time clicked" : timeClicked, "Time labeled": Math.floor(Date.now() / 1000), "strokeNum" : p.strokeNum});

          });        
          c=c+selectedArray.length;
          $(".progress-bar").css("width", (c/pathArray.length)*100 + '%');
          $(".progress-bar").attr('aria-valuenow', (c/pathArray.length)*100);
           $('.progress-bar').html(Math.round((c/pathArray.length)*100) +'% complete');
          selectedArray=[];
          if(c==pathArray.length){
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

            project.activeLayer.removeChildren();
            paper.view.draw();
            $("#List").menu("destroy");
            $("#Complete").dialog("open");
            $("#dialog-form").dialog("destroy");
            end_trial();
          }
        }
        else if(text == 'Other'){
          otherColor = ui.item.css("background-color");
            //p.strokeColor = ui.item.css("background-color");
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
            "label": UI, "Time clicked" : timeClicked, "Time labeled": Math.floor(Date.now() / 1000), "strokeNum" : p.strokeNum});

        });        
        c=c+selectedArray.length;
        $(".progress-bar").css("width", (c/pathArray.length)*100 + '%');
        $(".progress-bar").attr('aria-valuenow', (c/pathArray.length)*100);
        $('.progress-bar').html(Math.round((c/pathArray.length)*100) +'% complete');
        selectedArray=[];
        $(this).dialog("close");
        console.log(c);
        if(c==pathArray.length){
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
          project.activeLayer.removeChildren();
          paper.view.draw();
          $("#List").menu("destroy");
          $("#dialog-form").dialog("destroy");
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

