'use client'
import React, { useContext, useEffect, useState } from 'react';
import styles from './ProgressRectBar.module.scss'
import { DataContext } from '@/app/contexts/DataContext';
import Image from 'next/image';

const ProgressRectBar = () => {

  const [succeedIcon, setSucceedIcon] = useState<boolean>(false)
  const [starsIcon, setStarsIcon] = useState<boolean>(false)
  
  const context = useContext(DataContext);
  // Check if context is undefined
  if (!context) {
    throw new Error('Character must be used within a DataProvider');
  }
  const { selectedExercise, performancePercentage, page } = context

  useEffect(() => {
    if (page === 'exerciseSucceed') {
      setSucceedIcon(true)
      setStarsIcon(false)
    } else if (page === 'extraRound') {
      setSucceedIcon(false)
      setStarsIcon(true)
    }
  }, [page])


  return (
    <div className={styles.progressbar}>
      <p>{(performancePercentage).toFixed(0)}%</p>
      <div className={styles.progressbar__outer}>
        <div className={styles.progressbar__inner} style={{transform: 'translateY('+(100 - performancePercentage)+'%)'}}/>
      </div>
      {succeedIcon && (
        <Image
          className={styles.progressbar__logo}
          src='/images/succeed.png'
          alt='RedBull succeed icon'
          width={94}
          height={94}
          style={{top: 100 - (100 * selectedExercise.exercise.extraRoundStart / selectedExercise.exercise.maxRepetitions) + '%'}}
        />
      )}
      {starsIcon && (
        <Image
          className={styles.progressbar__logo}
          src='/images/stars.png'
          alt='RedBull stars icon'
          width={149.24}
          height={122.99}
          style={{top: 100 - (100 * selectedExercise.exercise.extraRoundStart / selectedExercise.exercise.maxRepetitions) + '%'}}
        />
      )}
      <Image
        className={styles.progressbar__logo}
        src='/images/can.png'
        alt='RedBull can to indicate exercise completed'
        width={94}
        height={94}
        style={{top: 100 - (100 * selectedExercise.exercise.extraRoundStart / selectedExercise.exercise.maxRepetitions) + '%'}}
      />
    </div>
  )
}

export default ProgressRectBar