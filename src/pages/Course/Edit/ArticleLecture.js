import React, { useEffect, useState, useRef } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'dva';
import { Row, Col, Drawer, Icon, Button, Tabs, Select, InputNumber, Skeleton, Spin, Collapse, Tooltip, Upload, Form, Input, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { Player, ControlBar, ReplayControl, ForwardControl, CurrentTimeDisplay, TimeDivider, PlaybackRateMenuButton, VolumeMenuButton, BigPlayButton } from 'video-react';
import { EditorState, ContentState, convertFromHTML, convertFromRaw, convertToRaw } from 'draft-js';
import Editor from '@/components/Editor/DescriptionEditor';
import MainEditor from '@/components/Editor/MainEditor';
import TimeAgo from 'react-timeago';
import Scrollbars from 'react-custom-scrollbars';
import { numberWithCommas, checkValidLink, bytesToSize, secondsToTime } from '@/utils/utils';
import { exportToHTML } from '@/utils/editor';
import styles from './ArticleLecture.less';

const { Panel } = Collapse;
const { TabPane } = Tabs;
const FormItem = Form.Item;

const EstimateTime = ({ estimateHour, estimateMinute, loading, onSave }) => {
    const [hour, setHour] = useState(0);
    const [minute, setMinute] = useState(0);
    useEffect(() => {
        if (estimateHour !== null) setHour(estimateHour);
        if (estimateMinute !== null) setMinute(estimateMinute);
    }, [estimateHour, estimateMinute]);
    return (
        <React.Fragment>
            <div className={styles.title}>Estimate time</div>
            <div className={styles.main}>
                <InputNumber
                    min={0}
                    max={4}
                    value={hour}
                    onChange={value => setHour(_.toNumber(value))}
                    disabled={loading}
                    className={styles.inputNumber}
                />
                <span className={styles.unit}>{hour > 1 ? 'hours' : 'hour'}</span>
                <InputNumber
                    min={0}
                    max={59}
                    
                    onChange={value => setMinute(_.toNumber(value))}
                    value={minute}
                    disabled={loading}
                    className={styles.inputNumber}
                    step={5}
                />
                <span className={styles.unit}>{minute > 1 ? 'minutes' : 'minute'}</span>
                <Button className={styles.btn} type="primary" disabled={loading} loading={loading} onClick={() => onSave(hour, minute)}>Save</Button>
            </div>
        </React.Fragment>
    )
};

const Content = ({ content, onSave, loading }) => {
    const [saveVisible, setSaveVisible] = useState(false);
    const [lectureContent, setLectureContent] = useState(() => {
        if (!content) return EditorState.createEmpty();
        const contentState = convertFromRaw(content);
        return EditorState.createWithContent(contentState);
    });
    const handleSave = () => {
        const contentState = lectureContent.getCurrentContent();
        const rawData = convertToRaw(contentState);
        onSave(rawData);
    };
    return (
        <React.Fragment>
            <div className={styles.save} style={{ opacity: saveVisible ? '1' : '0' }} onClick={handleSave}>
                {loading ? <Icon type="loading" className={styles.icon} /> : <SaveOutlined className={styles.icon} />}
                <span className={styles.text}>Save</span>
            </div>
            <Spin spinning={loading}>
                <MainEditor
                    placeholder="Enter content..."
                    editorState={lectureContent}
                    onChange={editorState => {
                        const curContent = lectureContent.getCurrentContent();
                        const newContent = editorState.getCurrentContent();
                        if (curContent !== newContent) setSaveVisible(true);
                        setLectureContent(editorState);
                    }}
                />
            </Spin>
        </React.Fragment>
    )
};

const Description = ({ description, loading, onSave }) => {
    const [descriptionData, setDescriptionData] = useState(() => {
        const blocksFromHTML = convertFromHTML(description);
        const descriptionContent = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap,
        );
        return EditorState.createWithContent(descriptionContent);
    });
    const handleSave = () => {
        const html = exportToHTML(descriptionData);
        onSave(html);
    };
    return (
        <React.Fragment>
            <div className={styles.title}>Description</div>
            <div className={styles.main}>
                <Spin spinning={loading}>
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
                <Button type="primary" disabled={loading} loading={loading} onClick={handleSave}>Save</Button>
            </div>
        </React.Fragment>
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
        contentLoading,
        estimateLoading,
        descriptionLoading,
        descriptionInitLoading,
        downloadableLoading,
        externalLoading
    } = props;
    const playerRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [error, setError] = useState({
        status: 0,
        text: ''
    });
    const [errorTimer, setErrorTimer] = useState(null);
    const [resourceOpen, setResourceOpen] = useState(false);
    const [resourcesData, setResourcesData] = useState(null);
    //external states
    const [title, setTitle] = useState({
        value: '',
        validateStatus: 'success',
        help: ''
    });
    const [url, setURL] = useState({
        value: '',
        validateStatus: 'success',
        help: ''
    });
    //downloadable states
    const [file, setFile] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [fileInfo, setFileInfo] = useState({
        name: null,
        mimeType: null,
        extra: null
    });

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
    const handleSaveEstimateTime = (hour, minute) => {
        dispatch({
            type: 'article/updateEstimateTime',
            payload: {
                lectureId,
                hour,
                minute
            }
        });
    };
    const handleSaveDescription = description => {
        dispatch({
            type: 'article/updateDescription',
            payload: {
                lectureId,
                content: description
            }
        });
    };
    const handleSaveContent = content => {
        dispatch({
            type: 'article/updateContent',
            payload: {
                lectureId,
                content
            }
        });
    };
    const handleCloseAddResource = () => {
        resetUpload();
        resetExternal();
        setResourceOpen(false);
    };
    const handleChangeTab = key => {
        if (key !== 'downloadable') resetUpload();
        if (key !== 'external') resetExternal();
    };
    const handleChangeTitle = e => {
        const val = e.target.value;
        if (_.isEmpty(val)) {
            setTitle({
                value: val,
                validateStatus: 'error',
                help: 'Title must not be empty!'
            });
        }
        else {
            setTitle({
                value: val,
                validateStatus: 'success',
                help: ''
            });
        }
    };
    const handleChangeURL = e => {
        const val = e.target.value;
        if (_.isEmpty(val)) {
            setURL({
                value: val,
                validateStatus: 'error',
                help: 'URL must not be empty!'
            });
        }
        else if (!checkValidLink(val)) {
            setURL({
                value: val,
                validateStatus: 'error',
                help: 'URL is invalid!'
            });
        }
        else {
            setURL({
                value: val,
                validateStatus: 'success',
                help: ''
            });
        }
    };
    const resetExternal = () => {
        setTitle({
            value: '',
            validateStatus: 'success',
            help: ''
        });
        setURL({
            value: '',
            validateStatus: 'success',
            help: ''
        });
    };
    const handleError = (message) => {
        setError({
            status: 1,
            text: message
        });
        if (errorTimer) clearTimeout(errorTimer);
        const timer = setTimeout(() => resetError(), 3000);
        setErrorTimer(timer);
    };
    const resetError = () => {
        setError({
            status: 0,
            text: ''
        });
        setErrorTimer(null);
    };
    const resetUpload = () => {
        setFile(null);
        setFileList([]);
        setFileInfo({
            name: null,
            mimeType: null,
            extra: null
        });
        playerRef.current = null;
        resetError();
    };
    const handleBeforeUpload = (file, fileList) => {
        const fileSize = file.size;
        const fileType = file.type;
        if (fileSize > 31457280) handleError('Your file must not greater than 30MB!');
        else if (!fileType) handleError('Your file type is invalid!');
        else if (_.startsWith(fileType, 'video/') && !_.endsWith(fileType, 'mp4')) handleError('Only support .mp4 video! Please replace with .mp4 video.');
        else {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            const fileName = file.name;
            fileReader.onload = () => {
                const result = fileReader.result;
                setFile(result);
                setFileList(fileList);
                // let extra;
                // if (_.startsWith(fileType, 'video/')) {

                // }
                // else if (fileType === 'application/pdf') {

                // }
                // else extra = bytesToSize(fileSize);
                setFileInfo({
                    name: fileName,
                    mimeType: fileType,
                    extra: bytesToSize(fileSize)
                });
            }
        }
        return false;
    };

    const handleRemoveFile = () => resetUpload();

    const handleUploadFile = e => {
        let extra = fileInfo.extra;
        if (fileInfo.mimeType === 'video/mp4') {
            const { player } = playerRef.current.getState();
            extra = secondsToTime(player.duration);
        }
        dispatch({
            type: 'article/addDownloadable',
            payload: {
                lectureId,
                name: fileInfo.name,
                mimeType: fileInfo.mimeType,
                extra: extra,
                file: file,
                callback: () => handleRemoveFile()
            }
        });
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
                        <Content content={article.content} onSave={handleSaveContent} loading={contentLoading} />
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
                    autoHeightMax={window.innerHeight - 96}
                    className={styles.container}
                >
                    <div className={styles.estimateTime}>
                        <EstimateTime
                            estimateHour={article && article.estimateHour}
                            estimateMinute={article && article.estimateMinute}
                            loading={!article || loading || estimateLoading}
                            onSave={handleSaveEstimateTime}
                        />
                        
                    </div>
                    <div className={styles.description}>
                        {description === null || descriptionInitLoading ? (
                            <div className={styles.loading}>
                                <Spin indicator={<Icon type="loading" style={{ fontSize: '32px' }} spin />} />
                            </div>
                        ) : (
                            <Description
                                description={description}
                                loading={descriptionLoading}
                                onSave={handleSaveDescription}
                            />
                        )}
                    </div>
                    <div className={styles.resources}>
                        <div className={styles.title}>Resources</div>
                        <div className={styles.main}>
                            {!resources || !resourcesData || resourcesInitLoading ? (
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
                                                <Icon type="close" onClick={handleCloseAddResource}/>
                                            </div>
                                            <Tabs defaultActiveKey="browse" onChange={handleChangeTab}>
                                                <TabPane key="browse" tab="Browse computer" className={styles.browse}>
                                                    <div className={styles.inline}>
                                                        <div className={styles.warning}>
                                                            Your file must not greater than 30MB.
                                                            <br />
                                                            Some extension doesn't supported in HuYeFen such as .xd, .mov. Only support .mp4 video.
                                                        </div>
                                                        {file && _.startsWith(fileInfo.mimeType, 'image/') && (
                                                            <div className={styles.previewImage}>
                                                                <img src={file} alt="preview" style={{ width: '100%', height: 'auto' }}/>
                                                            </div>
                                                        )}
                                                        {file && _.startsWith(fileInfo.mimeType, 'video/') && (
                                                            <div className={styles.previewVideo}>
                                                                <Player
                                                                    fluid={true}
                                                                    src={file}
                                                                    autoPlay
                                                                    ref={player => playerRef.current = player}
                                                                >
                                                                    <BigPlayButton position="center" />
                                                                    <ControlBar>
                                                                        <ReplayControl seconds={10} order={1.1} />
                                                                        <ForwardControl seconds={30} order={1.2} />
                                                                        <CurrentTimeDisplay order={4.1} />
                                                                        <TimeDivider order={4.2} />
                                                                        <PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} order={7.1} />
                                                                        <VolumeMenuButton disabled />
                                                                    </ControlBar>
                                                                </Player>
                                                            </div>
                                                        )}
                                                        <Form layout="vertical" onSubmit={handleUploadFile} style={{ marginTop: '24px' }}>
                                                            <FormItem style={{ margin: 0 }}>
                                                                <Upload {...uploadProps}>
                                                                    {!file ? (
                                                                        <Button className={styles.upBtn}>
                                                                            <Icon type="upload" /> Upload file
                                                                        </Button>
                                                                    ) : (
                                                                        <Button type="primary" htmlType="submit" disabled={downloadableLoading}>
                                                                            <Icon type={downloadableLoading ? "loading" : "check"} /> Let's upload                    
                                                                        </Button>
                                                                    )}
                                                                </Upload>
                                                            </FormItem>
                                                        </Form>
                                                        <div className={styles.error} style={{ opacity: error.status === 1 ? '1' : '0' }}>
                                                            <Icon type="close" style={{ marginRight: '8px' }} />
                                                            {error.text}
                                                        </div>
                                                    </div>
                                                </TabPane>
                                                <TabPane key="library" tab="Add from library">
                                                    <div>Sorry this function is not available.</div>
                                                </TabPane>
                                                <TabPane key="external" tab="External resouces" className={styles.externalTab}>
                                                    <Form className={styles.externalForm}>
                                                        <FormItem label="Title" required validateStatus={title.validateStatus} help={title.help}>
                                                            <Input
                                                                value={title.value}
                                                                placeholder="Title"
                                                                onChange={handleChangeTitle}
                                                                size="large"
                                                            />
                                                        </FormItem>
                                                        <FormItem label="URL" required validateStatus={url.validateStatus} help={url.help}>
                                                            <Input
                                                                value={url.value}
                                                                placeholder="Resource URL http://"
                                                                onChange={handleChangeURL}
                                                                size="large"
                                                
                                                            />
                                                        </FormItem>
                                                    </Form>
                                                    <FormItem className={styles.btn}>
                                                        <Button type="primary" disabled={_.isEmpty(title.value) || !checkValidLink(url.value) || _.isEmpty(url.value)}>OK</Button>
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
        descriptionInitLoading: !!loading.effects['article/fetchDescription'],
        descriptionLoading: !!loading.effects['article/updateDescription'],
        contentLoading: !!loading.effects['article/updateContent'],
        estimateLoading: !!loading.effects['article/updateEstimateTime'],
        downloadableLoading: !!loading.effects['article/addDownloadable'],
        externalLoading: !!loading.effects['article/addExternal']
    })
)(ArticleLecture)