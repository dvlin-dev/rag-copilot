import { TTSRate, useTTSStore } from '../store/tts';

export const useTTSInit = () => {
  const updateVoice = useTTSStore((state) => state.updateVoice);
  const updateVoices = useTTSStore((state) => state.updateVoices);
  const updateRate = useTTSStore((state) => state.updateRate);
  const updateAutoPlay = useTTSStore((state) => state.updateAutoPlay);

  const init = () => {
    const localVoice = localStorage.getItem('voice') || 'zh-CN-XiaochenNeural';
    const localVoices = localStorage.getItem('voices');
    const localRate = localStorage.getItem('voiceRate') || 'medium';
    const localAutoPlay = localStorage.getItem('autoPlay') || '0';

    try {
      updateVoices(localVoices ? JSON.parse(localVoices) : []);
    } catch {
      updateVoices([]);
    }
    updateVoice(localVoice);
    updateRate(localRate as TTSRate);
    if (localAutoPlay !== '0' && localAutoPlay !== '1') {
      updateAutoPlay('0');
    } else {
      updateAutoPlay(localAutoPlay);
    }
  };

  return init;
};
