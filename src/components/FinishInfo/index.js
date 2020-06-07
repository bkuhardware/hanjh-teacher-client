import React, { useState, useReducer } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Steps, Button, Row, Col, Upload, Icon, Form, Input, message } from 'antd';
import FinishLayout from '@/layouts/FinishLayout';
import UserAvatar from '@/components/Avatar';
import Editor from '@/components/Editor/SimpleEditor';
import { EditorState } from 'draft-js';
import { checkEmail } from '@/utils/utils';
import { exportToHTML } from '@/utils/editor';
import styles from './index.less';

const { Step } = Steps;
const FormItem = Form.Item;

const FinishInfo = ({ dispatch, callback, ...props }) => {
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
    const [email, setEmail] = useState({
        value: '',
        validateStatus: 'success',
        help: ''
    });
    const [headline, setHeadline] = useState({
        value: '',
        validateStatus: 'success',
        help: ''
    });
    const [biography, setBiography] = useState({
        value: EditorState.createEmpty(),
        validateStatus: 'success',
        help: ''
    });
    const [twitter, setTwitter] = useState('');
    const [facebook, setFacebook] = useState('');
    const [youtube, setYoutube] = useState('');
    const [instagram, setInstagram] = useState('');
    const handleChangeEmail = e => {
        const val = e.target.value;
        saveNext(1, 1);
        if (_.isEmpty(val))
            return setEmail({
                value: val,
                help: 'You must enter your email!',
                validateStatus: 'error'
            });
        else if (!checkEmail(val))
            return setEmail({
                value: val,
                help: 'Your email is invalid!',
                validateStatus: 'error'
            });
        setEmail({
            value: val,
            help: '',
            validateStatus: 'success'
        });
    };
    const handleChangeJob = e => {
        const val = e.target.value;
        saveNext(1, 1);
        if (_.isEmpty(val))
            return setHeadline({
                value: val,
                help: 'You must enter headline!',
                validateStatus: 'error'
            });
        setHeadline({
            value: val,
            help: '',
            validateStatus: 'success'
        });
    };
    const handleChangeBiography = newBiography => {
        const content = biography.value.getCurrentContent();
        const newContent = newBiography.getCurrentContent();
        if (content !== newContent) {
            saveNext(1, 1);
        }
        if (newContent.hasText()) {
            setBiography({
                value: newBiography,
                validateStatus: 'success',
                help: ''
            });
        }
        else {
            setBiography({
                value: newBiography,
                validateStatus: 'error',
                help: 'You must enter biography!'
            });
        }
    };
    const handleChangeTwitter = e => {
        const val = e.target.value;
        saveNext(2, 1);
        setTwitter(val);
    };
    const handleChangeFacebook = e => {
        const val = e.target.value;
        saveNext(2, 1);
        setFacebook(val);
    };
    const handleChangeYoutube = e => {
        const val = e.target.value;
        saveNext(2, 1);
        setYoutube(val);
    };
    const handleChangeInsta = e => {
        const val = e.target.value;
        saveNext(2, 1);
        setInstagram(val);
    };
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
                const biographyText = exportToHTML(biography.value);
                dispatch({
                    type: 'user/changeInfo',
                    payload: {
                        info: {
                            name: user.name,
                            phone: user.phone, 
                            email: email.value,
                            headline: headline.value,
                            biography: biographyText
                        },
                        callback: () => {
                            saveNext(1, 0);
                            setCurrent(current + 1)
                        }
                    }
                });
            }
            else {
                dispatch({
                    type: 'user/changeSocial',
                    payload: {
                        data: {
                            twitter, facebook, instagram, youtube
                        }, 
                        callback: () => {
                            saveNext(2, 0);
                            callback();
                        }
                    }
                })
            }
        }
        else {
            if (current === 2) callback();
            else setCurrent(current + 1);
        }
    };
    const checkDisabled = () => {
        if (current === 0) {
            return !user.avatar && !avatar;
        }
        else if (current === 1) {
            return _.isEmpty(email.value)
                || !checkEmail(email.value)
                || _.isEmpty(headline.value)
                || headline.value.length < 60
                || !biography.value.getCurrentContent().hasText()
                || biography.value.getCurrentContent().getPlainText('').length < 100;
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
                        <UserAvatar
                            src={avatar || user.avatar}
                            alt="avatar"
                            size={130}
                            textSize={133}
                            borderWidth={3}
                            text={user.name}
                            style={{ color: 'black', background: 'white', fontSize: '3em' }}
                        />
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
            return (
                <div className={styles.second}>
                    <Form>
                        <Row gutter={16}>
                            <Col span={12}>
                                <FormItem label="Email" help={email.help} validateStatus={email.validateStatus} required>
                                    <Input value={email.value} onChange={handleChangeEmail} placeholder="Email" size="large" />
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="Headline" help={headline.help} validateStatus={headline.validateStatus} required>
                                    <Input value={headline.value} onChange={handleChangeJob} placeholder="Headline (Job)" size="large" addonAfter={headline.value.length < 60 ? `(${60 - headline.value.length})` : <Icon type="check" />}/>
                                </FormItem>
                            </Col>
                        </Row>
                        <FormItem
                            label="Biography"
                            className={styles.bio}
                            help={biography.help}
                            validateStatus={biography.validateStatus}
                            required>
                            <Editor
                                editorState={biography.value}
                                onChange={handleChangeBiography}
                                minCount={100}
                                placeholder="Biography"
                            />
                        </FormItem>
                    </Form>
                </div>
            )
        }
        return (
            <div className={styles.third}>
                <Form>
                    <FormItem label="Twitter">
                        <Input type="text" placeholder="twitter" value={twitter} addonAfter={<Icon type="twitter" />} addonBefore={"https://twitter.com/"} onChange={handleChangeTwitter} size="large" />
                    </FormItem>
                    <FormItem label="Facebook">
                        <Input type="text" placeholder="facebook" value={facebook} addonAfter={<Icon type="facebook" />} addonBefore={"https://fb.com/"} onChange={handleChangeFacebook} size="large" />
                    </FormItem>
                    <FormItem label="Youtube">
                        <Input type="text" placeholder="youtube" value={youtube} addonAfter={<Icon type="youtube" />} addonBefore={"https://youtube.com/"} onChange={handleChangeYoutube} size="large" />
                    </FormItem>
                    <FormItem label="Instagram">
                        <Input type="text" placeholder="instagram" value={instagram} addonAfter={<Icon type="instagram" />} addonBefore={"https://instagram.com/"} onChange={handleChangeInsta} size="large"/>
                    </FormItem>
                </Form>
            </div>
        );
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
                            <Step key="social" title="Social links" description="(Optional)" />
                        </Steps>
                        <div className={styles.content}>
                            {content}
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