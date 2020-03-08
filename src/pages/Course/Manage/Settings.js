import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Table, Button, Checkbox, Select, Icon, Input, Row, Divider, Spin } from 'antd';
import styles from './Settings.less';

const { Option } = Select;
const { Password } = Input;

const Settings = ({ dispatch, match, ...props }) => {
    const { courseId } = match.params;
    const [privacy, setPrivacy] = useState(undefined);
    const [password, setPassword] = useState('');
    const {
        courseInfo,
        infoLoading,

    } = props;
    // useEffect(() => {

    // }, [courseId]);
    useEffect(() => {
        if (courseInfo) setPrivacy(courseInfo.privacy);
    }, [courseInfo]);
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
                            <Button type="primary" disabled={!courseInfo || infoLoading} loading={!courseInfo || infoLoading}>Save</Button>
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
                            <Button type="danger">Danger Default</Button>
                        </div>
                    </div>
                </div>
            </Row>
            <Row className={styles.permission}>
                <div className={styles.title}>
                    Permission
                </div>
                <div className={styles.main}>

                </div>
            </Row>
        </div>
    )
};

export default connect(
    ({ course, manage, loading }) => ({
        courseInfo: course.info,
        infoLoading: !!loading.effects['course/fetchInfo'],

    })
)(Settings);