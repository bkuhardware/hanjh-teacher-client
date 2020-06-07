import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import moment from 'moment';
import classNames from 'classnames';
import { connect } from 'dva';
import { FolderViewOutlined, YoutubeFilled, ReadOutlined, MoreOutlined, ReadFilled, PlayCircleFilled } from '@ant-design/icons';
import { Row, Col, List, Collapse, Icon, Dropdown, Menu, Button, Spin, Avatar, Tooltip, Popover, Form, Input, Empty, Modal } from 'antd';
import UserAvatar from '@/components/Avatar';
import styles from './Syllabus.less';

const { Panel } = Collapse;
const ButtonGroup = Button.Group;
const FormItem = Form.Item;

const StaticLecture = ({ lecture, currentUser, onEditLecture, onDeleteLecture }) => {
    const [visible, setVisible] = useState(false);
    const handleMouseEnter = () => setVisible(true);
    const handleMouseLeave = () => setVisible(false);
    return (
        <List.Item
            className={styles.lecture}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            extra={(
                <div className={styles.extra}>
                    <span className={styles.user} style={{ visibility: visible ? 'visible' : 'hidden' }}>
                        <UserAvatar textSize={32} borderWidth={0} size={32} alt="Avatar" src={lecture.owner.avatar} text={lecture.owner.name} extraStyle={{ marginRight: '8px' }} style={{ background: '#fada5e', color: 'white' }}/>
                        <span style={{ lineHeight: '32px' }}>{`${lecture.owner._id !== currentUser._id ? lecture.owner.name : 'You'} at ${moment(lecture.updatedAt).format('HH:mm, D MMM')}`}</span>
                    </span>
                    <span className={styles.length} />
                    <Popover
                        placement="top"
                        content={(
                            <ButtonGroup>
                                <Button icon="edit" type="primary" onClick={() => onEditLecture(lecture)}/>
                                <Button icon="delete" type="primary" onClick={() => onDeleteLecture(lecture)}/>
                            </ButtonGroup>
                        )}
                        popupClassName={styles.chapterPopover}
                        trigger="click"
                        // arrowPointAtCenter
                        // popupAlign={{ offset: [40, -10] }}
                    >
                        <span className={styles.icon}>
                            <MoreOutlined />
                        </span>
                    </Popover>
                </div>
            )}
        >
            <List.Item.Meta
                avatar={(
                    <Avatar
                        size={16}
                        icon={lecture.type === 'Video' ? <YoutubeFilled /> : <ReadOutlined />}
                        style={{
                            background: lecture.type === 1 ? "white" : '#fada5e',
                            color: 'black',
                            position: 'relative',
                            top: '3px'
                        }}
                    />
                )}
                title={<span className={styles.lectureName}>{lecture.title}</span>}
            />
        </List.Item>
    );
};

const Lecture = ({
    lecture,
    editLectureId,
    editLectureTitle,
    editLectureType,
    editLectureLoading,
    currentUser,
    onEditLecture,
    onUpdateLecture,
    onCancelUpdateLecture,
    onEditLectureTitleChange,
    onEditLectureTypeChange,
    onDeleteLecture
}) => {
    
    return editLectureId === lecture._id ? (
        <div className={styles.updateLecture}>
            <Spin spinning={editLectureLoading}>
                <Form>
                    <Row>
                        <Col span={18}>
                            <FormItem label="Lecture title" validateStatus={editLectureTitle.validateStatus} help={editLectureTitle.help} required>
                                <Input
                                    type="text"
                                    size="large"
                                    value={editLectureTitle.value}
                                    onChange={onEditLectureTitleChange}
                                    addonAfter={`${editLectureTitle.value.length}/80`}
                                    placeholder="Title"
                                />
                            </FormItem>
                            <FormItem label="Select lecture type" required>
                                <div
                                    className={editLectureType === 'Video' ? classNames(styles.lectureType, styles.selectedLectureType) : styles.lectureType}
                                    onClick={() => onEditLectureTypeChange('Video')}
                                >
                                    <div className={styles.inlineDiv}>
                                        <PlayCircleFilled style={{ fontSize: '2.5em', position: 'relative', top: '6px' }}/>
                                    </div>
                                    <div className={styles.overlay}>
                                        <div className={styles.text}>Video</div>
                                    </div>
                                </div>
                                <div
                                    className={editLectureType === 'Article' ? classNames(styles.lectureType, styles.selectedLectureType) : styles.lectureType}
                                    onClick={() => onEditLectureTypeChange('Article')}
                                >
                                    <div className={styles.inlineDiv}>
                                        <ReadFilled style={{ fontSize: '2.5em', position: 'relative', top: '6px' }}/>
                                    </div>
                                    <div className={styles.overlay}>
                                        <div className={styles.text}>Article</div>
                                    </div>
                                </div>
                            </FormItem>
                        </Col>
                        <Col span={6} className={styles.btns}>
                            <div>
                                <FormItem>
                                    <Button type="primary" htmlType="button" disabled={_.isEmpty(editLectureTitle.value) || (editLectureTitle.value === lecture.title && editLectureType === lecture.type)} onClick={onUpdateLecture}>
                                        Save
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button htmlType="button" onClick={onCancelUpdateLecture}>
                                        Cancel
                                    </Button>
                                </FormItem>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Spin>
        </div>
    ) : (
        <StaticLecture lecture={lecture} currentUser={currentUser} onEditLecture={onEditLecture} onDeleteLecture={onDeleteLecture} />
    )
};

const Chapter = ({ chapter, currentUser, onAddNewLecture, onUpdateLecture, onDeleteLecture }) => {
    const [newLecture, setNewLecture] = useState(false);
    const [newLectureTitle, setNewLectureTitle] = useState({
        value: '',
        validateStatus: 'success',
        help: ''
    });
    const [newLectureType, setNewLectureType] = useState('Video');
    const [newLectureLoading, setNewLectureLoading] = useState(false);
    const [editLectureId, setEditLectureId] = useState(null);
    const [editLectureType, setEditLectureType] = useState(null);
    const [editLectureTitle, setEditLectureTitle] = useState({
        value: '',
        validateStatus: 'success',
        help: ''
    });
    const [editLectureLoading, setEditLectureLoading] = useState(false);
    const handleChangeNewLectureTitle = e => {
        const val = e.target.value;
        if (val.length <= 80) {
            if (val.length === 0) {
                setNewLectureTitle({
                    value: val,
                    validateStatus: 'error',
                    help: 'Your lecture title must not be empty!'
                });
            }
            else {
                setNewLectureTitle({
                    value: val,
                    validateStatus: 'success',
                    help: ''
                });
            }
        }
    };
    const handleNewLecture = () => setNewLecture(true);
    const handleAddNewLecture = () => {
        setNewLectureLoading(true);
        onAddNewLecture(newLectureTitle.value, newLectureType, () => {
            setNewLectureLoading(false);
            handleCancelAddNewLecture();
        });
    };
    const handleCancelAddNewLecture = () => {
        setNewLectureTitle({
            value: '',
            help: '',
            validateStatus: 'success'
        });
        setNewLectureType('Video');
        setNewLecture(false);
    };
    const handleEditLecture = lecture => {
        setEditLectureId(lecture._id);
        setEditLectureTitle({
            value: lecture.title,
            help: '',
            validateStatus: 'success'
        });
        setEditLectureType(lecture.type);
    };
    const handleEditLectureTitleChange = e => {
        const val = e.target.value;
        if (val.length <= 80) {
            if (val.length === 0) {
                setEditLectureTitle({
                    value: val,
                    validateStatus: 'error',
                    help: 'Your lecture title must not be empty!'
                });
            }
            else {
                setEditLectureTitle({
                    value: val,
                    validateStatus: 'success',
                    help: ''
                });
            }
        }
    };
    const handleEditLectureTypeChange = type => setEditLectureType(type);
    const handleUpdateLecture = () => {
        setEditLectureLoading(true);
        onUpdateLecture(editLectureId, editLectureTitle.value, editLectureType, () => {
            handleCancelUpdateLecture();
            setEditLectureLoading(false);
        });
    };
    const handleCancelUpdateLecture = () => {
        setEditLectureId(null);
        setEditLectureTitle({
            value: '',
            help: '',
            validateStatus: 'success'
        });
        setEditLectureType('');
    };
    return (
        <React.Fragment>
            <List
                className={styles.chapter}
                itemLayout="horizontal"
                rowKey={item => `${chapter._id}_${item._id}`}
                dataSource={chapter.lectures}
                locale={{
                    emptyText: (
                        <Empty
                            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                            imageStyle={{
                                height: 60,
                            }}
                            description="This chapter has 0 lecture."
                        />
                    )
                }}
                renderItem={lecture => (
                    <Lecture
                        lecture={lecture}
                        editLectureId={editLectureId}
                        editLectureTitle={editLectureTitle}
                        editLectureType={editLectureType}
                        editLectureLoading={editLectureLoading}
                        currentUser={currentUser}
                        onEditLecture={handleEditLecture}
                        onEditLectureTitleChange={handleEditLectureTitleChange}
                        onEditLectureTypeChange={handleEditLectureTypeChange}
                        onUpdateLecture={handleUpdateLecture}
                        onCancelUpdateLecture={handleCancelUpdateLecture}
                        onDeleteLecture={onDeleteLecture}
                    />
                )}
            />
            {newLecture ? (
                <div className={styles.newLecture}>
                    <Spin spinning={newLectureLoading}>
                        <Form>
                            <Row>
                                <Col span={18}>
                                    <FormItem label="Lecture title" validateStatus={newLectureTitle.validateStatus} help={newLectureTitle.help} required>
                                        <Input
                                            type="text"
                                            size="large"
                                            value={newLectureTitle.value}
                                            onChange={handleChangeNewLectureTitle}
                                            addonAfter={`${newLectureTitle.value.length}/80`}
                                            placeholder="Title"
                                        />
                                    </FormItem>
                                    <FormItem label="Select lecture type" required>
                                        <div
                                            className={newLectureType === 'Video' ? classNames(styles.lectureType, styles.selectedLectureType) : styles.lectureType}
                                            onClick={() => setNewLectureType('Video')}
                                        >
                                            <div className={styles.inlineDiv}>
                                                <PlayCircleFilled style={{ fontSize: '2.5em', position: 'relative', top: '6px' }}/>
                                            </div>
                                            <div className={styles.overlay}>
                                                <div className={styles.text}>Video</div>
                                            </div>
                                        </div>
                                        <div
                                            className={newLectureType === 'Article' ? classNames(styles.lectureType, styles.selectedLectureType) : styles.lectureType}
                                            onClick={() => setNewLectureType('Article')}
                                        >
                                            <div className={styles.inlineDiv}>
                                                <ReadFilled style={{ fontSize: '2.5em', position: 'relative', top: '6px' }}/>
                                            </div>
                                            <div className={styles.overlay}>
                                                <div className={styles.text}>Article</div>
                                            </div>
                                        </div>
                                    </FormItem>
                                </Col>
                                <Col span={6} className={styles.btns}>
                                    <div>
                                        <FormItem>
                                            <Button type="primary" htmlType="button" disabled={_.isEmpty(newLectureTitle.value)} onClick={handleAddNewLecture}>
                                                Save
                                            </Button>
                                        </FormItem>
                                        <FormItem>
                                            <Button htmlType="button" onClick={handleCancelAddNewLecture}>
                                                Cancel
                                            </Button>
                                        </FormItem>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </Spin>
                </div>
            ) : (
                <div className={styles.addLecture}>
                    <Button type="primary" icon="plus" onClick={handleNewLecture}>New lecture</Button>
                </div>
            )}
        </React.Fragment>
    )
};

const Syllabus = ({ dispatch, match, ...props }) => {
    const { courseId } = match.params;
    const {
        user,
        syllabus,
        loading,
        chapterLoading,
        updateChapterLoading
    } = props;
    const [editChapterId, setEditChapterId] = useState(null);
    const [editChapterTitle, setEditChapterTitle] = useState({
        value: '',
        validateStatus: 'success',
        help: ''
    });
    const [editChapterDescription, setEditChapterDescription] = useState('');
    const [newChapter, setNewChapter] = useState(false);
    const [newChapterTitle, setNewChapterTitle] = useState({
        help: '',
        validateStatus: 'success',
        value: ''
    });
    const [newChapterDescription, setNewChapterDescription] = useState('');
    useEffect(() => {
        Modal.destroyAll();
        dispatch({
            type: 'course/fetchSyllabus',
            payload: courseId
        });
        return () => dispatch({
            type: 'course/resetSyllabus'
        });
    }, [courseId]);
    const handleNewChapter = () => setNewChapter(true);
    const handleChangeNewChapterTitle = e => {
        const val = e.target.value;
        if (val.length <= 80) {
            if (val.length === 0) {
                setNewChapterTitle({
                    value: val,
                    validateStatus: 'error',
                    help: 'Your chapter title must not be empty!'
                });
            }
            else {
                setNewChapterTitle({
                    value: val,
                    validateStatus: 'success',
                    help: ''
                });
            }
        }
    };
    const handleChangeNewChapterDescription = e => {
        const val = e.target.value;
        if (val.length <= 200) {
            setNewChapterDescription(val);
        }
    };
    const handleAddNewChapter = () => {
        dispatch({
            type: 'course/addChapter',
            payload: {
                courseId,
                title: newChapterTitle.value,
                description: newChapterDescription,
                callback: () => handleCancelAddNewChapter()
            }
        });
    };
    const handleCancelAddNewChapter = () => {
        setNewChapterTitle({
            value: '',
            help: '',
            validateStatus: 'success'
        });
        setNewChapterDescription('');
        setNewChapter(false);
    };
    const handleAddNewLecture = chapterId => (title, type, callback) => {
        dispatch({
            type: 'course/addLecture',
            payload: {
                courseId,
                chapterId,
                title,
                type,
                callback
            }
        });
    };
    const handleUpdateLecture = chapterId => (lectureId, title, type, callback) => {
        dispatch({
            type: 'course/updateLecture',
            payload: {
                courseId,
                chapterId,
                lectureId,
                title,
                type,
                callback
            }
        });
    };
    const handleEditChapter = chapter => {
        setEditChapterId(chapter._id);
        setEditChapterTitle({
            value: chapter.title,
            validateStatus: 'success',
            help: ''
        });
        setEditChapterDescription(chapter.description);
    };
    const handleDeleteChapter = chapter => {
        Modal.confirm({
            content: `Delete chapter ${chapter.title}? Are you sure?`,
            okText: 'Delete',
            cancelText: 'Cancel',
            onOk: () => dispatch({
                type: 'course/deleteChapter',
                payload: {
                    courseId,
                    chapterId: chapter._id
                }
            })
        });
    };
    const handleChangeChapterTitle = e => {
        const val = e.target.value;
        if (val.length <= 80) {
            if (val.length === 0) {
                setEditChapterTitle({
                    value: val,
                    validateStatus: 'error',
                    help: 'Your chapter title must not be empty!'
                });
            }
            else {
                setEditChapterTitle({
                    value: val,
                    validateStatus: 'success',
                    help: ''
                });
            }
        }
    };
    const handleChangeChapterDescription = e => {
        const val = e.target.value;
        if (val.length <= 200) {
            setEditChapterDescription(val);
        }
    };
    const handleUpdateChapter = () => {
        dispatch({
            type: 'course/updateChapter',
            payload: {
                courseId,
                title: editChapterTitle.value,
                description: editChapterDescription,
                chapterId: editChapterId,
                callback: () => handleCancelUpdateChapter()
            }
        });
    };
    const handleCancelUpdateChapter = () => {
        setEditChapterId(null);
        setEditChapterDescription('');
        setEditChapterTitle({
            value: '',
            validateStatus: 'success',
            help: ''
        });
    };
    const handleDeleteLecture = chapterId => lecture => {
        Modal.confirm({
            content: `Delete lecture ${lecture.title}?`,
            okText: 'Delete',
            cancelText: 'Cancel',
            onOk: () => dispatch({
                type: 'course/deleteLecture',
                payload: {
                    courseId,
                    chapterId,
                    lectureId: lecture._id
                }
            })
        });
    };
    let defaultActiveKeys = [];
    let countLecturesAll;
    if (syllabus) {
        defaultActiveKeys = _.map(syllabus, chapter => chapter._id);
        countLecturesAll = _.map(syllabus, chapter => chapter.lectures.length);
    }
    return (
        <div className={styles.syllabus}>
            <div className={styles.btn}>
                <Button type="primary"><FolderViewOutlined />Preview</Button>
            </div>
            <div className={styles.main}>
                {!syllabus || !syllabus || loading ? (
                    <div className={styles.loading}>
                        <Spin indicator={<Icon type="loading" style={{ fontSize: '44px' }} />} />
                        <div className={styles.text}>Fetching syllabus...</div>
                    </div>
                ) : (
                    <div className={styles.chapters}>
                        <Collapse
                            defaultActiveKey={defaultActiveKeys}
                        >
                            {_.map(syllabus, (chapter, index) => (
                                <Panel
                                    key={chapter._id}
                                    disabled={editChapterId === chapter._id}
                                    header={editChapterId !== chapter._id ? (
                                        <Tooltip
                                            placement="left"
                                            overlayStyle={{ maxWidth: '1000px' }}
                                            popupAlign={{ offset: [-38, 0] }}
                                            title={(
                                                editChapterId !== chapter._id ? (
                                                    <span>
                                                        <UserAvatar borderWidth={0} textSize={32} size={32} alt="Avatar" src={chapter.owner.avatar} extraStyle={{ marginRight: '8px' }} style={{ background: '#fada5e', color: 'white' }} text={chapter.owner.name} />
                                                        <span style={{ lineHeight: '32px' }}>{`${chapter.owner._id !== user._id ? chapter.owner.name : 'You'} at ${moment(chapter.updatedAt).format('HH:mm, D MMM')}`}</span>
                                                    </span>
                                                ) : (
                                                    <div />
                                                )
                                            )}
                                        >
                                            {`Chapter ${index + 1}: ${chapter.title}`}
                                        </Tooltip>
                                    ) : (
                                        <div className={styles.updateChapter}>
                                            <Spin spinning={updateChapterLoading}>
                                                <Form>
                                                    <Row>
                                                        <Col span={18}>
                                                            <FormItem label="Chapter title" validateStatus={editChapterTitle.validateStatus} help={editChapterTitle.help} required>
                                                                <Input
                                                                    type="text"
                                                                    size="large"
                                                                    value={editChapterTitle.value}
                                                                    onChange={handleChangeChapterTitle}
                                                                    addonAfter={`${editChapterTitle.value.length}/80`}
                                                                    placeholder="Title"
                                                                />
                                                            </FormItem>
                                                            <FormItem label="What will students be able to do at the end of this section?">
                                                                <Input
                                                                    type="text"
                                                                    size="large"
                                                                    value={editChapterDescription}
                                                                    onChange={handleChangeChapterDescription}
                                                                    addonAfter={`${editChapterDescription.length}/200`}
                                                                    placeholder="Description"
                                                                />
                                                            </FormItem>
                                                        </Col>
                                                        <Col span={6} className={styles.btns}>
                                                            <div>
                                                                <FormItem>
                                                                    <Button type="primary" htmlType="button" disabled={(editChapterDescription === chapter.description && editChapterTitle.value === chapter.title) || _.isEmpty(editChapterTitle.value)} onClick={handleUpdateChapter}>
                                                                        Save
                                                                    </Button>
                                                                </FormItem>
                                                                <FormItem>
                                                                    <Button htmlType="button" onClick={handleCancelUpdateChapter}>
                                                                        Cancel
                                                                    </Button>
                                                                </FormItem>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            </Spin>
                                        </div>
                                    )}
                                    extra={editChapterId !== chapter._id && (
                                        <div className={styles.chapterExtra}>
                                            <span className={styles.noOfLectures}>
                                                {`${countLecturesAll[index]} ${countLecturesAll[index] > 1 ? 'lectures' : 'lecture'}`}
                                            </span>
                                            <span className={styles.length} />
                                            <Popover
                                                placement="top"
                                                content={(
                                                    <ButtonGroup>
                                                        <Button
                                                            icon="edit"
                                                            type="primary"
                                                            onClick={e => {
                                                                e.stopPropagation();
                                                                handleEditChapter(chapter);
                                                            }}
                                                        />
                                                        <Button
                                                            icon="delete"
                                                            type="primary"
                                                            onClick={e => {
                                                                e.stopPropagation();
                                                                handleDeleteChapter(chapter);
                                                            }}
                                                        />
                                                    </ButtonGroup>
                                                )}
                                                popupClassName={styles.chapterPopover}
                                                trigger="click"
                                                // arrowPointAtCenter
                                                // popupAlign={{ offset: [40, -10] }}
                                            >
                                                <span className={styles.icon} onClick={e => e.stopPropagation()}>
                                                    <MoreOutlined />
                                                </span>
                                            </Popover>
                                        </div>
                                    )}
                                >
                                    <Chapter
                                        chapter={chapter}
                                        key={chapter._id}
                                        currentUser={user}
                                        onAddNewLecture={handleAddNewLecture(chapter._id)}
                                        onUpdateLecture={handleUpdateLecture(chapter._id)}
                                        onDeleteLecture={handleDeleteLecture(chapter._id)}
                                    />
                                </Panel>
                                    
                                ))}
                            </Collapse>
                            {newChapter ? (
                                <div className={styles.newChapter}>
                                    <Spin spinning={chapterLoading}>
                                        <div className={styles.title}>New chapter</div>
                                        <Form>
                                            <Row>
                                                <Col span={18}>
                                                    <FormItem label="Chapter title" validateStatus={newChapterTitle.validateStatus} help={newChapterTitle.help} required>
                                                        <Input
                                                            type="text"
                                                            size="large"
                                                            value={newChapterTitle.value}
                                                            onChange={handleChangeNewChapterTitle}
                                                            addonAfter={`${newChapterTitle.value.length}/80`}
                                                            placeholder="Title"
                                                        />
                                                    </FormItem>
                                                    <FormItem label="What will students be able to do at the end of this section?">
                                                        <Input
                                                            type="text"
                                                            size="large"
                                                            value={newChapterDescription}
                                                            onChange={handleChangeNewChapterDescription}
                                                            addonAfter={`${newChapterDescription.length}/200`}
                                                            placeholder="Description"
                                                        />
                                                    </FormItem>
                                                </Col>
                                                <Col span={6} className={styles.btns}>
                                                    <div>
                                                        <FormItem>
                                                            <Button type="primary" htmlType="button" disabled={_.isEmpty(newChapterTitle.value)} onClick={handleAddNewChapter}>
                                                                Save
                                                            </Button>
                                                        </FormItem>
                                                        <FormItem>
                                                            <Button htmlType="button" onClick={handleCancelAddNewChapter}>
                                                                Cancel
                                                            </Button>
                                                        </FormItem>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </Spin>
                                </div>
                            ) : (
                                <div className={styles.add}>
                                    <Button type="dashed" icon="plus" onClick={handleNewChapter}>Add a chapter</Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        )
};

export default connect(
    ({ user, loading, course }) => ({
        user: user,
        syllabus: course.syllabus,
        loading: !!loading.effects['course/fetchSyllabus'],
        chapterLoading: !!loading.effects['course/addChapter'],
        updateChapterLoading: !!loading.effects['course/updateChapter']
    })
)(Syllabus)