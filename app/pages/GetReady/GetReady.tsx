import React , { useState, useEffect, useContext } from 'react'
import styles from './GetReady.module.scss'
import { DataContext } from '@/app/contexts/DataContext';

const GetReady = () => {
  const [count, setCount] = useState<number>(5);

  const context = useContext(DataContext);
  // Check if context is undefined
  if (!context) {
    throw new Error('Character must be used within a DataProvider');
  }
  const { setPage } = context

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => {
        setCount(count - 1);
      }, 1000);
      return () => clearTimeout(timer); // Clean up the timer
    } else {
      setPage('exercise')
    }
  }, [count])
  return (
    <div className={styles.getReady}>
      <h3 className={styles.getReady__text}>Get Started in</h3>
      <h2 className={styles.getReady__number}>{count}</h2>
    </div>
    
  )
}

export default GetReady