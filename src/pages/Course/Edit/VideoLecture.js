import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Row, Col, Icon, Collapse, Form, Upload, Button, Spin, Skeleton, Tooltip, Input, Tabs, message } from 'antd';
import { Player, ControlBar, ReplayControl, ForwardControl, CurrentTimeDisplay, TimeDivider, PlaybackRateMenuButton, VolumeMenuButton, BigPlayButton } from 'video-react';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import Editor from '@/components/Editor/DescriptionEditor';
import { EditorState, convertFromHTML, ContentState } from 'draft-js';
import TimeAgo from 'react-timeago';
import { exportToHTML } from '@/utils/editor';
import { bytesToSize, checkValidLink, secondsToTime } from '@/utils/utils';
import styles from './VideoLecture.less';

const { Panel } = Collapse;
const { TabPane } = Tabs;
const FormItem = Form.Item;

const Video = ({ videoUrl, loading, onUpload }) => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const resetUpload = () => {
        setFile(null);
        setFileName(null);
    };
    const handleBeforeUpload = (file, fileList) => {
        const fileSize = file.size;
        const fileType = file.type;
        if (fileSize > 4294967296) message.error('Your video is too big.');
        else if (fileType !== 'video/mp4') message.error('Only support .mp4 video! Please replace with .mp4 video.');
        else {
            setFile(file);
            setFileName(file.name);
        }
        return false;
    };

    const handleRemoveFile = () => resetUpload();

    const handleUploadFile = () => {
        setUploading(true);
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        setProgress(5);
        fileReader.onloadstart = () => setProgress(8);
        fileReader.onprogress = () => setProgress(12);
        fileReader.onload = () => {
            const result = fileReader.result;
            setProgress(20);
            onUpload(fileName, result, val => setProgress(val), () => {
                resetUpload();
                setProgress(0);
                setUploading(false);
            });
        }
    };
    
    const uploadProps = {
        accept: 'video/mp4',
        name: 'videoFile',
        beforeUpload: handleBeforeUpload,
        openFileDialogOnClick: !file,
        showUploadList: false
    };
    const addOnAfter = uploading && file ? (
        <span className={styles.progress}>
            <Icon type="loading" style={{ color: '#fada5e' }} />
        </span>
    ) : file ? (
        <span>
            <span className={styles.suffix} onClick={handleUploadFile} style={{ marginRight: '6px' }}>
                <Icon type="cloud-upload" />
            </span>
            <span className={styles.suffix} onClick={handleRemoveFile}>
                <Icon type="delete" />
            </span>
        </span>
    ) : (
        <Upload {...uploadProps}>
            <span className={styles.suffix}>
                <Icon type="upload" />
            </span>
        </Upload>
    );
    if (!videoUrl || !checkValidLink(videoUrl))
        return (
            <div className={styles.uploadVideo}>
                <div className={styles.warning}>
                    HuYeFen only support .mp4 video type. Please convert to this type before uploading. File size must less than 4 GB.
                </div>
                <div className={styles.uploader}>
                    <Input
                        type="text"
                        value={fileName || ''}
                        addonBefore={(
                            <span className={styles.addOnBefore}>
                                <Icon type="play-circle" theme="filled" style={{ position: 'relative', top: '1px', marginRight: '6px', color: '#fada5e' }} />
                                <span>New video:</span>
                            </span>
                        )}
                        placeholder="No file selected."
                        size="large"
                        addonAfter={(
                            <span className={styles.addOnAfter}>
                                {addOnAfter}
                            </span>
                        )}
                    />
                    <div
                        className={styles.progressBar}
                        style={{
                            display: uploading ? 'block' : 'none',
                            width: `calc(${progress / 100} * (100% - 184px))`
                        }}
                    >
                        <div className={styles.skeletonBox}>
                            <span>
                                {`${progress}%`}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    return (
        <div />
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
};

const VideoLecture = ({ dispatch, match, ...props }) => {
    const { courseId, lectureId } = match.params;
    const {
        video,
        description,
        resources,
        loading,
        resourcesInitLoading,
        descriptionInitLoading,
        descriptionLoading,
        downloadableLoading,
        externalLoading,
        deleteLoading
    } = props;
    const playerRef = useRef(null);
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
            type: 'video/fetch',
            payload: {
                courseId,
                lectureId
            }
        });
        dispatch({
            type: 'video/fetchDescription',
            payload: {
                courseId,
                lectureId
            }
        });
        dispatch({
            type: 'video/fetchResources',
            payload: {
                courseId,
                lectureId
            }
        });
        return () => dispatch({ type: 'video/reset '});
    }, [courseId, lectureId]);
    const handleUploadVideo = (name, file, saveProgress, callback) => {
        dispatch({
            type: 'video/upload',
            payload: {
                lectureId,
                name,
                file,
                saveProgress,
                callback
            }
        });
    };
    const handleSaveDescription = () => {

    };
    const handleCloseAddResource = () => {
        resetUpload();
        resetExternal();
        setResourceOpen(false);
    };
    const handleDeleteResource = (resourceId, type) => {
        dispatch({
            type: 'video/deleteResource',
            payload: {
                resourceId,
                type,
            }
        });
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
    const handleAddExternal = e => {
        dispatch({
            type: 'video/addExternal',
            payload: {
                lectureId,
                name: title.value,
                url: url.value,
                callback: () => resetExternal()
            }
        });
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
            type: 'video/addDownloadable',
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
        <div className={styles.videoLecture}>
            <div className={styles.content}>
                {!video || loading ? (
                    <div className={styles.loading}>
                        <Skeleton className={styles.titleSkeleton} active title={null} paragraph={{ rows: 1, width: '96%' }} />
                        <Skeleton active title={null} paragraph={{ rows: 2, width: ['62%', '42%'] }} />
                        <div className={styles.spin}>
                            <Spin indicator={<Icon type="loading" style={{ fontSize: 64, color: '#fada5e' }} spin />} />
                        </div>
                    </div>
                ) : (
                    <React.Fragment>
                        <div className={styles.title}>{video.title}</div>
                        <div className={styles.chapter}>
                            {`Chapter ${video.chapter.title}`}
                        </div>
                        <div className={styles.extra}>
                            <span className={styles.text}>{video.updatedAt === video.createdAt ? 'Created on' : 'Last updated'}</span>
                            <span className={styles.time}>
                                <TimeAgo date={video.updatedAt} />
                            </span>
                        </div>
                        <div className={styles.main}>
                            <Video
                                videoUrl={video.videoUrl}
                                loading={false}
                                onUpload={handleUploadVideo}
                            />
                        </div>
                    </React.Fragment>
                )}
            </div>
            <div className={styles.description}>
                <div className={styles.title}>Description</div>
                <div className={styles.main}>
                    {description === null || descriptionInitLoading ? (
                        <div className={styles.loading}>
                            <Spin indicator={<Icon type="loading" style={{ fontSize: '32px', color: 'inherit' }} spin />} />
                            <div className={styles.tip}>Fetching...</div>
                        </div>
                    ) : (
                        <Description
                            description={description}
                            loading={descriptionLoading}
                            onSave={handleSaveDescription}
                        />
                    )}
                </div>
            </div>
            <div className={styles.resources}>
                <div className={styles.title}>Resources</div>
                <div className={styles.main}>
                    {!resources || !resourcesData || resourcesInitLoading ? (
                        <div className={styles.loading}>
                            <Spin indicator={<Icon type="loading-3-quarters" style={{ fontSize: '44px', color: 'inherit' }} spin />} />
                            <div className={styles.tip}>Fetching...</div>
                        </div>
                    ) : (
                        <React.Fragment>
                            <div className={styles.list}>
                                {_.isEmpty(resourcesData.downloadable) && _.isEmpty(resourcesData.external) ? null : (
                                    <Spin spinning={deleteLoading}>
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
                                                                        <Icon type="delete" theme="filled" onClick={() => handleDeleteResource(resource._id, 'downloadable')}/>
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
                                                                        <Icon type="delete" theme="filled" onClick={() => handleDeleteResource(resource._id, 'external')}/>
                                                                    </Tooltip>
                                                                </span>
                                                            </Col>
                                                        </Row>
                                                    ))}
                                                </Panel>
                                            )}
                                        </Collapse>
                                    </Spin>
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
                                                {file && fileInfo.mimeType === 'application/pdf' && (
                                                    <div className={styles.previewPdf}>
                                                        <Document
                                                            file={file}
                                                            onLoadSuccess={({ numPages }) => setFileInfo({
                                                                ...fileInfo,
                                                                extra: `${numPages} ${numPages > 1 ? 'pages' : 'page'}`
                                                            })}
                                                            className={styles.document}
                                                        >
                                                            <Page pageNumber={1} width={250}/>
                                                        </Document>
                                                    </div>
                                                )}
                                                {file && fileInfo.mimeType === 'video/mp4' && (
                                                    <div className={styles.previewVideo}>
                                                        <Player
                                                            fluid={true}
                                                            src={file}
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
                                            <Spin spinning={externalLoading}>
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
                                            </Spin>
                                            <FormItem className={styles.btn}>
                                                <Button type="primary" loading={externalLoading} disabled={_.isEmpty(title.value) || !checkValidLink(url.value) || _.isEmpty(url.value)} onClick={handleAddExternal}>OK</Button>
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
        </div>
    )
};

export default connect(
    ({ video, loading }) => ({
        video: video.info,
        description: video.description,
        resources: video.resources,
        loading: !!loading.effects['video/fetch'],
        resourcesInitLoading: !!loading.effects['video/fetchResources'],
        resourcesLoading: !!loading.effects['video/moreResources'],
        descriptionInitLoading: !!loading.effects['video/fetchDescription'],
        descriptionLoading: !!loading.effects['video/updateDescription'],
        downloadableLoading: !!loading.effects['video/addDownloadable'],
        externalLoading: !!loading.effects['video/addExternal'],
        deleteLoading: !!loading.effects['video/deleteResource']
    })
)(VideoLecture);