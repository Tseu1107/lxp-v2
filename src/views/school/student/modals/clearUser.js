import React from 'react'
import { Modal } from 'react-bootstrap'
import { useTranslation } from "react-i18next";

const clearUserModal = ({ onClose, onDelete, title, locale, children }) => {
    
    const { t } = useTranslation();

    return (
        <Modal
            size='lg'
            dimmer='blurring'
            show={true}
            onHide={onClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('clear_login_name')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{color: '#212529'}}>
                {children}
            </Modal.Body>
            <Modal.Footer className='text-center'>
                <button
                    onClick={onClose}
                    className="btn m-btn--pill btn-link m-btn m-btn--custom"
                >
                    {t('back')}
                </button>
                <button
                    onClick={onDelete}
                    className="btn m-btn--pill btn-danger"
                    style={{fontSize: '13px'}}
                >
                    {t('remove')}
                </button>
            </Modal.Footer>
        </Modal >
    )
}

export default clearUserModal