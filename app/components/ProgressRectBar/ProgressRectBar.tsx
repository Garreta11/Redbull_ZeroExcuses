'use client'
import React, { useContext, useEffect, useState } from 'react';
import styles from './ProgressRectBar.module.scss'
import { DataContext } from '@/app/contexts/DataContext';
import Image from 'next/image';

const ProgressRectBar = () => {

  const [succeedIcon, setSucceedIcon] = useState<boolean>(false)
  const [starsIcon, setStarsIcon] = useState<boolean>(false)
  const [positionIcon, setPositionIcon] = useState<number>(0)
  const [percentageValue, setPercentageValue] = useState<number>(0)
  const [percentageBar, setPercentageBar] = useState<number>(0)
  
  const context = useContext(DataContext);
  // Check if context is undefined
  if (!context) {
    throw new Error('Character must be used within a DataProvider');
  }
  const { selectedExercise, page, repetitions } = context

  useEffect(() => {
    if (page === 'exerciseSucceed') {
      setSucceedIcon(true)
      setStarsIcon(false)
    } else if (page === 'extraRound') {
      setSucceedIcon(false)
      setStarsIcon(true)
    }
  }, [page])

  useEffect(() => {
    const pos = 100 - (100 * selectedExercise.exercise.maxRepetitions / (selectedExercise.exercise.maxRepetitions + selectedExercise.extraRound.extraRoundRepetitions))
    setPositionIcon(pos)
  }, [selectedExercise])

  useEffect(() => {
  
    const per = (repetitions / selectedExercise.exercise.maxRepetitions) * 100
    setPercentageValue(per)

    const perBar = (repetitions / (selectedExercise.exercise.maxRepetitions + selectedExercise.extraRound.extraRoundRepetitions)) * 100
    setPercentageBar(perBar)

  }, [repetitions, selectedExercise])


  return (
    <div className={styles.progressbar}>
      <p>
        {page === "extraRound" ? "+20 pts" : (percentageValue).toFixed(0) + '%'}
      </p>
      <div className={styles.progressbar__outer}>
        <div className={styles.progressbar__inner} style={{transform: 'translateY('+(100 - percentageBar)+'%)'}}/>
      </div>
      {succeedIcon && (
        <Image
          className={styles.progressbar__logo}
          src='/images/succeed.png'
          alt='RedBull succeed icon'
          width={94}
          height={94}
          style={{top: 'calc(' + positionIcon + '% - 47px)'}}
        />
      )}
      {starsIcon && (
        <Image
          className={styles.progressbar__logo}
          src='/images/stars.png'
          alt='RedBull stars icon'
          width={149.24}
          height={122.99}
          style={{top: 'calc(' + positionIcon + '% - 47px)'}}
          />
      )}
      <Image
        className={styles.progressbar__logo}
        src='/images/can.png'
        alt='RedBull can to indicate exercise completed'
        width={94}
        height={94}
        style={{top: 'calc(' + positionIcon + '% - 47px)'}}
      />
    </div>
  )
}

export default ProgressRectBar