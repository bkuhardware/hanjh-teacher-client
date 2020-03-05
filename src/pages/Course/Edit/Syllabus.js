import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'dva';
import { FolderViewOutlined, YoutubeFilled, ReadOutlined } from '@ant-design/icons';
import { List, Collapse, Icon, Dropdown, Menu, Button, Spin, Avatar, Tooltip } from 'antd';
import styles from './Syllabus.less';

const { Panel } = Collapse;

const Syllabus = ({ dispatch, match, ...props }) => {
    const { courseId } = match;
    const {
        user,
        syllabus,
        loading
    } = props;
    const [syllabusData, setSyllabusData] = useState(null);
    useEffect(() => {
        dispatch({
            type: 'course/fetchSyllabus',
            payload: courseId
        });
        return () => dispatch({
            type: 'course/resetSyllabus'
        });
    }, []);
    useEffect(() => {
        if (syllabus) {
            //...getDerivedStatesFromProps.
            setSyllabusData([...syllabus]);
        }
    }, [syllabus]);
    let defaultActiveKeys = [];
    if (syllabusData) defaultActiveKeys = _.map(syllabusData, chapter => chapter._id);
    return (
        <div className={styles.syllabus}>
            <div className={styles.btn}>
                <Button type="primary"><FolderViewOutlined />Preview</Button>
            </div>
            <div className={styles.main}>
                {!syllabusData || !syllabus || loading ? (
                    <div className={styles.loading}>
                        <Spin indicator={<Icon type="loading" style={{ fontSize: '44px' }} />} />
                        <div className={styles.text}>Fetching syllabus...</div>
                    </div>
                ) : (
                    <div className={styles.chapters}>
                        <Collapse
                            defaultActiveKey={defaultActiveKeys}
                        >
                            {_.map(syllabusData, (chapter, i) => (
                                <Panel
                                    key={chapter._id}
                                    header={(
                                        <Tooltip
                                            placement="left"
                                            mouseEnterDelay={1}
                                            overlayStyle={{ maxWidth: '1000px' }}
                                            title={(
                                                <span>
                                                    <Avatar shape="circle" size={32} alt="Avatar" src={chapter.owner.avatar} style={{ marginRight: '8px' }}/>
                                                    <span style={{ lineHeight: '32px' }}>{`${chapter.owner._id !== user._id ? chapter.owner.name : 'You'} at ${moment(chapter.updatedAt).format('HH:mm, D MMM')}`}</span>
                                                </span>
                                            )}
                                        >
                                            {`Chapter ${i + 1}: ${chapter.title}`}
                                        </Tooltip>
                                    )}
                                    extra={(
                                        <div className={styles.chapterExtra}>

                                        </div>
                                    )}
                                >
                                    <List
                                        className={styles.chapter}
                                        itemLayout="horizontal"
                                        rowKey={item => `${chapter._id}_${item._id}`}
                                        dataSource={chapter.lectures}
                                        renderItem={lecture => (
                                            <List.Item
                                                className={styles.lecture}
                                                extra={(
                                                    <div className={styles.extra}>

                                                    </div>
                                                )}
                                            >
                                                <Tooltip
                                                    placement="left"
                                                    overlayStyle={{ maxWidth: '1000px' }}
                                                    title={(
                                                        <span>
                                                            <Avatar shape="circle" size={32} alt="Avatar" src={lecture.owner.avatar} style={{ marginRight: '8px' }}/>
                                                            <span style={{ lineHeight: '32px' }}>{`${lecture.owner._id !== user._id ? lecture.owner.name : 'You'} at ${moment(lecture.updatedAt).format('HH:mm, D MMM')}`}</span>
                                                        </span>
                                                    )}
                                                >
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
                                                </Tooltip>
                                            </List.Item>
                                        )}
                                    />
                                </Panel>
                            ))}
                        </Collapse>

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
        loading: !!loading.effects['course/fetchSyllabus']
    })
)(Syllabus)