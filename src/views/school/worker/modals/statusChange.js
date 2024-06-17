import message from 'modules/message'
import { Modal } from 'react-bootstrap'
import Select from 'modules/Form/Select'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'

const statusChange = ({ onClose, onSubmit, teacher, tableState }) => {
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const [selectedStatus, setSelectedStatus] = useState(null)
    const [statusOptions, setStatusOptions] = useState([{value: '123', text: 'status 1'}, {value: '1231', text: 'status 2'}])

    // useEffect(() => {
    //     setLoading(true)
    //     fetchRequest(schoolStaffStatusChange, 'POST', { 
    //         employee: teacher,
    //         page: tableState?.page || 1,
    //         pageSize: tableState?.pageSize || 10,
    //         search: tableState?.search || '',
    //         sort: tableState?.sort || 'firstName',
    //         order: tableState?.order || 'asc',
    //     })
    //         .then((res) => {
    //             if (res.success) {
    //                 const { statuses, statusId } = res?.data
    //                 setSelectedStatus(statusId || null)
    //                 setStatusOptions(statuses?.map(el => ({ value: el?.id, text: el?.name })) || [])
    //             } else {
    //                 message(res.data.message)
    //             }
    //             setLoading(false)
    //         })
    //         .catch(() => {
    //             message(translations(locale)?.err?.error_occurred)
    //             setLoading(false)
    //         })
    // }, [])

    const handleSave = () => {
        if (!selectedStatus) return message(translations(locale)?.err?.fill_all_fields)
        onSubmit(selectedStatus)
    }

    return (
        <Modal
            centered
            show={true}
            size='lg'
            onHide={onClose}
            dimmer='blurring'
            aria-labelledby="contained-modal-title-vcenter"
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {translations(locale)?.teacher?.change_status_staff}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-group m-form__group row">
                    <label className="col-4 col-form-label text-right label-pinnacle-bold">
                        {translations(locale)?.status}*
                    </label>
                    <div className="col-5">
                        <Select
                            clearable
                            searchable
                            options={statusOptions}
                            value={selectedStatus}
                            onChange={(e, data) => setSelectedStatus(e)}
                        />
                        {/* <Dropdown
                            fluid
                            selection
                            closeOnChange
                            value={selectedStatus}
                            options={statusOptions}
                            onChange={(e, data) => setSelectedStatus(data?.value)}
                            placeholder={'-' + translations(locale)?.select + '-'}
                        /> */}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className='text-center'>
                <button
                    className="btn m-btn--pill btn-link m-btn m-btn--custom"
                    onClick={onClose}
                >
                    {translations(locale)?.back}
                </button>
                <button
                    className="btn m-btn--pill btn-success m-btn--wide"
                    onClick={handleSave}
                >
                    {translations(locale)?.teacher?.change_status_staff}
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