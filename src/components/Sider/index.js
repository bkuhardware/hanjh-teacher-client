import React, { useState } from 'react';
import withRouter from 'umi/withRouter';
import router from 'umi/router'
import { Layout, Menu, Icon } from 'antd';
import styles from './index.less';

const { Sider: AntSider } = Layout;
const { SubMenu } = Menu;
const MenuItem = Menu.Item;

const Sider = ({ location }) => {
    const [openKeys, setOpenKeys] = useState(['communications', 'performance']);
    return (
        <AntSider
            className={styles.sider}
            width={250}
            collapsible
        >
            <Menu
                mode="inline"
                className={styles.menu}
                defaultOpenKeys={openKeys}
                selectedKeys={location.pathname}
            >
                <MenuItem key="/courses" onClick={() => router.push('/courses')}>
                    <Icon type="database" />
                    <span>Courses</span>
                </MenuItem>
                <SubMenu
                    key="communications"
                    title={
                        <span>
                            <Icon type="share-alt" />
                            <span>Communications</span>
                        </span>
                    }
                    popupClassName={styles.subMenuPopup}
                >
                    <MenuItem key="/communications/notifications" onClick={() => router.push('/communications/notifications')}>
                        <Icon type="bell" />
                        <span>Notifications</span>
                    </MenuItem>
                    <MenuItem key="/communications/messages" onClick={() => router.push('/communications/messages')}>
                        <Icon type="message" />
                        <span>Messages</span>
                    </MenuItem>
                    <MenuItem key="/communications/followers" onClick={() => router.push('/communications/followers')}>
                        <Icon type="team" />
                        <span>Followers</span>
                    </MenuItem>
                    <MenuItem key="/communications/announcements" onClick={() => router.push('/communications/announcements')}>
                        <Icon type="notification" />
                        <span>Announcements</span>
                    </MenuItem>
                </SubMenu>
                <SubMenu
                    key="performance"
                    title={
                        <span>
                            <Icon type="thunderbolt" />
                            <span>Performance</span>
                        </span>
                    }
                    popupClassName={styles.subMenuPopup}
                >
                    <MenuItem key="/performance/overview" onClick={() => router.push('/performance/overview')}>
                        <Icon type="bar-chart" />
                        <span>Overview</span>
                    </MenuItem>
                    <MenuItem key="/performance/reviews" onClick={() => router.push('/performance/reviews')}>
                        <Icon type="audit" />
                        <span>Reviews</span>
                    </MenuItem>
                    <MenuItem key="/performance/students" onClick={() => router.push('/performance/students')}>
                        <Icon type="user-add" />
                        <span>Students</span>
                    </MenuItem>
                </SubMenu>
                <MenuItem key="/tools" onClick={() => router.push('/tools')}>
                    <Icon type="tool" />
                    <span>Tools</span>
                </MenuItem>
                <MenuItem key="/help" onClick={() => router.push('/help')}>
                    <Icon type="question-circle" />
                    <span>Help</span>
                </MenuItem>
            </Menu>
        </AntSider>
    )
};

export default withRouter(Sider);