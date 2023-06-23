type ImageArray = string[];

export const SliceImage = (imgUrl: string): Promise<ImageArray> => {
    return new Promise(async (resolve) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = imgUrl;
      
        image.onload = () => {
          const fullWidth = image.width;
          const fullHeight = image.height;
          const halfWidth = fullWidth / 2;
          const halfHeight = fullHeight / 2;
      
          const splitImageDataURLs: string[] = [];
      
          for (let y = 0; y < 2; y++) {
            for (let x = 0; x < 2; x++) {
              const canvas = document.createElement('canvas');
              canvas.width = halfWidth;
              canvas.height = halfHeight;
              const ctx = canvas.getContext('2d');
      
              if (ctx) {
                ctx.drawImage(
                  image,
                  x * halfWidth,
                  y * halfHeight,
                  halfWidth,
                  halfHeight,
                  0,
                  0,
                  halfWidth,
                  halfHeight
                );
      
                const imageDataURL = canvas.toDataURL();
                splitImageDataURLs.push(imageDataURL);
              }
            }
          }

            resolve(splitImageDataURLs);
        };
    });
};