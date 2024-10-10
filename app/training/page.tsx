'use client'
import styles from './Page.module.scss'
import React, { useEffect,useRef, useState, useCallback } from 'react';
import Script from 'next/script';
import {Camera} from 'react-camera-pro';
import { loadMoveNetModel, detectPose, posePressed, savePose, loadNeuralNetwork, classifyPose } from "@/app/utils/posedetection";
// import { useSearchParams } from "next/navigation";

import { CosmosButton } from "@cosmos/web/react";
import Stats from "stats.js";



// Interface declarations
interface Keypoint {
  x: number;
  y: number;
  score: number;
  name: string;
}
interface Pose {
  keypoints: Keypoint[];
  score: number;
}

// Define the skeleton pairs
const skeleton = [
  ["right_ear", "right_eye"],
  ["right_eye", "nose"],
  ["nose", "left_eye"],
  ["left_eye", "left_ear"],
  ["left_shoulder", "right_shoulder"],
  ["left_shoulder", "left_elbow"],
  ["left_elbow", "left_wrist"],
  ["right_shoulder", "right_elbow"],
  ["right_elbow", "right_wrist"],
  ["left_hip", "right_hip"],
  ["left_shoulder", "left_hip"],
  ["right_shoulder", "right_hip"],
  ["left_hip", "left_knee"],
  ["left_knee", "left_ankle"],
  ["right_hip", "right_knee"],
  ["right_knee", "right_ankle"],
];

const TrainingDataPage = () => {
  const cameraRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<Stats>(null);

  const [ml5Loaded, setMl5Loaded] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);
  const [isNeuralNetworkLoaded, setIsNeuralNetworkLoaded] = useState<boolean>(false);
  const [predictedLabel, setPredictedLabel] = useState<string | null>(null);
  const [predictedConfidence, setPredictedConfidence] = useState<string | null>(null);

  const [poses, setPoses] = useState<Pose[]>([]);

  // const searchParams = useSearchParams();
  // const exerciseName = searchParams.get("exercise") || "squats";
  const exerciseName = 'squats'

   // Initialize stats.js
   useEffect(() => {
    const stats = new Stats();
    stats.showPanel(0); // 0 = FPS panel
    statsRef.current = stats;
    document.body.appendChild(stats.dom); // Append stats.js panel to the document body

    return () => {
      if (statsRef.current && document.body.contains(statsRef.current.dom)) {
        document.body.removeChild(statsRef.current.dom); // Clean up the panel on component unmount
      }
    };
  }, []);


  // KEYBOARD EVENTS
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log('keydown', event.key)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // MOVENET MODEL LOADING
  useEffect(() => {
    const loadMoveNet = async () => {
      await loadMoveNetModel();
      setIsModelLoaded(true);
    };

    const loadModel = async () => {
      await loadNeuralNetwork()
      setIsNeuralNetworkLoaded(true)
    }

    if (ml5Loaded) {
      loadMoveNet()
      // createNeuralNetwork()
      loadModel()
    }
  }, [ml5Loaded])

  // DETECTING POSE FUNCTION
  const detectWebcamPose = useCallback(async () => {
    if (
      containerRef.current && cameraRef.current && isModelLoaded && isNeuralNetworkLoaded
    ) {
      if (statsRef.current) statsRef.current.begin();
      const video = containerRef.current.getElementsByTagName('video')[0] as HTMLVideoElement;
      const { poses: detectedPoses} = await detectPose(exerciseName, video);
      //setPoses(detectedPoses as Pose[]);
      // console.log(detectedPoses)
      console.log('Detected Poses')
      setPoses(detectedPoses as Pose[]);
      if (detectedPoses.length > 0) {
        const inputs = []
        for (let i = 0; i < detectedPoses[0].keypoints.length; i++) {
          const x = detectedPoses[0].keypoints[i].x
          const y = detectedPoses[0].keypoints[i].y
          inputs.push(x)
          inputs.push(y)
        }
        // Assuming you have a classifyPose function that returns a prediction result
        const result = await classifyPose(inputs); // Classify the first pose
  
        if (Array.isArray(result) && result.length > 0) {
          setPredictedLabel(result[0].label); // Store label in state for use
          setPredictedConfidence((Math.round(result[0].confidence * 100) / 100).toFixed(2))

        }

      }
      if (statsRef.current) statsRef.current.end();
    }
  }, [isModelLoaded, isNeuralNetworkLoaded, exerciseName]);

  // DETECTING POSE INTERVAL
  useEffect(() => {
    const interval = setInterval(() => {
      detectWebcamPose();
    }, 10);  // Detect poses every 100ms
    return () => clearInterval(interval);
  }, [detectWebcamPose]);

  // DRAWING CANVAS
  useEffect(() => {
    drawCanvas(poses, containerRef.current!);
  }, [poses]);

  // Function to draw dots and lines body tracking
  const drawCanvas = (
    poses: Pose[],
    container: HTMLDivElement,
  ) => {
    if (!container) return;

    const canvas = container.getElementsByTagName('canvas')[0] as HTMLCanvasElement;
    const video = container.getElementsByTagName('video')[0] as HTMLVideoElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (poses.length > 0) {
      const keypoints = poses[0].keypoints;

      // Draw lines between the skeleton keypoints
      skeleton.forEach(([partA, partB]) => {
        const kpA = keypoints.find((kp) => kp.name === partA);
        const kpB = keypoints.find((kp) => kp.name === partB);

        if (kpA && kpB && kpA.score > 0.5 && kpB.score > 0.5) {
          ctx.beginPath();
          ctx.moveTo(kpA.x, kpA.y);
          ctx.lineTo(kpB.x, kpB.y);
          ctx.strokeStyle = "green";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      // Draw circles on each keypoint
      keypoints.forEach((kp: Keypoint) => {
        const { x, y } = kp;
        if (kp.score > 0.5) {
          // Draw the keypoints
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = "red";
          ctx.fill();
        }
      });
    }
  }

  const handlePosition = (exercise: string, position: string) => {
    posePressed(exercise, position)
  }

  const handleSavePose = () => {
    savePose()
  }

  return (
    <div className={styles.page}>
      <Script
        type='text/javascript'
        src='https://unpkg.com/ml5@1.0.2/dist/ml5.min.js'
        onLoad={() => {
          setMl5Loaded(true);
        }}
      ></Script>
      <div className={styles.page__camera} ref={containerRef}>
        <Camera
          ref={cameraRef}
          errorMessages={{
            noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
            permissionDenied: 'Permission denied. Please refresh and give camera permission.',
            switchCamera:
              'It is not possible to switch camera to different one because there is only one video device accessible.',
            canvas: 'Canvas is not supported.',
          }}
        />
      </div>
      <div className={styles.page__exercise}>
        {exerciseName === 'squats' && (
          <div>
            <h1>Squats</h1>
            <div className={styles.page__exercise__buttons}>
              <CosmosButton
                onClick={() => handlePosition(exerciseName, 'neutral')}
                kind='primary'
                size='small'
              >
                Neutral
              </CosmosButton>
              <CosmosButton
                onClick={() => handlePosition(exerciseName, 'squats')}
                kind='primary'
                size='small'
              >
                Squat
              </CosmosButton>
            </div>
            <CosmosButton
              onClick={() => handleSavePose()}
              kind='primary'
              size='small'
            >
              Save
            </CosmosButton>
            <h2>{predictedLabel} - {predictedConfidence}</h2>
          </div>
        )}
        
      </div>
    </div>
  )
};

export default TrainingDataPage;
