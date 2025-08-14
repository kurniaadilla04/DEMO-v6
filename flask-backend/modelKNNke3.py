import os
import cv2
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
import pickle

image_size = (128, 128)
dataset_path = 'knn_dataset'  # atau 'dataset_teh' sesuai kebutuhan
X, y = [], []

for label in os.listdir(dataset_path):
    for file in os.listdir(os.path.join(dataset_path, label)):
        img_path = os.path.join(dataset_path, label, file)
        img = cv2.imread(img_path)
        if img is not None:
            img = cv2.resize(img, image_size)
            X.append(img.flatten())
            y.append(label)

X = np.array(X)
y = np.array(y)

model = KNeighborsClassifier(n_neighbors=3)
model.fit(X, y)

with open('modelknn.pkl', 'wb') as f:
    pickle.dump(model, f)