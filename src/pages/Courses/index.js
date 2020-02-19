import React, { useState } from 'react';
import { Select, Button, Icon, Input, Table } from 'antd';
import styles from './index.less';

const { Option } = Select;
const { Search } = Input;

const Courses = () => {
    const [searchWidth, setSearchWidth] = useState('200px');
    return (
        <div className={styles.courses}>
            <div className={styles.actions}>
                <Button type="primary" icon="plus">New course</Button>
                <div className={styles.filters}>
                    <Search 
                        className={styles.search}
                        placeholder="Find course"
                        size="large"
                        style={{ width: searchWidth }}
                        onSearch={() => {}}
                        onFocus={() => setSearchWidth('280px')}
                        onBlur={() => setSearchWidth('200px')}
                    />
                    <Select
                        className={styles.sortBy}
                        size="large" 
                        defaultValue="newest"
                        dropdownMatchSelectWidth={false}
                    >
                        <Option value="newest">Newest</Option>
                        <Option value="oldest">Oldest</Option>
                        <Option value="a-z">Alphabet A - Z</Option>
                        <Option value="z-a">Alphabet Z - A</Option>
                    </Select>
                </div>
            </div>
            <div className={styles.main}>
                
            </div>
        </div>
    );
};

export default Courses;