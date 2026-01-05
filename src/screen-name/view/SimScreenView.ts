import { ScreenView, ScreenViewOptions, Sim } from "scenerystack/sim";
import { SimModel } from "../model/SimModel.js";
import { ResetAllButton } from "scenerystack/scenery-phet";
import {
  Circle,
  Color,
  DOM,
  HBox,
  Rectangle,
  RichText,
  Text,
  VBox,
  Node,
} from "scenerystack/scenery";
import {
  HSlider,
  Panel,
  Vector2,
  Range,
  DerivedProperty,
  RoundToggleButton,
  Property,
} from "scenerystack";
// @ts-ignore
import EquationInput from "./EquationInput.js";
// @ts-ignore
import rk4Step from "../../common/rk4.js";
import { GraphComponent } from "../../common/graph.js";
import {
  CarouselComboBox,
  RectangularPushButton,
  RectangularToggleButton,
  ToggleSwitch,
} from "scenerystack/sun";
// @ts-ignore
import drawVector from "../../common/drawVector.js";
import VectorLegend from "../../common/VectorLegend.ts";

export class SimScreenView extends ScreenView {
  domNode: any;
  rootNode: any;
  time: number;
  model: SimModel;
  run: any;
  scale: number | any;

  springTest: any;
  springContextRef: CanvasRenderingContext2D;

  springContextTest: CanvasRenderingContext2D;

  newXRef: number | any;
  newVxRef: number | any;
  newXTest: number | any;
  newVxTest: number | any;

  positionPlot: any;
  velocityPlot: any;
  accelerationPlot: any;
  graph: any;
  positionGraph: GraphComponent;
  velocityGraph: GraphComponent;
  accelerationGraph: GraphComponent;
  newAcceleration: any;
  newAccelerationRef: any;
  pause: boolean;
  newAccelerationTest: any;
  hasTest: boolean;
  playAreaDOMNode: any;
  boxCanvasRef: HTMLCanvasElement;
  playAreaCenter: number;
  boxWidth: number;
  playAreaDOMNodeTest: any;
  boxCanvasTest: HTMLCanvasElement;
  vdotxInput: any;
  xdotInput: any;
  stop: boolean;
  runHistory: any;
  // comboBoxProperty: Property<string>;
  // comboBoxItems: { value: string; createNode: () => Text }[];
  // comboBox: CarouselComboBox<string>;
  updateComboBox: (runs: string[]) => void;
  selectedRunProperty: Property<string>;
  vdotLatex: string | any;
  xdotLatex: string | any;
  // restoringRun: boolean;
  forceVectorCanvas: HTMLCanvasElement;
  forceVectorCtx: CanvasRenderingContext2D;
  forceVectorCanvasTest: HTMLCanvasElement;
  forceVectorCtxTest: CanvasRenderingContext2D;
  dragVectorCanvas: HTMLCanvasElement;
  dragVectorCtx: CanvasRenderingContext2D;
  springVectorCanvas: HTMLCanvasElement;
  springVectorCtx: CanvasRenderingContext2D;
  springVectorCanvasTest: HTMLCanvasElement;
  springVectorCtxTest: CanvasRenderingContext2D;
  dragVectorCanvasTest: HTMLCanvasElement;
  dragVectorCtxTest: CanvasRenderingContext2D;
  private graphUpdateCounter = 0;
  private readonly GRAPH_UPDATE_INTERVAL = 3;
  // equationDetectionPanel: Panel;
  // existdrivingForceTest: boolean;
  // existspringForceTest: boolean;
  // existdragForceTest: boolean;
  // availableSpringForce: Text;
  // availableDragForce: Text;
  // notAvailableSpringForce: Text;
  // availableDrivingForce: Text;
  // notAvailableDragForce: Text;
  // notAvailableDrivingForce: Text;
  focusedEquationInput: any;
  showSpringVectorProperty: Property<boolean>;
  showDragVectorProperty: Property<boolean>;
  showDrivingVectorProperty: Property<boolean>;
  pauseButton: RectangularToggleButton<boolean>;
  ResumeButton: RectangularToggleButton<boolean>;

  public constructor(model: SimModel, options?: ScreenViewOptions) {
    super(options);

    const pause = new Property<boolean>(false);
    const resume = new Property<boolean>(false);

    const pauseSign = new Text("⏸︎", { fontSize: 25, maxWidth: 40 });
    const pauseButton = new RectangularToggleButton(pause, false, true, {
      minHeight: 40,
      minWidth: 40,
      scale: 1,
      xAlign: "center",
      yAlign: "center",
      content: pauseSign,
      baseColor: "#f44949",
    });
    this.pauseButton = pauseButton;
    // const ResumeButton = new RectangularToggleButton(resume, false, true, { minWidth: 140, maxHeight: 20, content: new RichText('▶'), baseColor: "#41b3d5" })
    const resumeSign = new Text("⏵︎", { fontSize: 25, maxWidth: 40 });
    // const ResumeButton = new RectangularToggleButton(resume, false, true, { minWidth: 140, maxHeight: 20, content: resumeSign, baseColor: "#41b3d5" })
    const ResumeButton = new RectangularToggleButton(resume, false, true, {
      minHeight: 40,
      minWidth: 40,
      scale: 1,
      xAlign: "center",
      yAlign: "center",
      content: resumeSign,
      baseColor: "#41b3d5",
    });

    this.ResumeButton = ResumeButton;
    // this.addChild(pauseButton)
    // this.addChild(ResumeButton)

    ResumeButton.visible = true;
    pauseButton.visible = false;

    const resetAllButton = new RectangularPushButton({
      content: new Text("⏮", { fontSize: 20, fill: "black" }),
      listener: () => {
        this.interruptSubtreeInput();
        model.reset();
        this.reset();
        this.model.paused = false;
        pauseButton.visible = true;
        ResumeButton.visible = false;
      },
      minWidth: 40,
      minHeight: 40,
    });
    // this.addChild(resetAllButton);

    // this.layoutBounds.maxX = 1450
    this.layoutBounds.maxX = 1490;

    this.time = 0;
    this.model = model;
    this.run = false;
    this.stop = false;

    const redBall = new Circle(8, { fill: "red" });
    this.addChild(redBall);
    redBall.leftTop = new Vector2(680, 23);
    const RefText = new RichText("Reference");
    this.addChild(RefText);
    RefText.leftTop = new Vector2(710, 20);

    const blueBall = new Circle(8, { fill: "blue" });
    this.addChild(blueBall);
    blueBall.leftTop = new Vector2(680, 323);
    const TestText = new RichText("Test");
    this.addChild(TestText);
    TestText.leftTop = new Vector2(710, 320);

    const xSlider = new HSlider(
      model.initialPositionProperty,
      new Range(-4, 4),
    );
    const vSlider = new HSlider(
      model.initialVelocityProperty,
      new Range(-50, 50),
    );
    const initialOmegaSlider = new HSlider(
      model.initialOmegaProperty,
      new Range(0.5, 3),
    );
    // const gammaSlider = new HSlider(model.gammaProperty, new Range(0, 0.3));
    const betaSlider = new HSlider(model.betaProperty, new Range(0, 5));
    const fSliderSlider = new HSlider(model.fProperty, new Range(0, 70));
    const omegaSlider = new HSlider(model.omegaProperty, new Range(0, 5));

    const parameters = new VBox({
      align: "center",
      children: [
        new HBox({
          children: [new RichText("init. pos. (<em>x<sub>0</sub></em>)")],
        }),
        new Rectangle(0, 0, 0, 22),
        new HBox({
          children: [new RichText("init. vel. (<em>v<sub>0</sub></em>)")],
        }),
        new Rectangle(0, 0, 0, 23),
        new HBox({
          children: [new RichText("natural freq. (<em>ω<sub>0</sub></em>)")],
        }),
        new Rectangle(0, 0, 0, 23),
        // new HBox({ children: [new RichText("<em>γ</em>")] }),
        // new Rectangle(0, 0, 0, 23),
        new HBox({ children: [new RichText("drag coeff. (<em>β</em>)")] }),
        new Rectangle(0, 0, 0, 23),
        new HBox({
          children: [new RichText("driving force ampl. (<em>f</em>)")],
        }),
        new Rectangle(0, 0, 0, 23),
        new HBox({ children: [new RichText("driving freq. (<em>ω</em>)")] }),
        new Rectangle(0, 0, 0, 10),
      ],
    });

    const sliders = new VBox({
      align: "center",
      children: [
        xSlider,
        new Rectangle(0, 0, 0, 11),
        vSlider,
        new Rectangle(0, 0, 0, 11),
        initialOmegaSlider,
        new Rectangle(0, 0, 0, 11),
        betaSlider,
        new Rectangle(0, 0, 0, 11),
        fSliderSlider,
        new Rectangle(0, 0, 0, 11),
        omegaSlider,
      ],
    });

    const values = new VBox({
      align: "center",
      children: [
        new Rectangle(0, 0, 50, 0),
        new Text(
          new DerivedProperty([model.initialPositionProperty], (value) => {
            return String(Number(value).toFixed(2));
          }),
          { fontSize: 20 },
        ),
        new Rectangle(0, 0, 20, 25),
        new Text(
          new DerivedProperty([model.initialVelocityProperty], (value) => {
            return String(Number(value).toFixed(2));
          }),
          { fontSize: 20 },
        ),
        new Rectangle(0, 0, 20, 25),
        new Text(
          new DerivedProperty([model.initialOmegaProperty], (value) => {
            return String(Number(value).toFixed(2));
          }),
          { fontSize: 20 },
        ),
        new Rectangle(0, 0, 20, 25),
        // new Text(new DerivedProperty([model.gammaProperty], (value) => { return String(Number(value).toFixed(2)) }), { fontSize: 20 }),
        // new Rectangle(0, 0, 20, 25),
        new Text(
          new DerivedProperty([model.betaProperty], (value) => {
            return String(Number(value).toFixed(2));
          }),
          { fontSize: 20 },
        ),
        new Rectangle(0, 0, 20, 25),
        new Text(
          new DerivedProperty([model.fProperty], (value) => {
            return String(Number(value).toFixed(2));
          }),
          { fontSize: 20 },
        ),
        new Rectangle(0, 0, 20, 25),
        new Text(
          new DerivedProperty([model.omegaProperty], (value) => {
            return String(Number(value).toFixed(2));
          }),
          { fontSize: 20 },
        ),
      ],
    });

    const units = new VBox({
      align: "center",
      children: [
        new RichText("m"),
        new Rectangle(0, 0, 0, 24),
        new RichText("m/s"),
        new Rectangle(0, 0, 0, 24),
        new RichText("rad/s"),
        new Rectangle(0, 0, 0, 24),
        // new RichText("m<sup>-2<\sup>"), new Rectangle(0, 0, 0, 24),
        new RichText("s<sup>-1<\sup>"),
        new Rectangle(0, 0, 0, 24),
        new RichText("N/m"),
        new Rectangle(0, 0, 0, 24),
        new RichText("rad/s"),
      ],
    });

    const buttonInitialPosition = new Property<boolean>(false);
    const buttonInitialVelocity = new Property<boolean>(false);
    const buttonInitialOmega = new Property<boolean>(false);
    // const buttonGamma = new Property<boolean>(false);
    const buttonBeta = new Property<boolean>(false);
    const buttonF = new Property<boolean>(false);
    const buttonOmega = new Property<boolean>(false);
    const buttonSimSpeed = new Property<boolean>(false);

    const toggleRadius = 13;
    const buttonVBoxConstants = new VBox({
      children: [
        new RoundToggleButton(buttonInitialPosition, false, true, {
          radius: toggleRadius,
          content: new Text("✎", { fontSize: 120, maxWidth: 15 }),
        }),
        new Rectangle(0, 0, 0, 20),
        new RoundToggleButton(buttonInitialVelocity, false, true, {
          radius: toggleRadius,
          content: new Text("✎", { fontSize: 120, maxWidth: 15 }),
        }),
        new Rectangle(0, 0, 0, 20),
        new RoundToggleButton(buttonInitialOmega, false, true, {
          radius: toggleRadius,
          content: new Text("✎", { fontSize: 120, maxWidth: 15 }),
        }),
        new Rectangle(0, 0, 0, 20),
        // new RoundToggleButton(buttonGamma, false, true, { radius: toggleRadius, content: new Text('✎', { fontSize: 120, maxWidth: 15 }) }),
        // new Rectangle(0, 0, 0, 20),
        new RoundToggleButton(buttonBeta, false, true, {
          radius: toggleRadius,
          content: new Text("✎", { fontSize: 120, maxWidth: 15 }),
        }),
        new Rectangle(0, 0, 0, 20),
        new RoundToggleButton(buttonF, false, true, {
          radius: toggleRadius,
          content: new Text("✎", { fontSize: 120, maxWidth: 15 }),
        }),
        new Rectangle(0, 0, 0, 20),
        new RoundToggleButton(buttonOmega, false, true, {
          radius: toggleRadius,
          content: new Text("✎", { fontSize: 120, maxWidth: 15 }),
        }),
      ],
    });

    buttonInitialPosition.lazyLink(() => {
      model.initialPositionProperty.value = Number(
        window.prompt("Enter value for initial position:"),
      );
    });
    buttonInitialVelocity.lazyLink(() => {
      model.initialVelocityProperty.value = Number(
        window.prompt("Enter value for initial velocity:"),
      );
    });
    buttonInitialOmega.lazyLink(() => {
      model.initialOmegaProperty.value = Number(
        window.prompt("Enter value for ω0:"),
      );
    });
    // buttonGamma.lazyLink(() => { model.gammaProperty.value = Number(window.prompt("Enter value for γ:")) })
    buttonBeta.lazyLink(() => {
      model.betaProperty.value = Number(window.prompt("Enter value for β:"));
    });
    buttonF.lazyLink(() => {
      model.fProperty.value = Number(window.prompt("Enter value for f:"));
    });
    buttonOmega.lazyLink(() => {
      model.omegaProperty.value = Number(window.prompt("Enter value for ω:"));
    });
    buttonSimSpeed.lazyLink(() => {
      model.simSpeedProperty.value = Number(
        window.prompt("Enter value for simulation speed:"),
      );
    });

    const constantPanel = new Panel(
      new VBox({
        align: "center",
        children: [
          new VBox({
            children: [
              new Text("Constants", { fontSize: 25 }),
              new Rectangle(0, 0, 0, 10),
              new HBox({
                align: "center",
                children: [
                  parameters,
                  new Rectangle(0, 0, 10, 0),
                  sliders,
                  new Rectangle(0, 0, 10, 0),
                  buttonVBoxConstants,
                  new Rectangle(0, 0, 10, 0),
                  values,
                  new Rectangle(0, 0, 10, 0),
                  units,
                ],
              }),
            ],
          }),
        ],
      }),
      { fill: new Color("#d3d3d3"), maxWidth: 290 },
    );

    this.addChild(constantPanel);
    constantPanel.leftTop = new Vector2(10, 0);

    const vxdotDOM = document.createElement("div");
    const xdotDOM = document.createElement("div");
    xdotDOM.id = "xdotDOM";
    vxdotDOM.id = "vxdotDOM";

    // Create MathQuill components

    const vdotx = document.body;
    const vdotxInput = new EquationInput(
      vxdotDOM,
      vxdotDOM.id,
      vdotx,
      model.vdotxEQProperty,
      model,
      { initialText: model.vdotxEQProperty, left: 20, top: 320 },
    );
    this.vdotxInput = vdotxInput;

    const xdot = document.body;
    const xdotInput = new EquationInput(
      xdotDOM,
      xdotDOM.id,
      xdot,
      model.xdotEQProperty,
      model,
      { initialText: model.xdotEQProperty, left: 20, top: 320 },
    );
    this.xdotInput = xdotInput;

    this.vdotxInput.mathDiv.addEventListener("focusin", () => {
      this.focusedEquationInput = this.vdotxInput;
    });
    this.xdotInput.mathDiv.addEventListener("focusin", () => {
      this.focusedEquationInput = this.xdotInput;
    });

    const insertOmega0Property = new Property(false);
    const insertOmegaProperty = new Property(false);
    const insertBetaProperty = new Property(false);

    const omega0Button = new RectangularToggleButton(
      insertOmega0Property,
      false,
      true,
      {
        content: new Text("insert (ω₀)", { fontSize: 13 }),
        cornerRadius: 6,
      },
    );
    const omegaButton = new RectangularToggleButton(
      insertOmegaProperty,
      false,
      true,
      {
        content: new Text("insert (ω)", { fontSize: 13 }),
        cornerRadius: 6,
      },
    );
    const betaButton = new RectangularToggleButton(
      insertBetaProperty,
      false,
      true,
      {
        content: new Text("insert (β)", { fontSize: 13 }),
        cornerRadius: 6,
      },
    );

    insertOmega0Property.lazyLink((pressed) => {
      if (pressed && this.focusedEquationInput) {
        this.focusedEquationInput.mathField.write("\\omega_0");
        this.focusedEquationInput.mathField.focus();
        setTimeout(() => (insertOmega0Property.value = false), 0);
      }
    });
    insertOmegaProperty.lazyLink((pressed) => {
      if (pressed && this.focusedEquationInput) {
        this.focusedEquationInput.mathField.write("\\omega");
        this.focusedEquationInput.mathField.focus();
        setTimeout(() => (insertOmegaProperty.value = false), 0);
      }
    });
    insertBetaProperty.lazyLink((pressed) => {
      if (pressed && this.focusedEquationInput) {
        this.focusedEquationInput.mathField.write("\\beta");
        this.focusedEquationInput.mathField.focus();
        setTimeout(() => (insertBetaProperty.value = false), 0);
      }
    });

    const insertButtonsBox = new HBox({
      children: [
        new Rectangle(10, 10, 20, 0),
        omega0Button,
        omegaButton,
        betaButton,
      ],
      spacing: 8,
    });

    const equationPanel = new Panel(
      new VBox({
        align: "center",
        children: [
          new Text("Equations", { fontSize: 16 }),
          new Rectangle(0, 0, 5, 5),
          insertButtonsBox,
          new Rectangle(0, 0, 5, 5),
          new HBox({
            children: [
              new RichText("<em><p>v&#x0307; =</p></em>"),
              new Rectangle(0, 0, 10, 0),
              vdotxInput,
            ],
          }),
          new Rectangle(0, 0, 10, 10),
          new HBox({
            children: [
              new RichText("<em><p>x&#x0307; = </p></em>"),
              new Rectangle(0, 0, 13, 0),
              xdotInput,
            ],
          }),
        ],
      }),
      { fill: new Color("#d3d3d3"), maxWidth: 290 },
    );

    this.addChild(equationPanel);
    equationPanel.leftTop = new Vector2(10, constantPanel.leftBottom.y + 5);

    this.showSpringVectorProperty = new Property<boolean>(true);
    this.showDragVectorProperty = new Property<boolean>(true);
    this.showDrivingVectorProperty = new Property<boolean>(true);

    const springVectorToggle = new ToggleSwitch(
      this.showSpringVectorProperty,
      false,
      true,
      { scale: 0.7 },
    );
    const dragVectorToggle = new ToggleSwitch(
      this.showDragVectorProperty,
      false,
      true,
      { scale: 0.7 },
    );
    const drivingVectorToggle = new ToggleSwitch(
      this.showDrivingVectorProperty,
      false,
      true,
      { scale: 0.7 },
    );

    const settingsPanel = new Panel(
      new VBox({
        align: "center",
        children: [
          new Text("Vector Visualization", { fontSize: 16 }),
          new Rectangle(0, 0, 280, 15),
          new HBox({
            align: "center",
            children: [
              new Text("Show Spring Force Vector?", { fontSize: 13 }),
              new Rectangle(0, 0, 10, 0),
              springVectorToggle,
            ],
          }),
          new Rectangle(0, 0, 10, 10),
          new HBox({
            align: "center",
            children: [
              new Text("Show Drag Force Vector?", { fontSize: 13 }),
              new Rectangle(0, 0, 10, 0),
              dragVectorToggle,
            ],
          }),
          new Rectangle(0, 0, 10, 10),
          new HBox({
            align: "center",
            children: [
              new Text("Show Driving Force Vector?", { fontSize: 13 }),
              new Rectangle(0, 0, 10, 0),
              drivingVectorToggle,
            ],
          }),
        ],
      }),
      { maxWidth: 290, fill: new Color("#d3d3d3") },
    );

    this.addChild(settingsPanel);

    settingsPanel.leftTop = new Vector2(
      equationPanel.leftTop.x,
      equationPanel.rightBottom.y + 5,
    );

    pause.lazyLink((e) => {
      this.model.paused = !this.model.paused;
      pauseButton.visible = !pauseButton.visible;
      ResumeButton.visible = !ResumeButton.visible;
    });
    resume.lazyLink((e) => {
      this.model.paused = !this.model.paused;
      ResumeButton.visible = !ResumeButton.visible;
      pauseButton.visible = !pauseButton.visible;
      if (this.time === 0) {
        this.model.paused = false;
        this.reset();
      }
    });

    const simSpeedButton = new RoundToggleButton(
      buttonSimSpeed,
      false,
      true,
      {
        radius: toggleRadius,
        content: new Text("✎", { fontSize: 120, maxWidth: 15 }),
      },
    );
    simSpeedButton.scale(0.9)

    const simSpeedSlider = new HSlider(
      model.simSpeedProperty,
      new Range(0.1, 2),
      { scale: 0.8 },
    );
    const otherPanel = new Panel(
      new VBox({
        align: "center",
        children: [
          new Rectangle(0, 0, 350, 0),
          new HBox({
            align: "center",
            children: [
              new Text("SimSpeed", { fontSize: 16 }),
              simSpeedSlider,
              new Rectangle(0, 0, 10, 0),
              new Text(
                new DerivedProperty([model.simSpeedProperty], (value) => {
                  return String(Number(value).toFixed(2));
                }),
                { fontSize: 16 },
              ),
              new Text("x", { fontSize: 16 }),
              new Rectangle(0, 0, 5, 0),
              simSpeedButton,
              new Rectangle(0, 0, 50, 0),
              pauseButton,
              ResumeButton,
              new Rectangle(0, 0, 5, 0),
              resetAllButton,
            ],
          }),
        ],
      }),
      { fill: new Color("#d3d3d3"), maxWidth: 290 },
    );

    this.addChild(otherPanel);
    otherPanel.leftTop = new Vector2(10, settingsPanel.leftBottom.y + 5);

    // Create a container for the position graph
    const positionGraphContainerId = "positionGraphContainer";
    const positionGraphContainer = document.createElement("div");
    positionGraphContainer.id = positionGraphContainerId;
    document.body.appendChild(positionGraphContainer);

    // Instantiate the DynamicGraph
    this.positionGraph = new GraphComponent(
      positionGraphContainerId,
      300,
      250,
      "Time (s)",
      "Position (m)",
    );

    // Cast the graph container to a scenery node
    const positionGraphNode = new DOM(positionGraphContainer);

    // Position the graph node in the view
    positionGraphNode.left = 1190; // Adjust position as needed
    positionGraphNode.top = -30; // Adjust position as needed

    // Add the graph node to the view
    this.addChild(positionGraphNode);

    // --------------------

    // Create a container for the velocity graph
    const velocityGraphContainerId = "velocityGraphContainer";
    const velocityGraphContainer = document.createElement("div");
    velocityGraphContainer.id = velocityGraphContainerId;
    document.body.appendChild(velocityGraphContainer);

    // Instantiate the DynamicGraph
    this.velocityGraph = new GraphComponent(
      velocityGraphContainerId,
      300,
      250,
      "Time (s)",
      "Velocity (m/s)",
    );

    // Cast the graph container to a scenery node
    const velocityGraphNode = new DOM(velocityGraphContainer);

    // Position the graph node in the view
    velocityGraphNode.left = 1190; // Adjust position as needed
    velocityGraphNode.top = 170; // Adjust position as needed

    // Add the graph node to the view
    this.addChild(velocityGraphNode);

    // --------------------

    // Create a container for the velocity graph
    const accelerationGraphContainerId = "accelerationGraphContainer";
    const accelerationGraphContainer = document.createElement("div");
    accelerationGraphContainer.id = accelerationGraphContainerId;
    document.body.appendChild(accelerationGraphContainer);

    // Instantiate the DynamicGraph
    this.accelerationGraph = new GraphComponent(
      accelerationGraphContainerId,
      300,
      250,
      "Time (s)",
      "Acceleration (m/s²)",
    );

    // Cast the graph container to a scenery node
    const accelerationGraphNode = new DOM(accelerationGraphContainer);

    // Position the graph node in the view
    accelerationGraphNode.left = 1190; // Adjust position as needed
    accelerationGraphNode.top = 370; // Adjust position as needed

    // Add the graph node to the view
    this.addChild(accelerationGraphNode);

    // Add a black vertical line
    const verticalLineRef = new Rectangle(0, 0, 6, 90, {
      fill: "black",
    });

    // Position the vertical line
    // verticalLineRef.centerX = 733;
    verticalLineRef.centerX = 333;
    verticalLineRef.top = 97;

    // Add the vertical line to the view
    this.addChild(verticalLineRef);

    const verticalLineTest = new Rectangle(0, 0, 6, 90, {
      fill: "black",
    });

    // Position the vertical line
    verticalLineTest.centerX = 333;
    verticalLineTest.top = 397;

    // Add the vertical line to the view
    this.addChild(verticalLineTest);

    const legendNode = VectorLegend();
    legendNode.left = this.layoutBounds.maxX / 2 - 420; // Adjust as needed for your layout
    legendNode.top = 560;
    this.addChild(legendNode);

    // Create the spring canvas
    const springCanvasRef = document.createElement("canvas");
    // springCanvasRef.width = 1240;
    springCanvasRef.width = 1370;
    springCanvasRef.height = 230;

    // Get the spring context
    const springContextRef = springCanvasRef.getContext("2d")!;
    const springWidth = 24;
    const springCoils = 18;

    // Calculate the initial spring height based on the box's initial position
    const initialExtension = this.model.initialPositionProperty.value; // Initial box position (e.g., x = 0)
    let springHeight = 150 + initialExtension * 57; // Adjust spring height dynamically

    // Transform the spring context for vertical alignment
    springContextRef.translate(
      springCanvasRef.width / 2,
      springCanvasRef.height / 2,
    );
    springContextRef.rotate(-Math.PI / 2);
    springContextRef.translate(
      -springCanvasRef.width / 2,
      -springCanvasRef.height / 2,
    );

    // Draw the spring
    springContextRef.clearRect(
      0,
      0,
      springCanvasRef.width,
      springCanvasRef.height,
    );
    springContextRef.strokeStyle = "black";
    springContextRef.lineWidth = 2;
    springContextRef.beginPath();
    springContextRef.moveTo(springCanvasRef.width / 2, 0);
    for (let i = 0; i <= springCoils; i++) {
      const x =
        springCanvasRef.width / 2 +
        (i % 2 === 0 ? -springWidth / 2 : springWidth / 2);
      const y = (i / springCoils) * springHeight;
      springContextRef.lineTo(x, y);
    }
    springContextRef.lineTo(springCanvasRef.width / 2, springHeight);
    springContextRef.stroke();

    // Save the spring context for later updates
    this.springContextRef = springContextRef;

    // Create a spring using pure JavaScript and cast it to a DOM node for Refenece
    const springCanvasTest = document.createElement("canvas");
    // springCanvasTest.width = 1240;
    springCanvasTest.width = 1370;
    springCanvasTest.height = 230;
    //
    const springContextTest = springCanvasTest.getContext("2d")!;
    const springWidthTest = 24;
    const springHeightTest = 150;
    const springCoilsTest = 18;

    springContextTest.translate(
      springCanvasTest.width / 2,
      springCanvasTest.height / 2,
    );
    springContextTest.rotate(-Math.PI / 2);
    springContextTest.translate(
      -springCanvasTest.width / 2,
      -springCanvasTest.height / 2,
    );

    // Draw the spring
    springContextTest.clearRect(
      0,
      0,
      springCanvasTest.width,
      springCanvasTest.height,
    );
    springContextTest.strokeStyle = "black";
    springContextTest.lineWidth = 2;
    springContextTest.beginPath();
    springContextTest.moveTo(springCanvasTest.width / 2, 0);
    for (let i = 0; i <= springCoilsTest; i++) {
      const x =
        springCanvasTest.width / 2 +
        (i % 2 === 0 ? -springWidthTest / 2 : springWidthTest / 2);
      const y = (i / springCoilsTest) * springHeightTest;
      springContextTest.lineTo(x, y);
    }
    springContextTest.lineTo(springCanvasTest.width / 2, springHeightTest);
    springContextTest.stroke();

    this.springContextTest = springContextTest;

    const playAreaDiv = document.createElement("div");
    // playAreaDiv.style.position = 'relative';
    playAreaDiv.style.border = "1px solid black";
    playAreaDiv.style.left = "183.5px"; // Match your springDOMNode.left
    playAreaDiv.style.top = "45px"; // Match your springDOMNode.top
    playAreaDiv.style.width = "800px"; // Set your visible width
    playAreaDiv.style.height = "100px"; // Match canvas height
    playAreaDiv.style.overflow = "hidden";
    // playAreaDiv.style.backgroundColor = "rgb(223, 234, 234) "
    playAreaDiv.style.backgroundColor = " #e5e8e8 ";
    // playAreaDiv.style.backgroundColor = "rgb(188, 188, 188) "

    const playAreaDivTest = document.createElement("div");
    // playAreaDivTest.style.position = 'related';
    playAreaDivTest.style.border = "1px solid black";
    playAreaDivTest.style.left = "183.5px"; // Match your springDOMNode.left
    playAreaDivTest.style.top = "45px"; // Match your springDOMNode.top
    playAreaDivTest.style.width = "800px"; // Set your visible width
    playAreaDivTest.style.height = "100px"; // Match canvas height
    playAreaDivTest.style.overflow = "hidden";
    playAreaDivTest.style.backgroundColor = "#e5e8e8";

    // Create a red box using pure JavaScript (canvas) and attach it to the end of the spring
    const boxWidth = 60;
    this.boxWidth = boxWidth;
    const boxHeight = 60;
    const boxCanvasRef = document.createElement("canvas");

    const boxCanvasTest = document.createElement("canvas");
    boxCanvasRef.width = boxWidth + 4;
    boxCanvasRef.height = boxHeight + 4;
    boxCanvasTest.width = boxWidth + 4;
    boxCanvasTest.height = boxHeight + 4;
    const boxContextRef = boxCanvasRef.getContext("2d")!;
    const boxContextTest = boxCanvasTest.getContext("2d")!;

    boxContextRef.beginPath();

    boxContextRef.rect(2, 2, boxWidth, boxHeight);

    boxContextRef.fillStyle = "rgb(255, 0, 0) ";
    boxContextRef.shadowColor = "#333";
    boxContextRef.shadowBlur = 8;
    boxContextRef.fill();
    boxContextRef.lineWidth = 2;
    boxContextRef.strokeStyle = "#222";
    boxContextRef.stroke();

    boxContextTest.beginPath();
    boxContextTest.rect(2, 2, boxWidth, boxHeight);
    boxContextTest.fillStyle = "blue";
    boxContextTest.shadowColor = "#333";
    boxContextTest.shadowBlur = 8;
    boxContextTest.fill();
    boxContextTest.lineWidth = 2;
    boxContextTest.strokeStyle = "#222";
    boxContextTest.stroke();

    // Attach the box to the end of the spring (canvas spring)
    // The end of the spring is at (springCanvasRef.width / 2, springHeight) in springCanvasRef coordinates
    // Position the box so its center aligns with the end of the spring
    playAreaDiv.appendChild(boxCanvasRef);
    playAreaDiv.appendChild(springCanvasRef);
    playAreaDivTest.appendChild(boxCanvasTest);
    playAreaDivTest.appendChild(springCanvasTest);
    // playAreaDivTest.appendChild(springCanvasTest);

    const playAreaDOMNode = new DOM(playAreaDiv);
    const playAreaDOMNodeTest = new DOM(playAreaDivTest);

    this.playAreaDOMNode = playAreaDOMNode;
    this.playAreaDOMNodeTest = playAreaDOMNodeTest;

    this.addChild(playAreaDOMNode);
    this.addChild(playAreaDOMNodeTest);

    // playAreaDOMNode.left = 287;
    playAreaDOMNode.left = 332;
    playAreaDOMNode.top = 85;

    playAreaDOMNodeTest.left = 332;
    playAreaDOMNodeTest.top = 385;

    boxCanvasRef.style.position = "relative";
    boxCanvasRef.style.top = "38px"; // adjust as needed to center vertically
    springCanvasRef.style.position = "relative";
    springCanvasRef.style.top = "-106px"; // adjust as needed to center vertically
    springCanvasRef.style.left = "-570.5px"; // adjust as needed to center vertically
    springCanvasTest.style.position = "relative";
    springCanvasTest.style.top = "-106px"; // adjust as needed to center vertically
    springCanvasTest.style.left = "-570.5px"; // adjust as needed to center vertically
    springCanvasRef.style.zIndex = "1";
    boxCanvasRef.style.zIndex = "2";
    springCanvasTest.style.zIndex = "1";
    boxCanvasTest.style.zIndex = "2";
    boxCanvasTest.style.position = "relative";
    boxCanvasTest.style.top = "38px"; // adjust as needed to center vertically
    // Calculate the left position in pixels based on your simulation value
    this.playAreaCenter = 400; // If playAreaDiv width is 100px, center is 50px
    this.scale = 57; // pixels per meter

    this.boxCanvasRef = boxCanvasRef;
    this.boxCanvasTest = boxCanvasTest;

    // Adding deriving force vector
    const forceVectorCanvas = document.createElement("canvas");
    forceVectorCanvas.width = 460; // Increased size for longer arrow
    forceVectorCanvas.height = 20;
    forceVectorCanvas.style.position = "relative"; // Use absolute positioning for better control
    forceVectorCanvas.style.left = "440px";
    forceVectorCanvas.style.top = "-240px";
    forceVectorCanvas.style.pointerEvents = "none";
    forceVectorCanvas.style.zIndex = "2";

    // forceVectorCanvas.style.display = "none"

    playAreaDiv.appendChild(forceVectorCanvas);

    // Draw the static arrow
    const ctx = forceVectorCanvas.getContext("2d")!;
    ctx.save();

    this.forceVectorCanvas = forceVectorCanvas;
    this.forceVectorCtx = ctx;

    // Adding deriving force vector
    const dragVectorCanvas = document.createElement("canvas");
    dragVectorCanvas.width = 460; // Increased size for longer arrow
    dragVectorCanvas.height = 20;
    dragVectorCanvas.style.position = "relative";
    dragVectorCanvas.style.left = "440px"; // Position inside play area
    dragVectorCanvas.style.top = "-245px";
    dragVectorCanvas.style.pointerEvents = "none";
    dragVectorCanvas.style.zIndex = "2";

    playAreaDiv.appendChild(dragVectorCanvas);

    // Draw the static arrow
    const ctxDrag = dragVectorCanvas.getContext("2d")!;
    ctxDrag.save();

    this.dragVectorCanvas = dragVectorCanvas;
    this.dragVectorCtx = ctxDrag;

    // Adding spring force vector
    const springVectorCanvas = document.createElement("canvas");
    springVectorCanvas.width = 460; // Increased size for longer arrow
    springVectorCanvas.height = 20;
    springVectorCanvas.style.position = "relative";
    springVectorCanvas.style.left = "440px"; // Position inside play area
    springVectorCanvas.style.top = "-310px";
    springVectorCanvas.style.pointerEvents = "none";
    springVectorCanvas.style.zIndex = "3";

    playAreaDiv.appendChild(springVectorCanvas);

    // Draw the static arrow
    const ctxSpring = springVectorCanvas.getContext("2d")!;
    ctxSpring.save();

    this.springVectorCanvas = springVectorCanvas;
    this.springVectorCtx = ctxSpring;

    // Adding force vector for Test
    const forceVectorCanvasTest = document.createElement("canvas");
    forceVectorCanvasTest.width = 460; // Increased size for longer arrow
    forceVectorCanvasTest.height = 20;
    forceVectorCanvasTest.style.position = "relative";
    forceVectorCanvasTest.style.left = "440px"; // Position inside play area
    forceVectorCanvasTest.style.top = "-240px";
    forceVectorCanvasTest.style.pointerEvents = "none";
    forceVectorCanvasTest.style.zIndex = "2";

    playAreaDivTest.appendChild(forceVectorCanvasTest);

    // Draw the static arrow
    const ctxTest = forceVectorCanvasTest.getContext("2d")!;
    ctxTest.save();

    this.forceVectorCanvasTest = forceVectorCanvasTest;
    this.forceVectorCtxTest = ctxTest;

    // Adding deriving force vector for Test
    const dragVectorCanvasTest = document.createElement("canvas");
    dragVectorCanvasTest.width = 460; // Increased size for longer arrow
    dragVectorCanvasTest.height = 20;
    dragVectorCanvasTest.style.position = "relative";
    dragVectorCanvasTest.style.left = "440px"; // Position inside play area
    dragVectorCanvasTest.style.top = "-245px";
    dragVectorCanvasTest.style.pointerEvents = "none";
    dragVectorCanvasTest.style.zIndex = "200";

    playAreaDivTest.appendChild(dragVectorCanvasTest);

    // Draw the static arrow
    const ctxDragTest = dragVectorCanvasTest.getContext("2d")!;
    ctxDragTest.save();

    this.dragVectorCanvasTest = dragVectorCanvasTest;
    this.dragVectorCtxTest = ctxDragTest;

    // Adding deriving force vector for Test
    const springVectorCanvasTest = document.createElement("canvas");
    springVectorCanvasTest.width = 460; // Increased size for longer arrow
    springVectorCanvasTest.height = 20;
    springVectorCanvasTest.style.position = "relative";
    springVectorCanvasTest.style.left = "440px"; // Position inside play area
    springVectorCanvasTest.style.top = "-310px";
    springVectorCanvasTest.style.pointerEvents = "none";
    springVectorCanvasTest.style.zIndex = "200";

    playAreaDivTest.appendChild(springVectorCanvasTest);

    // Draw the static arrow
    const ctxSpringTest = springVectorCanvasTest.getContext("2d")!;
    ctxSpringTest.save();

    this.springVectorCanvasTest = springVectorCanvasTest;
    this.springVectorCtxTest = ctxSpringTest;

    // Dynamically update the spring visibility and redraw it when the box moves
    this.model.initialPositionProperty.link((x) => {
      this.run = false;

      this.forceVectorCtx.clearRect(
        0,
        0,
        this.forceVectorCanvas.width,
        this.forceVectorCanvas.height,
      );
      this.dragVectorCtx.clearRect(
        0,
        0,
        this.dragVectorCanvas.width,
        this.dragVectorCanvas.height,
      );
      this.springVectorCtx.clearRect(
        0,
        0,
        this.springVectorCanvas.width,
        this.springVectorCanvas.height,
      );

      this.forceVectorCtxTest.clearRect(
        0,
        0,
        this.forceVectorCanvasTest.width,
        this.forceVectorCanvasTest.height,
      );
      this.dragVectorCtxTest.clearRect(
        0,
        0,
        this.dragVectorCanvasTest.width,
        this.dragVectorCanvasTest.height,
      );
      this.springVectorCtxTest.clearRect(
        0,
        0,
        this.springVectorCanvasTest.width,
        this.springVectorCanvasTest.height,
      );

      springHeight = 372 + x * 57;

      // Reference spring
      springContextRef.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
      springContextRef.clearRect(
        0,
        0,
        springCanvasRef.width,
        springCanvasRef.height,
      );
      springContextRef.translate(
        springCanvasRef.width / 2,
        springCanvasRef.height / 2,
      );
      springContextRef.rotate(-Math.PI / 2);
      springContextRef.translate(
        -springCanvasRef.width / 2,
        -springCanvasRef.height / 2,
      );

      springContextRef.beginPath();
      springContextRef.moveTo(springCanvasRef.width / 2, 0);
      for (let i = 0; i <= springCoils; i++) {
        const xPos =
          springCanvasRef.width / 2 +
          (i % 2 === 0 ? -springWidth / 2 : springWidth / 2);
        const yPos = (i / springCoils) * springHeight;
        springContextRef.lineTo(xPos, yPos);
      }
      springContextRef.lineTo(springCanvasRef.width / 2, springHeight);
      springContextRef.stroke();

      // Test Spring
      if (1 === 1) {
        springContextTest.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
        springContextTest.clearRect(
          0,
          0,
          springCanvasRef.width,
          springCanvasRef.height,
        );
        springContextTest.translate(
          springCanvasRef.width / 2,
          springCanvasRef.height / 2,
        );
        springContextTest.rotate(-Math.PI / 2);
        springContextTest.translate(
          -springCanvasRef.width / 2,
          -springCanvasRef.height / 2,
        );

        springContextTest.beginPath();
        springContextTest.moveTo(springCanvasTest.width / 2, 0);
        for (let i = 0; i <= springCoils; i++) {
          const xPos =
            springCanvasTest.width / 2 +
            (i % 2 === 0 ? -springWidth / 2 : springWidth / 2);
          const yPos = (i / springCoils) * springHeight;
          springContextTest.lineTo(xPos, yPos);
        }
        springContextTest.lineTo(springCanvasTest.width / 2, springHeight);
        springContextTest.stroke();
        boxCanvasTest.style.left = `${this.playAreaCenter + x * this.scale - this.boxWidth / 2}px`;
      }

      boxCanvasRef.style.left = `${this.playAreaCenter + x * this.scale - this.boxWidth / 2}px`;
    });

    // Axis parameters
    const axisLength = 800; // in pixels
    const xMin = -7; // Negative range
    const xMax = 7; // Positive range
    const numTicks = 15; // Total number of ticks (including 0)

    // Create the axis line
    const axisLine = new Rectangle(0, 0, axisLength, 2, {
      fill: "black",
    });

    // Create tick marks and labels
    const tickSpacing = axisLength / (numTicks - 1);
    const ticks: Node[] = [];
    for (let i = 0; i < numTicks; i++) {
      const xValue = xMin + (xMax - xMin) * (i / (numTicks - 1));
      const tickX = i * tickSpacing;

      // Tick mark
      const tick = new Rectangle(tickX - 1, 10, 2, 10, { fill: "black" });

      // Label
      const label = new Text(xValue.toFixed(1), {
        fontSize: 16,
        centerX: tickX,
        top: 22,
      });

      ticks.push(tick, label);
    }

    // Group axis line and ticks
    const axisGroup = new Node();
    const axisGroupTest = new Node();
    axisGroup.addChild(axisLine);
    ticks.forEach((tick) => axisGroup.addChild(tick));
    axisGroupTest.addChild(axisLine);
    ticks.forEach((tick) => axisGroupTest.addChild(tick));

    // Add axis label
    const axisLabel = new Text("x (m)", {
      fontSize: 18,
      centerX: axisLength / 2,
      top: 45,
      font: "italic 18px sans-serif",
    });
    axisGroup.addChild(axisLabel);
    axisGroupTest.addChild(axisLabel);

    // Optionally, add a marker for the equilibrium position (e.g., x = 0)
    const eqX = axisLength / 2; // Center of the axis
    const eqMarker = new Rectangle(eqX - 2, 0, 3, 22, { fill: "red" });
    axisGroup.addChild(eqMarker);
    axisGroupTest.addChild(eqMarker);

    // Position the axis at the bottom center of the view
    axisGroup.left = (this.layoutBounds.maxX - axisLength) / 2 - 25;
    axisGroup.bottom = 550;

    axisGroupTest.left = (this.layoutBounds.maxX - axisLength) / 2 - 25;
    axisGroupTest.bottom = 250;

    this.addChild(axisGroup);
    this.addChild(axisGroupTest);

    this.pause = false;
    this.hasTest = false;

    this.selectedRunProperty = new Property("History"); // This will persist even after rebuilding

    const listParent = new Node(); // Parent for the combo box
    let currentComboBox: Node | null = null; // To keep track of the current combo box
    this.runHistory = []; // Initialize run history
    function updateComboBox(
      this: SimScreenView,
      runs: Array<{ name: string; index: number }> | string[],
    ) {
      if (currentComboBox) {
        listParent.removeChild(currentComboBox);
        currentComboBox.dispose();
      }

      // Support both array of objects and array of strings for runs
      const items = [
        {
          value: "History",
          createNode: () => new Text("History"),
          accessibleName: "History run",
        },
        ...(Array.isArray(runs) && typeof runs[0] === "object"
          ? (runs as Array<{ name: string; index: number }>).map((run) => ({
              value: `Run ${run.index + 1}`,
              createNode: () => new Text(`Run ${run.index + 1}`),
              accessibleName: `Run ${run.index + 1}`,
            }))
          : (runs as string[]).map((run, idx) => ({
              value: run,
              createNode: () => new Text(run),
              accessibleName: run,
            }))),
      ];

      currentComboBox = new CarouselComboBox<string>(
        this.selectedRunProperty,
        items,
        {
          scale: 1.5,
        },
      );

      listParent.addChild(currentComboBox);
    }

    this.addChild(listParent);
    this.updateComboBox = updateComboBox.bind(this);
    this.updateComboBox([]);

    this.selectedRunProperty.link((selected) => {
      if (selected.startsWith("Run ")) {
        const index = parseInt(selected.replace("Run ", "")) - 1;
        const run = this.runHistory[index];
        if (run) {
          this.model.initialPositionProperty.value = run.initialPosition;
          this.model.initialVelocityProperty.value = run.initialVelocity;
          this.model.initialOmegaProperty.value = run.initialOmega;
          this.model.betaProperty.value = run.beta;
          this.model.fProperty.value = run.f;
          this.model.omegaProperty.value = run.omega;
          this.model.vdotxEQProperty.value = run.vdotxEQ;
          this.model.xdotEQProperty.value = run.xdotEQ;
          this.vdotLatex = run.vdotxEQLatex;
          this.xdotLatex = run.xdotEQLatex;

          this.restoreRun();
        }
      }
    });

    listParent.leftTop = new Vector2(
      constantPanel.rightCenter.x + 10,
      constantPanel.leftTop.y + 10,
    );

    let changing = false;
    let changingWithId = [false, -1];
    for (const slider of constantPanel._children) {
      if (slider !== simSpeedSlider) {
        slider.addInputListener({
          mousedown: function (event: { target: { _id: any } }) {
            changing = true;
            changingWithId[0] = true;
            changingWithId[1] = event.target._id;
          },
        });
      }
    }

    window.addEventListener("pointerup", () => {
      if (changingWithId[0]) {
        console.log("Pointer up detected, changingWithId:", changingWithId);
        if (changingWithId[1] === 346 || changingWithId[1] === 354) {
          // setTimeout(
          //   () =>
          //     post(
          //       model.name,
          //       "x0 changed",
          //       model.xProp.value,
          //       model.yProp.value,
          //       model.v_xProp.value,
          //       model.v_yProp.value,
          //       model.omegaProp.value,
          //       model.xEQ,
          //       model.yEQ,
          //       model.v_xEQ,
          //       model.v_yEQ,
          //     ),
          //   10,
          // );
          changingWithId[0] = false;
          changingWithId[1] = -1;
          this.model.paused = false;
          pauseButton.visible = true;
          ResumeButton.visible = false;
          this.reset();
        } else if (changingWithId[1] === 360 || changingWithId[1] === 368) {
          // setTimeout(
          //   () =>
          //     post(
          //       model.name,
          //       "y0 changed",
          //       model.xProp.value,
          //       model.yProp.value,
          //       model.v_xProp.value,
          //       model.v_yProp.value,
          //       model.omegaProp.value,
          //       model.xEQ,
          //       model.yEQ,
          //       model.v_xEQ,
          //       model.v_yEQ,
          //     ),
          //   10,
          // );
          changingWithId[0] = false;
          changingWithId[1] = -1;
          this.model.paused = false;
          pauseButton.visible = true;
          ResumeButton.visible = false;
          this.reset();
        } else if (changingWithId[1] === 374 || changingWithId[1] === 382) {
          // setTimeout(
          //   () =>
          //     post(
          //       model.name,
          //       "v0_x changed",
          //       model.xProp.value,
          //       model.yProp.value,
          //       model.v_xProp.value,
          //       model.v_yProp.value,
          //       model.omegaProp.value,
          //       model.xEQ,
          //       model.yEQ,
          //       model.v_xEQ,
          //       model.v_yEQ,
          //     ),
          //   10,
          // );
          changingWithId[0] = false;
          changingWithId[1] = -1;
          this.reset();
          this.model.paused = false;
          pauseButton.visible = true;
          ResumeButton.visible = false;
        } else if (changingWithId[1] === 388 || changingWithId[1] === 396) {
          // setTimeout(
          //   () =>
          //     post(
          //       model.name,
          //       "v0_y changed",
          //       model.xProp.value,
          //       model.yProp.value,
          //       model.v_xProp.value,
          //       model.v_yProp.value,
          //       model.omegaProp.value,
          //       model.xEQ,
          //       model.yEQ,
          //       model.v_xEQ,
          //       model.v_yEQ,
          //     ),
          //   10,
          // );
          changingWithId[0] = false;
          changingWithId[1] = -1;
          this.model.paused = false;
          pauseButton.visible = true;
          ResumeButton.visible = false;
          this.reset();
        } else if (changingWithId[1] === 402 || changingWithId[1] === 410) {
          changingWithId[0] = false;
          changingWithId[1] = -1;
          this.model.paused = false;
          pauseButton.visible = true;
          ResumeButton.visible = false;
          this.reset();
        } else if (changingWithId[1] === 416 || changingWithId[1] === 424) {
          changingWithId[0] = false;
          changingWithId[1] = -1;
          this.model.paused = false;
          pauseButton.visible = true;
          ResumeButton.visible = false;
          this.reset();
        }
      }
    });
    this.reset();
  }

  public restoreRun(): void {
    // Reset simulation without saving to history
    this.run = true;
    this.newXRef = this.model.initialPositionProperty.value;
    this.newVxRef = this.model.initialVelocityProperty.value;
    this.newXTest = this.model.initialPositionProperty.value;
    this.newVxTest = this.model.initialVelocityProperty.value;
    this.model.initialPosition = this.model.initialPositionProperty.value;
    this.model.initialVelocity = this.model.initialVelocityProperty.value;
    this.model.initialOmega = this.model.initialOmegaProperty.value;
    this.model.beta = this.model.betaProperty.value;
    this.model.f = this.model.fProperty.value;
    this.model.omega = this.model.omegaProperty.value;

    this.positionGraph.resetGraph();
    this.velocityGraph.resetGraph();
    this.accelerationGraph.resetGraph();

    this.vdotxInput.updateText(this.vdotLatex);
    this.xdotInput.updateText(this.xdotLatex);

    this.vdotxInput.updatePropertyFromField();
    this.xdotInput.updatePropertyFromField();
    this.model.vdotxEQ = this.model.vdotxEQProperty.value;
    this.model.xdotEQ = this.model.xdotEQProperty.value;
    this.forceVectorCtx.clearRect(
      0,
      0,
      this.forceVectorCanvas.width,
      this.forceVectorCanvas.height,
    );
    this.dragVectorCtx.clearRect(
      0,
      0,
      this.dragVectorCanvas.width,
      this.dragVectorCanvas.height,
    );
    this.springVectorCtx.clearRect(
      0,
      0,
      this.springVectorCanvas.width,
      this.springVectorCanvas.height,
    );

    this.forceVectorCtxTest.clearRect(
      0,
      0,
      this.forceVectorCanvasTest.width,
      this.forceVectorCanvasTest.height,
    );
    this.dragVectorCtxTest.clearRect(
      0,
      0,
      this.dragVectorCanvasTest.width,
      this.dragVectorCanvasTest.height,
    );
    this.springVectorCtxTest.clearRect(
      0,
      0,
      this.springVectorCanvasTest.width,
      this.springVectorCanvasTest.height,
    );
    if (
      this.model.vdotxEQProperty.value === "" ||
      this.model.xdotEQProperty.value === ""
    ) {
      this.hasTest = false;
    }
    this.time = 0;
  }

  public reset(): void {
    this.model.paused = false;
    this.pauseButton.visible = true;
    this.ResumeButton.visible = false;

    this.vdotLatex = this.vdotxInput.mathField.latex();
    this.xdotLatex = this.xdotInput.mathField.latex();

    const currentSettings = {
      initialPosition: this.model.initialPositionProperty.value,
      initialVelocity: this.model.initialVelocityProperty.value,
      initialOmega: this.model.initialOmegaProperty.value,
      beta: this.model.betaProperty.value,
      f: this.model.fProperty.value,
      omega: this.model.omegaProperty.value,

      vdotxEQLatex: this.vdotLatex,
      xdotEQLatex: this.xdotLatex,

      vdotxEQ: this.model.vdotxEQProperty.value,
      xdotEQ: this.model.xdotEQProperty.value,
    };

    // Check if settings are different from last run
    const lastRun = this.runHistory[this.runHistory.length - 1];
    const isDifferent =
      !lastRun ||
      Object.keys(currentSettings).some(
        (key) =>
          lastRun[key as keyof typeof currentSettings] !==
          currentSettings[key as keyof typeof currentSettings],
      );

    // Only add to history if settings are different
    if (isDifferent) {
      this.runHistory.push(currentSettings);

      // Update ComboBox with new history
      this.updateComboBox(
        this.runHistory.map((_: any, index: number) => ({
          name: `Run ${index + 1}`,
          index,
        })),
      );

      // Update selected run to newest

      const currentRunNumber = this.runHistory.length;
      this.selectedRunProperty.value = `Run ${currentRunNumber}`;
    }

    this.run = true;
    this.newXRef = this.model.initialPositionProperty.value;
    this.newVxRef = this.model.initialVelocityProperty.value;
    this.newXTest = this.model.initialPositionProperty.value;
    this.newVxTest = this.model.initialVelocityProperty.value;
    this.model.initialPosition = this.model.initialPositionProperty.value;
    this.model.initialVelocity = this.model.initialVelocityProperty.value;
    this.model.initialOmega = this.model.initialOmegaProperty.value;
    this.model.beta = this.model.betaProperty.value;
    this.model.f = this.model.fProperty.value;
    this.model.omega = this.model.omegaProperty.value;
    this.vdotxInput.updatePropertyFromField();
    this.xdotInput.updatePropertyFromField();
    this.model.vdotxEQ = this.model.vdotxEQProperty.value;
    this.model.xdotEQ = this.model.xdotEQProperty.value;
    this.hasTest = false;
    this.positionGraph.resetGraph();
    this.velocityGraph.resetGraph();
    this.accelerationGraph.resetGraph();

    // Reset time
    this.time = 0;
  }

  // updateEquationDetectionPanel() {
  //   const contentNode = this.equationDetectionPanel._content as VBox;
  //   contentNode.removeAllChildren();

  //   if (this.existspringForceTest) {
  //     contentNode.addChild(this.availableSpringForce);
  //     contentNode.addChild(new Rectangle(0, 0, 0, 2));
  //   } else {
  //     contentNode.addChild(this.notAvailableSpringForce);
  //     contentNode.addChild(new Rectangle(0, 0, 0, 2));
  //   }

  //   if (this.existdragForceTest) {
  //     contentNode.addChild(this.availableDragForce);
  //     contentNode.addChild(new Rectangle(0, 0, 0, 2));
  //   } else {
  //     contentNode.addChild(this.notAvailableDragForce);
  //     contentNode.addChild(new Rectangle(0, 0, 0, 2));
  //   }

  //   if (this.existdrivingForceTest) {
  //     contentNode.addChild(this.availableDrivingForce);
  //     contentNode.addChild(new Rectangle(0, 0, 0, 2));
  //   } else {
  //     contentNode.addChild(this.notAvailableDrivingForce);
  //     contentNode.addChild(new Rectangle(0, 0, 0, 2));
  //   }
  // }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public step(dt: number): void {
    //
    if (
      this.run &&
      !this.pause &&
      !this.stop &&
      this.time < 60 &&
      !this.model.paused
    ) {
      const [
        newXRef,
        newVRef,
        newAccelerationRef,
        dragForce,
        springForce,
        drivingForce,
      ] = rk4Step(
        [this.newXRef, this.newVxRef],
        {
          // gamma: this.model.gamma,
          beta: this.model.beta,
          f: this.model.f,
          omega: this.model.omega,
          omega0: this.model.initialOmega,
        },
        null,
        null,
        true,
        0.015 * this.model.simSpeedProperty.value,
        this.time,
      );

      this.newVxRef = newVRef;
      this.newXRef = newXRef;
      this.newAccelerationRef = newAccelerationRef;

      // this.boxDOMNode.left = 655 + (this.newXRef) * 57; // 60px per meter, origin at rest position
      this.boxCanvasRef.style.left = `${this.playAreaCenter + this.newXRef * this.scale - this.boxWidth / 2}px`;
      const extension = this.newXRef;
      const springHeight = 372 + extension * 57;

      // Redraw the spring to connect to the moving box
      this.springContextRef.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
      this.springContextRef.clearRect(0, 0, 1370, 230);
      this.springContextRef.translate(1370 / 2, 230 / 2);
      this.springContextRef.rotate(-Math.PI / 2);
      // this.springContextRef.translate(-1240 / 2, -230 / 2);
      this.springContextRef.translate(-1370 / 2, -230 / 2);

      this.springContextRef.strokeStyle = "black";
      this.springContextRef.lineWidth = 2;
      this.springContextRef.beginPath();
      // this.springContextRef.moveTo(1240 / 2, 0);
      this.springContextRef.moveTo(1370 / 2, 0);
      for (let i = 0; i <= 18; i++) {
        // const xPos = 1240 / 2 + (i % 2 === 0 ? -24 / 2 : 24 / 2);
        const xPos = 1370 / 2 + (i % 2 === 0 ? -24 / 2 : 24 / 2);
        const yPos = (i / 18) * springHeight;
        this.springContextRef.lineTo(xPos, yPos);
      }
      // this.springContextRef.lineTo(1240 / 2, springHeight);
      this.springContextRef.lineTo(1370 / 2, springHeight);
      this.springContextRef.stroke();

      const boxLeft =
        this.playAreaCenter + this.newXRef * this.scale - this.boxWidth / 2;
      const boxCenter = boxLeft + this.boxWidth / 2;

      // Drag force vector
      if (dragForce !== 0 && this.showDragVectorProperty.value) {
        this.dragVectorCanvas.style.left = `${boxCenter - this.dragVectorCanvas.width / 2}px`;
        // drawVector(Math.abs(dragForce) <= 0.01 ? 0 : dragForce, this.dragVectorCtx, this.dragVectorCanvas, " #16960b ", "solid");
        // drawVector(Math.abs(dragForce) <= 0.01 ? 0 : dragForce, this.dragVectorCtx, this.dragVectorCanvas, " rgb(79, 204, 67) ", "solid");
        drawVector(
          Math.abs(dragForce) <= 0.01 ? 0 : dragForce,
          this.dragVectorCtx,
          this.dragVectorCanvas,
          " rgb(79, 204, 67) ",
          "hashed",
        );
      } else {
        this.dragVectorCtx.clearRect(
          0,
          0,
          this.dragVectorCanvas.width,
          this.dragVectorCanvas.height,
        );
      }

      // Spring force vector
      if (springForce !== 0 && this.showSpringVectorProperty.value) {
        this.springVectorCanvas.style.left = `${boxCenter - this.springVectorCanvas.width / 2}px`;
        // drawVector(Math.abs(springForce) <= 0.01 ? 0 : springForce, this.springVectorCtx, this.springVectorCanvas, " rgb(231, 77, 239) ", "dotted");
        drawVector(
          Math.abs(springForce) <= 0.01 ? 0 : springForce,
          this.springVectorCtx,
          this.springVectorCanvas,
          " yellow ",
          "dotted",
        );
      } else {
        this.springVectorCtx.clearRect(
          0,
          0,
          this.springVectorCanvas.width,
          this.springVectorCanvas.height,
        );
      }

      if (this.model.f !== 0 && this.showDrivingVectorProperty.value) {
        this.forceVectorCanvas.style.display = "";
        this.forceVectorCanvas.style.left = `${boxCenter - this.forceVectorCanvas.width / 2}px`;
        const forceValue =
          this.model.f * Math.sin(this.model.omega * this.time);

        drawVector(
          Math.abs(drivingForce) < 0.01 ? 0 : drivingForce,
          this.forceVectorCtx,
          this.forceVectorCanvas,
          "#40bde8 ",
          "solidWithBorder",
        );
      } else {
        // this.forceVectorCanvas.style.display = 'none';
        this.forceVectorCtx.clearRect(
          0,
          0,
          this.forceVectorCanvas.width,
          this.forceVectorCanvas.height,
        );
      }

      if (this.model.xdotEQ !== "" && this.model.vdotxEQ !== "") {
        this.hasTest = true;
        const [
          newXTest,
          newVTest,
          newAccelerationTest,
          drivingForceTest,
          springForceTest,
          dragForceTest,
        ] = rk4Step(
          [this.newXTest, this.newVxTest],
          {
            // gamma: this.model.gamma,
            beta: this.model.beta,
            f: this.model.f,
            omega: this.model.omega,
            omega0: this.model.initialOmega,
          },
          this.model.vdotxEQ,
          this.model.xdotEQ,
          false,
          0.015 * this.model.simSpeedProperty.value,
          this.time,
        );

        this.newXTest = newXTest;
        this.newVxTest = newVTest;
        this.newAccelerationTest = newAccelerationTest;

        // this.equationDetectionPanel.opacity = 1;
        // if (drivingForceTest !== undefined) {
        //   this.existdrivingForceTest = true;
        // } else {
        //   this.existdrivingForceTest = false;
        // }
        // if (springForceTest !== undefined) {
        //   this.existspringForceTest = true;
        // } else {
        //   this.existspringForceTest = false;
        // }
        // if (dragForceTest !== undefined) {
        //   this.existdragForceTest = true;
        // } else {
        //   this.existdragForceTest = false;
        // }

        // this.updateEquationDetectionPanel();

        const boxLeft =
          this.playAreaCenter + this.newXTest * this.scale - this.boxWidth / 2;
        const boxCenter = boxLeft + this.boxWidth / 2;

        // Drag force vector
        if (dragForceTest !== 0 && this.showDragVectorProperty.value) {
          this.dragVectorCanvasTest.style.left = `${boxCenter - this.dragVectorCanvasTest.width / 2}px`;
          // drawVector(Math.abs(dragForceTest) <= 0.01 ? 0 : dragForceTest, this.dragVectorCtxTest, this.dragVectorCanvasTest, " #16960b ", "solid");
          // drawVector(Math.abs(dragForceTest) <= 0.01 ? 0 : dragForceTest, this.dragVectorCtxTest, this.dragVectorCanvasTest, "rgb(79, 204, 67) ", "solid");
          drawVector(
            Math.abs(dragForceTest) <= 0.01 ? 0 : dragForceTest,
            this.dragVectorCtxTest,
            this.dragVectorCanvasTest,
            "rgb(79, 204, 67) ",
            "hashed",
          );
        } else {
          this.dragVectorCtxTest.clearRect(
            0,
            0,
            this.dragVectorCanvasTest.width,
            this.dragVectorCanvasTest.height,
          );
        }

        // Spring force vector
        if (springForceTest !== 0 && this.showSpringVectorProperty.value) {
          this.springVectorCanvasTest.style.left = `${boxCenter - this.springVectorCanvasTest.width / 2}px`;
          // drawVector(Math.abs(springForceTest) <= 0.01 ? 0 : springForceTest, this.springVectorCtxTest, this.springVectorCanvasTest, " rgb(231, 77, 239) ", "dotted");
          drawVector(
            Math.abs(springForceTest) <= 0.01 ? 0 : springForceTest,
            this.springVectorCtxTest,
            this.springVectorCanvasTest,
            " yellow ",
            "dotted",
          );
        } else {
          this.springVectorCtxTest.clearRect(
            0,
            0,
            this.springVectorCanvasTest.width,
            this.springVectorCanvasTest.height,
          );
        }

        if (drivingForceTest !== 0 && this.showDrivingVectorProperty.value) {
          this.forceVectorCanvasTest.style.left = `${boxCenter - this.forceVectorCanvasTest.width / 2}px`;

          drawVector(
            Math.abs(drivingForceTest) < 0.01 ? 0 : drivingForceTest,
            this.forceVectorCtxTest,
            this.forceVectorCanvasTest,
            "#40bde8 ",
            "solidWithBorder",
          );
          // drawVector(Math.abs(drivingForceTest) < 0.01 ? 0 : drivingForceTest, this.forceVectorCtxTest, this.forceVectorCanvasTest, "#40bde8 ", "hashed");
        } else {
          this.forceVectorCtxTest.clearRect(
            0,
            0,
            this.forceVectorCanvasTest.width,
            this.forceVectorCanvasTest.height,
          );
        }

        // this.boxDOMNodeTest.left = 655 + (this.newXTest) * 57; // 60px per meter, origin at rest position
        this.boxCanvasTest.style.left = `${this.playAreaCenter + this.newXTest * this.scale - this.boxWidth / 2}px`;
        const extension = this.newXTest;
        const springHeightTest = 372 + extension * 57;

        // Redraw the spring to connect to the moving box
        this.springContextTest.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
        // this.springContextTest.clearRect(0, 0, 1240, 230);
        this.springContextTest.clearRect(0, 0, 1370, 230);
        // this.springContextTest.translate(1240 / 2, 230 / 2);
        this.springContextTest.translate(1370 / 2, 230 / 2);
        this.springContextTest.rotate(-Math.PI / 2);
        // this.springContextTest.translate(-1240 / 2, -230 / 2);
        this.springContextTest.translate(-1370 / 2, -230 / 2);

        this.springContextTest.strokeStyle = "black";
        this.springContextTest.lineWidth = 2;
        this.springContextTest.beginPath();
        // this.springContextTest.moveTo(1240 / 2, 0);
        this.springContextTest.moveTo(1370 / 2, 0);
        for (let i = 0; i <= 18; i++) {
          // const xPos = 1240 / 2 + (i % 2 === 0 ? -24 / 2 : 24 / 2);
          const xPos = 1370 / 2 + (i % 2 === 0 ? -24 / 2 : 24 / 2);
          const yPos = (i / 18) * springHeightTest;
          this.springContextTest.lineTo(xPos, yPos);
        }
        // this.springContextTest.lineTo(1240 / 2, springHeightTest);
        this.springContextTest.lineTo(1370 / 2, springHeightTest);
        this.springContextTest.stroke();
      } else {
        // this.equationDetectionPanel.opacity = 0;
      }

      // this.positionGraph.updateGraph(
      //   this.time,
      //   this.newXRef, // Pass the value to plot
      //   this.hasTest ? this.newXTest : null,
      //   'Time (s)',   // Dynamic x-axis label
      //   'Position (m)' // Dynamic y-axis label
      // );

      // this.velocityGraph.updateGraph(
      //   this.time,
      //   this.newVxRef, // Pass the value to plot
      //   this.hasTest ? this.newVxTest : null,
      //   'Time (s)',   // Dynamic x-axis label
      //   'Velocity (m/s)' // Dynamic y-axis label
      // );

      // this.accelerationGraph.updateGraph(
      //   this.time,
      //   newAccelerationRef, // Pass the value to plot
      //   this.hasTest ? this.newAccelerationTest : null,
      //   'Time (s)',   // Dynamic x-axis label
      //   'Acceleration (m/s²)' // Dynamic y-axis label
      // );

      this.graphUpdateCounter++;
      if (this.graphUpdateCounter >= this.GRAPH_UPDATE_INTERVAL) {
        this.updateGraphs();
        this.graphUpdateCounter = 0;
      }

      this.time += 0.015 * this.model.simSpeedProperty.value; // Increment time by 0.015 seconds, scaled by simSpeed
    }
  }

  private updateGraphs(): void {
    this.positionGraph.updateGraph(
      this.time,
      this.newXRef,
      this.hasTest ? this.newXTest : null,
      "Time (s)",
      "Position (m)",
    );

    this.velocityGraph.updateGraph(
      this.time,
      this.newVxRef,
      this.hasTest ? this.newVxTest : null,
      "Time (s)",
      "Velocity (m/s)",
    );

    this.accelerationGraph.updateGraph(
      this.time,
      this.newAccelerationRef,
      this.hasTest ? this.newAccelerationTest : null,
      "Time (s)",
      "Acceleration (m/s²)",
    );
  }
}
