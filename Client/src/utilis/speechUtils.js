// client/src/utils/speechUtils.js

export const startListening = (onResult, onEnd) => {
  const recognition = new window.webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    onResult(event.results[0][0].transcript);
  };

  recognition.onend = onEnd;
  recognition.start();
};

export const speakText = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
};
