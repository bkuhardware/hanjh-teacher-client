import React, { useState } from 'react';
import { connect } from 'dva';
import { Tabs, Form, Input, Upload, Avatar, Icon, Button } from 'antd';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import Editor from '@/components/Editor/SimpleEditor';
import Wrapper from '@/components/PageWrapper';
import { capitalText } from '@/utils/utils';
import styles from './index.less';

const { TabPane } = Tabs;
const FormItem = Form.Item;

const Settings = ({ dispatch, form, ...props }) => {
    const {
        user
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
                                    <Button className={styles.btn} htmlType="button" type="primary" onClick={() => {}} size="large">
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
                                    <Button className={styles.btn} htmlType="button" type="primary" onClick={() => {}} size="large">
                                        Update social links
                                    </Button>
                                </FormItem>
                            </Form>
                        </TabPane>
                        <TabPane className={styles.tabPane} key="password" tab="Change password">
                            
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
        user: user
    })
)(Settings));