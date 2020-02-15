import React from 'react';
import { Result } from 'antd';

const Exception500 = () => {
    return (
        <Result
            status="500"
            title="500"
            subTitle="Sorry, the server is wrong."
        />
    )
};

export default Exception500;