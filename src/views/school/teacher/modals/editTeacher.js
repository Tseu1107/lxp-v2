import { useState } from 'react'
import message from 'Src/message'
import React, { useEffect } from 'react'
import { Modal } from 'semantic-ui-react'
import ImageModal from 'Utilities/imageModal'
import { schoolTeacherEdit } from 'Utilities/url'
import secureLocalStorage from 'react-secure-storage'
import { fetchRequest } from 'Utilities/fetchRequest'
import { translations } from 'Utilities/translations'
import { NDropdown as Dropdown } from 'Widgets/Dropdown'
import CloseIcon from '@mui/icons-material/Close';

const EditTeacherModal = ({onClose, onSubmit, data}) => {

    const teacherId = data
    console.log(teacherId?.state?.id)

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)
    const [viewImageModal, setViewImageModal] = useState(false)

    const [teacher, setTeacher] = useState({})

    const [roleOptions, setRoleOptions] = useState([])
    const [gradeOptions, setGradeOptions] = useState([])
    const [gradeSubjectOptions, setGradeSubjectOptions] = useState([])

    const [updateView, setUpdateView] = useState(false)

    const [genderOptions] = useState([
        {
            value: 'M',
            text: translations(locale).male,
        },
        {
            value: 'F',
            text: translations(locale).female,
        }
    ])
    useEffect(() => {
        if (!teacherId?.state?.id) {
            message(translations(locale)?.course_select_teacher)
            navigate('/school/teachers', { replace: true })
        }
    }, [])

    useEffect(() => {
        setLoading(true)
        fetchRequest(schoolTeacherEdit, 'POST', { teacher: teacherId?.state?.id, menu: 'teacher' })
            .then((res) => {
                if (res.success) {
                    const { roleLists, gradeWithSubjects, grades, teacherData } = res.data
                    setRoleOptions(roleLists || [])
                    setGradeOptions(grades || [])
                    setTeacher({ ...teacherData, grade: teacherData?.gradeId } || {})
                    teacherData?.subjects?.map(subject => { gradeWithSubjects?.map(option => { if (option.value == subject.grade) option.disabled = true }) })

                    const gradeRows = (gradeWithSubjects || []).map(obj => {
                        obj.visible = obj?.teacherSubjects?.length > 0;
                        return obj;
                    });
                    setGradeSubjectOptions(gradeRows)
                } else {
                    message(res.data.message)
                }
                setLoading(false)
            })
            .catch(() => {
                message(translations(locale)?.err?.error_occurred)
                setLoading(false)
            })
    }, [])

    const handleSubmit = () => {
        if (validateFields()) {
            setLoading(true)
            const subjectList = gradeSubjectOptions.map(el => {
                if (el && el.visible) {
                    return { grade: el.value, subjects: el.teacherSubjects?.map(obj => el.value + '_s_' + obj) }
                }
            });

            const params = {
                ...teacher,
                subjects: JSON.stringify(subjectList),
                submit: 1,
                teacher: teacherId?.state?.id,
                photo: teacher?.avatar?.startsWith('data') ? teacher?.avatar : null
            }
            fetchRequest(schoolTeacherEdit, 'POST', params)
                .then((res) => {
                    if (res.success) {
                        message(res.data.message, true)
                        onSubmit()
                        onClose()
                    } else {
                        message(res.data.message)
                    }
                    setLoading(false)
                })
                .catch(() => {
                    message(translations(locale)?.err?.error_occurred)
                    setLoading(false)
                })
        }
    }

    const handleChange = (name, value) => {
        setTeacher({ ...teacher, [name]: value })
    }

    const handleAvatarUpload = params => {
        setTeacher({ ...teacher, avatar: params.image, fileType: params.imageType, })
    }

    const handleAvatarRemove = () => {
        setTeacher({ ...teacher, avatar: undefined, fileType: undefined, })
    }

    const validateFields = () => {
        const list = gradeSubjectOptions;
        let hasError = false
        if (list?.length > 0) {
            for (let l = 0; l < list?.length; l++) {
                if (list[l].visible) {
                    if (list[l].value) {
                    } else {
                        hasError = true;
                        break;
                    }
                }
            }
        }
        if (!teacher?.lastName || !teacher?.firstName || !teacher?.code || !teacher?.phoneNumber || !teacher?.gender || !teacher?.title || !teacher?.grade)
            return message(translations(locale).err.fill_all_fields)
        else if (hasError)
            return message(translations(locale).err.fill_all_fields)
        else
            return true
    }

    const handleRowGradeChange = (index, value, options) => {
        const rows = [...gradeSubjectOptions]
        rows[index].visible = true;
        if (value) {
            rows[index].value = value
        } else {
            rows[index].value = null
            rows[index].teacherSubjects = []
        }
        setGradeSubjectOptions(rows)

        setUpdateView(!updateView)
    }

    const handleRowSubjectsChange = (index, value, list) => {
        const rows = [...gradeSubjectOptions]

        const selectedList = []
        for (let l = 0; l < list?.length; l++) {
            if (value.indexOf(list[l]?.value) > -1) {
                selectedList.push(list[l].subject)
            }
        }
        rows[index].teacherSubjects = selectedList
        setGradeSubjectOptions(rows)
    }

    const addGradeRow = () => {
        if (gradeSubjectOptions?.length > 0) {
            const clone = [...gradeSubjectOptions];
            let lastVisibleRow = -1;
            let nonVisiblePrevRow = -1;
            for (let g = 0; g < clone?.length; g++) {
                if (clone[g].visible) {
                    lastVisibleRow = g;
                } else {
                    if (nonVisiblePrevRow === -1) {
                        nonVisiblePrevRow = g;
                    }
                }
            }

            if (lastVisibleRow < gradeSubjectOptions.length - 1) {
                clone[lastVisibleRow + 1].visible = true;
            } else {
                if (nonVisiblePrevRow > -1) {
                    clone[nonVisiblePrevRow].visible = true;
                }
            }
            setGradeSubjectOptions(clone)
        }
    }

    const removeGradeRow = index => {
        if (index != 0) {
            const rows = [...gradeSubjectOptions]
            rows[index].visible = false
            rows[index].teacherSubjects = []
            setGradeSubjectOptions(rows)
        }
    }

    return (
        <Modal
            size='large'
            dimmer='blurring'
            open={true}
            onClose={onClose}
            className='react-modal overflow-modal'
            centered
        >
            <div className="header" locale={locale}>
                {translations(locale)?.teacher?.edit}
                <button type="button" className="close" aria-label="Close" onClick={onClose} >
                    <CloseIcon />
                </button>
            </div>
            <div className="content">
                <div className="row mt-4">
                    <div className="col-3 d-flex flex-column align-items-center" style={{ gap: 10 }}>
                        <img
                            className="img-responsive img-circle"
                            src={teacher?.avatar || '/images/placeholder.jpg'}
                            onError={(e) => {
                                e.target.onError = null
                                e.target.src = '/images/avatar.png'
                            }}
                            width={150}
                            height={150}
                        />
                        <button
                            onClick={() => setViewImageModal(true)}
                            className="btn m-btn--pill btn-outline-primary"
                            style={{ width: 150 }}
                        >
                            {translations(locale)?.teacher?.change_photo}
                        </button>
                        <button
                            onClick={handleAvatarRemove}
                            className="btn m-btn--pill btn-outline-danger "
                            style={{ width: 150 }}
                        >
                            {translations(locale)?.profile?.img_delete}
                        </button>
                    </div>
                    <div className="col-6">
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {translations(locale)?.role}*
                            </label>
                            <div className="col-8">
                                <Dropdown
                                    placeholder={'-' + translations(locale)?.select + '-'}
                                    fluid
                                    selection
                                    additionPosition='bottom'
                                    upward={false}
                                    closeOnChange
                                    selectOnBlur={false}
                                    value={teacher?.roleId}
                                    options={roleOptions}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {translations(locale)?.teacher?.code}*
                            </label>
                            <div className="col-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={teacher?.code || ''}
                                    placeholder={translations(locale)?.teacher?.code}
                                    onChange={(e) => handleChange('code', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {translations(locale)?.teacher?.new_lastname}*
                            </label>
                            <div className="col-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={teacher?.lastName || ''}
                                    placeholder={translations(locale)?.teacher?.new_lastname_placeholder}
                                    onChange={(e) => handleChange('lastName', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {translations(locale)?.teacher?.new_name}*
                            </label>
                            <div className="col-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={teacher?.firstName || ''}
                                    placeholder={translations(locale)?.teacher?.new_name_placeholder}
                                    onChange={(e) => handleChange('firstName', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {translations(locale)?.register_number}
                            </label>
                            <div className="col-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={teacher?.registrationNumber || ''}
                                    placeholder={translations(locale)?.register_number}
                                    onChange={(e) => handleChange('registrationNumber', e?.target?.value?.toString()?.toUpperCase()?.replace(/\s/g, ''))}
                                />
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {translations(locale)?.teacher?.login_name}*
                            </label>
                            <div className="col-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={teacher?.loginName || ''}
                                    placeholder={translations(locale)?.teacher?.login_name}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {translations(locale)?.studentBook?.email}
                            </label>
                            <div className="col-8">
                                <input
                                    type="email"
                                    className="form-control"
                                    value={teacher?.email || ''}
                                    placeholder={translations(locale)?.e_mail}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {translations(locale)?.teacher?.phone_number}*
                            </label>
                            <div className="col-8">
                                <input
                                    type="number"
                                    max={99999999}
                                    className="form-control"
                                    value={teacher?.phoneNumber || ''}
                                    placeholder={translations(locale)?.teacher?.phone_number}
                                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                                    inputMode="numeric"
                                />

                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {translations(locale)?.teacher?.gender}*
                            </label>
                            <div className="col-8">
                                <Dropdown
                                    placeholder={'-' + translations(locale)?.teacher?.select_gender + '-'}
                                    fluid
                                    selection
                                    additionPosition='bottom'
                                    upward={false}
                                    closeOnChange
                                    selectOnBlur={false}
                                    value={teacher?.gender}
                                    options={genderOptions}
                                    onChange={(e, data) => handleChange('gender', data?.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {translations(locale)?.school}*
                            </label>
                            <div className="col-8">
                                <Dropdown
                                    placeholder={'-' + translations(locale)?.teacher?.select_school + '-'}
                                    fluid
                                    selection
                                    additionPosition='bottom'
                                    upward={false}
                                    closeOnChange
                                    selectOnBlur={false}
                                    value={teacher?.grade}
                                    options={gradeOptions}
                                    onChange={(e, data) => handleChange('grade', data?.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group m-form__group row">
                            <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                {translations(locale)?.teacher?.teacher_title}*
                            </label>
                            <div className="col-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={teacher?.title || ''}
                                    placeholder={translations(locale)?.teacher?.insert_teacher_title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                />
                            </div>
                        </div>
                        {
                            gradeSubjectOptions?.map((gradeSubjectObj, s) => {
                                const renderRow = gradeSubjectObj?.visible || (gradeSubjectObj?.teacherSubjects?.length > 0);
                                return renderRow && <div key={s} className="form-group m-form__group row">
                                    <label className="col-4 col-form-label text-right label-pinnacle-bold">
                                        {s === 0 && translations(locale)?.teacher?.subjects}
                                    </label>
                                    <div className="col-3">
                                        <Dropdown
                                            placeholder={'-' + translations(locale)?.err?.select_class + '-'}
                                            fluid
                                            selection
                                            additionPosition='bottom'
                                            upward={false}
                                            closeOnChange
                                            disabled={true}
                                            selectOnBlur={false}
                                            value={gradeSubjectObj?.value}
                                            options={gradeOptions}
                                            onChange={(e, data) => handleRowGradeChange(s, data?.value, data?.options)}
                                        />
                                    </div>
                                    <div className="col-5 p-0 d-flex align-items-center">
                                        <Dropdown
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
                                            value={gradeSubjectObj?.teacherSubjects?.map(obj => gradeSubjectObj?.value + '_s_' + obj) || []}
                                            options={gradeSubjectObj?.subjects}
                                            onChange={(e, data) => handleRowSubjectsChange(s, data?.value, gradeSubjectObj?.subjects)}
                                        />
                                        <div className={s != 0 ? 'visible' : 'invisible'}>
                                            <button onClick={() => removeGradeRow(s)} className='btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill'>
                                                <i className="la la-close" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            })
                        }
                        {
                            gradeSubjectOptions?.length > 0 &&
                            <div className="form-group m-form__group row">
                                <div className="col p-0 d-flex justify-content-end align-items-center">
                                    <button onClick={addGradeRow} className='btn btn-outline-info m-btn m-btn--icon btn-sm m-btn--icon-only m-btn--pill'>
                                        <i className="la la-plus" />
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div className="modal-footer justify-content-center">
                <button
                    onClick={onClose}
                    className="btn m-btn--pill btn-link margin-right-5"
                >
                    {translations(locale)?.back}
                </button>
                <button
                    onClick={handleSubmit}
                    className="btn m-btn--pill btn-success text-uppercase"
                >
                    {translations(locale)?.save}
                </button>
            </div>
            {
                viewImageModal &&
                <ImageModal
                    onClose={() => setViewImageModal(false)}
                    onSubmit={handleAvatarUpload}
                />
            }
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

export default EditTeacherModal