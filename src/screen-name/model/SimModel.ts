import { Property } from "scenerystack/axon";
export class SimModel {
  public initialPositionProperty: Property<number> = new Property(3);
  public initialVelocityProperty: Property<number> = new Property(0);
  public initialOmegaProperty: Property<number> = new Property(3);
  public gammaProperty: Property<number> = new Property(0);
  public betaProperty: Property<number> = new Property(0.5);
  public fProperty: Property<number> = new Property(1);
  public omegaProperty: Property<number> = new Property(1);
  public simSpeedProperty: Property<number> = new Property(1);
  public vdotxEQProperty: Property<string> = new Property(new URLSearchParams(window.location.search).get("formula") === "true" ? "-\\omega_0^2\\cdot x-\\beta\\cdot v+f\\cdot\\sin\\left(\\omega\\cdot t\\right)" : "");
  public xdotEQProperty: Property<string> = new Property(new URLSearchParams(window.location.search).get("formula") === "true" ? "v" : "");
  public pausedProperty: Property<boolean> = new Property(false);




  initialPosition: number;
  initialVelocity: number;
  vdotxEQ: string;
  xdotEQ: string;
  gamma: number;
  beta: number;
  f: number;
  initialOmega: number;
  omega: number;
  simSpeed: number;
  paused: boolean;

  constructor() {

    this.initialPosition = this.initialPositionProperty.value;
    this.initialVelocity = this.initialVelocityProperty.value;
    this.initialOmega = this.initialOmegaProperty.value;
    this.gamma = this.gammaProperty.value;
    this.beta = this.betaProperty.value;
    this.f = this.fProperty.value;
    this.omega = this.omegaProperty.value;
    this.simSpeed = this.simSpeedProperty.value;
    this.vdotxEQ = this.vdotxEQProperty.value;
    this.xdotEQ = this.xdotEQProperty.value;
    this.paused = this.pausedProperty.value;


    
    
    

  }





  public reset(): void {
    // Called when the user presses the reset-all button
    this.initialPosition = this.initialPositionProperty.value;
    this.initialVelocity = this.initialVelocityProperty.value;
    this.initialOmega = this.initialOmegaProperty.value;
    this.gamma = this.gammaProperty.value;
    this.beta = this.betaProperty.value;
    this.f = this.fProperty.value;
    this.omega = this.omegaProperty.value;
    this.vdotxEQ = this.vdotxEQProperty.value;
    this.xdotEQ = this.xdotEQProperty.value;
    this.simSpeed = this.simSpeedProperty.value;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public step(_dt: number): void {
    // Called every frame, with the time since the last frame in seconds
  }
}