import React from 'react';
import { Result } from 'antd';
import styles from './index.less';

const Exception403 = () => {
    return (
        <div className={styles.exception}>
            <div className={styles.inlineDiv}>
                <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, you are not authorized to access this page."
                />
            </div>
        </div>
    )
};

export default Exception403;