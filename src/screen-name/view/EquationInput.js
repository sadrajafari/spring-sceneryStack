import { DOM } from 'scenerystack/scenery';
import TermHighlighter from '../../common/termsDetection.js';



export default class EquationInput extends DOM {




  constructor(item, id, parentDomElement, property, model, options = {}) {
    const mathDiv = item;
    mathDiv.id = id; // Set an ID for the MathQuill div
    mathDiv.className = 'math-field';
    parentDomElement.appendChild(mathDiv);

    mathDiv.style.backgroundColor = 'white'; // Set background color if provided
    mathDiv.style.width = '15rem'; // Set width if provided
    mathDiv.style.height = '3rem'; // Set height if provided
    mathDiv.style.fontSize = '1rem'; // Set font size if provided
    // Wrap the MathQuill div in a Scenery DOM node
    super(mathDiv, { allowInput: true });

    this.model = model;
    this.property = property;
    this.mathDiv = mathDiv;
    // Function to update the MathQuill field value programmatically











    const MQ = window.MathQuill.getInterface(2);
    // Set width if provided
    const mathField = MQ.MathField(mathDiv, {
      spaceBehavesLikeTab: true,
      handlers: {

        edit: () => {
          const latex = mathField.latex().trim();
          let hasError = false;
          let errorMsg = '';
          mathDiv.style.backgroundColor = 'white';
          // console.log('Raw MathQuill value:', latex);

          // new TermHighlighter(this.mathDiv)
          //   // .highlightVariable("v", "green")
          //   .highlightVariable("x", "red");

          // Define variable substitutions
          const variableMap = {

            '\\omega_0': model.initialOmega,
            // '\\gamma': model.gamma,
            '\\beta': model.beta,
            'f': model.f,
            '\\omega': model.omega,
            "\\pi": Math.PI,
            // "e": Math.E,
            // "\\e": Math.E,
          };

          // Sort longer keys first to avoid premature replacements
          const sortedKeys = Object.keys(variableMap).sort((a, b) => b.length - a.length);

          let parsedLatex = latex;
          for (const key of sortedKeys) {
            const value = variableMap[key];
            // Escape backslashes
            const escapedKey = key.replace(/\\/g, '\\\\');
            // Match only exact expressions (not part of another command)
            const regex = new RegExp(escapedKey + '(?![a-zA-Z_0-9])', 'g');
            parsedLatex = parsedLatex.replace(regex, value.toString());
          }





          if (property && property.value !== undefined) {
            property.value = parsedLatex;
            // console.log('EquationInput updated:', parsedLatex);
          }
        }
      },
    });

    // Blur the MathQuill field when clicking outside of it


    this.disable = () => {
      mathField.blur();
    }

    window.addEventListener('pointerdown', (event) => {
      window.itemSelected = event.target;
      if (event.target.id !== mathDiv.id) {
        this.disable()
      }

    })




    if (options.initialText) {
      mathField.latex(options.initialText._initialValue);
    }

    // Set position if provided
    if (options.left !== undefined) {
      this.left = options.left;
    }
    if (options.top !== undefined) {
      this.top = options.top;
    }

    // Store the MathField instance for future use
    this.mathField = mathField;


  }
  updateText(newLatex) {
    if (this.mathField) {
      // Set the raw LaTeX for display only
      this.mathField.latex(newLatex);
      // Do NOT set this.property.value here!
    }
  }
  updatePropertyFromField() {
    const latex = this.mathField.latex().trim();
    const variableMap = {
      '\\omega_0': this.model.initialOmega,
      // '\\gamma': this.model.gamma,
      '\\beta': this.model.beta,
      'f': this.model.f,
      '\\omega': this.model.omega,
      "\\pi": Math.PI
    };
    const sortedKeys = Object.keys(variableMap).sort((a, b) => b.length - a.length);
    let parsedLatex = latex;
    for (const key of sortedKeys) {
      const value = variableMap[key];
      const escapedKey = key.replace(/\\/g, '\\\\');
      const regex = new RegExp(escapedKey + '(?![a-zA-Z_0-9])', 'g');
      parsedLatex = parsedLatex.replace(regex, value.toString());

    }
    if (this.property && this.property.value !== undefined) {
      this.property.value = parsedLatex;
      // console.log('EquationInput updated:', parsedLatex);
    }
  }

}


