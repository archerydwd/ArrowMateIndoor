var cs = 1;
var roundTotal = 0;
var runningTotal = 0;
var count = 1;
var roundCount = 1;
var scores = [121];

for (var i = 1; i < 121; i++) {
  scores[i] = 10;
}

simply.setText({
	title: 'Arrow Mate Indoor',
  subtitle: scores[cs] + ' - _ - _',
	body: ' Last Round: ' + roundTotal + '\r\n Total: ' + runningTotal + '\r\n Round end : ' + roundCount,
}, true);

simply.on('singleClick', function(e) {
	if (scores[cs] < 10 && e.button == 'up') {
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
      if(count === 1) {
        simply.subtitle(scores[cs-1] + ' - ' + scores[cs] + ' - _');
      }
      else if (count === 2) {
        simply.subtitle(scores[cs-2] + ' - ' + scores[cs-1] + ' - ' + scores[cs]);
      }
      count++;
      simply.body(' Last Round: ' + roundTotal + '\r\n Total: ' + runningTotal + '\r\n Round end : ' + roundCount);
    }
	}
  if (cs === 121) {
    simply.body(' Congratulations \r\n Your Total Score is: \r\n' + runningTotal);
  }
});




simply.on('longClick', function(e) {
  cs--;
	if (count === 0 && roundCount != 1) {
		runningTotal = runningTotal - scores[cs];
		simply.subtitle(scores[cs-2] + ' - ' + scores[cs-1] + ' - ' + scores[cs]);
		simply.body(' Last Round: ' + roundTotal + '\r\n Total: ' + runningTotal + '\r\n Round end : ' + (--roundCount));
		count = 2;
	}
	else if (count === 1) {
		runningTotal = runningTotal - scores[cs];
		simply.subtitle(scores[cs] + ' - _ - _');
    simply.body(' Last Round: ' + roundTotal + '\r\n Total: ' + runningTotal + '\r\n Round end : ' + roundCount);
		count--;
	}
	else if (count === 2) {
		runningTotal = runningTotal - scores[cs];
		simply.subtitle(scores[cs-1] + ' - ' + scores[cs] + ' - _');
    simply.body(' Last Round: ' + roundTotal + '\r\n Total: ' + runningTotal + '\r\n Round end : ' + roundCount);
		count--;
	}
	simply.vibe();
});