import React, {useEffect, useState, useContext} from 'react'
import styles from './CaptureBody.module.scss'
import { DataContext } from '@/app/contexts/DataContext';
import { CosmosButton } from "@cosmos/web/react";

const CaptureBody = () => {
  const [countSuccess, setCountSuccess] = useState<number>(5);
  const [countToDetect, setCountToDetect] = useState<number>(10);
  const [errorMessage, setErrorMessage] = useState<boolean>(false)

  const context = useContext(DataContext);
  // Check if context is undefined
  if (!context) {
    throw new Error('Character must be used within a DataProvider');
  }
  const { setPage, allKeypointsInside } = context

  useEffect(() => {
    if (allKeypointsInside) {
      if (countSuccess > 0) {
        const timer = setTimeout(() => {
          setCountSuccess(countSuccess - 1);
        }, 1000);
        return () => clearTimeout(timer); // Clean up the timer
      } else {
        setPage('getReady')
      }
    } else {
      setCountSuccess(5)
    }
  }, [allKeypointsInside, countSuccess])

  useEffect(() => {
    if (countToDetect > 0) {
      const timer = setTimeout(() => {
        setCountToDetect(countToDetect - 1);
      }, 1000);
      return () => clearTimeout(timer); // Clean up the timer
    } else {
      setErrorMessage(true)
    }
  }, [countToDetect])

  return (
    <div className={styles.captureBody}>
      <h2 className={styles.captureBody__title}>{allKeypointsInside ? 'Success!' : 'Capturing...'}</h2>
      
      {!errorMessage && (
        <CosmosButton
          onClick={() => setPage('welcome')}
          kind='primary'
          size='small'
        >
          Exit Game
        </CosmosButton>
      )}

      {errorMessage && (
        <div className={styles.captureBody__error}>
          <div className={styles.captureBody__error__background} />
          <div className={styles.captureBody__error__popup}>
            <h4>BODY SCAN FAILED</h4>
            <h4>Face the camera, stay still agaisnt a clear, solid background</h4>
            <CosmosButton
              onClick={() => setPage('positionTheCamera')}
              kind='primary'
              size='small'
            >
              Repeat
            </CosmosButton>
          </div>
        </div>
      )}
    </div>
  )
}

export default CaptureBody