import React, { useState, useEffect } from 'react';

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const WordCloud = ({ slides, tags }) => {
  const [positions, setPositions] = useState([]);

  const titleFrequency = tags.reduce((acc, tag) => {
    tag.titles.forEach(title => {
      acc[title] = (acc[title] || 0) + 1;
    });
    return acc;
  }, {});

  const totalTags = tags.reduce((acc, tag) => acc + tag.titles.length, 0);

  const entries = Object.entries(titleFrequency);
  shuffleArray(entries);

  useEffect(() => {
    const newPositions = [];

    const generateRandomPosition = (fontSize) => {
      const containerWidth = 100 * window.innerWidth / 100;
      const containerHeight = 80 * window.innerHeight / 100;
      const maxX = containerWidth - fontSize; 
      const maxY = containerHeight - fontSize; 

      const randomX = Math.random() * maxX;
      const randomY = Math.random() * maxY;
      return { x: randomX, y: randomY };
    };

    const checkOverlap = (x, y, fontSize) => {
      return newPositions.some(pos => {
        const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
        return distance < fontSize * 1.5; 
      });
    };

    entries.forEach(([title, frequency]) => {
      const fontSize = Math.max(1, (frequency / totalTags) * 25);
      let position = generateRandomPosition(fontSize);

  
      while (checkOverlap(position.x, position.y, fontSize)) {
        position = generateRandomPosition(fontSize);
      }

      newPositions.push(position);
    });

    setPositions(newPositions);
  }, [totalTags]);

  return (
    <div style={{
      width: '100vw',
      height: '80vh',
      position: 'relative', 
      overflow: 'hidden', 
    }}>
        {entries.length === 0 ? (
<div>
<h1> Need tags to create a word cloud. </h1>
</div>

        ): ("" )}
      {entries.map(([title, frequency], index) => {
        const randomColor = getRandomColor();
        const fontSize = `${Math.max(1, (frequency / totalTags) * 25)}vh`;
        const { x, y } = positions[index] || { x: 0, y: 0 };

        return (
          <div
            key={title}
            style={{
              position: 'absolute',
              color: randomColor,
              fontSize: fontSize,
              top: `${y}px`,
              left: `${x}px`,
              wordWrap: 'break-word',
              zIndex: 1, 
            }}
          >
            {title}
          </div>
        );
      })}
    </div>
  );
};

export default WordCloud;
