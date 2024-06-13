// import message from 'Src/message'
import message from 'modules/message'
import React, { useState } from 'react'
import ReactCrop from 'react-image-crop'
import { Modal } from 'semantic-ui-react'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'

const ImageModal = ({ onClose, onSubmit }) => {

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [image, setImage] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)
    const [isCropped, setIsCropped] = useState(false)
    const [imageReal, setImageReal] = useState(null)
    const [imageType, setImageType] = useState(null)
    const [previewWidth, setPreviewWidth] = useState(null)
    const [previewHeight, setPreviewHeight] = useState(null)
    const [crop, setCrop] = useState({
        x: 0,
        y: 0,
        aspect: 1,
    })

    const verifyFile = file => {
        const acceptedType = [
            'image/x-png',
            'image/png',
            'image/jpg',
            'image/jpeg',
            'image/gif',
        ];
        const acceptedSize = 1048576;

        if (file) {
            let imageSize = file.size;
            if (imageSize > acceptedSize) {
                message(translations(locale).err.image_size_error);
                return false;
            }
            let imageType = file.type;
            if (!acceptedType.includes(imageType)) {
                message(translations(locale).err.image_type_error);
                return false;
            }
            return true;
        }
    };

    const handleOnCropChange = crop => {
        setCrop(crop)
    }

    const handleImageLoaded = image => {
        setPreviewWidth(image.width)
        setPreviewHeight(image.height)
    };

    const handleChange = e => {
        if (e.target.files && e.target.files[0]) {
            let image = e.target.files[0];
            const verified = verifyFile(image);

            if (verified) {

                let reader = new FileReader();
                let imageFileType = image.type;
                reader.addEventListener('load', () => {
                    setImage(reader.result)
                    setImageReal(reader.result)
                    setImageType(imageFileType)
                }, false);
                reader.readAsDataURL(image);
                handleImageLoaded(image);
                handleOnCropChange(crop);
            }
        }
        e.target.value = null;
    }

    const getCroppedImage = (image64, crop) => {
        const image = new Image();
        image.src = image64;
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / previewWidth;
        const scaleY = image.naturalHeight / previewHeight;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');
        image.onload = () => {
            ctx.drawImage(
                image,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width,
                crop.height,
            );
            setCroppedImage(canvas.toDataURL())
        }
    };

    const handleOnCropComplete = crop => {
        if (crop) {
            getCroppedImage(image, crop);
        }
    };

    const handleCrop = () => {
        if (croppedImage && croppedImage.length > 6) {
            setImage(croppedImage)
            setCroppedImage(null)
            setIsCropped(true)
            const crop = {
                x: 0,
                y: 0,
            }
            setCrop(crop)
        }
    };

    const handleUndo = () => {
        setImage(imageReal)
        setCroppedImage(null)
        setIsCropped(false)
        setCrop({
            x: 0,
            y: 0,
            aspect: 1,
        })
    };

    const handleRemove = () => {
        setImage(null)
        setImageReal(null)
        setCroppedImage(null)
        setIsCropped(false)
        setCrop({
            x: 0,
            y: 0,
            aspect: 1,
        })
    };

    const handleSave = () => {
        if (isCropped) {
            onSubmit({
                imageType,
                image,
            })
            onClose()
        } else {
            message(translations(locale)?.error_crop_button)
        }
    }

    return (
        <Modal
            size={'tiny'}
            dimmer={'blurring'}
            open={true}
            className="react-modal overflow-modal"
            centered
        >
            <div className="header">
                {translations(locale)?.insert_photo}
                <button type="button" className="close" aria-label="Close" onClick={onClose} >
                    <CloseIcon />
                </button>
            </div>
            <div className="content">
                <label
                    htmlFor="fileInput"
                    className="button-green-custom"
                >
                    {translations(locale)?.upload_photo_button_label}
                </label>
                <input
                    type="file"
                    id="fileInput"
                    style={{ display: "none" }}
                    accept="image/x-png, image/png, image/jpg, image/jpeg"
                    onChange={handleChange}
                />
                {
                    image &&
                    <>
                        <div
                            key='imageActions'
                            className='imageActionButtons'
                        >
                            <button
                                className="button-green-custom"
                                onClick={handleCrop}
                            >
                                {translations(locale)?.crop}
                            </button>
                            <button
                                className="button-green-custom"
                                onClick={handleUndo}
                            >
                                {translations(locale)?.undo}
                            </button>
                            <button
                                className="button-green-custom"
                                onClick={handleRemove}
                            >
                                {translations(locale)?.delete}
                            </button>
                        </div>
                        <div
                            className="text-center"
                            key='cropStudentPhoto'
                        >
                            <ReactCrop
                                src={image}
                                crop={crop}
                                onImageLoaded={handleImageLoaded}
                                onChange={handleOnCropChange}
                                onComplete={handleOnCropComplete}
                            />
                        </div>
                    </>
                }
            </div>
            <div className="actions modal-footer ">
                <div className="col-12 text-center">
                    <button
                        className="btn m-btn--pill m-btn--air btn-link margin-right-5"
                        onClick={onClose}
                    >
                        {translations(locale)?.back}
                    </button>
                    <button
                        onClick={handleSave}
                        className="btn m-btn--pill btn-success"
                    >
                        {translations(locale)?.insert_photo}
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default ImageModal