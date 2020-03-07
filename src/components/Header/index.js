import React from 'react';
import Link from 'umi/link';
import router from 'umi/router';
import { connect } from 'dva';
import { Layout, Row, Col, Avatar, Popover, Divider, Icon } from 'antd';
import UserAvatar from '@/components/Avatar';
import Notifications from '@/components/NotificationPopover';
import { capitalText } from '@/utils/utils';
import logo from '@/assets/images/logo_white.png';
import styles from './index.less';

const { Header: AntHeader } = Layout;

const Header = ({ user, dispatch }) => {
    const handleLogout = () => {
        dispatch({
            type: 'user/logout'
        });
    };
    return (
        <AntHeader className={styles.header}>
            <div className={styles.leftContent}>
                <div className={styles.logo}>
                    <Link to="/"><img src={logo} alt="Logo" /></Link>
                </div>
            </div>
            <div className={styles.rightContent}>
                {user ? (
                    <React.Fragment>
                        <div className={styles.account}>
                            <Popover
                                placement="bottomRight"
                                trigger="click"
                                popupAlign={{ offset: [-8, -13] }}
                                popupClassName={styles.accountPopover}
                                content={(
                                    <div>
                                        <Row className={styles.info}>
                                            <Col span={4}>
                                                <UserAvatar
                                                    borderWidth={0}
                                                    alt="user-avatar"
                                                    size={39}
                                                    textSize={39}
                                                    text={user.name}
                                                    style={{ backgroundColor: 'white', color: 'black' }}
                                                    src={user.avatar}
                                                />
                                            </Col>
                                            <Col span={20}>
                                                <div className={styles.name}><b>{user.name}</b></div>
                                                <div className={styles.mail}>{user.email || 'noreply@gmail.com'}</div>
                                            </Col>
                                        </Row>
                                        <div className={styles.item} onClick={() => router.push('/settings')}>
                                            <span className={styles.text}>Account settings</span>
                                        </div>
                                        <div className={styles.item} onClick={handleLogout}>
                                            <span className={styles.text}>Sign out</span>
                                        </div>
                                    </div>
                                )}
                            >
                                <div className={styles.accountText}>
                                    <UserAvatar
                                        borderWidth={0}
                                        alt="user-avatar"
                                        size={39}
                                        textSize={39}
                                        text={user.name}
                                        style={{ backgroundColor: 'white', color: 'black' }}
                                        src={user.avatar}
                                    />
                                </div>
                            </Popover>
                        </div>
                        <div className={styles.notifications}>
                            <Notifications />
                        </div>
                    </React.Fragment>
                ) : null}
                <div className={styles.learn}>
                    Learn on HuYeFen
                </div>
            </div>
        </AntHeader>
    )
};

export default connect(
    ({ user }) => ({
        user: user
    })
)(Header);