// Import dependencies
import * as tf from "@tensorflow/tfjs";
import React, { useRef, /*useState,*/ useEffect } from "react";
import * as cocossd from "@tensorflow-models/coco-ssd"
import Webcam from "react-webcam";
import "./App.css";
import { drawRect, drawArea } from "./utilities";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  //Hardcoded area position and dimensions
  const AreaXL = 240;
  const AreaXR = 540;
  const AreaYB = 130;
  const AreaYT = 400;

  // Main function
  const runCoco = async () => {
    const net = await cocossd.load();
    
    //  Loop and detect
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;
      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      
      const ctx = canvasRef.current.getContext("2d");
      // Draw the area in wich the detection will be "valid"
      drawArea(AreaXL, AreaYB, (AreaXR - AreaXL), (AreaYT - AreaYB), ctx);
      
      const obj =await net.detect(video);
      console.log(obj);

      //check if detected objects are in the aarea, and if so draws the rectangle
      obj.forEach(detected => {
        if(detected.bbox[0] > AreaXL && 
          (detected.bbox[0] + detected.bbox[2]) < AreaXR &&
          detected.bbox[1] > AreaYB &&
          (detected.bbox[1] + detected.bbox[3]) < AreaYT) {
           
          drawRect(detected, ctx);
        }
      });


    }
  };

  useEffect(()=>{runCoco()},[]);

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          muted={true} 
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;
