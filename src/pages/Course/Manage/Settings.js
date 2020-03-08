import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Table, Button, Checkbox, Select, Icon, Input, Row, Divider, Spin } from 'antd';
import UserAvatar from '@/components/Avatar';
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
        userId
    } = props;
    // useEffect(() => {

    // }, [courseId]);
    useEffect(() => {
        if (courseInfo) setPrivacy(courseInfo.privacy);
    }, [courseInfo]);
    const handleHoverMember = index => {

    };
    const handleUnhoverMember = index => {

    };
    const handleChangePermission = (index, type, value) => {

    };
    const handleDeleteMember = () => {};
    const columns = [
        {
            title: 'Instructor',
            dataIndex: 'name',
            key: 'name',
            render: (name, { avatar }) => (
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
                </div>
            ),
            width: '35%'
        },
        {
            title: 'Visible',
            key: 'visible',
            align: 'center',
            width: '10%',
            render: () => (
                <Checkbox
                    defaultChecked={true}
                    disabled={true}
                />
            )
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
                        defaultChecked={announcement}
                        disabled={disabled}
                        onChange={e => handleChangePermission(index, 'announcement', e.target.checked)}
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
                        defaultChecked={messenger}
                        disabled={disabled}
                        onChange={e => handleChangePermission(index, 'messenger', e.target.checked)}
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
                        defaultChecked={privacy}
                        disabled={disabled}
                        onChange={e => handleChangePermission(index, 'privacy', e.target.checked)}
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
                        defaultChecked={invite}
                        disabled={disabled}
                        onChange={e => handleChangePermission(index, 'invite', e.target.checked)}
                    />
                )
            }
        },
        {
            title: '',
            dataIndex: 'display',
            key: 'action',
            width: '10%',
            align: 'center',
            render: (display, { _id: memberId }, index) => {
                const visible = false;
                if (permission && permission.members === 2 && userId !== memberId) visible = true;
                return visible ? <Icon type="rest" theme="filled" className={styles.deleteBtn} onClick={() => handleDeleteMember(memberId, index)} /> : null
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
                                disabled={!courseInfo || infoLoading}
                                loading={!courseInfo || infoLoading}
                                placeholder="Privacy"
                                size="large"
                                value={privacy}
                                onChange={value => setPrivacy(value)}
                                style={{ width: '100%' }}
                            >
                                <Option value="public">Public</Option>
                                <Option value="private">Private (Invitation only)</Option>
                                <Option value="password">Private (Password)</Option>
                                <Option value="draft">Draft</Option>
                            </Select>
                        </div>
                        {courseInfo && !infoLoading && privacy === 'password' && (
                            <div className={styles.password}>
                                <Password size="large" placeholder="New password" value={password} onChange={e => setPassword(e.target.value)} />
                            </div>
                        )}
                        <div className={styles.text}>
                            {text}
                        </div>
                        <div className={styles.btn}>
                            <Button
                                type="primary"
                                disabled={!courseInfo || infoLoading || initLoading || !permission || permission.privacy === 0}
                                loading={!courseInfo || infoLoading || initLoading || !permission}
                            >
                                Save
                            </Button>
                        </div>
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
                    <div className={styles.newMember}>
                        <Search
                            placeholder="Enter email to add new instructor"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            enterButton="Add"
                            size="large"
                            disabled={initLoading || !permission || permission.member === 0}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div className={styles.members}>
                        <Table
                            columns={columns}
                            dataSource={membersData || []}
                            rowKey={member => member._id}
                            pagination={false}
                            loading={initLoading || !permission || loading || !membersData}
                            onRow={(member, index) => ({
                                onMouseEnter: () => handleHoverMember(index),
                                onMouseLeave: () => handleUnhoverMember(index)
                            })}
                        />
                    </div>
                    <div className={styles.btn}>
                        <Button
                            type="primary"
                            onClick={() => {}}
                            disabled={initLoading || !permission || loading || !membersData}
                            loading={initLoading || !permission || loading || !membersData}
                        >
                            Save
                        </Button>
                    </div>
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
        members: manage.settings.members
    })
)(Settings);