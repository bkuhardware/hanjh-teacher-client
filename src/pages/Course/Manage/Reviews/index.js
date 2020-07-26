import React, { useEffect } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import router from 'umi/router';
import { Rate, Divider, Icon, Skeleton, Spin, Row, Col, List, Button, Modal } from 'antd';
import UserAvatar from '@/components/Avatar';
import ViewMore from '@/components/ViewMore';
import TimeAgo from 'react-timeago';
import { roundStarRating } from '@/utils/utils';
import styles from './index.less';

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

const ReviewStatus = ({ numOfLikes, numOfDislikes, status, handleVoting, reviewId, permission, handleViewReview }) => {
    return (
        <Row className={styles.tail}>
            <Col className={styles.voting} span={16}>
                <span className={styles.text}>Was this review helpful?</span>
                <span className={styles.like}>
                    <span onClick={() => handleVoting(reviewId, status !== 1 ? 1 : 0, status)}>
                        <Icon type="like" theme="filled" style={{ color: (status === 1) ? '#fada5e' : 'white' }}/>
                    </span>
                    <span className={styles.count}>
                        {numOfLikes}
                    </span>
                </span>
                <span className={styles.dislike}>
                    <span onClick={() => handleVoting(reviewId, status !== -1 ? -1 : 0, status)}>
                        <Icon type="dislike" theme="filled" style={{ color: (status === -1) ? '#fada5e' : 'white' }}/>
                    </span>
                    <span className={styles.count}>
                        {numOfDislikes}
                    </span>
                </span>
            </Col>
            <Col span={8} className={styles.detail}>
                {permission >= 1 && (
                     <span onClick={handleViewReview}>
                     <span className={styles.text}>Answer</span>
                          <Icon type="enter" />
                     </span>
                )}
            </Col>
        </Row>
    )
}
const Answer = ({ answer }) => {
    return (
        <div className={styles.answer}>
            <div className={styles.user}>
                <div className={styles.avatarCont}>
                    <UserAvatar
                        src={answer.teacher.avatar}
                        size={48}
                        textSize={48}
                        alt="ava-teacher"
                        text={answer.teacher.name}
                        borderWidth={0}
                        style={{ background: '#fada5e', color: 'white' }}
                    />
                </div>
                <div className={styles.info}>
                    <div className={styles.names}>
                        <span className={styles.name}>{answer.teacher.name}</span>
                        <span className={styles.instructor}>{`(Instructor)`}</span>
                    </div>
                    <div className={styles.time}>
                        <TimeAgo date={answer.createdAt} />
                    </div>
                </div>
            </div>
            <div className={styles.content}>
                <ViewMore height={150}>
                    <div dangerouslySetInnerHTML={{ __html: answer.content }}/>
                </ViewMore>
            </div>
        </div>
    )
};

const FeaturedReview = ({ data: review, handleVoting, handleViewReview, permission }) => {
    return (
        <div className={styles.featuredReview}>
            <div className={styles.user}>
                <div className={styles.avatarCont}>
                    <UserAvatar
                        src={review.user.avatar}
                        size={60}
                        textSize={60}
                        alt="ava-user"
                        text={review.user.name}
                        borderWidth={0}
                        style={{ background: '#fada5e', color: 'white'} }
                    />
                </div>
                <div className={styles.info}>
                    <div className={styles.names}>
                        <span className={styles.name}>{review.user.name}</span>
                        <span className={styles.time}><TimeAgo date={review.createdAt} /></span>
                    </div>
                    <div className={styles.starRating}>
                        <Rate allowHalf value={roundStarRating(review.starRating)} disabled className={styles.stars} />
                        <span className={styles.ratingVal}>{review.starRating}</span>
                    </div>
                </div>
            </div>
            <div className={styles.content}>
                <ViewMore height={250}>
                    <div dangerouslySetInnerHTML={{ __html: review.comment || '<span style="opacity: 0.8">No comment.</span>' }}/>
                </ViewMore>
            </div>
            <ReviewStatus
                status={review.status}
                reviewId={review._id}
                permission={permission}
                handleViewReview={handleViewReview}
                handleVoting={(...args) => handleVoting('featured', ...args)}
                numOfDislikes={review.numOfDislikes}
                numOfLikes={review.numOfLikes}
            />
            
            {!_.isEmpty(review.answers) && (
                <div className={styles.answers}>
                    <div className={styles.title}>Answers</div>
                    <div className={styles.data}>
                        {_.map(review.answers, (answer, i) => (
                            <React.Fragment key={answer._id}>
                                {i > 0 && (<Divider dashed className={styles.divider} />)}
                                <Answer key={answer._id} answer={answer} />
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
};

const Review = ({ data: review, handleVoting, handleViewReview, permission }) => {
    return (
        <Row className={styles.review}>
            <Col span={6} className={styles.user}>
                <div className={styles.avatarCont}>
                    <UserAvatar
                        src={review.user.avatar}
                        size={60}
                        textSize={60}
                        alt="ava-user"
                        text={review.user.name}
                        borderWidth={0}
                        style={{ background: '#fada5e', color: 'white'} }
                    />
                </div>
                <div className={styles.name}>
                    {review.user.name}
                </div>
                <div className={styles.time}>
                    <TimeAgo date={review.createdAt} />
                </div>
            </Col>
            <Col span={18} className={styles.right}>
                <div className={styles.starRating}>
                    <Rate allowHalf value={roundStarRating(review.starRating)} disabled className={styles.stars} />
                    <span className={styles.ratingVal}>{review.starRating}</span>
                </div>
                <div className={styles.content}>
                    <ViewMore height={250}>
                        <div dangerouslySetInnerHTML={{ __html: review.comment || '<span style="opacity: 0.6">No comment.</span>' }}/>
                    </ViewMore>
                </div>
                <ReviewStatus
                    status={review.status}
                    reviewId={review._id}
                    permission={permission}
                    handleViewReview={handleViewReview}
                    handleVoting={(...args) => handleVoting('default', ...args)}
                    numOfDislikes={review.numOfDislikes}
                    numOfLikes={review.numOfLikes}
                />
                {!_.isEmpty(review.answers) && (
                    <div className={styles.answers}>
                        <div className={styles.title}>Answers</div>
                        <div className={styles.data}>
                            {_.map(review.answers, (answer, i) => (
                                <React.Fragment key={answer._id}>
                                    {i > 0 && (<Divider dashed className={styles.divider} />)}
                                    <Answer key={answer._id} answer={answer} />
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                )}
            </Col>
        </Row>
    );
};

const Reviews = ({ dispatch, match, location, ...props }) => {
    const { courseId } = match.params;
    const {
        user,
        initLoading,
        loading,
        reviews,
        featuredReviews,
        hasMore,
        permission
    } = props;
    const handleMoreReviews = () => {
        dispatch({
            type: 'manage/moreReviews',
            payload: courseId
        });
    };
    const handleVoting = (type, reviewId, value, oldValue) => {
        if (!user) {
            Modal.error({
                title: 'Unauthorized',
                content: 'You must log in to do this action',
                centered: true,
                cancelText: 'Ignore',
                onOk: () => router.push('/user/login')
            })
        }
        else {
            dispatch({
                type: 'manage/voteReview',
                payload: {
                    type,
                    reviewId,
                    value,
                    courseId,
                    oldValue
                }
            });
        }
    };
    const loadMore = (
        hasMore && !initLoading && !loading && reviews && featuredReviews ? (
            <div className={styles.loadMore}>
                <Button size="small" type="default" onClick={handleMoreReviews}>More reviews</Button>
            </div>
        ) : null
    );
    const reviewsList = !loading ? reviews : _.concat(reviews, [
        {
            _id: _.uniqueId('review_loading_'),
            loading: true
        },
        {
            _id: _.uniqueId('review_loading_'),
            loading: true
        },
    ]);
    let count = 0;
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
                <React.Fragment>
                    {featuredReviews && !_.isEmpty(featuredReviews) && (
                        <Row className={styles.featured}>
                            <div className={styles.title}>Featured reviews</div>
                            <div className={styles.main}>
                                {_.map(featuredReviews, (review, i) => (
                                    <React.Fragment key={review._id}>
                                        {i > 0 && (
                                            <Divider dashed className={styles.divider} />
                                        )}
                                        <FeaturedReview
                                            handleViewReview={() => router.push(`${location.pathname}/thread/${review._id}`)}
                                            data={review}
                                            key={review._id + _.uniqueId('featured_review_')}
                                            handleVoting={handleVoting}
                                            permission={permission}
                                        />
                                    </React.Fragment>
                                ))}
                            </div>
                        </Row>
                    )}
                    <Row className={styles.listReviews}>
                        <div className={styles.title}>Reviews</div>
                        <div className={styles.main}>
                            <List
                                dataSource={reviewsList}
                                itemLayout="horizontal"
                                split={false}
                                className={styles.list}
                                rowKey={item => item._id}
                                loadMore={loadMore}
                                renderItem={item => (
                                    <>
                                        {count++ > 0 && (<Divider dashed className={styles.divider} />)}
                                        <List.Item style={{ borderBottom: 'none' }}>
                                            <Skeleton loading={item.loading} active avatar={{ size: 60 }} paragraph={{ rows: 3, width: ['90%', '75%', '45%']}} title={{ width: '30%' }}>
                                                <Review
                                                    data={item}
                                                    handleVoting={handleVoting}
                                                    handleViewReview={() => router.push(`${location.pathname}/thread/${item._id}`)}
                                                    permission={permission}
                                                />
                                            </Skeleton>  
                                        </List.Item>
                                    </>
                                )}
                            />
                        </div>
                    </Row>
                </React.Fragment>
            )}
        </div>
    )
};

export default connect(
    ({ user, manage, loading }) => ({
        user: user,
        initLoading: !!loading.effects['manage/fetchReviews'] || !!loading.effects['manage/fetchPermission'],
        loading: !!loading.effects['manage/moreReviews'],
        reviews: manage.reviews.list,
        featuredReviews: manage.reviews.featured,
        permission: manage.reviews.permission,
        hasMore: manage.reviews.hasMore
    })
)(Reviews);