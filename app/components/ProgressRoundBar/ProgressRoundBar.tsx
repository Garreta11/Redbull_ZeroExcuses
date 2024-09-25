'use client'
import React, {useState, useEffect, useContext} from 'react';
import styles from './ProgressRoundBar.module.scss'
import { DataContext } from '../../contexts/DataContext';

interface ProgressBarProps {
  percentage: number
}

const radius = 47;

const ProgressRoundBar: React.FC<ProgressBarProps> = ({percentage}) => {

  const [dashOffset, setDashOffset] = useState<number>()
  const [showTrack, setShowTrack] = useState<boolean>(false)
  const [circumference] = useState<number>(2 * Math.PI * radius * (285/360))

  const context = useContext(DataContext);
  // Check if context is undefined
  if (!context) {
    throw new Error('Character must be used within a DataProvider');
  }
  const { repetitions } = context

  useEffect(() => {

    const d = circumference - (percentage / 100) * circumference;
    setDashOffset(d);

    if (d === circumference) {
      setShowTrack(false)
    } else {
      setShowTrack(true)
    }

  }, [percentage])

  return (
    <div className={styles.progressbar}>
      <svg width="107" height="97" viewBox="0 0 107 97" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M79.7298 93.9648L79.7298 93.9648C77.834 91.6583 78.1669 88.2538 80.4734 86.358C90.3563 78.2354 96.0222 66.2491 96.0222 53.4692C96.0222 30.0054 76.9329 10.9162 53.4692 10.9162C30.0054 10.9162 10.9184 30.0077 10.9184 53.4714C10.9184 66.2513 16.5865 78.2377 26.4671 86.3602L26.5372 86.275L26.4671 86.3602C28.7736 88.256 29.1065 91.6605 27.2107 93.967C25.315 96.2734 21.9105 96.6063 19.604 94.7106C7.2156 84.5256 0.110287 69.4961 0.110287 53.4714C0.110287 39.2185 5.66152 25.8181 15.7387 15.7387C25.8181 5.66152 39.2185 0.110287 53.4714 0.110287C67.7242 0.110287 81.1247 5.66152 91.2041 15.7387C101.283 25.8181 106.832 39.2163 106.832 53.4714C106.832 69.4961 99.7271 84.5256 87.3365 94.7084C86.3313 95.5342 85.1166 95.9383 83.9083 95.9383C82.3473 95.9383 80.7976 95.266 79.7298 93.9648Z"
          fill="#B2B2B2"
        />
        {showTrack && (
          <path
            d="M23.036 90.9477C12.336 82.1535 5.51351 69.8948 5.51367 53.8848C5.51395 27.3988 26.9843 5.92773 53.4707 5.92773C79.9572 5.92773 101.082 27.4011 101.428 53.8848C101.634 69.7155 95.8681 80.469 84 90.9477"
            stroke="url(#progress_bar_fill)"
            stroke-width="11.0287"
            stroke-miterlimit="10"
            stroke-linecap="round"
            strokeDasharray={circumference} // Total length of the path
            strokeDashoffset={dashOffset} // Offset the path to create the grow effect
          />
        )}
        
        <text x="54" y="70" fill="#071E3A" font-size="50" textAnchor='middle'>{repetitions}</text>
        
        <defs>
          <linearGradient id="progress_bar_fill" x1="55.942" y1="5.76432" x2="17.2696" y2="119.106" gradientUnits="userSpaceOnUse">
            <stop stop-color="#008D36"/>
            <stop offset="1" stop-color="#FF9100"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

export default ProgressRoundBar
