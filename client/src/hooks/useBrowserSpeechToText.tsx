import React, { useEffect, useRef, useState } from 'react';

import { ToastError } from '../utils/common';

interface BrowserSpeechToTextProps {
  language: SupportedLanguages;
}

export enum SupportedLanguages {
  'zh-CN' = 'zh-CN',
  'en-US' = 'en-US',
}

const SpeechRecognition =
  ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) &&
  ((window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition);

const globalRecognition = SpeechRecognition ? new SpeechRecognition() : null;

const useBrowserSpeechToText = ({ language }: BrowserSpeechToTextProps) => {
  // @ts-ignore
  const recognition = useRef<SpeechRecognition>(globalRecognition);
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (recognition) {
      recognition.current.interimResults = true;
      recognition.current.continuous = true;
      recognition.current.lang = language;

      // @ts-ignore
      recognition.current.onresult = (event: SpeechRecognitionEvent) => {
        let currentTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const text = result[0].transcript;

          if (result.isFinal) {
            setTranscript(text);
            // setIsListening(false);
          } else {
            currentTranscript += text;
          }
        }
      };

      // @ts-ignore
      recognition.current.onerror = (event: SpeechRecognitionError) => {
        console.log('Error:', event.error);
        ToastError(event.error);
        setIsListening(false);
      };
    } else {
      console.log('SpeechRecognition API is not supported in this browser');
      ToastError('SpeechRecognition API is not supported in this browser');
    }

    return () => {
      if (recognition) {
        recognition.current.stop();
      }
    };
  }, [isListening, language, recognition]);

  useEffect(() => {
    if (isListening) {
      if (recognition) {
        recognition.current.start();
      }
    } else {
      if (recognition) {
        recognition.current.stop();
      }
    }
  }, [isListening]);

  return {
    transcript,
    isListening,
    setIsListening,
  };
};

export default useBrowserSpeechToText;
