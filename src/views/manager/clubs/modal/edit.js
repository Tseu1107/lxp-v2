import message from 'modules/message'
// import GeneralTab from './tab/general'
import StudentsTab from '../tab/students'
import { Tab } from 'semantic-ui-react'
import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import secureLocalStorage from 'react-secure-storage'
import { NDropdown as Dropdown } from 'widgets/Dropdown'
import DTable from 'modules/DataTable/DTable'
import { translations } from 'utils/translations'
import { useTranslation } from 'react-i18next'
import DeleteModal from 'utils/deleteModal'
import CloseIcon from '@mui/icons-material/Close'
import StudentAddModal from './studentAdd'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
// import { useLocation, useNavigate } from 'react-router-dom'

const EditClub = ({ onClose, selectedTableId }) => {

    const { t } = useTranslation()
    const location = {state: {id: 1231}}

    const [tab, setTab] = useState(0)
    const [club, setClub] = useState({
        "type": "Дугуйлан",
        "subjectId": 27997,
        "subjectName": "Бүжгийн дугуйлан",
        "teacher": "Admin",
        "groupName": "Бүжгийн дугуйлан 8",
        "title": "Бүжгийн дугуйлан 8Admin",
        "classIds": [
            "5300"
        ],
        "classList": [
            {
                "id": "5300",
                "className": "8А"
            }
        ],
        "classes": "8А",
        "isAll": false
    })
    const [loading, setLoading] = useState(false)

    const [tableData, setTableData] = useState([
        {
            "id": "137818",
            "studentCode": "DE15",
            "firstName": "Ган-Эрдэнэ",
            "lastName": "Бямбажав",
            "className": "8Б"
        },
        {
            "id": "137817",
            "studentCode": "DE14",
            "firstName": "Энхдэлгэр",
            "lastName": "Анхбаяр",
            "className": "9A"
        }
    ])
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedTableDataId, setSelectedTableDataId] = useState(null)

    const [showStudentAddModal, setShowStudentAddModal] = useState(false)
    const [teacherOptions, setTeacherOptions] = useState([])

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

    const config = {
        showAllData: true,
        showPagination: false,
    }

    const columns = [
        {
            dataField: 'className',
            text: translations(locale)?.class_name,
            sort: true,
        },
        {
            dataField: 'studentCode',
            text: translations(locale)?.studentCode,
            sort: true
        },
        {
            dataField: 'lastName',
            text: translations(locale)?.studentLastName,
            sort: true
        },
        {
            dataField: 'firstName',
            text: translations(locale)?.studentFirstName,
            sort: true,
        },
        {
            dataField: 'action',
            text: '',
            align: 'center',
            headerStyle: { width: 50 },
            formatter: (cell, row) => <button onClick={() => { setSelectedTableDataId(row?.id), setShowDeleteModal(true) }}
                className='btn btn-danger m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex justify-content-center align-items-center'>
                <CloseIcon />
            </button>
        },
    ]

// useEffect(() => {
    //     setLoading(true)
    //     if (tab === 0) {    
    //         fetchRequest(managerClubEdit, 'POST', { selectedTableId })
    //             .then((res) => {
    //                 if (res.success) {
    //                     const { groupData } = res.data
    //                     setClub(groupData || {})
    //                     fetchRequest(getTeachersBySubject, 'POST', { subject: groupData?.subjectId })
    //                         .then((res) => {
    //                             if (res.success) {
    //                                 const { teachers } = res.data
    //                                 setTeacherOptions(teachers?.map(el => ({ value: el?.teacherId, text: `${el?.firstName} (${el?.lastName}) - ${el?.teacherCode}` })) || [])
    //                             } else {
    //                                 message(res.data.message)
    //                             }
    //                             setLoading(false)
    //                         })
    //                         .catch(() => {
    //                             message(translations(locale)?.err?.error_occurred)
    //                             setLoading(false)
    //                         })
    //                 } else {
    //                     message(res.data.message)
    //                 }
    //                 setLoading(false)
    //             })
    //             .catch(() => {
    //                 message(translations(locale)?.err?.error_occurred)
    //                 setLoading(false)
    //             })
    //     } else {
    //         fetchRequest(managerClubStudents, 'POST', { selectedTableId })
    //         .then((res) => {
    //             if (res.success) {
    //                 const { groupStudentList } = res.data
    //                 setTableData(groupStudentList || [])
    //             } else {
    //                 message(res.data.message)
    //             }
    //             setLoading(false)
    //         })
    //         .catch(() => {
    //             message(translations(locale)?.err?.error_occurred)
    //             setLoading(false)
    //         })
    //     }
    // }, [])

    const handleEdit = () => {
        console.log('handleEdit')
        // setLoading(true)
        // fetchRequest(managerClubEdit, 'POST', { ...club, submit: 1, selectedTableId })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             navigate('/manager/clubs/edit', { state: { id: club?.id, tab: 1 }, replace: true })
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const handleRemove = () => {
        console.log('handleRemove')
        // setLoading(true)
        // fetchRequest(managerClubStudentRemove, 'POST', { student: selectedTableDataId, group })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             const { groupStudentList } = res.data
        //             setTableData(groupStudentList || [])
        //             closeModal()
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const handleSubmit = param => {
        console.log('handleSubmit')
        // setLoading(true)
        // fetchRequest(managerClubStudentAdd, 'POST', { details: JSON.stringify(param), group, submit: 1 })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             const { groupStudentList } = res.data
        //             setTableData(groupStudentList || [])
        //             closeModal()
        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }
    
    const handleChange = (name, value) => {
        setClub({ ...club, [name]: value })
    }

    const closeModal = () => {
        setShowDeleteModal(false)
        setSelectedTableDataId(null)
        setShowStudentAddModal(false)
    }
    
    return (
        <Modal
            dimmer='blurring'
            show={true}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            onHide={onClose}
            // className='react-modal overflow-modal'
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('edit')}
                </Modal.Title>
            </Modal.Header>
            <div className='tab'>
                <Tab
                    activeIndex={tab}
                    className='m-portlet-header'
                    onTabChange={(e, data) => setTab(data?.activeIndex)}
                    menu={{ secondary: true, pointing: true, className: 'primaryColor m-0 h-4' }}
                    panes={[
                        {
                            menuItem: translations(locale)?.general_info,
                            render: () => (
                                <Modal.Body>
                                    <div className='form-group m-form__group row align-items-center'>
                                        <label className='col-5 col-form-label text-right label-pinnacle-bold'>
                                            {translations(locale)?.subject?.type}
                                        </label>
                                        <div className='col-4 col-form-label text-grey' style={{fontSize: '14px'}}>
                                            {club?.type}
                                        </div>
                                    </div>
                                    <div className='form-group m-form__group row align-items-center'>
                                        <label className='col-5 col-form-label text-right label-pinnacle-bold'>
                                            {translations(locale)?.club?.title}
                                        </label>
                                        <div className='col-4 col-form-label text-grey' style={{fontSize: '14px'}}>
                                            {club?.subjectName}
                                        </div>
                                    </div>
                                    <div className='form-group m-form__group row'>
                                        <label className='col-5 col-form-label text-right label-pinnacle-bold'>
                                            {translations(locale)?.teacher_title}*
                                        </label>
                                        <div className='col-4'>
                                            <Dropdown
                                                fluid
                                                search
                                                selection
                                                closeOnChange
                                                options={teacherOptions}
                                                value={club?.teacherId?.toString()}
                                                placeholder={'-' + translations(locale)?.select + '-'}
                                                onChange={(e, data) => handleChange('teacherId', data?.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className='form-group m-form__group row'>
                                        <label className='col-5 col-form-label text-right label-pinnacle-bold'>
                                            {translations(locale)?.club?.name}*
                                        </label>
                                        <div className='col-4'>
                                            <input
                                                value={club?.name || ''}
                                                type='text' className='form-control'
                                                placeholder={translations(locale)?.club?.name}
                                                onChange={(e) => handleChange('name', e?.target?.value)}
                                            />
                                        </div>
                                    </div>
                                </Modal.Body>
                            )
                        },
                        {
                            menuItem: translations(locale)?.students,
                            render: () => (
                                <Modal.Body>
                                    <button
                                        className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3'
                                        onClick={() => setShowStudentAddModal(true)}
                                    >
                                        <AddCircleOutlineRoundedIcon className='MuiSvg-customSize'/>
                                        <span className='ml-2'>{translations(locale)?.movement?.add}</span>
                                    </button>
                                    <DTable
                                        config={config}
                                        locale={locale}
                                        data={tableData}
                                        columns={columns}
                                    />
                                </Modal.Body>
                            ),
                        },
                    ]}
                />
            </div>
            {
                tab === 0 &&
                <Modal.Footer className="text-center">
                    <button 
                        onClick={onClose}
                        className="btn m-btn--pill btn-link m-btn m-btn--custom"
                    >
                        {t('back')}
                    </button>
                    <button
                        onClick={handleEdit}
                        className='btn m-btn--pill btn-publish text-uppercase'
                    >
                        {translations(locale)?.club?.register_student}
                    </button>
                </Modal.Footer>
            }
            {
                tab === 1 &&
                <Modal.Footer className="text-center">
                    <button 
                        onClick={onClose}
                        className="btn m-btn--pill btn-link m-btn m-btn--custom"
                    >
                        {t('back_to_list')}
                    </button>
                </Modal.Footer>
            }
            {
                loading &&
                <>
                    <div className='blockUI blockOverlay' />
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg' />
                    </div>
                </>
            }
            {
                showDeleteModal && selectedTableDataId &&
                <DeleteModal
                    onClose={closeModal}
                    onDelete={handleRemove}
                    className='doubleModal'
                    locale={locale}
                    title={translations(locale)?.delete}
                >
                    {translations(locale)?.delete_confirmation}
                    <br />
                    <br />
                    {translations(locale)?.delete_confirmation_description}
                </DeleteModal>

            }
            {
                showStudentAddModal &&
                <StudentAddModal
                    group={selectedTableId}
                    modalClassName='doubleModal'
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                />
            }
        </Modal>
    )
}

export default EditClub