import * as tf from "@tensorflow/tfjs-core";
import * as poseDetection from "@tensorflow-models/pose-detection";
// Register one of the TF.js backends.
import "@tensorflow/tfjs-backend-webgl";

let detector: poseDetection.PoseDetector | null = null;
let stage: string = "none";
let counter: number = 0;
let percentage: number = 0;

let brain: ml5.NeuralNetwork;
let modelState: string = 'waiting';
let targetLabel: string = '0';
let poses: poseDetection.Pose[] = []

interface Keypoint {
  x: number;
  y: number;
  score?: number; // Optional score
}

/**
 * Loads the MoveNet model if it hasn't been loaded already.
 */
export const loadMoveNetModel = async () => {
  try {
    if (!detector) {
      await tf.setBackend("webgl"); // Use the WebGL backend in the worker
      await tf.ready();

      detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        },
      );
    }
    return detector;
  } catch (error) {
    console.error("Error loading the model:", error);
  }
};

const calculateAngle = (
  A: { x: number; y: number },
  B: { x: number; y: number },
  C: { x: number; y: number },
) => {
  const radians =
    Math.atan2(C.y - B.y, C.x - B.x) - Math.atan2(A.y - B.y, A.x - B.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180) {
    angle = 360 - angle;
  }
  return angle;
};

// SQUATS
const detectSquats = (poses: poseDetection.Pose[]) => {
  if (poses.length > 0) {
    const keypoints = poses[0].keypoints;

    // Left leg keypoints
    const leftHip: Keypoint | undefined = keypoints.find(
      (kp) => kp.name === "left_hip",
    );
    const leftKnee: Keypoint | undefined = keypoints.find(
      (kp) => kp.name === "left_knee",
    );
    const leftAnkle: Keypoint | undefined = keypoints.find(
      (kp) => kp.name === "left_ankle",
    );

    // Right leg keypoints
    const rightHip: Keypoint | undefined = keypoints.find(
      (kp) => kp.name === "right_hip",
    );
    const rightKnee: Keypoint | undefined = keypoints.find(
      (kp) => kp.name === "right_knee",
    );
    const rightAnkle: Keypoint | undefined = keypoints.find(
      (kp) => kp.name === "right_ankle",
    );

    if (
      leftAnkle &&
      leftKnee &&
      leftHip &&
      rightAnkle &&
      rightKnee &&
      rightHip
    ) {
      // Check confidence score
      const leftLegValid =
        (leftHip?.score ?? 0) > 0.3 &&
        (leftKnee?.score ?? 0) > 0.3 &&
        (leftAnkle?.score ?? 0) > 0.3;
      const rightLegValid =
        (rightHip?.score ?? 0) > 0.3 &&
        (rightKnee?.score ?? 0) > 0.3 &&
        (rightAnkle?.score ?? 0) > 0.3;

      if (leftLegValid && rightLegValid) {
        // Calculate angles for both knees
        const angleLeftKnee = calculateAngle(leftAnkle, leftKnee, leftHip);
        const angleRightKnee = calculateAngle(rightAnkle, rightKnee, rightHip);

        // Define angle thresholds
        const standingAngle = 180; // Angle representing standing position
        const squatAngle = 100; // Angle representing the squat position

        // Calculate percentage for both legs and take the minimum (ensuring both legs squat together)
        let percentageLeft = 0;
        let percentageRight = 0;

        if (stage === "down") {
          // Map angle to percentage for down phase
          percentageLeft = Math.min(
            Math.max(
              ((angleLeftKnee - squatAngle) / (standingAngle - squatAngle)) *
                50 +
                50,
              50,
            ),
            100,
          );
          percentageRight = Math.min(
            Math.max(
              ((angleRightKnee - squatAngle) / (standingAngle - squatAngle)) *
                50 +
                50,
              50,
            ),
            100,
          );
        } else if (stage === "up") {
          // Map angle to percentage for up phase
          percentageLeft = Math.min(
            Math.max(
              ((standingAngle - angleLeftKnee) / (standingAngle - squatAngle)) *
                50,
              0,
            ),
            50,
          );
          percentageRight = Math.min(
            Math.max(
              ((standingAngle - angleRightKnee) /
                (standingAngle - squatAngle)) *
                50,
              0,
            ),
            50,
          );
        }

        // Take the minimum of the two percentages
        percentage = Math.min(percentageLeft, percentageRight);

        // Update squat stage
        /* if (angleLeftKnee > 169 && angleRightKnee > 169) {
          stage = "up";
        }

        if (angleLeftKnee <= 90 && angleRightKnee <= 90 && stage === "up") {
          stage = "down";
          counter += 1;
        } */
       // console.log(angleLeftKnee)
          if (angleLeftKnee > 169) {
            stage = "up";
          }
  
          if (angleLeftKnee <= 150 && stage === "up") {
            stage = "down";
            counter += 1;
          }

      }
    }
  }
  return { counter, percentage };
};

// LUNGES
const detectLunges = (poses: poseDetection.Pose[]) => {
  if (poses.length > 0) {
    const keypoints = poses[0].keypoints;

    // Left leg keypoints
    const leftHip: Keypoint | undefined = keypoints.find(
      (kp) => kp.name === "left_hip",
    );
    const leftKnee: Keypoint | undefined = keypoints.find(
      (kp) => kp.name === "left_knee",
    );
    const leftAnkle: Keypoint | undefined = keypoints.find(
      (kp) => kp.name === "left_ankle",
    );

    // Right leg keypoints
    const rightHip: Keypoint | undefined = keypoints.find(
      (kp) => kp.name === "right_hip",
    );
    const rightKnee: Keypoint | undefined = keypoints.find(
      (kp) => kp.name === "right_knee",
    );
    const rightAnkle: Keypoint | undefined = keypoints.find(
      (kp) => kp.name === "right_ankle",
    );

    if (
      leftAnkle &&
      leftKnee &&
      leftHip &&
      rightAnkle &&
      rightKnee &&
      rightHip
    ) {
      // Confidence score check for left and right leg
      const leftLegValid =
        (leftHip?.score ?? 0) > 0.3 &&
        (leftKnee?.score ?? 0) > 0.3 &&
        (leftAnkle?.score ?? 0) > 0.3;
      const rightLegValid =
        (rightHip?.score ?? 0) > 0.3 &&
        (rightKnee?.score ?? 0) > 0.3 &&
        (rightAnkle?.score ?? 0) > 0.3;

      if (leftLegValid && rightLegValid) {
        // Calculate angles for both legs
        const angleLeftKnee = calculateAngle(leftAnkle, leftKnee, leftHip);
        const angleRightKnee = calculateAngle(rightAnkle, rightKnee, rightHip);

        // Define angle thresholds for lunges
        const lungeAngleFront = 90; // Angle representing bent front leg in a lunge
        const lungeAngleBack = 170; // Angle representing extended back leg in a lunge
        const standingAngle = 180; // Full standing angle

        let percentage = 0;

        // Detect lunge when one leg is bent forward and the other is extended backward
        if (
          angleLeftKnee <= lungeAngleFront &&
          angleRightKnee >= lungeAngleBack
        ) {
          // Left leg is forward and right leg is backward (left lunge)
          percentage = Math.min(
            Math.max(
              ((angleLeftKnee - lungeAngleFront) /
                (standingAngle - lungeAngleFront)) *
                100,
              0,
            ),
            100,
          );
          //stage = 'leftLunge';
        } else if (
          angleRightKnee <= lungeAngleFront &&
          angleLeftKnee >= lungeAngleBack
        ) {
          // Right leg is forward and left leg is backward (right lunge)
          percentage = Math.min(
            Math.max(
              ((angleRightKnee - lungeAngleFront) /
                (standingAngle - lungeAngleFront)) *
                100,
              0,
            ),
            100,
          );
          //stage = 'rightLunge';
        }

        // Count a lunge when the form is detected
        if (percentage === 100) {
          counter += 1;
        }

        return { counter, percentage };
      }
    }
  }
  return { counter, percentage: 0 };
};

/**
 * Detects poses in an image, video, or canvas element using MoveNet.
 *
 * @param image - The HTMLImageElement, HTMLVideoElement, or HTMLCanvasElement to perform pose detection on.
 * @returns A Promise that resolves to an array of detected poses.
 */
export const detectPose = async (
  exercise: string,
  image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
): Promise<{
  poses: poseDetection.Pose[];
  counter: number;
  percentage: number;
}> => {
  if (!detector) {
    await loadMoveNetModel();
  }

  if (detector) {
    poses = await detector.estimatePoses(image, {
      maxPoses: 1, // Single pose detection
      flipHorizontal: false, // No flipping needed for normal camera usage
    });

    let result = { counter: 0, percentage: 0 };

    if (exercise === "squats") {
      result = detectSquats(poses); // Call the squat detection function
    } else if (exercise === "lunges") {
      result = detectLunges(poses); // Call the lunge detection function
    }

    if (modelState === 'collecting') {
      const inputs = []
      for (let i = 0; i < poses[0].keypoints.length; i++) {
        const x = poses[0].keypoints[i].x
        const y = poses[0].keypoints[i].y
        inputs.push(x)
        inputs.push(y)
      }
      const target = [targetLabel]
      console.log(inputs)
      brain.addData(inputs, target);
    }

    return { poses, counter: result.counter, percentage: result.percentage };
  }

  return { poses: [], counter: 0, percentage: 0 };
};

export const loadNeuralNetwork = async () => {
  const options = {
    inputs: 34,
    outputs: 2,
    task: 'classification',
    debug: true
  }
  brain = window.ml5.neuralNetwork(options);
  const modelInfo = {
    model: 'models/squats/model.json',
    metadata: 'models/squats/model_meta.json',
    weights: 'models/squats/model.weights.bin',
  };
  brain.load(modelInfo, brainLoaded);

}

export const createNeuralNetwork = async () => {
  const options = {
    inputs: 34,
    outputs: 2,
    task: 'classification',
    debug: true
  }
  brain = window.ml5.neuralNetwork(options);
  console.log(brain)
}

const brainLoaded = () => {
  console.log("pose classification ready!");
  // classifyPose()
}

export const classifyPose = async (pose: Pose) => {
  return new Promise((resolve, reject) => {
    brain.classify(pose, (results: any, error: any) => {
      if (error) {
        console.error("Classification error:", error);
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

export const posePressed = (exercise: string, position: string) => {
  console.log('posePressed', exercise, position)
  targetLabel = position

  setTimeout(() => {
    console.log('collecting')
    modelState = 'collecting'

    setTimeout(() => {
      console.log('not collecting')
      modelState = 'waiting'
    }, 10000)

  }, 3000)

}

export const savePose = () => {
  brain.saveData()
}

export const loadData = () => {
  brain.loadData('./models/squats/squats.json', dataReady)
}

const dataReady = () => {
  brain.normalizeData()
  const options = {
    epochs: 50
  }
  console.log(brain.data)
  brain.train(options, whileTraining, finishedTraining)
  console.log('data ready')
}

const whileTraining = (epoch: number, loss: number) => {
  console.log('training', epoch, loss)
}

const finishedTraining = () => {
  console.log('model trained')
  brain.save()
}