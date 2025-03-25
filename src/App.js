
import React, { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";  // Import confetti
import "./App.css";

function App() {
  const [time, setTime] = useState(25 * 60); // 25 minutes work time in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("work"); // Default mode is 'work'

  const alertSound = useRef(new Audio("/alert-Sound.mp3")); // Store audio in a ref to prevent re-creation
  const timerRef = useRef(null); // Store the interval reference

  const [showConfetti, setShowConfetti] = useState(false); // State to trigger confetti

useEffect(() => {
  if (isRunning) {
    timerRef.current = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(timerRef.current);
          setIsRunning(false);

          if (mode === "work") {
            setShowConfetti(true); // Show confetti when work timer ends
            setTimeout(() => setShowConfetti(false), 5000); // Hide confetti after 5s
          }

          // Play alert sound
          alertSound.current.play().catch((err) => console.log("Error playing sound:", err));

          setTimeout(() => {
            alertSound.current.pause();
            alertSound.current.currentTime = 0;
          }, 15000);

          // Auto-switch mode
          handleChangeMode(mode === "work" ? "shortBreak" : "work");

          return 0;
        }
      });
    }, 1000);
  } else {
    clearInterval(timerRef.current);
  }

  return () => clearInterval(timerRef.current);
}, [isRunning, mode]);

  // Function to start the timer
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
    }
  };

  // Function to reset the timer
  const resetTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setTime(mode === "work" ? 25 * 60 : mode === "shortBreak" ? 5 * 60 : 15 * 60);
  };

  // Function to switch modes
  const handleChangeMode = (newMode) => {
    setMode(newMode);
    if (newMode === "work") {
      setTime(25 * 60); // 25 minutes work
    } else if (newMode === "shortBreak") {
      setTime(5 * 60); // 5 minutes short break
    } else if (newMode === "longBreak") {
      setTime(15 * 60); // 15 minutes long break
    }
    setIsRunning(false); // Reset timer when switching modes
  };
  const handleLeftButtonClick = () => {
    if (mode === "shortBreak") {
      setMode("work");  // Change from Short Break → Work
      setTime(25*60); // Reset Timer for Work Mode
    }
  };
  
  const handleRightButtonClick = () => {
    if (mode === "shortBreak") {
      setMode("longBreak");  // Change from Short Break → Long Break
      setTime(15*60); // Reset Timer for Long Break Mode
    }
  };
  

  // Format time for display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="container">
      {/* Celebration effect */}
      {showConfetti && <Confetti />}  {/* 🎉 Add this line here */}
      {/* Title at the top */}
      <h1>Pomodoro Timer</h1>

      {/* Mode Buttons */}
      <div className="mode-buttons">
        <button
          className={mode === "work" ? "active" : ""}
          onClick={() => handleChangeMode("work")}
        >
          Work
        </button>
        <button
          className={mode === "shortBreak" ? "active" : ""}
          onClick={() => handleChangeMode("shortBreak")}
        >
          Short Break
        </button>
        <button
          className={mode === "longBreak" ? "active" : ""}
          onClick={() => handleChangeMode("longBreak")}
        >
          Long Break
        </button>
      </div>

      {/* Timer Box */}
      <div className="timer-container">
  <button className="side-button" onClick={handleLeftButtonClick}>⏮</button> {/* Left Button */}
  <div className="timer-box">
    <span className="timer">{formatTime(time)}</span>
  </div>
  <button className="side-button" onClick={handleRightButtonClick}>⏭</button> {/* Right Button */}
</div>


      {/* Start & Reset Buttons */}
      <div className="buttons">
        <button onClick={startTimer} disabled={isRunning}>Start</button>
        <button onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
}

export default App;
