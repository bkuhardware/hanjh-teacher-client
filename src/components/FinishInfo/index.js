import React, { useState } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Steps, Button, Row, Col, Upload, Avatar, Icon } from 'antd';
import FinishLayout from '@/layouts/FinishLayout';
import { capitalText } from '@/utils/utils';
import styles from './index.less';

const { Step } = Steps;

const FinishInfo = ({ dispatch, ...props }) => {
    const {
        user,
        firstStepLoading,
        secondStepLoading,
        thirdStepLoading
    } = props;
    const getInitialCurrent = () => {
        if (user) {
            if (!user.avatar) return 0;
            return 1;
        }
        return 0;
    };

    const initialCurrent = getInitialCurrent();
    const [current, setCurrent] = useState(initialCurrent);
    const [next, setNext] = useState([0, 0, 0]);
    const [avatar, setAvatar] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [uploadLoading, setUploadLoading] = useState(false);
    const saveNext = (id, val) => {
        const newNext = [...next];
        newNext[id] = val;
        setNext([...newNext]);
    };
    const handlePrevious = () => {
        setCurrent(current - 1);
    };
    const handleNext = () => {
        if (next[current] === 1) {
            if (current === 0) {
                dispatch({
                    type: 'user/changeAvatar',
                    payload: {
                        file: avatar,
                        callback: () => {
                            saveNext(0, 0);
                            setAvatar(null);
                            setFileList(null);
                            setCurrent(current + 1);
                        }
                    }
                })
            }
            else if (current === 1) {

            }
            else {

            }
            //save
            //callback -> setNext(), setCurrent()
        }
        else {
            setCurrent(current + 1);
        }
    };
    const checkDisabled = () => {
        if (current === 0) {
            return !user.avatar && !avatar;
        }
        else if (current === 1) {

        }
        return false;
    };
    const getContent = () => {
        if (!user) return null;
        if (current === 0) {
            const handleBeforeUpload = (file, fileList) => {
                setUploadLoading(true);
                const fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = () => {
                    setAvatar(fileReader.result);
                    setFileList(fileList);
                    saveNext(0, 1);
                    setUploadLoading(false);
                };
                
                return false;
            };
        
            const handleRemoveAvatar = () => {
                setAvatar(null);
                setFileList([]);
                saveNext(0, 0);
            };
        
            const avatarProps = {
                accept: 'image/*',
                name: 'avatarfile',
                beforeUpload: handleBeforeUpload,
                onRemove: handleRemoveAvatar,
                fileList: fileList,
                showUploadList: {
                    showRemoveIcon: true
                }
            };
            return (
                <div className={styles.first}>
                    <div className={styles.preview}>
                        {avatar || user.avatar ? (
                            <Avatar size={130} className={styles.avatar} alt="avatar" src={avatar || user.avatar} />
                        ) : (
                            <Avatar size={133} alt="avatar" style={{ color: 'black', background: 'white', fontSize: '3em' }}>
                                {capitalText(user.name)}
                            </Avatar>
                        )}
                    </div>
                    <div className={styles.upload}>
                        <Upload {...avatarProps}>
                            {!avatar ? (
                                <Button className={styles.upBtn}>
                                    <Icon type={uploadLoading ? "loading" : "upload"} /> {user.avatar ? 'Change avatar' : 'Upload avatar'}
                                </Button>
                            ) : null}
                        </Upload>
                    </div>
                </div>
            );
        }
        else if (current === 1) {

        }
        else {

        }
        return null;
    };
    const getIcon = () => {
        if (
            current === 0 && firstStepLoading
            || current === 1 && secondStepLoading
            || current === 2 && thirdStepLoading
        ) return "loading";
        return next[current] ? "check" : "right";
    };
    const nextDisabled = checkDisabled();
    const content = getContent();
    const icon = getIcon();
    return (
        <FinishLayout>
            <div className={styles.finishInfo}>
                <div className={styles.inlineDiv}>
                    <div className={styles.title}>
                        Complete your information
                    </div>
                    <div className={styles.main}>
                        <Steps current={current} className={styles.steps}>
                            <Step key="avatar" title="Avatar" />
                            <Step key="basic" title="Information" />
                            <Step key="social" title="Social links" />
                        </Steps>
                        <div className={styles.content}>
                            <div>
                                {content}
                            </div>
                        </div>
                        <Row className={styles.action}>
                            <Col span={12} className={styles.left}>
                                {current > 0 && (
                                    <Button icon="left" onClick={handlePrevious}>
                                        Previous
                                    </Button>
                                )}
                            </Col>
                            <Col span={12} className={styles.right}>
                                <Button type="primary" icon={icon} onClick={handleNext} disabled={nextDisabled}>
                                    {next[current] === 1 ? 'Save & Next' : 'Next'}
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </FinishLayout>
    )
};

export default connect(
    ({ loading, user }) => ({
        user: user,
        firstStepLoading: !!loading.effects['user/changeAvatar'],
        secondStepLoading: !!loading.effects['user/changeInfo'],
        thirdStepLoading: !!loading.effects['user/changeSocial']
    })
)(FinishInfo);