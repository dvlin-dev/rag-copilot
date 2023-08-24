import EditorCard from '@/components/EditorCard';
import { ProjectSettingConfig } from '../../config';
import useUserStore from '@/store/user';
import useSWR from 'swr';
import styles from './index.module.scss';
import { DocCard } from './DocCard';
import { Button } from '@douyinfe/semi-ui';
import SelectDocModal from './SelectDocModal';
import { useState } from 'react';
import { fetcher } from '@/utils/http';
import { useRouter } from 'next/router';
import { updateProjectApi } from '@/api/project';
import { ToastError, ToastSuccess } from '@/utils/common';

const ProjectDocSetting = () => {
  const [docModalVisible, setDocModalVisible] = useState(false);
  const [docConfirmLoading, setDocConfirmLoading] = useState(false);
  const config = ProjectSettingConfig.doc;
  const { query } = useRouter();
  const { data, isLoading } = useSWR(`/project/${query.id}/detail`, fetcher);
  if (isLoading) return <div>loading...</div>;
  const docHandleOk = (checkedList) => {
    const projectId = query.id;
    if (typeof projectId !== 'string') return;
    updateProjectApi({ docIds: checkedList, id: projectId })
      .then(() => {
        ToastSuccess('更新成功');
        setDocModalVisible(false);
      })
      .catch(() => {
        ToastError('更新失败');
      });
  };
  const docHandleCancel = () => {
    setDocModalVisible(false);
  };
  const successHandle = (url) => {
    return new Promise((resolve, reject) => {});
  };
  const getFooter = () => {
    return (
      <div className={styles.projectDocSettingfooter}>
        <Button onClick={() => setDocModalVisible(true)}>选择</Button>
      </div>
    );
  };
  return (
    <EditorCard
      title={config.title}
      type='customDefinition'
      description={config.description}
      tips={config.tips}
      footer={getFooter()}
    >
      <div className={styles.container}>
        {data.docs.map((item) => (
          <DocCard doc={item} key={item.id} />
        ))}
      </div>
      <SelectDocModal
        visible={docModalVisible}
        docs={data.docs}
        onOk={docHandleOk}
        onCancel={docHandleCancel}
        confirmLoading={docConfirmLoading}
      />
    </EditorCard>
  );
};
export default ProjectDocSetting;
