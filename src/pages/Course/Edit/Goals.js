import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { useEffectOnlyUpdates, usePrevious } from '@/utils/hooks';
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
let whatLearnCount = 0;

const Goals = ({ dispatch, match, ...props }) => {
    const [activeKeys, setActiveKeys] = useState(['whatLearn', 'target', 'requirements']);
    //what learn
    
    const [whatLearnChange, setWhatLearnChange] = useState({
        add: [],
        update: {},
        delete: []
    });
    const [whatLearnNewItem, setWhatLearnNewItem] = useState(null);
    const [whatLearnMetaItem, setWhatLearnMetaItem] = useState({
        'new_item': {
            type: 'input',
            currentValue: ''
        }
    });
    const [requirementsDisabled, setRequirementsDisabled] = useState(true);
    const [targetStudentsDisabled, setTargetStudentsDisabled] = useState(true);
    const { courseId } = match.params;
    const {
        goals: {
            whatLearn,
            targetStudents,
            requirements
        },
        initLoading,
        user
    } = props;
    //const previousWhatLearn = usePrevious(whatLearn);
    // console.log(previousWhatLearn);
    useEffectOnlyUpdates(() => {
        message.success('PHP');
        let whatLearnMetaItemData = { ...whatLearnMetaItem };
        _.forEach(whatLearn, whatLearnItem => {
            if (
                !whatLearnMetaItemData[whatLearnItem._id]
                || (
                    whatLearnMetaItemData[whatLearnItem._id].type === 'text'
                    && _.isEmpty(whatLearnChange.update[whatLearnItem._id])
                )
            ) {
                whatLearnMetaItemData = {
                    ...whatLearnMetaItemData,
                    [whatLearnItem._id] :{
                        type: 'text',
                        currentValue: whatLearnItem.content
                    }
                }
            }
        });
        setWhatLearnMetaItem({ ...whatLearnMetaItemData });
    }, [whatLearn]);
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
    const handleChangeInput = (e, itemId) => {
        const val = e.target.value;
        setWhatLearnMetaItem({
            ...whatLearnMetaItem,
            [itemId]: {
                ...whatLearnMetaItem[itemId],
                currentValue: val
            }
        })
    };
    const handleNewAnswer = () => {
        setWhatLearnNewItem({
            _id: 'new_item',
            content: ''
        });
    };
    const handleOk = (data, itemId) => {
        message.success('Change!');
        setWhatLearnChange({
            ...whatLearnChange,
            update: {
                ...whatLearnChange.update,
                [itemId]: {
                    ...data,
                    owner: {
                        _id: user._id,
                        name: user.name,
                        avatar: user.avatar
                    }
                }
            }
        });
        setWhatLearnMetaItem({
            ...whatLearnMetaItem,
            [itemId]: {
                ...whatLearnMetaItem[itemId],
                type: 'text'
            }
        });
    };
    const handleClose = (content, itemId) => {
        setWhatLearnMetaItem({
            ...whatLearnMetaItem,
            [itemId]: {
                ...whatLearnMetaItem[itemId],
                type: 'text',
                currentValue: content
            }
        });
    };
    const handleNewOk = content => {
        setWhatLearnNewItem(null);
        setWhatLearnChange({
            ...whatLearnChange,
            add: [
                ...whatLearnChange.add,
                {
                    _id: `new_comp_item_${whatLearnCount}`,
                    owner: {
                        _id: user._id,
                        name: user.name,
                        avatar: user.avatar
                    },
                    content: content,
                    editable: true,
                    updatedAt: Date.now()
                }
            ]
        });
        setWhatLearnMetaItem({
            ...whatLearnMetaItem,
            [`new_comp_item_${whatLearnCount}`]: {
                type: 'text',
                currentValue: content
            },
            'new_item': {
                type: 'input',
                currentValue: ''
            }
        });
        whatLearnCount++;
    };
    const handleNewClose = () => {
        setWhatLearnNewItem(null);
        setWhatLearnMetaItem({
            ...whatLearnMetaItem,
            'new_item': {
                type: 'input',
                currentValue: ''
            }
        });
    };
    const handleEdit = itemId => setWhatLearnMetaItem({
        ...whatLearnMetaItem,
        [itemId]: {
            ...whatLearnMetaItem[itemId],
            type: 'input'
        }
    });
    const handleDelete = itemId => setWhatLearnChange({
        ...whatLearnChange,
        delete: [
            ...whatLearnChange.delete,
            itemId
        ]
    });
    let whatLearnRenderData;
    if (whatLearn) {
        whatLearnRenderData = _.map(whatLearn, item => ({ ...item }));
        _.forEach(whatLearnChange.add, item => {
            whatLearnRenderData.push(item);
        });
        if (whatLearnNewItem) whatLearnRenderData.push(whatLearnNewItem);
        _.remove(whatLearnRenderData, item => _.indexOf(whatLearnChange.delete, item._id) > -1);
        _.forEach(_.keys(whatLearnChange.update), key => {
            const index = _.findIndex(whatLearnRenderData, item => item._id === key);
            if (index > -1 && whatLearnRenderData[index])
                whatLearnRenderData[index] = { ...whatLearnChange.update[key] };        
        });
    }
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
                            {_.map(whatLearnRenderData, item => !!whatLearnMetaItem[item._id] ? (
                                <TargetItem
                                    item={item}
                                    key={item._id}
                                    inputValue={whatLearnMetaItem[item._id].currentValue}
                                    itemType={whatLearnMetaItem[item._id].type}
                                    onChangeInput={e => handleChangeInput(e, item._id)}
                                    onOk={data => handleOk(data, item._id)}
                                    onClose={() => handleClose(item.content, item._id)}
                                    onNewOk={handleNewOk}
                                    onNewClose={handleNewClose}
                                    onEdit={() => handleEdit(item._id)}
                                    onDelete={() => handleDelete(item._id)}
                                />
                            ) : (
                                <div className={styles.itemLoading}>
                                    <Spin indicator={<Icon type="loading" spin />} />
                                </div>
                            ))}
                            {!whatLearnNewItem && (
                                <div className={styles.add}>
                                    <Button type="dashed" icon="plus" onClick={handleNewAnswer}>Add an answer</Button>
                                </div>
                            )}
                            <div className={styles.save}>
                                <Button type="primary" disabled={_.isEmpty(whatLearnChange.add) && _.isEmpty(whatLearnChange.delete) && _.isEmpty(whatLearnChange.update)} onClick={handleSaveWhatLearn}>Save</Button>
                            </div>
                        </Panel>
                        <Panel key="requirements" header="Are there any course requirements or prerequisites?" className={styles.panel}>
                            {/* {_.map(requirements, item => (
                                <TargetItem item={item} key={item._id + _.uniqueId('requirement_')} onChange={() => setRequirementsDisabled(false)}/>
                            ))}
                            <div className={styles.add}>
                                <Button type="dashed" icon="plus">Add an answer</Button>
                            </div>
                            <div className={styles.save}>
                                <Button type="primary" disabled={requirementsDisabled} onClick={handleSaveRequirements}>Save</Button>
                            </div> */}
                        </Panel>
                        <Panel key="target" header="Who are your target students?" className={styles.panel}>
                            {/* {_.map(targetStudents, item => (
                                <TargetItem item={item} key={item._id + _.uniqueId('target_student_')} onChange={() => setTargetStudentsDisabled(false)}/>
                            ))}
                            <div className={styles.add}>
                                <Button type="dashed" icon="plus">Add an answer</Button>
                            </div>
                            <div className={styles.save}>
                                <Button type="primary" disabled={targetStudentsDisabled} onClick={handleSaveTargetStudents}>Save</Button>
                            </div> */}
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
        user: user
    })
)(Goals);