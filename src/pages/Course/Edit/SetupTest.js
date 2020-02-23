import React from 'react';
import { Icon, Button, Row, Col } from 'antd';
import Link from 'umi/Link';
import styles from './Tips.less';

const SetupTest = () => {
    return (
        <div className={styles.page}>
            <div className={styles.jumpotron}>
                <div>
                    <div className={styles.text}>
                        <div className={styles.title}>
                            Arrange your ideal studio and get early feedback
                        </div>
                        <div className={styles.description}>
                            It's important to get your audio and video set up correctly now, because it's much more difficult to fix your videos after you’ve recorded. There are many creative ways to use what you have to create professional looking video.
                        </div>
                    </div>
                    <div className={styles.box}>
                        <div className={styles.inlineDiv}>
                            <div className={styles.icon}>
                                <Icon type="play-square" theme="filled" style={{ fontSize: '54px', color: '#FADA5E' }} />
                            </div>
                            <div className={styles.title}>
                                Free expert video help
                            </div>
                            <div className={styles.description}>
                                Get personalized advice on your audio and video
                            </div>
                            <div>
                                <Link to="/">
                                    <Button type="primary">Create a test video</Button>
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
                            Equipment can be easy.
                            </div>
                            <div className={styles.content}>
                            You don’t need to buy fancy equipment. Most smartphone cameras can capture video in HD, and you can record audio on another phone or external microphone.
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.title}>
                            Students need to hear you.
                            </div>
                            <div className={styles.content}>
                            A good microphone is the most important piece of equipment you will choose. There are lot of affordable options.. Make sure it’s correctly plugged in and 6-12 inches (15-30 cm) from you.
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.title}>
                            Make a studio.
                            </div>
                            <div className={styles.content}>
                            Clean up your background and arrange props. Almost any small space can be transformed with a backdrop made of colored paper or an ironed bed sheet.
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.title}>
                            Light the scene and your face
                            </div>
                            <div className={styles.content}>
                            Turn off overhead lights. Experiment with three point lighting by placing two lamps in front of you and one behind aimed on the background.
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.title}>
                            Reduce noise and echo.
                            </div>
                            <div className={styles.content}>
                            Turn off fans or air vents, and record at a time when it’s quiet. Place acoustic foam or blankets on the walls, and bring in rugs or furniture to dampen echo.
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.title}>
                            Be creative.
                            </div>
                            <div className={styles.content}>
                            Students won’t see behind the scenes. No one will know if you’re surrounded by pillows for soundproofing...unless you tell other instructors in the community!
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
                                <Link to="/">Teach Hub: Guide to equipment</Link>
                            </div>
                            <div className={styles.content}>
                            Make a home studio on a budget
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.title}>
                                <Link to="/">Udemy Trust & Safety</Link>
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

export default SetupTest;