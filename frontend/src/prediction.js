// Handle image upload and preview
document.getElementById('file-input').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      document.getElementById('preview-image').src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Handle predict button click
document.querySelector('.predict-btn').addEventListener('click', function() {
  // In a real implementation, this would send the image to a prediction API
  const resultElement = document.querySelector('.result-value');
  resultElement.textContent = 'Sedang memproses...';
  
  // Simulate prediction delay
  setTimeout(() => {
    const randomResults = ['Muda', 'Siap Petik', 'Tua'];
    const randomIndex = Math.floor(Math.random() * randomResults.length);
    resultElement.textContent = randomResults[randomIndex];
  }, 2000);
});

// Handle drag and drop for upload
const uploadBox = document.querySelector('.upload-box');
uploadBox.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadBox.classList.add('dragover');
});

uploadBox.addEventListener('dragleave', () => {
  uploadBox.classList.remove('dragover');
});

uploadBox.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadBox.classList.remove('dragover');
  
  const file = e.dataTransfer.files[0];
  if (file && file.type.match('image.*')) {
    const input = document.getElementById('file-input');
    input.files = e.dataTransfer.files;
    
    // Trigger change event
    const event = new Event('change');
    input.dispatchEvent(event);
  }
});
