import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'dva';
import { Alert, Input, Icon, Collapse, Badge, Skeleton, Spin, Avatar, Tooltip, Button, Row, Col, Modal } from 'antd';
import styles from './Goals.less';

const { Panel } = Collapse;
const ButtonGroup = Button.Group;

const TargetItem = ({ item, onChange }) => {
    const [content, setContent] = useState(item.content);
    const [owner, setOnwer] = useState({ ...item.owner });
    const [updatedAt, setUpdatedAt] = useState(item.updatedAt);
    const [type, setType] = useState('text');
    const [extraVisible, setExtraVisible] = useState(false);
    if (type === 'text') {
        return (
            <Row
                className={styles.textTargetItem}
                gutter={16}
                onMouseEnter={() => setExtraVisible(true)}
                onMouseLeave={() => setExtraVisible(false)}
            >
                <Col span={20} className={styles.content}>
                    <Tooltip
                        placement="topLeft"
                        title={(
                            <span>
                                <Avatar shape="circle" size={32} alt="Avatar" src={owner.avatar} style={{ marginRight: '8px' }}/>
                                <span style={{ lineHeight: '32px' }}>{`${owner.name} at ${moment(owner.updatedAt).format('HH:mm, D MMM')}`}</span>
                            </span>
                        )}
                    >
                        <Icon type="check-circle" theme="filled" className={styles.icon} />{item.content}
                    </Tooltip>
                </Col>
                <Col span={4} className={styles.extra}>
                    {item.editable && extraVisible && (
                        <ButtonGroup>
                            <Button type="primary" shape="circle" icon="edit"  />
                            <Button type="primary" shape="circle" icon="rest"  />
                        </ButtonGroup>
                    )}
                    
                </Col>
            </Row>
        );
    }
    return (
        <Row className={styles.inputTargetItem} gutter={16}>

        </Row>
    )
};

const Goals = ({ dispatch, match, ...props }) => {
    const [activeKeys, setActiveKeys] = useState(['whatLearn', 'target', 'requirements']);
    const [whatLearnDisabled, setWhatLearnDisabled] = useState(true);
    const [requirementsDisabled, setRequirementsDisabled] = useState(true);
    const [targetStudentsDisabled, setTargetStudentsDisabled] = useState(true);
    const { courseId } = match.params;
    const {
        goals,
        initLoading
    } = props;
    useEffect(() => {
        dispatch({
            type: 'course/fetchGoals',
            payload: courseId
        });
        return () => dispatch({
            type: 'course/resetGoals'
        });
    }, [courseId]);
    const handleSaveWhatLearn = () => {};
    const handleSaveRequirements = () => {};
    const handleSaveTargetStudents = () => {};
    return (
        <div className={styles.goals}>
            <div className={styles.alert}>
                <Alert
                    message="The descriptions you write here will help students decide if your course is the one for them."
                    type="warning"
                    showIcon
                    icon={<Icon type="info-circle" theme="filled" style={{ color: '#fada5e' }} />}
                />
            </div>
            <div className={styles.main}>
                {!goals || initLoading ? (
                    <Collapse
                        className={styles.collapse}
                        activeKey={[]}
                        expandIcon={() => <Icon type="loading" />}
                        expandIconPosition="right"
                        bordered={false}
                    >
                        <Panel key="whatLearn" header="What will students learn in your course?" className={styles.panel}/>
                        <Panel key="requirements" header="Are there any course requirements or prerequisites?" className={styles.panel}/>
                        <Panel key="target" header="Who are your target students?" className={styles.panel}/>
                    </Collapse>
                ) : (
                    <Collapse
                        activeKey={activeKeys}
                        onChange={activeKeys => setActiveKeys(activeKeys)}
                        expandIconPosition="right"
                        bordered={false}
                    >
                        <Panel key="whatLearn" header="What will students learn in your course?" className={styles.panel}>
                            {_.map(goals.whatLearn, item => (
                                <TargetItem item={item} key={item._id + _.uniqueId('what_learn_')} onChange={() => setWhatLearnDisabled(false)}/>
                            ))}
                            <div className={styles.add}>
                                <Icon type="plus" />
                                <span className={styles.text}>Add an answer</span>
                            </div>
                            <div className={styles.save}>
                                <Button type="primary" disabled={whatLearnDisabled} onClick={handleSaveWhatLearn}>Save</Button>
                            </div>
                        </Panel>
                        <Panel key="requirements" header="Are there any course requirements or prerequisites?" className={styles.panel}>
                            {_.map(goals.requirements, item => (
                                <TargetItem item={item} key={item._id + _.uniqueId('requirement_')} onChange={() => setRequirementsDisabled(false)}/>
                            ))}
                            <div className={styles.add}>
                                <Icon type="plus" />
                                <span className={styles.text}>Add an answer</span>
                            </div>
                            <div className={styles.save}>
                                <Button type="primary" disabled={requirementsDisabled} onClick={handleSaveRequirements}>Save</Button>
                            </div>
                        </Panel>
                        <Panel key="target" header="Who are your target students?" className={styles.panel}>
                            {_.map(goals.targetStudents, item => (
                                <TargetItem item={item} key={item._id + _.uniqueId('target_student_')} onChange={() => setTargetStudentsDisabled(false)}/>
                            ))}
                            <div className={styles.add}>
                                <Icon type="plus" />
                                <span className={styles.text}>Add an answer</span>
                            </div>
                            <div className={styles.save}>
                                <Button type="primary" disabled={targetStudentsDisabled} onClick={handleSaveTargetStudents}>Save</Button>
                            </div>
                        </Panel>
                    </Collapse>
                )}
            </div>
        </div>
    )
};

export default connect(
    ({ course, loading }) => ({
        goals: course.goals,
        initLoading: !!loading.effects['course/fetchGoals']
    })
)(Goals);