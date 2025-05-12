import { useState } from 'react';

const Game = () => {
  const [board, setBoard] = useState([
    ['-', '-', '-'],
    ['-', '-', '-'],
    ['-', '-', '-'],
  ]);
  const [gameStatus, setGameStatus] = useState('Your Chance');
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState(null);

  const isMovesLeft = (boardState) => {
    for(let rowIndex = 0; rowIndex < 3; rowIndex++){
      for(let colIndex = 0; colIndex < 3; colIndex++){
        if(boardState[rowIndex][colIndex] === '-') return true;
      }
    }
    return false;
  }

  const evaluate = (boardState) => {
    for(let rowIdx = 0; rowIdx < 3; rowIdx++){
      if( boardState[rowIdx][0] === boardState[rowIdx][1] && boardState[rowIdx][1] === boardState[rowIdx][2] && boardState[rowIdx][0] !== '-' ){
        return boardState[rowIdx][0] === 'C' ? 10 : -10;
      }
    }

    for(let colIdx = 0; colIdx < 3; colIdx++){
      if( boardState[0][colIdx] === boardState[1][colIdx] && boardState[1][colIdx] === boardState[2][colIdx] && boardState[0][colIdx] !== '-'){
        return boardState[0][colIdx] === 'C' ? 10 : -10;
      }
    }

    if( boardState[0][0] === boardState[1][1] && boardState[1][1] === boardState[2][2] && boardState[0][0] !== '-' ){
      return boardState[0][0] === 'C' ? 10 : -10;
    }

    if( boardState[2][0] === boardState[1][1] && boardState[1][1] === boardState[0][2] && boardState[2][0] !== '-' ){
      return boardState[2][0] === 'C' ? 10 : -10;
    }

    return 0;
  }

  const checkGameState = (boardState) => {
    const score = evaluate(boardState);

    if(score === 10){
      setGameResult('LOSE');
      setGameOver(true);
      setGameStatus('Game Over');
      return true;
    }else if(score === -10){
      setGameResult('WIN');
      setGameOver(true);
      setGameStatus('Game Over');
      return true;
    }

    const isMoveLeft = isMovesLeft(boardState);
    if(!isMoveLeft){
      setGameResult('DRAW');
      setGameOver(true);
      setGameStatus('Game Over');
      return true;
    }

    return false;
  }

  const handleClick = (rowIdx, colIdx) => {
    if(gameOver) return;

    if(board[rowIdx][colIdx] !== '-') return;

    const newBoard = board.map((row, rIdx) =>
      row.map((cell, cIdx) => (rIdx === rowIdx && cIdx === colIdx ? 'H' : cell))
    )

    const isGameEnded = checkGameState(newBoard);

    setBoard(newBoard);

    if(!isGameEnded){
      setGameStatus('AI Thinking');
      
      setTimeout(() => {
        performAIMove(newBoard);
      }, 1000)
    }
  }

  const performAIMove = (currentBoard) => {
    const boardCopy = currentBoard.map(row => [...row]);

    const [row, col] = findBestMove(boardCopy);

    const newBoard = boardCopy.map((r, rIdx) =>
      r.map((cell, cIdx) => (rIdx === row && cIdx === col ? 'C' : cell))
    )

    const isGameEnded = checkGameState(newBoard);

    setBoard(newBoard);

    if(!isGameEnded){
      setGameStatus('Your Chance');
    }
  }

  const findBestMove = (boardState) => {
    let bestValue = Number.MIN_SAFE_INTEGER;
    let bestMove = [-1, -1];

    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++){
        if(boardState[i][j] === '-'){
          boardState[i][j] = 'C';          
          let moveValue = alphabeta(boardState, 0, false, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
          boardState[i][j] = '-';

          if(moveValue > bestValue){
            bestValue = moveValue;
            bestMove = [i, j];
          }
        }
      }
    }
    return bestMove;
  }

  const alphabeta = (boardState, depth, isMaximizing, alpha, beta) => {
    let score = evaluate(boardState);

    if(score === 10) return score - depth;
    if(score === -10) return score + depth;

    const isMoveLeft = isMovesLeft(boardState);
    if(!isMoveLeft) return 0;

    if(isMaximizing){
      let best = Number.MIN_SAFE_INTEGER;
      for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
          if(boardState[i][j] === '-'){
            boardState[i][j] = 'C';
            best = Math.max(best, alphabeta(boardState, depth + 1, false, alpha, beta));
            boardState[i][j] = '-';
            alpha = Math.max(alpha, best);
            if(alpha >= beta) break;
          }
        }
      }
      return best;
    }else{
      let best = Number.MAX_SAFE_INTEGER;
      for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
          if(boardState[i][j] === '-'){
            boardState[i][j] = 'H';
            best = Math.min(best, alphabeta(boardState, depth + 1, true, alpha, beta));
            boardState[i][j] = '-';
            beta = Math.min(beta, best);
            if(alpha >= beta) break;
          }
        }
      }
      return best;
    }
  }

  const resetGame = () => {
    setBoard([
      ['-', '-', '-'],
      ['-', '-', '-'],
      ['-', '-', '-'],
    ]);
    setGameStatus('Your Chance');
    setGameOver(false);
    setGameResult(null);
  }

  return (
    <div className="w-[100vw] min-h-[100vh] flex flex-col justify-center items-center bg-gradient-to-r from-gray-200 to-sky-300">
      <p className="text-[2.5rem] font-extrabold font-mono text-[#231942]">Tic-Tac-Toe</p>

      <div className="mt-[2rem] font-mono font-bold text-[1.5rem]">
        {gameOver ? gameResult : gameStatus}
      </div>

      {gameOver && (
        <div className="mt-4 flex flex-col items-center">
          <p className="text-2xl font-bold mb-4">
            {gameResult === 'WIN' 
              ? 'Congratulations! You Won!' 
              : gameResult === 'LOSE' 
                ? 'AI Won! Better luck next time.' 
                : 'It\'s a Draw!'}
          </p>
          <button 
            onClick={resetGame}
            className="px-4 py-2 bg-[#231942] text-white rounded hover:bg-[#231942]/80 transition-colors"
          >
            Play Again
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 mx-auto md:w-[20%] w-[50%] gap-0 rounded-xl overflow-hidden mt-4">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              onClick={() => handleClick(rowIndex, colIndex)}
              key={`${rowIndex}-${colIndex}`}
              className={`w-full cursor-pointer text-[2rem] text-[white] font-bold font-mono hover:scale-105 transition-all duration-200 flex justify-center items-center aspect-square bg-[#231942]/50 backdrop-blur-lg ${
                rowIndex < 2 ? 'border-b-[2px] border-gray-400' : ''
              } ${colIndex < 2 ? 'border-r-[2px] border-gray-400' : ''}`}
            >
              {cell === '-' ? '' : cell === 'H' ? 'X' : 'O'}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Game