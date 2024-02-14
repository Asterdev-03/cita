"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader, OrbitControls } from "three/addons";
import {
  VRMExpressionPresetName,
  VRMHumanBoneName,
  VRMLoaderPlugin,
} from "@pixiv/three-vrm";

interface TalkingAvatar {
  isDisabled: boolean;
}

// Global variables
let currentVrm: any = undefined;
const loader = new GLTFLoader();
const clock = new THREE.Clock();
const lookAtTarget = new THREE.Object3D();
const scene = new THREE.Scene();

// Expression setup
let expressionYay = 0;
let expressionOof = 0;
let expressionLimitYay = 0.5;
let expressionLimitOof = 0.5;
let expressionEase = 100;

let mouthThreshold = 1;
let mouthBoost = 20;
let bodyThreshold = 10;
let bodyMotion = 10;

const talktime = true;

loader.register((parser: any) => {
  return new VRMLoaderPlugin(parser);
});

function load(url: string) {
  loader.load(
    url,
    (gltf: any) => {
      scene.add(gltf.scene);

      let vrm = gltf.userData.vrm;
      currentVrm = vrm;

      console.log(vrm);

      vrm.humanoid.getNormalizedBoneNode(VRMHumanBoneName["Hips"]).rotation.y =
        Math.PI;
      vrm.springBoneManager.reset();

      vrm.humanoid.getNormalizedBoneNode(
        VRMHumanBoneName["RightUpperArm"]
      ).rotation.z = 250;

      vrm.humanoid.getNormalizedBoneNode(
        VRMHumanBoneName["RightLowerArm"]
      ).rotation.z = -0.2;

      vrm.humanoid.getNormalizedBoneNode(
        VRMHumanBoneName["LeftUpperArm"]
      ).rotation.z = -250;

      vrm.humanoid.getNormalizedBoneNode(
        VRMHumanBoneName["LeftLowerArm"]
      ).rotation.z = 0.2;
    },
    (progress: any) =>
      console.log(
        "Loading model...",
        100.0 * (progress.loaded / progress.total),
        "%"
      ),
    (error: any) => console.error(error)
  );
}

function blink(camera: THREE.Camera) {
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
}

const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
  powerPreference: "low-power",
});
console.log(700, 500);
renderer.setSize(700, 500);
renderer.setPixelRatio(window.devicePixelRatio);

const camera = new THREE.PerspectiveCamera(30.0, 700 / 500, 0.1, 10.0);
camera.position.set(0, 1.5, 1.3);

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.screenSpacePanning = true;
// controls.target.set(0.0, 1.45, 0.0);
// controls.update();

const light = new THREE.DirectionalLight(0xffffff);
light.position.set(1.0, 1.0, 1.0).normalize();
scene.add(light);

camera.add(lookAtTarget);

load("./vrms/VU-VRM-male.vrm");

function animate() {
  requestAnimationFrame(animate);

  const deltaTime = clock.getDelta();

  if (currentVrm) {
    currentVrm.update(deltaTime);
  }

  renderer.render(scene, camera);
}
animate();

(function loop() {
  var rand = Math.round(Math.random() * 5000) + 1000;
  setTimeout(function () {
    blink(camera);
    loop();
  }, rand);
})();

const TalkingAvatar: React.FC<TalkingAvatar> = ({ isDisabled }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  let analyser;
  let microphone: MediaStreamAudioSourceNode;

  function micListener(camera: THREE.Camera) {
    navigator.mediaDevices
      .getUserMedia({
        audio: !isDisabled,
      })
      .then(
        function (stream: MediaStream) {
          let audioContext = new AudioContext();
          analyser = audioContext.createAnalyser();
          microphone = audioContext.createMediaStreamSource(stream);

          analyser.smoothingTimeConstant = 0.5;
          analyser.fftSize = 1024;

          // const workletScriptUrl = new URL(
          //   "components/my-worklet-processor.js",
          //   import.meta.url
          // );

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
                let inputVolumeAdjusted = inputVolume * 100000;
                // console.log(inputVolumeAdjusted);

                // console.log(isDisabled);
                if (currentVrm !== undefined) {
                  // Talk
                  if (talktime === true) {
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
  }

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.appendChild(renderer.domElement);
  }, []);

  useEffect(() => {
    micListener(camera); // Call micListener function
  });

  return (
    <div>
      <div ref={containerRef} />
    </div>
  );
};

export default TalkingAvatar;
