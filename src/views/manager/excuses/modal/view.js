import message from 'modules/message'
import { Modal } from 'react-bootstrap'
import React, {useState, useEffect} from 'react'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import {Col, Container, Row} from 'react-bootstrap'
// import {fetchRequest} from 'utils/fetchRequest'
import {translations} from 'utils/translations'
import { useTranslation } from 'react-i18next'
// import {teacherExcuseReasonView, teacherExcuseRequestView} from 'utils/fetchRequest/Urls'

const view = ({onClose, id, type}) => {

    const { t } = useTranslation()
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const [loading, setLoading] = useState(false)

    const [student, setStudent] = useState({})
    const [request, setRequest] = useState({})
    const [details, setDetails] = useState({})
    const [timetables, setTimetables] = useState([])
    const [showAttachment, setShowAttachment] = useState(false)

    // useEffect(() => {
    //     setLoading(true)
    //     if (type === 'request') {
    //         fetchRequest(teacherExcuseRequestView, 'POST', {id, menu: 'manager'})
    //             .then((res) => {
    //                 if (res.success) {
    //                     const {studentInfo, sender, details, timetables} = res?.data
    //                     setRequest(sender || [])
    //                     setDetails(details || {})
    //                     setStudent(studentInfo || [])
    //                     setTimetables(timetables || [])
    //                 } else {
    //                     message(res.data.message)
    //                 }
    //                 setLoading(false)
    //             })
    //             .catch(() => {
    //                 message(translations(locale)?.err?.error_occurred)
    //                 setLoading(false)
    //             })
    //     } else {
    //         fetchRequest(teacherExcuseReasonView, 'POST', {id, menu: 'manager'})
    //             .then((res) => {
    //                 if (res.success) {
    //                     const {studentInfo, sender, details, timetables} = res?.data
    //                     setRequest(sender || [])
    //                     setDetails(details || {})
    //                     setStudent(studentInfo || [])
    //                     setTimetables(timetables || [])
    //                 } else {
    //                     message(res.data.message)
    //                 }
    //                 setLoading(false)
    //             })
    //             .catch(() => {
    //                 message(translations(locale)?.err?.error_occurred)
    //                 setLoading(false)
    //             })
    //     }
    // }, [])

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
                    {t('action.view')}
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
                                                <div className='m-portlet__body' style={{fontSize: '14px'}}>
                                                    <Row>
                                                        <Col md={4}
                                                             className='d-flex align-items-center justify-content-center'>
                                                            <img src={student?.avatar || '/img/profile/avatar.png'}
                                                                 alt={`photo of ${student?.firstName}`}
                                                                 width={100} height={100}
                                                                 className='img-circle'
                                                                 onError={(e) => {
                                                                     e.target.onError = null
                                                                     e.target.src = '/img/profile/avatar.png'
                                                                 }}
                                                            />
                                                        </Col>
                                                        <Col
                                                            className='d-flex bolder flex-column justify-content-center'>
                                                            <Row>
                                                                <Col md={3} className='px-2 py-1 text-md-right text-grey'
                                                                    >{translations(locale)?.className}:</Col>
                                                                <Col
                                                                    className='px-2 py-1'>{student?.className || '-'}</Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md={3} className='px-2 py-1 text-md-right text-grey'
                                                                    >{translations(locale)?.code}:</Col>
                                                                <Col
                                                                    className='px-2 py-1'>{student?.studentCode || '-'}</Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md={3} className='px-2 py-1 text-md-right text-grey'
                                                                    >{translations(locale)?.last_name}:</Col>
                                                                <Col
                                                                    className='px-2 py-1'>{student?.lastName || '-'}</Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md={3} className='px-2 py-1 text-md-right text-grey'
                                                                    >{translations(locale)?.first_name}:</Col>
                                                                <Col
                                                                    className='px-2 py-1'>{student?.firstName || '-'}</Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md={12}>
                                            <div className='m-portlet'>
                                                {
                                                    type === 'request'
                                                        ?
                                                        <div className='m-portlet__body bolder' style={{fontSize: '14px'}}>
                                                            <Row>
                                                                <Col md={4} className='px-2 py-1 text-md-right text-grey'
                                                                    >{translations(locale)?.absent?.request_sender}:</Col>
                                                                <Col
                                                                    className='px-2 py-1'>{request?.sender || '-'}</Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md={4} className='px-2 py-1 text-md-right text-grey'
                                                                    >{translations(locale)?.absent?.reason}:</Col>
                                                                <Col
                                                                    className='px-2 py-1'>{request?.reason || '-'}</Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md={4} className='px-2 py-1 text-md-right text-grey'
                                                                    >{translations(locale)?.type}:</Col>
                                                                <Col className='px-2 py-1'>{request?.type || '-'}</Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md={4} className='px-2 py-1 text-md-right text-grey'
                                                                    >{translations(locale)?.absent?.start_date}:</Col>
                                                                <Col
                                                                    className='px-2 py-1'>{request?.startDate || '-'}</Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md={4} className='px-2 py-1 text-md-right text-grey'
                                                                    >{translations(locale)?.absent?.end_date}:</Col>
                                                                <Col
                                                                    className='px-2 py-1'>{request?.endDate || '-'}</Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md={4} className='px-2 py-1 text-md-right text-grey'
                                                                    >{translations(locale)?.absent?.description}:</Col>
                                                                <Col className='px-2 py-1'>{request?.note || '-'}</Col>
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
                                                        :
                                                        <div className='m-portlet__body bolder' style={{fontSize: '14px'}}>
                                                            <Row>
                                                                <Col md={4} className='px-2 py-1 text-md-right text-grey'
                                                                    >{translations(locale)?.registered}:</Col>
                                                                <Col className='px-2 py-1'>
                                                                    <p>{`${details?.user} (${details?.username})`}</p>
                                                                    <p>{`${details?.date}`}</p>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md={4} className='px-2 py-1 text-md-right text-grey'
                                                                    >{translations(locale)?.status}:</Col>
                                                                <Col
                                                                    className='px-2 py-1'>{request?.reason || '-'}</Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md={4} className='px-2 py-1 text-md-right text-grey'
                                                                    >{translations(locale)?.type}:</Col>
                                                                <Col className='px-2 py-1'>{request?.type || '-'}</Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md={4} className='px-2 py-1 text-md-right text-grey'
                                                                    >{translations(locale)?.absent?.start_date}:</Col>
                                                                <Col
                                                                    className='px-2 py-1'>{request?.startDate || '-'}</Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md={4} className='px-2 py-1 text-md-right text-grey'
                                                                    >{translations(locale)?.absent?.end_date}:</Col>
                                                                <Col
                                                                    className='px-2 py-1'>{request?.endDate || '-'}</Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md={4} className='px-2 py-1 text-md-right text-grey'
                                                                    >{translations(locale)?.absent?.description}:</Col>
                                                                <Col className='px-2 py-1'>{request?.note || '-'}</Col>
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
                                                }
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={7} className='pl-md-2'>
                                    <div className='m-portlet'>
                                        <div className='m-portlet__body' style={{fontSize: '14px'}}>
                                            {
                                                type === 'request' && <>
                                                    <Row className='bolder'>
                                                        <Col className='px-2 py-1 text-md-right'
                                                            >{translations(locale)?.status}:</Col>
                                                        <Col className='px-2 py-1'>{details?.statusName || '-'}</Col>
                                                    </Row>
                                                    <Row className='bolder'>
                                                        <Col className='px-2 py-1 text-md-right'
                                                            >{translations(locale)?.absent?.user}:</Col>
                                                        <Col className='px-2 py-1'>{details?.user || '-'}</Col>
                                                    </Row>
                                                    <Row className='bolder'>
                                                        <Col className='px-2 py-1 text-md-right'
                                                            >{translations(locale)?.date}:</Col>
                                                        <Col className='px-2 py-1'>{details?.date || '-'}</Col>
                                                    </Row>
                                                </>
                                            }

                                            <div className='mt-3'>
                                                <span>{translations(locale)?.total}: {timetables?.length}</span>
                                                <table className='table table-bordered mt-3'>
                                                    <thead>
                                                    <tr>
                                                        <th className='bolder'>№</th>
                                                        <th className='bolder'>{translations(locale)?.date}</th>
                                                        <th className='bolder'>{translations(locale)?.period}</th>
                                                        <th className='bolder'>{translations(locale)?.subject?.title}</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        timetables?.map((el, key) => (
                                                            <tr key={key}>
                                                                <td>{key + 1}</td>
                                                                <td>{el?.date}</td>
                                                                <td>{el?.time}</td>
                                                                <td>{el?.groupName}</td>
                                                            </tr>
                                                        ))
                                                    }
                                                    </tbody>
                                                </table>
                                            </div>
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
                            className="btn m-btn--pill btn-outline-metal"
                            onClick={onClose}
                        >
                            {translations(locale)?.close}
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

export default view