import React, { useState } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Tabs, Form, Input, Upload, Avatar, Icon, Button, message } from 'antd';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import Editor from '@/components/Editor/SimpleEditor';
import Wrapper from '@/components/PageWrapper';
import { capitalText } from '@/utils/utils';
import { exportToHTML } from '@/utils/editor';
import styles from './index.less';

const { TabPane } = Tabs;
const FormItem = Form.Item;
const { Password } = Input;

const Settings = ({ dispatch, form, ...props }) => {
    const {
        user,
        changeInfoLoading,
        changeSocialLoading,
        changePasswordLoading
    } = props;
    const { getFieldDecorator } = form;
    const [avatar, setAvatar] = useState(null);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const blocksFromHTML = convertFromHTML(user.biography);
    const bio = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap,
    );

    const [biography, setBiography] = useState({
        value: EditorState.createWithContent(bio),
        validateStatus: 'success',
        help: ''
    });

    const handleChangeBiography = newBiography => {
        const newContent = newBiography.getCurrentContent();
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
    
    const handleUpdateInformation = () => {
        const errors = form.getFieldsError(['name', 'email', 'job']);
        if (_.some(errors, err => err)) return message.error('Your inputs is invalid!');
        const content = biography.value.getCurrentContent();
        if (content.getPlainText('').length < 100) return message.error('Your biography must has at least 100 characters!');
        const { name, email, job } = form.getFieldsValue();
        const biographyText = exportToHTML(biography.value);
        dispatch({
            type: 'user/changeInfo',
            payload: {
                info: {
                    name, email, job, 
                    biography: biographyText
                },
                callback: () => message.success('Update information successfully!') 
            }
        });
    };

    const handleUpdateSocial = () => {
        const { twitter, facebook, youtube, instagram } = form.getFieldsValue();
        dispatch({
            type: 'user/changeSocial',
            payload: {
                data: { 
                    twitter, facebook, youtube, instagram
                },
                callback: () => message.success('Update social links successfully!')
            }
        });
    };

    const handleChangePassword = () => { 
        const errors = form.getFieldsError(['oldPassword', 'newPassword']);
        if (_.some(errors, err => err)) return message.error('Invalid input, please try again!');
        const { oldPassword, newPassword } = form.getFieldsValue();
        if (!oldPassword || oldPassword.trim() === '') return message.error('Old password must not be empty!');
        if (!newPassword || newPassword.trim() === '') return message.error('New password must not be empty!');
        
        dispatch({
            type: 'user/changePassword',
            payload: {
                oldPassword,
                newPassword,
                onOk: () => {
                    form.resetFields(['oldPassword', 'newPassword']);
                    message.success('Change password successfully!');
                },
                onIncorrect: () => message.error('Your old password is incorrect!')
            }
        });
    };

    const handleBeforeUpload = (file, fileList) => {
        setAvatar(file);
        setFileList(fileList);
        return false;
    };

    const handleRemoveAvatar = () => {
        setAvatar(null);
        setFileList([]);
    };

    const handleUploadAvatar = e => {
        setAvatarLoading(true);
        const fileReader = new FileReader();
        fileReader.readAsDataURL(avatar);
        fileReader.onload = () => {
            dispatch({
                type: 'user/changeAvatar',
                payload: {
                    file: fileReader.result,
                    callback: () => {
                        setAvatar(null);
                        setAvatarLoading(false);
                    }
                }
            });
        };
        setFileList([]);
        e.preventDefault();
    };

    const avatarProps = {
        accept: 'image/*',
        name: 'avatarfile',
        beforeUpload: handleBeforeUpload,
        onRemove: handleRemoveAvatar,
        fileList: fileList,
        openFileDialogOnClick: !avatar,
        showUploadList: {
            showRemoveIcon: true
        }
    };
    return (
        <div className={styles.settings}>
                <div className={styles.avatar}>
                    <div className={styles.inlineDiv}>
                        <div className={styles.main}>
                            {user.avatar ? (
                                <Avatar
                                    size={150}
                                    src={user.avatar}
                                    alt="avatar"
                                />
                            ) : (
                                <Avatar style={{ backgroundColor: '#fada5e', color: 'white', fontSize: '50px' }} size={150}>{capitalText(user.name)}</Avatar>
                            )}
                        </div>
                        <div className={styles.uploader}>
                            <Form layout="vertical" onSubmit={handleUploadAvatar}>
                                <Form.Item>
                                    <Upload {...avatarProps}>
                                        {!avatar ? (
                                            <Button className={styles.upBtn}>
                                                <Icon type="upload" /> New avatar
                                            </Button>
                                        ) : (
                                            <Button type="primary" htmlType="submit">
                                                <Icon type={avatarLoading ? "loading" : "check"} /> Let's change                    
                                            </Button>
                                        )}
                                    </Upload>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
                <div className={styles.fixed}></div>
                <div className={styles.info}>
                    <Tabs
                        defaultActiveKey="profile"
                        className={styles.tabs}
                        tabBarStyle={{
                            borderBottom: 'none',
                            textAlign: 'center'
                        }}
                    >
                        <TabPane className={styles.tabPane} key="profile" tab="Basic information">
                            <Form className={styles.basicInfo}>
                                <FormItem label="Name" required>
                                    {getFieldDecorator('name', {
                                        rules: [
                                            {
                                                required: true,
                                                message: 'You must enter your name!'
                                            }
                                        ],
                                        initialValue: user.name
                                    })(<Input placeholder="Name" size="large"/>)}
                                </FormItem>
                                <FormItem label="Email" required>
                                    {getFieldDecorator('email', {
                                        rules: [
                                            {
                                                required: true,
                                                message: 'You must enter your email!'
                                            },
                                            {
                                                pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                                message: 'Your email is invalid!'
                                            }
                                        ],
                                        initialValue: user.email
                                    })(<Input placeholder="email" size="large" />)}
                                </FormItem>
                                <FormItem label="Headline" required>
                                    {getFieldDecorator('job', {
                                        rules: [
                                            {
                                                required: true,
                                                message: 'You must enter your headline!'
                                            },
                                            {
                                                min: 60,
                                                message: 'Your headline must has at least 60 characters!'
                                            }
                                        ],
                                        initialValue: user.job
                                    })(<Input placeholder="Headline (Job)" size="large" addonAfter={form.getFieldValue('job').length < 60 ? `(${60 - form.getFieldValue('job').length})` : <Icon type="check" />}/>)}
                                </FormItem>
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
                                <FormItem style={{ textAlign: 'center' }}>
                                    <Button className={styles.btn} htmlType="button" type="primary" onClick={handleUpdateInformation} size="large" icon={changeInfoLoading ? "loading" : null}>
                                        Update information
                                    </Button>
                                </FormItem>
                            </Form>
                        </TabPane>
                        <TabPane className={styles.tabPane} key="social" tab="Social links">
                            <Form className={styles.social}>
                                <FormItem label="Twitter">
                                    {getFieldDecorator('twitter', {
                                        initialValue: user.twitter
                                    })(<Input type="text" placeholder="twitter" addonAfter={<Icon type="twitter" />} addonBefore={"https://twitter.com/"} size="large" />)}
                                </FormItem>
                                <FormItem label="Facebook">
                                    {getFieldDecorator('facebook', {
                                        initialValue: user.facebook
                                    })(<Input type="text" placeholder="facebook" addonAfter={<Icon type="facebook" />} addonBefore={"https://fb.com/"} size="large" />)}
                                </FormItem>
                                <FormItem label="Youtube">
                                    {getFieldDecorator('youtube', {
                                        initialValue: user.youtube
                                    })(<Input type="text" placeholder="youtube" addonAfter={<Icon type="youtube" />} addonBefore={"https://youtube.com/"} size="large" />)}
                                </FormItem>
                                <FormItem label="Instagram">
                                    {getFieldDecorator('instagram', {
                                        initialValue: user.instagram
                                    })(<Input type="text" placeholder="instagram" addonAfter={<Icon type="instagram" />} addonBefore={"https://instagram.com/"} size="large" />)}
                                </FormItem>
                                <FormItem style={{ textAlign: 'center' }}>
                                    <Button className={styles.btn} htmlType="button" type="primary" onClick={handleUpdateSocial} size="large" icon={changeSocialLoading ? "loading" : null}>
                                        Update social links
                                    </Button>
                                </FormItem>
                            </Form>
                        </TabPane>
                        <TabPane className={styles.tabPane} key="password" tab="Change password">
                            <Form
                                layout="vertical"
                                className={styles.password}
                                
                            >
                                <Form.Item label="Old password" className={styles.formItem}>
                                    {getFieldDecorator('oldPassword', {
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please enter old password!'
                                            },
                                        ],
                                        initialValue: ''
                                    })(
                                        <Password placeholder="Old password" style={{ width: '100%' }} size="large"  />
                                    )}
                                </Form.Item>
                                <Form.Item label="New password" className={styles.formItem}>
                                    {getFieldDecorator('newPassword', {
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please enter new password!'
                                            },
                                            {
                                                min: 6,
                                                message: 'Your password must has more than 5 character!'
                                            }
                                        ],
                                        initialValue: ''
                                    })(
                                        <Password placeholder="New password" style={{ width: '100%' }} size="large" />
                                    )}
                                </Form.Item>
                                <Form.Item style={{ textAlign: 'center' }}>
                                    <Button className={styles.btn} type="primary" htmlType="button" size="large" icon={changePasswordLoading ? "loading" : null} onClick={handleChangePassword}>
                                        Update password
                                    </Button> 
                                </Form.Item>
                            </Form>
                        </TabPane>
                        <TabPane className={styles.tabPane} key="payment" tab="Payments">
                            
                        </TabPane>
                    </Tabs>
                </div>
            </div>
    )
};

export default Form.create()(connect(
    ({ user, loading }) => ({
        user: user,
        changeInfoLoading: !!loading.effects['user/changeInfo'],
        changeSocialLoading: !!loading.effects['user/changeSocial'],
        changePasswordLoading: !!loading.effects['user/changePassword']
    })
)(Settings));