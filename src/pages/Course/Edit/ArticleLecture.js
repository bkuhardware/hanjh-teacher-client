import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'dva';
import { Drawer, Icon, Button, Tabs, Select, Skeleton, Spin } from 'antd';
import TimeAgo from 'react-timeago';
import Scrollbars from 'react-custom-scrollbars';
import styles from './ArticleLecture.less';

const ArticleLecture = ({ dispatch, match, ...props }) => {
    const { courseId, lectureId } = match.params;
    const {
        article,
        description,
        resources,
        loading,
        resourcesInitLoading,
        resourcesLoading,
        descriptionLoading
    } = props;
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        dispatch({
            type: 'article/fetch',
            payload: {
                courseId,
                lectureId
            }
        });
        return () => dispatch({ type: 'article/reset' });
    }, [courseId, lectureId]);
    return (
        <div className={styles.article}>
            {!article || loading ? (
                <div className={styles.loading}>
                    <Skeleton className={styles.titleSkeleton} active title={null} paragraph={{ rows: 1, width: '96%' }} />
                    <Skeleton active title={null} paragraph={{ rows: 2, width: ['62%', '42%'] }} />
                    <div className={styles.spin}>
                        <Spin indicator={<Icon type="loading" style={{ fontSize: 64 }} spin />} />
                    </div>
                </div>
            ) : (
                <React.Fragment>
                    <div className={styles.title}>{article.title}</div>
                    <div className={styles.chapter}>
                        {`Chapter ${article.chapter.title}`}
                    </div>
                    <div className={styles.extra}>
                        <span className={styles.text}>{article.updatedAt === article.createdAt ? 'Created on' : 'Last updated'}</span>
                        <span className={styles.time}>
                            <TimeAgo date={article.updatedAt} />
                        </span>
                    </div>
                    <div className={styles.content}>

                    </div>
                </React.Fragment>
            )}
            <div className={styles.settings} onClick={() => setVisible(true)}>
                <Icon type="setting" theme="filled" spin className={styles.icon} />
                <span className={styles.text}>Open settings</span>
            </div>
            <Drawer
                title={(
                    <span className={styles.drawerTitle}>
                        Lecture settings
                    </span>
                )}
                placement="right"
                closable={true}
                visible={visible}
                onClose={() => setVisible(false)}
                width={360}
                className={styles.settingsDrawer}
                bodyStyle={{
                    padding: '16px'
                }}
            >
                <Scrollbars
                    autoHeight
                    autoHeightMax={window.innerHeight - 64}
                >
                    
                </Scrollbars>
            </Drawer>
        </div>
    )
};

export default connect(
    ({ article, loading }) => ({
        article: article.info,
        description: article.description,
        resources: article.resources,
        loading: !!loading.effects['article/fetch'],
        resourcesInitLoading: !!loading.effects['article/fetchResources'],
        resourcesLoading: !!loading.effects['article/moreResources'],
        descriptionLoading: !!loading.effects['article/fetchDescription']
    })
)(ArticleLecture)