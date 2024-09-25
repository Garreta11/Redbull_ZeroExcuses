import React, { useContext } from 'react';
import styles from './Instructions.module.scss';
import { DataContext } from '@/app/contexts/DataContext';
import { CosmosButton, CosmosText } from "@cosmos/web/react";
import Image from 'next/image';

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
            className={styles.instructions__text__headline}
          >
            Let&apos;s do some fitness exercises and push it from 0 to 100:
          </CosmosText>
          <ul className={styles.instructions__text__list}>
            <li className={styles.instructions__text__list__item}>
              <Image src='/images/phone.png' alt='photo to indicate motion capturing' width={50} height={50} />
              <CosmosText
                kind="normal"
                size="medium"
                spacing="none"
                tag="p"
                weight="bold"
              >
                Setup Motion Capturing
              </CosmosText>
            </li>
            <li className={styles.instructions__text__list__item}>
              <Image src='/images/weight.png' alt='photo to indicate motion capturing' width={50} height={50} />
              <CosmosText
                kind="normal"
                size="medium"
                spacing="none"
                tag="p"
                weight="bold"
              >
                Perform the exercises
              </CosmosText>
            </li>
            <li className={styles.instructions__text__list__item}>
              <Image src='/images/hand.png' alt='photo to indicate motion capturing' width={50} height={50} />
              <CosmosText
                kind="normal"
                size="medium"
                spacing="none"
                tag="p"
                weight="bold"
              >
                Go for the extra round for additional points.
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
