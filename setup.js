
paper.setup('myCanvas');

function sendData() {
	console.log('sending data to mturk');
	jsPsych.turk.submitToTurk({});
}

var tmp = {
	type: 'part_annotation',
	iterationName: 'pilot0',
	num_trials: num_trials,
};


var trials = new Array(tmp.num_trials + 2);

function setup(){

	consentHTML = {
		'str1' :  }
    // add welcome page
    instructionsHTML = {
    	'str1' : }

    	var intro = {
    		type: 'instructions',
    		pages: [
    		consentHTML.str1,

    		instructionsHTML.str1,

    		],
    		show_clickable_nav: true
    	}

    	var goodbye = {
    		type: 'instructions',
    		pages: [
    		'Thanks for participating in our experiment! You are all done. Please click the button to submit this HIT.'
    		],
    		show_clickable_nav: true,
    		on_finish: function() { sendData();}
    	}

    	trials[0] = intro;
    	trials[tmp.num_trials +1] = goodbye;

    	for(var i = 0; i< tmp.num_trials; i++){

    		trials[] = {
    			type: tmp.type,
    			trialNum: i,
    			svgData: undefined
    			parts: undefined,
    			category: undefined
    			//on_finish: main_on_finish,
    			//on_start: main_on_start
    		}

    	}


    	jsPsych.init({
    		timeline: trials,
    		default_iti: 100,
    		show_progress_bar: true
    	});




    }