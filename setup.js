
function sendData() {
	console.log('sending data to mturk');
	jsPsych.turk.submitToTurk({});
}

var data = data;


var tmp = {
	type: 'part_annotation',
	iterationName: 'pilot0',
	num_trials: data.length
};


var trials = new Array(tmp.num_trials + 2);

function setupExp(){

	consentHTML = {
		'str1' : '<p> Hey do you want to do this?</p>' }
    instructionsHTML = {
    	'str1' :'<p> Annotate stuff for us please</p>' }

    	var intro = {
    		type: 'instructions',
    		pages: [
    		consentHTML.str1,
    		instructionsHTML.str1
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
            var k = i+1
    		trials[k] = {
    			type: tmp.type,
    			trialNum: i,
    			svgData: data[i].svgData,
    			parts: data[i].parts,
    			category: data[i].category
    			//on_finish: main_on_finish,
    			//on_start: main_on_start
    		}

    	}

         console.log(trials);
    	jsPsych.init({
    		timeline: trials,
    		default_iti: 100,
    		show_progress_bar: true
    	});

    }
