import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'dva';
import { Drawer, Icon, Button, Tabs, Select, Skeleton, Spin } from 'antd';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import Editor from '@/components/Editor/DescriptionEditor';
import TimeAgo from 'react-timeago';
import Scrollbars from 'react-custom-scrollbars';
import { usePrevious } from '@/utils/hooks';
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
    const [descriptionData, setDescriptionData] = useState(EditorState.createEmpty());
    const previousDescription = usePrevious(description);
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
    useEffect(() => {
        if (description && !previousDescription && !descriptionData.getCurrentContent().hasText()) {
            const blocksFromHTML = convertFromHTML(description);
            const descriptionContent = ContentState.createFromBlockArray(
                blocksFromHTML.contentBlocks,
                blocksFromHTML.entityMap,
            );
            setDescriptionData(EditorState.createWithContent(descriptionContent));
        }
    }, [description]);
    const handleOpenSettings = () => {
        if (!description) 
            dispatch({
                type: 'article/fetchDescription',
                payload: {
                    courseId,
                    lectureId
                }
            });
        if (!resources)
            dispatch({
                type: 'article/fetchResources',
                payload: {
                    courseId,
                    lectureId
                }
            });
        setVisible(true);
    };
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
            <div className={styles.settings} onClick={handleOpenSettings}>
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
                width={860}
                className={styles.settingsDrawer}
                bodyStyle={{
                    padding: '16px'
                }}
            >
                <Scrollbars
                    autoHeight
                    autoHeightMax={window.innerHeight - 64}
                >
                    <div className={styles.estimateTime}>
                        <div className={styles.title}>Estimate time</div>
                        <div className={styles.main}>

                        </div>
                    </div>
                    <div className={styles.description}>
                        <div className={styles.title}>Description</div>
                        <div className={styles.main}>
                            {!description || descriptionLoading ? (
                                <div className={styles.loading}>
                                    <Spin indicator={<Icon type="loading-3-quarters" spin style={{ fontSize: '36px', color: '#fada5e' }} />} />
                                </div>
                            ) : (
                                <div className={styles.editor}>
                                    <Editor
                                        placeholder="Description"
                                        editorState={descriptionData}
                                        onChange={editorState => setDescriptionData(editorState)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
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