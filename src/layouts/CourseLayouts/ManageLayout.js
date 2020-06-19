import React, { useEffect } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import { Layout, Menu, Skeleton, Tooltip, Row, Col, Icon } from 'antd';
import ScrollLayout from '@/components/ScrollLayout';
import Footer from '@/components/Footer';
import styles from './ManageLayout.less';

const { Sider: AntSider, Header: AntHeader, Content } = Layout;
const MenuItem = Menu.Item;

const Header = ({ courseInfo, loading }) => {
    const getPrivacy = value => {
        if (value === 'public') return 'Public';
        else if (value === 'private') return 'Private - Invitation only';
        else if (value === 'password') return 'Private - Password';
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
                            <Icon type="arrow-left" style={{ fontSize: '2.0em', color: '#FADA5E', cursor: 'pointer' }} onClick={() => router.push('/courses')} />
                            <span className={styles.name}>
                                {courseInfo.title}
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
                            <span className={styles.setting}>
                                <Tooltip title="Setting" placement="bottom">
                                    <Icon type="setting" theme="filled" style={{ color: 'white', fontSize: '2em' }} onClick={() => router.push(`/course/${courseInfo._id}/manage/settings`)}/>
                                </Tooltip>
                            </span>
                            <span className={styles.toEdit}>
                                <Tooltip title="Go to edit" placement="bottom">
                                    <Icon type="edit" style={{ color: 'white', fontSize: '2em' }} onClick={() => router.push(`/course/${courseInfo._id}/edit/goals`)}/>
                                </Tooltip>
                            </span>
                        </React.Fragment>
                    )}
                </Col>
            </Row>
        </AntHeader>
    );
};

const Sider = ({ selectedKeys, courseId }) => {
    return (
        <AntSider
            className={styles.sider}
            width={250}
        >
            <Menu
                mode="inline"
                className={styles.menu}
                selectedKeys={selectedKeys}
            >
                <MenuItem key="/forum">
                    <Link to={`/course/${courseId}/manage/forum`}>
                        Forum
                    </Link>
                </MenuItem>
                <MenuItem key="/announcements">
                    <Link to={`/course/${courseId}/manage/announcements`}>
                        Announcements
                    </Link>
                </MenuItem>
                <MenuItem key="/reviews">
                    <Link to={`/course/${courseId}/manage/reviews`}>
                        Reviews
                    </Link>
                </MenuItem>
                <MenuItem key="/messenger">
                    <Link to={`/course/${courseId}/manage/messenger`}>
                        Messenger
                    </Link>
                </MenuItem>
            </Menu>
        </AntSider>
    )
};

const ManageLayout = ({ dispatch, location, match, ...props }) => {
    const { 
        courseInfo,
        loading,
        children
    } = props;
    const { courseId } = match.params;
    useEffect(() => {
        dispatch({
            type: 'course/fetchInfo',
            payload: courseId
        });
        return () => dispatch({ type: 'course/resetInfo' });
    }, [courseId]);
    const pathname = location.pathname;
    const selectedKeys = [_.replace(pathname, `/course/${courseId}/manage`, '')];
    return (
        <Layout className={styles.manageLayout}>
            <Header
                courseInfo={courseInfo}
                loading={loading}
            />
            <Layout className={styles.container}>
                <Sider 
                    selectedKeys={selectedKeys}
                    courseId={courseId}
                />
                <ScrollLayout>
                    <Content className={styles.main}>
                        {children}
                    </Content>
                    <Footer />
                </ScrollLayout>
            </Layout>
        </Layout>
    )
};

export default connect(
    ({ course, loading }) => ({
        courseInfo: course.info,
        loading: !!loading.effects['course/fetchInfo']
    })
)(ManageLayout);