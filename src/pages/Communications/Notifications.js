import React, { useEffect } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'dva';
import { List, Button, Avatar, Skeleton } from 'antd';
import UserAvatar from '@/components/Avatar';
import Spin from '@/elements/spin/secondary';
import { fromNow } from '@/utils/utils';
import styles from './Notifications.less';

const Notifications = ({ dispatch, ...props }) => {
    let {
        initLoading,
        loading,
        maskLoading,
        hasMore,
        notifications
    } = props;
    useEffect(() => {
        if (!initLoading && !notifications) {
            dispatch({
                type: 'notifications/fetch'
            });
        }
    }, []);
    const handleViewNotify = item => {
        //switch(item.type) router.push(..);
        if (!item.seen)
            dispatch({
                type: 'notifications/read',
                payload: item._id
            });
    };
    const handleLoadmore = () => {
        dispatch({
            type: 'notifications/more'
        });
    };
    const handleMaskAllAsRead = () => {
        if (notifications && !maskLoading && !loading) {
            dispatch({
                type: 'notifications/maskAllAsRead'
            });
        }
    };
    const loadMore = (
        !initLoading && !loading && notifications && hasMore ? (
            <div className={styles.loadMore}>
                <Button type="default" size="small" onClick={handleLoadmore}>More notifications</Button>
            </div>
        ) : null
    );
    if (loading) {
        const skeletonData = [
            {
                key: _.uniqueId('noti_loading_'),
                seen: true,
                loading: true
            },
            {
                key: _.uniqueId('noti_loading_'),
                seen: true,
                loading: true
            }
        ]
        if (notifications)
            notifications = _.concat(notifications, skeletonData);
    }
    
    return (
        <div className={styles.notifications}>
            <div className={styles.markAllAsRead}>
                <Button type="primary" onClick={handleMaskAllAsRead}>Mark all as read</Button>
            </div>
            <div className={styles.listCont}>
                <Spin spinning={initLoading || maskLoading} isCenter fontSize={8}>
                    <List
                        dataSource={!notifications ? [] : notifications}
                        itemLayout="horizontal"
                        loadMore={loadMore}
                        rowKey={item => item._id}
                        renderItem={item => (
                            <div className={!item.loading ? styles.notiItem : styles.loadingItem} onClick={!item.loading ? () => handleViewNotify(item) : () => {}}>
                                    <List.Item style={{ background: (item.seen ? 'inherit' : 'rgba(250, 218, 94, 0.05)'), paddingLeft: 12, paddingRight: 12 }}>
                                        <Skeleton active title={false} avatar loading={item.loading}
                                            paragraph={{
                                                rows: 2,
                                                width: ['60%', '40%']
                                            }}
                                        >
                                            <List.Item.Meta
                                                avatar={item.owner ? (
                                                    <UserAvatar
                                                        size={36}
                                                        textSize={36}
                                                        style={{ background: '#FADA5E', color: 'white' }}
                                                        src={item.owner.avatar}
                                                        text={item.owner.name}
                                                        alt="user-avatar"
                                                        borderWidth={0}
                                                    />
                                                ) : null}
                                                title={
                                                    <span>
                                                    {item.owner
                                                        ? `${item.ownerType === 'Teacher'
                                                            ? 'GV '
                                                            : item.ownerType === 'Admin'
                                                                ? 'Admin '
                                                                : ''
                                                        }${item.owner.name} ${item.content}`
                                                        : ''
                                                    }
                                                    </span>
                                                }
                                                description={<span style={{ fontSize: 13, color: 'gray' }}>{fromNow(moment(item.createdAt))}</span>}
                                            />
                                        </Skeleton>
                                    </List.Item>
                                
                            </div>
                        )}
                    />
                </Spin>
            </div>
        </div>
    )
};

export default connect(
    ({ notifications, loading }) => ({
        notifications: notifications.list,
        hasMore: notifications.hasMore,
        loading: !!loading.effects['notifications/more'],
        initLoading: !!loading.effects['notifications/fetch'],
        maskLoading: !!loading.effects['notifications/maskAllAsRead']
    })
)(Notifications);