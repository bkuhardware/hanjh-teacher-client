import React, { useEffect } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'dva';
import { Drawer, Icon, Button, Tabs, Select, Skeleton, Spin } from 'antd';
import TimeAgo from 'react-timeago';
import styles from './ArticleLecture.less';

const ArticleLecture = ({ dispatch, match, ...props }) => {
    const { courseId, lectureId } = match.params;
    const {
        article,
        loading,
        resourcesInitLoading,
        resourcesLoading,
        descriptionLoading
    } = props;

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
                        {`Chapter ${lecture.chapter.title}`}
                    </div>
                    <div className={styles.extra}>
                        <span className={styles.text}>{lecture.updatedAt === lecture.createdAt ? 'Created on' : 'Last updated'}</span>
                        <span className={styles.time}>
                            <TimeAgo date={lecture.updatedAt} />
                        </span>
                    </div>
                </React.Fragment>
            )}
        </div>
    )
};

export default connect(
    ({ course, loading }) => ({
        article: course.article,
        loading: !!loading.effects['courses/fetchArticle'],
        resourcesInitLoading: !!loading.effects['courses/fetchResources'],
        resourcesLoading: !!loading.effects['courses/moreResources'],
        descriptionLoading: !!loading.effects['courses/fetchDescription']
    })
)(ArticleLecture)