"use client";

import React, { useState, useEffect } from "react";

let voicesList: SpeechSynthesisVoice[] | null = null;

async function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  const synth = window.speechSynthesis;

  return new Promise((resolve) => {
    synth.onvoiceschanged = () => {
      if (synth.getVoices().length > 0) {
        voicesList = synth.getVoices();
        resolve(voicesList);
      }
    };

    if (synth.getVoices().length > 0) {
      voicesList = synth.getVoices();
      resolve(voicesList);
    }
  });
}

export async function playVoice(question: string, callback: () => void) {
  const synth = window.speechSynthesis;

  if (!voicesList) {
    await loadVoices();
  }

  const utterance = new SpeechSynthesisUtterance(question);

  if (voicesList && voicesList.length > 0) {
    utterance.voice = voicesList[0]; // Choose the first available voice
  }

  utterance.pitch = 0;
  utterance.rate = 1;
  utterance.volume = 1;

  utterance.onend = () => {
    callback(); // Call the callback function to set isPlaying to false
  };

  synth.speak(utterance);
}
