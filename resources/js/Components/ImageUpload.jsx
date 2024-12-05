import React, { useRef, useState } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import axios from 'axios';

function ImageUpload({ onUploadSuccess, user}) {
  const cropperRef = useRef(null);
  const [image, setImage] = useState(null);

  const onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const cropImage = () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas({
        width: 300,
        height: 300,
      });
      if (!croppedCanvas) {
        return;
      }

      // Converter o canvas para Blob
      croppedCanvas.toBlob((blob) => {
        const formData = new FormData();
        const fileName = 'croppedImage.jpg'; // Defina o nome do arquivo
        const imageFile = new File([blob], fileName, { type: 'image/jpeg' });
        formData.append('image', imageFile);
        formData.append("user", user)
        // Enviar para o back-end
        axios
          .post('/upload-image', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'X-CSRF-TOKEN': document
                .querySelector('meta[name="csrf-token"]')
                .getAttribute('content'),
            },
          })
          .then((response) => {
            if (response.data.success === true) {

              alert('Imagem enviada com sucesso!');
              if (onUploadSuccess) {
                onUploadSuccess(response.data.image_url);
              }
            } else {
              alert('Falha ao enviar a imagem: ' + response.data.message);
            }
          })
          .catch((error) => console.error('Erro:', error));
      }, 'image/jpeg');
    }
  };

  return (
    <div>
      <input type="file" onChange={onChange} accept="image/*" />
      {image && (
        <Cropper
          src={image}
          style={{ height: 400, width: '100%' }}
          initialAspectRatio={1}
          aspectRatio={1}
          guides={false}
          cropBoxResizable={true}
          viewMode={1}
          background={false}
          responsive={true}
          autoCropArea={1}
          ref={cropperRef}
        />
      )}
      <button onClick={cropImage}>Recortar e Enviar</button>
    </div>
  );
}

export default ImageUpload;