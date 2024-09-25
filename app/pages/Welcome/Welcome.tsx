import React, { useContext } from 'react';
import styles from './Welcome.module.scss';
import { DataContext } from '@/app/contexts/DataContext';
import Image from 'next/image';
import { CosmosButton, CosmosText } from "@cosmos/web/react";

const Welcome = () => {

  const context = useContext(DataContext);
  // Check if context is undefined
  if (!context) {
    throw new Error('Character must be used within a DataProvider');
  }
  const { setPage } = context


  const handlePlay = () => {
    setPage('instructions')
  }

  return (
    <div className={styles.welcome}>
      <h2 className={styles.welcome__title}>Welcome!</h2>
      <Image src='/images/welcome.png' alt='redbull welcome image' width={318} height={229} />

      <CosmosText
        kind="normal"
        size="small"
        spacing="none"
        tag="p"
        weight="regular"
      >
        Accelerate your your fitness game and train with Red Bull! Enter the 30 day challenge for great results and unique prizes.
      </CosmosText>
      
      <CosmosButton
        onClick={handlePlay}
        kind='primary'
        size='small'
      >
        Play Game
      </CosmosButton>
    </div>
  );
};

export default Welcome;
