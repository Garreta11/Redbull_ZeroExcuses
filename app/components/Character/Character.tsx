import React, { useEffect, useRef, useState, useContext } from 'react';
import styles from './Character.module.scss'
import { DataContext } from '../../contexts/DataContext';


interface SpriteAnimationProps {
  imageUrl: string;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  frameDuration: number;
  loop?: boolean;
}

const Character: React.FC<SpriteAnimationProps> = ({imageUrl, frameWidth, frameHeight, frameCount, frameDuration, loop = false}) => {

  const context = useContext(DataContext);
  // Check if context is undefined
  if (!context) {
    throw new Error('Character must be used within a DataProvider');
  }
  const { performancePercentage, repetitions } = context;


  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const onAnimationEnd = () => {
    setIsPlaying(false)
    setCurrentFrame(0)
  }
  
  const onAnimationStart = () => {
    setTimeout(() => {
      setIsPlaying(true)
    }, 1000)
  }

  useEffect(() => {
    if (!loop) onAnimationStart();
    if (loop) setIsPlaying(true)
  }, [repetitions])

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentFrame((prevFrame) => {
          const nextFrame = (prevFrame + 1) % frameCount;
          if (nextFrame === 0 && !loop) {
            // Animation cycle is complete
            onAnimationEnd(); // Run the function when the animation restarts
          }
          return nextFrame;
        });
      }, frameDuration);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, frameCount, frameDuration]);

  /*
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentFrame((prevFrame) => (prevFrame + 1) % frameCount);
      }, frameDuration);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, frameCount, frameDuration]);
  */

  useEffect(() => {
    const cf = Math.round((performancePercentage * (frameCount - 1)) / 100);
    setCurrentFrame(cf)
  }, [performancePercentage])

  return (
    <div className={styles.character}>
      <div
        className={styles.character__sprite}
        style={{
          width: `${frameWidth}px`,
          height: `${frameHeight}px`,
          backgroundImage: `url(${imageUrl})`,
          backgroundPosition: `-${currentFrame * frameWidth}px 0px`,
        }}
      />
    </div>
  )
}

export default Character