import React, { useEffect } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Rate, Divider, Icon, Skeleton, Spin } from 'antd';
import UserAvatar from '@/components/Avatar';
import styles from './Reviews.less';

const LoadingReview = () => {
    return (
        <div className={styles.loadingReview}>
            <div className={styles.info}>
                <Skeleton avatar={{ shape: 'circle', size: 60 }} active title={null} paragraph={{ rows: 2, width: ['20%', '15%'] }} />
            </div>
            <div className={styles.text}>
                <Skeleton active title={null} paragraph={{ rows: 2, width: ['100%', '80%'] }} />
            </div>
        </div>
    )
};

const Reviews = ({ dispatch, match, ...props }) => {
    const { courseId } = match.params;
    const {
        initLoading,
        loading,
        reviews
    } = props;
    useEffect(() => {
        dispatch({
            type: 'manage/fetchReviews',
            payload: courseId
        });
        return () => dispatch({ type: 'manage/resetReviews' });
    }, [courseId]);
    return (
        <div className={styles.reviews}>
            {!reviews || initLoading ? (
                <div className={styles.loading}>
                    <LoadingReview />
                    <Divider className={styles.divider} dashed/>
                    <LoadingReview />
                    <div className={styles.spin}>
                        <Spin indicator={<Icon spin type="loading" style={{ color: '#fada5e', fontSize: '44px' }}/>} />
                    </div>
                </div>
            ) : (
                <div />
            )}
        </div>
    )
};

export default connect(
    ({ manage, loading }) => ({
        initLoading: !!loading.effects['manage/fetchReviews'],
        loading: !!loading.effects['manage/moreReviews'],
        reviews: manage.reviews
    })
)(Reviews);