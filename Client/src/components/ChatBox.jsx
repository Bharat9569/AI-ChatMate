import React from 'react';
import styles from './chatBox.module.css';

const ChatBox = ({ messages }) => {
  return (
    <div className={styles.chatBox}>
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`${styles.messageBubble} ${
            msg.sender === 'user' ? styles.user : styles.bot
          }`}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
};

export default ChatBox;
