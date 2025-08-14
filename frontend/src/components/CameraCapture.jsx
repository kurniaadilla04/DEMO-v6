// src/components/CameraCapture.jsx
import React, { useRef, useState, useEffect } from "react";


const CameraCapture = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [busy, setBusy] = useState(false);
  const [videoDevices, setVideoDevices] = useState([]);
  const [deviceIndex, setDeviceIndex] = useState(0);
  const [useFacingEnv, setUseFacingEnv] = useState(true);
  const [camError, setCamError] = useState(null);

  useEffect(() => {
    // Pastikan atribut iOS untuk inline playback
    if (videoRef.current) {
      try {
        videoRef.current.setAttribute("playsinline", "true");
        videoRef.current.setAttribute("webkit-playsinline", "true");
      } catch {}
    }

    const stopStream = () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };

    const getUserMediaCompat = (constraints) => {
      const md = navigator.mediaDevices;
      if (md && typeof md.getUserMedia === "function") {
        return md.getUserMedia(constraints);
      }
      const legacy =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;
      if (legacy) {
        return new Promise((resolve, reject) => legacy.call(navigator, constraints, resolve, reject));
      }
      return Promise.reject(new Error("getUserMedia tidak didukung di browser ini"));
    };

    const startCamera = async () => {
      try {
        if (!window.isSecureContext) {
          setCamError("Halaman tidak berjalan di HTTPS. Akses lewat HTTPS/ngrok agar kamera bisa digunakan.");
          throw new Error("Not secure context");
        }
        // Jika punya daftar deviceId, gunakan deviceId, else pakai facingMode
        let constraints;
        if (videoDevices.length > 0) {
          const target = videoDevices[deviceIndex % videoDevices.length];
          constraints = { video: { deviceId: { exact: target.deviceId } }, audio: false };
        } else {
          constraints = { video: { facingMode: { ideal: useFacingEnv ? "environment" : "user" } }, audio: false };
        }
        const mediaStream = await getUserMediaCompat(constraints);
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          try { await videoRef.current.play(); } catch {}
        }
        // Enumerasi device setelah izin diberikan
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const vids = devices.filter((d) => d.kind === "videoinput");
          if (vids.length) setVideoDevices(vids);
        } catch {}
        setCamError(null);
      } catch (err) {
        // fallback ke kamera default jika kamera belakang tidak tersedia
        try {
          const fallbackStream = await getUserMediaCompat({ video: true, audio: false });
          setStream(fallbackStream);
          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
            try { await videoRef.current.play(); } catch {}
          }
          setCamError(null);
        } catch (fallbackErr) {
          console.error("Gagal membuka kamera:", fallbackErr);
          setCamError("Gagal membuka kamera. Pastikan izin kamera diberikan dan halaman diakses via HTTPS.");
        }
      }
    };

    // Mulai kamera
    startCamera();

    return () => {
      stopStream();
    };
    // restart kamera ketika index atau facing berubah
  }, [deviceIndex, useFacingEnv]);

  const switchCamera = async () => {
    if (busy) return;
    setBusy(true);
    try {
      // Jika ada banyak device, cycle
      if (videoDevices.length > 1) {
        setDeviceIndex((i) => (i + 1) % videoDevices.length);
      } else {
        // Toggle facing sebagai fallback
        setUseFacingEnv((v) => !v);
      }
    } finally {
      setBusy(false);
    }
  };

  const handleTakePhoto = async (base64Image) => {
    // Biarkan parent (Prediksi.jsx) yang melakukan crop & normalisasi
    onCapture(base64Image);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-sm aspect-square overflow-hidden rounded-lg shadow-lg bg-black">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
      {camError && (
        <p className="mt-2 text-red-600 text-sm text-center">{camError}</p>
      )}
      <div className="flex gap-4 mt-4">
        <button
          type="button"
          onClick={async () => {
            if (!videoRef.current) return;
            if (busy) return;
            try {
              setBusy(true);
              // Pastikan video siap
              if (videoRef.current.readyState < 2) {
                await new Promise((r) => setTimeout(r, 100));
              }
              const vw = videoRef.current.videoWidth || 640;
              const vh = videoRef.current.videoHeight || 480;
              const size = Math.min(vw, vh);
              const sx = Math.floor((vw - size) / 2);
              const sy = Math.floor((vh - size) / 2);

              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d");
              canvas.width = size;
              canvas.height = size;
              // crop kotak di tengah dari video ke canvas square
              ctx.drawImage(
                videoRef.current,
                sx,
                sy,
                size,
                size,
                0,
                0,
                size,
                size
              );
              const base64Image = canvas.toDataURL("image/jpeg", 0.9);
              await handleTakePhoto(base64Image);
            } finally {
              setBusy(false);
            }
          }}
          className="px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
        >
          {busy ? "Memproses..." : "Ambil Foto"}
        </button>
        <button
          type="button"
          onClick={switchCamera}
          className="px-4 py-2 bg-indigo-500 text-white font-bold rounded-lg hover:bg-indigo-600"
        >
          Ganti Kamera
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default CameraCapture;
