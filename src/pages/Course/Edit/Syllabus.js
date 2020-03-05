import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import moment from 'moment';
import classNames from 'classnames';
import { connect } from 'dva';
import { FolderViewOutlined, YoutubeFilled, ReadOutlined, MoreOutlined } from '@ant-design/icons';
import { Row, Col, List, Collapse, Icon, Dropdown, Menu, Button, Spin, Avatar, Tooltip, Popover, Form, Input, Empty } from 'antd';
import styles from './Syllabus.less';

const { Panel } = Collapse;
const ButtonGroup = Button.Group;
const FormItem = Form.Item;

const Lecture = ({ lecture, editLectureId, currentUser }) => {
    const [visible, setVisible] = useState(false);
    const handleMouseEnter = () => setVisible(true);
    const handleMouseLeave = () => setVisible(false);
    return (
        <List.Item
            className={styles.lecture}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            extra={(
                editLectureId !== lecture._id ? (
                    <div className={styles.extra}>
                        <span className={styles.user} style={{ visibility: visible ? 'visible' : 'hidden' }}>
                            <Avatar shape="circle" size={32} alt="Avatar" src={lecture.owner.avatar} style={{ marginRight: '8px' }}/>
                            <span style={{ lineHeight: '32px' }}>{`${lecture.owner._id !== currentUser._id ? lecture.owner.name : 'You'} at ${moment(lecture.updatedAt).format('HH:mm, D MMM')}`}</span>
                        </span>
                        <span className={styles.length} />
                        <Popover
                            placement="top"
                            content={(
                                <ButtonGroup>
                                    <Button icon="edit" type="primary"/>
                                    <Button icon="rest" type="primary"/>
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
                ) : null
            )}
        >
            {editLectureId === lecture._id ? (
                <div />
            ) : (
                <List.Item.Meta
                    avatar={(
                        <Avatar
                            size={16}
                            icon={lecture.type === 0 ? <YoutubeFilled /> : <ReadOutlined />}
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
            )}
        </List.Item>
    )
}
const Syllabus = ({ dispatch, match, ...props }) => {
    const { courseId } = match;
    const {
        user,
        syllabus,
        loading,
        chapterLoading,
    } = props;
    const [editLectureId, setEditLectureId] = useState(null);
    const [editChapterId, setEditChapterId] = useState(null);
    const [newChapter, setNewChapter] = useState(false);
    const [newChapterTitle, setNewChapterTitle] = useState({
        help: '',
        validateStatus: 'success',
        value: ''
    });
    const [newChapterDescription, setNewChapterDescription] = useState('');
    useEffect(() => {
        dispatch({
            type: 'course/fetchSyllabus',
            payload: courseId
        });
        return () => dispatch({
            type: 'course/resetSyllabus'
        });
    }, []);
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
                                    header={(
                                        <Tooltip
                                            placement="left"
                                            overlayStyle={{ maxWidth: '1000px' }}
                                            title={(
                                                editChapterId !== chapter._id ? (
                                                    <span>
                                                        <Avatar shape="circle" size={32} alt="Avatar" src={chapter.owner.avatar} style={{ marginRight: '8px' }}/>
                                                        <span style={{ lineHeight: '32px' }}>{`${chapter.owner._id !== user._id ? chapter.owner.name : 'You'} at ${moment(chapter.updatedAt).format('HH:mm, D MMM')}`}</span>
                                                    </span>
                                                ) : (
                                                    <div />
                                                )
                                            )}
                                        >
                                            {`Chapter ${index + 1}: ${chapter.title}`}
                                        </Tooltip>
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
                                                        <Button icon="edit" type="primary" onClick={e => e.stopPropagation()}/>
                                                        <Button icon="rest" type="primary"/>
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
                                            <Lecture lecture={lecture} editLectureId={editLectureId} currentUser={user} />
                                        )}
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
        chapterLoading: !!loading.effects['course/addChapter']
    })
)(Syllabus)