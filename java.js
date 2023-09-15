//create variable
let countSpan = document.querySelector(".count span");

let bulletsSpanContainer = document.querySelector(".bulltes .spans")

let quizArea = document.querySelector(".quiz-area")

let answerArea = document.querySelector(".answer-area")

let submitBtn = document.querySelector(".submit")

let bullets=document.querySelector(".bulltes")
let resultsContainer=document.querySelector(".results")

let countdwon=document.querySelector(".countdwon")

//SET OPTIONS
let rightAnswer=0
let currentIndx = 0
let countDownInterval;

//get fill json
function getQuestions() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionsJson = JSON.parse(this.responseText);

            let questionsCount = questionsJson.length;


            //create bullets +set count question
            createBullets(questionsCount)

            //add  question date 
            addQuestionsDate(questionsJson[currentIndx], questionsCount)

            //start countdown before  click
            countdown(5 ,questionsCount);
            
            //click on submit button
            submitBtn.onclick = function () {
                let theRightAnswer=questionsJson[currentIndx].right_answer

                currentIndx ++

              checkAnswer(theRightAnswer ,questionsCount)

              //remove previous question
              quizArea.innerHTML=""
              answerArea.innerHTML=""

               //add next question date 
            addQuestionsDate(questionsJson[currentIndx], questionsCount)

            //handle bullets span
            handleBullets();

            //start countdown after  click
            clearInterval(countDownInterval)
            countdown(5 ,questionsCount);

            //show results
            showResult(questionsCount)

            }

        }
    };

    myRequest.open("GET", "html_questions.json", true);
    myRequest.send();
}
getQuestions();



//create function bullets

function createBullets(num) {
    countSpan.innerHTML = num

    //create span
    for (let i = 0; i < num; i++) {
        //create bulltes
        let bulletsSpan = document.createElement("span")
        let text = document.createTextNode(i + 1)
        bulletsSpan.appendChild(text)

        if (i === 0) {
            bulletsSpan.className = "on"
        }
        bulletsSpanContainer.appendChild(bulletsSpan)
    }
}


//function add date questions
function addQuestionsDate(obj, count) {
    if(currentIndx < count){
        let questionTitle = document.createElement("h2")

    let questionText = document.createTextNode(obj.title)

    questionTitle.appendChild(questionText)
    quizArea.appendChild(questionTitle)

    for (let i = 1; i <= 4; i++) {
        let mainDiv = document.createElement("div")
        mainDiv.className = "answer"
        answerArea.appendChild(mainDiv)

        let radioInput = document.createElement("input")
        radioInput.name = "question"
        radioInput.id = `answer_${i}`
        radioInput.type = "radio"
        radioInput.dataset.answer = obj[`answer_${i}`]
        mainDiv.appendChild(radioInput)

        if (i === 1) {
            radioInput.checked = true
        }

        let labelAnswers = document.createElement("label")
        labelAnswers.htmlFor = `answer_${i}`
        let textLabel = document.createTextNode(obj[`answer_${i}`])
        labelAnswers.appendChild(textLabel)
        mainDiv.appendChild(labelAnswers)

    }
    }

}

//function check answer
function checkAnswer(rAnswer, count) {
    let answerAll = document.getElementsByName("question")
    let chooseAnswer;

    for (let i = 0; i < answerAll.length; i++) {

        if (answerAll[i].checked) {
            chooseAnswer=answerAll[i].dataset.answer
        }
    }
   
    if(rAnswer ===chooseAnswer){
        rightAnswer++;
       
    }

}

//function handle bullets
function handleBullets(){
    let bulletsSpan=document.querySelectorAll(".bulltes .spans span")
    let arraySpans=Array.from(bulletsSpan)
    arraySpans.forEach((span ,index)=>{
        if(currentIndx ===index){
          span.className="on"
        }
    })
}

//function show result
function showResult(count){
    let theResults;
    if(currentIndx === count){
       quizArea.remove();
       answerArea.remove();
       submitBtn.remove();
       bullets.remove();
       if(rightAnswer > count/2 && rightAnswer < count){
        theResults =`<span class="good"> Good, </span>${rightAnswer} from ${count} ,This Is Good`
       }else if(rightAnswer===count){
        theResults =`<span class="prefect"> prefect, </span>,  All Answer is Good`
       }
       else{
        theResults =`<span class="pad"> Bad,</span> ${rightAnswer} from ${count} ,This Is Bad `
       }

       resultsContainer.innerHTML=theResults;
       resultsContainer.style.background="white"
       resultsContainer.style.padding="10px"
       resultsContainer.style.marginTop="10px"
    }
}

//function countdown
function countdown(duration , count){
    if(currentIndx < count){
      let minutes , second
       countDownInterval =setInterval( function(){
        minutes=parseInt(duration /60);
        second=parseInt(duration % 60)

        minutes= minutes < 10 ? `0 ${minutes}`: minutes 
        second= second < 10 ? `0 ${second}`: second 
        countdwon.innerHTML=`${minutes}:${second}`;

        if( --duration < 0){
            clearInterval(countDownInterval)
            submitBtn.click();
        }

       }, 1000);
    }

}