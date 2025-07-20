


import React from 'react';
import styles from './MessageBubble.module.css';

const MessageBubble = ({ sender, text }) => {
  const isUser = sender === 'user';
  const bubbleClass = isUser ? styles.user : styles.bot;

  return (
    <div className={`${styles.bubble} ${bubbleClass}`}>
      {text}
    </div>
  );
};

export default MessageBubble;

