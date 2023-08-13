import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { generateHash } from './generateHash';

export function getDeviceAndOSInfo() {
  const userAgent = navigator.userAgent;

  // 设备型号和操作系统信息
  let device = 'unknown';
  let os = 'unknown';
  let browser = 'unknown';

  // 获取操作系统信息
  if (userAgent.indexOf('Windows') !== -1) {
    os = 'Windows';
  } else if (userAgent.indexOf('Mac') !== -1) {
    os = 'MacOS';
  } else if (userAgent.indexOf('Linux') !== -1) {
    os = 'Linux';
  } else if (userAgent.indexOf('Android') !== -1) {
    os = 'Android';
  } else if (userAgent.indexOf('iPhone') !== -1) {
    os = 'iOS';
  }

  const mobileDeviceRegex = /iPhone|iPad|iPod|Android/;
  const matchedMobileDevice = userAgent.match(mobileDeviceRegex);

  if (matchedMobileDevice) {
    device = matchedMobileDevice[0];
  } else if (os === 'Windows' || os === 'MacOS' || os === 'Linux') {
    device = 'Desktop';
  }

  // 获取浏览器类型信息
  if (userAgent.indexOf('Chrome') !== -1) {
    browser = 'Chrome';
  } else if (userAgent.indexOf('Safari') !== -1) {
    browser = 'Safari';
  } else if (userAgent.indexOf('Firefox') !== -1) {
    browser = 'Firefox';
  } else if (
    userAgent.indexOf('MSIE') !== -1 ||
    userAgent.indexOf('Trident') !== -1
  ) {
    browser = 'Internet Explorer';
  } else if (userAgent.indexOf('Edge') !== -1) {
    browser = 'Edge';
  } else if (
    userAgent.indexOf('Opera') !== -1 ||
    userAgent.indexOf('OPR') !== -1
  ) {
    browser = 'Opera';
  }

  return { device, os, browser };
}

export const generateDeviceInfo = (
  mark: string
): Promise<{ device_id: string; device_type: string }> => {
  return new Promise((resolve, reject) => {
    return FingerprintJS.load()
      .then((fp) => fp.get())
      .then((result) => {
        const visitorId = result.visitorId;
        const device_id = generateHash({ visitorId, mark });
        setDeviceId(device_id);
        const { os, device, browser } = getDeviceAndOSInfo();
        resolve({
          device_id,
          device_type: `${device}:${os}:${browser}`,
        });
      })
      .catch(reject);
  });
};

export function setDeviceId(device_id: string) {
  localStorage.setItem('devlink_deviceId', device_id);
}

export const getDeviceId = () => localStorage.getItem('devlink_deviceId');
