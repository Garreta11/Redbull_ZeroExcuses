'use client'
import styles from './PageWrapper.module.scss'
import React, { useContext, useEffect } from 'react';

import { DataContext } from '@/app/contexts/DataContext';

import { useSearchParams } from 'next/navigation';

import CameraWrapper from '../CameraWrapper/CameraWrapper';

// pages
import Welcome from '@/app/pages/Welcome/Welcome';
import Instructions from '@/app/pages/Instructions/Instructions';
import PositionTheCamera from '@/app/pages/PositionTheCamera/PositionTheCamera';
import CaptureBody from '@/app/pages/CaptureBody/CaptureBody';
import GetReady from '@/app/pages/GetReady/GetReady';
import Exercise from '@/app/pages/Exercise/Exercise';
import ExerciseSuccess from '@/app/pages/ExerciseSuccess/ExerciseSuccess';
import ExtraRound from '@/app/pages/ExtraRound/ExtraRound';
// Import exercises from the new file
import { exercises, ExerciseType } from '@/app/data/exercises';
import End from '@/app/pages/End/End';


const PageWrapper: React.FC = () => {

  const searchParams = useSearchParams();
  const exerciseName = searchParams.get('exercise'); // Get the 'exercise' query param

  const context = useContext(DataContext);
  // Check if context is undefined
  if (!context) {
    throw new Error('Character must be used within a DataProvider');
  }
  const { page, setSelectedExercise } = context

  useEffect(() => {
    const foundExercise: ExerciseType | undefined = exercises.find(exercise => exercise.name === exerciseName);
    setSelectedExercise(foundExercise || exercises[0]);
  }, [exerciseName, setSelectedExercise])


  return (
    <div className={styles.container}>

      {page === 'welcome' && (
        <Welcome />
      )}

      {page === 'instructions' && (
        <Instructions />
      )}

      {page === 'positionTheCamera' && (
        <PositionTheCamera />
      )}

      {page === 'captureBody' && (
        <CaptureBody />
      )}

      {page === 'getReady' && (
        <GetReady />
      )}

      {page === 'exercise' && (
        <Exercise />
      )}

      {page === 'exerciseSucceed' && (
        <ExerciseSuccess />
      )}

      {page === 'extraRound' && (
        <ExtraRound />
      )}
      
      {page === 'end' && (
        <End />
      )}


      {/* CAMERA FEEDBACK */}
      {(page === 'captureBody' || page === 'getReady' || page === 'exercise'  || page === 'exerciseSucceed' || page === 'extraRound') && (
        <CameraWrapper />
      )}
    </div>
  )
};

export default PageWrapper;
