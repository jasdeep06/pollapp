import React, { useEffect, useState } from 'react';

import { Image } from 'react-native';

const DynamicImage = ({ imageName }) => {
  const [source, setSource] = useState(null);

  useEffect(() => {
    (async () => {
      const loadedImage = await loadImage(imageName);
      setSource(loadedImage);
    })();
  }, [imageName]);

  return <Image source={source} style={{ width: 100, height: 100 }} />;
};

async function loadImage(imageName) {
    try {
      const image = await import(`../../assets/poll-pngs/${imageName}`);
      return image.default;
    } catch (error) {
      console.error('Error loading image:', error);
    }
  }
  

export default DynamicImage;