import React, { useState } from 'react';
import { connect } from 'dva';
import { Tabs, Form, Input, Upload, Avatar, Icon, Button } from 'antd';
import { EditorState } from 'draft-js';
import Editor from '@/components/Editor/SimpleEditor';
import Wrapper from '@/components/PageWrapper';
import { capitalText } from '@/utils/utils';
import styles from './index.less';

const { TabPane } = Tabs;

const Settings = ({ dispatch, ...props }) => {
    const {
        user
    } = props;
    const [avatar, setAvatar] = useState(null);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
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
                <div className={styles.tabs}>
                    <Tabs defaultActiveKey="profile">
                        <TabPane key="profile" tab="Basic information">
                            
                        </TabPane>
                        <TabPane key="social" tab="Social links">
                            
                        </TabPane>
                        <TabPane key="password" tab="Change password">
                            
                        </TabPane>
                        <TabPane key="payment" tab="Payments">
                            
                        </TabPane>
                    </Tabs>
                </div>
            </div>
    )
};

export default connect(
    ({ user, loading }) => ({
        user: user
    })
)(Settings);