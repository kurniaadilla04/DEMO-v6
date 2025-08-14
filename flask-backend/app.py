from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import os
from werkzeug.utils import secure_filename
from model import TeaLeafClassifier

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    return response

# Load model CNN &  
classifier = TeaLeafClassifier()
try:
    classifier.load_models(knn_path="knn_model.pklv2", cnn_path="cnn_model.h5")
except Exception as e:
    print("[ERROR] Model loading failed:", e)

@app.route('/api/test', methods=['GET'])
def test_connection():
    return jsonify({"status": "success", "message": "Backend Flask terhubung!"}), 200

@app.route('/api/health', methods=['GET'])
def health():
    ok = bool(getattr(classifier, 'cnn_model', None)) and bool(getattr(classifier, 'knn_model', None))
    return jsonify({"ok": ok}), (200 if ok else 500)

@app.route('/api/predict', methods=['POST', 'OPTIONS'])
def predict():
    # Handle preflight request
    if request.method == 'OPTIONS':
        resp = app.make_response(('', 204))
        resp.headers['Access-Control-Allow-Origin'] = '*'
        resp.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        resp.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        return resp

    if 'image' not in request.files:
        return jsonify({'status': 'error', 'message': 'No image uploaded'}), 400

    image_file = request.files['image']
    if image_file.filename == '':
        return jsonify({'status': 'error', 'message': 'Empty filename'}), 400

    # Simpan sementara
    filename = secure_filename(image_file.filename)
    os.makedirs("uploads", exist_ok=True)
    image_path = os.path.join("uploads", filename)
    try:
        image_file.save(image_path)
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Failed to save uploaded file: {str(e)}'}), 500

    # Baca gambar
    image = cv2.imread(image_path)
    if image is None:
        return jsonify({'status': 'error', 'message': 'Failed to read image'}), 400

    h, w = image.shape[:2]
    if h < 32 or w < 32:
        return jsonify({'status': 'error', 'message': 'Image too small. Please upload a clearer image.'}), 400

    # Prediksi
    try:
        result = classifier.predict(image)
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

    # Mapping label kematangan
    label_mapping = {
        "SIAP": "SIAP PETIK",
        "BELUM": "BELUM SIAP PETIK",
        "TEH": "SIAP PETIK",   # fallback jika model masih output "TEH"
        "non_tea": "BUKAN DAUN TEH"
    }

    if result['class'] == "non_tea":
        return jsonify({
            "status": "non_tea",
            "kematangan": label_mapping.get(result['class'], "BUKAN DAUN TEH"),
            "message": "Gambar ini bukan daun teh.",
            "confidence": result.get("confidence", None)
        }), 200
    else:
        return jsonify({
            "status": "daun_teh",
            "kematangan": label_mapping.get(result['class'], result['class']),
            "message": f"Daun teh - Tingkat kematangan: {label_mapping.get(result['class'], result['class'])}",
            "confidence": result.get("confidence", None)
        }), 200

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
