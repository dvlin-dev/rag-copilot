import useSWR from 'swr';
import { IconDelete, IconMore } from '@douyinfe/semi-icons';
import { Button, Table } from '@douyinfe/semi-ui';
import { fetcher } from '@/utils/http';
import { useState } from 'react';
import { User } from '@/types/user';
import moment from 'moment';
import CustomAvatar from '@/components/CustomAvatar';

moment.locale('zh-cn');

export default function UserPageTable() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<User>();
  const { data, isLoading, error } = useSWR('/user/findall', fetcher);
  if (isLoading) return <div>用户列表获取中...</div>;
  if (error) return <div>用户列表获取失败</div>;

  const columns = [
    {
      title: '头像',
      dataIndex: 'profile.avatar',
      render: (text, record, index) => {
        return (
          <CustomAvatar
            id={record.id}
            src={text}
            username={record.username}
            userLink
          />
        );
      },
    },
    {
      title: '用户名',
      dataIndex: 'username',
      render: (text, record, index) => {
        return <div>{text}</div>;
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      render: (text, record, index) => {
        return <div>{text}</div>;
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
      dataSource={data.data}
      rowSelection={rowSelection}
      pagination
      rowKey={(record) => record.id}
    />
  );
}
