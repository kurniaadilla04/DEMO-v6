// Jika VITE_API_BASE tidak di-set, gunakan path relatif agar proxy Vite bekerja saat dev
const API_BASE = import.meta.env.VITE_API_BASE || "";
import React, { useState } from "react";
import CameraCapture from "../components/cameracapture";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";


const Prediksi = () => {
  const [imageData, setImageData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [useAutoCrop, setUseAutoCrop] = useState(true);

  const handleImageSelect = async (event) => {
    setErrorMsg(null);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base = reader.result;
        const maybeCropped = useAutoCrop ? await cropLeaf(base) : base;
        const normalized = await ensureMinSize(maybeCropped, 64, 64);
        setPreviewUrl(normalized);

        // Convert hasil crop ke File
        const byteString = atob(normalized.split(",")[1]);
        const mimeString = normalized.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        setImageData(new File([blob], "cropped.jpg", { type: mimeString }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCaptureImage = async (capturedImage) => {
    setErrorMsg(null);
    // Crop daun
    const base = capturedImage;
    const maybeCropped = useAutoCrop ? await cropLeaf(base) : base;
    const normalized = await ensureMinSize(maybeCropped, 64, 64);
    setPreviewUrl(normalized);

    // Ubah base64 ke file
    const byteString = atob(normalized.split(",")[1]);
    const mimeString = normalized.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    const croppedFile = new File([blob], "cropped.jpg", { type: mimeString });
    setImageData(croppedFile);

    setShowCamera(false);
  };

  // Fungsi crop daun berdasarkan warna hijau
const cropLeaf = async (imageBase64) => {
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

      // Cari pixel dominan hijau
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

      // Kalau ketemu area hijau → crop
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
        resolve(imageBase64); // Kalau nggak ada area hijau, kirim gambar asli
      }
    };
  });
};

// Pastikan ukuran minimal agar backend stabil (CNN expects >=64x64)
const ensureMinSize = async (imageBase64, minW = 64, minH = 64) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imageBase64;
    img.onload = () => {
      const targetW = Math.max(img.width, minW);
      const targetH = Math.max(img.height, minH); 
      if (img.width >= minW && img.height >= minH) {
        resolve(imageBase64);
        return;
      }
      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, targetW, targetH);
      resolve(canvas.toDataURL("image/jpeg", 0.9));
    };
  });
};

  const handlePredict = async () => {
    setErrorMsg(null); // Reset error di awal prediksi
    if (!imageData) {
      setPrediction("Silakan pilih gambar terlebih dahulu.");
      setConfidence(null);
      return;
    }

    const formData = new FormData();
    formData.append("image", imageData, "image.jpg");

    setPrediction("Memproses...");
    setConfidence(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/predict", {
        method: "POST",
        body: formData,
      });

      const text = await response.text();
      console.log("/api/predict status:", response.status, "body:", text);
      if (!response.ok) {
        const friendly =
          response.status === 0
            ? "Tidak dapat terhubung ke server. Periksa koneksi/URL backend."
            : `Server mengembalikan status ${response.status}. ${text || "Silakan coba lagi."}`;
        setErrorMsg(friendly);
        setPrediction(null);
        setConfidence(null);
        return;
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        setErrorMsg("Respon server tidak valid.");
        setPrediction(null);
        setConfidence(null);
        return;
      }
      console.log("Confidence:", data.confidence);
      setConfidence(data.confidence);

      if (data.status === "non_tea") {
        setPrediction("🚫 Gambar ini bukan daun teh.");
      } else if (data.status === "daun_teh") {
        if (data.kematangan === "siap_petik") {
          setPrediction("Siap Petik");
        } else if (data.kematangan === "belum_siap_petik") {
          setPrediction("Belum Siap Petik");
        } else {
          setPrediction("Hasil tidak dikenali");
        }
      } else {
        setPrediction("Hasil tidak dikenali");
      }

    } catch (err) {
      console.error("handlePredict error:", err);
      // Tangani kemungkinan CORS/network error (TypeError pada fetch)
      const message =
        err && err.name === "TypeError"
           "Terjadi kesalahan saat memproses gambar. Silakan coba lagi.";
      setErrorMsg(message);
      setPrediction(null);
      setConfidence(null);
    }
  };

  return (
    <div className="min-h-screen bg-white font-poppins flex flex-col">
      <div className="relative w-full flex-1 overflow-hidden px-4 pb-16 pt-0">
        
        {/* Background Petani untuk Mobile */}
        <div
          className="absolute inset-0 md:hidden bg-[url('/assets/petani.png')] bg-no-repeat bg-cover bg-bottom opacity-10 z-0"
          aria-hidden="true"
        ></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          {/* Kiri: Form Prediksi */}
          <div className="flex-1 w-full max-w-2xl">
            <div className="md:ml-10">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-2 leading-tight text-center md:text-left">
                <span className="text-gradient block">Mulai Lakukan</span>
                <span className="text-gradient block">Prediksi</span>
              </h1>
              <p className="italic text-gray-600 text-base sm:text-lg mb-6 mt-2 text-center md:text-left">
                "Membantu Pemetikan Daun Teh secara Efisien"
              </p>

              {/* Form Upload - responsive */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col lg:flex-row gap-6 items-center mb-4 w-full max-w-3xl mx-auto">
                {/* Preview */}
                <div className="w-28 h-28 sm:w-40 sm:h-40 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 shrink-0">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full rounded-md object-cover"
                    />
                  ) : (
                    <img
                      src="/assets/upicon.png"
                      alt="Upload"
                      className="w-16 h-16 opacity-70"
                    />
                  )}
                </div>

                {/* Upload Options */}
                <div className="flex-1 flex flex-col justify-center w-full">
                  <p className="text-gray-500 mb-4 text-sm sm:text-base font-semibold text-center lg:text-left">
                    Harap unggah gambar persegi, ukuran kurang dari 100KB
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 mb-4 w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      style={{ display: "none" }}
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-200 rounded-lg cursor-pointer transition text-sm sm:text-base font-extrabold text-gray-700 justify-center shadow-none hover:bg-gray-300"
                    >
                      <img src="/assets/upgambar.png" alt="icon" className="w-5 h-5" />
                      Pilih Gambar
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCamera(true)}
                      className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-200 rounded-lg cursor-pointer transition text-sm sm:text-base font-extrabold text-gray-700 justify-center shadow-none hover:bg-gray-300"
                    >
                      <img src="/assets/usecamera.png" alt="icon" className="w-5 h-5" />
                      Gunakan Kamera
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handlePredict}
                    className="w-full px-6 py-3 rounded-lg font-extrabold text-base text-white"
                    style={{
                      background: "linear-gradient(90deg, #61BC43 0%, #10ACC6 100%)",
                      boxShadow: "0 4px 16px 0 rgba(16,185,129,0.15)",
                    }}
                  >
                    Mulai Prediksi
                  </button>
                </div>
              </div>

              {/* Kamera Popup */}
              {showCamera && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
                    <CameraCapture
                      onCapture={handleCaptureImage}
                      onClose={() => setShowCamera(false)}
                    />
                  </div>
                </div>
              )}

              {/* Hasil Prediksi */}
              {prediction && (
                <div
                  className={`mt-6 px-6 py-5 rounded-md shadow-lg flex items-start space-x-4 transition-opacity duration-500 ease-in-out
                    ${prediction === "Belum Siap Petik" ? "bg-yellow-100 border-l-4 border-yellow-500" : ""}
                    ${prediction === "Siap Petik" ? "bg-green-100 border-l-4 border-green-500" : ""}
                    ${prediction === "🚫 Gambar ini bukan daun teh." ? "bg-red-100 border-l-4 border-red-500" : ""}
                  `}
                  style={{ opacity: prediction ? 1 : 0 }}
                >
                  <div
                    className={`text-3xl
                      ${prediction === "Belum Siap Petik" ? "text-yellow-500" : ""}
                      ${prediction === "Siap Petik" ? "text-green-500" : ""}
                      ${prediction === "🚫 Gambar ini bukan daun teh." ? "text-red-500" : ""}
                    `}
                  >
                    {prediction === "Belum Siap Petik" && "⏳"}
                    {prediction === "Siap Petik" && "🌿"}
                    {prediction === "🚫 Gambar ini bukan daun teh." && "❌"}
                  </div>
                  <div>
                    <h3
                      className={`text-lg font-semibold
                        ${prediction === "Belum Siap Petik" ? "text-yellow-800" : ""}
                        ${prediction === "Siap Petik" ? "text-green-800" : ""}
                        ${prediction === "🚫 Gambar ini bukan daun teh." ? "text-red-800" : ""}
                      `}
                    >
                      Hasil Prediksi:
                    </h3>

                    {prediction === "Belum Siap Petik" && (
                      <p className="text-gray-700">
                        Daun teh <em>belum siap petik</em>. Perlu waktu lebih lama hingga matang.
                      </p>
                    )}
                    {prediction === "Siap Petik" && (
                      <p className="text-gray-700">
                        Daun teh <em>sudah siap untuk dipetik</em>. Silakan lanjutkan proses panen 🍃
                      </p>
                    )}
                    {prediction === "🚫 Gambar ini bukan daun teh." && (
                      <p className="text-gray-700">
                        Gambar yang diunggah <strong>bukan daun teh</strong>. Silakan unggah gambar yang valid 🌱
                      </p>
                    )}
                    {prediction !== "Belum Siap Petik" &&
                      prediction !== "Siap Petik" &&
                      prediction !== "🚫 Gambar ini bukan daun teh." && (
                        <p className="text-gray-700">{prediction}</p>
                      )}
                    {confidence !== null && (
                      <p className="text-sm text-gray-600 italic mt-2">
                        
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Error Alert */}
              {errorMsg && (
                <div className="mt-4 px-4 py-3 rounded-md bg-red-100 border border-red-400 text-red-700 font-semibold text-center">
                  {errorMsg}
                </div>
              )}
            </div>
          </div>

          {/* Kanan: Gambar Petani (hanya desktop) */}
          <div className="hidden md:flex flex-1 justify-center md:justify-end">
            <img
              src="/assets/petani.png"
              alt="Petani"
              className="h-auto max-w-xs sm:max-w-md md:max-w-lg w-full"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Prediksi;