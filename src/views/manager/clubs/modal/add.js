import message from 'modules/message'
import React, { useEffect, useRef, useState } from 'react'
import secureLocalStorage from 'react-secure-storage'
// import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
import { Modal } from 'react-bootstrap'
import Forms from 'modules/Form/Forms'
import { useTranslation } from 'react-i18next'
// import { getTeachersBySubject, managerClubSubmit } from 'Utilities/url'

const AddClub = ({onClose}) => {

    const { t } = useTranslation()

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)
    const formRef = useRef()
    const [club, setClub] = useState({})

    const [typeOptions, setTypeOptions] = useState([])
    const [teacherOptions, setTeacherOptions] = useState([])
    const [subjectOptions, setSubjectOptions] = useState([])

    const addClubFields = [
        {
            key: 'clubSubjectType',
            label: `${t('subject.type')}*`,
            labelBold: true,
            value: club?.type || '',
            type: 'nDropdown',
            required: true,
            errorMessage: t('error.selectClubSubjectType'),
            className: "form-control",
            upperCase: true,
            formContainerClassName: 'form-group m-form__group row',
            fieldContainerClassName: 'col-6',
            labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
            options: typeOptions,
        },
        {
            key: 'clubName',
            label: `${t('club.title')}*`,
            className: "form-control",
            labelBold: true,
            value: club?.subject || '',
            type: 'nDropdown',
            required: true,
            errorMessage: t('error.selectClub'),
            formContainerClassName: 'form-group m-form__group row',
            fieldContainerClassName: 'col-6',
            labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
            options: subjectOptions,
        },
        {
            key: 'clubTeacher',
            label: `${t('teacher_title')}*`,
            labelBold: true,
            className: "form-control",
            value: club?.teacher || '',
            type: 'nDropdown',
            required: true,
            errorMessage: t('error.selectClubTeach'),
            formContainerClassName: 'form-group m-form__group row',
            fieldContainerClassName: 'col-6',
            labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
            options: teacherOptions,
        },
        {
            key: 'clubName',
            label: `${t('club.name')}*`,
            labelBold: true,
            className: "form-control",
            value: club?.teacher || '',
            type: 'text',
            placeholder: t('club.name'),
            required: true,
            errorMessage: t('error.enterClubName'),
            formContainerClassName: 'form-group m-form__group row',
            fieldContainerClassName: 'col-6',
            labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
        },
    ]
    // useEffect(() => {
    //     setLoading(true)
    //     fetchRequest(managerClubSubmit, 'POST')
    //         .then((res) => {
    //             if (res.success) {
    //                 const { types, subjects } = res.data
    //                 setTypeOptions(types || [])
    //                 setSubjectOptions(subjects || [])
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

    const handleSubmit = () => {
        console.log('handleSubmit')
        const [formsValid, formValues] = formRef.current.validate();
        if (formsValid) {
            const dataCollectorArray = []
            for (let x=0;x<formValues.length;x++) {
                dataCollectorArray.push({key: formValues[x].key, value: formValues[x].value, options: formValues[x].options})
            }
            // console.log(dataCollectorArray)
            // setClub(dataCollectorArray)
            message('success', true)

        } else {
            return message(t('err.fill_all_fields'))
        }

        // if (validateFields()) {
        //     setLoading(true)
        //     fetchRequest(managerClubSubmit, 'POST', { submit: 1, ...club })
        //         .then((res) => {
        //             if (res.success) {
        //                 message(res.data.message, res.success)
        //                 const { groupId } = res.data
        //                 navigate('/manager/clubs/edit', { state: { id: groupId, tab: 1 } })
        //             } else {
        //                 message(res.data.message)
        //             }
        //             setLoading(false)
        //         })
        //         .catch(() => {
        //             message(translations(locale)?.err?.error_occurred)
        //             setLoading(false)
        //         })
        // }
    }

    const handleSubjectChange = subject => {
        console.log('handleSubjectChange')
        // setLoading(true)
        // setClub({ ...club, subject, teacher: null })
        // fetchRequest(getTeachersBySubject, 'POST', { subject })
        //     .then((res) => {
        //         if (res.success) {
        //             const { teachers } = res.data
        //             setTeacherOptions(teachers?.map(el => ({ value: el?.teacherId, text: `${el?.firstName} (${el?.lastName}) - ${el?.teacherCode}` })) || [])
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

    const validateFields = () => {
        if (!club?.type || !club?.subject || !club?.teacher || !club?.name) return message(translations(locale).err.fill_all_fields)
        else return true
    }

    const handleChange = (name, value) => {
        setClub({ ...club, [name]: value })
    }

    return (
        <Modal
            dimmer='blurring'
            show={true}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            onHide={onClose}
            // className='react-modal overflow-modal'
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('add')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='m-portlet__body'>
                    <div className='form-group m-form__group row'>
                        <Forms
                            ref={formRef}
                            fields={addClubFields}
                        />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="text-center">
                <button 
                    onClick={onClose}
                    className="btn m-btn--pill btn-link m-btn m-btn--custom"
                >
                    {t('back')}
                </button>
                <button
                    onClick={handleSubmit}
                    className='btn m-btn--pill btn-publish text-uppercase'
                >
                    {translations(locale)?.club?.register_student}
                </button>
            </Modal.Footer>
            {
                loading &&
                <>
                    <div className='blockUI blockOverlay' />
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg' />
                    </div>
                </>
            }
        </Modal>
    )
}

export default AddClub