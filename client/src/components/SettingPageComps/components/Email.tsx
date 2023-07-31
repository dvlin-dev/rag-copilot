import EditorCard from '@/components/EditorCard';
import { settingConfig } from '../config';
import { useEffect, useState } from 'react';
import useUserStore from '@/store/user';
import { updateUserInfo } from '@/api/user';

const EmailSettingCard = () => {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExternallyDisabled, setIsExternallyDisabled] = useState(false);
  const config = settingConfig.email;

  const { user, setUser } = useUserStore();

  const initialValue = user?.email || '';

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
    updateUserInfo({ email: inputValue })
      .then((res) => {
        setUser(res.data);
        setInputValue(res.data.email);
        setIsExternallyDisabled(true);
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
      placeholder='请输入邮箱'
      initialValue={initialValue}
      value={inputValue}
      onInputChange={handleInputChange}
      onSave={handleSave}
      loading={loading}
      isExternallyDisabled={isExternallyDisabled}
    />
  );
};
export default EmailSettingCard;
