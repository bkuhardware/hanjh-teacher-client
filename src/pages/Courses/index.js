import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import Link from 'umi/Link';
import { connect } from 'dva';
import { Select, Button, Icon, Input, Progress as ProgressBar, Table, Spin, Divider } from 'antd';
import { fromNow } from '@/utils/utils';
import styles from './index.less';

const { Option } = Select;
const { Search } = Input;

const Privacy = ({ value }) => {
    let text;
    let className = null;
    switch(value) {
        case 'public':
            text = 'Public';
            break;
        case 'private':
            text = 'Private';
            break;
        default:
            className = styles.draft
            text = 'DRAFT (private)';
    };
    return (<span className={className}>{text}</span>);
};

const Progress = ({ value }) => {
    if (value === 100)
        return <Icon type="check-circle" theme="filled" style={{ fontSize: '1.2em', background: '#52c41a' }}/>;
    return <ProgressBar
        strokeColor={{
            '0%': 'white',
            '100%': 'lightgray'
        }}
        percent={value}
    />;
};

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: '40%'
    },
    {
        title: 'Privacy',
        dataIndex: 'privacy',
        key: 'privacy',
        width: '15%',
        render: val => <Privacy value={val} />
    },
    {
        title: 'Progress',
        dataIndex: 'progress',
        key: 'progress',
        width: '15%',
        render: val => <Progress value={val} />
    },
    {
        title: 'Last updated',
        dataIndex: 'updatedAt',
        key: 'lastUpdated',
        width: '15%',
        render: val => <span className={styles.lastUpdated}>{fromNow(val)}</span>
    },
    {
        title: 'Action',
        key: 'action',
        width: '15%',
        render: () => (
            <span>
                <Link to="/">Edit content</Link>
                <Divider type="vertical" />
                <Link to="/">Manage</Link>
            </span>
        )
    }
];

const Courses = ({ dispatch, ...props }) => {
    const [searchWidth, setSearchWidth] = useState('200px');
    const {
        courses,
        hasMore,
        sortBy,
        initLoading,
        loading,
        sortLoading
    } = props;
    useEffect(() => {
        dispatch({
            type: 'courses/fetch'
        });
        return () => dispatch({
            type: 'courses/reset'
        });
    }, []);
    const handleSortby = val => {
        dispatch({
            type: 'courses/sort',
            payload: val
        });
    };
    const handleMore = () => {};
    const disabled = !courses || initLoading;
    const loadMore = (
        !initLoading && !loading && hasMore && courses ? (
            <div className={styles.loadMore}>
                <Button size="small" onClick={handleMore}>More courses</Button>
            </div>
        ) : null
    );
    return (
        <div className={styles.courses}>
            <div className={styles.actions}>
                <Button type="primary" icon={disabled ? "loading" : "plus"} disabled={disabled}>New course</Button>
                <div className={styles.filters}>
                    <Search 
                        className={styles.search}
                        placeholder="Find course"
                        size="large"
                        disabled={disabled}
                        style={{ width: searchWidth }}
                        onSearch={() => {}}
                        onFocus={() => setSearchWidth('280px')}
                        onBlur={() => setSearchWidth('200px')}
                    />
                    <Select
                        className={styles.sortBy}
                        disabled={disabled || sortLoading}
                        loading={disabled || sortLoading}
                        size="large" 
                        value={sortBy}
                        dropdownMatchSelectWidth={false}
                        onChange={handleSortby}
                    >
                        <Option value="newest">Newest</Option>
                        <Option value="oldest">Oldest</Option>
                        <Option value="a-z">Alphabet A - Z</Option>
                        <Option value="z-a">Alphabet Z - A</Option>
                    </Select>
                </div>
            </div>
            <div className={styles.main}>
                {!courses || initLoading ? (
                    <div className={styles.loading}>
                        <Spin indicator={<Icon type="loading" spin style={{ fontSize: 64 }} />}/>
                        <div className={styles.text}>Fetching courses...</div>
                    </div>
                ) : (
                    <React.Fragment>
                        <Table
                            columns={columns}
                            rowKey={course => course._id + _.uniqueId('course_')}
                            dataSource={courses}
                        />
                        {loadMore}
                    </React.Fragment>
                )}
            </div>
        </div>
    );
};

export default connect(
    ({ courses, loading }) => ({
        courses: courses.list,
        hasMore: courses.hasMore,
        sortBy: courses.sortBy,
        initLoading: !!loading.effects['courses/fetch'],
        loading: !!loading.effects['courses/more'],
        sortLoading: !!loading.effects['courses/sort']
    })
)(Courses);