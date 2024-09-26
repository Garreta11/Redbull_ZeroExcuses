// app/data/exercises.ts

export interface ExercData {
  spriteUrl: string;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  frameDuration: number;
  maxRepetitions: number;
}
export interface ExtraRoundData {
  spriteUrl: string;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  frameDuration: number;
  extraRoundRepetitions: number;
}

export interface ExerciseType {
  name: string;
  exercise: ExercData;
  extraRound: ExtraRoundData; // Optional if some exercises may not have extra rounds
}

export const exercises: ExerciseType[] = [
  {
    name: 'squats',
    exercise: {
      spriteUrl: './sprites/squats/ZERO_Sprite_Squat.png',
      frameWidth: 375,
      frameHeight: 633,
      frameCount: 9,
      frameDuration: 100,
      maxRepetitions: 8,
    },
    extraRound: {
      spriteUrl: './sprites/squats/ZERO_Sprite_Squat_ExtraRound.png',
      frameWidth: 375,
      frameHeight: 633,
      frameCount: 9,
      frameDuration: 100,
      extraRoundRepetitions: 2,
    },
  },
  {
    name: 'lunges',
    exercise: {
      spriteUrl: './sprites/squats/ZERO_Sprite_Squat.png',
      frameWidth: 375,
      frameHeight: 633,
      frameCount: 9,
      frameDuration: 100,
      maxRepetitions: 3,
    },
    extraRound: {
      spriteUrl: './sprites/squats/ZERO_Sprite_Squat_ExtraRound.png',
      frameWidth: 375,
      frameHeight: 633,
      frameCount: 9,
      frameDuration: 100,
      extraRoundRepetitions: 3,
    },
  },
];
