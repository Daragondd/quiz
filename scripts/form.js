(function () {
    const Form = {
        agreeElement: null,
        processElement: null,
        fields: [
            {
                name: "name",
                id: "name",
                element: null,
                regex: /^[А-Я][а-я]+\s*$/,
                valid: false,
            },
            {
                name: "lastName",
                id: "surname",
                element: null,
                regex: /^[А-Я][а-я]+\s*$/,
                valid: false,
            },
            {
                name: "email",
                id: "email",
                element: null,
                regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                valid: false,
            },
        ],
        init() {
            const that = this;
            this.fields.forEach((field) => {
                field.element = document.getElementById(field.id);
                field.element.onchange = function () {
                    that.validateField.call(that, field, this);
                }
            });
            this.agreeElement = document.getElementById("agree")
            this.agreeElement.onchange = function () {
                that.validateForm();
            }
            this.processElement= document.getElementById("process")
            this.processElement.onclick = function () {
                that.processForm()
            }
        },
        validateField(field, element) {
            if (!element.value || !element.value.match(field.regex)) {
                element.parentNode.style.borderColor = "red";
                field.valid = false;

            } else {
                element.parentNode.removeAttribute("style");
                field.valid = true;
            }
            this.validateForm()
        },
        validateForm() {
            const validForm= this.fields.every(field => field.valid);
            const isValid = validForm && this.agreeElement.checked
            if (isValid) {
                this.processElement.removeAttribute("disabled");
            } else {
                this.processElement.setAttribute("disabled", "disabled");
            }
            return isValid;
        },
        processForm() {
            if (this.validateForm()) {
                let paramString = "";
                this.fields.forEach(item => {
                    paramString += (!paramString ? "?" : "&") + item.name + "=" + item.element.value;
                });
                location.href="choice.html"+paramString;
            }
        }
    };
    Form.init();
})();