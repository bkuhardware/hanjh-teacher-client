import React, { useState } from 'react';
import { connect } from 'dva';
import { Steps, Button, Row, Col } from 'antd';
import FinishLayout from '@/layouts/FinishLayout';
import styles from './index.less';

const { Step } = Steps;

const FinishInfo = ({ dispatch, ...props }) => {
    const [current, setCurrent] = useState(0);
    const {
        user,
        loading
    } = props;
    const handlePrevious = () => {
        setCurrent(current - 1);
    };
    const handleNext = () => {
        setCurrent(current + 1);
    };
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
                            <Step key="social" title="Social links" />
                        </Steps>
                        <div className={styles.content}>
                            Hello
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
                                <Button type="primary" icon={loading ? "loading" : "check"} onClick={handleNext}>
                                    Save & Next
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
        user: user
    })
)(FinishInfo);