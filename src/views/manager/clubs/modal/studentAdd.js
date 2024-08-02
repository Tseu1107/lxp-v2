import message from 'modules/message'
import { cloneDeep } from 'lodash'
import { Col, Row } from 'react-bootstrap'
import AddIcon from '@mui/icons-material/Add'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { Checkbox } from 'semantic-ui-react'
import { Modal } from 'react-bootstrap'
// import { managerClubStudentAdd } from 'utils/fetchRequest/Urls'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'
// import { fetchRequest } from 'utils/fetchRequest'
import { NDropdown as Dropdown } from 'widgets/Dropdown'
import { useTranslation } from 'react-i18next'

const studentAdd = ({ onClose, group, onSubmit, modalClassName }) => {

    const { t } = useTranslation()
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const [gradeOptions, setGradeOptions] = useState([
        {
            id: "2116",
            name: "Бага анги",
            code: "PRIMARY",
            classOptions: [
                {
                    value: "11715",
                    text: "h",
                    details: {
                        gradeId: "2117",
                        gradeCode: "1",
                        gradeName: "1-р анги",
                        classId: "11715",
                        className: "h"
                    },
                    studentOptions: [
                        {
                            value: "234881",
                            text: "nasanjargal",
                            code: "02315",
                            studentId: "246413",
                            firstName: "nasanjargal",
                            lastName: "nasanbayr"
                        }
                    ]
                },
                {
                    value: "9974",
                    text: "1А",
                    details: {
                        gradeId: "2117",
                        gradeCode: "1",
                        gradeName: "1-р анги",
                        classId: "9974",
                        className: "1А"
                    },
                    studentOptions: []
                },
                {
                    value: "11789",
                    text: "9А",
                    details: {
                        gradeId: "2126",
                        gradeCode: "9",
                        gradeName: "9-р анги",
                        classId: "11789",
                        className: "9А"
                    },
                    studentOptions: []
                }
            ],
            value: "2122",
            text: "Дунд анги",
            ids: [
                "2123",
                "2124",
                "2125",
                "2126"
            ],
            classes: [
                {
                    value: "5300",
                    text: "8А",
                    students: []
                }
            ]
        },
        {
            id: "3985",
            name: "Цэцэрлэг",
            code: "KINDERGARTEN",
            classOptions: [
                {
                    value: "11822",
                    text: "ENGLISH",
                    details: {
                        gradeId: "3986",
                        gradeCode: "KINDER_HIGH",
                        gradeName: "Ахлах бүлэг",
                        classId: "11822",
                        className: "ENGLISH"
                    },
                    studentOptions: []
                }
            ],
            value: "3985",
            text: "Цэцэрлэг",
            ids: [
                "3986",
                "3987"
            ],
            classes: []
        }
    ])
    const [rows, setRows] = useState([{
        grade: null,
        class: null,
        isAll: false,
        students: [],
    }])

    // useEffect(() => {
    //     setLoading(true)
    //     fetchRequest(managerClubStudentAdd, 'POST', { group })
    //         .then((res) => {
    //             if (res.success) {
    //                 const { gradesWithClassStudents } = res.data
    //                 setGradeOptions(gradesWithClassStudents || [])
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
        if (validateFields()) {
            const clone = cloneDeep(rows)
            clone?.forEach(el => { delete el?.classOptions, delete el?.studentOptions })
            onSubmit(clone)
        }
    }

    const validateFields = () => {
        if (!rows?.every(el => { return el?.grade && el?.class && el?.students?.length }))
            return message(translations(locale)?.err?.fill_all_fields)
        else if (rows?.length != new Set(rows?.map(el => el?.class))?.size)
            return message(translations(locale)?.club?.duplicateClasses)
        else
            return true
    }

    const handleGradeChange = ({ value: grade, options } = data, index) => {
        const classOptions = options?.find(el => el?.value == grade)?.classOptions
        const clone = [...rows]
        clone[index].grade = grade
        clone[index].class = null
        clone[index].details = null
        clone[index].classOptions = classOptions
        clone[index].students = []
        clone[index].studentOptions = []
        setRows(clone)
    }

    const handleClassChange = ({ value, options } = data, index) => {
        const selectedClass = options?.find(el => el?.value == value)
        const clone = [...rows]
        clone[index].class = value
        clone[index].details = selectedClass?.details
        clone[index].students = []
        clone[index].studentOptions = selectedClass?.studentOptions
        setRows(clone)
    }

    const handleStudentChange = (student, index) => {
        const clone = [...rows]
        clone[index].students = student
        clone[index].isAll = clone[index]?.studentOptions?.length == student?.length ? true : false
        setRows(clone)
    }

    const handleCheckBoxChange = (checked, index) => {
        const clone = [...rows]
        if (checked) rows[index].students = rows[index]?.studentOptions?.map(el => el?.value)
        else rows[index].students = []
        rows[index].isAll = checked
        setRows(clone)
    }

    const handleRowAdd = () => {
        setRows([...rows, { grade: null, class: null, isAll: false, students: [] }])
    }

    const handleRowRemove = index => {
        if (rows?.length > 1) {
            const clone = [...rows]
            clone?.splice(index, 1)
            setRows(clone)
        }
    }

    return (
        <Modal
            dimmer='blurring'
            show={true}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            onHide={onClose}
            className={modalClassName}
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('movement.add')}
                </Modal.Title>
            </Modal.Header>
            {/* <div className='header'>
                {translations(locale)?.movement?.add}
                <button type='button' className='close' aria-label='Close' onClick={onClose}>
                    <CloseIcon />
                </button>
            </div> */}
            <Modal.Body>
                {
                    rows?.map((row, index) => (
                        <Row key={index} className='my-2'>
                            <Col>
                                <Row className='align-items-center'>
                                    <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                        {translations(locale)?.grade}*
                                    </Col>
                                    <Col>
                                        <Dropdown
                                            fluid
                                            selection
                                            closeOnChange
                                            value={row?.grade}
                                            options={gradeOptions || []}
                                            placeholder={`- ${translations(locale)?.select} -`}
                                            onChange={(e, data) => handleGradeChange(data, index)}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col>
                                <Row>
                                    <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                        {translations(locale)?.class?.title}*
                                    </Col>
                                    <Col>
                                        <Dropdown
                                            fluid
                                            search
                                            selection
                                            closeOnChange
                                            value={row?.class}
                                            options={row?.classOptions || []}
                                            placeholder={`- ${translations(locale)?.select} -`}
                                            onChange={(e, data) => handleClassChange(data, index)}
                                        />
                                        <Checkbox
                                            className='mt-2 text-grey'
                                            style={{fontSize: '14px'}}
                                            checked={row?.isAll}
                                            label={translations(locale)?.finance?.select_all_students}
                                            onChange={(e, data) => handleCheckBoxChange(data?.checked, index)}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col>
                                <Row className='align-items-center'>
                                    <Col md={4} className='col-form-label text-right label-pinnacle-bold'>
                                        {translations(locale)?.student?.title}*
                                    </Col>
                                    <Col>
                                        <Dropdown
                                            fluid
                                            search
                                            multiple
                                            selection
                                            value={row?.students}
                                            options={row?.studentOptions || []}
                                            placeholder={`- ${translations(locale)?.select} -`}
                                            onChange={(e, data) => handleStudentChange(data?.value, index)}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <div className='d-flex gap-05' style={{ width: 90 }}>
                                <button
                                    onClick={() => handleRowRemove(index)}
                                    className={`${rows?.length > 1 ? 'visible' : 'invisible'}  btn btn-danger m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex justify-content-center align-items-center`}>
                                    <CloseIcon />
                                </button>
                                {
                                    rows?.length == index + 1 &&
                                    <button onClick={handleRowAdd}
                                        className="btn btn-outline-info m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex justify-content-center align-items-center"
                                    >
                                        <AddIcon />
                                    </button>
                                }
                            </div>
                        </Row>
                    ))
                }
            </Modal.Body>
            <Modal.Footer className="text-center">
                <button
                    className='btn btn-sm m-btn--pill btn-outline-metal text-uppercase mr-3'
                    onClick={onClose}
                >
                    {translations(locale)?.close}
                </button>
                <button
                    className='btn btn-sm m-btn--pill btn-success text-uppercase'
                    onClick={handleSubmit}
                >
                    {translations(locale)?.movement?.add}
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
        </Modal >
    )
}

export default studentAdd