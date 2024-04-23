"use client";

import { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Avatar } from "@/components/ui/avatar";
import { Camera, CameraOff, SquareUserRound } from "lucide-react";
import * as faceapi from "face-api.js";

interface EmotionValues {
  angry: number;
  sad: number;
  neutral: number;
  happy: number;
  surprised: number;
}

interface WebcamProps {
  setTotalDetectionTime: (value: any) => void;
  setEmotionValues: (value: any) => void;
}

const WebCamera: React.FC<WebcamProps> = ({
  setTotalDetectionTime,
  setEmotionValues,
}) => {
  const [videoStatus, setVideoStatus] = useState<boolean>(false);

  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function handleVideo(): void {
    setVideoStatus((prevVideoStatus) => !prevVideoStatus);
  }

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  // LOAD MODELS FROM FACE API

  const loadModelsWhenCamera = () => {
    // console.log(webcamRef.current?.video);
    Promise.all([
      // THIS FOR FACE DETECT AND LOAD FROM YOU PUBLIC/MODELS DIRECTORY
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    ]).then(() => {
      expressionDetect();
    });
  };

  const expressionDetect = () => {
    setInterval(async () => {
      if (webcamRef.current && webcamRef.current.video) {
        const detections = await faceapi
          .detectAllFaces(
            webcamRef.current?.video!!,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceLandmarks()
          .withFaceExpressions();

        if (detections.length === 0) return;

        const newValues = detections[0].expressions;
        // console.log(newValues);

        //set emotion score values
        setEmotionValues((prevValues: EmotionValues) => {
          // Create a copy of previous values
          const updatedValues: EmotionValues = { ...prevValues };

          // Iterate over the keys of newValues and update corresponding values in updatedValues
          for (const key in newValues) {
            if (
              newValues.hasOwnProperty(key) &&
              updatedValues.hasOwnProperty(key)
            ) {
              // Type assertion for the key
              const emotionKey = key as keyof EmotionValues;
              updatedValues[emotionKey] += newValues[emotionKey];
            }
          }
          return updatedValues;
        });
        setTotalDetectionTime((prevTime: number) => {
          // console.log(prevTime);
          return prevTime + 1;
        });

        // DRAW YOU FACE IN CANVAS

        // ensure that the webcam video is fully loaded before attempting to create a canvas from it
        if (webcamRef.current && webcamRef.current.video) {
          faceapi.createCanvasFromMedia(webcamRef.current?.video!!);
        }

        if (canvasRef.current) {
          const displaySize = {
            width: webcamRef.current.video?.videoWidth,
            height: webcamRef.current.video?.videoHeight,
          };

          // setting the dimensions of canvas
          canvasRef.current.width = displaySize.width;
          canvasRef.current.height = displaySize.height;

          // giving the canvas and the size to the api
          faceapi.matchDimensions(canvasRef.current, displaySize);

          const resized = faceapi.resizeResults(detections, displaySize);

          const context = canvasRef.current.getContext("2d");

          if (context) {
            context.clearRect(
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height
            );
            faceapi.draw.drawDetections(canvasRef.current, resized);
            faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
            faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
          }
        }
      }
    }, 1000);
  };

  return (
    <div className="relative flex flex-col gap-5 items-center justify-center">
      {videoStatus ? (
        <div className="relative h-full w-full overflow-hidden object-cover">
          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored={false}
            // videoConstraints={videoConstraints}
            // disablePictureInPicture={true}
            // className="inset-0 w-full h-full"
            // style={{ transform: "scaleX(-1)" }}
            muted={true}
            // videoConstraints={videoConstraints}
            disablePictureInPicture={true}
            className="h-full w-full overflow-hidden object-cover"
            style={{ transform: "scaleX(-1)" }}
            onUserMedia={loadModelsWhenCamera}
            onUserMediaError={() =>
              console.error("Error accessing video or video access disbled")
            }
          />
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
      ) : (
        <Avatar className="size-max justify-center items-center">
          <SquareUserRound size={200} strokeWidth={1} absoluteStrokeWidth />
        </Avatar>
      )}

      <button
        className="bottom-0 bg-blue-400 hover:bg-blue-500 transition duration-300 h-14 w-14 rounded-full flex justify-center items-center"
        onClick={handleVideo}
      >
        {videoStatus ? (
          <Camera absoluteStrokeWidth />
        ) : (
          <CameraOff absoluteStrokeWidth />
        )}
      </button>
    </div>
  );
};

export default WebCamera;
