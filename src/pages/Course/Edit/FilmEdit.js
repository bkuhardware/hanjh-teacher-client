import React from 'react';
import { Icon, Button, Row, Col } from 'antd';
import Link from 'umi/Link';
import styles from './Tips.less';

const FilmEdit = () => {
    return (
        <div className={styles.page}>
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
                                <Icon type="play-square" theme="filled" style={{ fontSize: '64px' }} />
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
            <div className={styles.main}>
                <Row className={styles.tips} gutter={8}>
                    <Col span={1} className={styles.icon}>
                        <Icon type="bulb" />
                    </Col>
                    <Col span={21} className={styles.content}>
                        <div className={styles.title}>
                            Tips
                        </div>
                        <div className={styles.item}>
                            <div className={styles.title}>
                                Create an outline.
                            </div>
                            <div className={styles.content}>
                                Decide what skills you’ll teach and how you’ll teach them. Organize lectures into sections. Each section should have 3-7 lectures, and include at least one assignment or practical activity.
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.title}>
                                Introduce yourself and create momentum.
                            </div>
                            <div className={styles.content}>
                                People online want to start learning quickly. Make an introduction section that gives students something to be excited about in the first 10 minutes.
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.title}>
                                Sections have a clear learning objective.
                            </div>
                            <div className={styles.content}>
                                Introduce each section by describing the section goal and why it’s important. Give lectures and sections titles that reflect their content and have a logical flow.
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.title}>
                                Lectures cover one concept.
                            </div>
                            <div className={styles.content}>
                                A good lecture length is 2-7 minutes, to keep students interested and help them study in short bursts. Make lectures around single topics so students can easily re-watch specific points later.
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.title}>
                                Mix and match your lecture types.
                            </div>
                            <div className={styles.content}>
                                Alternate between filming yourself, your screen, and slides or other visuals. Showing yourself can help students feel connected.
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.title}>
                                Practice activities create hands-on learning.
                            </div>
                            <div className={styles.content}>
                                Help students apply your lessons to their real world with projects, assignments, coding exercises, or worksheets.
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row className={styles.requirements} gutter={8}>
                    <Col span={1} className={styles.icon}>
                        <Icon type="exclamation-circle" />
                    </Col>
                    <Col span={21} className={styles.content}>
                        <div className={styles.title}>
                            Requirements
                        </div>
                        <ul className={styles.list}>
                            <li>Your course has at least five lectures</li>
                            <li>All lectures add up to at least 30+ minutes of total video</li>
                            <li>You course is composed of valuable educational content (learn more)</li>
                        </ul>
                    </Col>
                </Row>
                <Row className={styles.resources} gutter={8}>
                    <Col span={1} className={styles.icon}>
                        <Icon type="solution" />
                    </Col>
                    <Col span={21} className={styles.content}>
                        <div className={styles.title}>
                            Resources
                        </div>
                        <div className={styles.item}>
                            <div className={styles.title}>
                                <Link to="/">HuYeFen Trust & Safety</Link>
                            </div>
                            <div className={styles.content}>
                                Our policies for instructors and students
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.title}>
                                <Link to="/">Join the community</Link>
                            </div>
                            <div className={styles.content}>
                                A place to talk with other instructors
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
};

export default FilmEdit;