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
let questions=[],index=0,score=0,locked=false;

const splash=document.getElementById("splash");
const startScreen=document.getElementById("startScreen");
const game=document.getElementById("game");
const endScreen=document.getElementById("endScreen");
const animalImage=document.getElementById("animalImage");
const animalName=document.getElementById("animalName");
const question=document.getElementById("question");
const answers=document.getElementById("answers");
const progress=document.getElementById("progress");
const scoreEl=document.getElementById("score");
const feedback=document.getElementById("feedback");
const confetti=document.getElementById("confetti");
const music=document.getElementById("music");

function shuffle(a){
 for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
 return a;
}
function ordinalWord(n){
 const words=["first","second","third","fourth","fifth","sixth","seventh","eighth","ninth","tenth"];
 return words[n-1];
}
function startMusic(){
 music.volume=.16;
 const p=music.play();
 if(p)p.catch(()=>{});
}
function makeQuestions(){
 questions=shuffle([...animals]);
 index=0;score=0;scoreEl.textContent="⭐ 0";
}
function render(){
 locked=false;
 const a=questions[index];
 animalImage.src="assets/"+a.file;
 animalImage.alt=a.name;
 animalName.textContent=a.name.toUpperCase();
 question.textContent=`Which position is the ${a.name}?`;
 progress.textContent=`${index+1} / 10`;
 answers.innerHTML="";
 ordinals.forEach((o,i)=>{
   const b=document.createElement("button");
   b.className="answer";
   b.type="button";
   b.textContent=o;
   b.addEventListener("click",()=>check(i+1,b));
   answers.appendChild(b);
 });
 setTimeout(()=>speak(`Which position is the ${a.name}? Tap ${a.name} to hear the word again. Then tap the correct ordinal number.`),250);
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
   p.style.transform=`rotate(${Math.random()*360}deg)`;
   p.style.background=["#ff6b6b","#ffd43b","#69db7c","#4dabf7","#cc5de8"][i%5];
   confetti.appendChild(p);
 }
 setTimeout(()=>{feedback.className="feedback hidden";confetti.innerHTML=""},1000);
}
function playWrong(){
 feedback.textContent="✕";
 feedback.className="feedback bad";
 setTimeout(()=>feedback.className="feedback hidden",850);
}
function check(n,button){
 if(locked)return;
 const correct=questions[index].position;
 if(n===correct){
   locked=true;
   button.classList.add("correct");
   score++;
   scoreEl.textContent="⭐ "+score;
   speak(`Correct! ${ordinalWord(n)}.`);
   playCorrect();
   setTimeout(()=>{
     index++;
     if(index>=10) finish();
     else render();
   },1050);
 }else{
   button.classList.add("wrong");
   playWrong();
   speak(`Try again. Which position is the ${questions[index].name}?`);
   setTimeout(()=>button.classList.remove("wrong"),700);
   // Important: wrong answer never moves to the next question.
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
 speak("Look at the animal. Tap it to hear the word. Then tap its correct position. If your answer is wrong, try again.");
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
document.getElementById("animalCard").addEventListener("click",()=>{
 const a=questions[index];
 speak(a.name);
});
document.getElementById("hearBtn").addEventListener("click",()=>{
 const a=questions[index];
 speak(`Which position is the ${a.name}? Tap the ${ordinalWord(a.position)}.`);
});

// Keep the splash short so the game opens quickly.
window.addEventListener("load",()=>{
 setTimeout(()=>{
   splash.style.display="none";
   startScreen.classList.remove("hidden");
 },5000);
});
