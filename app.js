(function(){

  var squaresPlayed = 0;
  var currentPlayToken = 'X';
  var boardRowData = [[null, null, null],[null, null, null],[null, null, null]];
  var boardSqs = document.getElementsByClassName('board__sq');

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
    for(var i = 0; i < boardSqs.length; i++){
      boardSqs[i].innerHTML = "";
      boardSqs[i].disabled = false;
    }
    showResultMessage();
  };

  // var logWinForPlayer = function(winner){
  //   currentPlayToken = (currentPlayToken === 'X') ? 'O' : 'X'; // Reset play token so winner starts next game
  // },

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

  ///////////////////////////////////////
  // Render

  document.getElementsByClassName('js-current-player')[0].innerHTML = currentPlayToken;
  for(var i = 0; i < boardSqs.length; i++){
    boardSqs[i].addEventListener('click', handleSquareClick);
  }
  document.getElementsByClassName('reset-btn')[0].addEventListener('click', handleResetClick);
})();
