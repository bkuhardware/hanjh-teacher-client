import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import classNames from 'classnames';
import { usePrevious } from '@/utils/hooks';
import { Form, Input, Icon, Select, Row, Col, AutoComplete, Tooltip, Tag, Spin, Button, Upload, message, Modal } from 'antd';
import Cropper from 'react-cropper';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import Editor from '@/components/Editor/DescriptionEditor';
import { TweenOneGroup } from 'rc-tween-one';
import { exportToHTML } from '@/utils/editor';
import styles from './Landing.less';

const FormItem = Form.Item;
const { Option } = Select;

const Landing = ({ form, match, dispatch, ...props }) => {
    const cropper = useRef();
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [description, setDescription] = useState(EditorState.createEmpty());
    const [dataSource, setDataSource] = useState([]);
    const [topics, setTopics] = useState([]);
    const [primaryTopic, setPrimaryTopic] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [cropVisible, setCropVisible] = useState(false);
    const [originImg, setOriginImg] = useState(null);
    const [cropCallback, setCropCallback] = useState({
        callback: null
    });
    const [uploadLoading, setUploadLoading] = useState(false);
    const { getFieldDecorator } = form;
    const { courseId } = match.params;
    const {
        areasMenu,
        landing,
        loading,
        basicLoading,
        avatarLoading
    } = props;
    const previousLanding = usePrevious(landing);
    useEffect(() => {
        dispatch({
            type: 'course/fetchLanding',
            payload: courseId
        });
        return () => dispatch({ type: 'course/resetLanding' });
    }, [courseId]);
    useEffect(() => {
        if (!previousLanding && landing) {
            const blocksFromHTML = convertFromHTML(landing.description || '');
            const description = ContentState.createFromBlockArray(
                blocksFromHTML.contentBlocks,
                blocksFromHTML.entityMap,
            );
            setDescription(EditorState.createWithContent(description));
            setTopics([...landing.topics]);
            setPrimaryTopic(landing.primaryTopic);
        }
    }, [landing, previousLanding]);
    const handleChangeArea = val => {
        form.setFieldsValue({
            category: undefined
        });
        setCategoryOpen(true);
    };
    const handleRemoveTopic = topicId => {
        const filterTopics = _.filter(topics, topic => topic._id !== topicId);
        setTopics(filterTopics);
        if (topicId === primaryTopic) setPrimaryTopic(null);
    };
    const handleChangePrimaryTopic = topicId => {
        if (primaryTopic === topicId) return setPrimaryTopic(null);
        setPrimaryTopic(topicId);
    };
    const handleSubmitBasicInfo = e => {
        e.preventDefault();
        const errors = form.getFieldsError();
        if (_.some(errors, err => err)) return message.error('Your input is invalid! Please check again!');
        const {
            title,
            subTitle,
            language,
            level,
            area,
            category
        } = form.getFieldsValue();
        const descriptionHTML = exportToHTML(description);
        const topicsData = _.map(topics, topic => topic._id);
        dispatch({
            type: 'course/changeBasicInfo',
            payload: {
                courseId,
                title,
                subTitle,
                language,
                level,
                area,
                category,
                description: descriptionHTML,
                topics: topicsData,
                primaryTopic
            }
        });
    };
    const handleCloseCropModal = () => {
        setCropVisible(false);
        setOriginImg(null);
        setCropCallback({
            callback: null
        }); 
    };
    const handleCrop = () => {
        cropCallback.callback(cropper.current.getCroppedCanvas({
            width: 750,
            height: 422,
            fillColor: 'white'
        }).toDataURL());
        handleCloseCropModal();
    };
    const handleBeforeUpload = (file, fileList) => {
        setUploadLoading(true);
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            const image = new Image();
            image.src = fileReader.result;
            image.onload = () => {
                setOriginImg(fileReader.result);
                setCropVisible(true);
                setCropCallback({
                    callback: croppedAvatar => {
                        setAvatar(croppedAvatar);
                        setFileList(fileList);
                    }
                });
                setUploadLoading(false);
            }
        };
        
        return false;
    };
    const handleRemoveAvatar = () => {
        setAvatar(null);
        setFileList([]);
    };
    const handleSetAvatar = () => {
        dispatch({
            type: 'course/changeAvatar',
            payload: {
                courseId,
                file: avatar,
                callback: () => {
                    setAvatar(null);
                    setFileList([]);
                }
            }
        });
    };
    const avatarProps = {
        accept: 'image/*',
        name: 'avatarfile',
        beforeUpload: handleBeforeUpload,
        onRemove: handleRemoveAvatar,
        fileList: fileList,
        openFileDialogOnClick: !avatar,
        showUploadList: {
            showRemoveIcon: true
        }
    };
    return (
        <div className={styles.landing}>
            <div className={styles.content}>
                <div className={styles.title}>Basic information</div>
                <div className={styles.main}>
                    <Form
                        className={styles.basicInfo}
                        onSubmit={handleSubmitBasicInfo}
                    >
                        <FormItem label="Title">
                            {getFieldDecorator('title', {
                                rules: [
                                    {
                                        max: 60,
                                        message: 'Course title must not has more than 60 characters!'
                                    },
                                    {
                                        min: 8,
                                        message: 'Course title must not has less than 8 characters!'
                                    },
                                    {
                                        required: true,
                                        message: 'Course title must be not empty!'
                                    }
                                ],
                                initialValue: (landing && landing.title) || ''
                            })(
                                <Input
                                    placeholder="Course title"
                                    size="large"
                                    addonAfter={
                                        !landing || loading ? (
                                            <Icon type="loading" />
                                        ) : (
                                            (form.getFieldValue('title').length <= 60) ? (
                                                `${form.getFieldValue('title').length}/60`
                                            ) : (
                                                <Icon type="exclamation-circle" />
                                            )
                                        )
                                    }
                                />
                            )}
                        </FormItem>
                        <FormItem label="Subtitle">
                            {getFieldDecorator('subTitle', {
                                rules: [
                                    {
                                        max: 150,
                                        message: 'Course sub title must not has more than 150 characters!'
                                    }
                                ],
                                initialValue: (landing && landing.subTitle) || ''
                            })(
                                <Input
                                    placeholder="Course sub title"
                                    size="large"
                                    addonAfter={
                                        !landing || loading ? (
                                            <Icon type="loading" />
                                        ) : (
                                            (form.getFieldValue('subTitle').length <= 150) ? (
                                                `${form.getFieldValue('subTitle').length}/150`
                                            ) : (
                                                <Icon type="exclamation-circle" />
                                            )
                                        )
                                    }
                                />
                            )}
                        </FormItem>
                        <FormItem label="Description">
                            <Editor
                                placeholder="Description"
                                editorState={description}
                                onChange={editorState => setDescription(editorState)}

                            />
                        </FormItem>
                        <Row gutter={24}>
                            <Col span={12}>
                                <FormItem label="Language">
                                    {getFieldDecorator('language', {
                                        initialValue: (landing && landing.language) || undefined
                                    })(
                                        <Select
                                            size="large"
                                            placeholder="Language"
                                            loading={!landing || loading}
                                            disabled={!landing || loading}
                                        >
                                            <Option key="english">English (US)</Option>
                                            <Option key="vietnamese">Vietnamese</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="Level">
                                    {getFieldDecorator('level', {
                                        initialValue: (landing && landing.level) || undefined
                                    })(
                                        <Select
                                            size="large"
                                            placeholder="Level"
                                            loading={!landing || loading}
                                            disabled={!landing || loading}
                                        >
                                            <Option key="allLevel">All level</Option>
                                            <Option key="beginner">Beginner</Option>
                                            <Option key="intermediate">Intermediate</Option>
                                            <Option key="expert">Expert</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12}>
                                <FormItem label="Area">
                                    {getFieldDecorator('area', {
                                        initialValue: (landing && landing.area) || undefined
                                    })(
                                        <Select
                                            size="large"
                                            placeholder="Area"
                                            loading={!areasMenu || !landing || loading}
                                            disabled={!areasMenu || !landing || loading}
                                            onChange={handleChangeArea}
                                        >
                                            {areasMenu && _.map(areasMenu, area => (
                                                <Option key={area._id}>{area.title}</Option>
                                            ))}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="Category">
                                    {getFieldDecorator('category', {
                                        initialValue: (landing && landing.category) || undefined
                                    })(
                                        <Select
                                            size="large"
                                            placeholder="Category"
                                            loading={!areasMenu || !landing || loading}
                                            disabled={!areasMenu || !landing || loading}
                                            open={categoryOpen}
                                            onDropdownVisibleChange={open => setCategoryOpen(open)}
                                        >
                                            {(areasMenu && landing && form.getFieldValue('area')) && 
                                            _.map((_.find(areasMenu, area => area._id === form.getFieldValue('area')) || { categories: [] }).categories, category => (
                                                <Option key={category._id}>{category.title}</Option>
                                            ))}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <FormItem
                            label={(
                                <span>
                                    <span style={{ marginRight: '8px' }}>Topics and <b style={{ color: '#fada5e' }}>primary</b> topic?</span>
                                    <span className={styles.icon}>
                                        <Tooltip trigger="click" placement="right" title="Which topic do you spend the most time covering in your course? If you believe two topics are equally representative of your entire course, select either one. All of the topics listed will still count as being taught in your course">
                                            <Icon type="info-circle" theme="filled" style={{ fontSize: '0.8em', color: '#fada5e' }} />
                                        </Tooltip>
                                    </span>
                                </span>
                            )}
                            colon={false}
                        >
                            <AutoComplete
                                size="large"
                                style={{ width: '30%' }}
                                placeholder="Topics"
                                dropdownMatchSelectWidth={false}
                                className={styles.topicsAutoComplete}
                                dataSource={dataSource}
                                onSearch={searchText => setDataSource(!searchText ? [] : [searchText, searchText.repeat(2), searchText.repeat(3)])}
                                disabled={!landing || loading}
                            >
                                <Input suffix={!landing || loading ? <Icon type="loading" /> : <Icon type="search" />} />
                            </AutoComplete>
                            <div className={styles.topicsList}>
                                {landing && !loading ? (
                                    <TweenOneGroup
                                        enter={{
                                            scale: 0.8,
                                            opacity: 0,
                                            type: 'from',
                                            duration: 100,
                                            onComplete: e => {
                                                e.target.style = '';
                                            },
                                        }}
                                        leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                                        appear={false}
                                    >
                                        {!_.isEmpty(topics) ? _.map(topics, topic => (
                                                <Tooltip key={topic._id} placement="bottom" title={`Click to toggle ${topic.title} be primary topic`} mouseEnterDelay={1.5}>
                                                    <span className={primaryTopic === topic._id ? classNames(styles.topic, styles.primary) : styles.topic} onClick={() => handleChangePrimaryTopic(topic._id)}>
                                                        <Tag
                                                            closable
                                                            onClose={() => handleRemoveTopic(topic._id)}
                                                        >
                                                            {topic.title}
                                                        </Tag>
                                                    </span>
                                                </Tooltip>
                                        )) : (
                                            <span className={styles.empty}>
                                                Empty topic.
                                            </span>
                                        )}
                                    </TweenOneGroup>
                                ) : (
                                    <div style={{ marginTop: '18px'}}>
                                        <Spin indicator={<Icon type="loading" spin style={{ color: '#fada5e' }} />} />
                                    </div>
                                )}
                            </div>
                        </FormItem>
                        <FormItem className={styles.btnCont}>
                            <Button htmlType="submit" type="primary" className={styles.submitBtn} icon={basicLoading ? "loading" : null} disabled={loading || basicLoading}>
                                Save
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.title}>
                    Course avatar
                </div>
                <div className={styles.main}>
                    {!landing || loading ? (
                        <div className={styles.avatarLoading}>
                            <Spin indicator={<Icon type="loading-3-quarters" spin style={{ color: '#fada5e', fontSize: 44 }} />} />
                        </div>
                    ) : (
                        <Row className={styles.avatarContainer}>
                            <Col span={10} className={styles.avatar}>
                                {avatar || landing.avatar ? (
                                    <img alt="course-avatar" className={styles.img} src={avatar || landing.avatar} />
                                ) : (
                                    <div className={styles.avaImg}>
                                        <Icon type="container" theme="filled" className={styles.icon} />
                                        <div className={styles.text}>Course avatar</div>
                                    </div>
                                )}
                            </Col>
                            <Col span={14} className={styles.upload}>
                                <div className={styles.inlineDiv}>
                                    <div className={styles.intro}>
                                        Make your course stand out with a great image. Important guidelines: 750x422 pixels; .jpg, .jpeg,. gif, or .png. no text on the image.
                                    </div>
                                    <div>
                                        <Upload {...avatarProps}>
                                            {!avatar ? (
                                                <Button className={styles.upBtn} type="primary">
                                                    <Icon type={uploadLoading ? "loading" : "upload"} /> {landing.avatar ? 'Change avatar' : 'Upload avatar'}
                                                </Button>
                                            ) : (
                                                <Button className={styles.upBtn} onClick={handleSetAvatar} type="primary">
                                                    <Icon type={avatarLoading ? "loading" : "check"} /> Set avatar
                                                </Button>
                                            )}
                                        </Upload>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    )}
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.title}>
                    Promotional video
                </div>
                <div className={styles.main}>
                    Sorry, this function is not available.
                </div>
            </div>
            <Modal
                className={styles.cropImageModal}
                title={<div className={styles.title}>Crop course avatar</div>}
                width={900}
                maskClosable={false}
                visible={cropVisible}
                onOk={handleCrop}
                onCancel={handleCloseCropModal}
                okText="Crop"
                bodyStyle={{
                    padding: '0'
                }}
                
            >
                <Cropper
                    ref={cropper}
                    src={originImg}
                    style={{ height: 450, width: '100%' }}
                    aspectRatio={750 / 422}
                    background={false}
                />
            </Modal>
        </div>
    )
};

export default Form.create()(connect(
    ({ settings, course, loading }) => ({
        areasMenu: settings.areasMenu,
        landing: course.landing,
        loading: !!loading.effects['course/fetchLanding'],
        basicLoading: !!loading.effects['course/changeBasicInfo'],
        avatarLoading: !!loading.effects['course/changeAvatar']
    })
)(Landing));