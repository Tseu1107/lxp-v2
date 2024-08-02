import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { Tab, Checkbox } from 'semantic-ui-react';
import { useSelector } from 'react-redux'
import message from "modules/message";
import AddIcon from '@mui/icons-material/Add';
import { NDropdown as Dropdown } from 'widgets/Dropdown';
import CloseIcon from '@mui/icons-material/Close';

import { fetchRequest } from 'utils/fetchRequest'
import { schoolSubjectTeacher, schoolClassStudents, managerGroupCreate } from 'utils/fetchRequest/Urls'

import secureLocalStorage from 'react-secure-storage';

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const AddGroup = ({ onClose, subjectList = [], classList = [] }) => {

    const { t } = useTranslation();
    const { selectedSchool } = useSelector(state => state.schoolData);

    const [loading, setLoading] = useState(false)

    const [modalTabIndex, setModalTabIndex] = useState(0)

    const [classSubjectRows, setClassSubjectRows] = useState([
        {
            subject: null,
            classes: [],
            selectedClasses: [],
            teachers: [],
            teacher: null
        }
    ])

    const [groupSubjectId, setGroupSubjectId] = useState(null)
    const [groupTeacherId, setGroupTeacherId] = useState(null)
    const [groupTeachers, setGroupTeachers] = useState([])
    const [groupName, setGroupName] = useState('')

    const [groupSubjectRows, setGroupSubjectRows] = useState([{
        class: null,
        students: [],
        selectedStudents: []
    }])

    const [showModalError, setShowModalError] = useState(false)

    const [addAgain, setAddAgain] = useState(false)
    const [closeWithReload, setCloseWithReload] = useState(false)

    const [groupTotalStudentCount, setGroupTotalStudentCount] = useState(0)
    const [updateView, setUpdateView] = useState(false)

    const onClassSubjectChange = (subjectId, rowIndex) => {
        let subjectRows = [...classSubjectRows];

        const selectedSubject = subjectList.find(obj => obj?.value === subjectId)

        subjectRows[rowIndex]['subject'] = subjectId;
        subjectRows[rowIndex]['classes'] = classList.filter(obj => {
            return selectedSubject?.gradeIds.indexOf(obj?.gradeId) > -1
        });
        subjectRows[rowIndex]['teacher'] = null;
        const params = {
            school: selectedSchool?.id,
            subject: subjectId
        }
        setLoading(true)
        fetchRequest(schoolSubjectTeacher, 'POST', params)
            .then((res) => {
                if (res.success) {
                    subjectRows[rowIndex]['teachers'] = res?.teachers || [];
                    setClassSubjectRows(subjectRows)
                } else {
                    message(res.message)
                }
                setLoading(false)
            })
            .catch(() => {
                message(t('err.error_occurred'))
                setLoading(false)
            })
    };

    const _onTabChange = (e, data) => {
        setModalTabIndex(data.activeIndex)
        setShowModalError(false)
    };

    const addClassSubjectRow = () => {
        setShowModalError(false)
        setClassSubjectRows([...classSubjectRows, {
            subject: null,
            classes: [],
            selectedClasses: [],
            teachers: [],
            teacher: null
        }])
    };

    const removeClassSubjectRow = (index) => {
        if (index != 0) {
            const rows = [...classSubjectRows]
            rows.splice(index, 1)
            setClassSubjectRows(rows)
        }
    }

    const onGroupSubjectChange = (e, data) => {
        const params = {
            school: selectedSchool?.id,
            subject: data?.value
        }
        setGroupSubjectId(data?.value)
        setGroupTeacherId(null)
        setGroupName('')
        setLoading(true)
        fetchRequest(schoolSubjectTeacher, 'POST', params)
            .then((res) => {
                if (res.success) {
                    setGroupTeachers(res?.teachers || [])
                } else {
                    message(res.message)
                }
                setLoading(false)
            })
            .catch((e) => {
                message(t('err.error_occurred'))
                setLoading(false)
            })
    };

    const loadClassStudents = (index, classId = null) => {
        const params = {
            school: selectedSchool?.id,
            class: classId
        }
        const clone = [...groupSubjectRows]
        clone[index].class = classId
        clone[index].students = []
        clone[index].selectedStudents = []

        setLoading(true)
        fetchRequest(schoolClassStudents, 'POST', params)
            .then((res) => {
                if (res.success) {
                    clone[index].students = res?.students;
                    setGroupSubjectRows(clone)

                    setUpdateView(!updateView)
                } else {
                    setGroupSubjectRows(clone)
                    message(res.message)
                }
                setLoading(false)
            })
            .catch((e) => {
                setGroupSubjectRows(clone)
                message(t('err.error_occurred'))
                setLoading(false)
            })
    };


    const onGroupTeacherChange = (e, data) => {
        const subjectName = getSubjects(false)?.find(el => el?.value == groupSubjectId)?.text?.split(' - ')[1]
        const teacherName = data?.options?.find(el => el?.value == data?.value)?.text?.split(' ( ')[0]
        setGroupTeacherId(data.value)
        setGroupName(subjectName + ' | ' + teacherName)
    }

    const addGroupSubjectRow = () => {
        setGroupSubjectRows([...groupSubjectRows, {
            class: null,
            allStudents: [],
            group_student: []
        }])
    }

    const calculateStudentCount = (rows = []) => {
        if (modalTabIndex === 1) {
            let totalStudentCount = 0;
            for (let i = 0; i < rows.length; i++) {
                totalStudentCount = totalStudentCount + rows[i].selectedStudents?.length;
            }
            setGroupTotalStudentCount(totalStudentCount)
        }
    }

    const removeGroupSubjectRow = (index) => {
        const rows = [...groupSubjectRows]
        rows.splice(index, 1)
        calculateStudentCount(rows)
        setGroupSubjectRows(rows)
    }

    const getGroupClasses = (rowClassId = null) => {
        const selectedSubject = subjectList.find(subject => subject.value == groupSubjectId);

        if (selectedSubject && selectedSubject.gradeIds) {
            const selectedClassIds = groupSubjectRows?.filter(obj => obj?.class)?.map(obj => obj?.class)

            return classList.filter(obj => {
                if (selectedClassIds?.length > 0) {
                    return selectedSubject?.gradeIds.indexOf(obj?.gradeId) > -1 && (rowClassId === obj?.id || selectedClassIds?.indexOf(obj?.id) < 0)
                } else {
                    return selectedSubject?.gradeIds.indexOf(obj?.gradeId) > -1
                }
            })?.map(obj => {
                return {
                    value: obj?.value,
                    text: obj?.text
                }
            })
        } else {
            return []
        }
    }

    const getSubjects = (isAll = false, rowSubjectId = null) => {
        let selectedSubjects = []
        if (isAll) {
            selectedSubjects = classSubjectRows?.filter(obj => obj?.subject)?.map(obj => obj?.subject)
        }
        return subjectList.filter(obj => {
            if (selectedSubjects?.length > 0) {
                return obj?.isAll === isAll && (rowSubjectId === obj?.value || selectedSubjects?.indexOf(obj?.value) < 0)
            } else {
                return obj?.isAll === isAll
            }
        })?.map(obj => {
            return {
                value: obj?.value,
                text: obj?.text
            }
        })
    }

    const _renderAll = () => {
        return (
            <>
                <div className="row">
                    <div className="col-lg-1 col-md-2">
                    </div>
                    <div className="col-lg-10 col-md-8">
                        <table className="table table-bordered newSubjectClassDatatable"
                            key={'newSubject_1'}>
                            <thead>
                                <tr>
                                    <th style={{ color: '#575962', fontSize: '12px', paddingLeft: '20px' }} className='bolder' width="30%">{t('timetable.subject') || null}</th>
                                    <th style={{ color: '#575962', fontSize: '12px', paddingLeft: '20px' }} className='bolder' width="20%">{t('group.title') || null}</th>
                                    <th style={{ color: '#575962', fontSize: '12px', paddingLeft: '20px' }} className='bolder' width="40%">{t('teacher.title') || null}</th>
                                    <th align='center' width="7%" />
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    classSubjectRows.map((obj, i) => {
                                        return (
                                            <tr key={'tr_' + i}>
                                                <td className="p-1">
                                                    <Dropdown
                                                        selectOnNavigation={false}
                                                        search
                                                        additionPosition='bottom'
                                                        className={showModalError && !obj['subject'] ? "has-error" : ""}
                                                        upward={false}
                                                        closeOnChange
                                                        selectOnBlur={false}
                                                        fluid
                                                        selection
                                                        placeholder={t('survey.choose') || null}
                                                        options={getSubjects(true, obj['subject'])}
                                                        value={obj['subject']}
                                                        onChange={(e, data) => onClassSubjectChange(data.value, i)}
                                                    />
                                                </td>
                                                <td className="p-1">
                                                    <Dropdown
                                                        selectOnNavigation={false}
                                                        search
                                                        additionPosition='bottom'
                                                        className={showModalError && obj['selectedClasses']?.length === 0 ? "has-error" : ""}
                                                        upward={false}
                                                        selectOnBlur={false}
                                                        fluid
                                                        selection
                                                        multiple={true}
                                                        placeholder={t('survey.choose') || null}
                                                        options={obj['classes']?.map(obj => {
                                                            return {
                                                                value: obj?.value,
                                                                text: obj?.text
                                                            }
                                                        })}
                                                        value={obj['selectedClasses'] || []}
                                                        onChange={(e, data) => {
                                                            let clone = [...classSubjectRows];
                                                            clone[i]['selectedClasses'] = data.value;
                                                            setClassSubjectRows(clone)
                                                        }}
                                                    />
                                                </td>
                                                <td className="p-1">
                                                    <Dropdown
                                                        selectOnNavigation={false}
                                                        search
                                                        additionPosition='bottom'
                                                        upward={false}
                                                        closeOnChange
                                                        selectOnBlur={false}
                                                        className={showModalError && !obj['teacher'] ? "has-error" : ""}
                                                        fluid
                                                        selection
                                                        multiple={false}
                                                        placeholder={t('survey.choose') || null}
                                                        options={obj['teachers']?.map(obj => {
                                                            return {
                                                                value: obj?.teacherId,
                                                                text: obj?.firstName + ' (' + obj?.lastName + ')-' + obj?.teacherCode
                                                            }
                                                        })}
                                                        value={obj['teacher']}
                                                        onChange={(e, data) => {
                                                            let clone = [...classSubjectRows];
                                                            clone[i]['teacher'] = data.value;
                                                            setClassSubjectRows(clone)
                                                        }}
                                                    />
                                                </td>
                                                <td className="text-center p-1 vertical-inherit">
                                                    {
                                                        i > 0
                                                            ?
                                                            <button
                                                                onClick={() => removeClassSubjectRow(i)}
                                                                className="btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center">
                                                                <CloseIcon />
                                                            </button>
                                                            : null
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                <tr>
                                    <td className="border-white" />
                                    <td className="border-white" />
                                    <td style={{ borderBottomColor: 'white' }} />
                                    <td className="text-center p-1 vertical-inherit">
                                        <button onClick={addClassSubjectRow}
                                            className="btn btn-outline-info m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex align-items-center justify-content-center"
                                        >
                                            <AddIcon />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="col-lg-1 col-md-2">
                    </div>
                </div>
            </>
        )
    }

    const _renderGroup = () => {
        return (
            <>
                <div className="form-group m-form__group row">
                    <label className="col-form-label col-md-4 col-sm-12 text-right label-pinnacle-bold">
                        {t('subject.title') || null}
                    </label>
                    <div className="col-md-5 col-sm-12">
                        <Dropdown
                            selectOnNavigation={false}
                            placeholder={'-' + t('survey.choose') + '-' || null}
                            fluid
                            selection
                            className={showModalError && !groupSubjectId ? "has-error" : ""}
                            search
                            additionPosition='bottom'
                            upward={false}
                            closeOnChange
                            selectOnBlur={false}
                            value={groupSubjectId}
                            options={getSubjects(false)}
                            onChange={onGroupSubjectChange}
                        />
                    </div>
                </div>
                <div className="form-group m-form__group row">
                    <label className="col-form-label col-md-4 col-sm-12 text-right label-pinnacle-bold">
                        {t('teacher.title') || null}
                    </label>
                    <div className="col-md-5 col-sm-12">
                        <Dropdown
                            selectOnNavigation={false}
                            placeholder={'-' + t('survey.choose') + '-' || null}
                            fluid
                            selection
                            className={showModalError && !groupTeacherId ? "has-error" : ""}
                            search
                            additionPosition='bottom'
                            upward={false}
                            closeOnChange
                            selectOnBlur={false}
                            value={groupTeacherId}
                            options={groupTeachers?.map(obj => {
                                return {
                                    value: obj?.teacherId,
                                    text: obj?.firstName + ' (' + obj?.lastName + ')-' + obj?.teacherCode
                                }
                            })}
                            onChange={onGroupTeacherChange}
                        />
                    </div>
                </div>
                <div className="form-group m-form__group row">
                    <label className="col-form-label col-md-4 col-sm-12 text-right label-pinnacle-bold">
                        {t('first_name') || null}
                    </label>
                    <div className="col-md-5 col-sm-12">
                        <input type="text"
                            className={showModalError && groupName?.length === 0 ? "form-control m-input has-error" : "form-control m-input"}
                            placeholder={t('insert_first_name') || null}
                            value={groupName || ''}
                            onChange={e => setGroupName(e?.target?.value)} />
                    </div>
                </div>

                <div className="form-group m-form__group row">
                    <div className="col-md-1">
                    </div>
                    <div className="col-md-10">
                        <table className="table newSubjectGroupDatatable">
                            <thead>
                                <tr>
                                    <th className="text-right pb-4" style={{ fontSize: '14px', color: '#575962' }}>{t('total') + ':' || null}
                                        &nbsp;
                                        {groupTotalStudentCount}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    groupSubjectRows.map((obj, i) => {
                                        return (
                                            <tr key={'tr_group_' + i}>
                                                <td style={{ verticalAlign: 'top' }} className="label-pinnacle-bold vertical-align-middle">
                                                    {t('group.title') || null}
                                                </td>
                                                <td className="p-2">
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
                                                        className={showModalError && !obj['class'] ? "has-error" : ""}
                                                        value={obj['class']}
                                                        options={getGroupClasses(obj.class)}
                                                        onChange={(e, data) => {
                                                            if (data?.value) {
                                                                loadClassStudents(i, data?.value)
                                                            } else {
                                                                const clone = [...groupSubjectRows]
                                                                clone[i].students = []
                                                                clone[i].class = null
                                                                clone[i].selectedStudents = []

                                                                setGroupSubjectRows(clone)
                                                            }
                                                        }}
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <Dropdown
                                                        selectOnNavigation={false}
                                                        placeholder={'-' + t('survey.choose') + '-' || null}
                                                        fluid
                                                        selection
                                                        search
                                                        additionPosition='bottom'
                                                        upward={false}
                                                        selectOnBlur={false}
                                                        multiple={true}
                                                        className={showModalError && !obj['selectedStudents']?.length ? "has-error" : ""}
                                                        value={obj['selectedStudents']}
                                                        options={obj['students']?.map(obj => {
                                                            return {
                                                                value: obj?.value,
                                                                text: obj?.text
                                                            }
                                                        })}
                                                        onChange={(e, data) => {
                                                            const clone = [...groupSubjectRows]
                                                            clone[i].selectedStudents = data?.value
                                                            calculateStudentCount(clone)
                                                            setGroupSubjectRows(clone)
                                                        }}
                                                    />
                                                </td>
                                                <td className="py-2">
                                                    {
                                                        i > 0
                                                            ?
                                                            <button
                                                                onClick={() => removeGroupSubjectRow(i)}
                                                                className="btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex justify-content-center align-items-center">
                                                                <CloseIcon />
                                                            </button>
                                                            : null
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                <tr>
                                    <td />
                                    <td />
                                    <td />
                                    <td width={100}>
                                        <button onClick={addGroupSubjectRow}
                                            className="btn btn-outline-info m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-inline-flex justify-content-center align-items-center"
                                        >
                                            <AddIcon />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-1">
                    </div>
                </div>
            </>
        )
    }

    const onClickSubmit = () => {
        let hasError = false;
        let params = {
            school: selectedSchool?.id,
            isAll: modalTabIndex === 0
        }
        if (modalTabIndex === 0) {
            // class group
            const rows = [...classSubjectRows]
            const classParams = []
            for (let r = 0; r < rows?.length; r++) {
                const rowObj = rows[r]
                if (!rowObj.subject) {
                    hasError = true;
                    break;
                }
                if (!rowObj?.selectedClasses || rowObj?.selectedClasses?.length === 0) {
                    hasError = true;
                    break;
                }
                if (!rowObj.teacher) {
                    hasError = true;
                    break;
                }
                classParams.push({
                    subject: rowObj?.subject,
                    classes: rowObj?.selectedClasses,
                    teacher: rowObj?.teacher
                })
            }
            params['classes'] = classParams;
        } else {
            // group 
            if (!groupSubjectId) {
                hasError = true;
            }
            if (!groupTeacherId) {
                hasError = true;
            }
            if (!groupName || groupName?.length === 0) {
                hasError = true;
            }

            const rows = [...groupSubjectRows]
            const groupParams = []
            for (let r = 0; r < rows?.length; r++) {
                const rowObj = rows[r]
                if (!rowObj.class) {
                    hasError = true;
                    break;
                }
                if (!rowObj?.selectedStudents || rowObj?.selectedStudents?.length === 0) {
                    hasError = true;
                    break;
                }
                groupParams.push({
                    class: rowObj?.class,
                    students: rowObj?.selectedStudents
                })
            }

            params['subject'] = groupSubjectId;
            params['teacher'] = groupTeacherId;
            params['groupName'] = groupName;
            params['classes'] = groupParams;
        }
        if (hasError) {
            setShowModalError(true)
            message(t('err.fill_all_fields'))
        } else {
            setLoading(true)
            fetchRequest(managerGroupCreate, 'POST', params)
                .then((res) => {
                    if (res.success) {
                        message(res.message, true)
                        if (modalTabIndex === 1 && addAgain) {
                            setCloseWithReload(true)
                            setGroupSubjectId(null)
                            setGroupTeacherId(null)
                            setGroupName('')
                            setGroupSubjectRows([
                                {
                                    class: null,
                                    students: [],
                                    selectedStudents: []
                                }
                            ])
                            setGroupTotalStudentCount(0)
                        } else {
                            onClose(true)
                        }
                    } else {
                        message(res.message)
                    }
                    setLoading(false)
                })
                .catch((e) => {
                    message(t('err.error_occurred'))
                    setLoading(false)
                });
        }
    }

    return (
        <Modal
            size='xl'
            dimmer='blurring'
            show={true}
            onHide={() => onClose(closeWithReload)}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{ padding: '1rem' }}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('add')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="myTimetable-addNewSubjectStyle">
                    <Tab
                        onTabChange={_onTabChange}
                        activeIndex={modalTabIndex}
                        menu={{ attached: false }}
                        panes={[
                            {
                                menuItem: t('timetable.class_student').toUpperCase(),
                                render: () => <Tab.Pane>
                                    {
                                        <div>
                                            {
                                                _renderAll()
                                            }
                                        </div>
                                    }
                                </Tab.Pane>
                            },
                            {
                                menuItem: t('timetable.group_student').toUpperCase(),
                                render: () => <Tab.Pane>
                                    {
                                        <div>
                                            {
                                                _renderGroup()
                                            }
                                        </div>
                                    }
                                </Tab.Pane>
                            },
                        ]}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer className='text-center'>
                {
                    modalTabIndex == 1 &&
                    <div className='align-center align-items-center' style={{ marginLeft: '17px', position: 'absolute', left: '1.5rem', bottom: '1.6rem' }}>
                        <label className="form-check-label font-mulish" htmlFor="reAdd" style={{ color: '#575962', fontSize: '14px', fontWeight: '400' }}>
                            <input
                                className="form-check-input form-modal-check"
                                id='reAdd'
                                type="checkbox"
                                style={{ borderRadius: '4px', fontSize: '18px', marginTop: '1px' }}
                                value={addAgain}
                                onChange={(e, data) => setAddAgain(e?.target?.checked)}
                            />&nbsp;&nbsp;{t('group.addAgain')}
                        </label>
                    </div>
                }
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

export default AddGroup