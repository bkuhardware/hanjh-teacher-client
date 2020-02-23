import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Form, Input, Icon, Select, Row, Col } from 'antd';
import styles from './Landing.less';

const FormItem = Form.Item;
const { Option } = Select;

const Landing = ({ form, dispatch, ...props }) => {
    const { getFieldDecorator } = form;
    const {
        areasMenu
    } = props;
    return (
        <div className={styles.landing}>
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
                        initialValue: ''
                    })(
                        <Input
                            placeholder="Course title"
                            size="large"
                            addonAfter={(form.getFieldValue('title').length <= 60) ? `${form.getFieldValue('title').length}/60` : <Icon type="exclamation-circle" />}
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
                        initialValue: ''
                    })(
                        <Input
                            placeholder="Course sub title"
                            size="large"
                            addonAfter={(form.getFieldValue('subTitle').length <= 150) ? `${form.getFieldValue('subTitle').length}/150` : <Icon type="exclamation-circle" />}
                        />
                    )}
                </FormItem>
                <Row gutter={24}>
                    <Col span={12}>
                        <FormItem label="Language">
                            {getFieldDecorator('language', {
                                initialValue: undefined
                            })(
                                <Select
                                    size="large"
                                    placeholder="Language"
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
                                initialValue: undefined
                            })(
                                <Select
                                    size="large"
                                    placeholder="Level"
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
                                initialValue: undefined
                            })(
                                <Select
                                    size="large"
                                    placeholder="Area"
                                    loading={!areasMenu}
                                    disabled={!areasMenu}
                                >
                                    {_.map(areasMenu, area => (
                                        <Option key={area._id}>{area.title}</Option>
                                    ))}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="Category">
                            {getFieldDecorator('category', {
                                initialValue: undefined
                            })(
                                <Select
                                    size="large"
                                    placeholder="Category"
                                    loading={!areasMenu}
                                    disabled={!areasMenu}
                                >
                                    
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </div>
    )
};

export default Form.create()(connect(
    ({ settings, course, loading }) => ({
        areasMenu: settings.areasMenu
    })
)(Landing));