
import PersonalInformation from './personalInformation'
import Grade from './grade'
import Activity from './activity'
import ClubCount from './club'
import Payment from './payment'
import Others from './others'
import Sale from './sale'
import message from 'modules/message'
import SubHeader from 'modules/SubHeader'
import { cloneDeep } from 'lodash'
import { Tab } from 'semantic-ui-react'
import { useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { fetchRequest } from 'utils/fetchRequest'
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from 'react-router-dom';
import { NDropdown as SimpleDropdown } from 'widgets/Dropdown'
import { Dropdown } from 'semantic-ui-react'
import { studentBook } from 'utils/fetchRequest/Urls'

const index = () => {

    const locale = "mn"
    const { t } = useTranslation();
    const location = useLocation();
    const history = useHistory();

    const { selectedSchool, selectedClass } = useSelector(state => state.schoolData);

    const [loading, setLoading] = useState(false)
    const [studentId, setStudentId] = useState(location?.state?.id)
    const [classId] = useState(location?.state?.classId || selectedClass?.id)
    const [className] = useState(location?.state?.className || selectedClass?.name)
    const [student, setStudent] = useState(null)
    const [studentTypeOptions, setStudentTypeOptions] = useState([])
    const [countries, setCountries] = useState([])

    const [classStudents, setClassStudents] = useState([])

    const [updateView, setUpdateView] = useState(false)
    const [urlData] = useState(location?.state?.urlData || null)

    const loadData = () => {
        setLoading(true)
        fetchRequest(studentBook, 'POST', {
            school: selectedSchool?.id,
            student: studentId
        })
            .then(res => {
                if (res.success) {
                    setClassStudents(res?.classStudents || [])
                    setStudent(res?.student || {})
                    setStudentTypeOptions(res?.types || [])
                    setCountries(res?.countries || [])
                } else {
                    message(res.data.message)
                }
                setLoading(false)
            })
            .catch(() => {
                message(t('err.error_occurred'))
                setLoading(false)
            })
    }

    useEffect(() => {
        if (!studentId) {
            message(t('timetable.select_students'))
            history.replace({
                to: urlData ? urlData.backUrl : '/class/student'
            })
        }
        loadData()
    }, [studentId])

    const handleChange = value => {
        setLoading(true)
        // fetchRequest(classStudentStudentBookEdit, 'POST', { column: 'type', value, id: studentId, type: 'information' })
        //     .then(res => {
        //         message(res.data.message, res.success)

        //         const clone = cloneDeep(student)
        //         clone.studentTypeId = value
        //         setStudent(clone)

        //         setUpdateView(prev => !prev)
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('err.error_occurred'))
        //         setLoading(false)
        //     })
    }

    return (
        
        <div className="m-grid__item m-grid__item--fluid mt-3 mx-4">
            <SubHeader
                locale={locale}
                title={t('student.book')}
                secondaryTitle={student?.studentCode + '-' + student?.firstName}
                additional={<button className='btn btn-link' onClick={() => history.push(urlData ? urlData.backUrl : '/class/student', { replace: true })}>
                    {t('back_to_list')}
                </button>}
            />
            <div className='m-portlet mt-3 mb-4'>
                <div className='m-portlet__body'>
                    <Row>
                        <Col md='auto' className='text-right ml-4'>
                            <label
                                style={{
                                    marginRight: 10,
                                    marginBottom: 0,
                                    width: 'auto',
                                    lineHeight: '2.6em',
                                    fontFamily: 'PinnacleRegular',
                                    fontWeight: 700,
                                    fontSize: 12
                                }}
                            >
                                {t('menu.group')}
                            </label>
                        </Col>
                        <Col md='auto'>
                            <Dropdown
                                fluid
                                selection
                                closeOnChange
                                disabled
                                value={classId}
                                options={[{
                                    value: classId,
                                    text: className
                                }]}
                                placeholder={'-' + t('select') + '-'}
                                onChange={(e, data) => { }}
                                style={{
                                    minWidth: 250
                                }}
                            />
                        </Col>
                        <Col md='auto' className='text-right ml-4'>
                            <label
                                style={{
                                    marginRight: 10,
                                    marginBottom: 0,
                                    width: 'auto',
                                    lineHeight: '2.6em',
                                    fontFamily: 'PinnacleRegular',
                                    fontWeight: 700,
                                    fontSize: 12
                                }}
                            >
                                {t('menu.studentName')}
                            </label>
                        </Col>
                        <Col md='auto'>
                            <Dropdown
                                fluid
                                selection
                                closeOnChange
                                value={studentId}
                                options={classStudents?.map(obj => {
                                    return {
                                        value: obj?.value,
                                        text: obj?.text
                                    }
                                })}
                                placeholder={'-' + t('select') + '-'}
                                onChange={(e, data) => {
                                    setStudentId(data?.value)
                                }}
                                style={{
                                    minWidth: 250
                                }}
                            />
                        </Col>
                        <Col />
                    </Row>
                </div>
            </div>

            <div className='m-portlet mt-3 mb-4'>
                <div className='m-portlet__body'>
                    <Container fluid>
                        <Row className='bolder'>
                            <Col lg={3} className='d-flex justify-content-center align-items-center'>
                                <img width={120} height={120}
                                    className='img-responsive img-circle'
                                    src={student?.avatar || '/img/profile/avatar.png'}
                                    onError={(e) => {
                                        e.target.onError = null
                                        e.target.src = '/img/profile/avatar.png'
                                    }}
                                />
                            </Col>
                            <Col lg={3}>
                                <table style={{ color: '#4a4a4a' }}>
                                    <tbody>
                                        <tr>
                                            <td className='py-1 pr-5 text-right bolder'>{t('student.family_name')}</td>
                                            <td style={{ color: '#ff5b1d' }}>{student?.familyName || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className='py-1 pr-5 text-right bolder'>{t('movement.last_name')}</td>
                                            <td style={{ color: '#ff5b1d' }}>{student?.lastName || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className='py-1 pr-5 text-right bolder'>{t('studentBook.name')}</td>
                                            <td style={{ color: '#ff5b1d' }}>{student?.firstName || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className='py-1 pr-5 text-right bolder'>{t('student.birth_date')}</td>
                                            <td style={{ color: '#ff5b1d' }}>{student?.birthDate || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className='py-1 pr-5 text-right bolder'>{t('gender')}</td>
                                            <td style={{ color: '#ff5b1d' }}>{student?.gender?.toLowerCase() == 'm' ? t(locale)?.male : (student?.gender?.toLowerCase() == 'f' ? t('female') : '-')}</td>
                                        </tr>
                                        <tr>
                                            <td className='py-1 pr-5 text-right bolder'>{t('register_number')}</td>
                                            <td style={{ color: '#ff5b1d' }}>{student?.register || '-'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Col>
                            <Col lg={3}>
                                <table style={{ color: '#4a4a4a' }}>
                                    <tbody>
                                        <tr>
                                            <td className='py-1 pr-5 text-right bolder'>{t('student.entry_date')}</td>
                                            <td style={{ color: '#ff5b1d' }}>{student?.startDate || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className='py-1 pr-5 text-right bolder'>{t('student.current_class')}</td>
                                            <td style={{ color: '#ff5b1d' }}>{student?.className || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className='py-1 pr-5 text-right bolder'>{t('student.status')}</td>
                                            <td style={{ color: '#ff5b1d' }}>{student?.statusName || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className='py-1 pr-5 text-right bolder'>{t('movement.from_school_name')}</td>
                                            <td style={{ color: '#ff5b1d' }}>{student?.fromSchoolName || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className='py-1 pr-5 text-right bolder'>{t('status')}</td>
                                            <td style={{ color: '#ff5b1d' }}>
                                                <SimpleDropdown
                                                    fluid
                                                    className='d-flex no-wrap'
                                                    value={student?.studentTypeId}
                                                    options={studentTypeOptions}
                                                    onChange={(e, data) => handleChange(data?.value)}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
            <div className='m-portlet tab'>
                {
                    student &&
                    <Tab
                        renderActiveOnly
                        menu={{ secondary: true, pointing: true, className: 'primaryColor m-0 h-4 pt-2' }}
                        panes={[
                            {
                                menuItem: t('studentBookNavs.personal_info'),
                                render: () => <PersonalInformation student={student} refresh={() => loadData()} countries={countries}/>,
                            },
                            {
                                menuItem: t('studentBookNavs.grade'),
                                render: () => <Grade student={student} />,
                            },
                            {
                                menuItem: t('studentBook.activity'),
                                render: () => <Activity student={student} />
                            },
                            {
                                menuItem: t('club.title'),
                                render: () => <ClubCount student={student} />,
                            },
                            {
                                menuItem: t('finance.invoice'),
                                render: () => <Payment student={student} />,
                            },
                            {
                                menuItem: t('studentBookNavs.food'),
                                render: () => <Sale student={student} saleTypeCode={'FOOD'} />,
                            },
                            {
                                menuItem: t('studentBookNavs.bus'),
                                render: () => <Sale student={student} saleTypeCode={'BUS'} />,
                            },
                            {
                                menuItem: t('studentBookNavs.others'),
                                render: () => <Others id={student?.id} />,
                            }
                        ]}
                    />
                }
            </div>

            {
                loading &&
                <div className='loader-container'>
                    <svg className="splash-spinner" viewBox="0 0 50 50">
                        <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
                    </svg>
                </div>
            }
        </div>
    )
}

export default index