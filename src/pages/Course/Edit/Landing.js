import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { usePrevious } from '@/utils/hooks';
import { Form, Input, Icon, Select, Row, Col } from 'antd';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import Editor from '@/components/Editor/DescriptionEditor';
import { exportToHTML } from '@/utils/editor';
import styles from './Landing.less';

const FormItem = Form.Item;
const { Option } = Select;

const Landing = ({ form, match, dispatch, ...props }) => {
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [description, setDescription] = useState(EditorState.createEmpty());
    const { getFieldDecorator } = form;
    const { courseId } = match.params;
    const {
        areasMenu,
        landing,
        loading
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
            const blocksFromHTML = convertFromHTML(landing.description);
            const description = ContentState.createFromBlockArray(
                blocksFromHTML.contentBlocks,
                blocksFromHTML.entityMap,
            );
            setDescription(EditorState.createWithContent(description));
        }
    }, [landing]);
    const handleChangeArea = val => {
        form.setFieldsValue({
            category: undefined
        });
        setCategoryOpen(true);
    };
    return (
        <div className={styles.landing}>
            <div className={styles.content}>
                <div className={styles.title}>Basic information</div>
                <div className={styles.main}>
                    <Form
                        className={styles.basicInfo}
                    >
                        <FormItem label="Title">
                            {getFieldDecorator('title', {
                                rules: [
                                    {
                                        max: 60,
                                        message: 'Course title must not has more than 60 characters!'
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
                                            <Option key="japanese">Japanese</Option>
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
                                            _.map(_.find(areasMenu, area => area._id === form.getFieldValue('area')).children, category => (
                                                <Option key={category._id}>{category.title}</Option>
                                            ))}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.title}>
                    Course avatar
                </div>
                <div className={styles.main}>

                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.title}>
                    Promotionial video
                </div>
                <div className={styles.main}>
                    
                </div>
            </div>
        </div>
    )
};

export default Form.create()(connect(
    ({ settings, course, loading }) => ({
        areasMenu: settings.areasMenu,
        landing: course.landing,
        loading: !!loading.effects['course/fetchLanding']
    })
)(Landing));