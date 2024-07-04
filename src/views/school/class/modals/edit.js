import { Link } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add';
import React, { useRef, useState } from 'react'
import message from 'modules/message'
import { Modal } from 'react-bootstrap'
import _ from 'lodash';
import { toast } from "react-toastify";
import { NDropdown as Dropdown } from 'widgets/Dropdown'
import secureLocalStorage from 'react-secure-storage';
import { useTranslation } from "react-i18next";
import styled from 'styled-components';
import Forms from 'modules/Form/Forms'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const EditClassModal = ({onClose, onSubmit, data}) => {
    const { t } = useTranslation();
    const formRef = useRef();

    const [loading, setLoading] = useState(false)

    const [classList, setClassList] = useState([{value: '11', text: '111'}, {value: '22', text: 'asdf'}])
    const [teacherList, setTeacherList] = useState([{value: '11', text: '111'}, {value: '22', text: 'asdf'}])
    const [schoolShift, setSchoolShift] = useState([{value: '11', text: '111'}, {value: '22', text: 'asdf'}])
    const [scoreTypeList, setScoreTypeList] = useState([{value: '11', text: '111'}, {value: '22', text: 'asdf'}])
    const [gradeList, setGradeList] = useState([{value: '11', text: '111'}, {value: '22', text: 'asdf'}])
    const [roomList, setRoomList] = useState([{value: '11', text: '111'}, {value: '22', text: 'asdf'}])
    const [addAgain, setAddAgain] = useState(false)
    const [rows, setRows] = [{
        gradeId: null,
        className: '',
        teacherId: null,
        shiftId: null,
        scoreTypeId: null,
        roomId: null,
        // esisGroup: '',
        roomNumber: '',
    }]
    const wrapper = null

    const editClassFields = [
        {
            key: 'classClass',
            labelBold: true,
            value: '',
            type: 'nDropdown',
            search: true,
            label: t('className') + '*',
            required: true,
            errorMessage: t('error.selectClass'),
            className: "form-control",
            upperCase: true,
            formContainerClassName: 'form-group m-form__group row grid-item',
            fieldContainerClassName: 'col-6',
            labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
            options: classList,
        },
        {
            key: 'classGrade',
            labelBold: true,
            value: '',
            type: 'text',
            label: t('group.title') + '*',
            required: true,
            errorMessage: t('error.selectGrade'),
            className: "form-control",
            upperCase: true,
            formContainerClassName: 'form-group m-form__group row grid-item',
            fieldContainerClassName: 'col-6',
            labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
        },
        {
            key: 'classCurriculum',
            labelBold: true,
            value: '',
            type: 'nDropdown',
            label: t('group.curriculum') + '*',
            required: true,
            errorMessage: t('error.selectCurriculum'),
            className: "form-control",
            upperCase: true,
            formContainerClassName: 'form-group m-form__group row grid-item',
            fieldContainerClassName: 'col-6',
            labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
            options: gradeList,
        },
        // {
        //     key: 'classTeacher',
        //     labelBold: true,
        //     value: '',
        //     type: 'nDropdown',
        //     label: t('group.class_teacher'),
        //     className: "form-control",
        //     upperCase: true,
        //     formContainerClassName: 'form-group m-form__group row grid-item',
        //     fieldContainerClassName: 'col-6',
        //     labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
        //     options: teacherList,
        //     clearable: true,
        // },
        {
            key: 'classShift',
            labelBold: true,
            value: '',
            type: 'nDropdown',
            search: true,
            label: t('group.school_shift') + '*',
            required: true,
            errorMessage: t('error.selectShift'),
            className: "form-control",
            upperCase: true,
            formContainerClassName: 'form-group m-form__group row grid-item',
            fieldContainerClassName: 'col-6',
            labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
            options: schoolShift,
        },
        // {
        //     key: 'classEvaluation',
        //     labelBold: true,
        //     value: '',
        //     type: 'nDropdown',
        //     label: t('group.score_type') + '*',
        //     required: true,
        //     errorMessage: t('error.selectEvaluationType'),
        //     className: "form-control",
        //     upperCase: true,
        //     formContainerClassName: 'form-group m-form__group row grid-item',
        //     fieldContainerClassName: 'col-6',
        //     labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
        //     options: scoreTypeList,
        // },
        // {
        //     key: 'classRoom',
        //     labelBold: true,
        //     value: '',
        //     type: 'nDropdown',
        //     label: t('group.classroom'),
        //     className: "form-control",
        //     upperCase: true,
        //     formContainerClassName: 'form-group m-form__group row grid-item',
        //     fieldContainerClassName: 'col-6',
        //     labelClassName: "col-4 text-right label-pinnacle-bold mr-0",
        //     options: roomList,
        //     clearable: true,
        // },
    ]

    const handleCheckbox = () => {
        setAddAgain(true)
    }

    const handleSubmit = () => {
        console.log('submit')

        const [formsValid, formValues] = formRef.current.validate();

        if (formsValid) {
            const dataCollectorArray = []
            for (let x=0;x<formValues.length;x++) {
                dataCollectorArray.push({key: formValues[x].key, value: formValues[x].value, options: formValues[x].options })
            }
            console.log(dataCollectorArray)
            message('success', true)
            // after success \/
            // onClose()
            // setLoading(true)
            // console.log(dataCollectorArray)
        } 
        else{
            message(t('err.fill_all_fields'))
        } 
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
                    {t('action.edit')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col">
                        <div className="form-group m-form__group row mb-0">
                            <Forms
                                ref={formRef}
                                fields={editClassFields}
                            />
                        </div>
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
                    className="btn m-btn--pill btn-success text-uppercase"
                >
                    {t('save')}
                </button>
            </Modal.Footer>
            {
                loading
                    ?
                    <div>
                        <div className="blockUI blockOverlay" />
                        <div className="blockUI blockMsg blockPage">
                            <div className="m-loader m-loader--brand m-loader--lg" />
                        </div>
                    </div>
                    :
                    null
            }
        </Modal>
    )
}

export default EditClassModal