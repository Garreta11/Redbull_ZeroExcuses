import styles from './End.module.scss'
import Image from 'next/image'

const End = () => {
  return (
    <div className={styles.end}>
      <h1>Sucess Message two lines of text!</h1>
      <Image className={styles.end__image} src='/images/success.png' alt='success image' width={384} height={216} />
    </div>
  )
}

export default End