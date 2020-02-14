import React from 'react';
import styles from './index.css';
import { formatMessage } from 'umi-plugin-locale';
import PageLoading from '@/components/PageLoading';

export default function() {
  return (
    <div className={styles.normal}>
      <PageLoading />
    </div>
  );
}
