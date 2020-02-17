import React from 'react';
import { Layout } from 'antd';
import Header from '@/components/Header';
import Scrollbars from 'react-custom-scrollbars';
import styles from './index.less';

const FinishLayout = ({ children }) => {
    return (
        <Layout className={styles.finishLayout}>
            <Header />
            <Scrollbars
                className={styles.layout}
            >
                <Layout>
                    {children}
                </Layout>
            </Scrollbars>
        </Layout>
    )
};

export default FinishLayout;