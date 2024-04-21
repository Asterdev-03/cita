"use client";

import { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Baby, Camera, CameraOff, SquareUserRound } from "lucide-react";
import * as faceapi from "face-api.js";

export default function Home() {
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

        console.log(detections);

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
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col gap-5 items-center justify-center">
        {videoStatus ? (
          <div className="relative h-full w-full overflow-hidden object-cover">
            <Webcam
              ref={webcamRef}
              audio={false}
              mirrored={false}
              videoConstraints={videoConstraints}
              disablePictureInPicture={true}
              className="inset-0 w-full h-full"
              onUserMedia={loadModelsWhenCamera}
              onUserMediaError={() =>
                console.error("Error accessing video or video access disbled")
              }
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
            />
          </div>
        ) : (
          <Baby className="size-max justify-center items-center">
            <SquareUserRound size={200} strokeWidth={1} absoluteStrokeWidth />
          </Baby>
        )}

        <button
          className="bg-blue-400 hover:bg-blue-500 transition duration-300 h-14 w-14 rounded-full flex justify-center items-center"
          onClick={handleVideo}
        >
          {videoStatus ? (
            <Camera absoluteStrokeWidth />
          ) : (
            <CameraOff absoluteStrokeWidth />
          )}
        </button>
      </div>
    </main>
  );
}
