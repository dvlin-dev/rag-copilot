import EditorCard from '@/components/EditorCard';
import { ProjectSettingConfig } from '../config';
import { FC, useState } from 'react';
import useUserStore from '@/store/user';
import { updateProject } from '@/api/project';
import useSWR from 'swr';
import { fetcher } from '@/utils/http';
import { ToastSuccess } from '@/utils/common';

interface PromptSettingProps {
  projectId: string;
  prompt: string;
}

const PromptSetting: FC<PromptSettingProps> = ({ projectId, prompt }) => {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExternallyDisabled, setIsExternallyDisabled] = useState(false);
  const config = ProjectSettingConfig.prompt;
  const initialValue = prompt || '';

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (value === initialValue) {
      setIsExternallyDisabled(true);
    } else {
      setIsExternallyDisabled(false);
    }
  };

  const handleSave = () => {
    setLoading(true);
    updateProject({ prompt: inputValue, id: projectId })
      .then((res) => {
        setInputValue(res.data.projectDetail.prompt);
        setIsExternallyDisabled(true);
        ToastSuccess('修改成功');
      })
      .catch((err) => err)
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <EditorCard
      title={config.title}
      type='input'
      tips={config.tips}
      placeholder='请输入你的描述'
      initialValue={initialValue}
      value={inputValue}
      onInputChange={handleInputChange}
      onSave={handleSave}
      loading={loading}
      isExternallyDisabled={isExternallyDisabled}
    />
  );
};
export default PromptSetting;
