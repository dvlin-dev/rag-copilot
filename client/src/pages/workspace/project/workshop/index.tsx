import useSWR from 'swr';
import { Button, Form, Select, Typography } from '@douyinfe/semi-ui';
import styles from './index.module.scss';
import { useEffect, useState } from 'react';
import PromptSetting from '@/components/ProjectSettingComps/components/PromptSetting';
import ProjectDocSetting from '@/components/ProjectSettingComps/components/ProjectDocSetting';
import Chat from '@/components/Chat';
import { useRouter } from 'next/router';
import { fetcher } from '@/utils/http';
import { handleCopy } from '@/utils/common';
import { IconCopy } from '@douyinfe/semi-icons';

const WorkShop = () => {
  const { Paragraph, Text, Numeral } = Typography;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { query } = useRouter();
  const projectId = query.id as string;
  const changeSetting = (values) => {};

  const { data, isLoading, mutate } = useSWR(
    `/project/${projectId}/detail`,
    fetcher
  );
  if (isLoading || !projectId) return <div>loading...</div>;
  const prompt = data?.projectDetail?.prompt;
  const docs = data?.docs || [];
  return (
    <div className={styles.workShopContainer}>
      <div className={styles.chatContainer}>
        <Chat projectId={projectId} />
      </div>
      <div className={styles.setting}>
        <div className={styles.header}>
          <div className={styles.title}>应用配置</div>
        </div>
        <div className={styles.item}>
          <div className={styles.title}>ID</div>
          <div className={styles.content}>
            <div className={styles.idContainer}>{projectId}</div>
            <Button
              size='small'
              icon={<IconCopy />}
              onClick={() => handleCopy(projectId)}
            />
          </div>
        </div>

        <Select defaultValue={'gpt3.5'} disabled>
          <Select.Option value='gpt3.5'>gpt3.5</Select.Option>
          <Select.Option value='gpt4'>gpt4</Select.Option>
        </Select>
        <ProjectDocSetting docs={docs} />
        <PromptSetting projectId={projectId} prompt={prompt} />
      </div>
    </div>
  );
};

export default WorkShop;
