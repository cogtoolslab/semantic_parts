
jsPsych.plugins['part_annotation'] = (function(){

  var plugin = {};

  plugin.info = {
    name: 'part_annotation',
    parameters: {
    }
  }
  plugin.trial = function(display_element, trial) {
    //paper.install(window);
    //window.onload = function() {
    display_element.innerHTML += '<div><canvas id="myCanvas" style="border: 2px solid #314DFE;" display = "block" width= "300px" height= "300px" resize="false" ></canvas> <ul id="List"></ul><div id="dialog-form" title="Enter Part Label"><form><fieldset><label for="partName">Part Name</label><input type="text" name="partName" id="partName" placeholder="Type your part label here" class="text ui-widget-content ui-corner-all"><!-- Allow form submission with keyboard without duplicating the dialog button --><input type="submit" tabindex="-1" style="position:absolute; top:-1000px"></fieldset></form></div></div>'; 
    paper.setup('myCanvas');

    setTimeout(function() {
      listgen();
      menugen();
      display();
    }, 1000);
    
    //var sketchNo = 0; 
    var unclickable = false;
    var dict=[];
    var results=[];
    var selectedArray;
    var sketch;
    var pathArray;
    var c=0;
    var timeClicked;
    var timeLabeled;

    var end_trial = function(results) {
      var turkInfo = jsPsych.turk.turkInfo();

      // gather the data to store for the trial
      var trial_data = _.extend({}, trial, {
      	wID: turkInfo.workerId,
      	hitID: turkInfo.hitId,
      	aID : turkInfo.assignmentId,
      	dbname: 'svgAnnotation',
      	colname: 'examples',
        results: results
      });

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
      jsPsych.pauseExperiment();
    };

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function setRandomColor(li) {
  li.css("background-color", getRandomColor());
}

    function display(){
      //displaying the indexed sketch through SVG data
      var sketch = trial.svg;  //CHANGES var sketch = data[sketchNo].svgData;
      sketch = sketch.replace('["', "");
      sketch = sketch.replace('"]',"");
      sketch = sketch.toString().split('", "')
      console.log(sketch);
      pathArray = new Array;
      for (var i = 0; i< sketch.length; i++) {
      	pathArray[i] = new Path(sketch[i]);
      	pathArray[i].strokeColor = 'black';
      	//Increasing stroke width to make it clickable
      	pathArray[i].strokeWidth = 8;
      

  	//Click and Hover event handlers
  	_.forEach(pathArray, function(p) {
  	  p.onClick = function(event) {
  	    if(p.alreadyClicked==false && unclickable == false){
            selectedArray=p;  
            timeClicked = Math.floor(Date.now() / 1000);
            $('#List').menu("enable");
            unclickable = true
            p.strokeColor = 'orange';
            p.alreadyClicked = true;
	      //testObj.SVGstring[c]= p;

	      
	    }
	    // else if(p.alreadyClicked==true && unclickable==false){
	    // $("#reset").dialog("open");}
	  }
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


    //generating the menu 
    function listgen(){
      console.log("I'm working");
      $("#List").empty();
	console.log(trial.parts.toString().split(','));
	var partList = trial.parts.toString().split(',');
      _.forEach(partList, function(p){

      	var li = $("<li><div>" + p +"</div></li>" );
      	//setRandomColor(li);
        li.appendTo("#List");

      });
      var other = $("<li><div>" + "Other" +"</div></li>" );
      //setRandomColor(other);
      other.appendTo("#List");
      console.log(display_element.querySelector('#List'));
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
    	//items: "> :not(.ui-widget-header)",
    	select : function(event, ui){
          var text = ui.item.text();
          if(text!='Other'){
            unclickable = false;
            selectedArray.strokeColor= ui.item.css("background-color");
            selectedArray.alreadyClicked=true;
            svgstring = selectedArray.exportSVG({asString: true});
            var start = svgstring.indexOf('d="')+3;
            dict.push({"svgString": svgstring.substring(start, svgstring.indexOf('"',start)),
		       "label": text, "Time clicked" : timeClicked, "Time labeled": Math.floor(Date.now() / 1000)});
            c++;
            if(c==pathArray.length) {
              var category = trial.category;
              var tempObj={};
              tempObj[category] = dict;
              results.push(tempObj);
              results = JSON.stringify(results)
              console.log(results);
              //sketchNo++;
              //c=0;
              project.activeLayer.removeChildren();
              paper.view.draw();
              $("#List").menu("destroy");
              $("#dialog-form").dialog("destroy");
              end_trial(results);
	            //display();
	          }
      	  }
      	  else if(text == 'Other'){
      	    $("#dialog-form").dialog("open");
      	  }
	       //$("#List").menu("disable");


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
            selectedArray.strokeColor = ui.item.css("background-color");
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
              var category = trial.category;
              var tempObj={};
              tempObj[category] = dict;
              results.push(tempObj);
              results = JSON.stringify(results)
              console.log(results);
              //c=0;
              project.activeLayer.removeChildren();
              paper.view.draw();
              $("#dialog-form").dialog("destroy");
              $("#List").menu("destroy");
              end_trial();

              // if(sketchNo<trial.length){
              //   $("#List").menu("destroy");
              //   trial();} else if(sketchNo==trial.length){
              //   $("#List").menu("destroy");
              //   $("#Complete").dialog("open");
              // }
	    };
	  }
	}
      });
    } 
  }
  return plugin;
})();

