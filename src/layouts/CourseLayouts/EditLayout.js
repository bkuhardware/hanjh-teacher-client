import React, { useEffect } from 'react';
import _ from 'lodash';
import withRouter from 'umi/withRouter';
import Link from 'umi/link'
import { connect } from 'dva';
import { Row, Col, Layout, Menu, Skeleton, Icon, Button, Tooltip, Spin } from 'antd';
import Footer from '@/components/Footer';
import ScrollLayout from '@/components/ScrollLayout';
import styles from './EditLayout.less';

const { Sider: AntSider, Content, Header: AntHeader } = Layout;
const { SubMenu } = Menu;
const MenuItem = Menu.Item;

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
                            <span className={styles.history}>
                                <Tooltip title="History" placement="bottom">
                                    <Icon type="history" style={{ color: 'white', fontSize: '2em' }}/>
                                </Tooltip>
                            </span>
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

const Sider = ({ courseId, syllabus, loading, selectedKeys }) => {
    return (
        <AntSider
            className={styles.sider}
            width={300}
        >
            {!syllabus || loading ? (
                <div className={styles.inlineDiv}>
                    <Spin indicator={<Icon type="loading" style={{ fontSize: 44 }} spin />} />
                </div>
            ) : (
                <Menu
                    mode="inline"
                    className={styles.menu}
                    defaultOpenKeys={['plan', 'content', 'public']}
                    selectedKeys={selectedKeys}
                >
                    <SubMenu
                        key="plan"
                        title={(
                            <span>
                                <Icon type="edit" theme="filled" />
                                <span>Plan your course</span>
                            </span>
                        )}
                        popupClassName={styles.subMenuPopup}
                    >
                        <MenuItem key="/goals">
                            <Link to={`/course/${courseId}/edit/goals`}>
                                Target your students
                            </Link>
                        </MenuItem>
                        <MenuItem key="/tips">
                            <Link to={`/course/${courseId}/edit/tips`}>
                                Course structure
                            </Link>
                        </MenuItem>
                    </SubMenu>
                    <SubMenu
                        key="content"
                        title={(
                            <span>
                                <Icon type="carry-out" theme="filled" />
                                <span>Create your course</span>
                            </span>
                        )}
                        popupClassName={styles.subMenuPopup}
                    >
                        <MenuItem key="/syllabus">
                            <Link to={`/course/${courseId}/edit/syllabus`}>
                                Syllabus
                            </Link>
                        </MenuItem>
                        {_.map(syllabus, chapter => (
                            <SubMenu
                                key={chapter._id}
                                title={chapter.title}
                                popupClassName={styles.subMenuPopup}
                            >
                                {_.map(chapter.lectures, lecture => (
                                    <MenuItem key={`/lecture/${lecture._id}`}>
                                        <Link to={`/course/${courseId}/edit/lecture/${lecture._id}`}>
                                            {lecture.title}
                                        </Link>
                                    </MenuItem>
                                ))}
                            </SubMenu>
                        ))}
                    </SubMenu>
                    <SubMenu
                        key="public"
                        title={(
                            <span>
                                <Icon type="rocket" theme="filled" />
                                <span>Public your course</span>
                            </span>
                        )}
                        popupClassName={styles.subMenuPopup}
                    >
                        <MenuItem key="/landing">
                            <Link to={`/course/${courseId}/edit/landing`}>
                                Landing page
                            </Link>
                        </MenuItem>
                        <MenuItem key="/price">
                            <Link to={`/course/${courseId}/edit/price`}>
                                Price
                            </Link>
                        </MenuItem>
                        <MenuItem key="/promotions">
                            <Link to={`/course/${courseId}/edit/promotions`}>
                                Promotions
                            </Link>
                        </MenuItem>
                        <MenuItem key="/messages">
                            <Link to={`/course/${courseId}/edit/messages`}>
                                Messages
                            </Link>
                        </MenuItem>
                    </SubMenu>
                </Menu>
            )}
        </AntSider>
    )
};

const EditLayout = ({ children, dispatch, match, location, ...props }) => {
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
    const pathname = location.pathname;
    const selectedKeys = [_.replace(pathname, `/course/${courseId}/edit`, '')]
    return (
        <Layout className={styles.editLayout}>
            <Header
                courseInfo={courseInfo}
                loading={loading}
            />
            <Layout className={styles.container}>
                <Sider 
                    selectedKeys={selectedKeys}
                    courseId={courseId}
                    syllabus={courseInfo && courseInfo.syllabus}
                    loading={loading}
                />
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