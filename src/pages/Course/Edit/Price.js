import React, { useState, useEffect } from 'react';
import { connect }  from 'dva';
import { Select, Button, Form, Row, Col, Alert, Icon } from 'antd';
import styles from './Price.less';

const { Option } = Select;

const Price = ({ dispatch, match, ...props }) => {
    const {
        price,
        loading,
        saveLoading,
        form
    } = props;
    const { getFieldDecorator } = form;
    const { courseId } = match.params;
    const [disabled, setDisabled] = useState(true);
    useEffect(() => {
        dispatch({
            type: 'course/fetchPrice',
            payload: courseId
        });
        return () => dispatch({ type: 'course/resetPrice' });
    }, [courseId]);
    const handleSave = () => {
        setDisabled(true);
        const currentPrice = form.getFieldValue('price');
        dispatch({
            type: 'course/changePrice',
            payload: {
                courseId,
                value: currentPrice
            }
        });
    };
    return (
        <div className={styles.price}>
            <div className={styles.text}>
                <Alert
                    message="Please select the price tier for your course below and click 'Save'. The list price that students will see in other currencies is calculated using the price tier matrix, based on the tier that it corresponds to."
                    type="warning"
                    showIcon
                    icon={<Icon type="info-circle" theme="filled" style={{ color: '#fada5e' }} />}
                />
            </div>
            <div className={styles.main}>
                <Form className={styles.form}>
                    <Row gutter={16}>
                        <Col span={4}>
                            <Form.Item>
                                {getFieldDecorator('price', {
                                    initialValue: price || undefined
                                })(
                                    <Select
                                        placeholder="Price"
                                        disabled={loading || !price}
                                        loading={loading || !price}
                                        onChange={() => setDisabled(false)}
                                    >
                                        <Option value="free">Free</Option>
                                        <Option value="tier1">19.99$ (Tier 1)</Option>
                                        <Option value="tier2">24.99$ (Tier 2)</Option>
                                        <Option value="tier3">29.99$ (Tier 3)</Option>
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={20}>
                            <Form.Item>
                                <Button type="primary" onClick={handleSave} disabled={disabled} icon={saveLoading ? "loading" : null} htmlType="button">
                                    Save
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    )
};

export default Form.create()(connect(
    ({ course, loading }) => ({
        price: course.price,
        loading: !!loading.effects['course/fetchPrice'],
        saveLoading: !!loading.effects['course/changePrice']
    })
)(Price));