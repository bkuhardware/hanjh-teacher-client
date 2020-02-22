import React, { useState } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Alert, Input, Icon, Collapse, Badge, Skeleton, Spin } from 'antd';
import styles from './Goals.less';

const { Panel } = Collapse;

const Goals = ({ dispatch, match, ...props }) => {
    const [activeKeys, setActiveKeys] = useState(['whatLearn', 'target', 'requirements']);
    const { courseId } = match.params;
    const {
        goals,
        initLoading
    } = props;
    return (
        <div className={styles.goals}>
            <div className={styles.alert}>
                <Alert
                    message="The descriptions you write here will help students decide if your course is the one for them."
                    type="info"
                    showIcon
                    icon={<Icon type="info-circle" theme="filled" style={{ color: '#fe7f9c' }} />}
                />
            </div>
            <div className={styles.main}>
                {!goals || initLoading ? (
                    <Collapse
                        className={styles.collapse}
                        activeKey={[]}
                        expandIcon={() => <Icon type="loading" />}
                        expandIconPosition="right"
                    >
                        <Panel key="whatLearn" header="What will students learn in your course?" />
                        <Panel key="requirements" header="Are there any course requirements or prerequisites?" />
                        <Panel key="target" header="Who are your target students?" />
                    </Collapse>
                ) : (
                    <Collapse
                        activeKey={activeKeys}
                        onChange={activeKeys => setActiveKeys(activeKeys)}
                        expandIconPosition="right"
                    >
                        <Panel key="whatLearn" header="What will students learn in your course?" className={styles.panel}>

                        </Panel>
                        <Panel key="requirements" header="Are there any course requirements or prerequisites?" className={styles.panel}>

                        </Panel>
                        <Panel key="target" header="Who are your target students?" className={styles.panel}>

                        </Panel>
                    </Collapse>
                )}
            </div>
        </div>
    )
};

export default connect(
    ({ course, loading }) => ({
        goals: course.goals,
        initLoading: !!loading.effects['course/fetchGoals']
    })
)(Goals);