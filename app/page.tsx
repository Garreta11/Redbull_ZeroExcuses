import PageWrapper from "./components/PageWrapper/PageWrapper";
import styles from "./page.module.scss";

import { DataProvider } from './contexts/DataContext';
import SuspenseWrapper from './components/SuspenseWrapper/SuspenseWrapper';


export default function Home() {
  return (
    <SuspenseWrapper>
      <div className={styles.page}>
        <DataProvider>
          <PageWrapper />
        </DataProvider>
      </div>
    </SuspenseWrapper>
  );
}
