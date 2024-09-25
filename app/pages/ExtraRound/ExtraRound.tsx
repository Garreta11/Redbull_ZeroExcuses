import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '@/app/contexts/DataContext';
import styles from './ExtraRound.module.scss'
import Character from "@/app/components/Character/Character"
import ProgressRectBar from '@/app/components/ProgressRectBar/ProgressRectBar';

const ExtraRound = () => {

  const [count, setCount] = useState<number>(5);


  const context = useContext(DataContext);
  // Check if context is undefined
  if (!context) {
    throw new Error('Character must be used within a DataProvider');
  }
  const { selectedExercise, setPage } = context

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
    <div className={styles.extraround}>
      <h2>Extra Round</h2>
      <Character
        imageUrl={selectedExercise.extraRound.spriteUrl}
        frameWidth={selectedExercise.extraRound.frameWidth} // Width of each frame
        frameHeight={selectedExercise.extraRound.frameHeight} // Height of each frame
        frameCount={selectedExercise.extraRound.frameCount} // Total number of frames in the sprite sheet
        frameDuration={selectedExercise.extraRound.frameDuration} // Duration of each frame in milliseconds
      />
      <ProgressRectBar />
    </div>
  )
}

export default ExtraRound