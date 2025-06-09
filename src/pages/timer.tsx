import React, { useState, useRef } from 'react';

const Timer = () => {
    const [ time, setTime ] = useState(0);
    const [ isRunning, setisRunning ] = useState(false);
    const [ pauseCount, setPauseCount] = useState(0);
    const [ pausedTime, setPausedTime] = useState(0);
    const [ sessions, setSessions] = 
            useState<{startTime: Date; 
                endTime: Date | null; 
                duration: number; 
                pauses: number; 
                pausedTime: number
            }[]>([])
    const [startTime, setStartTime] = useState<Date | null>(null);

    const startSession = () =>{
        setStartTime(new Date());
    };

    
    const stopTimer = () => {
        if(isRunning && timerId.current){
            clearInterval(timerId.current);
            timerId.current=null;
            setisRunning(false);
            setPauseCount((prev) => prev+1);
            pauseStart.current = Date.now();
        }
        if (startTime){
            const endTime = new Date();
            const sessionDuration = time;
            setSessions((prev) => [
                ...prev, { startTime,endTime,duration: sessionDuration,pauses: pauseCount,pausedTime},
                ]);
            setStartTime(null);
        }
        setPauseCount(0);
        setPausedTime(0);

    };

    const timerId =  useRef<NodeJS.Timeout | null>(null); //mutable value persistent across re-renders
    const pauseStart = useRef<number | null>(null);
    const startTimer = () => {
        if(!isRunning){
            if(!startTime){
                startSession();
            }
            if(pauseStart.current){
                const pausedDuration = Math.floor((Date.now()- pauseStart.current)/1000);
                setPausedTime((prev)=> prev+pausedDuration);
                pauseStart.current = null;
            }
            setisRunning(true);
            timerId.current = setInterval(() => {
                setTime((prevTime)=> prevTime+1);
            },100)
            }
    };

    const resetTimer = () => {
        if(timerId.current){
            clearInterval(timerId.current);
            timerId.current = null;
        }
        setisRunning(false);
        setTime(0);
        setPauseCount(0);
        setPausedTime(0);
        setStartTime(null);
    }

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds/3600);
        const minutes = Math.floor(totalSeconds/60);
        const seconds = totalSeconds % 60; 

        const pad = (num: number) => num.toString().padStart(2,'0');
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return (
        <>
        <div style = {{ textAlign: 'center', marginTop: '50px'}}>
            <h1> Smart Productivity Timer</h1>
            <h2>{formatTime(time)} seconds</h2>
            <button onClick={startTimer} disabled={isRunning}>
                Start!
            </button>
            <button onClick={stopTimer} disabled={!isRunning}>
                Stop!
            </button>
            <button onClick={resetTimer}>
                Reset!
            </button>
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
                                <p>{session.startTime.toLocaleTimeString()} - {session.endTime?.toLocaleTimeString() || "Ongoing"} ({formatTime(session.duration)})</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    )
}

export default Timer; 