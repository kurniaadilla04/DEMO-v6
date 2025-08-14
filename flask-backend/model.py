import cv2
import numpy as np
from PIL import Image
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
import joblib

class TeaLeafClassifier:
    def __init__(self, cnn_path="cnn_model.h5", knn_path="knn_model.pkl"):
        self.cnn_model = load_model(cnn_path)
        self.knn_model = joblib.load(knn_path)

    def extract_color_histogram(self, image):
        """Ekstraksi fitur histogram warna HSV."""
        image = cv2.cvtColor(image, cv2.COLOR_RGB2HSV)
        hist = cv2.calcHist([image], [0, 1, 2], None,
                            [8, 8, 8], [0, 180, 0, 256, 0, 256])
        cv2.normalize(hist, hist)
        return hist.flatten()

    def predict(self, file):
        """Prediksi gambar daun teh dari FileStorage atau NumPy array."""
        # Handle file input
        if isinstance(file, np.ndarray):
            image_np = cv2.cvtColor(file, cv2.COLOR_BGR2RGB)
            image = Image.fromarray(image_np)
        else:
            image = Image.open(file).convert("RGB")

        # Preprocessing untuk CNN
        img_resized = image.resize((64, 64))
        img_array = img_to_array(img_resized) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # Prediksi CNN → cek daun teh atau bukan
        is_teh = self.cnn_model.predict(img_array)[0][0] > 0.5

        if not is_teh:
            return {
                "status": "bukan_daun_teh",
                "confidence": 1.0
            }

        # Kalau daun teh → prediksi kematangan dengan KNN
        image_np = np.array(img_resized)
        features = self.extract_color_histogram(image_np).reshape(1, -1)
        pred_kematangan = self.knn_model.predict(features)[0]

        if pred_kematangan.lower() == "siap":
            status = "siap_petik"
        else:
            status = "belum_siap_petik"

        return {
            "status": status,
            "confidence": 1.0
        }
