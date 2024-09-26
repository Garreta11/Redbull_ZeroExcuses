'use client'
import React, { useContext, useEffect, useState } from 'react';
import styles from './Exercise.module.scss'
import { DataContext } from '@/app/contexts/DataContext';
import Character from "@/app/components/Character/Character"
import ProgressRectBar from '@/app/components/ProgressRectBar/ProgressRectBar';

const Exercise = () => {

  const [motivationSentences, setMotivationSentences] = useState<string[]>([])
  
  const context = useContext(DataContext);
  // Check if context is undefined
  if (!context) {
    throw new Error('Character must be used within a DataProvider');
  }
  const { selectedExercise, repetitions, setPage, } = context

  useEffect(() => {
    
    setMotivationSentences([selectedExercise.name, 'One Down! Nice Work!', 'You are doing great!', 'Keep it up!', 'Halfway!', 'You can do it!', 'One more round!', 'Last one!', 'You are amazing!'])

  }, [selectedExercise])

  useEffect(() => {
    /* const p =  100 * (repetitions / selectedExercise.exercise.maxRepetitions)
    console.log(repetitions, p)

    setPerformancePercentage(p) */

    if (repetitions === selectedExercise.exercise.maxRepetitions) {
      setPage('exerciseSucceed')
    }
  }, [repetitions])

  return (
    <div className={styles.exercise}>
      {/* <h2 className={styles.exercise__title}>{selectedExercise.name}</h2> */}
      <h2 className={styles.exercise__title}>{motivationSentences[repetitions]}</h2>
      <Character
        imageUrl={selectedExercise.exercise.spriteUrl}
        frameWidth={selectedExercise.exercise.frameWidth} // Width of each frame
        frameHeight={selectedExercise.exercise.frameHeight} // Height of each frame
        frameCount={selectedExercise.exercise.frameCount} // Total number of frames in the sprite sheet
        frameDuration={selectedExercise.exercise.frameDuration} // Duration of each frame in milliseconds
      />
      <ProgressRectBar />
    </div>
  )
}

export default Exercise