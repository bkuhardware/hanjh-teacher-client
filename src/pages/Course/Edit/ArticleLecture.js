import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'dva';
import { Row, Col, Drawer, Icon, Button, Tabs, Select, InputNumber, Skeleton, Spin, Collapse, Tooltip, Upload, Form, Input } from 'antd';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import Editor from '@/components/Editor/DescriptionEditor';
import TimeAgo from 'react-timeago';
import Scrollbars from 'react-custom-scrollbars';
import { numberWithCommas, checkValidLink } from '@/utils/utils';
import styles from './ArticleLecture.less';

const { Panel } = Collapse;
const { TabPane } = Tabs;
const FormItem = Form.Item;

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
    const [title, setTitle] = useState('');
    const [url, setURL] = useState('');
    const [file, setFile] = useState(null);
    const [fileList, setFileList] = useState([]);
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
    const handleChangeTab = key => {

    };
    const handleBeforeUpload = (file, fileList) => {
        setFile(file);
        setFileList(fileList);
        return false;
    };

    const handleRemoveFile = () => {
        setFile(null);
        setFileList([]);
    };

    const handleUploadFile = e => {
       
        e.preventDefault();
    };

    const uploadProps = {
        name: 'avatarfile',
        beforeUpload: handleBeforeUpload,
        onRemove: handleRemoveFile,
        fileList: fileList,
        openFileDialogOnClick: !file,
        showUploadList: {
            showRemoveIcon: true
        }
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
                    className={styles.container}
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
                                                {!_.isEmpty(resourcesData.downloadable) && (
                                                    <Panel key="downloadable" header="Downloadable materials">
                                                        {_.map(resourcesData.downloadable, resource => (
                                                            <Row gutter={16} key={resource._id} className={styles.resource}>
                                                                <Col span={20} className={styles.info}>
                                                                    <Icon type="download" className={styles.icon} />
                                                                    <span className={styles.name}>{`${resource.name} (${resource.extra})`}</span>
                                                                </Col>
                                                                <Col span={4} className={styles.action}>
                                                                    <span className={styles.icon}>
                                                                        <Tooltip placement="top" title="Delete" overlayStyle={{ zIndex: 9999999999 }}>
                                                                            <Icon type="delete" theme="filled" />
                                                                        </Tooltip>
                                                                    </span>
                                                                </Col>
                                                            </Row>
                                                        ))}
                                                    </Panel>
                                                )}
                                                {!_.isEmpty(resourcesData.external) && (
                                                    <Panel key="external" header="External resources">
                                                        {_.map(resourcesData.external, resource => (
                                                            <Row gutter={16} key={resource._id} className={styles.resource}>
                                                                <Col span={20} className={styles.info}>
                                                                    <Icon type="link" className={styles.icon} />
                                                                    <span className={styles.name}>{resource.name}</span>
                                                                </Col>
                                                                <Col span={4} className={styles.action}>
                                                                    <span className={styles.icon}>
                                                                        <Tooltip placement="top" title="Delete" overlayStyle={{ zIndex: 9999999999 }}>
                                                                            <Icon type="delete" theme="filled" />
                                                                        </Tooltip>
                                                                    </span>
                                                                </Col>
                                                            </Row>
                                                        ))}
                                                    </Panel>
                                                )}
                                            </Collapse>
                                        )}
                                    </div>
                                    {resourceOpen ? (
                                        <div className={styles.addResource}>
                                            <div className={styles.close}>
                                                <Icon type="close" onClick={() => setResourceOpen(false)}/>
                                            </div>
                                            <Tabs defaultActiveKey="browse" onChange={handleChangeTab}>
                                                <TabPane key="browse" tab="Browse computer" className={styles.browse}>
                                                    <div className={styles.inline}>
                                                        <Form layout="vertical" onSubmit={handleUploadFile}>
                                                            <FormItem style={{ margin: 0 }}>
                                                                <Upload {...uploadProps}>
                                                                    {!file ? (
                                                                        <Button className={styles.upBtn}>
                                                                            <Icon type="upload" /> Upload file
                                                                        </Button>
                                                                    ) : (
                                                                        <Button type="primary" htmlType="submit">
                                                                            <Icon type={false ? "loading" : "check"} /> Let's upload                    
                                                                        </Button>
                                                                    )}
                                                                </Upload>
                                                            </FormItem>
                                                        </Form>
                                                    </div>
                                                </TabPane>
                                                <TabPane key="library" tab="Add from library">
                                                    <div>Sorry this function is not available.</div>
                                                </TabPane>
                                                <TabPane key="external" tab="External resouces" className={styles.externalTab}>
                                                    <Form className={styles.externalForm}>
                                                        <FormItem label="Title" required>
                                                            <Input
                                                                value={title}
                                                                placeholder="Title"
                                                                onChange={e => setTitle(e.target.value)}
                                                                size="large"
                                                            />
                                                        </FormItem>
                                                        <FormItem label="URL" required>
                                                            <Input
                                                                value={url}
                                                                placeholder="Resource URL http://"
                                                                onChange={e => setURL(e.target.value)}
                                                                size="large"
                                                
                                                            />
                                                        </FormItem>
                                                    </Form>
                                                    <FormItem className={styles.btn}>
                                                        <Button type="primary" disabled={_.isEmpty(title) || !checkValidLink(url) || _.isEmpty(url)}>OK</Button>
                                                    </FormItem>
                                                </TabPane>
                                            </Tabs>
                                        </div>
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