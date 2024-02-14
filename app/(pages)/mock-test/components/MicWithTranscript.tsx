"use client";

import "regenerator-runtime";
import { MessageCircleOff, Mic, MicOff, SendHorizontal } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export const MicWithTranscript: React.FC = () => {
  const [voiceStatus, setVoiceStatus] = useState<boolean>(false);

  const divRef = useRef<HTMLDivElement>(null);
  const { transcript, resetTranscript } = useSpeechRecognition();

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

  function handleClear(): void {
    SpeechRecognition.stopListening();
    resetTranscript();
    setVoiceStatus(false);
  }

  useEffect(() => {
    // Scroll to the bottom when the transcript incresses
    if (divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight;
    }
  }, [transcript]); // Assuming transcript is a prop or state that changes

  return (
    <div>
      <div className="w-full h-20 border-2 bg-gray-50 rounded-3xl p-3 overflow-y-hidden grid grid-cols-12">
        <div className="col-span-10 overflow-y-auto" ref={divRef}>
          {transcript}
        </div>
        <button
          className="bottom-0 bg-red-400 hover:bg-red-500 transition duration-300 h-11 w-11 rounded-full flex justify-center items-center"
          onClick={handleVoice}
        >
          {voiceStatus ? (
            <Mic absoluteStrokeWidth />
          ) : (
            <MicOff absoluteStrokeWidth />
          )}
        </button>
        <button
          className="h-11 w-11 flex justify-center items-center bg-zinc-500 hover:bg-zinc-700 transition duration-300 rounded-full text-white"
          onClick={handleClear}
        >
          <MessageCircleOff />
        </button>
      </div>
    </div>
  );
};
