/**
 * Author: Darren Daly.
 * Version: 3.0.
 * Date: 13/07/2016.
 */
var UI = require('ui');
var Vibe = require('ui/vibe');
var Settings = require('settings');
var cs, roundTotal, runningTotal, count, roundCount, set, set1, set2, end;
var scores = [121];
var rounds = [0, 0, 0, 0];
var d = new Date();
var key = d.toUTCString();

var main = new UI.Card({
  title: 'Arrow Mate',
	fullscreen: true,
  subtitle: scores[cs] + ' - _ - _',
  body: ' Last Round: ' + roundTotal + '\r\n Total: ' + runningTotal + '\r\n Round end : ' + roundCount
});

reset();
main.show();

function reset() {
  end = false;
  cs = 1;
  roundTotal = 0;
  runningTotal = 0;
  count = 1;
  roundCount = 1;
  set = false;
  set1 = false;
  set2 = false;
  for (var i = 1; i < 121; i++) {
    scores[i] = 10;
  }
  setBody();
  main.title('Arrow Mate');
  main.subtitle(scores[cs] + ' - _ - _');
}

function setBody() {
  main.body(' Last Round: ' + roundTotal + '\r\n Total: ' + runningTotal + '\r\n Round end : ' + roundCount);
}

function setDelay() {
  var delay=3000;
  setTimeout(function() {
    main.subtitle(scores[cs] + ' - _ - _');
  },delay); 
}

// SELECT SCORE
main.on('click', 'select', function(e) {
	if (end) {
    reset();
  }
	if (count === 3) {
      roundTotal = scores[cs] + scores[cs-1] + scores[cs-2];
      runningTotal += scores[cs];
      cs++;
      main.subtitle(scores[cs] + ' - _ - _');
      count = 1;
      roundCount++;
    }
    else {
      runningTotal += scores[cs];
      cs++;
			scores[cs] = scores[cs-1];
      if(count === 1) {
        main.subtitle(scores[cs-1] + ' - ' + scores[cs] + ' - _');
      }
      else if (count === 2) {
        main.subtitle(scores[cs-2] + ' - ' + scores[cs-1] + ' - ' + scores[cs]);
      }
      count++;
    }
    setBody();
	
  if (cs === 121) {
    rounds[3] = runningTotal - (rounds[0] + rounds[1] + rounds[2]);
		Settings.data(key, { 'a' : rounds[0], 'b' : rounds[1], 'c' : rounds[2], 'd' : rounds[3] });
		main.subtitle("Total score: " + runningTotal);
    main.body('1st 30: ' + rounds[0] + '\r\n 2nd 30: ' + rounds[1] + '\r\n 3rd 30: ' + rounds[2]  + '\r\n 4th 30: ' + rounds[3], true);
    Vibe.vibrate('long');
		end = true;
  }
  if (roundCount === 11 && !set) {
    rounds[0] = runningTotal;
		Settings.data(key, { 'a' : rounds[0], 'b' : rounds[1], 'c' : rounds[2], 'd' : rounds[3] });
		main.subtitle("1st 30: " + rounds[0]);
		Vibe.vibrate('long');
    set = true;
    setDelay();
  }
  else if (roundCount === 21 && !set1) {
    rounds[1] = runningTotal - rounds[0];
		Settings.data(key, { 'a' : rounds[0], 'b' : rounds[1], 'c' : rounds[2], 'd' : rounds[3] });
		main.subtitle("2nd 30: " + rounds[1]);
    Vibe.vibrate('long');
		set1 = true;
    setDelay();
  }
  else if (roundCount === 31 && !set2) {
    rounds[2] = runningTotal - (rounds[0] + rounds[1]);
		Settings.data(key, { 'a' : rounds[0], 'b' : rounds[1], 'c' : rounds[2], 'd' : rounds[3] });
    main.subtitle("3rd 30: " + rounds[2]);
    Vibe.vibrate('long');
		set2 = true;
    setDelay();
  }
  
});

// BRING UP SCORE
main.on('click', 'up', function(e) {
  if(scores[cs] < 10){
		scores[cs] += 1;
    if (count === 1) {
      main.subtitle(scores[cs] + ' - _ - _');
    }
    else if (count === 2) {
      main.subtitle(scores[cs-1] + ' - ' + scores[cs] + ' - _');
    }
    else if (count === 3) {
      main.subtitle(scores[cs-2] + ' - ' + scores[cs-1] + ' - ' + scores[cs]);
    }
	}
});

main.on('longClick', 'up', function(e) {
		var scorestext = "";
		var data = Settings.data();
		var scoreList = new UI.Card({
			scrollable: true,
			title : "Scores"
		});
		for(var key in data){
			scorestext += key + "\r\n" + (data[key].a+data[key].b+data[key].c+data[key].d) + "[" + data[key].a + "," + data[key].b + "," + data[key].c + "," + data[key].d + "]\r\n";
		}
	
		scoreList.body(scorestext);
		scoreList.show();
});

// BRING DOWN SCORE
main.on('click', 'down', function(e) {
  if(scores[cs] > 0){
		scores[cs] -= 1;
    if (count === 1) {
      main.subtitle(scores[cs] + ' - _ - _');
    }
    else if (count === 2) {
      main.subtitle(scores[cs-1] + ' - ' + scores[cs] + ' - _');
    }
    else if (count === 3) {
      main.subtitle(scores[cs-2] + ' - ' + scores[cs-1] + ' - ' + scores[cs]);
    }
	}
});

// DELETE FUNCTIONALITY
main.on('longClick', function(e) {
  if (end) {
    reset();
  }
  else if (e.button == 'select') {
    if (count === 1 && roundCount != 1) {
      scores[cs] = 10;
      cs--;
      runningTotal = runningTotal - scores[cs];
      main.subtitle(scores[cs-2] + ' - ' + scores[cs-1] + ' - ' + scores[cs]);
      roundCount--;
      setBody();
      count = 3;
      Vibe.vibrate('short');
    }
    else if (count === 2) {
      scores[cs] = 10;
      cs--;
      runningTotal = runningTotal - scores[cs];
      main.subtitle(scores[cs] + ' - _ - _');
      setBody();
      count--;
      Vibe.vibrate('short');
    }
    else if (count === 3) {
      scores[cs] = 10;
      cs--;
      runningTotal = runningTotal - scores[cs];
      main.subtitle(scores[cs-1] + ' - ' + scores[cs] + ' - _');
      setBody();
      count--;
      Vibe.vibrate('short');
    }
  }
});


