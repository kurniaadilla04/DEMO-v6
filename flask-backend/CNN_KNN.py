import cv2
import os
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
from tensorflow.keras.preprocessing.image import ImageDataGenerator, img_to_array, load_img
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense
from tensorflow.keras.utils import to_categorical

def build_cnn_model():
    model = Sequential([
        Conv2D(32, (3, 3), activation='relu', input_shape=(64, 64, 3)),
        MaxPooling2D(2, 2),
        Conv2D(64, (3, 3), activation='relu'),
        MaxPooling2D(2, 2),
        Flatten(),
        Dense(64, activation='relu'),
        Dense(1, activation='sigmoid')  # Biner: daun teh (1) / bukan (0)
    ])
    
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    return model

def extract_color_histogram(image_path):
    image = load_img(image_path, target_size=(100, 100))
    image = img_to_array(image)
    hsv = cv2.cvtColor(image.astype('uint8'), cv2.COLOR_RGB2HSV)
    hist = cv2.calcHist([hsv], [0, 1, 2], None, [8,8,8], [0,180,0,256,0,256])
    cv2.normalize(hist, hist)
    return hist.flatten()

def predict_image(image_path):
    # Deteksi apakah daun teh
    img = load_img(image_path, target_size=(64, 64))
    img_array = img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    is_teh = cnn_model.predict(img_array)[0][0] > 0.5
    if not is_teh:
        return "Bukan daun teh"

    # Ekstraksi fitur dan klasifikasi kematangan
    features = extract_color_histogram(image_path).reshape(1, -1)
    prediction = knn.predict(features)[0]
    return f"Daun teh - tingkat kematangan: {prediction}"

train_datagen = ImageDataGenerator(rescale=1./255)
train_gen = train_datagen.flow_from_directory('cnn_dataset', target_size=(64, 64), class_mode='binary', batch_size=32)

cnn_model = build_cnn_model()
cnn_model.fit(train_gen, epochs=10)

data = []
labels = []
base_dir = 'cnn_dataset/'

for label in os.listdir(base_dir):
    folder = os.path.join(base_dir, label)
    for file in os.listdir(folder):
        path = os.path.join(folder, file)
        features = extract_color_histogram(path)
        data.append(features)
        labels.append(label)

X_train, X_test, y_train, y_test = train_test_split(data, labels, test_size=0.2)

knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(X_train, y_train)

hasil = predict_image('cnn_dataset/teh/teh_017.png')
print(hasil)

# Simpan model CNN
cnn_model.save('cnn_model.h5')

# Simpan model KNN
import joblib
joblib.dump(knn, 'knn_model.pkl')