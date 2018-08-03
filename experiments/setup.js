var oldCallback;
var c;
var r;

function sendData() {
  console.log('sending data to mturk');
  jsPsych.turk.submitToTurk({});
}

function setupExp(){
  var socket = io.connect();

  socket.on('onConnected', function(d) {
    //var numTrials = d.num_trials;
    var numTrials = 10;
    var id = d.id;
    console.log(d);

    //var renderList = renderList;
    console.log("RENDERLIST", renderList);

    var tmp = {
      type: 'part_annotation',
      iterationName: 'pilot0',
      num_trials: numTrials
    };

    var trials = new Array(tmp.num_trials + 3);
    
    
    var instructionsHTML = {
      'str1' :"<p> In this HIT you will play a fun game where you will see some sketches and tell us what you see!<p>Each sketch was made by somebody who was playing a Pictionary-style game, in which they had to make a sketch of a target object (outlined in red) so that someone else could tell which object in the lineup they were trying to draw.<p><img src = 'instructions1.png' style='border: 2px solid #000000;'></img></p>\
      <br>Your goal is to label each of the strokes in these sketches by selecting parts from a menu.</p></p>",
      'str2':"<p> Let's walk through an example! See the diagram below:<p><img src= 'instructions2.png' style= 'height:650px;border: 2px solid #000000;'></img></p></p>",


      'str3':"<p> Here's how you label a sketch! <p> 1. You can click on a stroke OR paint over it by dragging your cursor over several strokes.\
      Once it is selected, it will turn light-gray.<p><img src = 'instructions3.png' style='height:350px; width:1050px; border: 2px solid #000000; '></img></p><p><img src = 'instructions4.png' style='height:350px; width:1050px;border: 2px solid #000000;'></img></p><p> 2. You then click on one of the labels in the righthand menu to label it. Once it is labeled,\
      it will turn into the same color as the word in the menu.<p><img src ='instructions5.png' style='height:350px; width:1050px;border: 2px solid #000000;'></img></p><p> 3. If the label you think is most appropriate for the stroke is not already \
      in the menu, please click 'Other' to provide your own label. If you cannot identify a stroke, select it and click on 'I can't tell' in the menu.<p><img src ='instructions6.png' style='height:350px; width:1050px;border: 2px solid #000000;'></img></p><p> 4. If you change your mind about a stroke you already labeled, just click\
      that stroke again, and select a new label from the menu.<p><img src ='instructions7.png' style='height:350px; width:1050px;border: 2px solid #000000;'></img></p> </p> <p> 5. Repeat steps 1–4 until you have labeled all the strokes in the sketch.</p>\
      <p>Note: To make your life easier, as you label more strokes in each sketch, the remaining ones will get thicker so it is easier to see them.</p> <p><img src ='instructions8.png' style='height:350px;border: 2px solid #000000;'></img></p></p>",
      
      'str4': "<p> Okay, let's practice! Make sure to familiarize yourself with the task.</p><p>Click on 'next sketch' when you're done labeling.</p>"}

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
        allow_keys:true

      };
      console.log(data.parts);


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
      trials[1].targetPos = 0;

      trials[2] ={
        type: 'instructions',
        pages:[
        'Good job! You should now have a grasp on what the trials will look like.',
        '<p>You will receive a "stroke bonus" for every stroke you label AND a special "completion bonus" for every sketch that you finish labeling.</p>\
        <p>For each sketch, you are allowed to continue to the next sketch if you have not finished labeling every stroke, but then you will miss out on the completion bonus. So please do your best to label every stroke you see!</p>\
        <p>We expect the average amount of time required to complete the HIT to be around 10 minutes, including the time it takes to read the instructions.\
        If you encounter a problem or error, send us an email (sketchloop@gmail.com) and we will make sure you are compensated for your time!</p><p> Please pay attention and do your best! Thank you!</p>'],
        show_clickable_nav: true
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
        socket.emit('currentData', data);
      };

      var main_on_start = function(trial) {

        console.log("main on start being called");

        oldCallback = newCallback;
        var newCallback = function(stim) {
          console.log('received stim')
          console.log(stim)
        //      	_.extend(trials[1], stim);
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
        /*r=0
        for(var i=0;i<renderList.length;i++){
          if(renderList[i].subordinate==trial.distractors[c]){
          trial.renders[r]= renderList[i].url;
          c++;
          r++;
         }
          else if(renderList[i].subordinate==trial.category){   
           trial.renders[r]= renderList[i].url;
           r++;
         }
       }*/
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


 trials[(tmp.num_trials/2)+3] ={
  type: tmp.type,
  trialNum:tmp.num_trials/2,
  num_trials:1,
  on_finish: main_on_finish

};
trials[(tmp.num_trials/2)+3].training = false;
trials[(tmp.num_trials/2)+3].svg = data.svg;
trials[(tmp.num_trials/2)+3].parts = data.parts;
trials[(tmp.num_trials/2)+3].category = data.category;
trials[(tmp.num_trials/2)+3].renders = data.renders;
trials[(tmp.num_trials/2)+3].targetPos = 0;


    // start game
    jsPsych.init({
      timeline: trials,
      default_iti: 5000,
      show_progress_bar: true
    });
  });
};
