(function(){

  var squaresPlayed = 0;

  var checkForWin = function(isPlayerO){
    var row1 = document.querySelectorAll('.board__row1 button');
    var row2 = document.querySelectorAll('.board__row2 button');
    var row3 = document.querySelectorAll('.board__row3 button');
    var col1 = document.querySelectorAll('.board__sq[data-col="1"]');
    var col2 = document.querySelectorAll('.board__sq[data-col="2"]');
    var col3 = document.querySelectorAll('.board__sq[data-col="3"]');
    var rowsAndCols = [row1, row2, row3, col1, col2, col3];
    var currentPlayerType = isPlayerO ? "O" :"X";
    for(var i = 0; i < rowsAndCols.length; i++){
      var count = 0;
      for (var s = 0; s < rowsAndCols[i].length; s++){
        if(rowsAndCols[i][s].innerHTML === currentPlayerType){
          count++;
        }
      }
      if(count > 2){
        document.getElementsByClassName('result-msg')[0].innerHTML = 'Player ' + currentPlayerType + ' Wins!';
        return;
      }
    }
  };

  var handleClick = function(event){
    // if(event.target.innerHTML !== ""){
    //   return;
    // }
    var isPlayerO = (squaresPlayed % 2 === 0);
    ++squaresPlayed;
    if(isPlayerO){
      // event.target.value = '0';
      event.target.innerHTML = 'O';
    } else {
      // event.target.value = '1';
      event.target.innerHTML = 'X';
    }
    //event.target.removeEventListener('click', this.handleClick, true);
    if(squaresPlayed > 4){
      if(squaresPlayed === 9){
        document.getElementsByClassName('result-msg').innerHTML('Tie!');
        return;
      }
      checkForWin(isPlayerO);
    }
  }

  // Render
  var boardSqs = document.getElementsByClassName('board__sq');
  for(var i = 0; i < boardSqs.length; i++){
    boardSqs[i].addEventListener('click', handleClick);
  }
})();
