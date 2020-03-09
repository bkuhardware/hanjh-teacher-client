import React, { useEffect } from 'react';
import { connect } from 'dva';

const ForumLayout = ({ match, children, dispatch }) => {
    const { courseId } = match.params;
    useEffect(() => {
        dispatch({
            type: 'manage/fetchReviews',
            payload: courseId
        });
        dispatch({
            type: 'manage/fetchPermission',
            payload: {
                courseId,
                type: 'reviews'
            }
        });
        return () => dispatch({ type: 'manage/resetReviews' });
    }, [courseId]);
    return children;
};

export default connect()(ForumLayout);