import React from 'react';
import { Layout } from 'antd';
import Header from '@/components/Header';
import styles from './index.less';

const FinishLayout = ({ children }) => {
    return (
        <Layout className={styles.finishLayout}>
            <Header />
            <Layout className={styles.layout}>{children}</Layout>
        </Layout>
    )
};

export default FinishLayout;