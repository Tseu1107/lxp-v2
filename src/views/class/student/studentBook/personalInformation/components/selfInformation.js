import message from 'modules/message'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import CustomInlineEdit from 'modules/CustomInlineEdit'
import { Col, Container, Row } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux'
import { fetchRequest } from 'utils/fetchRequest'
import { NDropdown as SimpleDropdown } from 'widgets/Dropdown'
import { Dropdown } from 'semantic-ui-react'
import { studentBookEdit } from 'utils/fetchRequest/Urls'

const selfInformation = ({ student, refresh, countries = [] }) => {
    const location = useLocation()

    const locale = "mn"
    const { t } = useTranslation();
    const { selectedSchool, selectedClass } = useSelector(state => state.schoolData);
    const [loading, setLoading] = useState(false)
    const [selectedCountry, setSelectedCountry] = useState(student?.schoolCountry || null)

    const handleSubmit = (name, value) => {
        setLoading(true)
        fetchRequest(studentBookEdit, 'POST', { school: selectedSchool?.id, student: student?.id, column: name, value, id: student?.id, type: 'information' })
            .then(res => {
                if (res.success) {
                    message(res?.message, true)
                    refresh()
                } else {
                    message(res?.message)
                }
                setLoading(false)
            })
            .catch(() => {
                message(t('err.error_occurred'))
                setLoading(false)
            })
    }

    return (
        <>
            <div className='d-flex'>
                <span className='text-primary pinnacle-regular bolder fs-10'>
                    {t('studentBookNavs.student_info')}
                </span>
            </div>
            <div className='br-08 position-relative p-5 mt-2' style={{ border: '1px solid rgba(255, 91, 29, 0.1)' }}>
                <Container fluid className='pt-5'>
                    <Row>
                        <Col md={'auto'} className='d-flex'>
                            <img width={120} height={120}
                                className='img-responsive img-circle'
                                src={student?.avatar || '/img/profile/avatar.png'}
                                alt={`Photo of ${student?.firstName}`}
                                onError={(e) => {
                                    e.target.onError = null
                                    e.target.src = '/img/profile/avatar.png'
                                }}
                            />
                            <table style={{ color: '#3c3f42', marginLeft: 70 }}>
                                <tbody>
                                    <tr>
                                        <td className='py-1 pr-5 text-right bolder'>{t('student.family_name')}</td>
                                        <td>
                                            <CustomInlineEdit
                                                value={student?.familyName}
                                                onSaveClick={text => handleSubmit('familyName', text)}
                                                buttons={true}
                                                saveButtonClassName="schoolLogoInlineEditButton"
                                                discardButtonClassName="schoolLogoInlineEditButton"
                                                labelClassName="underline"
                                                wrapperClassName="d-flex"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='py-1 pr-5 text-right bolder'>{t('movement.last_name')}</td>
                                        <td>
                                            <CustomInlineEdit
                                                value={student?.lastName}
                                                onSaveClick={text => handleSubmit('lastName', text)}
                                                buttons={true}
                                                saveButtonClassName="schoolLogoInlineEditButton"
                                                discardButtonClassName="schoolLogoInlineEditButton"
                                                labelClassName="underline"
                                                wrapperClassName="d-flex"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='py-1 pr-5 text-right bolder'>{t('studentBook.name')}</td>
                                        <td>
                                            <CustomInlineEdit
                                                value={student?.firstName}
                                                onSaveClick={text => handleSubmit('firstName', text)}
                                                buttons={true}
                                                saveButtonClassName="schoolLogoInlineEditButton"
                                                discardButtonClassName="schoolLogoInlineEditButton"
                                                labelClassName="underline"
                                                wrapperClassName="d-flex"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='py-1 pr-5 text-right bolder'>{t('student.birth_date')}</td>
                                        <td>
                                            <CustomInlineEdit
                                                value={student?.birthDate}
                                                onSaveClick={text => handleSubmit('birthDate', text)}
                                                buttons={true}
                                                saveButtonClassName="schoolLogoInlineEditButton"
                                                discardButtonClassName="schoolLogoInlineEditButton"
                                                labelClassName="underline"
                                                wrapperClassName="d-flex"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='py-1 pr-5 text-right bolder'>{t('gender')}</td>
                                        <td>
                                            <SimpleDropdown
                                                simple
                                                value={student?.gender}
                                                onChange={(e, data) => handleSubmit('gender', data?.value)}
                                                options={[
                                                    {
                                                        value: 'M',
                                                        text: t('male'),
                                                    },
                                                    {
                                                        value: 'F',
                                                        text: t('female'),
                                                    }
                                                ]}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='py-1 pr-5 text-right bolder'>{t('register_number')}</td>
                                        <td>
                                            <CustomInlineEdit
                                                value={student?.register}
                                                onSaveClick={text => {
                                                    handleSubmit('register', text)
                                                }}
                                                buttons={true}
                                                saveButtonClassName="schoolLogoInlineEditButton"
                                                discardButtonClassName="schoolLogoInlineEditButton"
                                                labelClassName="underline"
                                                wrapperClassName="d-flex"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='py-1 pr-5 text-right bolder'>{t('studentBook.birthCertNumber')}</td>
                                        <td>
                                            <CustomInlineEdit
                                                value={student?.birthCert}
                                                onSaveClick={text => handleSubmit('birthCert', text)}
                                                buttons={true}
                                                saveButtonClassName="schoolLogoInlineEditButton"
                                                discardButtonClassName="schoolLogoInlineEditButton"
                                                labelClassName="underline"
                                                wrapperClassName="d-flex"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='py-1 pr-5 text-right bolder'>{t('studentBook.healthInsuranceNumber')}</td>
                                        <td>
                                            <CustomInlineEdit
                                                value={student?.health}
                                                onSaveClick={text => handleSubmit('health', text)}
                                                buttons={true}
                                                saveButtonClassName="schoolLogoInlineEditButton"
                                                discardButtonClassName="schoolLogoInlineEditButton"
                                                labelClassName="underline"
                                                wrapperClassName="d-flex"
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Col>
                    </Row>
                </Container>
            </div>

            {
                selectedSchool?.isOnlineSchool && <>
                    <div className='d-flex mt-4'>
                        <span className='text-primary pinnacle-regular bolder fs-10'>
                            {t('common.schoolInfo')}
                        </span>
                    </div>
                    <div className='br-08 position-relative p-5 mt-2' style={{ border: '1px solid rgba(255, 91, 29, 0.1)' }}>
                        <Container fluid className='pt-5'>
                            <Row>
                                <Col md={'auto'} className='d-flex'>
                                    <table style={{ color: '#3c3f42', marginLeft: 190 }}>
                                        <tbody>
                                            <tr>
                                                <td className='py-1 pr-5 text-right bolder'>{t('common.schoolCountry')}</td>
                                                <td>
                                                    <Dropdown
                                                        fluid
                                                        selection
                                                        closeOnChange
                                                        value={selectedCountry}
                                                        options={countries?.map(obj => {
                                                            return {
                                                                value: obj?.id,
                                                                text: obj?.name
                                                            }
                                                        })}
                                                        placeholder={'-' + t('select') + '-'}
                                                        onChange={(e, data) => { 
                                                            setSelectedCountry(data?.value)
                                                            handleSubmit('schoolCountry', data?.value)
                                                         }}
                                                        style={{
                                                            minWidth: 250
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className='py-1 pr-5 pt-2 text-right bolder'>{t('studentBook.city')}</td>
                                                <td className='pt-2'>
                                                    <CustomInlineEdit
                                                        value={student?.schoolCity}
                                                        onSaveClick={text => handleSubmit('schoolCity', text)}
                                                        buttons={true}
                                                        saveButtonClassName="schoolLogoInlineEditButton"
                                                        discardButtonClassName="schoolLogoInlineEditButton"
                                                        labelClassName="underline"
                                                        wrapperClassName="d-flex"
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className='py-1 pr-5 text-right bolder'>{t('common.schoolName')}</td>
                                                <td>
                                                    <CustomInlineEdit
                                                        value={student?.schoolName}
                                                        onSaveClick={text => handleSubmit('schoolName', text)}
                                                        buttons={true}
                                                        saveButtonClassName="schoolLogoInlineEditButton"
                                                        discardButtonClassName="schoolLogoInlineEditButton"
                                                        labelClassName="underline"
                                                        wrapperClassName="d-flex"
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className='py-1 pr-5 text-right bolder'>{t('class_name')}</td>
                                                <td>
                                                    <CustomInlineEdit
                                                        value={student?.schoolClass}
                                                        onSaveClick={text => handleSubmit('schoolClass', text)}
                                                        buttons={true}
                                                        saveButtonClassName="schoolLogoInlineEditButton"
                                                        discardButtonClassName="schoolLogoInlineEditButton"
                                                        labelClassName="underline"
                                                        wrapperClassName="d-flex"
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className='py-1 pr-5 text-right bolder'>{t('school_settings.school_shift')}</td>
                                                <td>
                                                    <CustomInlineEdit
                                                        value={student?.schoolShift}
                                                        onSaveClick={text => handleSubmit('schoolShift', text)}
                                                        buttons={true}
                                                        saveButtonClassName="schoolLogoInlineEditButton"
                                                        discardButtonClassName="schoolLogoInlineEditButton"
                                                        labelClassName="underline"
                                                        wrapperClassName="d-flex"
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </>
            }
            {
                loading &&
                <div className='loader-container'>
                    <svg className="splash-spinner" viewBox="0 0 50 50">
                        <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
                    </svg>
                </div>
            }
        </>
    )
}

export default selfInformation