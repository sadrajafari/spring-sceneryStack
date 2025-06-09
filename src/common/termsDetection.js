export default class TermHighlighter {
    constructor(mathDiv) {
        this.mathDiv = mathDiv;
        this.nodeArray = Array.from(mathDiv.querySelectorAll('*'));

    }

    highlightVariable(v, color) {
        this.nodeArray.map(node => {
            node.style.color = ` black `;

        });
        this.nodeArray.forEach((node, idx) => {
            if (node.textContent.includes(v)) {
                node.style.color = ` ${color} `;
                let prevText = this.nodeArray[idx - 1]?.textContent || '';
                let nextText = this.nodeArray[idx + 1]?.textContent || '';


                // Check next sibling nodes for + or -
                // Handle backwards (coefficients and signs)
                let prevIdx = idx - 1;
                while (prevIdx >= 0) {
                    if (this.nodeArray[prevIdx].textContent === "+" || this.nodeArray[prevIdx].textContent === "−") {
                        this.nodeArray[prevIdx].style.color = ` ${color} `;
                        break; // Stop at next operator, don't color it
                    }
                    
                    this.nodeArray[prevIdx].style.color = ` ${color} `;
                    prevIdx--;
                }

                // // Handle forwards (powers, etc.) - ADD THIS
                // let nextIdx = idx + 1;
                // let openParenCount = 0;
                // while (nextIdx < this.nodeArray.length) {

                //     if (this.nodeArray[nextIdx].textContent === "(") {
                //         openParenCount++;
                //     }
                //     if (this.nodeArray[nextIdx].textContent === ")") {
                //         openParenCount--;
                //     }
                //     if (openParenCount === 0) {
                //         if (this.nodeArray[nextIdx].textContent === "+" || this.nodeArray[nextIdx].textContent === "−") {
                //             break; // Stop at next operator, don't color it
                //         }
                //     }
                //     this.nodeArray[nextIdx].style.color = ` ${color} `;
                //     nextIdx++;
                // }

            }
        });

    }

}