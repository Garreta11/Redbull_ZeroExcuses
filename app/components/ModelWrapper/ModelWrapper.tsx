import { useEffect, useState, useRef } from 'react';
import styles from './ModelWrapper.module.scss'
import Webcam from "react-webcam";
import * as tmPose from "@teachablemachine/pose";

const ModelWrapper = () => {

  // URL for the model and metadata
  // const modelURL = '/models/model.json'; 
  //const metadataURL = '/models/metadata.json';

  // useRefs
  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modelRef = useRef<tmPose.CustomPoseNet | null>(null);
  const labelContainerRef = useRef<HTMLDivElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // useStates
  const [maxPredictions, setMaxPredictions] = useState<number>(0);

  const videoConstraints = {
    facingMode: "user", // you can also set it to "environment" for back camera on mobile devices
  };

  useEffect(() => {
    async function init() {
      try {
        const URL = "https://teachablemachine.withgoogle.com/models/q8OB0w0Tk/";
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        const loadedModel = await tmPose.load(modelURL, metadataURL);
        console.log(loadedModel)
        modelRef.current = loadedModel;
        const maxPred = loadedModel.getTotalClasses();
        setMaxPredictions(maxPred);

        requestAnimationFrame(loop);

        // append/get elements to the DOM
        if (!canvasRef.current) return
        const canvas = canvasRef.current as HTMLCanvasElement;
        canvas.width = webcamRef.current?.video?.videoWidth || 0;
        canvas.height = webcamRef.current?.video?.videoHeight || 0;
        ctxRef.current = canvas.getContext("2d") as CanvasRenderingContext2D;
        labelContainerRef.current = document.getElementById("label-container") as HTMLDivElement;
        for (let i = 0; i < maxPred; i++) { // and class labels
          labelContainerRef.current.appendChild(document.createElement("div"));
        }

      } catch (error) {
        console.error('Error loading model:', error);
      }
    }

    const loop = async () => {
     await predict();
    // requestAnimationFrame(loop);
    }

    const predict = async () => {
      if (modelRef.current && webcamRef.current && canvasRef.current && modelRef.current.model && labelContainerRef.current) {
        // Prediction #1: run input through posenet
        // estimatePose can take in an image, video or canvas html element
        const video = webcamRef.current.video as HTMLVideoElement;
        const { pose, posenetOutput } = await modelRef.current.estimatePose(canvasRef.current, false);
        // Prediction 2: run input through teachable machine classification model
        const prediction = await modelRef.current.predict(posenetOutput);

        for (let i = 0; i < maxPredictions; i++) {
          const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
          labelContainerRef.current.childNodes[i].innerHTML = classPrediction;
        }

        drawCanvas(canvasRef.current, video);
        console.log(pose)
      } else {
        console.error('modelRef.current or estimatePose is undefined');
      }
    }

    const drawCanvas = (canvas: HTMLCanvasElement, video: HTMLVideoElement) => {
      if (!canvas) return
      if (webcamRef.current) {
        ctxRef.current = canvas.getContext("2d") as CanvasRenderingContext2D;
        ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
        ctxRef.current.drawImage(video, 0, 0);
      }
    }

    init();
  }, []);
  

  return (
    <div className={styles.model}>
      <Webcam
          ref={webcamRef}
          className={styles.model__webcam}
          height='100%'
          width='100%'
          videoConstraints={videoConstraints}
        />
      <canvas ref={canvasRef} className={styles.model__canvas} />
      <div id="label-container"></div>
    </div>
  )
}

export default ModelWrapper;