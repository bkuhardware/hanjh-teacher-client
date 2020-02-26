import React, { useEffect } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import router from 'umi/router';
import { connect } from 'dva';
import { Table, Avatar, Button, Spin, Icon } from 'antd';
import TimeAgo from 'react-timeago';
import styles from './History.less';

const History = ({ dispatch, match, ...props }) => {
    const {
        initLoading,
        loading,
        commitHistory,
        hasMore
    } = props;
    const { courseId } = match.params;
    useEffect(() => {
        if (!commitHistory) {
            dispatch({
                type: 'course/fetchHistory',
                payload: courseId
            });
        }
    }, [courseId]);
    const handleMoreHistory = () => {
        dispatch({
            type: 'course/moreHistory',
            payload: courseId
        });
    };
    const handleMarkAllAsRead = () => {

    };
    const handleViewHistoryItem = item => {
        if (item.type === 1) {
            //target your student
            router.push(`/course/${courseId}/edit/goals`);
        }
        else if (item.type === 2) {
            //syllabus
            router.push(`/course/${courseId}/edit/syllabus`);
        }
        if (!item.seen) {
            dispatch({
                type: 'course/seenHistory',
                payload: item._id
            });
        }
    }
    const loadMore = (
        !initLoading && !loading && commitHistory && hasMore ? (
            <div className={styles.loadMore}>
                <Button size="small" onClick={handleMoreHistory}>More history</Button>
            </div>
        ) : null
    );
    const columns = [
        {
            title: 'Change content',
            key: 'change',
            dataIndex: 'content',
            width: '55%',
            render: (content, item) => item.seen ? content : <div className={styles.unseenContent}>{content}</div>
        },
        {
            title: 'Author',
            key: 'author',
            dataIndex: 'user',
            width: '30%',
            render: user => (
                <div className={styles.user}>
                    <Avatar alt="user-avatar" size={32} src={user.avatar} />
                    <span className={styles.name}>
                        {user.name}
                    </span>
                </div>
            )
        },
        {
            title: 'Created at',
            key: 'createdAt',
            dataIndex: 'createdAt',
            width: '15%',
            render: createdAt => (
                <TimeAgo date={createdAt} />
            )
        }
    ];
    return (
        <div className={styles.histories}>
            <div className={styles.markAllAsRead}>
                <Button type="primary" onClick={handleMarkAllAsRead}>
                    Mark all as read
                </Button>
            </div>
            <Table
                dataSource={commitHistory || []}
                className={styles.table} 
                rowKey={item => item._id + _.uniqueId('history_')}
                rowClassName={item => item.seen ? styles.history : classNames(styles.unseen, styles.history)}
                columns={columns}
                loading={initLoading || !commitHistory}
                pagination={false}
                size="middle"
                bordered={false}
                onRow={item => ({
                    onClick: () => handleViewHistoryItem(item)
                })}
            />
            {loadMore}
            {loading && (
                <div className={styles.loading}>
                    <Spin indicator={<Icon type="loading" spin style={{ fontSize: '32px' }}/>} />
                </div>
            )}
        </div>
    )
};

export default connect(
    ({ course, loading }) => ({
        initLoading: !!loading.effects['course/fetchHistory'],
        loading: !!loading.effects['course/moreHistory'],
        commitHistory: course.history.list,
        hasMore: course.history.hasMore
    })
)(History);