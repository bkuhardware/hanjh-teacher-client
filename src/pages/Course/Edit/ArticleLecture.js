import React, { useEffect, useState, useRef } from 'react';
import _ from 'lodash';
import moment from 'moment';
import classNames from 'classnames';
import { connect } from 'dva';
import { Alert, Row, Col, Divider, Icon, Button, Tabs, Select, InputNumber, Skeleton, Spin, Collapse, Tooltip, Upload, Form, Input, message, Popover, Descriptions } from 'antd';
import { SaveOutlined, FileTextFilled, InfoCircleFilled, ClockCircleFilled, EditFilled, SettingFilled, LoadingOutlined } from '@ant-design/icons';
import UserAvatar from '@/components/Avatar';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import { EditorState, ContentState, convertFromHTML, convertFromRaw, convertToRaw } from 'draft-js';
import Editor from '@/components/Editor/DescriptionEditor';
import MainEditor from '@/components/Editor/MainEditor';
import TimeAgo from 'react-timeago';
import Fade from 'react-reveal/Fade';
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
        <Spin spinning={loading} tip="Saving..." size="small">
            <div className={styles.title}>Estimate time</div>
            <div className={styles.alert}>
                <Alert
                    type="warning"
                    message="Your estimate time must less than 4 hours. Otherwise, please divide your content into small pieces."
                />
            </div>
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
                <Button className={styles.btn} size="small" type="primary" disabled={loading} onClick={() => onSave(hour, minute)}>Save</Button>
            </div>
        </Spin>
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
            <div className={styles.editor}>
                <Spin spinning={loading} tip="Saving...">
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
        externalLoading,
        deleteLoading
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
    const [lectureContent, setLectureContent] = useState(null);
    const [saveStatus, setSaveStatus] = useState(0);
    const [estimateVisible, setEstimateVisible] = useState(false);
    const [tabKey, setTabKey] = useState("editContent");
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
    useEffect(() => {
        if (!lectureContent && article) {
            const getLectureContentState = content => {
                if (!content) return EditorState.createEmpty();
                const contentState = convertFromRaw(content);
                return EditorState.createWithContent(contentState);
            };
            setLectureContent(getLectureContentState(article.content));
        }
    }, [article]);
    const handleSaveEstimateTime = (hour, minute) => {
        dispatch({
            type: 'article/updateEstimateTime',
            payload: {
                lectureId,
                hour,
                minute,
                callback: () => {
                    setEstimateVisible(false);
                    message.success('Update estimated time successfully!');
                }
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
    const handleSaveContent = () => {
        const contentState = lectureContent.getCurrentContent();
        const rawData = convertToRaw(contentState);
        dispatch({
            type: 'article/updateContent',
            payload: {
                lectureId,
                content: rawData,
                callback: () => {
                    message.success('Your article is saved successfully!');
                    setSaveStatus(0);
                }
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
            type: 'article/deleteResource',
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
            type: 'article/addExternal',
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
    
    const handleChangeBigTab = tabKey => {
        if (tabKey === "settings") {
            if (description === null) 
                dispatch({
                    type: 'article/fetchDescription',
                    payload: {
                        courseId,
                        lectureId
                    }
                });
            if (resources === null)
                dispatch({
                    type: 'article/fetchResources',
                    payload: {
                        courseId,
                        lectureId
                    }
                });
        }
        setTabKey(tabKey);
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

    const getMetadata = article => {
        return (
            <Descriptions
                title={null}
                column={1}
                size="middle"
            >
                <Descriptions.Item label="Title">
                    {article.title}
                </Descriptions.Item>
                <Descriptions.Item label="Chapter">
                    {article.chapter.title}
                </Descriptions.Item>
                <Descriptions.Item label="Type">
                    Article
                </Descriptions.Item>
                <Descriptions.Item label="Creator">
                    <span className={styles.userName}>
                        {article.owner.name}
                    </span>
                    <span className={styles.avatar}>
                        <UserAvatar
                            alt="user-avatar"
                            src={article.owner.avatar}
                            size={28}
                            textSize={28}
                            text={article.owner.name}
                            borderWidth={0}
                            style={{ color: 'black', background: 'white', fontSize: '1em' }}
                        />
                    </span>
                </Descriptions.Item>
                <Descriptions.Item label="Created at">
                    {moment(article.createdAt).format("DD/MM/YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Last updated">
                    <TimeAgo date={article.updatedAt} />
                </Descriptions.Item>
            </Descriptions>
        );
    };

    return (
        <div className={styles.article}>
            <div className={styles.header}>
                <Row className={styles.infor}>
                    <Col span={1} className={styles.iconCol}>
                        <FileTextFilled className={styles.icon} />
                    </Col>
                    <Col span={18} className={styles.textInfo}>
                        {!article || loading ? (
                            <div className={styles.loading}>
                                <Skeleton active title={null} paragraph={{ rows: 2, width: ['62%', '42%'] }} />
                            </div>
                        ) : (
                            <div>
                                <div className={styles.title}>
                                    {article.title}
                                </div>
                                <div className={styles.chapter}>
                                    {`Chapter ${article.chapter.title}`}
                                </div>
                            </div>
                        )}
                    </Col>
                    <Col span={5} className={styles.options}>
                        {article && !loading && (
                            <>
                                <span className={styles.saveBtn}>
                                    <Button
                                        type="primary"
                                        disabled={!saveStatus} 
                                        onClick={handleSaveContent}
                                    >
                                        {!contentLoading ? <SaveOutlined /> : <LoadingOutlined />}Save
                                    </Button>
                                </span>
                                <span className={styles.estimateTime}>
                                    <Popover
                                        trigger="click"
                                        popupClassName={styles.estimateTimePopover}
                                        placement="bottomRight"
                                        content={(
                                            <EstimateTime
                                                estimateHour={article && article.estimateHour}
                                                estimateMinute={article && article.estimateMinute}
                                                loading={estimateLoading}
                                                onSave={handleSaveEstimateTime}
                                            />
                                        )}
                                        arrowPointAtCenter
                                        popupAlign={{ offset: [21, 6] }}
                                        visible={estimateVisible}
                                        onVisibleChange={visible => setEstimateVisible(visible)}
                                    >
                                        <Tooltip placement="top" title="Add estimates time" mouseEnterDelay={1}>
                                            <ClockCircleFilled />
                                        </Tooltip>
                                    </Popover>
                                </span>
                                <span className={styles.metadata}>
                                    <Popover
                                        trigger="click"
                                        popupClassName={styles.metadataPopover}
                                        placement="bottomRight"
                                        content={getMetadata(article)}
                                        arrowPointAtCenter
                                        popupAlign={{ offset: [21, 6] }}
                                    >
                                        <Tooltip placement="top" title="View article metadata" mouseEnterDelay={1}>
                                            <InfoCircleFilled />
                                        </Tooltip>
                                    </Popover>
                                </span>
                            </>
                        )}
                    </Col>
                </Row>
                <Row className={styles.tabs}>
                    <Col
                        key="editContent"
                        span={12}
                        onClick={() => handleChangeBigTab("editContent")}
                        className={tabKey === "editContent" ? classNames(styles.tabPane, styles.selectedTabPane, styles.editContent) : classNames(styles.tabPane, styles.editContent)}
                    >
                        <span className={styles.icon}>
                            <EditFilled />
                        </span>
                        <span className={styles.text}>
                            Edit content
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
                {tabKey === "editContent" ? (
                    <div className={styles.editContent}>
                        {!article || loading || !lectureContent ? (
                            <div className={styles.loading}>
                                <Spin size="large" />
                                <div className={styles.text}>
                                    Fetching document...
                                </div>
                            </div>
                        ) : (
                            <Fade duration={500}>
                                <Spin spinning={contentLoading} tip="Saving...">
                                    <MainEditor
                                        placeholder="Enter content..."
                                        editorState={lectureContent}
                                        onChange={editorState => {
                                            const curContent = lectureContent.getCurrentContent();
                                            const newContent = editorState.getCurrentContent();
                                            if (curContent !== newContent) setSaveStatus(1);
                                            setLectureContent(editorState);
                                        }}
                                    />
                                </Spin>
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
        externalLoading: !!loading.effects['article/addExternal'],
        deleteLoading: !!loading.effects['article/deleteResource']
    })
)(ArticleLecture)