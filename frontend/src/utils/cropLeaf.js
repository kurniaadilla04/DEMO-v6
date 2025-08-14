// src/utils/cropLeaf.js
export const cropLeaf = (imageBase64) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imageBase64;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imageData.data;

      let minX = img.width, minY = img.height, maxX = 0, maxY = 0;

      // Cari piksel dominan hijau
      for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
          const i = (y * img.width + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          if (g > 80 && g > r * 1.2 && g > b * 1.2) {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }

      // Crop kalau ditemukan daun
      if (maxX > minX && maxY > minY) {
        const cropWidth = maxX - minX;
        const cropHeight = maxY - minY;
        const cropCanvas = document.createElement("canvas");
        cropCanvas.width = cropWidth;
        cropCanvas.height = cropHeight;
        const cropCtx = cropCanvas.getContext("2d");
        cropCtx.drawImage(img, minX, minY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
        resolve(cropCanvas.toDataURL("image/jpeg", 0.9));
      } else {
        resolve(imageBase64); // Tidak ada daun → kirim gambar asli
      }
    };
  });
};
