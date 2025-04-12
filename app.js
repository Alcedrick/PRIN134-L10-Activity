class Player {
    constructor(name) {
        this.name = name;
        this.score = 0;
    }
}


function calculateSuccessRate() {
    return Math.random(); 
}


function shootBall(player, attempts) {
    let successfulShots = 0;
    for (let i = 0; i < attempts; i++) {
        if (calculateSuccessRate() > 0.5) { 
            successfulShots += 1;
        }
    }
    player.score += successfulShots;
    return successfulShots;
}


function rankPlayers(players) {
    return [...players].sort((a, b) => b.score - a.score);
}


function isTieAmongTopPlayers(players) {
    if (players.length < 2) return false;
    const topScore = players[0].score;
    return players.filter(player => player.score === topScore).length > 1;
}


function getTopTiedPlayers(players) {
    const topScore = players[0].score;
    return players.filter(player => player.score === topScore);
}


function resetTopTiedPlayersScores(tiedPlayers) {
    tiedPlayers.forEach(player => {
        player.score = 0;
    });
}


function displayTiedTopPlayers(tiedPlayers) {
    console.log("   Rankings among tied first-place players:");
    tiedPlayers.forEach((player, index) => {
        console.log(`${index + 1}. ${player.name} - ${player.score} points`);
    });
}


function runTiebreaker(tiedPlayers, attempts, round) {
    console.log(`   ⚖️ Tiebreaker Round ${round} needed between: ${tiedPlayers.map(player => player.name).join(", ")}`);
    console.log(`   🏀 Round ${round} Begins!`);

    tiedPlayers.forEach(player => {
        const successfulShots = shootBall(player, attempts);
        console.log(`${player.name} scored ${successfulShots} successful shots 🏀.`);
    });

    
    const rankedTiedPlayers = rankPlayers(tiedPlayers);
    displayTiedTopPlayers(rankedTiedPlayers);
}

function displayResults(message, isChampion = false, isTiebreaker = false) {
  const resultsDiv = document.getElementById('resultsContent');
  const resultElement = document.createElement('div');
  resultElement.className = 'player-result';
  
  if (isChampion) {
      resultElement.classList.add('champion');
  } else if (isTiebreaker) {
      resultElement.classList.add('tiebreaker');
  }
  
  resultElement.innerHTML = message;
  resultsDiv.appendChild(resultElement);
}

function clearResults() {
  const resultsDiv = document.getElementById('resultsContent');
  if (resultsDiv) {
      resultsDiv.innerHTML = '';
  }
}

function runGame() {
  clearResults();
  
  const playerElements = document.getElementById('myUL').getElementsByTagName('li');
  const players = [];
  
  for (let element of playerElements) {
      const playerName = element.textContent.replace('×', '').trim();
      if (playerName) {
          players.push(new Player(playerName));
      }
  }

  if (players.length < 2) {
      alert("Please add at least two players to start the game!");
      return;
  }

  const attemptsPerRound = 5;
  let tiebreakerRound = 1;

  // Initial round
  players.forEach(player => {
      shootBall(player, attemptsPerRound);
  });

  let rankedPlayers = rankPlayers(players);
  displayResults('<strong>🏆 Initial Rankings:</strong>');
  
  rankedPlayers.forEach((player, index) => {
      displayResults(`${index + 1}. ${player.name} - ${player.score} points`);
  });

  let topTiedPlayers = getTopTiedPlayers(rankedPlayers);
  
  while (isTieAmongTopPlayers(topTiedPlayers)) {
      resetTopTiedPlayersScores(topTiedPlayers);
      displayResults(`⚖️ Tiebreaker Round ${tiebreakerRound} needed between: ${topTiedPlayers.map(p => p.name).join(', ')}`, false, true);
      
      topTiedPlayers.forEach(player => {
          const successfulShots = shootBall(player, attemptsPerRound);
          displayResults(`${player.name} scored ${successfulShots} successful shots 🏀`, false, true);
      });

      topTiedPlayers = rankPlayers(topTiedPlayers);
      tiebreakerRound += 1;
  }
  
  displayResults(`🏆 The champion is ${topTiedPlayers[0].name} with ${topTiedPlayers[0].score} points! 🏆`, true);
}


function startGame() {
  clearResults();
  
  const playerElements = document.getElementById('myUL').getElementsByTagName('li');
  if (playerElements.length < 2) {
      alert("Please add at least two players to start the game!");
      return;
  }

  // Start the game
  runGame();
}

var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
  }
}, false);

function newElement() {
  var inputValue = document.getElementById("myInput").value;
  if (inputValue === '') {
    alert("Please enter a player name!");
    return;
  }

  var li = document.createElement("li");
  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  document.getElementById("myUL").appendChild(li);
  document.getElementById("myInput").value = "";
}

