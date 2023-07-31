import { FC, useRef, useState, useCallback, useEffect } from 'react';
import { Modal, Button, Avatar } from '@douyinfe/semi-ui';
import { IconCloud, IconCamera } from '@douyinfe/semi-icons';
import CropperCard from './Cropper';
import { UPLOAD_SIZE } from '@/utils/const';
import { isExistHandle, uploadFile } from './utils';
import { blobToHash } from '@/utils/generateHash';

import styles from './index.module.scss';
import { ToastError, ToastSuccess } from '@/utils/common';
import CustomAvatar from '../CustomAvatar';

interface UploadImgProps {
  imageUrl: string;
  username: string;
  id?: number;
  successHandle: (url: string) => Promise<unknown>;
}
export const preUrl = 'https://qiniuyun.devlink.wiki/';
// TODO: 带优化，抽离出物料，第二次无法上传
const UploadImg: FC<UploadImgProps> = ({
  imageUrl,
  successHandle,
  username,
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const inputR = useRef<HTMLInputElement>(null);
  const uploadRef = useRef(null);

  const choiceImg = () => inputR.current?.click();

  const imgChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;
    if (files && files[0].size > UPLOAD_SIZE * 10) {
      // TODO: Show a warning toast
    } else if (files) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(files[0]);
    }
  };

  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('上传图片');

  const showModal = () => {
    setImage(null);
    setUploadUrl(null);
    setVisible(true);
  };

  const handleOk = async () => {
    setModalText('上传中...');
    setConfirmLoading(true);
    //@ts-ignore
    const blob = await uploadRef.current.upload();
    const hash = await blobToHash(blob);
    const fileName = `${hash}.png`;
    const isExistTmp = await isExistHandle(preUrl + fileName);
    if (isExistTmp.isExist) {
      setImage(null);
      setUploadUrl(isExistTmp.url);
      successHandle(isExistTmp.url);
      setConfirmLoading(false);
      setModalText('上传图片');
    } else {
      const url = (await uploadFile(blob, fileName)) as string;
      setImage(null);
      setUploadUrl(url);
      successHandle(url)
        .then(() => {
          ToastSuccess('头像更换成功');
        })
        .catch(() => {
          ToastError('上传失败');
        })
        .finally(() => {
          setVisible(false);
          setConfirmLoading(false);
          setModalText('上传图片');
        });
    }
  };

  const handleCancel = () => setVisible(false);

  const hover = (
    <div className={styles.AvatarHover}>
      <IconCamera size='extra-large' />
    </div>
  );

  return (
    <div>
      <div onClick={showModal}>
        {!!imageUrl ? (
          <Avatar src={uploadUrl || imageUrl} size='large' hoverMask={hover} />
        ) : (
          <CustomAvatar username={username} hoverMask={hover} size='large' />
        )}
      </div>

      <input
        style={{ display: 'none' }}
        type='file'
        ref={inputR}
        name='file'
        id='file'
        onChange={imgChange}
        accept='image/*'
      />
      <Modal
        title={modalText}
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={390}
        zIndex={99999}
      >
        {image ? (
          <CropperCard imageUrl={image} ref={uploadRef} />
        ) : (
          <div
            className={styles.UpButtonContain}
            onClick={choiceImg}
            onKeyDown={choiceImg}
          >
            <IconCloud style={{ fontSize: '26px' }} />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UploadImg;
