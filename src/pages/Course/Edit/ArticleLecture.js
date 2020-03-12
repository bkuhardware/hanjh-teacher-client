import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'dva';
import { Drawer, Icon, Button, Tabs, Select, InputNumber, Skeleton, Spin, Collapse } from 'antd';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import Editor from '@/components/Editor/DescriptionEditor';
import TimeAgo from 'react-timeago';
import Scrollbars from 'react-custom-scrollbars';
import { numberWithCommas } from '@/utils/utils';
import styles from './ArticleLecture.less';

const { Panel } = Collapse;

const EstimateTime = ({ estimateHour, estimateMinute, loading }) => {
    const [hour, setHour] = useState(0);
    const [minute, setMinute] = useState(0);
    useEffect(() => {
        if (estimateHour !== null) setHour(estimateHour);
        if (estimateMinute !== null) setMinute(estimateMinute);
    }, [estimateHour, estimateMinute]);
    return (
        <div className={styles.all}>
            <InputNumber
                min={0}
                max={4}
                formatter={value => value > 1 ? `${value} hours` : `${value} hour`}
                parser={value => _.endsWith(value, 'hour') ? value.replace('hour ', '') : value.replace('hours ', '')}
                value={hour}
                onChange={value => setHour(_.toNumber(value))}
                disabled={loading}
                className={styles.inputNumber}
            />
            <InputNumber
                min={0}
                max={59}
                formatter={value => value > 1 ? `${value} minutes` : `${value} minute`}
                parser={value => _.endsWith(value, 'minute') ? value.replace('minute ', '') : value.replace('minutes ', '')}
                onChange={value => setMinute(_.toNumber(value))}
                value={minute}
                disabled={loading}
                className={styles.inputNumber}
            />
            <Button className={styles.btn} type="primary" disabled={loading} loading={loading}>Save</Button>
        </div>
    )
}
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
    const [estimateHour, setEstimateHour] = useState(0);
    const [estimateMinute, setEstimateMinute] = useState(0);
    const [resourceOpen, setResourceOpen] = useState(false);
    const [resourcesData, setResourcesData] = useState(null);
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
        if (description !== null) {
            const blocksFromHTML = convertFromHTML(description);
            const descriptionContent = ContentState.createFromBlockArray(
                blocksFromHTML.contentBlocks,
                blocksFromHTML.entityMap,
            );
            setDescriptionData(EditorState.createWithContent(descriptionContent));
        }
    }, [description]);
    useEffect(() => {
        if (resources !== null) {
            setResourcesData({ ...resources });
        }
    }, [resources]);
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
                            <EstimateTime
                                estimateHour={article && article.estimateHour}
                                estimateMinute={article && article.estimateMinute}
                                loading={!article || loading}
                            />
                        </div>
                    </div>
                    <div className={styles.description}>
                        <div className={styles.title}>Description</div>
                        <div className={styles.main}>
                            <Spin spinning={!description || descriptionLoading}>
                                <div className={styles.editor}>
                                    <Editor
                                        placeholder="Description"
                                        editorState={descriptionData}
                                        onChange={editorState => setDescriptionData(editorState)}
                                    />
                                </div>
                            </Spin>
                        </div>
                        <div className={styles.btn}>
                            <Button type="primary" disabled={!description || descriptionLoading} loading={!description || descriptionLoading}>Save</Button>
                        </div>
                    </div>
                    <div className={styles.resources}>
                        <div className={styles.title}>Resources</div>
                        <div className={styles.main}>
                            {!resources || !resourcesData || resourcesLoading ? (
                                <div className={styles.loading}>
                                    <Spin indicator={<Icon type="loading-3-quarters" style={{ fontSize: '44px' }} spin />} />
                                </div>
                            ) : (
                                <React.Fragment>
                                    <div className={styles.list}>
                                        {_.isEmpty(resourcesData.downloadable) && _.isEmpty(resourcesData.external) ? null : (
                                            <Collapse defaultActiveKey={['downloadable', 'external']} expandIconPosition="right">
                                                <Panel key="downloadable" header="Downloadable materials">

                                                </Panel>
                                                <Panel key="external" header="External resources">

                                                </Panel>
                                            </Collapse>
                                        )}
                                    </div>
                                    {resourceOpen ? (
                                        <div />
                                    ) : (
                                        <div className={styles.btn}>
                                            <Button type="primary" icon="plus" onClick={() => setResourceOpen(true)}>Add resource</Button>
                                        </div>
                                    )}
                                </React.Fragment>
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