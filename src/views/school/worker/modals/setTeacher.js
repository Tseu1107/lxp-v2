import message from 'modules/message'
import { Modal } from 'react-bootstrap'
import React, { useState, useEffect, useRef } from 'react'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'
import Select from 'modules/Form/Select'
import {cloneDeep} from "lodash";

const setTeacher = ({ onClose, onSubmit, user }) => {
    const mainGradeRef = useRef()
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const [userTitle, setUserTitle] = useState('')
    const [selectedGrade, setSelectedGrade] = useState(null)
    const [mainGradeOptions, setMainGradeOptions] = useState([])
    const [gradeOptions, setGradeOptions] = useState([{value: '11', text: '111'}, {value: '22', text: 'asdf'}])
    const [gradeRows, setGradeRows] = useState([{
        grade: null,
        subjects: [],
        subjectOptions: []
    }])
    const [disabledGradeIds, setDisabledGradeIds] = useState([])
    const [updateView, setUpdateView] = useState(false)

    const handleSave = () => {
        console.log('submitSetTeacher')
        // const params = {
        //     employee: user,
        //     submit: 1,
        //     title: userTitle,
        //     grade: selectedGrade,
        //     subjects: JSON.stringify(gradeRows.map(el => ({ grade: el.grade, subjects: el.subjects }))),
        // }
        // setLoading(true)
        // fetchRequest(schoolStaffToTeacher, 'POST', params)
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, true)
        //             onClose();
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

    const handleRowSubjectsChange = (index, value) => {
        const rows = [...gradeRows]
        rows[index].subjects = value
        setGradeRows(rows)
    }

    const addGradeRow = () => {
        const rows = [...gradeRows];
        rows.push({
            grade: null,
            grades: gradeOptions,
            subjects: [],
            subjectOptions: []
        })
        setGradeRows(rows)
    }

    const onGradeChange = (value) => {
        setSelectedGrade(value)
    }

    const handleChange = (value) => {
        setUserTitle(value)
    }

    const removeGradeRow = index => {
        const disGrades = [...disabledGradeIds]
        if (index !== 0) {
            const rows = [...gradeRows]

            disGrades.splice(index, 1);
            setDisabledGradeIds(disGrades)

            rows.splice(index, 1)
            setGradeRows(rows)
        }
    }

    const handleRowGradeChange = (index, value) => {
        const rows = [...gradeRows]
        const disGrades = [...disabledGradeIds]

        for (let r = 0; r < rows?.length; r++) {
            if (r === index) {
                let rowObj = rows[r];

                if (value) {
                    const selectedGrade = gradeOptions.find(gradeObj => gradeObj.value === value)
                    rowObj.subjectOptions = selectedGrade?.subjects || [];
                    rowObj.grade = value;
                    if (disGrades.indexOf(value) > -1) {
                        // already disabled
                    } else {
                        disGrades.push(value)
                        setDisabledGradeIds(disGrades)
                    }
                } else {
                    rowObj.subjectOptions = [];
                    rowObj.grade = null;
                    rowObj.subjects = [];
                    if (disGrades.indexOf(value) > -1) {
                        // already disabled
                        disGrades.splice(disGrades.indexOf(value), 1);
                        setDisabledGradeIds(disGrades)
                    }
                }
                break;
            }
        }
        setGradeRows(rows)
    }

    const getRowGrades = (options = []) => {
        if (options && options.length > 0) {
            for (let o = 0; o < options.length; o++) {
                if (disabledGradeIds.indexOf(options[o].value) > -1) {
                    options[o].disabled = true;
                } else {
                    options[o].disabled = false;
                }
            }
        }
        return options
    }

    return (
        <Modal
            centered
            show={true}
            onHide={onClose}
            size='lg'
            dimmer='blurring'
            aria-labelledby="contained-modal-title-vcenter"
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {translations(locale)?.add_teacher_role}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-group m-form__group row">
                    <label className="col-3 col-form-label text-right label-pinnacle-bold">
                        {translations(locale)?.teacher?.teacher_title}*
                    </label>
                    <div className="col-8">
                        <input
                            type="text"
                            className="form-control"
                            value={userTitle || ''}
                            placeholder={translations(locale)?.teacher?.insert_teacher_title}
                            onChange={(e) => handleChange(e.target.value)}
                        />
                    </div>
                </div>
                <div className="form-group m-form__group row">
                    <label className="col-3 col-form-label text-right label-pinnacle-bold">
                        {translations(locale)?.school}*
                    </label>
                    <div className="col-8">
                        <Select
                            clearable
                            value={selectedGrade}
                            options={mainGradeOptions}
                            onchange={(e, data) => onGradeChange(e)}
                        />
                        {/* <Dropdown
                            ref={mainGradeRef}
                            placeholder={'-' + translations(locale)?.teacher?.select_school + '-'}
                            fluid
                            selection
                            additionPosition='bottom'
                            upward={false}
                            closeOnChange
                            clearable
                            selectOnBlur={false}
                            value={selectedGrade}
                            options={mainGradeOptions}
                            onChange={(e, data) => onGradeChange(data?.value)}
                        /> */}
                    </div>
                </div>
                {
                    gradeRows?.map((el, index) => (
                        <div key={index} className="form-group m-form__group row">
                            <label className="col-3 col-form-label text-right label-pinnacle-bold">
                                {index == 0 && translations(locale)?.teacher?.subjects}
                            </label>
                            <div className="col-3">
                                <Select
                                    clearable
                                    value={el?.grade}
                                    options={gradeOptions}
                                    onchange={(e, data) => handleRowGradeChange(index, data)}
                                />
                                {/* <Dropdown
                                    placeholder={'-' + translations(locale)?.err?.select_class + '-'}
                                    fluid
                                    selection
                                    additionPosition='bottom'
                                    upward={false}
                                    closeOnChange
                                    clearable
                                    selectOnBlur={false}
                                    value={el?.grade}
                                    options={getRowGrades(gradeOptions || [])}
                                    onChange={(e, data) => handleRowGradeChange(index, data?.value)}
                                /> */}
                            </div>
                            <div className="col-5 p-0 d-flex align-items-center">
                                <Select
                                    // searchable = {true}
                                    // className='mr-2'
                                    value={el?.subjects}
                                    options={el?.subjectOptions}
                                    onchange={(e, data) => handleRowGradeChange(index, data)}
                                />
                                {/* <Dropdown
                                    placeholder={'-' + translations(locale)?.absent?.select_subject + '-'}
                                    fluid
                                    selection
                                    additionPosition='bottom'
                                    upward={false}
                                    multiple={true}
                                    search
                                    className='mr-2'
                                    clearable
                                    selectOnBlur={false}
                                    value={el?.subjects}
                                    options={el?.subjectOptions}
                                    onChange={(e, data) => handleRowSubjectsChange(index, data?.value)}
                                /> */}
                                <div style={{marginLeft: "2.6rem"}} className={index != 0 ? 'visible' : 'invisible'}>
                                    <button onClick={() => removeGradeRow(index)} className='btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill'>
                                        <i className="la la-close" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                }
                {
                    gradeOptions?.length > gradeRows?.length &&
                    <div className="form-group m-form__group row">
                        <label className="col-3 col-form-label text-right label-pinnacle-bold" />
                        <div className="col-3" />
                        <div className="col-5 p-0 d-flex justify-content-end align-items-center">
                            <div className={'visible'}>
                                <button onClick={addGradeRow} className='btn btn-outline-info m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill'>
                                    <i className="la la-plus" />
                                </button>
                            </div>
                        </div>
                    </div>
                }
            </Modal.Body>
            <Modal.Footer className="text-center">
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
                    {translations(locale)?.save}
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
        </Modal>
    )
}

export default setTeacher