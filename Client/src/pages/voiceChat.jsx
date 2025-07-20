import React, { useState, useRef } from 'react';
import styles from './VoiceChat.module.css';

const VoiceChat = ({ onSend, setIsListening }) => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech recognition not supported in this browser.");

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      onSend(voiceText);
    };

    recognition.onerror = (event) => {
      console.error('Voice recognition error:', event);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
    setIsListening(true);

    recognition.onend = () => {
      setListening(false);
      setIsListening(false);
    };
  };

  return (
    <button onClick={startListening} className={styles.voiceButton}>
      🎤 {listening ? 'Listening...' : 'Speak'}
    </button>
  );
};

export default VoiceChat;
