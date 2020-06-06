import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'dva';
import { Alert, Input, Icon, Collapse, Avatar, Tooltip, Button, Row, Col, Modal, message } from 'antd';
import styles from './Goals.less';

const { Panel } = Collapse;
const ButtonGroup = Button.Group;

const TargetItem = ({ item, onOk, onDelete, onNewOk, onNewClose, userId }) => {
    const [value, setValue] = useState(item.content);
    const [itemType, setItemType] = useState(item._id === 'new_item' ? 'input' : 'text');
    const [extraVisible, setExtraVisible] = useState(false);
    const handleDelete = () => {
        Modal.confirm({
            content: 'Are you sure?',
            okText: 'Delete',
            cancelText: 'Cancel',
            onOk: onDelete
        })
    };
    const handleEdit = () => setItemType('input');
    const handleChangeValue = e => {
        const val = e.target.value;
        setValue(val);
    };
    const handleClose = () => {
        setItemType('text');
        setValue(item.content);
    };
    const handleNewOk = () => onNewOk(value);
    const handleOk = () => {
        onOk(value);
        setItemType('text');
    };
    if (itemType === 'text') {
        return (
            <Row
                className={styles.textTargetItem}
                gutter={16}
                onMouseEnter={() => setExtraVisible(true)}
                onMouseLeave={() => setExtraVisible(false)}
            >
                <Col span={22} className={styles.content}>
                    <Tooltip
                        placement="left"
                        overlayStyle={{ maxWidth: '1000px' }}
                        title={(
                            <span>
                                <Avatar shape="circle" size={32} alt="Avatar" src={item.owner.avatar} style={{ marginRight: '8px' }}/>
                                <span style={{ lineHeight: '32px' }}>{`${item.owner._id !== userId ? item.owner.name : 'You'} at ${moment(item.updatedAt).format('HH:mm, D MMM')}`}</span>
                            </span>
                        )}
                    >
                        <span className={styles.icon}>
                            <Icon type="plus-circle" theme="filled" style={{ color: "#fafafa" }} />
                        </span>
                        <div style={{ marginLeft: '16px' }}>{item.content}</div>
                    </Tooltip>
                </Col>
                <Col span={2} className={styles.extra}>
                    {extraVisible && (
                        <ButtonGroup>
                            <Button icon="edit" onClick={handleEdit}/>
                            <Button icon="delete" onClick={handleDelete} />
                        </ButtonGroup>
                    )}
                </Col>
            </Row>
        );
    }
    return (
        <Row className={styles.inputTargetItem} gutter={16}>
            <Col span={22} className={styles.input}>
                <Input placeholder="Answer..." value={value} onChange={handleChangeValue} />
            </Col>
            <Col span={2} className={styles.extra}>
                <ButtonGroup>
                    <Button icon="check" disabled={item.content === value} onClick={item._id === 'new_item' ? handleNewOk : handleOk} />
                    <Button icon="close" onClick={item._id === 'new_item' ? onNewClose : handleClose} />
                </ButtonGroup>
            </Col>
        </Row>
    )
};

const Subject = ({ field, onSave, currentUser, loading }) => {
    const countRef = useRef(0);
    const [change, setChange] = useState({
        add: {},
        update: {},
        delete: []
    });
    const [newItem, setNewItem] = useState(null);
    const [fieldData, setFieldData] = useState([]);
    useEffect(() => {
        setFieldData([...field]);
    }, [field]);
    const handleNewAnswer = () => {
        setNewItem({
            _id: 'new_item',
            content: ''
        });
    };
    const handleOk = (content, itemId) => {
        //change -update
        const newFieldData = _.map(fieldData, item => ({ ...item }));
        const index = _.findIndex(newFieldData, ['_id', itemId]);
        newFieldData[index] = {
            ...newFieldData[index],
            content: content,
            owner: { ...currentUser },
            updatedAt: moment()
        };
        setFieldData([...newFieldData]);
        if (_.startsWith(itemId, 'new_item_')) {
            setChange({
                ...change,
                add: {
                    ...change.add,
                    [itemId]: content
                }
            });
        }
        else {
            setChange({
                ...change,
                update: {
                    ...change.update,
                    [itemId]: content
                }
            });
        }
    };
    const handleNewOk = content => {
        const count = countRef.current;
        //change - add
        setChange({
            ...change,
            add: {
                ...change.add,
                [`new_item_${count}`]: content
            }
        })
        setFieldData([
            ...fieldData,
            {
                _id: `new_item_${count}`,
                content: content,
                owner: { ...currentUser },
                updatedAt: moment()
            }
        ]);
        handleNewClose();
        countRef.current++;
    };
    const handleNewClose = () => {
        setNewItem(null);
    };
    const handleDelete = itemId => {
        setFieldData(_.filter(fieldData, item => item._id !== itemId));
        //change -delete
        if (!!change.add[itemId]) {
            const newAddData = { ...change.add };
            delete newAddData[itemId];
            setChange({
                ...change,
                add: { ...newAddData }
            });
        }
        else if (!!change.update[itemId]) {
            const newUpdateData = { ...change.update };
            delete newUpdateData[itemId];
            setChange({
                ...change,
                update: { ...newUpdateData },
                delete: [
                    ...change.delete,
                    itemId
                ]
            });
        }
        else {
            setChange({
                ...change,
                delete: [...change.delete, itemId]
            });
        }
    };
    const handleSave = () => {
        onSave(change);
        setChange({
            add: {},
            delete: [],
            update: {}
        });
    }
    let renderData = [...fieldData];
    if (newItem) 
        renderData = [...renderData, newItem];

    return (
        <React.Fragment>
            {_.map(renderData, item => (
                <TargetItem
                    item={item}
                    key={item._id}
                    onOk={content => handleOk(content, item._id)}
                    onNewOk={handleNewOk}
                    onNewClose={handleNewClose}
                    onDelete={() => handleDelete(item._id)}
                    userId={currentUser._id}
                />
            ))}
            {!newItem && (
                <div className={styles.add}>
                    <Button type="dashed" icon="plus" onClick={handleNewAnswer}>Add an answer</Button>
                </div>
            )}
            <div className={styles.save}>
                <Button icon={loading ? "loading" : null} type="primary" disabled={(_.isEmpty(change.add) && _.isEmpty(change.delete) && _.isEmpty(change.update)) || loading} onClick={handleSave}>Save</Button>
            </div>
        </React.Fragment>
    )
};

const Goals = ({ dispatch, match, ...props }) => {
    const [activeKeys, setActiveKeys] = useState(['whatLearn', 'target', 'requirements']);
    const { courseId } = match.params;
    const {
        goals: {
            whatLearn,
            targetStudents,
            requirements
        },
        initLoading,
        whatLearnLoading,
        requirementsLoading,
        targetStudentsLoading,
        user
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
    const handleSaveWhatLearn = (change) => {
        dispatch({
            type: 'course/changeWhatLearn',
            payload: {
                courseId,
                change
            }
        });
    };
    const handleSaveRequirements = (change) => {
        dispatch({
            type: 'course/changeRequirements',
            payload: {
                courseId,
                change
            }
        });
    };
    const handleSaveTargetStudents = (change) => {
        dispatch({
            type: 'course/changeTargetStudents',
            payload: {
                courseId,
                change
            }
        });
    };
    const currentUser = _.pick(user, ['_id', 'name', 'avatar']);
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
                {!whatLearn || initLoading ? (
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
                            <Subject
                                currentUser={currentUser}
                                field={whatLearn}
                                onSave={handleSaveWhatLearn}
                                loading={whatLearnLoading}
                            />
                        </Panel>
                        <Panel key="requirements" header="Are there any course requirements or prerequisites?" className={styles.panel}>
                            <Subject
                                currentUser={currentUser}
                                field={requirements}
                                onSave={handleSaveRequirements}
                                loading={requirementsLoading}
                            />
                        </Panel>
                        <Panel key="target" header="Who are your target students?" className={styles.panel}>
                            <Subject
                                currentUser={currentUser}
                                field={targetStudents}
                                onSave={handleSaveTargetStudents}
                                loading={targetStudentsLoading}
                            />
                        </Panel>
                    </Collapse>
                )}
            </div>
        </div>
    )
};

export default connect(
    ({ user, course, loading }) => ({
        goals: course.goals,
        initLoading: !!loading.effects['course/fetchGoals'],
        whatLearnLoading: !!loading.effects['course/changeWhatLearn'],
        requirementsLoading: !!loading.effects['course/changeRequirements'],
        targetStudentsLoading: !!loading.effects['course/changeTargetStudents'],
        user: user
    })
)(Goals);