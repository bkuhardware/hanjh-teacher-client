import React, { useEffect } from 'react';
import { connect } from 'dva';

const ForumLayout = ({ match, children, dispatch }) => {
    const { courseId } = match.params;
    useEffect(() => {
        dispatch({
            type: 'manage/fetchQuestions',
            payload: courseId
        });
        dispatch({
            type: 'manage/fetchLectureOpts',
            payload: courseId
        });
        return () => dispatch({
            type: 'manage/resetForum'
        });
    }, [courseId]);
    return children;
};

export default connect()(ForumLayout);