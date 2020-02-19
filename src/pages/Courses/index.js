import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import moment from 'moment';
import Link from 'umi/Link';
import { connect } from 'dva';
import { Select, Button, Icon, Input, Progress as ProgressBar, Table, Spin, Divider } from 'antd';
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
        return (
            <span>
                <Icon type="check-circle" theme="filled" style={{ fontSize: '1.2em', color: '#52c41a' }}/>
                <span style={{ marginLeft: '5px' }}>Completed</span>
            </span>
        );;
    return <ProgressBar
        strokeColor={{
            '0%': '#FADA5E',
            '100%': 'yellow'
        }}
        strokeWidth={6}
        percent={value}
    />;
};

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: '40%',
        render: name => <span className={styles.name}>{name}</span>
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
        align: 'center',
        width: '15%',
        render: val => <Progress value={val} />
    },
    {
        title: 'Last updated',
        dataIndex: 'updatedAt',
        key: 'lastUpdated',
        width: '15%',
        align: 'center',
        render: val => <span className={styles.lastUpdated}>{moment(val).format('MM/YYYY')}</span>
    },
    {
        title: 'Action',
        key: 'action',
        width: '15%',
        align: 'center',
        render: () => (
            <span className={styles.action}>
                <Link to="/">Edit content</Link>
                <Divider type="vertical" className={styles.divider} />
                <Link to="/">Manage</Link>
            </span>
        )
    }
];

const Courses = ({ dispatch, ...props }) => {
    const [searchWidth, setSearchWidth] = useState('200px');
    const {
        courses,
        total,
        currentPage,
        sortBy,
        initLoading,
        loading,
        sortLoading,
        pageChangeLoading
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
    const handleChangePage = page => {
        dispatch({
            type: 'courses/page',
            payload: page
        });
    };
    const disabled = !courses || initLoading;
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
                            pagination={total > 8 ? {
                                total: total,
                                pageSize: 8,
                                current: currentPage,
                                onChange: handleChangePage
                            } : false}
                            loading={sortLoading || pageChangeLoading}
                        />
                    </React.Fragment>
                )}
            </div>
        </div>
    );
};

export default connect(
    ({ courses, loading }) => ({
        courses: courses.list,
        sortBy: courses.sortBy,
        total: courses.total,
        currentPage: courses.currentPage,
        initLoading: !!loading.effects['courses/fetch'],
        sortLoading: !!loading.effects['courses/sort'],
        pageChangeLoading: !!loading.effects['courses/page']
    })
)(Courses);