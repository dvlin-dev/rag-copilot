import useSWR from 'swr';
import { IconDelete, IconMore } from '@douyinfe/semi-icons';
import { Button, Table } from '@douyinfe/semi-ui';
import { fetcher } from '@/utils/http';
import moment from 'moment';

import styles from './index.module.scss';
import clsx from 'clsx';
import { useState } from 'react';

moment.locale('zh-cn');

const DeviceMange = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { data, isLoading, error } = useSWR('/auth/get_user_devices', fetcher);
  if (isLoading) return <div>设备信息获取中...</div>;
  if (error) return <div>设备信息获取失败</div>;
  const columns = [
    {
      title: '客户端',
      dataIndex: 'deviceType',
      render: (text, record, index) => {
        return <div>{text}</div>;
      },
    },
    {
      title: 'ip',
      dataIndex: 'clientIp',
      render: (text, record, index) => {
        return <div>{text === '' ? '未知' : text}</div>;
      },
    },
    {
      title: '最后登录时间',
      dataIndex: 'lastLoginAt',
      render: (text, record, index) => {
        return <div> {moment(text).startOf('hour').fromNow()}</div>;
      },
    },
    {
      title: '',
      dataIndex: 'operate',
      render: (text, record, index) => {
        return <Button className={styles.error} icon={<IconDelete />}></Button>;
      },
    },
  ];
  const rowSelection = {
    onChange: (_, selectedRows) => {
      console.log('selectedRows: ', selectedRows);
      setSelectedRowKeys(selectedRows);
    },
  };

  return (
    <div className={styles.deviceMange}>
      <div className={styles.deviceMangeTitle}>设备管理</div>
      <div className={styles.deviceMangeTable}>
        <div className={styles.deviceMangeHeader}>
          <Button
            className={clsx(styles.error, {
              [styles.disabled]: selectedRowKeys.length === 0,
            })}
            disabled
            icon={<IconDelete />}
          ></Button>
        </div>
        <Table
          columns={columns}
          dataSource={data.devices}
          rowSelection={rowSelection}
          pagination={false}
          rowKey={(record) => record.id}
        />
      </div>
    </div>
  );
};

export default DeviceMange;
