import React from 'react';
import { Result } from 'antd';
import styles from './index.less';

const Exception500 = () => {
    return (
        <div className={styles.exception}>
            <div className={styles.inlineDiv}>
                <Result
                    status="500"
                    title="500"
                    subTitle="Sorry, the server is wrong."
                />
            </div>
        </div>
    )
};

export default Exception500;