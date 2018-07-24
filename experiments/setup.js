var oldCallback;

function sendData() {
  console.log('sending data to mturk');
  jsPsych.turk.submitToTurk({});
}

function setupExp(){
  var socket = io.connect();

  socket.on('onConnected', function(d) {
    //var numTrials = d.num_trials;
    var numTrials = 4;
    var id = d.id;
    console.log(d);

    var tmp = {
      type: 'part_annotation',
      iterationName: 'pilot0',
      num_trials: numTrials
    };

    var trials = new Array(tmp.num_trials + 2);
    
    var consentHTML = {
      'str1' : '<p> In this HIT you will see some sketches. Your task will be to label the constituent strokes of these sketches using an interactive menu and/or a free response box.</p>',
      'str2': '<p> We expect the average amount of time required to complete the HIT to be around n minutes, including the time it takes to read the instructions. </p>',
      'str3':"<p> If you encounter a problem or error, send us an email () and we will make sure you're compensated for your time! Please pay attention and do your best! Thank you!</p><p> Note: We recommend using Chrome. We have not tested this HIT in other browsers.</p>"};
      var instructionsHTML = {
        'str1' :"<p> Each trial will appear as follows: A sketch will appear within a bounded box along with a corresponding menu of part labels to its right. You will also see a category label which will tell you what object the sketch is of.\
        You will also see a 'next sketch' button below the sketch box, which will allow you to move on to the next trial when you are done labeling the sketch.\
        Finally you will see a blue progress bar at the bottom of the screen indicating how many parts have been labeled for the current sketch.</p><p> Here is an example:</p><p> <img src='testImage.png' style= 'border:2px solid #000000;'></img></p>",
        'str2':"<p> Your task is to highlight strokes on the sketch and annotate them using either the labels provided, or by clicking on 'Other' and entering your own label in the text-box that appears.</p>",
        'str3':"<p> There are two main ways of highlighting strokes : Clicking on a stroke to highlight it or clicking and dragging the mouse across multiple strokes to highligh a family of strokes. \
        Once you've highlighted all the strokes you want to, click on one of the menu labels to assign that label to the highlighter strokes. Repeat this process until all strokes are labeled.</p>",
        'str4': "<p> As you continue to label strokes, unselected strokes will get thicker to help guide your attention to potential smaller strokes, which you may have missed. \
        You can click on already highlighted strokes to un-highlight them before clicking on a menu label. Similarly, if you want to relabel an already labeled stroke, click on it and choose a new label from the menu.</p>"};

        var intro = {
          type: 'instructions',
          pages: [
          consentHTML.str1,
          consentHTML.str2,
          consentHTML.str3,
          instructionsHTML.str1,
          instructionsHTML.str2,
          instructionsHTML.str3,
          instructionsHTML.str4,
          ],
          show_clickable_nav: true
        };
        console.log(data.parts);


        var comprehensionTrial = {
          type : 'part_annotation',
          num_trials: 1,
          on_finish: function(data){
            var results = data.results;
            console.log(JSON.parse(data.results)[0].smiley);
            
          }
        }


        trials[1] = comprehensionTrial;
        trials[1].svg = data.svg;
        trials[1].parts = data.parts;
        trials[1].category = data.category;



        var goodbye = {
          type: 'instructions',
          pages: [
          'Thanks for participating in our experiment! You are all done. Please click the button to submit this HIT.'
          ],
          show_clickable_nav: true,
          on_finish: function() { sendData();}
        };

        trials[0] = intro;
        
        trials[tmp.num_trials +2] = goodbye;

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
trial.svg = stim.svg;
trial.parts = stim.parts;
trial.category = stim.category;

jsPsych.resumeExperiment();
};
socket.removeListener('stimulus', oldCallback);
socket.on('stimulus', newCallback);

socket.emit('getStim', {gameID: id});
};

for(var i = 0; i< tmp.num_trials; i++){
  var k = i+2;
  trials[k] = {
   type: tmp.type,
   trialNum: i,    	
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
