const dom = {
    title: document.getElementById('title'),
    totalQuestions: document.getElementById('total-questions'),
    question: document.getElementById('question'),
    sentense: document.getElementById('message'),
    progress: {
        progressFill: document.getElementById('progress-fill'),
        questionNumber: document.getElementById('question-number'),
        totalQuestions: document.getElementById('total-questions'),
    },
    questionWrap: document.getElementById('question-wrap'),
    step: {
        question: document.getElementById('question'),
        questionPosition: document.getElementById('question-position'),
    },
    answers: document.getElementById('answers'),
    next: document.getElementById('next'),
    result: {
        resultBlock: document.getElementById('result'),
        validAnswers: document.getElementById('valid-answers'),
        questionsCount: document.getElementById('result__total-questions'),
    },
    timer: document.getElementById('timer'),
    timeOf: document.getElementById('time__off'),
    playAgain: document.querySelector('.again'),
    audio: document.querySelector("#music-fon"),
    finishAudio: document.getElementById('finishAudio'),
    nota: document.querySelector("#melodia"),
    dogFirst: document.querySelector('.dog'),
    dogSecond: document.querySelector('.dog-close'),
    bonusPlus: document.querySelector('.bonus__plus')


}

let step = 0;
let counter = 60;

const firstBlockAnswers = (step) => {
    dom.question.textContent = data.questions[step].question;
    const answers = data.questions[step].answers;
    return dom.answers.innerHTML = buildAnswers(answers);
};
firstBlockAnswers(step);



dom.title.textContent = data.title;
dom.totalQuestions.textContent = data.questions.length;

let validAnswersCount = 0;
let totalSteps = data.questions.length;



//Клик по кнопке - следующий вопрос.
dom.next.onclick = () => {
    step = step < totalSteps ? step + 1 : step;
    renderQuiz(totalSteps, step);
    dom.answers.classList.remove('quiz__answers-disable');
    const audio = new Audio('./music/next.mp3');
    audio.play();
}

//Клик по музыкальной фоновой-кнопке.
dom.nota.onclick = () => {
    const audio = dom.audio;
    const audioChange = document.querySelector('.on-pica');
    audioChange.className === 'on-pica' ? audioChange.classList.add('off-pica') && audioChange.classList.remove('on-pica') :
        audioChange.classList.remove('off-pica') && audioChange.classList.add('on-pica');

    return audio.paused ? audio.play() : audio.pause();
}

//Функция отрисовки всего опроса
function renderQuiz(total, step) {
    renderProgress(total, step);
    if (total === step + 1) {
        changeButtonOnResult()
    }
    if (step < total) {
        const answers = data.questions[step].answers;
        const answersHtml = buildAnswers(answers);
        renderQuestion(step);
        renderAnswers(answersHtml);
        isDisableButton(true);
    } else if (step === total) {
        renderResults();
        clearInterval(intervalId);
    }
};


//Отрисовка данных прогресс бара.
function renderProgress(total, step) {
    const progressPercent = 100 / total * step;
    dom.progress.questionNumber.innerHTML = step;
    dom.progress.totalQuestions.innerHTML = total;
    dom.progress.progressFill.style.width = `${progressPercent}%`;
}



//Отрисовка вопроса
function renderQuestion(step) {
    dom.step.questionPosition.innerHTML = `${step + 1}`
    dom.step.question.innerHTML = data.questions[step].question;
};



// Функция создания HTML кода для ответа

function buildAnswers(answers) {
    const answersHtml = [];
    answers.forEach((answer, idx) => {
        const html = `<div class="quiz__answer" data-id="${idx}">${answer}</div>`;

        answersHtml.push(html);
    });
    answersHtml.sort(() => Math.random() - 0.5);
    return answersHtml.join('');
}



// Отрисовка ответов

function renderAnswers(htmlString) {
    dom.answers.innerHTML = htmlString;
}

// Отслеживание клика на ответе

dom.answers.onclick = (event) => {
    const target = event.target;

    if (target.classList.contains('quiz__answer')) {
        const answerNumber = target.dataset.id;
        const isValid = checkAnswer(step, answerNumber)
        const answerClass = isValid ? 'quiz__answer-valid' : 'quiz__answer-invalid';
        target.classList.add(answerClass);
        isDisableButton(false);
        isDisableAnswers(true);
        validAnswersCount = isValid ? validAnswersCount + 1 : validAnswersCount;
        if (answerClass === 'quiz__answer-valid') {
            const audio = new Audio('./music/gun.mp3');
            audio.play();
            counter += 5;
            // bonusPlus.classList.add = 'bonus__plus-able'

        } else if (answerClass === 'quiz__answer-invalid') {
            const audio = new Audio('./music/ricohet.mp3');
            audio.play();
            dogSmile()
            counter -= 2;
            // bonusPlus.classList.remove = 'bonus__plus-able'
        }

    }
};

// Смех собаки
function dogSmile() {
    if (totalSteps - 1 > step) {
        setTimeout(() => {
            setTimeout(() => {
                dom.dogSecond.style.display = 'block';
                const audio = new Audio('./music/smex-dog.mp3');
                audio.play();
            }, 500);
            setTimeout(() => dom.dogSecond.style.top = 'calc(100%/2)', 2000);
            setTimeout(() => dom.dogSecond.style.display = 'none', 2200);
            setTimeout(() => dom.dogSecond.style.top = 'calc(100%/7)', 2200);
        }, 1000);

    }
}

// Проверка верности ответа

function checkAnswer(step, answer) {
    const validAnswerId = data.questions[step].validAnswer;
    return validAnswerId === ++answer;
};



// Block answers
function isDisableAnswers(isDisable) {
    if (isDisable) {
        dom.answers.classList.add('quiz__answers-disable');
    }
};


// Block button
function isDisableButton(isDisable) {
    if (isDisable) {
        dom.next.classList.add('quiz__btn-disable');
    } else {
        dom.next.classList.remove('quiz__btn-disable');
    }
};

// Смена надписи на кнопке
function changeButtonOnResult() {
    dom.next.innerText = 'Посмотреть результат';
    dom.next.dataset.result = 'result';
};

// Показать результат опроса
function renderResults() {
    dom.answers.style.display = 'none';
    dom.next.style.display = 'none';
    dom.questionWrap.style.display = 'none';
    dom.result.resultBlock.style.display = 'block';
    dom.result.validAnswers.innerHTML = validAnswersCount;
    dom.result.questionsCount.innerHTML = totalSteps;
    const validAnswersCountPercent = (validAnswersCount / totalSteps) * 100;
    dom.audio.pause();
    dom.finishAudio.pause()
    const audio = new Audio('./music/zvuk-saljuta.mp3');
    audio.play();
    setTimeout(() => dom.timer.style.display = 'none', 2000);
    setTimeout(() => dom.playAgain.style.display = 'block', 2500);
    if (validAnswersCountPercent === 0) {
        dom.sentense.textContent = 'Очень плохой результат. Мало того, что ты ничего не смыслишь в этой теме, так ты ещё и неудачник, из вопросов не угадать ни одного это надо быть крупным придурком и неудачником одновременно! Жесть... ну ты тупень, лучше открой окно и сделай шаг на встречу другой жизни! Шучу-шучу, это же юмор, понимать надо. Есть разные профессии в жизни, например, подниматель пингвинов! Подумай об этом))) ';
    } else if (validAnswersCountPercent < 50) {
        dom.sentense.textContent = 'Твой результат ниже 50% правильных ответов это неплохой результат, но ты можешь намного лучше. Хотя это неточно, может быть ты тупо наклацал и угадал эти ответы, Бог тебе судья, если так, то ты просто везучий хрен и ничего больше, если же нет, то возвращаюсь к тому с чего начал, это неплохой результат. Возможно, тебе что-то и светит в этой работе, если продолжишь работать, сможешь носить кофе программистам.';
    } else if (validAnswersCountPercent >= 50 && validAnswersCountPercent < 75) {
        dom.sentense.textContent = 'Твердая такая оценка, говорящая что ты что-то знаешь, но знаешь это хреновато. Но в целом, если не брать в расчёт какие-то расчёты, ты неплохо справился. Если бы это был зачёт, то ты бы его сдал авансом, но всё-таки, сдал бы... Но если ты бы сдавал экзамени и шел на стипендию, ты бы точно стрелял сиграеты в следующем месяце, потому что в лучшем случае, ты можешь претендовать на тройку. В любом случае, тройка это удовлетворительно. В наше время удоволетоврять это уже достижение, так что радуйся и можешь продолжать в том же духе. Салфетки и крем ты знаешь где, подружка правая всегда готова, вперёд.';
    } else if (validAnswersCountPercent >= 75 && validAnswersCountPercent != 100) {
        dom.sentense.textContent = 'Очень хороший результат. Нет, правда. Больше 75% правильных ответов это реально круто. Твоя мамка может гордиться тобой, ты незаконченный кретин, а лишь начинающий, продолжай в том же духе и можешь претендовать на ложе в партере. Возможно, тебя даже ангажируют забугром, но не радуйся сразу таким предложениям, учти, там очень много заднеприводных, а твоя усидчивая жопка может приглянуться какому-нибудь иностранному извращенцу, готов ли ты рискнуть патриотизмом и сыграть на свою жопу? ';
    } else dom.sentense.textContent = 'Невероятный результат! Даже я, когда писал тест, не всегда мог дать все правильные ответы. Ты просто, сука, читер какой-то, как тебе это удалось? Колись? Колись, мать твою... Иди сюда, ты собака сутулая, где твоя шпаргалка? Покажи мне, пока я тебе не трахнул или я сам её найду и запихаю тебе по самые помидоры, ты тварь, собака, а ну иди сюда гавна кусок я тебя сейчас сам трахну. А если не цитировать друга нашего Тарантино, ты очень хорош, парень, очень хорош.';

}

dom.timer.textContent = '60';
const intervalId = setInterval(() => {

    counter -= 1;

    if (counter < 45) {
        dom.timer.style.color = 'rgb(251, 255, 0)';
        dom.timer.style.fontSize = '17px';
        dom.timer.style.fontWeight = '900'
    }
    if (counter < 30) {
        dom.timer.style.color = 'rgb(255, 1, 1)';
        dom.timer.style.fontSize = '18px';
        dom.timer.style.fontWeight = '900'
    }

    if (counter <= 29) {
        dom.audio.pause();
        dom.finishAudio.play()
    }

    if (counter >= 30) {
        dom.finishAudio.pause()
    }
    if (counter === 1) {
        dom.audio.pause();
        dom.finishAudio.pause()
        const audio = new Audio('./music/mario-smert.mp3');
        audio.play();
    }
    if (counter <= 0) {
        clearInterval(intervalId);
        renderResults();
        dom.timer.style.display = 'none';
        dom.timeOf.style.display = 'block'
        setTimeout(() => dom.timeOf.style.display = 'none', 2000);
        setTimeout(() => dom.playAgain.style.display = 'block', 2500);
    }
    dom.timer.textContent = counter;

}, 1000);