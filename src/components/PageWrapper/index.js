import React from 'react';
import styles from './index.less';

const PageWrapper = ({ children, title }) => {
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.title}>{title}</div>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
};

export default PageWrapper;