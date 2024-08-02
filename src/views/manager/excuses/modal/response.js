import message from 'modules/message'
import { Tab } from 'semantic-ui-react'
import { Modal } from 'react-bootstrap'
import React, {useState, useEffect} from 'react'
import CloseIcon from '@mui/icons-material/Close'
import CancelIcon from '@mui/icons-material/Cancel'
import secureLocalStorage from 'react-secure-storage'
import {Col, Container, Row} from 'react-bootstrap'
// import {fetchRequest} from 'utils/fetchRequest'
import {translations} from 'utils/translations'
// import {teacherExcuseRequestInfo} from 'utils/fetchRequest/Urls'
import {NDropdown as Dropdown} from 'widgets/Dropdown'
import { useTranslation } from 'react-i18next'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const response = ({onClose, onSubmit, id, status}) => {

    const { t } = useTranslation()
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const [response, setResponse] = useState({status, type: 'day'})

    const [season, setSeason] = useState([])
    const [reasons, setReasons] = useState([])
    const [request, setRequest] = useState({})
    const [statuses, setStatuses] = useState([])
    const [subjects, setSubjects] = useState([])
    const [showAttachment, setShowAttachment] = useState(false)

    const [subjectOptions, setSubjectOptions] = useState([])

    // useEffect(() => {
    //     setLoading(true)
    //     fetchRequest(teacherExcuseRequestInfo, 'POST', {request: id, menu: 'manager'})
    //         .then((res) => {
    //             if (res.success) {
    //                 const {types, requestInfo, timetables, currentSeason, statuses} = res?.data
    //                 setReasons(types || [])
    //                 setStatuses(statuses || [])
    //                 setRequest(requestInfo || [])
    //                 setSubjects(timetables || [])
    //                 setSeason({start: currentSeason?.startDate?.date, end: currentSeason?.endDate?.date})
    //                 if (requestInfo?.startDate && requestInfo?.endDate) {
    //                     setResponse({...response, startDate: requestInfo?.startDate, endDate: requestInfo?.endDate})
    //                 } else if (requestInfo?.startDate && !requestInfo?.endDate) {
    //                     setResponse({...response, type: 'hour', day: requestInfo?.startDate, subjects: null})
    //                     setSubjectOptions(timetables?.filter(el => el?.day == new Date(requestInfo?.startDate)?.getDay()) || [])
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

    const handleSave = () => {
        if (validateFields()) onSubmit({
            ...response,
            subjects: JSON.stringify(response?.subjects),
            status: statuses?.find(el => el?.code?.toLowerCase() == response?.status)?.id
        })
    }

    const validateFields = () => {
        if (response?.status == 'accepted') {
            if (!response?.reason) return message(translations(locale)?.absent?.select_type)
            if (response?.type == 'hour') {
                if (!response?.day || !response?.subjects?.length) return message(translations(locale)?.err?.fill_all_fields)
            } else {
                if (!response?.startDate || !response?.endDate) return message(translations(locale)?.err?.fill_all_fields)
            }
        }
        return true
    }

    const handleChange = (name, value) => {
        setResponse({...response, [name]: value})
    }

    const clearDateRange = () => {
        setResponse({...response, startDate: null, endDate: null})
    }

    const handleStatusChange = status => {
        if (status == 'accepted') setResponse({...response, status, description: null})
        else setResponse({
            ...response,
            status,
            startDate: null,
            endDate: null,
            description: null,
            day: null,
            subjects: [],
            type: 'day',
            reason: null
        })
    }

    const handleTabChange = type => {
        if (type == 'day') setResponse({...response, type, day: null, subjects: [], description: null})
        else setResponse({...response, type, startDate: null, endDate: null, description: null})
    }

    const handleDayChange = day => {
        setSubjectOptions(subjects?.filter(el => el?.day == new Date(day)?.getDay()) || [])
        setResponse({...response, day, subjects: null})
    }

    const showAttachmentModal = () => {
        setShowAttachment(true)
    }

    return (
        <Modal
            dimmer='blurring'
            show={true}
            size={showAttachment ? 'md' : 'xl'}
            aria-labelledby="contained-modal-title-vcenter"
            onHide={onClose}
            // className='react-modal overflow-modal'
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('absent.response')}
                </Modal.Title>
                {
                    showAttachment
                        ?
                        <button className="btn m-btn--pill btn-outline-metal"
                                style={{float: 'right'}}
                                onClick={() => {
                                    setShowAttachment(false)
                                }}>{translations(locale)?.back}</button>
                        :
                        null
                }
            </Modal.Header>
            <Modal.Body>
                <Container>
                    {
                        showAttachment
                            ?
                            <Row>
                                <Col md={12} className={"text-center"}>
                                    <img src={request?.filePath} alt={'attachment'} width={'80%'}/>
                                </Col>
                            </Row>
                            :
                            <Row>
                                <Col md={5}>
                                    <Row>
                                        <Col md={12}>
                                            <div className='m-portlet'>
                                                <div className='m-portlet__body'>
                                                    <Row>
                                                        <Col md={4}
                                                             className='d-flex align-items-center justify-content-center'>
                                                            <img src={request?.avatar || '/img/profile/avatar.png'}
                                                                 className='img-circle'
                                                                 alt={`photo of ${request?.firstName}`}
                                                                 width={100} height={100}
                                                                 onError={(e) => {
                                                                     e.target.onError = null
                                                                     e.target.src = '/img/profile/avatar.png'
                                                                 }}
                                                            />
                                                        </Col>
                                                        <Col
                                                            className='d-flex bolder flex-column justify-content-center text-grey' style={{fontSize: '14px'}}>
                                                            <Row>
                                                                <Col md={3} className='px-2 py-1 text-md-right'
                                                                    >{translations(locale)?.className}:</Col>
                                                                <Col
                                                                    className='px-2 py-1'>{request?.className || '-'}</Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md={3} className='px-2 py-1 text-md-right'
                                                                    >{translations(locale)?.code}:</Col>
                                                                <Col
                                                                    className='px-2 py-1'>{request?.studentCode || '-'}</Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md={3} className='px-2 py-1 text-md-right'
                                                                    >{translations(locale)?.last_name}:</Col>
                                                                <Col
                                                                    className='px-2 py-1'>{request?.lastName || '-'}</Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md={3} className='px-2 py-1 text-md-right'
                                                                    >{translations(locale)?.first_name}:</Col>
                                                                <Col
                                                                    className='px-2 py-1'>{request?.firstName || '-'}</Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md={12}>
                                            <div className='m-portlet'>
                                                <div className='m-portlet__body bolder text-grey' style={{fontSize: '14px'}}>
                                                    <Row>
                                                        <Col md={4} className='px-2 py-1 text-md-right'
                                                            >{translations(locale)?.absent?.request_sender}:</Col>
                                                        <Col className='px-2 py-1'>{request?.sender || '-'}</Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md={4} className='px-2 py-1 text-md-right'
                                                            >{translations(locale)?.absent?.reason}:</Col>
                                                        <Col className='px-2 py-1'>{request?.type || '-'}</Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md={4} className='px-2 py-1 text-md-right'
                                                            >{translations(locale)?.absent?.start_date}:</Col>
                                                        <Col className='px-2 py-1'>{request?.startDate || '-'}</Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md={4} className='px-2 py-1 text-md-right'
                                                            >{translations(locale)?.absent?.end_date}:</Col>
                                                        <Col className='px-2 py-1'>{request?.endDate || '-'}</Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md={4} className='px-2 py-1 text-md-right'
                                                            >{translations(locale)?.absent?.description}:</Col>
                                                        <Col className='px-2 py-1'>{request?.description || '-'}</Col>
                                                    </Row>
                                                    {
                                                        request?.filePath && request?.filePath?.length > 0 &&
                                                        <Row className={'mt-3'}>
                                                            <Col xs={12} className='px-2 py-1 text-center'>
                                                                <button
                                                                    className="br-08 p-2 px-4 d-flex align-items-center pointer"
                                                                    onClick={showAttachmentModal}
                                                                    style={{
                                                                        color: 'rgb(255, 108, 0)',
                                                                        border: '1px solid rgb(255, 108, 0)',
                                                                        margin: 'auto',
                                                                        backgroundColor: 'white'
                                                                    }}>{translations(locale)?.absent?.attachmentView}</button>
                                                            </Col>
                                                        </Row>
                                                    }
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={7} className='pl-md-2'>
                                    <div className='m-portlet'>
                                        <div className='m-portlet__body'>
                                            <div className='d-flex justify-content-center gap-07 mb-3'>
                                                {
                                                    statuses?.map((el, key) => (
                                                        <button
                                                            key={key}
                                                            className='br-06 p-2 d-flex align-items-center text-uppercase border-0 pointer'
                                                            style={
                                                                response?.status == el?.code?.toLowerCase()
                                                                    ? {backgroundColor: el?.color, color: 'white'}
                                                                    : {
                                                                        backgroundColor: el?.color + '4d',
                                                                        color: el?.color
                                                                    }
                                                            }
                                                            onClick={() => handleStatusChange(el?.code?.toLowerCase())}
                                                        >
                                                            {
                                                                el?.code?.toLowerCase() == 'accepted'
                                                                    ? <CheckCircleIcon sx={{fontSize: 22}}/>
                                                                    : <CancelIcon sx={{fontSize: 22}}/>
                                                            }
                                                            <span className='ml-2 pinnacle-regular'>{el?.text}</span>
                                                        </button>
                                                    ))
                                                }
                                            </div>
                                            {
                                                response?.status == 'accepted'
                                                    ? <>
                                                        <div className='d-flex justify-content-center gap-05 mb-3'>
                                                            {
                                                                reasons?.map((el, key) => (
                                                                    <button key={key}
                                                                            className='br-08 p-2 px-4 d-flex align-items-center pointer fs-12'
                                                                            onClick={() => handleChange('reason', el?.id)}
                                                                            style={
                                                                                response?.reason == el?.id
                                                                                    ? {
                                                                                        color: 'white',
                                                                                        border: `1px solid ${el?.color}`,
                                                                                        backgroundColor: el?.color
                                                                                    }
                                                                                    : {
                                                                                        color: el?.color,
                                                                                        border: `1px solid ${el?.color}`,
                                                                                        backgroundColor: 'white'
                                                                                    }
                                                                            }
                                                                    >
                                                                        {el?.name}
                                                                    </button>
                                                                ))
                                                            }
                                                        </div>
                                                        <div className='d-flex justify-content-center mb-3'>
                                                            <Tab
                                                                activeIndex={response?.type === 'day' ? 0 : 1}
                                                                menu={{
                                                                    attached: false,
                                                                    borderless: true,
                                                                    className: 'unattached-tab'
                                                                }}
                                                                onTabChange={(e, data) => handleTabChange(data?.panes[data?.activeIndex]?.code)}
                                                                panes={[
                                                                    {
                                                                        code: 'day',
                                                                        menuItem: translations(locale)?.calendar?.day,
                                                                    },
                                                                    {
                                                                        code: 'hour',
                                                                        menuItem: translations(locale)?.period,
                                                                    }
                                                                ]}
                                                            />
                                                        </div>
                                                        {
                                                            response?.type == 'day'
                                                                ? <>
                                                                    <Row className='form-group'>
                                                                        <Col md={3}
                                                                             className='col-form-label text-md-right label-pinnacle-bold'>
                                                                            {translations(locale)?.date}*
                                                                        </Col>
                                                                        <Col md={7}>
                                                                            <Row>
                                                                                <Col className='pr-0'>
                                                                                    <DayPickerInput
                                                                                        value={response?.startDate}
                                                                                        inputProps={{className: 'form-control h-100'}}
                                                                                        placeholder={translations(locale)?.datePickerPlaceholder}
                                                                                        onDayChange={(day, modifier, input) => handleChange('startDate', input?.state?.value)}
                                                                                        classNames={{
                                                                                            overlay: 'DayPickerInputOverlay',
                                                                                            container: 'position-relative h-100'
                                                                                        }}
                                                                                        dayPickerProps={{
                                                                                            firstDayOfWeek: 1,
                                                                                            disabledDays: {
                                                                                                after: new Date(season?.end),
                                                                                                before: new Date(season?.start)
                                                                                            },
                                                                                        }}
                                                                                    />
                                                                                </Col>
                                                                                <div className="pickerSeparator"
                                                                                    style={{cursor: 'pointer',
                                                                                        lineHeight: '1em'}}
                                                                                    onClick={clearDateRange}>
                                                                                    <i className="la la-ellipsis-h"/>
                                                                                </div>
                                                                                <Col className='pl-0'>
                                                                                    <DayPickerInput
                                                                                        value={response?.endDate}
                                                                                        inputProps={{className: 'form-control h-100'}}
                                                                                        placeholder={translations(locale)?.datePickerPlaceholder}
                                                                                        onDayChange={(day, modifier, input) => handleChange('endDate', input?.state?.value)}
                                                                                        classNames={{
                                                                                            overlay: 'DayPickerInputOverlay',
                                                                                            container: 'position-relative h-100'
                                                                                        }}
                                                                                        dayPickerProps={{
                                                                                            firstDayOfWeek: 1,
                                                                                            disabledDays: {
                                                                                                after: new Date(season?.end),
                                                                                                before: new Date(season?.start)
                                                                                            },
                                                                                        }}
                                                                                    />
                                                                                </Col>
                                                                            </Row>
                                                                        </Col>
                                                                    </Row>
                                                                </>
                                                                : <>
                                                                    <Row className='form-group'>
                                                                        <Col md={3}
                                                                             className='col-form-label text-md-right label-pinnacle-bold'>
                                                                            {translations(locale)?.calendar?.day}*
                                                                        </Col>
                                                                        <Col md={7}>
                                                                            <DayPickerInput
                                                                                value={response?.day}
                                                                                inputProps={{className: 'form-control h-100'}}
                                                                                placeholder={translations(locale)?.datePickerPlaceholder}
                                                                                onDayChange={(day, modifier, input) => handleDayChange(input?.state?.value)}
                                                                                classNames={{
                                                                                    overlay: 'DayPickerInputOverlay',
                                                                                    container: 'position-relative h-100'
                                                                                }}
                                                                                dayPickerProps={{
                                                                                    firstDayOfWeek: 1,
                                                                                    disabledDays: {
                                                                                        after: new Date(season?.end),
                                                                                        before: new Date(season?.start)
                                                                                    },
                                                                                }}
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                    <Row className='form-group'>
                                                                        <Col md={3}
                                                                             className='col-form-label text-md-right label-pinnacle-bold'>
                                                                            {translations(locale)?.subject?.title}*
                                                                        </Col>
                                                                        <Col md={7}>
                                                                            <Dropdown
                                                                                fluid
                                                                                search
                                                                                multiple
                                                                                selection
                                                                                options={subjectOptions}
                                                                                value={response?.subjects || []}
                                                                                placeholder={'-' + translations(locale)?.select + '-'}
                                                                                onChange={(e, data) => handleChange('subjects', data?.value)}
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                </>
                                                        }
                                                        <Row className='form-group'>
                                                            <Col md={3}
                                                                 className='col-form-label text-md-right label-pinnacle-bold'>
                                                                {translations(locale)?.description}
                                                            </Col>
                                                            <Col md={7}>
                                                        <textarea
                                                            rows={8}
                                                            className='form-control'
                                                            value={response?.description || ''}
                                                            onChange={(e) => handleChange('description', e.target.value)}
                                                        />
                                                            </Col>
                                                        </Row>
                                                    </>
                                                    : <Row className='form-group'>
                                                        <Col md={3}
                                                             className='col-form-label text-md-right label-pinnacle-bold'>
                                                            {translations(locale)?.description}
                                                        </Col>
                                                        <Col md={7}>
                                                    <textarea
                                                        rows={8}
                                                        className='form-control'
                                                        value={response?.description || ''}
                                                        onChange={(e) => handleChange('description', e.target.value)}
                                                    />
                                                        </Col>
                                                    </Row>
                                            }
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                    }
                </Container>
            </Modal.Body>
            {
                !showAttachment && <Modal.Footer className="text-center">
                    <div className='text-center w-100'>
                        <button
                            className="btn m-btn--pill btn-link m-btn m-btn--custom"
                            onClick={onClose}
                        >
                            {translations(locale)?.back}
                        </button>
                        <button
                            className="btn m-btn--pill btn-success m-btn--wide text-uppercase"
                            onClick={handleSave}
                        >
                            {translations(locale)?.save}
                        </button>
                    </div>
                </Modal.Footer>
            }
            {
                loading &&
                <>
                    <div className="blockUI blockOverlay"/>
                    <div className="blockUI blockMsg blockPage">
                        <div className="m-loader m-loader--brand m-loader--lg"/>
                    </div>
                </>
            }
        </Modal>
    )
}

export default response