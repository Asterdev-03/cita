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

  let mouthThreshold = 1;
  let mouthBoost = 10;
  let bodyThreshold = 15;
  let bodyMotion = 10;

  const loadModel = (url: string) => {
    if (containerRef.current && containerRef.current.children.length > 0) {
      console.log("Model is already loaded.");
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
        console.log(currentVrm);
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
  };

  const setupRenderer = () => {
    if (!containerRef.current) return;
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    console.log(700, 500);
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

  const micListener = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then(
        function (stream: MediaStream) {
          let audioContext = new AudioContext();
          let analyser = audioContext.createAnalyser();
          let microphone = audioContext.createMediaStreamSource(stream);

          analyser.smoothingTimeConstant = 0.5;
          analyser.fftSize = 1024;

          // Create an AudioWorkletNode
          audioContext.audioWorklet
            .addModule("my-worklet-processor.js")
            .then(() => {
              const workletNode = new AudioWorkletNode(
                audioContext,
                "my-worklet-processor"
              );

              workletNode.port.onmessage = function (event: MessageEvent) {
                const { inputVolume } = event.data;
                let inputVolumeAdjusted = inputVolume * 200000;
                if (currentVrm !== undefined) {
                  // Talk
                  if (isUserSpeaking === true) {
                    var vowelDamp = 53;
                    var vowelMin = 12;
                    if (inputVolumeAdjusted > mouthThreshold * 2) {
                      currentVrm.expressionManager.setValue(
                        VRMExpressionPresetName.Aa,
                        ((inputVolumeAdjusted - vowelMin) / vowelDamp) *
                          (mouthBoost / 10)
                      );
                    } else {
                      currentVrm.expressionManager.setValue(
                        VRMExpressionPresetName.Aa,
                        0
                      );
                    }
                  }

                  // Move body
                  var damping = 750 / (bodyMotion / 10);
                  var springback = 1.001;

                  if (inputVolumeAdjusted > 1 * bodyThreshold) {
                    const boneNames = [
                      VRMHumanBoneName.Head,
                      VRMHumanBoneName.Neck,
                      VRMHumanBoneName.UpperChest,
                      VRMHumanBoneName.RightShoulder,
                      VRMHumanBoneName.LeftShoulder,
                    ];
                    boneNames.forEach((boneName) => {
                      const bone =
                        currentVrm.humanoid.getNormalizedBoneNode(boneName);
                      bone.rotation.x += (Math.random() - 0.5) / damping;
                      bone.rotation.x /= springback;
                      bone.rotation.y += (Math.random() - 0.5) / damping;
                      bone.rotation.y /= springback;
                      bone.rotation.z += (Math.random() - 0.5) / damping;
                      bone.rotation.z /= springback;
                    });
                  }
                }

                // Look at camera is more efficient on blink
                lookAtTarget.position.x = camera.position.x;
                lookAtTarget.position.y =
                  (camera.position.y - camera.position.y - camera.position.y) /
                    2 +
                  0.5;
              };

              // Connect the microphone to the worklet node
              microphone.connect(workletNode);
              // Connect the worklet node to the destination (speakers)
              workletNode.connect(audioContext.destination);
            })
            .catch((error: Error) => {
              console.error("Error loading worklet:", error);
            });
        },
        function (err: Error) {
          console.log("The following error occurred: " + err.name);
        }
      );
  };

  useEffect(() => {
    // initial loading of avatar
    if (!containerRef.current) return;
    if (containerRef.current && containerRef.current.children.length > 0) {
      console.log("Model is already loaded.");
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
    micListener();
  });

  return <div ref={containerRef} />;
};

export default TalkingAvatar;
