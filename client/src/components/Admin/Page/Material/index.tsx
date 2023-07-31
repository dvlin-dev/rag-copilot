import useSWR from 'swr';
import { IconDelete, IconMore } from '@douyinfe/semi-icons';
import { Button, Table } from '@douyinfe/semi-ui';
import { fetcher } from '@/utils/http';
import { useState, useMemo } from 'react';
import { User } from '@/types/user';
import moment from 'moment';
import Avatar from '@/components/CustomAvatar';

moment.locale('zh-cn');

export default function MaterialPageTable() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<User>();
  const { data, isLoading, error } = useSWR('/material', fetcher);

  if (isLoading) return <div>用户列表获取中...</div>;
  if (error) return <div>用户列表获取失败</div>;

  const columns = [
    {
      title: '物料名',
      dataIndex: 'name',
      render: (text, record, index) => {
        return <div>{text}</div>;
      },
    },
    {
      title: 'npm 包名',
      dataIndex: 'npmName',
      render: (text, record, index) => {
        return <div>{text}</div>;
      },
    },
    {
      title: '版本号',
      dataIndex: 'version',
      render: (text, record, index) => {
        return <div>{text}</div>;
      },
    },
    {
      title: '最后更新时间',
      dataIndex: 'lastLoginAt',
      render: (text, record, index) => {
        return <div> {moment(text).startOf('hour').fromNow()}</div>;
      },
    },
    {
      title: '',
      dataIndex: 'operate',
      render: (text, record, index) => {
        return <Button icon={<IconMore />}></Button>;
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
    <Table
      columns={columns}
      dataSource={data.materials}
      rowSelection={rowSelection}
      rowKey={(record) => record.id}
      pagination
    />
  );
}
