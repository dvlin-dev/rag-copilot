import useSWR from 'swr';
import { IconDelete, IconMore } from '@douyinfe/semi-icons';
import { Button, Empty, Table, Typography } from '@douyinfe/semi-ui';
import { fetcher } from '@/utils/http';
import { useState } from 'react';
import moment from 'moment';
import CustomAvatar from '@/components/CustomAvatar';
import { useRouter } from 'next/router';
import {
  IllustrationNoContent,
  IllustrationNoContentDark,
} from '@douyinfe/semi-illustrations';

moment.locale('zh-cn');
const { Text } = Typography;

const Data = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<User>();
  const { query } = useRouter();
  const { data, isLoading, error } = useSWR(
    `/vector/${query.id}/list`,
    fetcher
  );
  if (isLoading) return <div>数据列表获取中...</div>;
  if (error) return <div>数据列表获取失败</div>;
  if (data.length === 0)
    return (
      <Empty
        image={<IllustrationNoContent style={{ width: 150, height: 150 }} />}
        darkModeImage={
          <IllustrationNoContentDark style={{ width: 150, height: 150 }} />
        }
        title='无数据'
        description='请先导入数据'
      />
    );
  const columns = [
    {
      title: '内容',
      width: 400,
      dataIndex: 'content',
      render: (text, record, index) => {
        return (
          <Text ellipsis={{ showTooltip: true }} style={{ width: 400 }}>
            {text}
          </Text>
        );
      },
    },
    {
      title: '来源',
      dataIndex: 'source',
      render: (text, record, index) => {
        return <div>{text}</div>;
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
      dataSource={data}
      rowSelection={rowSelection}
      pagination={data.length > 10 ? { pageSize: 10 } : false}
      rowKey={(record) => record.id}
    />
  );
};

export default Data;
