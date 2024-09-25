import * as tf from '@tensorflow/tfjs-core';
import * as poseDetection from '@tensorflow-models/pose-detection';
// Register one of the TF.js backends.
import '@tensorflow/tfjs-backend-webgl';

let detector: poseDetection.PoseDetector | null = null;
let stage: string = 'none';
let counter: number = 0;
let percentage: number = 0;

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
      await tf.setBackend('webgl'); // Use the WebGL backend in the worker
      await tf.ready();

      detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
      });
    }
    return detector;
  } catch (error) {
    console.error('Error loading the model:', error);
  }
};

const calculateAngle = (A: {x: number, y: number}, B: {x: number, y: number}, C: {x: number, y: number}) => {
  const radians = Math.atan2(C.y - B.y, C.x - B.x) - Math.atan2(A.y - B.y, A.x - B.x);
  let angle = Math.abs(radians * 180.0 / Math.PI);
  if (angle > 180) {
    angle = 360 - angle;
  }
  return angle;
};

const detectSquat = (poses: poseDetection.Pose[]) => {
  if (poses.length > 0) {
    const keypoints = poses[0].keypoints;
    // const leftShoulder = keypoints.find(kp => kp.name === 'right_shoulder');
    const leftHip: Keypoint | undefined  = keypoints.find(kp => kp.name === 'right_hip');
    const leftKnee: Keypoint | undefined = keypoints.find(kp => kp.name === 'right_knee');
    const leftAnkle: Keypoint | undefined = keypoints.find(kp => kp.name === 'right_ankle');

    if (leftAnkle && leftKnee && leftHip) {    
      if (
        (leftHip?.score ?? 0) > 0.3 &&
        (leftKnee?.score ?? 0) > 0.3 &&
        (leftAnkle?.score ?? 0) > 0.3
      ) {
        
        const angleLeftKnee = calculateAngle(leftAnkle, leftKnee, leftHip);
        /* const leftKneeAngle = 180 - angleLeftKnee;
        
        const angleLeftHip = calculateAngle(leftAnkle, leftKnee, leftHip);
        const leftHipAngle = 180 - angleLeftKnee */

        // console.log(angleLeftKnee)

        // Define angle thresholds
        const standingAngle = 180; // Angle representing standing position
        const squatAngle = 100; // Angle representing the squat position

        if (stage === 'down') {
          // Map angle to percentage for down phase
          percentage = Math.min(Math.max(((angleLeftKnee - squatAngle) / (standingAngle - squatAngle)) * 50 + 50, 50), 100);
        } else if (stage === 'up') {
          // Map angle to percentage for up phase
          percentage = Math.min(Math.max(((standingAngle - angleLeftKnee) / (standingAngle - squatAngle)) * 50, 0), 50);
        }

        // Smooth percentage transition
        // setPercentage(prevPercentage => (prevPercentage + percentage) / 2);

        if (angleLeftKnee > 169) {
          stage = 'up'
        }

        if (angleLeftKnee <= 90 && stage == 'up') {
          stage="down"
          counter += 1
        }
      }
    }
  }
  return {counter, percentage};
};

/**
 * Detects poses in an image, video, or canvas element using MoveNet.
 * 
 * @param image - The HTMLImageElement, HTMLVideoElement, or HTMLCanvasElement to perform pose detection on.
 * @returns A Promise that resolves to an array of detected poses.
 */
export const detectPose = async (image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement): Promise<{ poses: poseDetection.Pose[]; counter: number; percentage: number }> => {  if (!detector) {
    await loadMoveNetModel();
  }

  if (detector) {
    const poses = await detector.estimatePoses(image, {
      maxPoses: 1,   // Single pose detection
      flipHorizontal: false,  // No flipping needed for normal camera usage
    });

    const {counter, percentage} = detectSquat(poses);  // Call the squat detection function

    return { poses, counter, percentage};
  }

  return { poses: [], counter: 0, percentage: 0 };
};
