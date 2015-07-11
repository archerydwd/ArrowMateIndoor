/*
author: Darren Daly
*/
var UI = require('ui');
var cs, roundTotal, runningTotal, count, roundCount, set, set1, set2, end;
var scores = [121];
var rounds = [0, 0, 0, 0];
var key = Date.now();
reset();

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
  simply.title('Arrow Mate');
  simply.subtitle(scores[cs] + ' - _ - _');
}

function setDelay() {
  var delay=3000;
  setTimeout(function() {
    simply.subtitle(scores[cs] + ' - _ - _');
  },delay); 
}

function setBody() {
  simply.body(' Last Round: ' + roundTotal + '\r\n Total: ' + runningTotal + '\r\n Round end : ' + roundCount);
}

simply.setText({
	title: 'Arrow Mate',
  subtitle: scores[cs] + ' - _ - _',
	body: ' Last Round: ' + roundTotal + '\r\n Total: ' + runningTotal + '\r\n Round end : ' + roundCount,
}, true);

simply.on('singleClick', function(e) {
  if (end) {
    reset();
  }
	else if (scores[cs] < 10 && e.button == 'up') {
    scores[cs] += 1;
    if (count === 1) {
      simply.subtitle(scores[cs] + ' - _ - _');
    }
    else if (count === 2) {
      simply.subtitle(scores[cs-1] + ' - ' + scores[cs] + ' - _');
    }
    else if (count === 3) {
      simply.subtitle(scores[cs-2] + ' - ' + scores[cs-1] + ' - ' + scores[cs]);
    }
	}
	else if (scores[cs] > 0 && e.button == 'down') {
		scores[cs] -= 1;
    if (count === 1) {
      simply.subtitle(scores[cs] + ' - _ - _');
    }
    else if (count === 2) {
      simply.subtitle(scores[cs-1] + ' - ' + scores[cs] + ' - _');
    }
    else if (count === 3) {
      simply.subtitle(scores[cs-2] + ' - ' + scores[cs-1] + ' - ' + scores[cs]);
    }
	}
	else if (e.button == 'select') {
    if (count === 3) {
      roundTotal = scores[cs] + scores[cs-1] + scores[cs-2];
      runningTotal += scores[cs];
      cs++;
      simply.subtitle(scores[cs] + ' - _ - _');
      count = 1;
      roundCount++;
    }
    else {
      runningTotal += scores[cs];
      cs++;
			scores[cs] = scores[cs-1];
      if(count === 1) {
        simply.subtitle(scores[cs-1] + ' - ' + scores[cs] + ' - _');
      }
      else if (count === 2) {
        simply.subtitle(scores[cs-2] + ' - ' + scores[cs-1] + ' - ' + scores[cs]);
      }
      count++;
    }
    setBody();
	}
  if (cs === 121) {
    rounds[3] = runningTotal - (rounds[0] + rounds[1] + rounds[2]);
		localStorage[key] = JSON.stringify(rounds);
    simply.title('Congrats!!!');
    simply.body('Total Score: ' + runningTotal  + '\r\n 1st 30: ' + rounds[0] + '\r\n 2nd 30: ' + rounds[1] + '\r\n 3rd 30: ' + rounds[2]  + '\r\n 4th 30: ' + rounds[3], true);
    end = true;
  }
  if (roundCount === 11 && !set) {
    rounds[0] = runningTotal;
    simply.subtitle("first 30: " + rounds[0]);
    set = true;
		localStorage[key] = JSON.stringify(rounds);
    setDelay();
  }
  else if (roundCount === 21 && !set1) {
    rounds[1] = runningTotal - rounds[0];
    simply.subtitle("second 30: " + rounds[1]);
    set1 = true;
		localStorage[key] = JSON.stringify(rounds);
    setDelay();
  }
  else if (roundCount === 31 && !set2) {
    rounds[2] = runningTotal - (rounds[0] + rounds[1]);
    simply.subtitle("third 30: " + rounds[2]);
    set2 = true;
		localStorage[key] = JSON.stringify(rounds);
    setDelay();
  }
});

simply.on('longClick', function(e) {
  if (end) {
    reset();
  }
  else if (e.button == 'select') {
    if (count === 1 && roundCount != 1) {
      scores[cs] = 10;
      cs--;
      runningTotal = runningTotal - scores[cs];
      simply.subtitle(scores[cs-2] + ' - ' + scores[cs-1] + ' - ' + scores[cs]);
      roundCount--;
      setBody();
      count = 3;
      simply.vibe();
    }
    else if (count === 2) {
      scores[cs] = 10;
      cs--;
      runningTotal = runningTotal - scores[cs];
      simply.subtitle(scores[cs] + ' - _ - _');
      setBody();
      count--;
      simply.vibe();
    }
    else if (count === 3) {
      scores[cs] = 10;
      cs--;
      runningTotal = runningTotal - scores[cs];
      simply.subtitle(scores[cs-1] + ' - ' + scores[cs] + ' - _');
      setBody();
      count--;
      simply.vibe();
    }
	}
	else if (e.button == 'up') {
		var rnds = JSON.parse(localStorage[key]);
		var endscore = 0;
		if (typeof rnds[3] != "undefined"){
			endscore = rnds[0]+rnds[1]+rnds[2]+rnds[3];
		}
		else if (typeof rnds[2] != "undefined"){
			endscore = rnds[0]+rnds[1]+rnds[2];
		}
		else if (typeof rnds[1] != "undefined"){
			endscore = rnds[0]+rnds[1];
		}
		else if (typeof rnds[0] != "undefined"){
			endscore = rnds[0];
		}
		simply.title('scores:');
    simply.body('Total Score: ' + endscore  + '\r\n 1st 30: ' + rnds[0] + '\r\n 2nd 30: ' + rnds[1] + '\r\n 3rd 30: ' + rnds[2]  + '\r\n 4th 30: ' + rnds[3], true);
  }
	
	else if (e.button == 'up') {
		simply.title('scores:');
		var ListOfScores = [];
		for (var i = 0; i < localStorage.length; i++){
			ListOfScores.append(JSON.parse(localStorage.getItem(localStorage.key(i))));
		}
		
		var scoreMenu = new UI.Menu({
			sections: [{
				title: 'Score List',
				items: ListOfScores
			}]
		});
		
		scoreMenu.show();
	}
});