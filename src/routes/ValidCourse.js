import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import Redirect from 'umi/redirect';
import PageLoading from '@/components/PageLoading';

const ValidCourse = ({ children, dispatch, match }) => {
    const [status, setStatus] = useState('pending');
    const { courseId } = match.params;
    useEffect(() => {
        setStatus('pending');
        dispatch({
            type: 'course/validate',
            payload: {
                courseId,
                onOk: () => setStatus('valid'),
                onInvalidCourse: () => setStatus('invalid-course'),
                onInvalidStudent: () => setStatus('invalid-student')
            }
        })
    }, [courseId]);
    if (status === 'pending') return <PageLoading />;
    if (status === 'valid') return children;
    if (status === 'invalid-course') return <Redirect to="/error/404" />;
    return <Redirect to="/error/403" />;
};

export default connect()(ValidCourse);