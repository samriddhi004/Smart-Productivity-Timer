import React, { useState, useRef } from "react";

const Timer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setisRunning] = useState(false);
  const [pauseCount, setPauseCount] = useState(0);
  const [pausedTime, setPausedTime] = useState(0);
  const [categories, setCategories] = useState<string[]>(["Study", "Code"]);
  const [newCategory, setNewCategory] = useState(""); //text-field
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sessions, setSessions] = useState<
    {
      startTime: Date;
      endTime: Date | null;
      duration: number;
      pauses: number;
      pausedTime: number;
      category: string;
    }[]
  >([]);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const startSession = () => {
    setStartTime(new Date());
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories((prev) => [...prev, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const handleDeleteCategory = (categoryToDel: string) => {
    setCategories((prev) =>
      prev.filter((category) => category !== categoryToDel)
    );
  };

  const stopTimer = () => {
    if (isRunning && timerId.current) {
      clearInterval(timerId.current);
      timerId.current = null;
      setisRunning(false);
      setPauseCount((prev) => prev + 1);
      pauseStart.current = Date.now();
    }
    if (startTime) {
      const endTime = new Date();
      const sessionDuration = Math.floor(
        (endTime.getTime() - startTime.getTime()) / 100
      );
      setSessions((prev) => [
        ...prev,
        {
          startTime,
          endTime,
          duration: sessionDuration,
          pauses: pauseCount,
          pausedTime,
          category: selectedCategory || "",
        },
      ]);
      setStartTime(null);
    //   setSelectedCategory("");
    }
    setPauseCount(0);
    setPausedTime(0);
  };

  const timerId = useRef<NodeJS.Timeout | null>(null); //mutable value persistent across re-renders
  const pauseStart = useRef<number | null>(null);
  const startTimer = () => {
    // if (!selectedCategory) {
    //     alert("Please select a category before starting the timer.");
    //     return;
    // }
    if (!isRunning) {
      if (!startTime) {
        startSession();
      }
      if (pauseStart.current) {
        const pausedDuration = Math.floor(
          (Date.now() - pauseStart.current) / 1000
        );
        setPausedTime((prev) => prev + pausedDuration);
        pauseStart.current = null;
      }
      setisRunning(true);
      timerId.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 100);
    }
  };

  const resetTimer = () => {
    if (timerId.current) {
      clearInterval(timerId.current);
      timerId.current = null;
    }
    setisRunning(false);
    setTime(0);
    setPauseCount(0);
    setPausedTime(0);
    setStartTime(null);
    setSelectedCategory("");
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => num.toString().padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const formatDuration = (durationInSecs: number) => {
    const hours = Math.floor(durationInSecs / 3600);
    const minutes = Math.floor((durationInSecs % 3600) / 60);
    if (hours <= 0) {
      return `${minutes} min${minutes > 1 ? "s" : ""}`;
    } else {
      return `${hours} hr${hours > 1 ? "s" : ""} ${minutes} min${
        minutes !== 1 ? "s" : ""
      }`;
    }
  };
  return (
    <>
      
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1> Smart Productivity Timer</h1>
        <h2>{formatTime(time)} seconds</h2>

        <button onClick={isRunning ? stopTimer : startTimer}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button onClick={resetTimer}>Reset!</button>
      </div>
      <div>
        <label htmlFor="category-select">Select Category:</label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div>
        <h4> Add a category </h4>
        <input
          type="text"
          placeholder="Add new Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={handleAddCategory}>Add</button>
        <ul>
          {categories.map((cat, index) => (
            <li key={index}>
              {cat}{" "}
              <button onClick={() => handleDeleteCategory(cat)}>❌</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Session History</h3>
        {sessions.length === 0 ? (
          <p>No sessions logged yet.</p>
        ) : (
          <ul>
            {sessions.map((session, index) => (
              <li key={index}>
                <p>Session {index + 1}:</p>
                <p>
                  {session.startTime.toLocaleTimeString()} -{" "}
                  {session.endTime?.toLocaleTimeString() || "Ongoing"} (
                  {formatDuration(session.duration)})
                </p>
                <p>Category: {session.category || ""}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Timer;
