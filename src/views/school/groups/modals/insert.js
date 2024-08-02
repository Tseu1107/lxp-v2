import { useState } from 'react'
import message from 'modules/message'
import React, { useEffect } from 'react'
import { Modal } from 'react-bootstrap'
// import { schoolGroupEdit } from 'utils/fetchRequest/Urls'
import secureLocalStorage from 'react-secure-storage'
// import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
import { NDropdown as Dropdown } from "widgets/Dropdown"
import { useTranslation } from "react-i18next";
import AddIcon from '@mui/icons-material/Add';
import { Checkbox } from 'semantic-ui-react'

const InsertGroupModal = ({onClose, onSubmit, data}) => {

    const { t } = useTranslation()

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)
    const [staff, setStaff] = useState(false)
    const [classOptions, setClassOptions] = useState([{value: '11', text: '111', students: [{value: 'stu1', text: 'Im studnets 1'}, {value: '123829', text: 'Students2'}]},
     {value: '22', text: 'asdf', students: [{value: 'stu4', text: 'Im studnets 4'}, {value: '12382', text: 'Students6'}]}])
    const [details, setDetails] = useState([{
        index: 0,
        classId: null,
        studentIds: []
    }])

    // useEffect(() => {
    //     setLoading(true)
    //     fetchRequest(schoolGroupEdit, 'POST', { grade: location?.state?.grade, group: location?.state?.group })
    //         .then((res) => {
    //             if (res.success) {
    //                 const { classes, teacherData, students } = res.data
    //                 setClassOptions(classes || [])
    //                 setStaff(teacherData || {})
    //                 if(students && students.length > 0){
    //                     setDetails(students)
    //                 }
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

    const validateFields = () => {
        let error = false
        if(details && details.length > 0){
            for(let i = 0; i < details.length; i++){
                if(!details[i].classId){
                    message(translations(locale)?.finance.select_class, false)
                    error = true
                    break;
                } else if (details[i].studentIds == 0){
                    message(translations(locale)?.timetable.select_students, false)
                    error = true
                    break;
                }

                if(details[i].classId && details.find(data => data.classId == details[i].classId && data.index != details[i].index)){
                    message(translations(locale)?.err.class_duplicate, false)
                    error = true   
                    break;
                }
            }

            if(error){
                return false
            } else {
                return true
            }
        } else {
            return false
        }
    }

    const handleSubmit = () => {
        console.log('handleSubmit')
        // if (validateFields()) {
        //     setLoading(true)
        //     fetchRequest(schoolGroupEdit, 'POST', { 
        //         submit: 1, 
        //         group: location?.state?.group,
        //         details: JSON.stringify(details)
        //     })
        //         .then((res) => {
        //             if (res.success) {
        //                 message(res.data.message, true)
        //                 navigate('/school/groups')
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

    const classChange = (data, index) => {
        const cloneDetails = [...details]
        cloneDetails[index].classId = data.value;
        setDetails(cloneDetails)
    }

    const studentChange = (data, index) => {
        const cloneDetails = [...details]
        cloneDetails[index].studentIds = data.value;
        setDetails(cloneDetails)
    }

    const handleCheckBoxChange = (value, index) => {
        const cloneDetails = [...details]
        if(value){
            let cloneClassOptions = [...classOptions];
            let classData = cloneClassOptions.find(data => data.value == cloneDetails[index].classId)

            if(classData && classData.students && classData.students.length > 0){
                let allStudentIds = [];
                for(let i = 0; i < classData.students.length; i++){
                    allStudentIds.push(classData.students[i].value)
                }

                cloneDetails[index].studentIds = allStudentIds
            }
        } else {
            cloneDetails[index].studentIds = []
        }

        setDetails(cloneDetails)
    }

    const addRow = () => {
        let cloneDetails = [...details];
        cloneDetails.push({
            index: cloneDetails.length + 1,
            classId: null,
            studentIds: []
        })
        setDetails(cloneDetails)
    }

    const removeRow = (index) => {
        let cloneDetails = [...details];
        cloneDetails.splice(index, 1);
        setDetails(cloneDetails)
    }

    const getStudentValues = (classId) => {
        if(classId){
            let cloneClassOptions = [...classOptions];
            let classData = cloneClassOptions.find(data => data.value == classId)

            if(classData){
                return classData.students
            }
        }

        return []
    }

    return (
        <Modal
            dimmer='blurring'
            show={true}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            onHide={onClose}
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('student.register_student')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-12 form-group d-flex">
                        <label className="col-xxl-4 col-xl-4 col-form-label text-right label-pinnacle-bold">
                            {translations(locale)?.grade + ':'}
                        </label>
                        <input 
                            className="col-xxl-4 col-xl-4 col-form-label" 
                            style={{background: '#EBEDF2', border: '1px solid #EBEDF2', borderRadius: 4, height: '33px'}} 
                            disabled={true} 
                            placeholder={data ? data + "'s gradename" : 'gradename'}
                        />
                        <div className='col-4'/>
                    </div>
                    <div className='col-12'>
                        <table className='mt-4' width='100%'>
                            <thead>
                                <tr>
                                    <th width="150px" className='border-less text-left pl-4 label-pinnacle-bold'>
                                        {translations(locale).className || null}
                                    </th>
                                    <th className='border-less text-left pl-4 label-pinnacle-bold'>
                                        {translations(locale).students || null}
                                    </th>
                                    <th width="160" className='border-less text-left pl-4 label-pinnacle-bold'/>
                                    <th width="40" className='border-less' />
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    details && details.length > 0 &&
                                    details.map((row, i) => {
                                        return (
                                            <tr key={i} style={{border: '5px solid transparent'}}>
                                                <td>
                                                    <Dropdown
                                                        placeholder={'-' + translations(locale).select + '-' || ""}
                                                        fluid
                                                        selection
                                                        additionPosition='bottom'
                                                        style={{height: '33px'}}
                                                        upward={false}
                                                        closeOnChange
                                                        selectOnBlur={false}
                                                        value={row.classId}
                                                        options={classOptions || []}
                                                        onChange={(e, data) => classChange(data, i)}
                                                    />
                                                </td>
                                                <td>
                                                    <Dropdown
                                                        placeholder={'-' + translations(locale).select + '-' || ""}
                                                        fluid
                                                        selection
                                                        search
                                                        multiple
                                                        clearable
                                                        additionPosition='bottom'
                                                        style={{height: '33px'}}
                                                        upward={false}
                                                        closeOnChange
                                                        selectOnBlur={false}
                                                        options={getStudentValues(row.classId)}
                                                        value={row.studentIds}
                                                        onChange={(e, data) => studentChange(data, i)}
                                                    />
                                                </td>
                                                {/* <td>
                                                    <Checkbox
                                                        className='mt-2 col-form-label'
                                                        checked={row?.isAll}
                                                        label={translations(locale)?.select_all}
                                                        onChange={(e, data) => handleCheckBoxChange(data?.checked, i)}
                                                    />
                                                </td> */}
                                                <td>
                                                    <div className='pl-4'>
                                                        <label 
                                                            className="form-check-label font-mulish" 
                                                            htmlFor="selectAll" 
                                                            style={{ color: '#575962', fontSize: '14px', marginLeft: '10px'}}
                                                        >
                                                            <input 
                                                                className="form-check-input col-form-label" 
                                                                id='selectAll' type="checkbox" 
                                                                value={row?.isAll} 
                                                                onChange={(e, data) => handleCheckBoxChange(e.target.checked, i)}
                                                                style={{ borderRadius: '4px', height: '18px', width: '18px', marginTop: '1px'}} 
                                                            />&nbsp;&nbsp;{t('select_all')}
                                                        </label>
                                                    </div>
                                                </td>
                                                <td>
                                                    {
                                                        i > 0
                                                            ? 
                                                            <button 
                                                                onClick={() => removeRow(i)}
                                                                className="btn btn-danger m-btn m-btn--icon m-btn--icon-only m-btn--pill"
                                                                style={{height: '30px', width: '30px'}}
                                                            >
                                                                <i className="la la-remove" />
                                                            </button>
                                                            : null
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                {
                                    classOptions.length > details.length &&
                                    <tr>
                                        <td className="no-border" colSpan={3} />
                                        <td>
                                            <button
                                                onClick={addRow}
                                                className="btn btn-outline-info m-btn m-btn--icon m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center"
                                                style={{height: '30px', width: '30px'}}
                                            >
                                                <AddIcon />
                                            </button>
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
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
                    className="btn btn-sm m-btn--pill btn-success text-uppercase"
                    style={{margin: -4}}
                >
                    {t('save')}
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

export default InsertGroupModal