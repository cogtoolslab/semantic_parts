var oldCallback;

function sendData() {
  console.log('sending data to mturk');
  jsPsych.turk.submitToTurk({});
}

function setupExp(){
  var socket = io.connect();

  socket.on('onConnected', function(d) {
    var numTrials = d.num_trials;
    var id = d.id;
    console.log(d);

    var tmp = {
      type: 'part_annotation',
      iterationName: 'pilot0',
      num_trials: numTrials
    };

    var trials = new Array(tmp.num_trials + 2);
    
    var consentHTML = {
      'str1' : '<p> Hey do you want to do this?</p>' };
    var instructionsHTML = {
      'str1' :'<p> Annotate stuff for us please</p>' };

    var intro = {
      type: 'instructions',
      pages: [
    	consentHTML.str1,
    	instructionsHTML.str1
      ],
      show_clickable_nav: true
    };
    
    var goodbye = {
      type: 'instructions',
      pages: [
    	'Thanks for participating in our experiment! You are all done. Please click the button to submit this HIT.'
      ],
      show_clickable_nav: true,
      on_finish: function() { sendData();}
    };

    trials[0] = intro;
    trials[tmp.num_trials +1] = goodbye;

    var main_on_finish = function(data)  {
      socket.emit('currentData', data);
    };

    var main_on_start = function(trial) {

      console.log("main on start being called");

      oldCallback = newCallback;
      var newCallback = function(stim) {
      	_.extend(trials[1], stim);
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
      var k = i+1;
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
