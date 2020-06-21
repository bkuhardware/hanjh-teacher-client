import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import router from 'umi/router';
import { Divider, Select, TreeSelect, Input, Row, Col, Form, Icon, Spin, Button, Skeleton, message } from 'antd';
import UserAvatar from '@/components/Avatar';
import TimeAgo from 'react-timeago';
import Loading from '@/elements/spin/secondary';
import styles from './index.less';

const { Option } = Select;
const { Search } = Input;
const FormItem = Form.Item;

const Forum = ({ location, match, dispatch, ...props }) => {
    const {
        forum,
        initLoading,
        loading,
        lectureOptionsLoading,
        sortLoading,
        filterByLectureLoading,
        filterByTypesLoading,
    } = props;
    const { courseId } = match.params;
    const handleSort = value => {
        dispatch({
            type: 'manage/sortQuestions',
            payload: {
                courseId,
                value
            }
        });
    };

    const handleQuestionTypes = values => {
        dispatch({
            type: 'manage/filterQuestionsByTypes',
            payload: {
                courseId,
                values
            }
        });
    };

    const handleLecture = value => {
        dispatch({
            type: 'manage/filterQuestionsByLecture',
            payload: {
                courseId,
                value
            }
        });
    };

    const handleMoreThreads = () => {
        dispatch({
            type: 'manage/moreQuestions',
            payload: courseId
        });
    };

    const loadMore = (
        !initLoading && !loading && forum.list && forum.hasMore ? (
            <div className={styles.loadMore}>
                <Button size="small" onClick={handleMoreThreads}>More questions</Button>
            </div>
        ) : null
    );
    // message.info(!forum.total || initLoading);
    const threadsData = loading ? [...forum.list, {
        _id: _.uniqueId('thread_loading_'),
        loading: true
    }, {
        _id: _.uniqueId('thread_loading_'),
        loading: true
    }] : forum.list;
    const lectureOptionsData = !forum.lectureOptions || lectureOptionsLoading ? [] : (_.map(forum.lectureOptions, chapter => ({
        key: chapter._id,
        title: chapter.title,
        value: chapter._id,
        selectable: false,
        children: _.map(chapter.lectures, lecture => ({
            key: lecture._id,
            value: lecture._id,
            title: lecture.title  
        }))
    })));

    return (
        <div className={styles.forum}>
            <div className={styles.search}>
                <Search placeholder="Search question..." size="large" />
            </div>
            <div className={styles.filters}>
                <Form layout="vertical">
                    <Row gutter={24}>
                        <Col span={8}>
                            <FormItem label="Lecture">
                                <TreeSelect
                                    disabled={!forum.lectureOptions || lectureOptionsLoading}
                                    style={{ width: '100%' }}
                                    onChange={handleLecture}
                                    value={forum.filters.lecture}
                                    dropdownClassName={styles.forumTreeSelect}
                                    dropdownStyle={{ maxHeight: 360, overflow: 'auto' }}
                                    size="large"
                                    suffixIcon={!forum.lectureOptions || lectureOptionsLoading ? (
                                        <Icon type="loading" spin style={{ fontSize: 16, color: '#fada5e' }}/>
                                    ) : undefined}
                                    treeData={[
                                        {
                                            title: 'All lectures',
                                            key: 'all',
                                            value: 'all'
                                        },
                                        ...lectureOptionsData
                                    ]}
                                />
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="Sort by">
                                <Select
                                    className={styles.sortBy}
                                    size="large"
                                    onChange={handleSort}
                                    value={forum.filters.sortBy}
                                    style={{ width: '100%' }}
                                >
                                    <Option value="relevance">Sort by relevance</Option>
                                    <Option value="recent">Sort by most recent</Option>
                                    <Option value="upvoted">Sort by most upvoted</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="Question type">
                                <Select
                                    mode="multiple"
                                    placeholder="Question type"
                                    size="large"
                                    value={forum.filters.questionTypes}
                                    style={{ width: '100%' }}
                                    optionLabelProp="label"
                                    onChange={handleQuestionTypes}
                                >
                                    <Option value="following" label="Following">Questions I'm following</Option>
                                    <Option value="noResponse" label="No response">Questions without response</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
            <Row className={styles.totalAndNew}>
                <Col span={12} className={styles.total}>{(forum.total === null|| initLoading) ? 'Loading...' : `${forum.total} ${forum.total < 2 ? 'question' : 'questions'}`}</Col>
            </Row>
            <Divider className={styles.divider} dashed/>
            <div className={styles.threads}>
                {initLoading || !forum.list ? (
                    <div className={styles.loading}>
                        <div className={styles.inlineDiv}>
                            <Spin indicator={<Icon type="loading" spin style={{ fontSize: 64 }} />} />
                        </div>
                    </div>
                ) : (
                    <Loading spinning={sortLoading || filterByLectureLoading || filterByTypesLoading} fontSize={8} isCenter>
                        {_.map(threadsData, (thread, i) => (
                            <React.Fragment key={thread._id}>
                                {i > 0 && (<Divider className={styles.divider} dashed key={`divider_${thread._id}`} />)}
                                {thread.loading ? (
                                    <Skeleton active avatar={{ size: 40, shape: 'circle' }} title={false} key={`skeleton_${thread._id}`} paragraph={{ rows: 3, width: ['40%', '90%', '45%']}} />
                                ) : (
                                    <Row className={styles.thread} key={`row_${thread._id}`} onClick={() => router.push(`${location.pathname}/thread/${thread._id}`)}>
                                        <Col span={2} className={styles.avatarCont}>
                                            <UserAvatar
                                                alt="avat-user"
                                                src={thread.user.avatar}
                                                style={{ background: 'white', color: 'black' }}
                                                borderWidth={2}
                                                size={42}
                                                textSize={44}
                                                text={thread.user.name}
                                            />
                                        </Col>
                                        <Col span={18} className={styles.info}>
                                            <div className={styles.title}>{thread.title}</div>
                                            <div className={styles.content}>{thread.content}</div>
                                            <div className={styles.extra}>
                                                <span className={styles.name}>{thread.user.name}</span>
                                                <span className={styles.order}>{`Lecture ${thread.lectureIndex}`}</span>
                                                <span className={styles.time}>
                                                    <TimeAgo date={thread.createdAt}/>
                                                </span>
                                            </div>
                                        </Col>
                                        <Col span={4} className={styles.statistic}>
                                            <div className={styles.votings}>
                                                <span className={styles.value}>{thread.numOfVotes}</span>
                                                <Icon type="arrow-up" />
                                            </div>
                                            <div className={styles.answers}>
                                                <span className={styles.value}>{thread.numOfAnswers}</span>
                                                <Icon type="message" />
                                            </div>
                                        </Col>
                                    </Row>
                                )}
                            </React.Fragment>
                        ))}
                    </Loading>
                )}
                {loadMore}
            </div>
        </div>
    )
    
};

export default connect(
    ({ manage, loading }) => ({
        forum: manage.forum,
        initLoading: !!loading.effects['manage/fetchQuestions'] || !!loading.effects['manage/fetchQuestionsAgain'],
        loading: !!loading.effects['manage/moreQuestions'],
        lectureOptionsLoading: !!loading.effects['manage/fetchLectureOpts'],
        sortLoading: !!loading.effects['manage/sortQuestions'],
        filterByLectureLoading: !!loading.effects['manage/filterQuestionsByLecture'],
        filterByTypesLoading: !!loading.effects['manage/filterQuestionsByTypes'],
    })
)(Forum);