import React, { useState, useEffect, useRef } from 'react';
import useAuth from '../hooks/useAuth';
import api from '../services/api';
import ChatBox from '../components/ChatBox';
import VoiceChat from './voiceChat';
import { useNavigate } from 'react-router-dom';
import styles from './ChatPage.module.css';

const ChatPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [speakReply, setSpeakReply] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const messagesEndRef = useRef(null);
  const speechRef = useRef(null);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speakOut = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    speechRef.current = utter;
    window.speechSynthesis.speak(utter);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const sendMessage = async (isVoice = false, voiceText = '') => {
    const messageText = isVoice ? voiceText : input;
    if (!messageText.trim()) return;

    if (!isVoice) {
      const userMessage = { sender: 'user', text: messageText };
      setMessages((prev) => [...prev, userMessage]);
      setInput('');
    }

    try {
      const res = await api.post('/chat/send', { message: messageText });
      const reply = res.data.response;

      if (isVoice) {
        speakOut(reply);
      } else {
        const botMessage = { sender: 'bot', text: reply };
        setMessages((prev) => [...prev, botMessage]);
        if (speakReply) speakOut(reply);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMsg = "Oops! Something went wrong.";
      const fallback = isVoice ? speakOut : (msg) => setMessages((prev) => [...prev, { sender: 'bot', text: msg }]);
      fallback(errorMsg);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  const handleVoiceSend = (text) => {
    sendMessage(true, text);
  };

  // New file upload handlers
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) return alert('Please select a file to upload');
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const res = await api.post('/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      // Add extractedText and aiResponse as bot messages
      if (res.data.extractedText) {
        setMessages((prev) => [...prev, { sender: 'bot', text: `📄 Extracted Text:\n${res.data.extractedText}` }]);
      }
      if (res.data.aiResponse) {
        setMessages((prev) => [...prev, { sender: 'bot', text: `🤖 AI Response:\n${res.data.aiResponse}` }]);
        if (speakReply) speakOut(res.data.aiResponse);
      }

      setFile(null);
      // Clear input value for file input manually since React doesn't control it directly
      document.getElementById('fileInput').value = null;
    } catch (err) {
      console.error('Upload error:', err);
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.chatPage}>
      <main className={styles.main}>
        {messages.length === 0 && (
          <div className={styles.emptyContainer}>
            <p className={styles.emptyMessage}>Start the conversation!</p>
            <hr className={styles.separator} />
          </div>
        )}
        <ChatBox messages={messages} />
        <div ref={messagesEndRef} />
        {isListening && <div className={styles.listeningIndicator}>🎙️ Listening...</div>}
        {isSpeaking && <div className={styles.botSpeaking}>🤖 Bot is speaking...</div>}
      </main>

      <footer className={styles.footer}>
  <input
    id="fileInput"
    type="file"
    accept=".pdf,image/*"
    onChange={handleFileChange}
    style={{ display: 'none' }}
  />

  <div className={styles.inputWrapper}>
    <button
      type="button"
      onClick={() => document.getElementById('fileInput').click()}
      className={styles.plusButton}
      title="Upload file"
    >
      +
    </button>

    <input
      type="text"
      placeholder="Type your message..."
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={handleKeyPress}
      className={styles.textInput}
    />
  </div>

  <button onClick={() => sendMessage()} className={styles.actionButton}>
    Enter
  </button>

  <button
    onClick={handleFileUpload}
    className={styles.actionButton}
    disabled={uploading}
  >
    {uploading ? 'Uploading...' : 'Upload'}
  </button>

  <div className={styles.voiceWrapper}>
    <VoiceChat onSend={handleVoiceSend} setIsListening={setIsListening} />

    <label className={styles.speakLabel}>
      <input
        type="checkbox"
        checked={speakReply}
        onChange={() => setSpeakReply(!speakReply)}
      />
      🗣️
    </label>

    {isSpeaking && (
      <button onClick={stopSpeaking} className={styles.stopButton}>
        ⏹️ Stop
      </button>
    )}
  </div>
</footer>


        </div>
  );
};

export default ChatPage;
