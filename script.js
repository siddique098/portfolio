document.addEventListener("DOMContentLoaded", () => {
  // Nav link active state
  const navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // Tooltips for skill cards
  const skillCards = document.querySelectorAll(".skill-card[data-desc]");
  skillCards.forEach(card => {
    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    tooltip.textContent = card.getAttribute("data-desc");
    card.appendChild(tooltip);

    card.addEventListener("click", e => {
      e.stopPropagation();
      skillCards.forEach(c => c !== card && c.classList.remove("show-tooltip"));
      card.classList.toggle("show-tooltip");
    });
  });
  document.addEventListener("click", () => skillCards.forEach(c => c.classList.remove("show-tooltip")));

  // Tic‑Tac‑Toe game
  const gameContainer = document.getElementById("game");
  const restartBtn = document.getElementById("restart");
  const resultBox = document.getElementById("result");
  let board = Array(9).fill(""), player = "X", ai = "O", gameOver = false;

  const winCombos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  function renderBoard(){
    gameContainer.innerHTML="";
    board.forEach((cell,i)=>{
      const div=document.createElement("div");
      div.textContent=cell;
      div.addEventListener("click",()=>playerMove(i));
      gameContainer.appendChild(div);
    });
  }
  function playerMove(i){
    if(board[i]!==""||gameOver)return;
    board[i]=player;renderBoard();
    if(check(player)){gameOver=true;return;}
    aiMove();renderBoard();
    if(check(ai))gameOver=true;
  }
  function aiMove(){
    const best=bestSpot(board,ai);
    if(best!==-1)board[best]=ai;
  }
  function bestSpot(b,symbol){
    const opp=symbol==="X"?"O":"X";
    return b.map((v,i)=>v===""?i:null).filter(i=>i!==null)
            .reduce((best,idx)=>{
              const newB=[...b];newB[idx]=symbol;
              const score=minimax(newB,false,symbol,opp);
              return score>best.score?{idx,score}:best;
            },{idx:-1,score:-Infinity}).idx;
  }
  function minimax(b,max,ai,human){
    const w=winner(b);
    if(w===ai)return 1;if(w===human)return -1;if(!b.includes(""))return 0;
    const scores=b.map((v,i)=>v===""?(()=>{
       const nb=[...b];nb[i]=max?ai:human;
       return minimax(nb,!max,ai,human);
    })():null).filter(s=>s!==null);
    return max?Math.max(...scores):Math.min(...scores);
  }
  function winner(b){return winCombos.find(([a,b_,c])=>b[a]&&b[a]===b[b_]&&b[a]===b[c])?b[winCombos.find(([a,b_,c])=>b[a]&&b[a]===b[b_]&&b[a]===b[c])[0]]:null;}
  function check(sym){
    if(winner(board)===sym){resultBox.textContent=`${sym} wins!`;return true;}
    if(!board.includes("")){resultBox.textContent="It's a draw!";return true;}
    return false;
  }
  restartBtn.addEventListener("click",()=>{board=Array(9).fill("");resultBox.textContent="";gameOver=false;renderBoard();});
  renderBoard();
});
