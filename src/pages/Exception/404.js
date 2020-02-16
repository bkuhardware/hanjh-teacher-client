import React from 'react';
import { Result } from 'antd';
import styles from './index.less';

const Exception404 = () => {
    return (
        <div className={styles.exception}>
            <div className={styles.inlineDiv}>
                <Result
                    status="404"
                    title="404"
                    subTitle="Sorry, the page you visited does not exist."
                />
            </div>
        </div>
    )
};

export default Exception404;