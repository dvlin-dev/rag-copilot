import {
  AudioConfig,
  SpeakerAudioDestination,
  SpeechConfig,
  SpeechSynthesizer,
} from 'microsoft-cognitiveservices-speech-sdk';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

type AutoPlay = '0' | '1';
export type TTSRate = 'x-slow' | 'slow' | 'medium' | 'fast' | 'x-fast';

const TTS_KEY = process.env.NEXT_PUBLIC_AZURE_KEY || '';
const TTS_REGION = process.env.NEXT_PUBLIC_REGION || '';
const PROXY_URL = process.env.NEXT_PUBLIC_PROXY_URL || '';

interface TTSStore {
  voice: string;
  voices: any[];
  rate: TTSRate;
  autoPlay: AutoPlay;
  player: SpeakerAudioDestination | null;
  config: SpeechConfig | null;
  synth: SpeechSynthesizer | null;

  updateVoice: (voice: string) => void;
  updateVoices: (voices: string[]) => void;
  updateRate: (rate: TTSRate) => void;
  updateAutoPlay: (autoPlay: AutoPlay) => void;
  speak: (content: string, cb?: () => void) => void;
  pause: () => void;
}

export const useTTSStore = createWithEqualityFn<TTSStore>(
  (set) => ({
    voice: 'zh-CN-XiaochenNeural',
    voices: [],
    rate: 'medium',
    autoPlay: '0',
    player: null,
    config: null,
    synth: null,

    updateVoice: (voice) => {
      localStorage.setItem('voice', voice);
      set({ voice });
    },
    updateVoices: (voices) => {
      localStorage.setItem('voices', JSON.stringify(voices));
      set({ voices });
    },
    updateRate: (rate) => {
      localStorage.setItem('voiceRate', rate);
      set({ rate });
    },
    updateAutoPlay: (autoPlay) => {
      localStorage.setItem('autoPlay', autoPlay);
      set({ autoPlay });
    },
    pause: () => {
      set((state) => {
        state.player?.pause();
        return {};
      });
    },
    speak: (content, cb) => {
      return new Promise((resolve, reject) => {
        set((state) => {
          try {
            state.player?.pause();
            const player = new SpeakerAudioDestination();
            set({ player });

            const audioConfig = AudioConfig.fromSpeakerOutput(player);
            let config: SpeechConfig | null = state.config;
            // config?.setProxy('https://proxy.devlink.wiki/', 443);
            if (!config) {
              config = SpeechConfig.fromSubscription(TTS_KEY, TTS_REGION);
              config.setProxy(PROXY_URL, 443);
              set({ config });
            }

            const synthesizer = new SpeechSynthesizer(config, audioConfig);
            const ssml = `
            <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
              <voice name="${state.voice}">
                <prosody rate="${state.rate}">
                  ${content}
                </prosody>
              </voice>
            </speak>
          `;

            synthesizer.speakSsmlAsync(ssml, (res: any) => {
              resolve(res);
              synthesizer?.close();
            });

            player.onAudioEnd = () => {
              cb?.();
            };
          } catch (error) {
            reject(error);
          }
          return {};
        });
      });
    },
  }),
  shallow
);
