import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import router from 'umi/router';
import UserAvatar from '@/components/Avatar';
import { Icon, Divider, Row, Col, Spin, Rate, Skeleton, Button, message } from 'antd';
import TimeAgo from 'react-timeago';
import { EditorState } from 'draft-js';
import Editor from '@/components/Editor/SimpleEditor';
import ViewMore from '@/components/ViewMore';
import { roundStarRating } from '@/utils/utils';
import { exportToHTML } from '@/utils/editor';
import styles from './Thread.less';

const Thread = ({ dispatch, match, ...props }) => {
    const { courseId, threadId } = match.params;
    const {
        review,
        initLoading,
        permission,
        answerLoading
    } = props;
    const [yourAnswer, setYourAnswer] = useState(EditorState.createEmpty());
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
    const handleAddAnswer = reviewId => {
        if (!yourAnswer.getCurrentContent().hasText()) return message.error('You must enter answer!');
        //threadId, 
        const html = exportToHTML(yourAnswer);
        dispatch({
            type: 'manage/answerReview',
            payload: {
                courseId,
                reviewId,
                answer: html,
                callback: () => setYourAnswer(EditorState.createEmpty())
            }
        });
        
    };
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
                        <div className={styles.content} dangerouslySetInnerHTML={{ __html: review.comment }} />
                    </Col>
                    <div className={styles.more}>
                        <Icon type="more" />
                    </div>
                </Row>
            )}
            <Row className={styles.beginAnswers}>
                {!review ||initLoading ? 'Loading...' : `${review.answers.length} ${review.answers.length < 2 ? 'answer' : 'answers'}`}
            </Row>
            <Divider className={styles.divider} dashed/>
            {!review ||initLoading ? (
                <div className={styles.answersLoading}>
                    <Skeleton active avatar={{ size: 48, shape: 'circle' }} title={{ width: '25%' }} paragraph={{ rows: 2, width: ['60%', '96%']}}/>
                </div>
            ) : (
                <div className={styles.answers}>
                    {_.isEmpty(review.answers) ? (
                        <div className={styles.empty}>
                            This review doesn't have any answer.
                        </div>
                    ) : _.map(review.answers, (answer, i) => (
                        <React.Fragment key={answer._id}>
                            {i > 0 && (<Divider dashed className={styles.divider} />)}
                            <Row className={styles.answer} key={answer._id}>
                                <Col span={2} className={styles.avatarCont}>
                                    <UserAvatar
                                        src={answer.teacher.avatar}
                                        alt="teacher-avatar"
                                        size={48}
                                        textSize={51}
                                        borderWidth={3}
                                        text={answer.teacher.name}
                                        style={{ background: 'white', color: 'black' }}
                                    />
                                </Col>
                                <Col span={22} className={styles.right}>
                                    <div className={styles.name}>
                                        <span>{answer.teacher.name}</span>
                                        <span style={{ marginLeft: 10 }}>{'(Instructor)'}</span>
                                    </div>
                                    <div className={styles.time}>
                                        <TimeAgo date={answer.createdAt} />
                                    </div>
                                    <ViewMore height={250}>
                                        <div className={styles.content} dangerouslySetInnerHTML={{ __html: answer.content }} />
                                    </ViewMore>
                                </Col>
                            </Row>
                        </React.Fragment>
                    ))}
                    {!initLoading && permission !== null ? (
                        <React.Fragment>
                            {permission >= 1? (
                                <div className={styles.yourAnswer}>
                                    <div className={styles.editor}>
                                        <Spin spinning={answerLoading} tip="Submitting...">
                                            <Editor
                                                editorState={yourAnswer}
                                                onChange={editorState => setYourAnswer(editorState)}
                                                placeholder="Enter answer..."
                                            />
                                        </Spin>
                                    </div>
                                    <Button type="primary" style={{ marginTop: 20 }} loading={answerLoading} onClick={() => handleAddAnswer(review._id)}>Add an answer</Button>
                                </div>
                            ) : (
                                <div className={styles.notAnswer}>
                                    {`Sorry, you don't have permission to answer review.`}
                                </div>
                            )}
                        </React.Fragment>
                    ) : null}
                </div>
            )}
        </div>
    )
};

export default connect(
    ({ manage, loading }) => ({
        review: manage.reviewThread,
        initLoading: !!loading.effects['manage/fetchReviewThread'] || !!loading.effects['manage/fetchPermission'],
        answerLoading: !!loading.effects['manage/answerReview'],
        permission: manage.reviews.permission
    })
)(Thread);