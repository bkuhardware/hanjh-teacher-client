import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import moment from 'moment';
import classNames from 'classnames';
import { Row, Col, Icon, Collapse, Form, Upload, Button, Spin, Skeleton, Tooltip, Input, Tabs, Modal, message, Popover, Descriptions, Divider, List, Select } from 'antd';
import { VideoCameraFilled, InfoCircleFilled, YoutubeFilled, SettingFilled, DeleteFilled, EditFilled, CreditCardFilled, CloseCircleFilled, CloseOutlined } from '@ant-design/icons';
import Player from '@/components/Videos/default';
import UserAvatar from '@/components/Avatar';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import Fade from 'react-reveal/Fade';
import Caption from '@/elements/icon/caption';
import Editor from '@/components/Editor/DescriptionEditor';
import { EditorState, convertFromHTML, ContentState } from 'draft-js';
import TimeAgo from 'react-timeago';
import { captionLanguages } from '@/config/constants';
import { exportToHTML } from '@/utils/editor';
import { bytesToSize, checkValidLink, secondsToTime } from '@/utils/utils';
import styles from './VideoLecture.less';

const { Panel } = Collapse;
const { TabPane } = Tabs;
const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const Video = ({ videoUrl, captionsLoading, captions, onUpload, onDelete, onDeleteCaption, onUploadVtt }) => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [editing, setEditing] = useState(false);
    const [captioning, setCaptioning] = useState(false);
    const [curCaption, setCurCaption] = useState(null);
    const [adding, setAdding] = useState(false);
    const [newLang, setNewLang] = useState(undefined);
    const [vttFile, setVttFile] = useState(null);
    const [vttFileName, setVttFileName] = useState(null);
    const [vttUploading, setVttUploading] = useState(false);
    const resetUpload = () => {
        setFile(null);
        setFileName(null);
    };
    const handleChange = () => setEditing(true);
    const handleDelete = () => {
        Modal.confirm({
            title: 'Are you sure to delete this video?',
            content: 'This cause the lecture unpublic to student',
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => onDelete()
        })
    };
    const handleCancelChange = () => {
        resetUpload();
        setEditing(false);
    };
    const handleAddCaption = () => setAdding(true);
    const handleCancelAddCaption = () => {
        handleRemoveVttFile();
        setNewLang(undefined);
        setAdding(false);
    };
    const handleDeleteCaption = captionId => {
        if (curCaption !== captionId) {
            Modal.confirm({
                content: 'Are you sure to delete this caption?',
                okText: 'Yes',
                cancelText: 'No',
                onOk: () => {
                    onDeleteCaption(captionId);
                }
            });
        }
        else {
            message.error('You can\'t remove this caption because it\'s running.');
            message.error('Please set another caption or turn off caption before delete it!', 2.5);
        }
    };
    const handleCancelCaptions = () => {
        //remove caption file.
        setCaptioning(false);
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
                handleCancelChange();
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
    const handleBeforeUploadVtt = file => {
        setVttFile(file);
        setVttFileName(file.name);
        return false;
    };
    const handleRemoveVttFile = () => {
        setVttFile(null);
        setVttFileName(null);
    };
    const handleUploadVttFile = () => {
        if (newLang) {
            setVttUploading(true);
            const fileReader = new FileReader();
            fileReader.readAsDataURL(vttFile);
            fileReader.onload = () => {
                const result = fileReader.result;
                console.log(newLang);
                onUploadVtt(newLang, vttFileName, result, () => {
                    handleCancelAddCaption();
                    setVttUploading(false);
                })
            }
        }
        else {
            message.error('Please select language.');
        }
    };
    const uploadVttProps = {
        accept: '.vtt',
        name: 'vttFile',
        beforeUpload: handleBeforeUploadVtt,
        openFileDialogOnClick: !vttFile,
        showUploadList: false
    };
    const getLangsList = () => {
        const curLangs = _.map(captions, caption => caption.srcLang);
        return _.filter(captionLanguages, lang => _.indexOf(curLangs, lang.key) === -1);
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
    const addOnAfterVtt = vttUploading && vttFile ? (
        <span className={styles.progress}>
            <Icon type="loading" style={{ color: '#fada5e' }} />
        </span>
    ) : vttFile ? (
        <span>
            <span className={styles.suffix} onClick={handleUploadVttFile} style={{ marginRight: '6px' }}>
                <Icon type="cloud-upload" />
            </span>
            <span className={styles.suffix} onClick={handleRemoveVttFile}>
                <Icon type="delete" />
            </span>
        </span>
    ) : (
        <Upload {...uploadVttProps}>
            <span className={styles.suffix}>
                <Icon type="upload" />
            </span>
        </Upload>
    );
    return(
        <div className={styles.uploadVideoContainer}>
            {(!videoUrl || editing) && (
                <Fade duration={700}>
                    <>
                        {!videoUrl && (
                            <div className={styles.empty}>
                                <span className={styles.icon}>
                                    <CloseCircleFilled />
                                </span>
                                <span className={styles.text}>
                                    No video has been uploaded so your lecture is unpublic.
                                </span>
                            </div>
                        )}
                        <div className={styles.uploadVideo} style={{ marginBottom: editing ? '32px' : '0px' }}>
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
                            {editing && (
                                <div className={styles.close} onClick={handleCancelChange}>
                                    <CloseOutlined />
                                </div>
                            )}
                        </div>
                    </>
                </Fade>
            )}
            {captioning && (
                <Fade duration={700}>
                    <div className={styles.captions}>
                        <div className={styles.title}>Captions</div>
                        <div className={styles.captionsCont}>
                            <List
                                className={styles.list}
                                loading={captionsLoading}
                                locale={{
                                    emptyText: 'No caption.',
                                }}
                                itemLayout="horizontal"
                                dataSource={captions}
                                renderItem={caption => (
                                    <List.Item
                                        key={caption._id}
                                        actions={[
                                            <span key="test" className={styles.action}>Test</span>,
                                            <span key="download" className={styles.action}>Download</span>,
                                            <span key="delete" className={styles.action} onClick={() => handleDeleteCaption(caption._id)}>Delete</span>
                                        ]}
                                    >
                                        <div>
                                            <span className={styles.icon}>
                                                <Caption />
                                            </span>
                                            <span className={styles.label}>
                                                {caption.label}
                                            </span>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </div>
                        {adding ? (
                            <div className={styles.adding}>
                                <Row>
                                    <Col className={styles.uploader} span={20}>
                                        <Input.Group compact >
                                            <Select
                                                placeholder="Language"
                                                value={newLang && newLang.key}
                                                style={{ width: '18%' }}
                                                onChange={(val, opt) => setNewLang({ key: val, label: opt.props.label })}
                                            >
                                                {_.map(getLangsList(), lang => (
                                                    <Option key={lang.key} value={lang.key} label={lang.label}>
                                                        {lang.label}
                                                    </Option>
                                                ))}
                                            </Select>
                                            <Input
                                                type="text"
                                                value={vttFileName || ''}
                                                style={{ width: '82%' }}
                                                placeholder="No file selected."
                                                addonAfter={(
                                                    <span className={styles.addOnAfter}>
                                                        {addOnAfterVtt}
                                                    </span>
                                                )}
                                            />
                                        </Input.Group>
                                    </Col>
                                    <Col className={styles.cancel} span={4}>
                                        <Button type="primary" size="small" icon="close" onClick={handleCancelAddCaption} shape="circle" />
                                    </Col>
                                </Row>
                            </div>
                        ) : (
                            <div className={styles.add}>
                                <Button type="primary" size="small" icon="plus" onClick={handleAddCaption}>
                                    Add caption
                                </Button>
                            </div>
                        )}
                        <div className={styles.close} onClick={handleCancelCaptions}>
                            <CloseOutlined />
                        </div>
                    </div>
                </Fade>
            )}
            {videoUrl && (
                <div className={styles.videoPlayer}>
                    <div className={styles.btns}>
                        {!editing && !captioning && (
                            <>
                                <span className={styles.btn}>
                                    <Tooltip placement="top" title="Add caption">
                                        <Button type="primary" size="small" shape="circle" onClick={() => setCaptioning(true)}>
                                            <CreditCardFilled />
                                        </Button>
                                    </Tooltip>
                                </span>
                                <span className={styles.btn}>
                                    <Tooltip placement="top" title="Change video">
                                        <Button type="primary" size="small" onClick={handleChange} shape="circle">
                                            <EditFilled />
                                        </Button>
                                    </Tooltip>
                                </span>
                                <span className={styles.btn}>
                                    <Tooltip placement="top" title="Delete video">
                                        <Button type="primary" size="small" onClick={handleDelete} shape="circle">
                                            <DeleteFilled />
                                        </Button>
                                    </Tooltip>
                                </span>
                            </>
                        )}
                    </div>
                    <div className={styles.player}>
                        <Player
                            videoUrl={videoUrl}
                            baseWidth={"100%"}
                            baseHeight={550}
                            captions={captions || []}
                            onSelectCaption={setCurCaption}
                        />
                    </div>
                </div>
            )}
        </div>
    );
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
        deleteLoading,
        captionsLoading
    } = props;
    const playerRef = useRef(null);
    const [error, setError] = useState({
        status: 0,
        text: ''
    });
    const [errorTimer, setErrorTimer] = useState(null);
    const [resourceOpen, setResourceOpen] = useState(false);
    const [resourcesData, setResourcesData] = useState(null);
    const [tabKey, setTabKey] = useState("editVideo");
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
        return () => dispatch({ type: 'video/reset '});
    }, [courseId, lectureId]);
    useEffect(() => {
        if (resources !== null) {
            setResourcesData({ ...resources });
        }
    }, [resources]);
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
    const handleDeleteVideo = () => {
        return dispatch({
            type: 'video/delete',
            payload: lectureId
        });
    };
    const handleUploadCaption = (lang, name, file, callback) => {
        dispatch({
            type: 'video/addCaption',
            payload: {
                lectureId,
                lang,
                name, 
                file,
                callback
            }
        });
    };
    const handleDeleteCaption = captionId => {
        dispatch({
            type: 'video/deleteCaption',
            payload: {
                captionId,
                lectureId,
                callback: () => message.success('Deleted caption successfully!')
            }
        });
    };
    const handleSaveDescription = description => {
        dispatch({
            type: 'video/updateDescription',
            payload: {
                lectureId,
                content: description
            }
        });
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
            if (playerRef.current) {
                extra = secondsToTime(playerRef.current.duration);
            }
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

    const handleChangeBigTab = tabKey => {
        if (tabKey === "settings") {
            if (description === null) 
                dispatch({
                    type: 'video/fetchDescription',
                    payload: {
                        courseId,
                        lectureId
                    }
                });
            if (resources === null)
                dispatch({
                    type: 'video/fetchResources',
                    payload: {
                        courseId,
                        lectureId
                    }
                });
        }
        setTabKey(tabKey);
    };

    const getMetadata = video => {
        return (
            <Descriptions
                title={null}
                column={1}
                size="middle"
            >
                <Descriptions.Item label="Title">
                    {video.title}
                </Descriptions.Item>
                <Descriptions.Item label="Chapter">
                    {video.chapter.title}
                </Descriptions.Item>
                <Descriptions.Item label="Type">
                    Article
                </Descriptions.Item>
                <Descriptions.Item label="Creator">
                    <span className={styles.userName}>
                        {video.owner.name}
                    </span>
                    <span className={styles.avatar}>
                        <UserAvatar
                            alt="user-avatar"
                            src={video.owner.avatar}
                            size={28}
                            textSize={28}
                            text={video.owner.name}
                            borderWidth={0}
                            style={{ color: 'black', background: 'white', fontSize: '1em' }}
                        />
                    </span>
                </Descriptions.Item>
                <Descriptions.Item label="Created at">
                    {moment(video.createdAt).format("DD/MM/YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Last updated">
                    <TimeAgo date={video.updatedAt} />
                </Descriptions.Item>
            </Descriptions>
        )
    };

    return (
        <div className={styles.videoLecture}>
            <div className={styles.header}>
                <Row className={styles.infor}>
                    <Col span={1} className={styles.iconCol}>
                        <VideoCameraFilled className={styles.icon} />
                    </Col>
                    <Col span={18} className={styles.textInfo}>
                        {!video || loading ? (
                            <div className={styles.loading}>
                                <Skeleton active title={null} paragraph={{ rows: 2, width: ['62%', '42%'] }} />
                            </div>
                        ) : (
                            <div>
                                <div className={styles.title}>
                                    {video.title}
                                </div>
                                <div className={styles.chapter}>
                                    {`Chapter ${video.chapter.title}`}
                                </div>
                            </div>
                        )}
                    </Col>
                    <Col span={5} className={styles.options}>
                        {video && !loading && (
                            <span className={styles.metadata}>
                                <Popover
                                    trigger="click"
                                    popupClassName={styles.metadataPopover}
                                    placement="bottomRight"
                                    content={getMetadata(video)}
                                    arrowPointAtCenter
                                    popupAlign={{ offset: [21, 6] }}
                                >
                                    <Tooltip placement="top" title="View video metadata" mouseEnterDelay={1}>
                                        <InfoCircleFilled />
                                    </Tooltip>
                                </Popover>
                            </span>
                        )}
                    </Col>
                </Row>
                <Row className={styles.tabs}>
                    <Col
                        key="editVideo"
                        span={12}
                        onClick={() => handleChangeBigTab("editVideo")}
                        className={tabKey === "editVideo" ? classNames(styles.tabPane, styles.selectedTabPane, styles.editVideo) : classNames(styles.tabPane, styles.editVideo)}
                    >
                        <span className={styles.icon}>
                            <YoutubeFilled />
                        </span>
                        <span className={styles.text}>
                            Edit video
                        </span>
                    </Col>
                    <Col
                        key="settings"
                        span={12}
                        onClick={() => handleChangeBigTab("settings")}
                        className={tabKey === "settings" ? classNames(styles.tabPane, styles.selectedTabPane, styles.settings) : classNames(styles.tabPane, styles.settings)}
                    > 
                        <span className={styles.icon}>
                            <SettingFilled />
                        </span>
                        <span className={styles.text}>
                            Settings
                        </span>
                    </Col>
                </Row>
            </div>
            <div className={styles.clear} />
            <div className={styles.content}>
                {tabKey === "editVideo" ? (
                    <div className={styles.editVideo}>
                        {!video || loading ? (
                            <div className={styles.loading}>
                                <Spin size="large" />
                                <div className={styles.text}>
                                    Fetching video...
                                </div>
                            </div>
                        ) : (
                            <Fade duration={500}>
                                <Video
                                    videoUrl={video.videoUrl}
                                    captionsLoading={captionsLoading}
                                    captions={video.captions}
                                    onUpload={handleUploadVideo}
                                    onDelete={handleDeleteVideo}
                                    onDeleteCaption={handleDeleteCaption}
                                    onUploadVtt={handleUploadCaption}
                                />
                            </Fade>
                        )}
                    </div>
                ) : (
                    <div className={styles.settings}>
                        <div className={styles.description}>
                            <div className={styles.title}>
                                Description
                            </div>
                            <div className={styles.main}>
                                {description === null || descriptionInitLoading ? (
                                    <div className={styles.loading}>
                                        <Spin spinning size="large" />
                                        <div className={styles.text}>
                                            Description...
                                        </div>
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
                        <Divider dashed className={styles.divider} />
                        <div className={styles.resources}>
                            <div className={styles.title}>Resources</div>
                            <div className={styles.main}>
                                {!resources || !resourcesData || resourcesInitLoading ? (
                                    <div className={styles.loading}>
                                        <Spin spinning size="large" />
                                        <div className={styles.text}>
                                            Fetching resource...
                                        </div>
                                    </div>
                                ) : (
                                    <React.Fragment>
                                        <div className={styles.list}>
                                            {_.isEmpty(resourcesData.downloadable) && _.isEmpty(resourcesData.external) ? null : (
                                                <Spin spinning={deleteLoading} tip="Removing...">
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
                                                                    <video
                                                                        src={file}
                                                                        ref={playerRef}
                                                                        autoPlay
                                                                        loop
                                                                        controls={false}
                                                                        controlsList="nodownload"
                                                                        muted
                                                                    />
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
                )}
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
        deleteLoading: !!loading.effects['video/deleteResource'],
        captionsLoading: !!loading.effects['video/addCaption'] || !!loading.effects['video/deleteCaption']
    })
)(VideoLecture);