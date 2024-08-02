import React from 'react'
import { Modal } from 'react-bootstrap'
import { useTranslation } from "react-i18next";

const registrationSheet = ({ onClose, onSubmit }) => {
    const { t } = useTranslation();
    return (
        <Modal
            size='tiny'
            dimmer='blurring'
            show={true}
            onHide={onClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
                <Modal.Header closeButton style={{padding: '1rem'}}>
                        <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                        {t('movement.register_sheet')}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="content">
                            <p className='mt-3'>
                                {t('movement.register_sheet_description')}
                            </p>
                        </div>                
                    </Modal.Body>
                    <Modal.Footer className="text-center">
                        <button
                            onClick={onClose}
                            className="btn m-btn--pill btn-link m-btn m-btn--custom"
                        >
                            {t('back') || null}
                        </button>
                        <button
                            onClick={onSubmit}
                            className="btn m-btn--pill btn-success text-uppercase bolder"
                        >
                            {t('print') || null}
                        </button>
                    </Modal.Footer>
        </Modal>
    )
}

export default registrationSheet