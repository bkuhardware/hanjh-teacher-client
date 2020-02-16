import React from 'react';
import { Layout } from 'antd';
import Header from '@/components/Header';
import Sider from '@/components/Sider';
import Footer from '@/components/Footer';
import ScrollLayout from '@/components/ScrollLayout';
import styles from './index.less';

const { Content } = Layout;

const BasicLayout = ({ children }) => {
    return (
        <Layout className={styles.basicLayout}>
            <Header />
            <Layout className={styles.container}>
                <Sider />
                <ScrollLayout className={styles.content}>
                    <Content>
                        {children}
                    </Content>
                    <Footer />
                </ScrollLayout>
            </Layout>
        </Layout>
    )
};

export default BasicLayout;