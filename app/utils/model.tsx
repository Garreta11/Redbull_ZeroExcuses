interface ModelProps {
  inputs: number; // Define a more specific type if possible
  outputs: number; // Define a more specific type if possible
  task: string; // Define valid task strings if possible
  debug?: boolean; // Optional property
}

export default class Model {
  private model: any; // Define a more specific type if possible
  private brain: any; // Define a more specific type if possible
  
  constructor(props: ModelProps) {
    this.model = null;
    console.log("Model initialized");

    const options = {
      inputs: props.inputs,
      outputs: props.outputs,
      task: props.task,
      debug: props.debug
    }
    this.brain = window.ml5.neuralNetwork(options);
    const modelInfo = {
      model: 'models/squats/model.json',
      metadata: 'models/squats/metadata.json',
      weights: 'models/squats/weights.bin',
    };
    this.brain.load(modelInfo, this.brainLoaded);
  }

  private brainLoaded() {
    console.log("pose classification ready!");
    this.classifyPose();
  }

  private classifyPose() {
    console.log("classifying pose");
  }
}