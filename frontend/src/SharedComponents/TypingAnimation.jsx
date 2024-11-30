import React, { useState, useEffect } from 'react';

const TypingAnimation = ({ text, interval }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Timer to add one character at a time at the given interval
    const timer = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      } else 
        clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [text, interval, currentIndex]);

  return <p>{displayText}</p>; // Render the progressively typed text
};

export default TypingAnimation;
