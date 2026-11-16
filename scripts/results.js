(function () {
    const Results = {
        userAnswers: [],
        questionsElement: null,
        quiz: null,
        answers: null,
        init() {
            const url = new URL(location.href);
            const testId = url.searchParams.get("id");
            const results = url.searchParams.get("results");
            const score = url.searchParams.get("score")
            const total = url.searchParams.get("total");
            console.log(results);
            this.userAnswers = results.split(",");
            if (testId) {
                const xhr = new XMLHttpRequest();
                xhr.open("GET", "https://testologia.ru/get-quiz-right?id=" + testId, false);
                xhr.send();
                if (xhr.status === 200 && xhr.responseText) {
                    try {
                        this.answers = JSON.parse(xhr.responseText);
                        console.log(this.answers);
                    } catch (e) {
                        location.href = "index.html";
                    }
                } else {
                    location.href = "index.html";
                }
                xhr.open("GET", "https://testologia.ru/get-quiz?id=" + testId, false);
                xhr.send();
                if (xhr.status === 200 && xhr.responseText) {
                    try {
                        this.quiz = JSON.parse(xhr.responseText);
                    } catch (e) {
                        location.href = "index.html";
                    }
                    this.showTest();
                } else {
                    location.href = "index.html";
                }
            } else {
                location.href = "index.html";
            }
            document.getElementById("return").onclick = function () {
                location.href = "finish.html?id="+testId+"&results="+results+"&score="+score+"&total="+total;
            }
        },
        showTest() {
            document.getElementById("pre_title").innerText = this.quiz.name;
            this.questionsElement = document.getElementById("results_items");
            console.log(this.quiz)
            let number = 0;
            this.quiz.questions.forEach(question => {
                const questionElement = document.createElement("div");
                questionElement.classList.add("question");
                const questionTitleElement = document.createElement("h2");
                questionTitleElement.classList.add("test_title");
                questionTitleElement.innerHTML = "<span>Вопрос " + String(number+1) +
                    ": </span>" + question.question
                questionElement.appendChild(questionTitleElement);
                const optionsElement = document.createElement("div");
                optionsElement.className = "test_question_options";
                question.answers.forEach((answer) => {
                    const inputId = "answer-" + answer.id
                    const optionElement = document.createElement("div");
                    optionElement.className = "test_question_option";
                    const inputElement = document.createElement("input");
                    inputElement.setAttribute("id", inputId);
                    inputElement.setAttribute("type", "radio");
                    inputElement.setAttribute("name", "answer");
                    inputElement.setAttribute("value", answer.id);
                    inputElement.className = "option_answers";
                    const labelElement = document.createElement("label");
                    labelElement.setAttribute("for", inputId);
                    labelElement.innerText = answer.answer;
                    optionElement.appendChild(inputElement);
                    optionElement.appendChild(labelElement);
                    optionsElement.appendChild(optionElement);
                    this.checkAnswers(optionElement,answer.id, number)
                })
                questionElement.appendChild(optionsElement);
                this.questionsElement.appendChild(questionElement);
                number++;
            })
        },
        checkAnswers(element, answer_id, number) {

            if (answer_id === Number(this.userAnswers[number]) && answer_id === this.answers[number]) {
                element.classList.add("correct");
            } else if (answer_id === Number(this.userAnswers[number]) && answer_id !== this.answers[number]) {
                element.classList.add("wrong");
            }
        }
    }
    Results.init()
})()