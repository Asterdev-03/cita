"use client";

import React, { useEffect, useState } from "react";
// import { Metadata } from "next";
import { inter } from "@/lib/fonts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SendHorizontal } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { WebCamera } from "./components/WebCamera";
import TalkingAvatar from "./components/TalkingAvatar";
import { MicWithTranscript } from "./components/MicWithTranscript";
import TextToSpeech, { playVoice } from "./components/TextToSpeech";

// export const metadata: Metadata = {
//   title: "Mock Test",
// };

const MockTestPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState<number>(0);

  const initialTime: number = 10 * 60; // 10 minutes converted to seconds
  const [time, setTime] = useState<number>(initialTime);
  const [startSession, setStartSession] = useState<boolean>(false);
  const [endSession, setEndSession] = useState<boolean>(true);

  // const [isListeningDisabled, setIsListeningDisabled] = useState<boolean>(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (startSession && !endSession && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [startSession, endSession, time]);

  const fetchQuestions = async () => {
    const response = await fetch("/api/questions", {
      method: "GET",
    });
    if (response.status === 500) {
      throw new Error("Failed to delete");
    }
    const res = await response.json();
    setQuestions(res);
    // setIsListeningDisabled(false);
    playVoice(res[index], () => {
      console.log("stop");
      // setIsListeningDisabled(true); // Set isPlaying to false after speech synthesis is done
      // console.log(isListeningDisabled); // Set isPlaying to false after speech synthesis is done
    });
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  function handleSessionChange(): void {
    if (startSession) {
      // setVideoStatus(false);
      // setVoiceStatus(false);
      // SpeechRecognition.stopListening();
      // resetTranscript();
      setIsModalOpen(true);
    } else {
      setStartSession(true);
      setEndSession(false);
      fetchQuestions();
    }
  }

  function onEndSession() {
    setIsModalOpen(false);
    setEndSession(true);
    setStartSession(false);
    setTime(initialTime);
    setQuestions([]);
    setIndex(0);
  }

  async function handleSend() {
    if (index < questions.length - 1) {
      // setIsListeningDisabled(false);
      playVoice(questions[index + 1], () => {
        console.log("stop");
        // setIsListeningDisabled(true); // Set isPlaying to false after speech synthesis is done
        // setIsListeningDisabled(true); // Set isPlaying to false after speech synthesis is done
      });
      setIndex(index + 1);
    } else {
      onEndSession();
    }

    // SpeechRecognition.stopListening();
    // resetTranscript();
    // setVoiceStatus(false);
  }

  return (
    <section
      className={`${inter.className} min-h-screen bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-100`}
    >
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
                endSession ? `bg-green-500` : `bg-red-500 hover:bg-red-400`
              } transition duration-300 text-white rounded-full`}
              onClick={handleSessionChange}
            >
              {startSession ? "End Session" : "Start Session"}
            </button>
          </div>
        </div>
        <div className="flex flex-col w-full border-2 rounded-2xl bg-white p-4 gap-y-2">
          <div className="flex gap-x-2">
            <div className="relative h-[450px] w-2/3 bg-gray-100 rounded-2xl overflow-hidden">
              <TalkingAvatar />
              <div className="absolute min-h-[50px] h-fit bottom-0 text-center w-full backdrop-blur-md bg-gray-50/50 p-4">
                <p>{questions ? questions[index] : ""}</p>
              </div>
            </div>
            <div className="h-[450px] w-1/3 bg-gray-100 rounded-2xl flex flex-col overflow-hidden">
              <div className="relative h-4/5 flex items-center justify-center">
                <WebCamera />
              </div>
              <div className="flex items-center justify-center grow gap-x-5"></div>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-x-2">
            <div className="col-span-11 w-full">
              <MicWithTranscript />
            </div>
            <div className="flex col-span-1s justify-center items-center">
              <button
                className="h-11 w-11 flex justify-center items-center bg-zinc-500 hover:bg-zinc-700 transition duration-300 rounded-full text-white"
                onClick={handleSend}
              >
                <SendHorizontal absoluteStrokeWidth />
              </button>
            </div>
          </div>
        </div>
      </div>
      <TextToSpeech />
      <Dialog
        open={isModalOpen}
        onOpenChange={(vis: boolean) => {
          if (!vis) {
            setIsModalOpen(vis);
          }
        }}
      >
        <DialogContent className="w-2/3">
          <DialogHeader>
            <DialogTitle>End Session</DialogTitle>
            <DialogDescription>
              Do you want to end the session ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setIsModalOpen(false);
                setEndSession(false);
              }}
              className={buttonVariants({
                size: "lg",
                variant: "custom1",
                className: "mt-5 rounded-xl",
              })}
            >
              Cancel
            </Button>
            <Button
              onClick={onEndSession}
              className={buttonVariants({
                size: "lg",
                variant: "default",
                className: "mt-5 rounded-xl",
              })}
            >
              End
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default MockTestPage;
