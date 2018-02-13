(function(){

  ////////////////////////////////////////////////////////////////////
  ////////// MODEL ///////
  ////////////////////////////////////////////////////////////////////

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


  // Click Square ////////////////////////////////////////////

  var updateModelOnSquareClick = function(clickedRow, clickedCol){
    ++gameState.squaresPlayed;
    gameState.boardRowData[clickedRow][clickedCol] = gameState.currentPlayToken;
    if(gameState.squaresPlayed > 4){
      checkForWinOrTie(gameState.currentPlayToken);
    }
    gameState.currentPlayToken = (gameState.currentPlayToken === 'X') ? 'O' : 'X';
    updateCurrentPlayerDisplay(gameState.currentPlayToken);
  };

  var checkForWinOrTie = function(playToken){
    var boardColData = [[gameState.boardRowData[0][0], gameState.boardRowData[1][0], gameState.boardRowData[2][0]],[gameState.boardRowData[0][1], gameState.boardRowData[1][1], gameState.boardRowData[2][1]],[gameState.boardRowData[0][2], gameState.boardRowData[1][2], gameState.boardRowData[2][2]]];
    checkForRowColStreak(gameState.boardRowData);
    checkForRowColStreak(boardColData);
    checkForDiagonalStreak();
    checkForTie();
    return;
  };

  // var rotateBoardData = function(board){
  //
  //
  // };

  var checkForRowColStreak = function(data){
    for(var i = 0; i < data.length; i++){
      var count = 0;
      for (var s = 0; s < data[i].length; s++){
        if(data[i][s] === gameState.currentPlayToken){
          count++;
        }
      }
      if(count > 2){
        showResultMessage('win');
        logWinForPlayer(gameState.currentPlayToken);
        return;
      }
    }
  };

  var checkForDiagonalStreak = function(){
    if(gameState.boardRowData[1][1] !== gameState.currentPlayToken){
        return;
    }
    if ((gameState.boardRowData[0][0] === gameState.currentPlayToken && gameState.boardRowData[2][2] === gameState.currentPlayToken) ||
    (gameState.boardRowData[0][2] === gameState.currentPlayToken && gameState.boardRowData[2][0] === gameState.currentPlayToken)) {
      showResultMessage('win');
      logWinForPlayer(gameState.currentPlayToken);
      return;
    }
  };

  var checkForTie = function(){
    if(gameState.squaresPlayed === 9){
      showResultMessage('tie');
      return;
    }
  };

  ///////////////////////////////

  var handleResetClick = function(){
    gameState.boardRowData = [[null, null, null],[null, null, null],[null, null, null]];
    gameState.squaresPlayed = 0;
    toggleAllSquareEls(true);
    showResultMessage();
  };

  var updatePlayerName = function(player, name){
    var playerParam = player.toLowerCase() + 'Player';
    gameState[playerParam]['name'] = name;
  }

  var logWinForPlayer = function(winner){
    gameState.currentPlayToken = (gameState.currentPlayToken === 'X') ? 'O' : 'X'; // Reset play token so winner starts next game
    if(winner === 'X'){
      gameState.xPlayer.wins++;
    } else if (winner === 'O'){
      gameState.oPlayer.wins++;
    }
    updateWinsDisplay(winner);
  };



  ////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////// CONTROLLER ///////
  ////////////////////////////////////////////////////////////////////////////////////////////////////

  var boardSqs = document.getElementsByClassName('board__sq');
  var resultMsgEl = document.getElementsByClassName('result-msg')[0];
  var boardEl = document.getElementsByClassName('board')[0];
  var rotationDeg = 0;

  // Click Events ////////////////////////////////////////////

  var handleSquareClick = function(event){
    var clickedSq = event.target;
    if(clickedSq.disabled === true) return;

    // Change presentation
    clickedSq.appendChild(document.createElement('span'));
    clickedSq.querySelector('span').innerHTML = gameState.currentPlayToken;
    clickedSq.disabled = true;

    var clickedRow = parseInt(clickedSq.dataset.row);
    var clickedCol = parseInt(clickedSq.dataset.col);
    updateModelOnSquareClick(clickedRow, clickedCol);

    rotateSquare();
    triggerGravity();
  };

  var rotateSquare = function(){
    rotationDeg += 90;
    boardEl.style.transform = 'rotate(' + rotationDeg + 'deg)';
    var boardSpans = document.querySelectorAll('.board__sq span');
    if(rotationDeg === 90 || rotationDeg % 270 === 0){
      for(var i = 0; i < boardSpans.length; i++){
        boardSpans[i].classList.add('is-rotated');
      }
    } else {
      for(var i = 0; i < boardSpans.length; i++){
        boardSpans[i].classList.remove('is-rotated');
      }
    }
  };

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
      var inputtedName = inputElement.value;
      if(inputtedName !== ""){
        updatePlayerName(inputElement.dataset.player, inputtedName);
        headerElement[0].getElementsByClassName('score-card__name')[0].innerHTML = inputtedName;
        headerElement[0].classList.remove('is-editing-name');
      }
    }
  }

  // Effects ///////////////////////////////////////////////

  var updateCurrentPlayerDisplay = function(newCurrentPlayer){
    document.getElementsByClassName('js-current-player')[0].innerHTML = newCurrentPlayer;
  };

  var updateWinsDisplay = function(winner){
    var currentWinCt = (winner === 'X') ? gameState.xPlayer.wins : gameState.oPlayer.wins;
    document.querySelector('.score-card__score[data-player="' + winner + '"]').innerHTML = currentWinCt;
  };

  var toggleAllSquareEls = function(setToEnabled){
    for(var i = 0; i < boardSqs.length; i++){
      if (setToEnabled){
        boardSqs[i].innerHTML = "";
      }
      boardSqs[i].disabled = setToEnabled ? false : true;
    }
  };

  var showResultMessage = function(outcome){
    if(!outcome){
      resultMsgEl.innerHTML = '';
      resultMsgEl.classList.remove('is-shown');
      boardEl.classList.remove('with-game-over');
      return;
    }
    if(outcome === 'win'){
      var player = gameState.currentPlayToken.toLowerCase() + 'Player';
      var playerName = gameState[player]['name'];
      resultMsgEl.innerHTML = playerName + ' Wins!';
    } else if (outcome === 'tie'){
      resultMsgEl.innerHTML = 'Tie!';
    }
    resultMsgEl.classList.add('is-shown');
    boardEl.classList.add('with-game-over');
    toggleAllSquareEls(false);
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
