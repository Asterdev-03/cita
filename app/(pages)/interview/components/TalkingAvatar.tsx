"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons";
import {
  VRMExpressionPresetName,
  VRMHumanBoneName,
  VRMLoaderPlugin,
} from "@pixiv/three-vrm";

interface TalkingAvatarProps {
  isUserSpeaking: boolean;
}

const TalkingAvatar: React.FC<TalkingAvatarProps> = ({ isUserSpeaking }) => {
  // Global variables
  const containerRef = useRef<HTMLDivElement>(null);
  const camera = new THREE.PerspectiveCamera(30.0, 700 / 500, 0.1, 50.0);
  const scene = new THREE.Scene();
  const clock = new THREE.Clock();
  const lookAtTarget = new THREE.Object3D();

  let currentVrm: any = undefined;
  let renderer: THREE.WebGLRenderer | null = null;
  let blinkInterval: ReturnType<typeof setInterval> | null = null;
  let audioContext: AudioContext | null = null;
  let analyser: AnalyserNode | null = null;
  let mediaStream: MediaStream | null = null;
  let timeoutId: NodeJS.Timeout | null = null;

  let mouthThreshold = 1;
  let mouthBoost = 10;
  let bodyThreshold = 15;
  let bodyMotion = 10;

  const [vrm, setVrm] = useState<any>(null);

  const loadModel = (url: string) => {
    if (containerRef.current && containerRef.current.children.length > 0) {
      // console.log("Model is already loaded.");
      return;
    }
    const loader = new GLTFLoader();
    loader.register((parser: any) => {
      return new VRMLoaderPlugin(parser);
    });
    loader.load(
      url,
      (gltf: any) => {
        scene.add(gltf.scene);

        currentVrm = gltf.userData.vrm;
        // console.log(currentVrm);
        setVrm(currentVrm);
        initializeAvatar();
      },
      (progress: any) => {
        // console.log(
        //   "Loading model...",
        //   100.0 * (progress.loaded / progress.total),
        //   "%"
        // );
      },
      (error: any) => console.error(error)
    );
  };

  const initializeAvatar = () => {
    currentVrm.humanoid.getNormalizedBoneNode(
      VRMHumanBoneName["Hips"]
    ).rotation.y = Math.PI;
    currentVrm.springBoneManager.reset();
    setVrm(currentVrm);

    setupBoneRotations();
  };

  const setupBoneRotations = () => {
    currentVrm.humanoid.getNormalizedBoneNode(
      VRMHumanBoneName["RightUpperArm"]
    ).rotation.z = 250;
    currentVrm.humanoid.getNormalizedBoneNode(
      VRMHumanBoneName["RightLowerArm"]
    ).rotation.z = -0.2;
    currentVrm.humanoid.getNormalizedBoneNode(
      VRMHumanBoneName["LeftUpperArm"]
    ).rotation.z = -250;
    currentVrm.humanoid.getNormalizedBoneNode(
      VRMHumanBoneName["LeftLowerArm"]
    ).rotation.z = 0.2;
    setVrm(currentVrm);
  };

  const setupRenderer = () => {
    if (!containerRef.current) return;
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    // console.log(700, 500);
    renderer.setSize(700, 500);
    renderer.setPixelRatio(window.devicePixelRatio);

    camera.position.set(0, 1.5, 1.3);

    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1.0, 1.0, 1.0).normalize();
    scene.add(light);

    camera.add(lookAtTarget);

    containerRef.current.appendChild(renderer.domElement);
  };

  const startAnimation = () => {
    function animate() {
      if (!renderer) return;
      requestAnimationFrame(animate);
      const deltaTime = clock.getDelta();
      if (currentVrm) {
        currentVrm.update(deltaTime);
        setVrm(currentVrm);
      }
      renderer.render(scene, camera);
    }
    animate();
  };

  const startBlinking = () => {
    const blinkTimeout = Math.floor(Math.random() * 250) + 50;
    lookAtTarget.position.y = camera.position.y - camera.position.y * 2 + 1.25;

    setTimeout(() => {
      if (currentVrm) {
        currentVrm.expressionManager.setValue(VRMExpressionPresetName.Blink, 0);
      }
    }, blinkTimeout);

    if (currentVrm) {
      currentVrm.expressionManager.setValue(VRMExpressionPresetName.Blink, 1);
    }
  };

  const changeExpression = (lvl: number) => {
    // Talk
    let vowelDamp = 53;
    let vowelMin = 12;
    if (Math.floor(lvl / 10) % 2 === 0) {
      currentVrm.expressionManager.setValue(VRMExpressionPresetName.Aa, 1);
    } else {
      currentVrm.expressionManager.setValue(VRMExpressionPresetName.Aa, 0);
    }

    // Move body
    // let damping = 750 / (bodyMotion / 10);
    // let springback = 1.001;

    // if (avgVolume > 5) {
    //   const boneNames = [
    //     VRMHumanBoneName.Head,
    //     VRMHumanBoneName.Neck,
    //     VRMHumanBoneName.UpperChest,
    //     VRMHumanBoneName.RightShoulder,
    //     VRMHumanBoneName.LeftShoulder,
    //   ];
    //   boneNames.forEach((boneName) => {
    //     const bone =
    //       currentVrm.humanoid.getNormalizedBoneNode(boneName);
    //     bone.rotation.x += (Math.random() - 0.5) / damping;
    //     bone.rotation.x /= springback;
    //     bone.rotation.y += (Math.random() - 0.5) / damping;
    //     bone.rotation.y /= springback;
    //     bone.rotation.z += (Math.random() - 0.5) / damping;
    //     bone.rotation.z /= springback;
    //   });
    // }

    // Yay/oof expression drift
    // expressionYay += (Math.random() - 0.5) / expressionEase;
    // expressionYay = Math.min(
    //   Math.max(expressionYay, 0),
    //   expressionLimitYay
    // );
    // currentVrm.expressionManager.setValue(
    //   VRMExpressionPresetName.Relaxed,
    //   expressionYay
    // );

    // expressionOof += (Math.random() - 0.5) / expressionEase;
    // expressionOof = Math.min(
    //   Math.max(expressionOof, 0),
    //   expressionLimitOof
    // );
    // currentVrm.expressionManager.setValue(
    //   VRMExpressionPresetName.Angry,
    //   expressionOof
    // );

    // Look at camera is more efficient on blink
    lookAtTarget.position.x = camera.position.x;
    lookAtTarget.position.y =
      (camera.position.y - camera.position.y - camera.position.y) / 2 + 0.5;
  };

  useEffect(() => {
    // initial loading of avatar
    if (!containerRef.current) return;
    if (containerRef.current && containerRef.current.children.length > 0) {
      // console.log("Model is already loaded.");
      return;
    }
    loadModel("./vrms/VU-VRM-male.vrm");
    setupRenderer();
    startAnimation();
    startBlinking();

    return () => {
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  useEffect(() => {
    blinkInterval = setInterval(
      startBlinking,
      Math.round(Math.random() * 5000) + 1000
    );

    return () => {
      if (blinkInterval) {
        clearInterval(blinkInterval);
      }
    };
  }, []);

  useEffect(() => {
    const startListening = () => {
      // Initialize audio context and analyzer
      audioContext = new AudioContext();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;

      // Get microphone input
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          mediaStream = stream;
          const microphone = audioContext!.createMediaStreamSource(stream);
          microphone.connect(analyser!);
          const dataArray = new Uint8Array(analyser!.frequencyBinCount);
          currentVrm = vrm;

          const updateVoiceLevel = () => {
            if (!isUserSpeaking) return;

            // Get voice level data
            analyser!.getByteFrequencyData(dataArray);
            // Calculate average volume level
            const avgVolume =
              dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
            const lvl = avgVolume;
            // console.log("Voice level:", lvl);
            changeExpression(lvl);

            // Schedule next check after 300ms
            timeoutId = setTimeout(updateVoiceLevel, 100);
          };

          // Start updating voice level
          updateVoiceLevel();
        })
        .catch((error) => {
          console.error("Error accessing microphone:", error);
        });
    };

    const stopListening = () => {
      // Stop listening to voice level
      if (vrm) {
        vrm.expressionManager.setValue(VRMExpressionPresetName.Aa, 0);
      }
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
      if (audioContext) {
        audioContext.close();
      }
      // Clear timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };

    // Start or stop listening based on isUserSpeaking
    if (isUserSpeaking) {
      startListening();
    } else {
      stopListening();
    }

    // Clean up function
    return () => {
      stopListening();
    };
  }, [isUserSpeaking]);

  return <div ref={containerRef} />;
};

export default TalkingAvatar;
