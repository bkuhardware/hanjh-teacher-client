import React, { useEffect } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Rate, Divider, Icon, Skeleton, Spin, Row, Col, List, Button } from 'antd';
import UserAvatar from '@/components/Avatar';
import ViewMore from '@/components/ViewMore';
import TimeAgo from 'react-timeago';
import { roundStarRating } from '@/utils/utils';
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

const Answer = ({ answer }) => {
    return (
        <div className={styles.answer}>
            <div className={styles.user}>
                <div className={styles.avatarCont}>
                    <UserAvatar
                        src={answer.user.avatar}
                        size={48}
                        textSize={48}
                        alt="ava-user"
                        text={answer.user.name}
                        borderWidth={0}
                        style={{ background: '#fada5e', color: 'white' }}
                    />
                </div>
                <div className={styles.info}>
                    <div className={styles.names}>
                        <span className={styles.name}>{answer.user.name}</span>
                        {answer.user.isInstructor && <span className={styles.instructor}>{`(Instructor)`}</span>}
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

const FeaturedReview = ({ data: review, handleVoting }) => {
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
                    <div dangerouslySetInnerHTML={{ __html: review.content }}/>
                </ViewMore>
            </div>
            <div className={styles.voting}>
                <span className={styles.text}>Was this review helpful?</span>
                <span
                    className={styles.like}
                    onClick={() => {
                        if (review.status !== 1) handleVoting('featured', review._id, 1, review.status);
                        else handleVoting('featured', review._id, null, review.status);
                    }}
                >
                    <Icon type="like" theme="filled" style={{ color: (review.status === 1) ? '#fada5e' : 'white' }}/>
                </span>
                <span
                    className={styles.dislike}
                    onClick={() => {
                        if (review.status !== 0) handleVoting('featured', review._id, 0, review.status);
                        else handleVoting('featured', review._id, null, review.status);
                    }}
                >
                    <Icon type="dislike" theme="filled" style={{ color: (review.status === 0) ? '#fada5e' : 'white' }}/>
                </span>
            </div>
        </div>
    )
};

const Review = ({ data: review, handleVoting }) => {
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
                        <div dangerouslySetInnerHTML={{ __html: review.content }}/>
                    </ViewMore>
                </div>
                <div className={styles.voting}>
                    <span className={styles.text}>Was this review helpful?</span>
                    <span
                        className={styles.like}
                        onClick={() => {
                            if (review.status !== 1) handleVoting('default', review._id, 1, review.status);
                            else handleVoting('default', review._id, null, review.status);
                        }}>
                            <Icon type="like" theme="filled" style={{ color: (review.status === 1) ? '#fada5e' : 'white' }}/>
                        </span>
                    <span
                        className={styles.dislike}
                        onClick={() => {
                            if (review.status !== 0) handleVoting('default', review._id, 0, review.status);
                            else handleVoting('default', review._id, null, review.status);
                        }}
                    >
                        <Icon type="dislike" theme="filled" style={{ color: (review.status === 0) ? '#fada5e' : 'white' }}/>
                    </span>
                </div>
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

const Reviews = ({ dispatch, match, ...props }) => {
    const { courseId } = match.params;
    const {
        initLoading,
        loading,
        reviews,
        featuredReviews,
        hasMore
    } = props;
    useEffect(() => {
        dispatch({
            type: 'manage/fetchReviews',
            payload: courseId
        });
        return () => dispatch({ type: 'manage/resetReviews' });
    }, [courseId]);
    const handleMoreReviews = () => {
        dispatch({
            type: 'manage/moreReviews',
            payload: courseId
        });
    };
    const handleVoting = (type, reviewId, value, oldValue) => {
        dispatch({
            type: 'manage/voteReview',
            payload: {
                type,
                reviewId,
                value,
                oldValue
            }
        });
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
                                    <React.Fragment key={review._id + _.uniqueId('feature_review_')}>
                                        {i > 0 && (
                                            <Divider dashed className={styles.divider} />
                                        )}
                                        <FeaturedReview data={review} key={review._id + _.uniqueId('featured_review_')} handleVoting={handleVoting}/>
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
                                rowKey={item => item._id + _.uniqueId('review_')}
                                loadMore={loadMore}
                                renderItem={item => (
                                    <>
                                        {count++ > 0 && (<Divider dashed className={styles.divider} />)}
                                        <List.Item style={{ borderBottom: 'none' }}>
                                            <Skeleton loading={item.loading} active avatar={{ size: 60 }} paragraph={{ rows: 3, width: ['90%', '75%', '45%']}} title={{ width: '30%' }}>
                                                <Review data={item} handleVoting={handleVoting} />
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
    ({ manage, loading }) => ({
        initLoading: !!loading.effects['manage/fetchReviews'],
        loading: !!loading.effects['manage/moreReviews'],
        reviews: manage.reviews.list,
        featuredReviews: manage.reviews.featured,
        hasMore: manage.reviews.hasMore
    })
)(Reviews);