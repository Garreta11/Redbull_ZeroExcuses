'use client'
// contexts/GlobalContext.tsx
import React, { createContext, useState, ReactNode, FC } from 'react';
import { ExerciseType } from '@/app/data/exercises';

/* export interface SpriteData {
  spriteUrl: string;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  frameDuration: number;
  maxRepetitions: number;
  extraRoundStart: number;
}

export interface ExerciseType {
  name: string;
  exercise: SpriteData;
  extraRound: SpriteData; // Optional if some exercises may not have extra rounds
} */

// Define the shape of the context value
interface DataContextType  {
  page: string,
  setPage: (page: string) => void,
  selectedExercise: ExerciseType,
  setSelectedExercise: (exercise: ExerciseType) => void,
  performancePercentage: number;
  setPerformancePercentage: (percentage: number) => void;
  repetitions: number;
  setRepetitions: (rep: number) => void;
  allKeypointsInside: boolean,
  setAllKeypointsInside: (allKeypointsInside: boolean) => void
}

// Create a Context with an initial undefined value
const DataContext = createContext<DataContextType | undefined>(undefined);

const initialExerciseState: ExerciseType = {
  name: '',
  exercise: {
    spriteUrl: '',
    frameWidth: 0,
    frameHeight: 0,
    frameCount: 0,
    frameDuration: 0,
    maxRepetitions: 0,
    extraRoundStart: 0,
  },
  extraRound: {
    spriteUrl: '',
    frameWidth: 0,
    frameHeight: 0,
    frameCount: 0,
    frameDuration: 0,
    extraRoundRepetitions: 0,
  }
};

// Create a Provider Component
const DataProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [page, setPage] = useState<string>('welcome');
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType>(initialExerciseState);
  const [performancePercentage, setPerformancePercentage] = useState<number>(0);
  const [repetitions, setRepetitions] = useState<number>(0);
  const [allKeypointsInside, setAllKeypointsInside] = useState<boolean>(false)

  return (
    <DataContext.Provider value={
      {
        page,
        setPage,
        selectedExercise,
        setSelectedExercise,
        performancePercentage,
        setPerformancePercentage,
        repetitions,
        setRepetitions,
        allKeypointsInside,
        setAllKeypointsInside
      }}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };

