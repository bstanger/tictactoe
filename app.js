(function(){

  var squaresPlayed = 0;
  var currentPlayToken = 'X';
  var boardRowData = [[null, null, null],[null, null, null],[null, null, null]];
  var boardSqs = document.getElementsByClassName('board__sq');
  var xPlayerWins = 0;
  var oPlayerWins = 0;
  var xPlayerName = 'Player One';
  var oPlayerName = 'Player Two';

  // Click Square ////////////////////////////////////////////

  var checkForWin = function(playToken){
    var boardColData = [[boardRowData[0][0], boardRowData[1][0], boardRowData[2][0]],[boardRowData[0][1], boardRowData[1][1], boardRowData[2][1]],[boardRowData[0][2], boardRowData[1][2], boardRowData[2][2]]];
    var checkForRowColStreak = function(data){
      for(var i = 0; i < data.length; i++){
        var count = 0;
        for (var s = 0; s < data[i].length; s++){
          if(data[i][s] === currentPlayToken){
            count++;
          }
        }
        if(count > 2){
          showResultMessage('Player ' + currentPlayToken + ' Wins!');
          logWinForPlayer(currentPlayToken);
          return;
        }
      }
    }
    checkForRowColStreak(boardRowData); // Check rows
    checkForRowColStreak(boardColData); // Check cols
    if(boardRowData[1][1] === currentPlayToken){ // Check diagonals
      if ((boardRowData[0][0] === currentPlayToken && boardRowData[2][2] === currentPlayToken) ||
      (boardRowData[0][2] === currentPlayToken && boardRowData[2][0] === currentPlayToken)) {
        showResultMessage('Player ' + currentPlayToken + ' Wins!');
        logWinForPlayer(currentPlayToken);
        return;
      }
    }

    // If all squares filled without a win, tie!
    if(squaresPlayed === 9){
      showResultMessage('Tie!');
      return;
    }

  };

  var handleSquareClick = function(event){
    if(event.target.disabled === true) return;

    // Update view and model
    ++squaresPlayed;
    event.target.innerHTML = currentPlayToken;
    event.target.disabled = true;
    boardRowData[parseInt(event.target.dataset.row)][parseInt(event.target.dataset.col)] = currentPlayToken;

    if(squaresPlayed > 4){
      checkForWin(currentPlayToken);
    }
    currentPlayToken = (currentPlayToken === 'X') ? 'O' : 'X';
    document.getElementsByClassName('js-current-player')[0].innerHTML = currentPlayToken;
  };

  var handleResetClick = function(){
    boardRowData = [[null, null, null],[null, null, null],[null, null, null]];
    squaresPlayed = 0;
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
          xPlayerName = inputElement.value;
        } else if (inputElement.dataset.player === "O"){
          oPlayerName = inputElement.value;
        }
        headerElement[0].getElementsByClassName('score-card__name')[0].innerHTML = inputElement.value;
        headerElement[0].classList.remove('is-editing-name');
      }
    }
  }

  // End of Game ////////////////////////////////////////////

  var logWinForPlayer = function(winner){
    currentPlayToken = (currentPlayToken === 'X') ? 'O' : 'X'; // Reset play token so winner starts next game
    if(winner === 'X'){
      xPlayerWins++;
    } else if (winner === 'O'){
      oPlayerWins++;
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

  document.getElementsByClassName('js-current-player')[0].innerHTML = currentPlayToken;
  for(var i = 0; i < boardSqs.length; i++){
    boardSqs[i].addEventListener('click', handleSquareClick);
  }
  document.getElementsByClassName('reset-btn')[0].addEventListener('click', handleResetClick);
  document.getElementsByClassName('score-card__name')[0].addEventListener('click', editName);
  document.getElementsByClassName('score-card__name')[1].addEventListener('click', editName);
  document.addEventListener('keyup', enterNameEdit);
})();
