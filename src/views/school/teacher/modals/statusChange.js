import message from 'modules/message'
import { Modal } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import secureLocalStorage from 'react-secure-storage'
import { NDropdown as Dropdown } from 'widgets/Dropdown'
import { useTranslation } from "react-i18next";

const statusChange = ({ onClose, onSubmit, teacherId, statuses }) => {

    const { t } = useTranslation();
    const [loading, setLoading] = useState(false)

    const [selectedStatus, setSelectedStatus] = useState(null)

    const handleSave = () => {
        if (!selectedStatus) return message(t('err.fill_all_fields'))
        onSubmit(selectedStatus)
    }

    return (
        <Modal
            centered
            show={true}
            size='lg'
            onHide={() => onClose()}
            dimmer='blurring'
            aria-labelledby="contained-modal-title-vcenter"
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('teacher.change_status')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-group m-form__group row">
                    <label className="col-4 col-form-label text-right label-pinnacle-bold">
                        {t('status')}*
                    </label>
                    <div className="col-5">
                        <Dropdown
                            fluid
                            selection
                            closeOnChange
                            value={selectedStatus}
                            options={statuses?.map(obj => {
                                return {
                                    value: obj?.id,
                                    text: obj?.menuItem
                                }
                            })}
                            onChange={(e, data) => setSelectedStatus(data?.value)}
                            placeholder={'-' + t('select') + ' - '}
                        />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className='text-center'>
                <button
                    className="btn m-btn--pill btn-link m-btn m-btn--custom"
                    onClick={() => onClose()}
                >
                    {t('back')}
                </button>
                <button
                    className="btn m-btn--pill btn-success m-btn--wide"
                    onClick={handleSave}
                >
                    {t('teacher.change_status')}
                </button>
            </Modal.Footer>
            {
                loading &&
                <>
                    <div className="blockUI blockOverlay" />
                    <div className="blockUI blockMsg blockPage">
                        <div className="m-loader m-loader--brand m-loader--lg" />
                    </div>
                </>
            }
        </Modal >
    )
}

export default statusChange