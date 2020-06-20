import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Table, Button, Checkbox, Select, Icon, Input, Row, Divider, Spin, message } from 'antd';
import UserAvatar from '@/components/Avatar';
import { checkEmail } from '@/utils/utils';
import styles from './Settings.less';

const { Option } = Select;
const { Password, Search } = Input;

const Settings = ({ dispatch, match, ...props }) => {
    const { courseId } = match.params;
    const [privacy, setPrivacy] = useState(undefined);
    const [password, setPassword] = useState('');
    const [membersData, setMembersData] = useState(null);
    const [email, setEmail] = useState('');
    const {
        courseInfo,
        infoLoading,
        members,
        permission,
        initLoading,
        loading,
        userId,
        addLoading,
        membersLoading,
        privacyLoading
    } = props;
    useEffect(() => {
        dispatch({
            type: 'manage/fetchPermission',
            payload: {
                type: 'settings',
                courseId,
            }
        });
        dispatch({
            type: 'manage/fetchMembers',
            payload: courseId
        });
        return () => dispatch({ type: 'manage/resetSettings' });
    }, [courseId]);
    useEffect(() => {
        if (courseInfo) setPrivacy(courseInfo.privacy);
    }, [courseInfo]);
    useEffect(() => {
        if (members) setMembersData([...members]);
    }, [members]);
    const handleChangePermission = (index, type, value) => {
        const newMembersData = _.cloneDeep(membersData);
        newMembersData[index].permission = {
            ...newMembersData[index].permission,
            [type]: value
        };
        setMembersData([...newMembersData]);
    };
    const handleDeleteMember = index => {
        
        const newMembersData = _.cloneDeep(membersData);
        _.pullAt(newMembersData, [index]);
        setMembersData([...newMembersData]);
    };
    const handleSavePrivacy = () => {
        if (privacy === 'password') {
            dispatch({
                type: 'manage/updatePrivacy',
                payload: {
                    courseId,
                    value: 'password',
                    password,
                    callback: () => setPassword('')
                }
            });
        }
        else {
            dispatch({
                type: 'manage/updatePrivacy',
                payload: {
                    courseId,
                    value: privacy
                }
            });
        }
    };
    const handleDeleteCourse = () => {
        message.info('Sorry, this function is unavailable!');
    };
    const handleSaveMembers = () => {
        const keys = _.map(membersData, member => member._id);
        const membersDataObj = _.keyBy(membersData, '_id');
        let updateData = {};
        _.forEach(keys, key => {
            updateData = {
                ...updateData,
                [key]: {
                    ...membersDataObj[key].permission
                }
            };
        });
        dispatch({
            type: 'manage/updateMembers',
            payload: {
                courseId,
                data: updateData,
            }
        });
    };
    const handleAddMember = () => {
        if (!checkEmail(email)) return message.error('Your email is invalid!');
        dispatch({
            type: 'manage/addMember',
            payload: {
                courseId,
                email,
                callback: () => {
                    message.success('Invite intructor success!');
                    setEmail('');
                }
            }
        });
    };
    const columns = [
        {
            title: 'Instructor',
            dataIndex: 'name',
            key: 'name',
            render: (name, { isOwner, avatar }) => (
                <div className={styles.user}>
                    <UserAvatar
                        size={32}
                        textSize={32}
                        borderWidth={0}
                        style={{ background: 'white', color: 'black' }}
                        text={name}
                        src={avatar}
                        alt="ins-avatar"
                    />
                    <span className={styles.name}>{name}</span>
                    {isOwner && (
                        <span className={styles.owner}>
                            <Icon type="crown" theme="filled" />
                        </span>
                    )}
                </div>
            ),
            width: '30%'
        },
        {
            title: 'Visible',
            key: 'visible',
            align: 'center',
            width: '10%',
            render: () => (
                <Checkbox
                    checked={true}
                />
            )
        },
        {
            title: 'Review',
            dataIndex: ['permission', 'review'],
            key: 'review',
            align: 'center',
            width: '10%',
            render: (review, { _id: memberId }, index) => {
                let disabled = true;
                if (permission && permission.members === 2 && userId !== memberId) disabled = false;
                return (
                    <Checkbox
                        checked={review}
                        // disabled={disabled}
                        onChange={disabled ? () => {} : e => handleChangePermission(index, 'review', e.target.checked)}
                    />
                )
            }
        },
        {
            title: 'Announcement',
            dataIndex: ['permission', 'announcement'],
            key: 'announcement',
            align: 'center',
            width: '13%',
            render: (announcement, { _id: memberId }, index) => {
                let disabled = true;
                if (permission && permission.members === 2 && userId !== memberId) disabled = false;
                return (
                    <Checkbox
                        checked={announcement}
                        // disabled={disabled}
                        onChange={disabled ? () => {} : e => handleChangePermission(index, 'announcement', e.target.checked)}
                    />
                )
            }
        },
        {
            title: 'Messenger',
            dataIndex: ['permission', 'messenger'],
            key: 'messenger',
            align: 'center',
            width: '10%',
            render: (messenger, { _id: memberId }, index) => {
                let disabled = true;
                if (permission && permission.members === 2 && userId !== memberId) disabled = false;
                return (
                    <Checkbox
                        checked={messenger}
                        // disabled={disabled}
                        onChange={disabled ? () => {} : e => handleChangePermission(index, 'messenger', e.target.checked)}
                    />
                )
            }
        },
        {
            title: 'Privacy',
            dataIndex: ['permission', 'privacy'],
            key: 'privacy',
            align: 'center',
            width: '10%',
            render: (privacy, { _id: memberId }, index) => {
                let disabled = true;
                if (permission && permission.members === 2 && userId !== memberId) disabled = false;
                return (
                    <Checkbox
                        checked={privacy}
                        // disabled={disabled}
                        onChange={disabled ? () => {} : e => handleChangePermission(index, 'privacy', e.target.checked)}
                    />
                )
            }
        },
        {
            title: 'Invite member',
            dataIndex: ['permission', 'invite'],
            key: 'invite',
            align: 'center',
            width: '12%',
            render: (invite, { _id: memberId }, index) => {
                let disabled = true;
                if (permission && permission.members === 2 && userId !== memberId) disabled = false;
                return (
                    <Checkbox
                        checked={invite}
                        //disabled={disabled}
                        onChange={disabled ? () => {} : e => handleChangePermission(index, 'invite', e.target.checked)}
                    />
                )
            }
        },
        {
            title: '',
            key: 'action',
            width: '5%',
            align: 'center',
            render: (h, { _id: memberId }, index) => {
                let visible = false;
                if (permission && permission.members === 2 && userId !== memberId) visible = true;
                return visible ? <Icon type="delete" theme="filled" className={styles.deleteBtn} onClick={() => handleDeleteMember(index)} /> : null
            }
        }
    ]
    let text = '';
    switch(privacy) {
        case 'public':
            text = 'Public courses show up in search results and are available for anyone to take on HuYeFen.';
            break;
        case 'private':
            text = "Invitation Only courses don't show up in search results on Udemy. Accept new student requests and send invitations from the 'Students' page found under Course Management in the left navigation.";
            break;
        case 'password':
            text = "Password Protected courses don't show up in search results on Udemy. Instead, share the course URL and password directly with students you want to enroll in your course.";
            break;
        case 'draft':
            text = "Draft courses not show up in search and nobody can access the course. The course is only visible for instuctors. If students have enrolled on course, you can't set course to Draft.";
            break;
        default:
            text = (
                <div className={styles.loading}>
                    <Spin indicator={<Icon type="loading" style={{ fontSize: '32px', color: '#fada5e' }} />} />
                </div>
            );
    }
    return (
        <div className={styles.settings}>
            <Row className={styles.actions}>
                <div className={styles.title}>Actions</div>
                <div className={styles.main}>
                    <div className={styles.privacy}>
                        <div className={styles.title}>
                            Course privacy
                        </div>
                        <div className={styles.select}>
                            <Select
                                disabled={!courseInfo || infoLoading || initLoading || !permission || permission.privacy === 0}
                                loading={!courseInfo || infoLoading || initLoading || !permission}
                                placeholder="Privacy"
                                size="large"
                                value={privacy}
                                onChange={value => {
                                    setPrivacy(value);
                                    setPassword('');
                                }}
                                style={{ width: '100%' }}
                            >
                                <Option value="public">Public</Option>
                                <Option value="private">Private (Invitation only)</Option>
                                <Option value="password">Private (Password)</Option>
                                <Option value="draft">Draft</Option>
                            </Select>
                        </div>
                        {courseInfo && !infoLoading && privacy === 'password' && permission && permission.privacy === 1 && !initLoading && (
                            <div className={styles.password}>
                                <Password size="large" placeholder="New password" value={password} onChange={e => setPassword(e.target.value)} />
                            </div>
                        )}
                        <div className={styles.text}>
                            {text}
                        </div>
                        {courseInfo && !infoLoading && !initLoading && permission && permission.privacy >= 1 && (
                            <div className={styles.btn}>
                                <Button
                                    type="primary"
                                    onClick={handleSavePrivacy}
                                    loading={privacyLoading}
                                >
                                    Save
                                </Button>
                            </div>
                        )}
                    </div>
                    <Divider dashed className={styles.divider} />
                    <div className={styles.delete}>
                        <div className={styles.title}>
                            Course status
                        </div>
                        <div className={styles.text}>
                            We promise students lifetime access, so courses cannot be deleted after students have enrolled.
                        </div>
                        <div className={styles.btn}>
                            <Button
                                type="danger"
                                disabled={initLoading || !permission || permission.privacy === 0}
                                loading={initLoading || !permission}
                                onClick={handleDeleteCourse}
                            >
                                Delete course
                            </Button>
                        </div>
                    </div>
                </div>
            </Row>
            <Row className={styles.permission}>
                <div className={styles.title}>
                    Permission
                </div>
                <div className={styles.main}>
                    {!initLoading && permission && permission.members > 0 && (
                        <div className={styles.newMember}>
                            <Search
                                placeholder="Enter email to add new instructor"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                enterButton="Add"
                                loading={addLoading}
                                disabled={addLoading}
                                size="large"
                                style={{ width: '100%' }}
                                onSearch={handleAddMember}
                            />
                        </div>
                    )}
                    <div className={styles.members}>
                        <Table
                            columns={columns}
                            dataSource={membersData || []}
                            rowKey={member => member._id}
                            pagination={false}
                            loading={initLoading || !permission || loading || !membersData || membersLoading}
                            rowClassName={styles.memberRow}
                        />
                    </div>
                    {permission && membersData && !initLoading && !loading && permission.members === 2 && (
                        <div className={styles.btn}>
                            <Button
                                type="primary"
                                onClick={handleSaveMembers}
                                loading={membersLoading}
                            >
                                Save
                            </Button>
                        </div>
                    )}
                </div>
            </Row>
        </div>
    )
};

export default connect(
    ({ user, course, manage, loading }) => ({
        userId: user._id,
        courseInfo: course.info,
        infoLoading: !!loading.effects['course/fetchInfo'],
        initLoading: !!loading.effects['manage/fetchPermission'],
        loading: !!loading.effects['manage/fetchMembers'],
        permission: manage.settings.permission,
        members: manage.settings.members,
        privacyLoading: !!loading.effects['manage/updatePrivacy'],
        membersLoading: !!loading.effects['manage/updateMembers'],
        addLoading: !!loading.effects['manage/addMember']
    })
)(Settings);