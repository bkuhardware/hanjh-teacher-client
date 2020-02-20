import React, { useEffect } from 'react';
import withRouter from 'umi/withRouter';
import Link from 'umi/link'
import { connect } from 'dva';
import { Row, Col, Layout, Menu, Skeleton, Icon, Button, Tooltip } from 'antd';
import Footer from '@/components/Footer';
import ScrollLayout from '@/components/ScrollLayout';
import styles from './EditLayout.less';

const { Sider: AntSider, Content, Header: AntHeader } = Layout;

const Header = ({ courseInfo, loading, handlePreview }) => {
    const getPrivacy = value => {
        if (value === 'public') return 'Public';
        else if (value === 'private') return 'Private';
        return 'DRAFT';
    };

    return (
        <AntHeader className={styles.header}>
            <Row className={styles.inline}>
                <Col span={16} className={styles.info}>
                    {!courseInfo || loading ? (
                        <React.Fragment>
                            <Skeleton
                                active
                                title={false}
                                paragraph={{
                                    rows: 1,
                                    width: '35%'
                                }}
                                className={styles.firstSkele}
                            />
                            <Skeleton
                                active
                                title={false}
                                paragraph={{
                                    rows: 1,
                                    width: '28%'
                                }}
                            />
                        </React.Fragment>
                    ) : (
                        <div className={styles.infoContent}>
                            <Icon type="arrow-left" style={{ fontSize: '2.0em', color: '#FADA5E' }}/>
                            <span className={styles.name}>
                                {courseInfo.name}
                            </span>
                            <span className={styles.privacy}>
                                {`(${getPrivacy(courseInfo.privacy)})`}
                            </span>
                        </div>
                    )} 
                </Col>
                <Col span={8} className={styles.actions}>
                    {courseInfo && !loading && (
                        <React.Fragment>
                            <Button type="primary" onClick={handlePreview} className={styles.preview}>
                                Preview
                            </Button>
                            <span className={styles.toManage}>
                                <Tooltip title="Go to manage" placement="bottom">
                                    <Icon type="folder-open" theme="filled" style={{ color: 'white', fontSize: '2em' }}/>
                                </Tooltip>
                            </span>
                        </React.Fragment>
                    )}
                </Col>
            </Row>
        </AntHeader>
    );
};

const Sider = () => {
    return <div />
};

const EditLayout = ({ children, dispatch, match, ...props }) => {
    const {
        courseInfo,
        loading
    } = props;
    const { courseId } = match.params;
    useEffect(() => {
        dispatch({
            type: 'course/fetchInfo',
            payload: courseId
        });
        return () => dispatch({
            type: 'course/resetInfo'
        });
    }, [courseId]);
    return (
        <Layout className={styles.editLayout}>
            <Header
                courseInfo={courseInfo}
                loading={loading}
            />
            <Layout className={styles.container}>
                <Sider  />
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

export default withRouter(connect(
    ({ loading, course }) => ({
        courseInfo: course.info,
        loading: !!loading.effects['course/fetchInfo']
    })
)(EditLayout));