document.addEventListener("DOMContentLoaded", () => {
  /* ───────── NAV LINK ACTIVE ───────── */
  const navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach(link=>{
    link.addEventListener("click",()=>{
      navLinks.forEach(l=>l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  /* ───────── TOOLTIP ───────── */
  const skillCards = document.querySelectorAll(".skill-card[data-desc]");
  skillCards.forEach(card=>{
    const tooltip=document.createElement("div");
    tooltip.classList.add("tooltip");
    tooltip.textContent=card.getAttribute("data-desc");
    card.appendChild(tooltip);

    card.addEventListener("click",e=>{
      e.stopPropagation();
      skillCards.forEach(c=>c!==card&&c.classList.remove("show-tooltip"));
      card.classList.toggle("show-tooltip");
    });
  });
  document.addEventListener("click",()=>skillCards.forEach(c=>c.classList.remove("show-tooltip")));

  /* ───────── TIC‑TAC‑TOE ───────── */
  const gameContainer=document.getElementById("game");
  const restartBtn=document.getElementById("restart");
  const resultBox=document.getElementById("result");

  let board=Array(9).fill(""),
      player="X", ai="O",
      gameOver=false;

  const winCombos=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

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
    if(board[i]!==""||gameOver) return;
    board[i]=player;
    renderBoard();
    if(check(player)){gameOver=true;return;}
    aiMove();
    renderBoard();
    if(check(ai)) gameOver=true;
  }

  function aiMove(){
    const best=bestSpot(board,ai);
    if(best!==-1) board[best]=ai;
  }

  function bestSpot(b,symbol){
    const opp=symbol==="X"?"O":"X";
    return b.map((v,i)=>v===""?i:null).filter(i=>i!==null)
      .reduce((best,idx)=>{
        const nb=[...b];nb[idx]=symbol;
        const score=minimax(nb,false,symbol,opp);
        return score>best.score?{idx,score}:best;
      },{idx:-1,score:-Infinity}).idx;
  }

  function minimax(b,max,ai,human){
    const w=getWinnerIndices(b);
    if(w && b[w[0]]===ai) return 1;
    if(w && b[w[0]]===human) return -1;
    if(!b.includes("")) return 0;

    const scores=b.map((v,i)=>v===""?(()=>{
      const nb=[...b];nb[i]=max?ai:human;
      return minimax(nb,!max,ai,human);
    })():null).filter(s=>s!==null);
    return max?Math.max(...scores):Math.min(...scores);
  }

  /* -------- winner helpers -------- */
  function getWinnerIndices(b){
    return winCombos.find(([a,b_,c])=>b[a]&&b[a]===b[b_]&&b[a]===b[c])||null;
  }
  function highlight(wins){
    if(!wins) return;
    const cells=gameContainer.querySelectorAll("div");
    wins.forEach(i=>cells[i].classList.add("win-cell"));
  }
  function clearHighlight(){
    gameContainer.querySelectorAll("div").forEach(d=>d.classList.remove("win-cell"));
  }

  function check(sym){
    const wins=getWinnerIndices(board);
    if(wins && board[wins[0]]===sym){
      resultBox.textContent=`${sym} wins!`;
      highlight(wins);
      return true;
    }
    if(!board.includes("")){
      resultBox.textContent="It's a draw!";
      return true;
    }
    return false;
  }

  restartBtn.addEventListener("click",()=>{
    board=Array(9).fill("");
    resultBox.textContent="";
    gameOver=false;
    clearHighlight();
    renderBoard();
  });

  renderBoard();
});
