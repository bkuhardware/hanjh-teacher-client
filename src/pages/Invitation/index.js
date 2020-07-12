import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Spin, Button, Icon, Result, Modal, message } from 'antd';
import Avatar from '@/components/Avatar';
import styles from './index.less';
import router from 'umi/router';

const Invitation = ({ dispatch, match, ...props }) => {
    const { notificationId } = match.params;
    const {
        loading,
        acceptLoading,
        invitationData
    } = props;
    useEffect(() => {
        dispatch({
            type: 'invitation/fetchInvitation',
            payload: notificationId
        });
        return () => dispatch({
            type: 'invitation/clearState'
        });
    }, [notificationId]);

    const handleAcceptInvite = (courseId) => {
        dispatch({
            type: 'invitation/acceptInvitation',
            payload: {
                courseId,
                notificationId,
                callback: (courseId) => {
                    message.success('Great, create awesome course together!');
                    router.push(`/course/${courseId}/edit/goals`);
                }
            }
        });
    };

    const handleIgnoreInvite = () => router.push('/');
    console.log(invitationData);
    return (
        <div className={styles.invitationPage}>
            {!invitationData || loading ? (
                <div className={styles.loading}>
                    <Spin indicator={<Icon type="loading" style={{ fontSize: '36px' }} />} />
                    <div className={styles.tip}>Loading...</div>
                </div>
            ) : (
                <React.Fragment>
                    <Result
                        icon={(
                            <Avatar
                                src={invitationData.owner.avatar}
                                borderWidth={0}
                                text={invitationData.owner.name}
                                size={100}
                                textSize={100}
                                style={{
                                    background: '#FADA5E',
                                    color: '#fff'
                                }}
                            />
                        )}
                        title="Great, you have received a cool invitation!"
                        subTitle={(
                            <span>
                            {invitationData.ownerType} <b>{invitationData.owner.name}</b> invite you to develop the <b>{invitationData.course.title}</b> course.
                        </span>
                        )}
                        extra={[
                            <Button key="ok" type="primary" icon="check" onClick={() => handleAcceptInvite(invitationData.course._id, invitationData.owner._id)}>
                                Accept
                            </Button>,
                            <Button key="no" icon="close" onClick={handleIgnoreInvite}>
                                Ignore
                            </Button>
                        ]}
                    />
                    <Modal
                        className={styles.acceptLoadingModal}
                        width={180}
                        visible={acceptLoading}
                        footer={null}
                        closable={false}
                        maskClosable={false}
                        title={null}
                        centered
                        bodyStyle={{
                            padding: '10px'
                        }}
                    >
                        <div className={styles.icon}><Spin /></div>
                        <div className={styles.text}>Processing...</div>
                    </Modal>
                </React.Fragment>
            )}
        </div>
    )
};

export default connect(
    ({ loading, invitation }) => ({
        loading: !!loading.effects['invitation/fetchInvitation'],
        acceptLoading: !!loading.effects['invitation/acceptInvitation'],
        invitationData: invitation
    })
)(Invitation);
