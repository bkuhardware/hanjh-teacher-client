import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'dva';
import { Skeleton, Avatar, Row, Col, Input, List, Button, Divider, Icon, Spin, message } from 'antd';
import UserAvatar from '@/components/Avatar';
import TimeAgo from 'react-timeago';
import ViewMore from '@/components/ViewMore';
import { avatarSrc } from '@/config/constants';
import { EditorState } from 'draft-js';
import Editor from '@/components/Editor/ImageEditor';
import { exportToHTML } from '@/utils/editor';
import styles from './Announcements.less';

const LoadingAnnouncement = () => {
    return (
        <div className={styles.loadingAnnouncement}>
            <Skeleton active title={null} paragraph={{ rows: 2, width: ['98%', '62%'] }} avatar={{ size: 60, shape: 'circle' }} />
        </div>
    )
};

const CommentInput = ({ onPressEnter, disabled }) => {
    const [value, setValue] = useState('');
    const handlePressEnter = e => {
        if (!e.shiftKey) {
            e.preventDefault();
            onPressEnter(value);
            setValue('');
        }
    };
    return (
        <Input.TextArea
            className={styles.textArea}
            value={value}
            onChange={e => setValue(e.target.value)}
            onPressEnter={handlePressEnter}
            placeholder="Enter comment..."
            disabled={disabled}
            autoSize={{
                minRows: 1,
                maxRows: 2
            }}
        />
    )
};

const Announcements = ({ match, dispatch, ...props }) => {
    const [content, setContent] = useState(EditorState.createEmpty());
    const {
        userAvatar,
        userName,
        announcements,
        loading,
        initLoading,
        commentLoading,
        permissionLoading,
        addAnnounceLoading,
        permission,
        hasMore
    } = props;
    const { courseId } = match.params;
    useEffect(() => {
        dispatch({
            type: 'manage/fetchAnnouncements',
            payload: courseId
        });
        dispatch({
            type: 'manage/fetchPermission',
            payload: {
                courseId,
                type: 'announcements'
            }
        })
        return () => dispatch({
            type: 'manage/resetAnnouncements'
        });
    }, [courseId, dispatch]);
    const handleMoreAnnouncements = () => {
        dispatch({
            type: 'manage/moreAnnouncements',
            payload: courseId
        });
    };
    const handleMoreComments = announcementId => {
        dispatch({
            type: 'manage/moreComments',
            payload: {
                announcementId,
                courseId
            }
        });
    };
    const handleComment = (announcementId, comment) => {
        if (comment !== '') {
            dispatch({
                type: 'manage/comment',
                payload: {
                    announcementId,
                    content: comment,
                }
            });
        }
    };
    const handleSubmitAnnouncement = () => {
        if (!content.getCurrentContent().hasText()) return message.error('You must enter announcement!');
        const html = exportToHTML(content);
        dispatch({
            type: 'manage/addAnnouncement',
            payload: {
                courseId,
                content: html,
                callback: () => setContent(EditorState.createEmpty())
            }
        });
        
    };
    const loadMore = (
        (!initLoading && !loading && announcements && hasMore) ? (
            <div className={styles.loadMore}>
                <Button size="small" onClick={handleMoreAnnouncements}>More announcements</Button>
            </div>
        ) : null
    );

    let announcementData = announcements ? _.orderBy(announcements, ['createdAt'], ['desc']) : null;
    if (loading && announcementData) {
        announcementData = _.concat(announcementData, [
            {
                _id: _.uniqueId('announcement_loading_'),
                loading: true
            }
        ]);
    }
    return (
        <div className={styles.announcements}>
            {!announcements || initLoading ? (
                <React.Fragment>
                    <LoadingAnnouncement />
                    <div style={{ height: 60 }}/>
                    <LoadingAnnouncement />
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <List
                        className={styles.list}
                        itemLayout="horizontal"
                        dataSource={announcementData}
                        rowKey={announcement => announcement._id}
                        split={false}
                        renderItem={announcement => (
                            <React.Fragment>
                                {announcement.loading ? (
                                    <div>
                                        <div style={{ height: 60 }}/>
                                        <LoadingAnnouncement />
                                    </div>
                                ) : (
                                    <div className={styles.announcement}>
                                        <div className={styles.announce}>
                                            <div className={styles.user}>
                                                <div className={styles.avatarCont}>
                                                    <UserAvatar
                                                        alt="ins-ava"
                                                        size={60}
                                                        borderWidth={3}
                                                        src={announcement.teacher.avatar}
                                                        text={announcement.teacher.name}
                                                        textSize={63}
                                                        style={{ fontSize: '26px', background: 'white', color: 'black' }}
                                                    />
                                                    
                                                </div>
                                                <div className={styles.txt}>
                                                    <div className={styles.name}>{announcement.teacher.name}</div>
                                                    <div className={styles.time}><TimeAgo date={moment(announcement.createdAt)} /></div>
                                                </div>
                                            </div>
                                            <Row className={styles.content}>
                                                <div dangerouslySetInnerHTML={{ __html: announcement.content }}/>
                                            </Row>
                                        </div>
                                        <Divider dashed className={styles.divider} />
                                        <div className={styles.comments}>
                                            {!_.isEmpty(announcement.comments) && (
                                                <List
                                                    itemLayout="horizontal"
                                                    dataSource={announcement.comments}
                                                    rowKey={comment => comment._id}
                                                    split={false}
                                                    renderItem={comment => (
                                                        <Row className={styles.comment}>
                                                            <Col span={2} className={styles.avatarCont}>
                                                                <UserAvatar
                                                                    src={comment.owner.avatar}
                                                                    alt="user-avar"
                                                                    size={48}
                                                                    borderWidth={2}
                                                                    text={comment.owner.name}
                                                                    textSize={50}
                                                                    style={{ background: 'white', color: 'black' }}
                                                                />
                                                            </Col>
                                                            <Col span={22} className={styles.right}>
                                                                <div className={styles.nameAndTime}>
                                                                    <span className={styles.name}>
                                                                        <span>{comment.owner.name}</span>
                                                                        {comment.ownerType === 'Teacher' && (
                                                                            <span style={{ marginLeft: 10 }}>{'(Instructor)'}</span>
                                                                        )}
                                                                    </span>
                                                                    <span className={styles.time}><TimeAgo date={comment.createdAt} /></span>
                                                                </div>
                                                                <ViewMore height={200}>
                                                                    <div className={styles.content} dangerouslySetInnerHTML={{ __html: comment.content }} />
                                                                </ViewMore>
                                                            </Col>
                                                        </Row>
                                                    )}
                                                />
                                            )}
                                        </div>
                                        {announcement.moreComments && (
                                            <div className={styles.moreComments}>
                                                <span
                                                    className={styles.txt}
                                                    onClick={() => handleMoreComments(announcement._id)}
                                                >
                                                    <Icon type="plus" style={{ fontSize: '0.8em' }} /> More comments
                                                </span>
                                                {announcement.commentsLoading && (
                                                    <span className={styles.iconLoading}>
                                                        <Icon type="loading-3-quarters" style={{ fontSize: '0.8em' }} spin/>
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        <Row className={styles.yourComment}>
                                            <Col span={2} className={styles.avatarCont}>
                                                <UserAvatar
                                                    alt="your-avar"
                                                    size={48}
                                                    src={userAvatar}
                                                    textSize={50}
                                                    text={userName}
                                                    style={{ background: 'white', color: 'black' }}
                                                    borderWidth={2}
                                                />
                                                
                                            </Col>
                                            <Col span={22} className={styles.input}>
                                                <div className={styles.inline}>
                                                    <CommentInput onPressEnter={value => handleComment(announcement._id, value)} />
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                )}
                            </React.Fragment>
                        )}
                    />
                    {loadMore}
                </React.Fragment>
            )}
            {permission === null || permissionLoading ? (
                <div className={styles.permissionLoading}>
                    <Spin indicator={<Icon type="loading" style={{ fontSize: '32px' }} />}/>
                </div>
            ) : permission > 1 && (
                <div className={styles.newAnnouncement}>
                    <div className={styles.editor}>
                        <Spin spinning={addAnnounceLoading} tip="Submitting...">
                            <Editor
                                editorState={content}
                                placeholder="Add announcement..."
                                onChange={editorState => setContent(editorState)}
                            />
                        </Spin>
                    </div>
                    <div className={styles.btn}>
                        <Button type="primary" onClick={handleSubmitAnnouncement} disabled={addAnnounceLoading}>Add announcement</Button>
                    </div>
                </div>
            )}
        </div>
    )
};

export default connect(
    ({ user, manage, loading }) => ({
        userAvatar: user.avatar,
        userName: user.name,
        permissionLoading: !!loading.effects['manage/fetchPermission'],
        initLoading: !!loading.effects['manage/fetchAnnouncements'],
        commentLoading: !!loading.effects['manage/comment'],
        loading: !!loading.effects['manage/moreAnnouncements'],
        addAnnounceLoading: !!loading.effects['manage/addAnnouncement'],
        announcements: manage.announcements.list,
        hasMore: manage.announcements.hasMore,
        permission: manage.announcements.permission
    })
)(Announcements);