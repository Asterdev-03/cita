"use client";

import { Avatar } from "@/components/ui/avatar";
import { Camera, CameraOff, SquareUserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

const WebCamera = () => {
  const [videoStatus, setVideoStatus] = useState<boolean>(false);

  const webcamRef = useRef<Webcam>(null);

  function handleVideo(): void {
    setVideoStatus((prevVideoStatus) => !prevVideoStatus);
  }

  async function startVideoStream(): Promise<void> {
    if (
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video to be displayed based on the actual width and height of the direct video from camera
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
    }
  }

  useEffect(() => {
    startVideoStream();
  }, []);

  return (
    <div className="relative flex flex-col gap-5 items-center justify-center">
      {videoStatus ? (
        <Webcam
          ref={webcamRef}
          muted={true}
          audio={false}
          className="h-full w-full overflow-hidden object-cover"
          style={{ transform: "scaleX(-1)" }}
        />
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
