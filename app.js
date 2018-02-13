(function(){

  var gameState = {}
  gameState.squaresPlayed = 0;
  gameState.currentPlayToken = 'X';
  gameState.boardRowData = [[null, null, null],[null, null, null],[null, null, null]];
  gameState.xPlayer = {};
  gameState.xPlayer.name = 'Player One';
  gameState.xPlayer.wins = 0;
  gameState.oPlayer = {};
  gameState.oPlayer.name = 'Player One';
  gameState.oPlayer.wins = 0;

  var boardSqs = document.getElementsByClassName('board__sq');


  // Click Square ////////////////////////////////////////////

  var checkForWin = function(playToken){
    var boardColData = [[gameState.boardRowData[0][0], gameState.boardRowData[1][0], gameState.boardRowData[2][0]],[gameState.boardRowData[0][1], gameState.boardRowData[1][1], gameState.boardRowData[2][1]],[gameState.boardRowData[0][2], gameState.boardRowData[1][2], gameState.boardRowData[2][2]]];
    var checkForRowColStreak = function(data){
      for(var i = 0; i < data.length; i++){
        var count = 0;
        for (var s = 0; s < data[i].length; s++){
          if(data[i][s] === gameState.currentPlayToken){
            count++;
          }
        }
        if(count > 2){
          showResultMessage('Player ' + gameState.currentPlayToken + ' Wins!');
          logWinForPlayer(gameState.currentPlayToken);
          return;
        }
      }
    }
    checkForRowColStreak(gameState.boardRowData); // Check rows
    checkForRowColStreak(boardColData); // Check cols
    if(gameState.boardRowData[1][1] === gameState.currentPlayToken){ // Check diagonals
      if ((gameState.boardRowData[0][0] === gameState.currentPlayToken && gameState.boardRowData[2][2] === gameState.currentPlayToken) ||
      (gameState.boardRowData[0][2] === gameState.currentPlayToken && gameState.boardRowData[2][0] === gameState.currentPlayToken)) {
        showResultMessage('Player ' + gameState.currentPlayToken + ' Wins!');
        logWinForPlayer(gameState.currentPlayToken);
        return;
      }
    }

    // If all squares filled without a win, tie!
    if(gameState.squaresPlayed === 9){
      showResultMessage('Tie!');
      return;
    }

  };

  var handleSquareClick = function(event){
    if(event.target.disabled === true) return;

    // Update view and model
    ++gameState.squaresPlayed;
    event.target.innerHTML = gameState.currentPlayToken;
    event.target.disabled = true;
    gameState.boardRowData[parseInt(event.target.dataset.row)][parseInt(event.target.dataset.col)] = gameState.currentPlayToken;

    if(gameState.squaresPlayed > 4){
      checkForWin(gameState.currentPlayToken);
    }
    gameState.currentPlayToken = (gameState.currentPlayToken === 'X') ? 'O' : 'X';
    document.getElementsByClassName('js-current-player')[0].innerHTML = gameState.currentPlayToken;
  };

  var handleResetClick = function(){
    gameState.boardRowData = [[null, null, null],[null, null, null],[null, null, null]];
    gameState.squaresPlayed = 0;
    for(var i = 0; i < boardSqs.length; i++){
      boardSqs[i].innerHTML = "";
      boardSqs[i].disabled = false;
    }
    showResultMessage();
  };

  // Name Editing ////////////////////////////////////////////

  var editName = function(event){
    document.querySelectorAll('.score-card header')[0].classList.remove('is-editing-name');
    document.querySelectorAll('.score-card header')[1].classList.remove('is-editing-name');
    event.target.parentElement.classList.add('is-editing-name');
    event.target.parentElement.children[1].focus();
  };

  var enterNameEdit = function(event){
    var headerElement = document.querySelectorAll('.score-card header.is-editing-name');
    if(event.keyCode === 13 && headerElement.length === 1){
      var inputElement = headerElement[0].getElementsByClassName('score-card__name-input')[0];
      if(inputElement.value !== ""){
        if(inputElement.dataset.player === "X"){
          gameState.xPlayer.name = inputElement.value;
        } else if (inputElement.dataset.player === "O"){
          gameState.oPlayer.name = inputElement.value;
        }
        headerElement[0].getElementsByClassName('score-card__name')[0].innerHTML = inputElement.value;
        headerElement[0].classList.remove('is-editing-name');
      }
    }
  }

  // End of Game ////////////////////////////////////////////

  var logWinForPlayer = function(winner){
    gameState.currentPlayToken = (gameState.currentPlayToken === 'X') ? 'O' : 'X'; // Reset play token so winner starts next game
    if(winner === 'X'){
      gameState.xPlayer.wins++;
      document.querySelector('.score-card__score[data-player="X"]').innerHTML = gameState.xPlayer.wins;
    } else if (winner === 'O'){
      gameState.oPlayer.wins++;
      document.querySelector('.score-card__score[data-player="O"]').innerHTML = gameState.oPlayer.wins;
    }
  };

  var showResultMessage = function(displayText){
    if(displayText){
      document.getElementsByClassName('result-msg')[0].innerHTML = displayText;
      document.getElementsByClassName('result-msg')[0].classList.add('is-shown');
      document.getElementsByClassName('board')[0].classList.add('with-game-over');
    } else {
      document.getElementsByClassName('result-msg')[0].innerHTML = '';
      document.getElementsByClassName('result-msg')[0].classList.remove('is-shown');
      document.getElementsByClassName('board')[0].classList.remove('with-game-over');
    }
  };

  // Render ////////////////////////////////////////////

  document.getElementsByClassName('js-current-player')[0].innerHTML = gameState.currentPlayToken;
  for(var i = 0; i < boardSqs.length; i++){
    boardSqs[i].addEventListener('click', handleSquareClick);
  }
  document.getElementsByClassName('reset-btn')[0].addEventListener('click', handleResetClick);
  document.getElementsByClassName('score-card__name')[0].addEventListener('click', editName);
  document.getElementsByClassName('score-card__name')[1].addEventListener('click', editName);
  document.addEventListener('keyup', enterNameEdit);
})();
