import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'dva';
import { Alert, Input, Icon, Collapse, Badge, Skeleton, Spin, Avatar, Tooltip, Button, Row, Col, Modal, message } from 'antd';
import styles from './Goals.less';

const { Panel } = Collapse;
const ButtonGroup = Button.Group;

const TargetItem = ({ item, inputValue, itemType, onChangeInput, onOk, onClose, onEdit, onDelete, onNewOk, onNewClose }) => {
    const handleDelete = () => {
        Modal.confirm({
            content: 'Are you sure?',
            okText: 'Delete',
            cancelText: 'Cancel',
            onOk: onDelete
        })
    };
    const handleOk = () => {
        onOk({
            _id: item._id,
            content: inputValue,
            updatedAt: Date.now(),
            editable: true
        });
    };
    const handleNewOk = () => onNewOk(inputValue);
    const [extraVisible, setExtraVisible] = useState(false);
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
                                <span style={{ lineHeight: '32px' }}>{`${item.owner.name} at ${moment(item.updatedAt).format('HH:mm, D MMM')}`}</span>
                            </span>
                        )}
                    >
                        <span className={styles.icon}>
                            <Icon type={item.isAdded ? "plus-circle" : "check-circle"} theme="filled" style={{ color: item.isAdded ? "#fada5e" : "#fafafa" }} />
                        </span>
                        <div style={{ marginLeft: '16px' }}>{item.content}</div>
                    </Tooltip>
                </Col>
                <Col span={2} className={styles.extra}>
                    {item.editable && extraVisible && (
                        <ButtonGroup>
                            <Button icon="edit" onClick={onEdit}/>
                            <Button icon="rest" onClick={handleDelete} />
                        </ButtonGroup>
                    )}
                </Col>
            </Row>
        );
    }
    return (
        <Row className={styles.inputTargetItem} gutter={16}>
            <Col span={22} className={styles.input}>
                <Input placeholder="Answer..." value={inputValue} onChange={onChangeInput} />
            </Col>
            <Col span={2} className={styles.extra}>
                <ButtonGroup>
                    <Button icon="check" disabled={item.content === inputValue} onClick={item._id === 'new_item' ? handleNewOk : handleOk} />
                    <Button icon="close" onClick={item._id === 'new_item' ? onNewClose : onClose} />
                </ButtonGroup>
            </Col>
        </Row>
    )
};

const Subject = ({ field, onSave, currentUser, loading }) => {
    const count = useRef(0);
    const [change, setChange] = useState({
        add: [],
        update: {},
        delete: []
    });
    const [newItem, setNewItem] = useState(null);
    const [metaItem, setMetaItem] = useState({
        'new_item': {
            type: 'input',
            currentValue: ''
        }
    }); 
    useEffect(() => {
        let metaItemData = { ...metaItem };
        _.forEach(field || [], fieldItem => {
            if (
                !metaItemData[fieldItem._id]
                || (
                    metaItemData[fieldItem._id].type === 'text'
                    && _.isEmpty(change.update[fieldItem._id])
                )
            ) {
                metaItemData = {
                    ...metaItemData,
                    [fieldItem._id] :{
                        type: 'text',
                        currentValue: fieldItem.content
                    }
                }
            }
        });
        setMetaItem({ ...metaItemData });
    }, [field]);

    const handleChangeInput = (e, itemId) => {
        const val = e.target.value;
        setMetaItem({
            ...metaItem,
            [itemId]: {
                ...metaItem[itemId],
                currentValue: val
            }
        })
    };
    const handleNewAnswer = () => {
        setNewItem({
            _id: 'new_item',
            content: ''
        });
    };
    const handleOk = (data, itemId) => {
        message.success('Change!');
        setChange({
            ...change,
            update: {
                ...change.update,
                [itemId]: {
                    ...data,
                    owner: currentUser
                }
            }
        });
        setMetaItem({
            ...metaItem,
            [itemId]: {
                ...metaItem[itemId],
                type: 'text'
            }
        });
    };
    const handleClose = (content, itemId) => {
        setMetaItem({
            ...metaItem,
            [itemId]: {
                ...metaItem[itemId],
                type: 'text',
                currentValue: content
            }
        });
    };
    const handleNewOk = content => {
        const countValue = count.current;
        setNewItem(null);
        setChange({
            ...change,
            add: [
                ...change.add,
                {
                    _id: `new_complete_item_${countValue}`,
                    owner: currentUser,
                    content: content,
                    editable: true,
                    updatedAt: Date.now()
                }
            ]
        });
        setMetaItem({
            ...metaItem,
            [`new_complete_item_${countValue}`]: {
                type: 'text',
                currentValue: content
            },
            'new_item': {
                type: 'input',
                currentValue: ''
            }
        });
        count.current += 1;
    };
    const handleNewClose = () => {
        setNewItem(null);
        setMetaItem({
            ...metaItem,
            'new_item': {
                type: 'input',
                currentValue: ''
            }
        });
    };
    const handleEdit = itemId => setMetaItem({
        ...metaItem,
        [itemId]: {
            ...metaItem[itemId],
            type: 'input'
        }
    });
    const handleDelete = itemId => setChange({
        ...change,
        delete: [
            ...change.delete,
            itemId
        ]
    });
    const handleSave = () => {
        let changeArr = {
            add: _.map(change.add, item => ({ ...item })),
            update: {},
            delete: [...change.delete]
        };
        _.forEach(_.keys(change.update), key => {
            changeArr.update = {
                ...changeArr.update,
                [key]: { ...change.update[key] }
            }
        });
        const keyDeleteInDelete = [];
        _.forEach(changeArr.delete, key => {
            const indexInAdd = _.findIndex(changeArr.add, ['_id', key]);
            if (indexInAdd > -1) {
                if (!!changeArr.update[key]) {
                    delete changeArr.update[key];
                }
                keyDeleteInDelete.push(key);
                changeArr.add = _.filter(changeArr.add, item => item._id !== key);
            }
            else {
                if (!!changeArr.update[key]) {
                    delete changeArr.update[key];
                }
            }
        });
        changeArr.delete = _.filter(changeArr.delete, key => _.indexOf(keyDeleteInDelete, key) === -1);
        const newAddData = [];
        _.forEach(changeArr.add, item => {
            if (!!changeArr.update[item._id]) {
                newAddData.push(changeArr.update[item._id]);
                delete changeArr.update[item._id];
            }
            else newAddData.push(item);
        });
        changeArr.add = _.map(newAddData, item => item.content);
        changeArr.update = _.map(_.toArray(changeArr.update), item => ({
            _id: item._id,
            content: item.content
        }));
        onSave(changeArr);
    };
    let renderData;
    if (field) {
        renderData = _.map(field, item => ({ ...item }));
        _.forEach(change.add, item => {
            renderData.push(item);
        });
        if (newItem) renderData.push(newItem);
        _.remove(renderData, item => _.indexOf(change.delete, item._id) > -1);
        _.forEach(_.keys(change.update), key => {
            const index = _.findIndex(renderData, item => item._id === key);
            if (index > -1 && renderData[index])
                renderData[index] = { ...change.update[key] };        
        });
    }
    return (
        <React.Fragment>
            {_.map(renderData, item => !!metaItem[item._id] ? (
                <TargetItem
                    item={item}
                    key={item._id}
                    inputValue={metaItem[item._id].currentValue}
                    itemType={metaItem[item._id].type}
                    onChangeInput={e => handleChangeInput(e, item._id)}
                    onOk={data => handleOk(data, item._id)}
                    onClose={() => handleClose(item.content, item._id)}
                    onNewOk={handleNewOk}
                    onNewClose={handleNewClose}
                    onEdit={() => handleEdit(item._id)}
                    onDelete={() => handleDelete(item._id)}
                />
            ) : (
                <div className={styles.itemLoading} key={_.uniqueId('item_loading_')}>
                    <Spin indicator={<Icon type="loading" spin />} />
                </div>
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