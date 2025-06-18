export default class TermHighlighter {
    constructor(mathDiv) {
        this.mathDiv = mathDiv;
        this.nodeArray = Array.from(mathDiv.querySelectorAll('*'));
        this.reset();

    }

    reset() {
        // Reset all colors
        this.nodeArray.forEach(node => {
            node.style.color = 'black';
        });
        return this;
    }

    highlightVariable(element, color) {

        this.nodeArray.forEach((node, idx) => {
            console.log(this.nodeArray[idx].textContent);
            if (node.textContent.length === 1) {
                if (node.textContent.includes(element)) {
                    node.style.color = color;



                    if (this.nodeArray[idx - 1].textContent === "·") {
                        let openParenthesisCount = 0;
                        for (let i = idx - 1; i >= 0; i--) {
                            this.nodeArray[i].style.color = color
                            if (this.nodeArray[i].textContent === ")") {
                                openParenthesisCount++;
                            }
                            if (openParenthesisCount !== 0) {
                                this.nodeArray[i].style.color = color
                            }
                            if (this.nodeArray[i].textContent === "(") {
                                openParenthesisCount--;
                            }
                            if (openParenthesisCount === 0) {

                                if (this.nodeArray[i].textContent === "−") {
                                    break;
                                }
                                if (this.nodeArray[i].textContent === "+") {
                                    break;
                                }
                            }

                        }
                    }





                    if (this.nodeArray[idx + 1].textContent === "·") {
                        let openParenthesisCount = 0;
                        for (let i = idx + 1; i < this.nodeArray.length; i++) {
                            if (openParenthesisCount === 0) {

                                if (this.nodeArray[i].textContent === "−") {
                                    break;
                                }
                                if (this.nodeArray[i].textContent === "+") {
                                    break;
                                }
                            }
                            this.nodeArray[i].style.color = color
                            if (this.nodeArray[i].textContent === "(") {
                                openParenthesisCount++;
                            }
                            if (openParenthesisCount !== 0) {
                                this.nodeArray[i].style.color = color
                            }
                            if (this.nodeArray[i].textContent === ")") {
                                openParenthesisCount--;
                            }

                        }
                    }

                    if (this.nodeArray[idx - 1].textContent === "−") {
                        this.nodeArray[idx - 1].style.color = color;
                    }
                    if (this.nodeArray[idx - 1].textContent === "+") {
                        this.nodeArray[idx - 1].style.color = color;
                    }


                }
            }

        });

    }

}