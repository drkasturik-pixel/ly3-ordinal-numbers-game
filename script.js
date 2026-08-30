const animals=[
 {name:"elephant",file:"elephant.png",position:1},
 {name:"cat",file:"cat.png",position:2},
 {name:"dog",file:"dog.png",position:3},
 {name:"koala",file:"koala.png",position:4},
 {name:"bear",file:"bear.png",position:5},
 {name:"pig",file:"pig.png",position:6},
 {name:"panda",file:"panda.png",position:7},
 {name:"chicken",file:"chicken.png",position:8},
 {name:"monkey",file:"monkey.png",position:9},
 {name:"fox",file:"fox.png",position:10}
];

const ordinals=["1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th"];
const ordinalWords=["first","second","third","fourth","fifth","sixth","seventh","eighth","ninth","tenth"];

let questions=[],index=0,score=0,locked=false;

const splash=document.getElementById("splash");
const startScreen=document.getElementById("startScreen");
const game=document.getElementById("game");
const endScreen=document.getElementById("endScreen");
const targetImage=document.getElementById("targetImage");
const targetName=document.getElementById("targetName");
const question=document.getElementById("question");
const animalLine=document.getElementById("animalLine");
const answers=document.getElementById("answers");
const progress=document.getElementById("progress");
const scoreEl=document.getElementById("score");
const feedback=document.getElementById("feedback");
const confetti=document.getElementById("confetti");
const music=document.getElementById("music");

function shuffle(a){
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function startMusic(){
  music.volume=.16;
  const p=music.play();
  if(p)p.catch(()=>{});
}

function makeQuestions(){
  // Random question order; every position from 1st to 10th is used once.
  questions=shuffle([...animals]);
  index=0;
  score=0;
  scoreEl.textContent="⭐ 0";
}

function renderLine(target){
  animalLine.innerHTML="";
  animals.forEach(a=>{
    const box=document.createElement("div");
    box.className="lineAnimal";
    if(a.position===target.position) box.classList.add("targetPosition");
    box.innerHTML=`<img src="assets/${a.file}" alt="${a.name}"><span class="positionLabel">${a.position}${a.position===1?"st":a.position===2?"nd":a.position===3?"rd":"th"}</span>`;
    animalLine.appendChild(box);
  });
}

function render(){
  locked=false;
  const target=questions[index];

  targetImage.src="assets/"+target.file;
  targetImage.alt=target.name;
  targetName.textContent=target.name.toUpperCase();
  question.textContent=`Which position is the ${target.name}?`;

  renderLine(target);

  progress.textContent=`${index+1} / 10`;
  answers.innerHTML="";

  // Randomise the answer buttons while keeping all 10 choices.
  shuffle([...ordinals]).forEach((o)=>{
    const b=document.createElement("button");
    b.className="answer";
    b.type="button";
    b.textContent=o;
    const n=ordinals.indexOf(o)+1;
    b.addEventListener("click",()=>check(n,b));
    answers.appendChild(b);
  });

  setTimeout(()=>{
    speak(`Which position is the ${target.name}?`);
  },450);
}

function playCorrect(){
  feedback.textContent="🎉";
  feedback.className="feedback good";
  confetti.innerHTML="";
  for(let i=0;i<55;i++){
    const p=document.createElement("div");
    p.className="confettiPiece";
    p.style.left=Math.random()*100+"vw";
    p.style.animationDelay=Math.random()*.35+"s";
    p.style.background=["#ff6b6b","#ffd43b","#69db7c","#4dabf7","#cc5de8"][i%5];
    confetti.appendChild(p);
  }
  setTimeout(()=>{
    feedback.className="feedback hidden";
    confetti.innerHTML="";
  },1000);
}

function playWrong(){
  feedback.textContent="✕";
  feedback.className="feedback";
  setTimeout(()=>feedback.className="feedback hidden",850);
}

function check(n,button){
  if(locked)return;
  const target=questions[index];

  if(n===target.position){
    locked=true;
    button.classList.add("correct");
    score++;
    scoreEl.textContent="⭐ "+score;
    speak(`Correct! ${ordinalWords[n-1]}.`);
    playCorrect();

    setTimeout(()=>{
      index++;
      if(index>=10) finish();
      else render();
    },1050);
  }else{
    // Wrong answer: show red cross and stay on this question.
    button.classList.add("wrong");
    playWrong();
    speak(`Try again. Which position is the ${target.name}?`);
    setTimeout(()=>button.classList.remove("wrong"),700);
  }
}

function finish(){
  game.classList.add("hidden");
  endScreen.classList.remove("hidden");
  document.getElementById("finalScore").textContent=`You scored ${score} out of 10!`;
  speak(`Great job! You scored ${score} out of 10.`);
}

document.getElementById("startBtn").addEventListener("click",()=>{
  startScreen.classList.add("hidden");
  game.classList.remove("hidden");
  startMusic();
  makeQuestions();
  render();
});

document.getElementById("againBtn").addEventListener("click",()=>{
  endScreen.classList.add("hidden");
  game.classList.remove("hidden");
  startMusic();
  makeQuestions();
  render();
});

document.getElementById("hearBtn").addEventListener("click",()=>{
  const target=questions[index];
  speak(`Which position is the ${target.name}?`);
});

document.getElementById("targetAnimal").addEventListener("click",()=>{
  if(questions[index]) speak(questions[index].name);
});

// Logo remains visible for 5 seconds.
window.addEventListener("load",()=>{
  setTimeout(()=>{
    splash.style.display="none";
    startScreen.classList.remove("hidden");
  },5000);
});
