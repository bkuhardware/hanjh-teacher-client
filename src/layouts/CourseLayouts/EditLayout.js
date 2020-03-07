import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import moment from 'moment';
import classNames from 'classnames';
import withRouter from 'umi/withRouter';
import Link from 'umi/link'
import router from 'umi/router';
import { connect } from 'dva';
import { Row, Col, Layout, Menu, Skeleton, Icon, Button, Tooltip, Spin, Drawer, Avatar, Badge, Checkbox } from 'antd';
import Footer from '@/components/Footer';
import ScrollLayout from '@/components/ScrollLayout';
import Scrollbars from 'react-custom-scrollbars';
import styles from './EditLayout.less';

const { Sider: AntSider, Content, Header: AntHeader } = Layout;
const { SubMenu } = Menu;
const MenuItem = Menu.Item;

const Header = ({ courseInfo, loading, handlePreview, handleViewHistory }) => {
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
                            <Icon type="arrow-left" style={{ fontSize: '2.0em', color: '#FADA5E', cursor: 'pointer' }} onClick={() => router.push('/courses')} />
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
                            <span className={styles.history} onClick={handleViewHistory}>
                                <Tooltip title="History" placement="bottom">
                                    <Badge count={courseInfo.noOfUnseen} dot>
                                        <Icon type="history" style={{ color: 'white', fontSize: '2em' }}/>
                                    </Badge>
                                </Tooltip>
                            </span>
                            <span className={styles.toManage}>
                                <Tooltip title="Go to manage" placement="bottom">
                                    <Icon type="folder-open" theme="filled" style={{ color: 'white', fontSize: '2em' }} onClick={() => router.push(`/course/${courseInfo._id}/manage/forum`)}/>
                                </Tooltip>
                            </span>
                        </React.Fragment>
                    )}
                </Col>
            </Row>
        </AntHeader>
    );
};

const Sider = ({ courseId, syllabus, completeStatus, loading, selectedKeys }) => {
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
                            <div className={styles.haveStatus}>
                                <Link to={`/course/${courseId}/edit/goals`}>
                                    Target your students
                                </Link>
                                <Checkbox checked={completeStatus.goals} className={styles.status} />
                            </div>
                        </MenuItem>
                        <MenuItem key="/course-structure">
                            <Link to={`/course/${courseId}/edit/course-structure`}>
                                Course structure
                            </Link>
                        </MenuItem>
                        <MenuItem key="/setup-test">
                            <Link to={`/course/${courseId}/edit/setup-test`}>
                                Setup & test video
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
                        <MenuItem key="/film-edit">
                            <Link to={`/course/${courseId}/edit/film-edit`}>
                                Film & edit
                            </Link>
                        </MenuItem>
                        <MenuItem key="/syllabus">
                            <div className={styles.haveStatus}>
                                <Link to={`/course/${courseId}/edit/syllabus`}>
                                    Syllabus
                                </Link>
                                <Checkbox checked={completeStatus.syllabus} className={styles.status} />
                            </div>
                        </MenuItem>
                        {_.map(syllabus, chapter => (
                            <SubMenu
                                key={chapter._id}
                                title={chapter.title}
                                popupClassName={styles.subMenuPopup}
                            >
                                {_.map(chapter.lectures, lecture => lecture.type === 0 ? (
                                    <MenuItem key={`/lecture/video/${lecture._id}`}>
                                        <Link to={`/course/${courseId}/edit/lecture/video/${lecture._id}`}>
                                            {lecture.title}
                                        </Link>
                                    </MenuItem>
                                ) : (
                                    <MenuItem key={`/lecture/article/${lecture._id}`}>
                                        <Link to={`/course/${courseId}/edit/lecture/article/${lecture._id}`}>
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
                            <div className={styles.haveStatus}>
                                <Link to={`/course/${courseId}/edit/landing`}>
                                    Landing page
                                </Link>
                                <Checkbox checked={completeStatus.landing} className={styles.status} />
                            </div>
                        </MenuItem>
                        <MenuItem key="/price">
                            <div className={styles.haveStatus}>
                                <Link to={`/course/${courseId}/edit/price`}>
                                    Price
                                </Link>
                                <Checkbox checked={completeStatus.price} className={styles.status} />
                            </div>
                        </MenuItem>
                        <MenuItem key="/promotions">
                            <div className={styles.haveStatus}>
                                <Link to={`/course/${courseId}/edit/promotions`}>
                                    Promotions
                                </Link>
                                <Checkbox checked={completeStatus.promotions} className={styles.status} />
                            </div>
                        </MenuItem>
                        <MenuItem key="/messages">
                            <div className={styles.haveStatus}>
                                <Link to={`/course/${courseId}/edit/messages`}>
                                    Messages
                                </Link>
                                <Checkbox checked={completeStatus.messages} className={styles.status} />
                            </div>
                        </MenuItem>
                    </SubMenu>
                </Menu>
            )}
        </AntSider>
    )
};

const EditLayout = ({ children, dispatch, match, location, ...props }) => {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const {
        courseInfo,
        commitHistory,
        historyHasMore,
        loading,
        areasMenu,
        historyLoading,
        historyInitLoading
    } = props;
    const { courseId } = match.params;
    useEffect(() => {
        dispatch({
            type: 'course/fetchInfo',
            payload: courseId
        });
        return () => {
            dispatch({
                type: 'course/resetInfo'
            });
            dispatch({
                type: 'course/resetHistory'
            });
        };
    }, [courseId]);
    useEffect(() => {
        if (!areasMenu)
            dispatch({
                type: 'settings/fetch'
            });
    }, []);
    const pathname = location.pathname;
    const selectedKeys = [_.replace(pathname, `/course/${courseId}/edit`, '')];
    const handleViewHistory = () => {
        setDrawerVisible(true);
        if (!commitHistory) {
            dispatch({
                type: 'course/fetchHistory',
                payload: courseId
            });
        }
    };
    const handleCloseHistory = () => setDrawerVisible(false);
    const handleMoreHistory = () => {
        dispatch({
            type: 'course/moreHistory',
            payload: courseId
        });
    };
    const loadMore = (
        !historyInitLoading && !historyLoading && commitHistory && historyHasMore ? (
            <div className={styles.loadMore}>
                <span onClick={handleMoreHistory}>More history</span>
            </div>
        ) : null
    );
    const handleViewHistoryItem = item => {
        if (item.type === 1) {
            //target your student
            router.push(`/course/${courseId}/edit/goals`);
        }
        else if (item.type === 2) {
            //syllabus
            router.push(`/course/${courseId}/edit/syllabus`);
        }
        setDrawerVisible(false);
        if (!item.seen) {
            dispatch({
                type: 'course/seenHistory',
                payload: item._id
            });
        }
    };
    return (
        <Layout className={styles.editLayout}>
            <Header
                courseInfo={courseInfo}
                loading={loading}
                handleViewHistory={handleViewHistory}
            />
            <Layout className={styles.container}>
                <Sider 
                    selectedKeys={selectedKeys}
                    courseId={courseId}
                    syllabus={courseInfo && courseInfo.syllabus}
                    loading={loading}
                    completeStatus={courseInfo && courseInfo.completeStatus}
                />
                <ScrollLayout>
                    <Content className={styles.main}>
                        {children}
                    </Content>
                    <Footer />
                </ScrollLayout>
            </Layout>
            <Drawer
                title={(
                    <span className={styles.drawerTitle}>
                        <span className={styles.text}>Change history</span>
                        <Badge
                            count={(courseInfo && courseInfo.noOfUnseen) || 0}
                            style={{ marginLeft: '15px', color: 'white' }}
                        />
                    </span>
                )}
                placement="right"
                closable={true}
                visible={drawerVisible}
                onClose={handleCloseHistory}
                width={360}
                className={styles.historyDrawer}
                bodyStyle={{
                    padding: '0'
                }}
            >
                <Scrollbars
                    autoHeight
                    autoHeightMax={window.innerHeight - 64}
                >
                    {!commitHistory || historyInitLoading ? (
                        <div className={styles.loading}>
                            <div>
                                <Spin indicator={<Icon type="loading" spin style={{ fontSize: '32px' }} />} />
                            </div>
                        </div>
                    ) : (
                        <div className={styles.historyList}>
                            {_.isEmpty(commitHistory) ? (
                                <div className={styles.empty}>
                                    Empty history.
                                </div>
                            ) : _.map(commitHistory, history => (
                                <div
                                    key={history._id + _.uniqueId('history_')}
                                    onClick={() => handleViewHistoryItem(history)}
                                    className={history.seen ? styles.history : classNames(styles.history, styles.unseen)}
                                >
                                    <Tooltip
                                        placement="left"
                                        overlayStyle={{ maxWidth: '1000px', zIndex: 9999999999 }}
                                        title={`${history.user.name}, at ${moment(history.createdAt).format('HH:mm, D MMM')}`}
                                    >
                                        <Avatar src={history.user.avatar} alt="user-avatar" size={32} />
                                        <span className={styles.content}>
                                            {history.content}
                                        </span>
                                    </Tooltip>
                                </div>
                            ))}
                            {loadMore}
                            {historyLoading && (
                                <div className={styles.historyLoading}>
                                    <Spin indicator={<Icon type="loading" spin />} />
                                </div>
                            )}
                            <div className={styles.viewAll}>
                                <Link to={`/course/${courseId}/edit/history`} onClick={() => setDrawerVisible(false)}>View all</Link>
                            </div>
                        </div>
                    )}
                </Scrollbars>
            </Drawer>
        </Layout>
    );
};

export default withRouter(connect(
    ({ settings, loading, course }) => ({
        courseInfo: course.info,
        commitHistory: course.history.list,
        historyHasMore: course.history.hasMore,
        loading: !!loading.effects['course/fetchInfo'],
        historyInitLoading: !!loading.effects['course/fetchHistory'],
        historyLoading: !!loading.effects['course/moreHistory'],
        areasMenu: settings.areasMenu,
    })
)(EditLayout));