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
                        You’re ready to share your knowledge.
                        </div>
                        <div className={styles.description}>
                        This is your moment! If you’ve structured your course and used our guides, you're well prepared for the actual shoot. Pace yourself, take time to make it just right, and fine-tune when you edit.
                        </div>
                    </div>
                    <div className={styles.box}>
                        <div className={styles.inlineDiv}>
                            <div className={styles.icon}>
                                <Icon type="play-circle" theme="filled" style={{ fontSize: '64px', color: '#FADA5E' }} />
                            </div>
                            <div className={styles.title}>
                            You’re in good company
                            </div>
                            <div className={styles.description}>
                            Chat and get production help with other Udemy instructors
                            </div>
                            <div>
                                <Link to="/">
                                    <Button type="primary">Join the community</Button>
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
                            Take breaks and review frequently.
                            </div>
                            <div className={styles.content}>
                            Check often for any changes such as new noises. Be aware of your own energy levels--filming can tire you out and that translates to the screen.
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.title}>
                            Build rapport.
                            </div>
                            <div className={styles.content}>
                            Students want to know who’s teaching them. Even for a course that is mostly screencasts, film yourself for your introduction. Or go the extra mile and film yourself introducing each section!
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.title}>
                            Being on camera takes practice.
                            </div>
                            <div className={styles.content}>
                            Make eye contact with the camera and speak clearly. Do as many retakes as you need to get it right.
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.title}>
                            Set yourself up for editing success.
                            </div>
                            <div className={styles.content}>
                            You can edit out long pauses, mistakes, and ums or ahs. Film a few extra activities or images that you can add in later to cover those cuts.
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.title}>
                            Create audio marks.
                            </div>
                            <div className={styles.content}>
                            Clap when you start each take to easily locate the audio spike during editing. Use our guides to manage your recording day efficiently.
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.title}>
                            For screencasts, clean up.
                            </div>
                            <div className={styles.content}>
                            Move unrelated files and folders off your desktop and open any tabs in advance. Make on-screen text at least 24pt and use zooming to highlight.
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
                            <li>Film and export in HD to create videos of at least 720p, or 1080p if possible</li>
                            <li>Audio should come out of both the left and right channels and be synced to your video</li>
                            <li>Audio should be free of echo and background noise so as not to be distracting to students</li>
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
                                <Link to="/">Create a test video</Link>
                            </div>
                            <div className={styles.content}>
                            Get feedback before filming your whole course
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.title}>
                                <Link to="/">Teach Hub: Guide to quality A/V</Link>
                            </div>
                            <div className={styles.content}>
                            Film and edit with confidence
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.title}>
                                <Link to="/">Udemy trust & safety</Link>
                            </div>
                            <div className={styles.content}>
                            Our policies for instructors and students
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
};

export default FilmEdit;