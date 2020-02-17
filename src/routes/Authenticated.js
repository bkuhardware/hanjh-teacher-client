import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import withRouter from 'umi/withRouter';
import Redirect from 'umi/redirect';
import PageLoading from '@/components/PageLoading';
import FinishInfo from '@/components/FinishInfo';
import storage from '@/utils/storage';

const Authenticated = ({ user, children, location, dispatch }) => {
    const [status, setStatus] = useState('pending');
    useEffect(() => {
        if (user) setStatus('authenticated');
        else {
            const token = storage.getToken();
            if (token)
                dispatch({
                    type: 'user/fetch',
                    payload: {
                        callback: () => setStatus('authenticated')
                    }
                })
            else setStatus('not-authenticated');
        }
    }, []);
    const check = user => {
        return false;
    };
    if (status === 'pending') return <PageLoading />;
    if (status === 'not-authenticated') 
        return (
            <Redirect
                to={{
                    pathname: '/user/login',
                    state: {
                        from: location.pathname
                    }
                }}
            />
        );
    if (check(user)) return children;
    return <FinishInfo />;
};

export default withRouter(connect(({ user }) => ({ user }))(Authenticated));