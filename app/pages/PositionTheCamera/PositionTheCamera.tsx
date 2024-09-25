import React, { useContext } from 'react';
import styles from './PositionTheCamera.module.scss';
import { DataContext } from '@/app/contexts/DataContext';
import Image from 'next/image';
import { CosmosButton, CosmosText } from "@cosmos/web/react";


const PositionTheCamera = () => {

  const context = useContext(DataContext);
  // Check if context is undefined
  if (!context) {
    throw new Error('Character must be used within a DataProvider');
  }
  const { setPage } = context

  const handlePlay = () => {
    setPage('captureBody')
  }

  return (
    <div className={styles.positionTheCamera}>
      <h2 className={styles.positionTheCamera__title}>Position the Camera</h2>
      <Image className={styles.positionTheCamera__image} src='/images/position-camera.png' alt='position the camera image' width={300} height={317} />
      <CosmosText
        kind="normal"
        size="small"
        spacing="none"
        tag="p"
        weight="regular"
        className={styles.positionTheCamera__text}
      >
        Position your device on the ground or a shelf:
      </CosmosText>
      <CosmosButton
        onClick={handlePlay}
        kind='primary'
        size='small'
      >
        Start Scan
      </CosmosButton>
    </div>
  );
};

export default PositionTheCamera;
