import React, { useContext } from 'react';
import styles from './Instructions.module.scss';
import { DataContext } from '@/app/contexts/DataContext';
import { CosmosButton, CosmosText } from "@cosmos/web/react";

const Instructions = () => {

  const context = useContext(DataContext);
  // Check if context is undefined
  if (!context) {
    throw new Error('Character must be used within a DataProvider');
  }
  const { setPage } = context


  const handlePlay = () => {
    setPage('positionTheCamera')
  }

  return (
    <div className={styles.instructions}>
      <div>
        <h2 className={styles.instructions__title}>How to win</h2>
        <div className={styles.instructions__text}>
          <CosmosText
            kind="normal"
            size="small"
            spacing="none"
            tag="p"
            weight="regular"
          >
            When you log in every day:
          </CosmosText>
          <ul className={styles.instructions__text__list}>
            <li>
              <CosmosText
                kind="normal"
                size="small"
                spacing="none"
                tag="p"
                weight="regular"
              >
                Scan your body using our motion capture feature
              </CosmosText>
            </li>
            <li>
              <CosmosText
                kind="normal"
                size="small"
                spacing="none"
                tag="p"
                weight="regular"
              >
                Work out with us and complete the daily set!
              </CosmosText>
            </li>
            <li>
              <CosmosText
                kind="normal"
                size="small"
                spacing="none"
                tag="p"
                weight="regular"
              >
                Earn more points with an extra round ... or not!
              </CosmosText>
            </li>
            <li>
              <CosmosText
                kind="normal"
                size="small"
                spacing="none"
                tag="p"
                weight="regular"
              >
                Share your skills with us and unique prizes!
              </CosmosText>
            </li>
          </ul>
        </div>
        <CosmosButton
          onClick={handlePlay}
          kind='primary'
          size='small'
        >
          Play Game
        </CosmosButton>
      </div>
    </div>
  );
};

export default Instructions;
