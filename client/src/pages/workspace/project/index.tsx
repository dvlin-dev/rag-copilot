import { fetcher } from '@/utils/http';
import {
  IllustrationNoContent,
  IllustrationNoContentDark,
} from '@douyinfe/semi-illustrations';
import {
  Button,
  Card,
  CardGroup,
  Empty,
  Form,
  Input,
  Modal,
  Typography,
} from '@douyinfe/semi-ui';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import styles from './index.module.scss';
import { useState } from 'react';
import { NoticeSuccess, ToastWaring } from '@/utils/common';
import { createProjectApi } from '@/api/project';

const Project = () => {
  const { Text } = Typography;
  const { push } = useRouter();
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { data, isLoading, mutate } = useSWR('/project/list', fetcher);
  if (isLoading) return <div>loading...</div>;
  const isEmpty = data.data.length === 0;
  const empty = () => (
    <Empty
      image={<IllustrationNoContent style={{ width: 150, height: 150 }} />}
      darkModeImage={
        <IllustrationNoContentDark style={{ width: 150, height: 150 }} />
      }
      title='无数据'
      description='请先创建项目'
    />
  );

  const createProject = (values) => {
    setConfirmLoading(true);
    createProjectApi(values)
      .then((res) => {
        NoticeSuccess('创建成功');
        setVisible(false);
        mutate();
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  };
  const handleCancel = () => setVisible(false);
  return (
    <div className={styles.projectContainer}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>应用列表</div>
        <Button onClick={() => setVisible(true)}>创建应用</Button>
      </div>
      {isEmpty ? (
        empty()
      ) : (
        <CardGroup spacing={18}>
          {data.data.map((item) => (
            <Card
              key={item.id}
              title={item.name}
              style={{ maxWidth: 360, minWidth: 260 }}
              headerLine={false}
              headerExtraContent={
                <Text
                  link
                  onClick={() =>
                    push(`/workspace/project/workshop?id=${item.id}`)
                  }
                >
                  进入
                </Text>
              }
            >
              {item.description}
            </Card>
          ))}
        </CardGroup>
      )}
      <Modal
        header={null}
        footer={null}
        visible={visible}
        onCancel={handleCancel}
        closeOnEsc
        width={400}
        zIndex={99999}
      >
        <Form
          onSubmit={(values) => createProject(values)}
          style={{
            padding: '20px 10px',
          }}
        >
          {() => (
            <>
              <Form.Input
                field='name'
                label='名称'
                style={{ width: '100%' }}
                placeholder='输入你的邮箱'
                rules={[{ required: true, message: '请输入应用名称' }]}
              ></Form.Input>
              <Form.TextArea
                field='description'
                label='描述'
                style={{ width: '100%' }}
                placeholder='请输入应用描述'
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
                  loading={confirmLoading}
                  style={{
                    width: '100%',
                  }}
                >
                  创建
                </Button>
              </div>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Project;
