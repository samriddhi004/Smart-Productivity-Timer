import React, { useState, useRef } from 'react';

const Timer = () => {
    const [ time, setTime ] = useState(0);
    const [ isRunning, setisRunning ] = useState(false);
    const timerId =  useRef<NodeJS.Timeout | null>(null); //mutable value persistent across render
    const startTimer = () => {
        if(!isRunning){
            setisRunning(true);
            timerId.current = setInterval(() => {
                setTime((prevTime)=> prevTime+1);
            },100)
        }
    };
    const stopTimer = () => {
        if(isRunning && timerId.current){
        setisRunning(false);
        clearInterval(timerId.current)
        timerId.current=null;
        }
    };

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds/3600);
        const minutes = Math.floor(totalSeconds/60);
        const seconds = totalSeconds % 60; 

        const pad = (num: number) => num.toString().padStart(2,'0');
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return (
        <div style = {{ textAlign: 'center', marginTop: '50px'}}>
            <h1> Smart Productivity Timer</h1>
            <h2>{formatTime(time)} seconds</h2>
            <button onClick={startTimer} disabled={isRunning}>
                Start!
            </button>
            <button onClick={stopTimer} disabled={!isRunning}>
                Stop!
            </button>
        </div>
    )
}

export default Timer; 