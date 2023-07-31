import React, { forwardRef, useImperativeHandle, useState } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import styles from './index.module.scss';
import { compress } from '@/utils/compressor';
interface CropperCardProps {
  imageUrl: string;
}

// The ref is used to expose methods to the parent component, so we define a type for it
interface CropperRef {
  upload: () => Promise<unknown> | undefined;
}

const CropperCard = forwardRef<CropperRef, CropperCardProps>((props, ref) => {
  const { imageUrl } = props;
  const [cropper, setCropper] = useState<any>();

  // Expose the method to get cropped data to the parent component
  useImperativeHandle(ref, () => ({
    upload: getCropData,
  }));

  const getCropData = () => {
    if (cropper) {
      return new Promise((resolve) => {
        cropper.getCroppedCanvas().toBlob(async (blob: Blob) => {
          const result = await compress(blob);
          resolve(result);
        });
      });
    }
  };

  return (
    <div className={styles.cropperContainer}>
      <div className={styles.cropperCard}>
        <Cropper
          style={{ height: 300, width: '100%' }}
          src={imageUrl}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          responsive
          autoCropArea={1}
          checkOrientation={false}
          onInitialized={(instance) => {
            setCropper(instance);
          }}
          guides
        />
      </div>
    </div>
  );
});

export default CropperCard;
