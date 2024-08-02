import message from 'modules/message'
import { Col, Row, Modal } from 'react-bootstrap'
// import { templateExamView } from 'utils/fetchRequest/Urls'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'
import { fetchRequest } from 'utils/fetchRequest'
import { useTranslation } from 'react-i18next'

const view = ({ onClose, id }) => {

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)

    const [template, setTemplate] = useState({})

    // useEffect(() => {
    //     setLoading(true)
    //     fetchRequest(templateExamView, 'POST', { template: id })
    //         .then((res) => {
    //             if (res.success) {
    //                 setTemplate(res.data?.templateData || {})
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

    return (
        <Modal
            size='lg'
            dimmer='blurring'
            show={true}
            onHide={onClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('exam_template.view')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className='bolder fs-11'>
                    <Col className='px-2 py-1 text-md-right' style={{ color: '#575962' }}>{translations(locale)?.grade}</Col>
                    <Col className='px-2 py-1' style={{ color: '#575962' }}>{template?.gradeName || '-'}</Col>
                </Row>
                <Row className='bolder fs-11'>
                    <Col className='px-2 py-1 text-md-right' style={{ color: '#575962' }}>{translations(locale)?.exam_template?.exam_type}</Col>
                    <Col className='px-2 py-1' style={{ color: '#575962' }}>{template?.examTypeName || '-'}</Col>
                </Row>
                <Row className='bolder fs-11'>
                    <Col className='px-2 py-1 text-md-right' style={{ color: '#575962' }}>{translations(locale)?.subject?.title}</Col>
                    <Col className='px-2 py-1' style={{ color: '#575962' }}>{template?.subjectName || '-'}</Col>
                </Row>
                <Row className='bolder fs-11'>
                    <Col className='px-2 py-1 text-md-right' style={{ color: '#575962' }}>{translations(locale)?.exam_template?.name}</Col>
                    <Col className='px-2 py-1' style={{ color: '#575962' }}>{template?.name || '-'}</Col>
                </Row>
                <Row className='bolder fs-11'>
                    <Col className='px-2 py-1 text-md-right' style={{ color: '#575962' }}>{translations(locale)?.total_score}</Col>
                    <Col className='px-2 py-1' style={{ color: '#575962' }}>{template?.totalScore || '-'}</Col>
                </Row>
                <Row className='bolder fs-11'>
                    <Col className='px-2 py-1 text-md-right' style={{ color: '#575962' }}></Col>
                    <Col className='px-2 py-1' style={{ color: '#575962' }}>{template?.isPublic ? translations(locale)?.exam_template?.only_me : translations(locale)?.exam_template?.not_only_me}</Col>
                </Row>
                <Row>
                    <Col md={1} />
                    <Col>
                        <table className='table table-bordered mt-4 react-bootstrap-table'>
                            <thead>
                                <tr>
                                    <th>{translations(locale)?.exam_template?.question}</th>
                                    <th>{translations(locale)?.exam_template?.total_score}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    template?.details?.length
                                        ? template?.details?.map((el, key) => (
                                            <tr key={key}>
                                                <td>{el?.name}</td>
                                                <td className='text-right'>{el?.score}</td>
                                            </tr>
                                        ))
                                        : <tr><th colSpan={2} className='text-center'>{translations(locale)?.empty}</th></tr>
                                }
                            </tbody>
                        </table>
                    </Col>
                    <Col md={1} />
                </Row>
            </Modal.Body>
            <Modal.Footer className="col-12 text-center">
                <button
                    className='btn btn-sm m-btn--pill btn-outline-metal'
                    onClick={onClose}
                >
                    {t('close').toUpperCase()}
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
        </Modal>
    )
}

export default view