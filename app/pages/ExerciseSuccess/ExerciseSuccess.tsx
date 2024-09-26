import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '@/app/contexts/DataContext';
import styles from './ExerciseSuccess.module.scss'
import Character from "@/app/components/Character/Character"
import ProgressRectBar from '@/app/components/ProgressRectBar/ProgressRectBar';

interface VictoryType {
  name: string,
  spriteUrl: string,
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  frameDuration: number;
}

const victory: VictoryType = {
  name: 'victory',
  spriteUrl: './sprites/ZERO_Sprite_Victory.png',
  frameWidth: 375,
  frameHeight: 633,
  frameCount: 5,
  frameDuration: 100
}

const ExerciseSuccess = () => {
  
  const [count, setCount] = useState<number>(10);


  const context = useContext(DataContext);
  // Check if context is undefined
  if (!context) {
    throw new Error('Character must be used within a DataProvider');
  }
  const { selectedExercise, repetitions, setPage } = context

  useEffect(() => {
    if (repetitions > selectedExercise.exercise.maxRepetitions) {
      setPage('extraRound')
    }
  }, [repetitions])

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => {
        setCount(count - 1);
      }, 1000);
      return () => clearTimeout(timer); // Clean up the timer
    } else {
      setPage('end')
    }
  }, [count])

  return (
    <div className={styles.succeed}>
      <h2>You did it</h2>
      <Character
        imageUrl={victory.spriteUrl}
        frameWidth={victory.frameWidth} // Width of each frame
        frameHeight={victory.frameHeight} // Height of each frame
        frameCount={victory.frameCount} // Total number of frames in the sprite sheet
        frameDuration={victory.frameDuration} // Duration of each frame in milliseconds
        loop={true}
      />
      <ProgressRectBar />
    </div>
  )
}

export default ExerciseSuccess