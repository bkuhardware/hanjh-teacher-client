import React, { useEffect } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import router from 'umi/router';
import UserAvatar from '@/components/Avatar';
import { Icon, Divider, Row, Col, Spin, Rate } from 'antd';
import TimeAgo from 'react-timeago';
import { EditorState } from 'draft-js';
import Editor from '@/components/Editor/SimpleEditor';
import { roundStarRating } from '@/utils/utils';
import styles from './Thread.less';

const Thread = ({ dispatch, match, ...props }) => {
    const { courseId, threadId } = match.params;
    const {
        review,
        initLoading
    } = props;
    useEffect(() => {
        dispatch({
            type: 'manage/fetchReviewThread',
            payload: {
                courseId,
                threadId
            }
        });
        return () => dispatch({ type: 'manage/resetReviewThread' });
    }, [threadId, courseId]);
    return (
        <div className={styles.thread}>
            <div className={styles.back}>
                <span onClick={() => router.push(`/course/${courseId}/manage/reviews`)}>
                    <Icon type="arrow-left" />
                    <span className={styles.text}>Back to reviews</span>
                </span>
            </div>
            {!review || initLoading ? (
                <div className={styles.loading}>
                    <div className={styles.inlineDiv}>
                        <Spin indicator={<Icon type="loading" spin style={{ fontSize: 64 }} />}/>
                    </div>
                </div>
            ) : (
                <Row className={styles.reviewContent}>
                    <Col span={4} className={styles.avatarCont}>
                        <UserAvatar
                            src={review.user.avatar}
                            alt="user-avatar"
                            size={80}
                            textSize={83}
                            borderWidth={3}
                            text={review.user.name}
                            style={{ background: 'white', color: 'black', fontSize: '30px' }}
                        />
                    </Col>
                    <Col span={20} className={styles.right}>
                        <div className={styles.starRating}>
                            <Rate allowHalf value={roundStarRating(review.starRating)} disabled className={styles.stars} />
                            <span className={styles.ratingVal}>{review.starRating}</span>
                        </div>
                        <div className={styles.extra}>
                            <span className={styles.name}>{review.user.name}</span>
                            <span className={styles.time}>
                                <TimeAgo date={review.createdAt}/>
                            </span>
                        </div>
                        <div className={styles.content} dangerouslySetInnerHTML={{ __html: review.content }} />
                    </Col>
                    <div className={styles.more}>
                        <Icon type="more" />
                    </div>
                </Row>
            )}
        </div>
    )
};

export default connect(
    ({ manage, loading }) => ({
        review: manage.reviewThread,
        initLoading: !!loading.effects['manage/fetchReviewThread']
    })
)(Thread);