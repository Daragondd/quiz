(function () {
    const Test = {
        quiz: null,
        currentQuestionIndex: 1,
        questionTitleElement: null,
        progressBar: null,
        optionsElement: null,
        answerString: '',
        userResult: [],
        init() {
            checkUserData();
            const url = new URL(location.href);
            const testId = url.searchParams.get("id");
            if (testId) {
                const xhr = new XMLHttpRequest();
                xhr.open("GET", "https://testologia.ru/get-quiz?id=" + testId, false);
                xhr.send();
                if (xhr.status === 200 && xhr.responseText) {
                    try {
                        this.quiz = JSON.parse(xhr.responseText);
                    } catch (e) {
                        location.href = "index.html";
                    }
                    this.startQuiz();
                } else {
                    location.href = "index.html";
                }
            } else {
                location.href = "index.html";
            }
        },
        startQuiz() {
            document.getElementById("pre_title").innerText = this.quiz.name;
            this.questionTitleElement = document.getElementById("test_title");
            this.optionsElement = document.getElementById("test_question_options");
            this.nextButtonElement = document.getElementById("next");
            this.previousButtionElement = document.getElementById("previous");
            this.passButtonElement = document.getElementById("pass");
            this.nextButtonElement.onclick = this.move.bind(this, "next");
            this.passButtonElement.onclick = this.move.bind(this, "pass");
            this.previousButtionElement.onclick = this.move.bind(this, "previous");
            this.prepareProgressBar();
            this.showQuestion();

            const timerElement = document.getElementById("timer");
            let seconds = 59;

            const interval = setInterval(function () {
                seconds--;
                timerElement.innerText = seconds;
                if (seconds === 0) {
                    clearInterval(interval);
                    this.finishTest();
                }
            }.bind(this), 1000)
        },
        prepareProgressBar() {
            this.progressBar = document.getElementById("progress_bar");
            for (let i = 0; i < this.quiz.questions.length; i++) {
                const itemElement = document.createElement("div");
                itemElement.className = "progress_bar_item" + (i === 0 ? " active" : "");
                const itemCircle = document.createElement("div");
                itemCircle.className = "progress_bar_item_circle";
                const itemText = document.createElement("div");
                itemText.className = "progress_bar_item_text";
                itemText.innerText = "Вопрос " + (i + 1);
                itemElement.appendChild(itemCircle);
                itemElement.appendChild(itemText);
                this.progressBar.appendChild(itemElement);
            }
        },
        showQuestion() {
            const that = this;
            const activeQuestion = this.quiz.questions[this.currentQuestionIndex - 1];
            const chosenOption = this.userResult.find(item => item.questionId === activeQuestion.id);
            this.questionTitleElement.innerHTML = "<span>Вопрос " + this.currentQuestionIndex +
                ": </span>" + activeQuestion.question;
            this.optionsElement.innerHTML = "";
            activeQuestion.answers.forEach((answer) => {
                const inputId = "answer-" + answer.id
                const optionElement = document.createElement("div");
                optionElement.className = "test_question_option";
                const inputElement = document.createElement("input");
                inputElement.setAttribute("id", inputId);
                inputElement.setAttribute("type", "radio");
                inputElement.setAttribute("name", "answer");
                inputElement.setAttribute("value", answer.id);
                inputElement.className = "option_answers";
                if (chosenOption && chosenOption.chosenAnswerId === answer.id) {
                    inputElement.setAttribute("checked", "checked");
                }
                const labelElement = document.createElement("label");
                labelElement.setAttribute("for", inputId);
                labelElement.innerText = answer.answer;
                optionElement.appendChild(inputElement);
                optionElement.appendChild(labelElement);
                this.optionsElement.appendChild(optionElement);

                inputElement.onchange = function () {
                    that.chooseAnswer();
                };
            })
            if (chosenOption && chosenOption.chosenAnswerId) {
                this.nextButtonElement.removeAttribute("disabled", "disabled");
            } else {
                this.nextButtonElement.setAttribute("disabled", "disabled");
            }

            if (this.currentQuestionIndex === this.quiz.questions.length) {
                this.nextButtonElement.innerText = "Завершить"
            } else {
                this.nextButtonElement.innerText = "Вперед"
            }
            if (this.currentQuestionIndex > 1) {
                this.previousButtionElement.removeAttribute("disabled");
            } else {
                this.previousButtionElement.setAttribute("disabled", "disabled");
            }

        },
        chooseAnswer() {
            this.nextButtonElement.removeAttribute("disabled");
        },
        move(action) {
            this.progressBar = document.getElementById("progress_bar");
            const activeQuestion = this.quiz.questions[this.currentQuestionIndex - 1];
            const chosenAnswer = Array.from(document.getElementsByClassName("option_answers")).find(element => {
                return element.checked;
            });
            let chosenAnswerId = null;
            if (chosenAnswer && chosenAnswer.value) {
                chosenAnswerId = Number(chosenAnswer.value);
            }
            const existingResult = this.userResult.find(item => {
                return item.questionId === activeQuestion.id
            })
            if (existingResult) {
                existingResult.chosenAnswerId = chosenAnswerId;
            } else {
                this.userResult.push({
                    questionId: activeQuestion.id,
                    chosenAnswerId: chosenAnswerId
                });
            }
            this.answerString = this.answerString + String(chosenAnswerId) + ","
            if (action === "next" || action === "pass") {
                this.currentQuestionIndex += 1;
            } else {
                this.currentQuestionIndex -= 1;
            }
            if (this.currentQuestionIndex > this.quiz.questions.length) {
                this.finishTest();
                return;
            }
            Array.from(this.progressBar.children).forEach((item, index) => {
                const currentItemIndex = index + 1;
                item.classList.remove("complete");
                item.classList.remove("active");
                if (index === this.currentQuestionIndex - 1) {
                    item.classList.add("active");
                } else if (currentItemIndex < this.currentQuestionIndex) {
                    item.classList.add("complete");
                }
            })
            this.showQuestion();
        },
        finishTest() {
            const url = new URL(location.href);
            const testId = url.searchParams.get("id");
            const testName = url.searchParams.get("name");
            const testLastName = url.searchParams.get("lastName");
            const testEmail = url.searchParams.get("email");
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "https://testologia.ru/pass-quiz?id=" + testId, false);
            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            xhr.send(JSON.stringify({
                name: testName,
                lastName: testLastName,
                email: testEmail,
                results: this.userResult
            }))
            if (xhr.status === 200 && xhr.responseText) {
                let result = null;
                try {
                    result = JSON.parse(xhr.responseText);
                } catch (e) {
                    location.href = "index.html";
                }
                if (result) {

                    location.href = "finish.html?score="+result.score+"&total="+result.total+"&results="+this.answerString+"&id="+testId;
                }
            } else {
                location.href = "index.html";
            }
        }
    }

    Test.init();
})();