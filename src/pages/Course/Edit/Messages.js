import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Button, Spin, Alert, Icon } from 'antd';
import { EditorState, convertFromHTML, ContentState, message } from 'draft-js';
import { usePrevious } from '@/utils/hooks';
import Editor from '@/components/Editor/SimpleEditor';
import { exportToHTML } from '@/utils/editor';
import styles from './Messages.less';

const Messages = ({ dispatch, match, ...props }) => {
    const { courseId } = match.params;
    const {
        messages,
        loading,
        saveLoading
    } = props;
    const [welcome, setWelcome] = useState({
        value: EditorState.createEmpty(),
        validateStatus: 'success',
        help: ''
    });
    const [congratulation, setCongratulation] = useState({
        value: EditorState.createEmpty(),
        validateStatus: 'success',
        help: ''
    });
    const previousMessages = usePrevious(messages);
    useEffect(() => {
        dispatch({
            type: 'course/fetchMessages',
            payload: courseId
        });
        return () => dispatch({ type: 'course/resetMessages' });
    }, [courseId]);
    useEffect(() => {
        if (!previousMessages && messages) {
            const welcomeContent = getContentStateFromHTML(messages.welcome || '');
            const congratulationContent = getContentStateFromHTML(messages.congratulation || '');
            setWelcome({
                value: EditorState.createWithContent(welcomeContent),
                validateStatus: 'success',
                help: ''
            });
            setCongratulation({
                value: EditorState.createWithContent(congratulationContent),
                validateStatus: 'success',
                help: ''
            });
        }
    }, [courseId, messages]);
    const getContentStateFromHTML = html => {
        const blocksFromHTML = convertFromHTML(html);
        return ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
    };
    const handleChangeWelcome = editorState => {
        const length = editorState.getCurrentContent().getPlainText('').length;
        let status = {
            validateStatus: 'success',
            help: ''
        };
        if (length > 1000) {
            status = {
                validateStatus: 'error',
                help: 'Welcome message must not has more than 1000 characters!'
            };
        }
        setWelcome({
            value: editorState,
            ...status
        });
    };
    const handleChangeCongratulation = editorState => {
        const length = editorState.getCurrentContent().getPlainText('').length;
        let status = {
            validateStatus: 'success',
            help: ''
        };
        if (length > 1000) {
            status = {
                validateStatus: 'error',
                help: 'Congratulation message must not has more than 1000 characters!'
            };
        }
        setCongratulation({
            value: editorState,
            ...status
        });
    };
    const handleSave = () => {
        if (welcome.validateStatus === 'error' || congratulation.validateStatus === 'error') {
            return message.error('Invalid input! Please check again!');
        }
        const welcomeHTML = exportToHTML(welcome.value);
        const congratulationHTML = exportToHTML(congratulation.value);
        dispatch({
            type: 'course/changeMessages',
            payload: {
                courseId,
                welcome: welcomeHTML,
                congratulation: congratulationHTML
            }
        });
    };
    return (
        <div className={styles.messages}>
            <div className={styles.title}>
                <Alert
                    message="Write messages to your students (optional) that will be sent automatically when they join or complete your course to encourage students to engage with course content. If you do not wish to send a welcome or congratulations message, leave the text box blank."
                    type="warning"
                    showIcon
                    icon={<Icon type="info-circle" theme="filled" style={{ color: '#fada5e' }} />}
                />
            </div>
            <div className={styles.main}>
                <Form>
                    <Form.Item label="Welcome message" validateStatus={welcome.validateStatus} help={welcome.help}>
                        <Spin spinning={!messages || loading} tip="Fetching...">
                            <Editor
                                editorState={welcome.value}
                                placeholder="Welcome message"
                                onChange={handleChangeWelcome}
                                maxCount={1000}
                            />
                        </Spin>
                    </Form.Item>
                    <Form.Item label="Congratulation message" validateStatus={congratulation.validateStatus} help={congratulation.help}>
                        <Spin spinning={!messages || loading} tip="Fetching...">
                            <Editor
                                editorState={congratulation.value}
                                placeholder="Congratulation message"
                                onChange={handleChangeCongratulation}
                                maxCount={1000}
                            />
                        </Spin>
                    </Form.Item>
                    <Form.Item style={{ textAlign: 'right' }}>
                        <Button type="primary" htmlType="button" icon={saveLoading ? "loading" : null} onClick={handleSave}>
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
};

export default connect(
    ({ course, loading }) => ({
        messages: course.messages,
        loading: !!loading.effects['course/fetchMessages'],
        saveLoading: !!loading.effects['course/changeMessages']
    })
)(Messages);