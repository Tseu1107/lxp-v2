import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { Tab, Checkbox } from 'semantic-ui-react';
import { useSelector } from 'react-redux'
import message from "modules/message";
import AddIcon from '@mui/icons-material/Add';
import { NDropdown as Dropdown } from 'widgets/Dropdown';
import CloseIcon from '@mui/icons-material/Close';
import { isValidEmail } from 'utils/utils'

import { fetchRequest } from 'utils/fetchRequest'
import { studentBookContactPersonCreate } from 'utils/fetchRequest/Urls'

import secureLocalStorage from 'react-secure-storage';

const AddContactPerson = ({ onClose, studentId = null, relationTypes = [] }) => {

    const { t } = useTranslation();
    const { selectedSchool } = useSelector(state => state.schoolData);

    const [loading, setLoading] = useState(false)
    const [addAgain, setAddAgain] = useState(false)
    const [selectedRelationType, setSelectedRelationType] = useState(null)
    const [personName, setPersonName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    
    const [closeWithReload, setCloseWithReload] = useState(false)
 
    const onClickSubmit = () => {
        if (selectedRelationType && personName?.length > 0 && phoneNumber?.length > 0 && email?.length > 0) {
            if (isValidEmail(email)) {
                const params = {
                    school: selectedSchool?.id,
                    student: studentId,
                    relationType: selectedRelationType,
                    personName: personName,
                    phoneNumber: phoneNumber,
                    email: email
                }
                setLoading(true)
                fetchRequest(studentBookContactPersonCreate, 'POST', params)
                    .then(res => {
                        if (res.success) {
                            message(res.message, true)
                            if (addAgain) {
                                setCloseWithReload(true)
                                setSelectedRelationType(null)
                                setPersonName('')
                                setPhoneNumber('')
                                setEmail('')
                            } else {
                                onClose(true)
                            }
                        } else {
                            message(res.message)
                        }
                        setLoading(false)
                    })
                    .catch(() => {
                        message(t('err.error_occurred'))
                        setLoading(false)
                    })
            } else {
                message(t('err.invalid_email'))
            }
        } else {
            message(t('err.fill_all_fields'))
        }
    }

    return (
        <Modal
            size='lg'
            dimmer='blurring'
            show={true}
            onHide={() => onClose(closeWithReload)}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{ padding: '1rem' }}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('studentBookNavs.addContact')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-group m-form__group row">
                    <label className="col-form-label col-md-4 col-sm-12 text-right label-pinnacle-bold">
                        {t('studentBookNavs.relationType')}*
                    </label>
                    <div className="col-md-5 col-sm-12">
                        <Dropdown
                            selectOnNavigation={false}
                            placeholder={'-' + t('survey.choose') + '-' || null}
                            fluid
                            selection
                            search
                            additionPosition='bottom'
                            upward={false}
                            closeOnChange
                            selectOnBlur={false}
                            value={selectedRelationType}
                            options={relationTypes?.map(obj => {
                                return {
                                    value: obj?.id,
                                    text: obj?.name
                                }
                            })}
                            onChange={(e, data) => setSelectedRelationType(data?.value)}
                        />
                    </div>
                </div>
                <div className="form-group m-form__group row">
                    <label className="col-form-label col-md-4 col-sm-12 text-right label-pinnacle-bold">
                        {t('name') || null}*
                    </label>
                    <div className="col-md-5 col-sm-12">
                        <input type="text"
                            className={"form-control m-input"}
                            placeholder={t('name') || null}
                            value={personName || ''}
                            onChange={e => setPersonName(e?.target?.value)} />
                    </div>
                </div>
                <div className="form-group m-form__group row">
                    <label className="col-form-label col-md-4 col-sm-12 text-right label-pinnacle-bold">
                        {t('common.phoneNumber') || null}*
                    </label>
                    <div className="col-md-5 col-sm-12">
                        <input type="number"
                            className={"form-control m-input"}
                            onWheel={e => e?.target?.blur()}
                            placeholder={t('common.phoneNumber') || null}
                            value={phoneNumber || ''}
                            onChange={e => setPhoneNumber(e?.target?.value)} />
                    </div>
                </div>

                <div className="form-group m-form__group row">
                    <label className="col-form-label col-md-4 col-sm-12 text-right label-pinnacle-bold">
                        {t('email') || null}*
                    </label>
                    <div className="col-md-5 col-sm-12">
                        <input type="text"
                            className={"form-control m-input"}
                            placeholder={t('email') || null}
                            value={email || ''}
                            onChange={e => setEmail(e?.target?.value)} />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className='text-center'>
                <div className='align-center align-items-center' style={{ marginLeft: '17px', position: 'absolute', left: '1.5rem', bottom: '1.6rem' }}>
                    <label className="form-check-label font-mulish" htmlFor="reAdd" style={{ color: '#575962', fontSize: '14px', fontWeight: '400' }}>
                        <input
                            className="form-check-input form-modal-check mt-0"
                            id='reAdd'
                            type="checkbox"
                            style={{ borderRadius: '4px', fontSize: '18px', marginTop: 0 }}
                            value={addAgain}
                            onChange={(e, data) => setAddAgain(e?.target?.checked)}
                        />&nbsp;&nbsp;{t('common.addAgain')}
                    </label>
                </div>
                <button
                    className="btn m-btn--pill btn-link m-btn m-btn--custom margin-right-5"
                    onClick={() => onClose(closeWithReload)}
                >
                    {t('back') || null}
                </button>
                <button
                    onClick={onClickSubmit}
                    className="btn m-btn--pill btn-success m-btn--wide m-btn--uppercase"
                >
                    {t('save') || null}
                </button>
            </Modal.Footer>

            {
                loading &&
                <>
                    <div className="blockUI blockOverlay">
                        <div className="blockUI blockMsg blockPage">
                            <div className="m-loader m-loader--brand m-loader--lg" />
                        </div>
                    </div>
                </>
            }
        </Modal>
    )
}

export default AddContactPerson