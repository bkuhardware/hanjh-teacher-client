import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';
import Header from '@/components/Header';
import Sider from '@/components/Sider';
import Footer from '@/components/Footer';
import ScrollLayout from '@/components/ScrollLayout';
import styles from './index.less';

const { Content } = Layout;

const BasicLayout = ({ children, settings, dispatch }) => {
    useEffect(() => {
        if (!settings.areasMenu) {
            dispatch({
                type: 'settings/fetch'
            });
        }
    }, []);
    return (
        <Layout className={styles.basicLayout}>
            <Header />
            <Layout className={styles.container}>
                <Sider />
                <ScrollLayout>
                    <Content className={styles.main}>
                        {children}
                    </Content>
                    <Footer />
                </ScrollLayout>
            </Layout>
        </Layout>
    );
};

export default connect(({ settings }) => ({ settings }))(BasicLayout);