"use client";

import "regenerator-runtime/runtime";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Avatar } from "antd";

import {
  AudioMutedOutlined,
  AudioOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  SendOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";

import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

const MockTestPage: React.FC = () => {
  const [voiceStatus, setVoiceStatus] = useState<Boolean>(false);
  const [videoStatus, setVideoStatus] = useState<Boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<Boolean>(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);

  const divRef = useRef<HTMLDivElement>(null);
  const { transcript, resetTranscript } = useSpeechRecognition();
  const webcamRef = useRef<Webcam>(null);

  const router = useRouter();

  useEffect(() => {
    startVideoStream();
  }, []);

  useEffect(() => {
    // Scroll to the bottom when the transcript incresses
    if (divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight;
    }
  }, [transcript]); // Assuming transcript is a prop or state that changes

  const initialTime: number = 10 * 60; // 10 minutes converted to seconds
  const [time, setTime] = useState<number>(initialTime);
  const [endSession, setEndSession] = useState<Boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!endSession && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [endSession, time]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };

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

  function handleEndSession(): void {
    setEndSession(true);
    setVideoStatus(false);
    setVoiceStatus(false);
    SpeechRecognition.stopListening();
    resetTranscript();
    setIsModalOpen(true);
  }

  function handleSend(): void {
    SpeechRecognition.stopListening();
    resetTranscript();
    setVoiceStatus(false);
  }

  function handleVoice(): void {
    if (!voiceStatus) {
      setVoiceStatus(true);
      SpeechRecognition.startListening({
        continuous: true,
        language: "en-IN",
      });
    } else {
      setVoiceStatus(false);
      SpeechRecognition.stopListening();
    }
  }

  function handleVideo(): void {
    setVideoStatus((prevVideoStatus) => !prevVideoStatus);
  }

  return (
    <section className="min-h-screen bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-100">
      <nav className="p-3 flex justify-between items-center bg-white/70 border-b-3 border-gray-200 shadow-md">
        <Image
          src="/images/fulllogo.png"
          alt="logo"
          height={60}
          width={110}
          sizes="100vw"
        />
        <Avatar size={40} icon={<UserOutlined />} />
      </nav>
      <div className="flex flex-row p-5 gap-4">
        <div className="w-1/4 p-4 border-2 rounded-2xl bg-zinc-50">
          <div className="grid grid-cols-1 h-full">
            <h2 className="font-[1000] text-[50px]">Hello Ken,</h2>
            <p className="text-xl">
              You are being interviewed for <br />
              <span className="font-black text-left text-[40px] text-purple-800 leading-10">
                Junior Software Engineer
              </span>
            </p>
            <div>
              <h3 className="font-semi-bold text-lg">Time elapsed:</h3>
              <h4 className="font-black text-[50px]">{formatTime(time)}</h4>
            </div>
            <button
              className={`p-3 ${
                endSession ? `bg-gray-300` : `bg-red-500 hover:bg-red-400`
              } transition duration-300 text-white rounded-full`}
              onClick={handleEndSession}
              disabled={endSession === true}
            >
              End Session
            </button>
          </div>
        </div>
        <div className="flex flex-col w-full border-2 rounded-2xl bg-white p-4 gap-y-2">
          <div className="flex gap-x-2">
            <div className="relative h-[450px] w-2/3 bg-gray-100 rounded-2xl overflow-hidden">
              <Image
                src="/images/avatar.png"
                alt="avatar"
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />

              <div className="absolute min-h-[50px] h-fit bottom-0 text-center w-full backdrop-blur-md bg-gray-50/50 p-4">
                <p>
                  What are your expectations on working at our company in the
                  long run?
                </p>
              </div>
            </div>
            <div className="h-[450px] w-1/3 bg-gray-100 rounded-2xl flex flex-col overflow-hidden">
              <div className="relative h-4/5 flex items-center justify-center">
                {videoStatus ? (
                  <Webcam
                    ref={webcamRef}
                    muted={true}
                    audio={false}
                    className="h-full w-full overflow-hidden object-cover"
                    style={{ transform: "scaleX(-1)" }}
                  />
                ) : (
                  <Avatar size={200} icon={<UserOutlined />} />
                )}
              </div>
              <div className="flex items-center justify-center grow gap-x-5">
                <button
                  className="bottom-0 bg-red-400 hover:bg-red-500 transition duration-300 h-12 w-12 rounded-full"
                  onClick={handleVoice}
                >
                  {voiceStatus ? <AudioOutlined /> : <AudioMutedOutlined />}
                </button>
                <button
                  className="bottom-0 bg-blue-400 hover:bg-blue-500 transition duration-300 h-12 w-12 rounded-full"
                  onClick={handleVideo}
                >
                  {videoStatus ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                </button>
              </div>
            </div>
          </div>
          <div className="w-full h-20 border-2 bg-gray-50 rounded-3xl p-3 overflow-y-hidden grid grid-cols-12">
            <div className="col-span-11 overflow-y-auto" ref={divRef}>
              {transcript}
            </div>
            <button
              className="h-11 w-11 justify-self-center self-center bg-zinc-500 hover:bg-zinc-700 transition duration-300 rounded-full text-white"
              onClick={handleSend}
            >
              <SendOutlined />
            </button>
          </div>
        </div>
      </div>
      <Modal
        title={
          <h2 className="text-2xl font-semibold font-poppins">Session Ended</h2>
        }
        open={isModalOpen === true}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => router.push("/setup")}
        okButtonProps={{ className: "bg-blue-500" }}
        // footer={null}
        // width="70vw"
      ></Modal>
    </section>
  );
};

export default MockTestPage;
