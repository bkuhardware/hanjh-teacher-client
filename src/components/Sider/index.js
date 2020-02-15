import React, { useState } from 'react';
import withRouter from 'umi/withRouter';
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
                <MenuItem key="/courses">
                    <Icon type="database" />
                    <span>Courses</span>
                </MenuItem>
                <SubMenu
                    key="communications"
                    title={
                        <span>
                            <Icon type="thunderbolt" />
                            <span>Communications</span>
                        </span>
                    }
                    popupClassName={styles.subMenuPopup}
                >
                    <MenuItem key="/communications/notifications">
                        <Icon type="bell" />
                        <span>Notifications</span>
                    </MenuItem>
                    <MenuItem key="/communications/messages">
                        <Icon type="message" />
                        <span>Messages</span>
                    </MenuItem>
                    <MenuItem key="/communications/followers">
                        <Icon type="team" />
                        <span>Followers</span>
                    </MenuItem>
                    <MenuItem key="/communications/announcements">
                        <Icon type="notification" />
                        <span>Announcements</span>
                    </MenuItem>
                </SubMenu>
                <SubMenu
                    key="performance"
                    title={
                        <span>
                            <Icon type="share-alt" />
                            <span>Performance</span>
                        </span>
                    }
                    popupClassName={styles.subMenuPopup}
                >
                    <MenuItem key="/performance/overview">
                        <Icon type="bar-chart" />
                        <span>Overview</span>
                    </MenuItem>
                    <MenuItem key="/performance/reviews">
                        <Icon type="audit" />
                        <span>Reviews</span>
                    </MenuItem>
                    <MenuItem key="/performance/students">
                        <Icon type="user-add" />
                        <span>Students</span>
                    </MenuItem>
                </SubMenu>
                <MenuItem key="/tools">
                    <Icon type="tool" />
                    <span>Tools</span>
                </MenuItem>
                <MenuItem key="/help">
                    <Icon type="question-circle" />
                    <span>Help</span>
                </MenuItem>
            </Menu>
        </AntSider>
    )
};

export default withRouter(Sider);