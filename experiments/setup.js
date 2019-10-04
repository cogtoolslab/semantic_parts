var oldCallback;
var c;
var r;
var score = 0;

function sendData() {
  console.log('sending data to mturk');
  jsPsych.turk.submitToTurk({'score':score});
}

function setupExp(){
  var socket = io.connect();

  socket.on('onConnected', function(d) {
    //var numTrials = d.num_trials;
    var numTrials = 10;
    var id = d.id;

    //var renderList = renderList;

    var tmp = {
      type: 'part_annotation',
      iterationName: 'pilot0',
      num_trials: numTrials
    };

    var trials = new Array(tmp.num_trials + 3);
    
    


    var instructionsHTML = {
      'str1' :"<p style = 'font-size:20px;line-height:1.3;'> Welcome! In this HIT you will play a fun game where you will see some sketches and tell us what you see!<p style = 'font-size:20px;line-height:1.3;'>Each sketch was made by somebody who\
      was playing a Pictionary-style game, in which they had to make a sketch of a target object (outlined in red) so that someone else could tell which object in the set \
      they were trying to draw.<p style = 'font-size:20px;line-height:1.3;'><img src = 'instructions1.png' style='border: 2px solid #000000;'></img><p> <br>  </p></p>\
      <p style = 'font-size:20px;line-height:1.3;'>Your goal is to label each of the strokes in these sketches by selecting parts from a menu.</p></p></p>",
      'str2':"<p style = 'font-size:20px;line-height:1.3;'> Let's walk through an example! Please carefully review the diagram below:<p><img src= 'instructions2.jpeg' style= 'height:650px;border: 2px solid #000000;'></img><p> <br>  </p></p></p>",
      'str3':"<p style = 'font-size:30px;line-height:1;'> Here's how you label a sketch! <p style = 'font-size:20px;line-height:1.3;'>(scroll down please)</p><p style = 'font-size:20px;line-height:1.3;'> 1. You can click on a stroke \
      OR paint over it by dragging your cursor over several strokes.\
      Once it is selected, it will turn light-gray.<p style = 'font-size:20px;line-height:1.3;'><img src = 'instructions3.jpeg' style='height:450px; width:1150px; border: 2px solid #000000; '></img></p><p style= 'line-height:1.3;'>\
      <img src = 'instructions4.jpeg' style='height:450px; width:1150px;border: 2px solid #000000;'></img><p> <br>  </p></p><p style = 'font-size:20px;line-height:1.3;'> 2. Your goal is to provide a label for every distinct part of each sketch.\
      So you should be sure to select every stroke that represents a specific part -- no more and no fewer-- before clicking on a menu item to label it.</p>\
      <p style = 'font-size:20px;line-height:1.3;'>For example, if a sketch of a chair has four legs, please label each leg separately. To do this, first select only the strokes corresponding to one leg, then click on the word 'leg' in the menu.\
      Then repeat this procedure for the remaining legs of the chair. <p style='line-height:1.3;'><img src ='instructions5.jpeg' style='height:450px; width:1150px;border: 2px solid #000000;'></img><p> <br>  </p></p> \
      <p style = 'font-size:20px;line-height:1.3;'> <p style = 'font-size:20px;line-height:1.3;'>3. Don't worry if you highlight too many strokes by accident!\
      You can click on a highlighted stroke again to unhighlight it.<p style='line-height:1.3;'><img src ='instructions6.jpeg' style='height:450px; width:1150px;border: 2px solid #000000;'></img><p> <br>  </p> </p> \
      <p style = 'font-size:20px;line-height:1.3;'>4. Important! Before clicking on a menu item, please make sure you have selected all the strokes you intended to -- no more and no fewer. \
      You can keep track of how many distinct parts of the same kind you have already labeled by looking at the numbers in the righthand column. <p style='line-height:1.3;'><img src ='instructions7.jpeg' style='height:450px;border: 2px solid #000000;'></img><p></p> <br> </p><p style = 'font-size:20px;line-height:1.3;'>5. If the label you think is most appropriate for the stroke is not already \
      in the menu, please click 'Other' to provide your own label. If you cannot identify a stroke, select it and click on 'I can't tell' in the menu.<p style='line-height:1.3;'><img src ='instructions8.jpeg' style='height:450px; width:1150px;border: 2px solid #000000;'></img><p> <br>  </p></p> <p style = 'font-size:20px;line-height:1.3;'>6. Repeat steps 1–5 until you have labeled all the strokes in the sketch.</p>\
      <p style = 'font-size:20px;line-height:1.3;'><b>Note:</b> Many sketches <b><i>may not</i></b> contain most or all the parts listed in the menu. So do not feel obligated to use a label if it does not apply to the sketch.</p><p style = 'font-size:20px;line-height:1.3;'>To make your life easier, as you label more strokes in each sketch, the remaining ones will get thicker so it is easier to see them.</p> <p style='line-height:1.3;'><img src ='instructions9.jpeg' style='height:450px;border: 2px solid #000000;'></img></p></p>",
      
      'str4': "<p style = 'font-size:30px;line-height:1.3;'> Okay, let's try it out! </p><p style = 'font-size:20px;line-height:1.3;'> On the next screen you will get to practice labeling the parts of a sketch. Click on 'next sketch' when you're done labeling everything.</p>"}

      var intro = {
        type: 'instructions',
        pages: [

        instructionsHTML.str1,
        instructionsHTML.str2,
        instructionsHTML.str3,
        instructionsHTML.str4
        ],
        show_clickable_nav: true,
        allow_backward: true,
        allow_keys:false

      };


      var comprehensionTrial = {
        type : 'part_annotation',
        num_trials: 1,
        on_finish: function(data){


        }
      }


      trials[1] = comprehensionTrial;
      trials[1].training = true;
      trials[1].svg = data.svg;
      trials[1].parts = data.parts;
      trials[1].category = data.category;
      trials[1].renders = data.renders;
      //trials[1].targetPos = 0;
      trials[1].gameID = "7004-6ff0964c-ff95-40f9-8696-d6a8931c94d5";
      trials[1].condition= "further";
      trials[1].numStrokes = 5;
      trials[1].outcome = true;
      trials[1].orginalTrialNum = 17;
      trials[1].response= "straight";


      trials[2] ={
        type: 'instructions',
        pages:[
        '<p style = "font-size:20px;line-height:1.3;">Good job! You should now have a grasp on what this game feels like to play.</p>',
        '<p style = "font-size:20px;line-height:1.3;">You will receive both a bonus for every stroke you label AND a special "completion bonus" for labeling all the strokes in a sketch.</p>',
        '<p style = "font-size:20px;line-height:1.3;">For each sketch, you are allowed to continue to the next sketch if you have not finished labeling every stroke, but then you will miss out on the completion bonus. So please do your best to label every stroke you see!</p>',
        '<p style = "font-size:20px;line-height:1.3;">We expect the average amount of time required to complete the HIT to be around 10 minutes, including the time it takes to read the instructions. <p style = "font-size:20px;line-height:1.3;">By completing this HIT, you are participating in a study being conducted by cognitive scientists in the Stanford Department of Psychology. If you have questions about this research, or if you encounter a problem or error, please contact the <b>Sketchloop Admin</b> at <b><a href="mailto://sketchloop@gmail.com">sketchloop@gmail.com</a> </b> or Noah Goodman (n goodman at stanford dot edu) and we will make sure you are compensated for your time!</p> <p style = "font-size:20px;line-height:1.3;">You must be at least 18 years old to participate. Your participation in this research is voluntary. You may decline to answer any or all of the following questions. You may decline further participation, at any time, without adverse consequences. Your anonymity is assured; the researchers who have requested your participation will not receive any personal information about you.</p></p>',
        '<p style = "font-size:20px;line-height:1.3;">Please pay attention and do your best! Thank you!</p>'],
        show_clickable_nav: true,
        allow_keys:false
      }

      var goodbye = {
        type: 'instructions',
        pages: [
        'Congrats! You are all done. Thanks for participating in our experiment! Please click the "next" button to submit this HIT.'
        ],
        show_clickable_nav: true,
        on_finish: function() { sendData();}
      };

      trials[0] = intro;

      trials[tmp.num_trials +3] = goodbye;

      var main_on_finish = function(data)  {
        if (data.bonus) {
          score = data.bonus;
        }
        socket.emit('currentData', data);
      };

      var main_on_start = function(trial) {

       // console.log("main on start being called");

       oldCallback = newCallback;
       var newCallback = function(stim) {

        trial.training = false;
        trial.svg = stim.svg;
        trial.parts = stim.parts;
        trial.category = stim.category;
        trial.target = stim.target;
        //trial.renders = stim.renders;
        trial.Distractor1 = stim.Distractor1;
        trial.Distractor2 = stim.Distractor2;
        trial.Distractor3 = stim.Distractor3;
        trial.renders=[];
        trial.numTrials = 

        trial.gameID = stim.gameID;
        trial.condition = stim.condition;
        trial.numStrokes = stim.numStrokes;
        trial.outcome = stim.outcome;
        trial.originalTrialNum = stim.trialNum;
        trial.response = stim.response;
       r=0
       c=1
       _.forEach(renderList, function(f){
        if(f.subordinate==trial.target){
          trial.renders[0]=f.url;

        }else if(f.subordinate==trial.Distractor1||f.subordinate==trial.Distractor2||f.subordinate==trial.Distractor3){
         trial.renders[c]=f.url
         c++;
       }
     });


       jsPsych.resumeExperiment();
     };
     socket.removeListener('stimulus', oldCallback);
     socket.on('stimulus', newCallback);

     socket.emit('getStim', {gameID: id});
   };

   for(var i = 0; i< tmp.num_trials; i++){
    var k = i+3;
    trials[k] = {
     type: tmp.type,
     trialNum: i,    	
     num_trials: tmp.num_trials,
     on_finish: main_on_finish,
     on_start: main_on_start
   };
 }


    // start game
    jsPsych.init({
      timeline: trials,
      default_iti: 5000,
      show_progress_bar: true
    });
  });
};
