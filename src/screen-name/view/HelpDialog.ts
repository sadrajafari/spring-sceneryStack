

import { RichText, Tandem, TextPushButton, Text } from "scenerystack";
import { VBox, Rectangle, Color, HBox, Font } from "scenerystack/scenery";
import { Dialog } from "scenerystack/sim";

const MAX_WIDTH = 400;

export default class HelpDialog extends Dialog {
  public constructor(
    tandem: Tandem,
    onFillEquations?: (equations: { v: string; x: string }) => void,
  ) {
    const titleText = new Text("Guide For Writing In The Equation Boxes", {
      maxWidth: MAX_WIDTH,
      fontSize: 18,
      fontWeight: "bold",
    });

    const divider = new Rectangle(0, 0, MAX_WIDTH + 60, 2, {
      fill: new Color(200, 200, 200),
    });

    const stringProperties = [
      "<sub>Square root: <i>\\sqrt{expression}</i></sub>",
      "<sub>N-th root: <i>\\nthroot{expression}</i></sub>",
      "<sub>Fraction: Enter the numerator, then press <i>/</i> to move to the denominator.</sub>",
      "<sub>Exponent: x^2 (Type <i>^</i> after the base value)</sub>",
      "<sub>Subscript: x_1 (Type <i>_</i> after the base value)</sub>",
      "<sub>Multiplication dot: Press <i>Shift + 8</i></sub>",
      "<sub>Parentheses: () (Press <i>Shift + 9</i> for ( and <i>Shift + 0</i> for ))</sub>",
      "<sub>Pi (π): <i>\\pi</i></sub>",
      "<sub>Sum: <i>+</i></sub>",
      "<sub>Subtraction: <i>-</i></sub>",
    ];

    const children = stringProperties.map(
      (stringProperty) => new RichText(stringProperty),
    );

    const fillEquationsButton = new TextPushButton("Fill Correct Equations", {
      baseColor: new Color("#41b3d5"),
      font: new Font({size: 16}),
      listener: () => {
        const correctEquations = {
          v: '-\\omega_0^2\\cdot x-\\beta\\cdot v+f\\cdot\\sin\\left(\\omega\\cdot t\\right)',
          x:'v', 
        };

        if (onFillEquations) {
          onFillEquations(correctEquations);
        }
      },
    });

    const content = new VBox({
      children: [divider, ...children, fillEquationsButton],
      align: "left",
      spacing: 12,
    });

    super(content, {
      title: titleText,
      xSpacing: 30,
      ySpacing: 15,
      tandem: tandem,
      cornerRadius: 10,
      fill: new Color(245, 245, 245),
      phetioReadOnly: true,
    });
  }
}
