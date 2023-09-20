import useSWR from 'swr';
import { IconDelete, IconMore } from '@douyinfe/semi-icons';
import {
  Button,
  Empty,
  Form,
  Modal,
  Popconfirm,
  Space,
  Table,
  Typography,
} from '@douyinfe/semi-ui';
import { fetcher } from '@/utils/http';
import { useState } from 'react';
import moment from 'moment';
import CustomAvatar from '@/components/CustomAvatar';
import { useRouter } from 'next/router';
import {
  IllustrationNoContent,
  IllustrationNoContentDark,
} from '@douyinfe/semi-illustrations';
import { ToastError, ToastSuccess } from '@/utils/common';
import { deleteVector, updateVector } from '@/api/vector';

moment.locale('zh-cn');
const { Text } = Typography;

const Data = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<User>();
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [vectorDetail, setVectorDetail] = useState<Vector>();
  const { query } = useRouter();
  const { data, isLoading, error, mutate } = useSWR(
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
    // {
    //   title: '来源',
    //   dataIndex: 'source',
    //   render: (text, record, index) => {
    //     return <div>{text}</div>;
    //   },
    // },
    {
      title: '操作',
      dataIndex: 'id',
      render: (id, record, index) => {
        return (
          <Space>
            <Button onClick={() => updateVectorOpenModal(record)}>更新</Button>
            <Popconfirm
              title='确定要删除该数据吗'
              onConfirm={() => handleDeleteVector(id)}
            >
              <Button
                style={{ color: '#f82c70' }}
                icon={<IconDelete />}
              ></Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const handleDeleteVector = (id: string) => {
    return new Promise((resolve, reject) => {
      deleteVector(id)
        .then(() => {
          ToastSuccess('删除成功');
          resolve(null);
          mutate();
        })
        .catch(() => {
          ToastError('删除失败');
          reject();
        });
    });
  };

  const rowSelection = {
    onChange: (_, selectedRows) => {
      setSelectedRowKeys(selectedRows);
    },
  };

  const updateVectorOpenModal = (record) => {
    setVectorDetail(record);
    setUpdateVisible(true);
  };

  const updateVectorHandle = (values) => {
    setUpdateLoading(true);
    const data = {
      id: vectorDetail?.id,
      ...values,
    };
    updateVector(data)
      .then(() => {
        mutate();
        ToastSuccess('更新成功');
      })
      .catch(() => {
        ToastError('更新失败');
      })
      .finally(() => {
        setUpdateVisible(false);
        setUpdateLoading(false);
      });
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowSelection={rowSelection}
        pagination={data.length > 10 ? { pageSize: 10 } : false}
        rowKey={(record) => record.id}
      />
      <Modal
        header={null}
        footer={null}
        visible={updateVisible}
        onCancel={() => setUpdateVisible(false)}
        closeOnEsc
        width={400}
        zIndex={99999}
      >
        <Form
          onSubmit={(values) => updateVectorHandle(values)}
          style={{
            padding: '20px 10px',
          }}
        >
          {() => (
            <>
              <Form.TextArea
                field='content'
                label='内容'
                initValue={vectorDetail?.content}
                style={{ width: '100%' }}
                placeholder='请输入内容'
                rules={[{ required: true, message: '请输入内容' }]}
              ></Form.TextArea>
              <div
                style={{
                  width: '70%',
                  margin: '0 auto',
                  marginTop: 20,
                }}
              >
                <Button
                  htmlType='submit'
                  type='primary'
                  theme='solid'
                  loading={updateLoading}
                  style={{
                    width: '100%',
                  }}
                >
                  更新
                </Button>
              </div>
            </>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default Data;
