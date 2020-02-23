import React from 'react';
import { Icon, Button } from 'antd';
import Link from 'umi/Link';
import Library from '@/elements/icon/library';
import styles from './CourseStructure.less';

const CourseStructure = () => {
    return (
        <div className={styles.courseStructure}>
            <div className={styles.jumpotron}>
                <div>
                    <div className={styles.text}>
                        <div className={styles.title}>
                            There's a course in you. Plan it out.
                        </div>
                        <div className={styles.description}>
                            Planning your course carefully will create a clear learning path for students and help you once you film. Think down to the details of each lecture including the skill you’ll teach, estimated video length, practical activities to include, and how you’ll create introductions and summaries.
                        </div>
                    </div>
                    <div className={styles.box}>
                        <div className={styles.inlineDiv}>
                            <div className={styles.icon}>
                                <Library />
                            </div>
                            <div className={styles.title}>
                                Our library of resources
                            </div>
                            <div className={styles.description}>
                                Tips and guides to structuring a course students love
                            </div>
                            <div>
                                <Link to="/">
                                    <Button type="primary">Learn at TechHub</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.clear} />
            <div className={styles.tips}></div>
            <div className={styles.requirements}>

            </div>
            <div className={styles.resources}>

            </div>
        </div>
    )
};

export default CourseStructure;