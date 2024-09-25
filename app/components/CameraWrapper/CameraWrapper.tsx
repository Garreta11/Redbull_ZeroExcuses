
'use client'
import styles from './CameraWrapper.module.scss'
import Webcam from "react-webcam";
import Stats from 'stats.js';
import { DataContext } from '../../contexts/DataContext';
import { useRef, useState, useEffect, useCallback, useContext } from "react";
import { loadMoveNetModel, detectPose } from "@/app/utils/movenet";
// import { CosmosSpinner } from "@cosmos/web/react";
// import useDeviceType from '@/app/hooks/useDeviceType';

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

/* interface VideoContraintsType {
  width: number,
  height: number,
  facingMode: string
} */

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
  ["right_knee", "right_ankle"]
];

const CameraWrapper: React.FC = () => {
  // const isMobile = useDeviceType();
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statsRef = useRef<Stats | null>(null);

  const [poses, setPoses] = useState<Pose[]>([]);
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);
  const [keypointsInside, setKeypointsInside] = useState<boolean[]>(Array(17).fill(false));
  const [loader, setLoader] = useState<boolean>(true)
  //const [videoConstraints, setVideoConstraints] = useState<VideoContraintsType>({width: 640, height: 480, facingMode: 'user'})

  const context = useContext(DataContext);
  // Check if context is undefined
  if (!context) {
    throw new Error('Character must be used within a DataProvider');
  }
  const { page, setRepetitions, allKeypointsInside, setAllKeypointsInside } = context

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user", // you can also set it to "environment" for back camera on mobile devices
  };

  const detectWebcamPose = useCallback(async () => {
    if (webcamRef.current && webcamRef.current.video?.readyState === 4 && isModelLoaded) {

      if (statsRef.current) statsRef.current.begin()

      const video = webcamRef.current.video as HTMLVideoElement;
      // const detectedPoses = await detectPose(video) as Pose[];
      const { poses: detectedPoses, counter: r, percentage: p } = await detectPose(video);
      setPoses(detectedPoses as Pose[]);
      setRepetitions(r);
      setLoader(false)
      console.log(p)

      if (statsRef.current) statsRef.current.end()
    }
  }, [isModelLoaded]);

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

/*   // check mobile
  useEffect(() => {
    if (isMobile) {
      setVideoConstraints({
        width: window.innerWidth,
        height: window.innerHeight,
        facingMode: 'user'
      })
    } else {
      setVideoConstraints({
        width: 640,
        height: 480,
        facingMode: "user"
      })
    }
  }, [isMobile]) */

  useEffect(() => {
    const loadModel = async () => {
      await loadMoveNetModel();
      setIsModelLoaded(true);
    };

    loadModel();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      detectWebcamPose();
    }, 10);  // Detect poses every 100ms
    return () => clearInterval(interval);
  }, [detectWebcamPose]);

  useEffect(() => {
    drawCanvas(poses, webcamRef.current!, canvasRef.current);
    if (page === 'captureBody') {
      drawRoundedRect(canvasRef.current, 210, 50, 220, 370, 30);
    }
  }, [poses, page])

  useEffect(() => {
    setAllKeypointsInside(keypointsInside.every(isInside => isInside));
  }, [keypointsInside])

  // draw dots and lines body tracking
  const drawCanvas = (poses: Pose[], webcam: Webcam, canvas: HTMLCanvasElement | null) => {
    if (!canvas) return

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!webcam.video) return;
    canvas.width = webcam.video.width;
    canvas.height = webcam.video.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(webcam.video, 0, 0, canvas.width, canvas.height);

    if (poses.length > 0) {
      const keypoints = poses[0].keypoints;

      // Define the rounded rectangle position and size
      const rectX = 195, rectY = 0, rectWidth = 250, rectHeight = 480;
      const newKeypointsInside = keypoints.map((kp: Keypoint) => {
        const isInside = isPointInRoundedRect(kp.x, kp.y, rectX, rectY, rectWidth, rectHeight);
        return isInside;  // Return whether the keypoint is inside the rect or not
      });

      // Update the state array
      setKeypointsInside(newKeypointsInside);

      // Draw lines between the skeleton keypoints
      skeleton.forEach(([partA, partB]) => {
        const kpA = keypoints.find(kp => kp.name === partA);
        const kpB = keypoints.find(kp => kp.name === partB);

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
  // Function to draw a rounded rectangle
  const drawRoundedRect = (canvas: HTMLCanvasElement | null, x: number, y: number, width:number, height:number, radius:number) => {
    if (!canvas) return
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set the style for the dotted border
    ctx.strokeStyle = allKeypointsInside? 'green' : 'gray';
    ctx.setLineDash([10, 2]);  // Dotted line: 5px dash, 5px gap
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();

    ctx.stroke();
  }

  // Helper function to check if a keypoint is inside the rounded rectangle
  const isPointInRoundedRect = (x: number, y: number, rectX: number, rectY: number, rectWidth: number, rectHeight: number) => {
    // Check if the point is within the rectangle boundaries
    return x >= rectX && x <= rectX + rectWidth && y >= rectY && y <= rectY + rectHeight;
  }

  return (
    <>
      <div className={`${styles.camera} ${page === 'captureBody' ? styles.camera__fullscreen : ''}`}>
        <Webcam
          ref={webcamRef}
          className={styles.camera__webcam}
          audio={false}
          height={videoConstraints.height}
          width={videoConstraints.width}
          videoConstraints={videoConstraints}
        />

        <canvas ref={canvasRef} className={styles.camera__canvas} />
      </div>
      {loader && (
        <div className={styles.loader}>
          <div className={styles.loader__icon} />
        </div>
      )}
    </>
  )
}

export default CameraWrapper;