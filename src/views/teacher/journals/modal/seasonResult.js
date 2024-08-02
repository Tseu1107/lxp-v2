import message from 'modules/message'
import { Modal } from 'react-bootstrap'
import DeleteModal from 'utils/deleteModal'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import DTable from 'modules/DataTable/DTable'
import secureLocalStorage from 'react-secure-storage'
import { translations } from 'utils/translations'
import EditSeasonResult from '../pages/seasonResult/edit'
import ResultSeasonResult from '../pages/seasonResult/result'
// import { fetchRequest } from 'utils/fetchRequest'
// import { teacherJournalSeasonResultDelete, teacherJournalExamInit } from 'utils/fetchRequest/Urls'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const seasonResult = ({ onClose, group, season, rerender }) => {

    const [loading, setLoading] = useState(false)

    const [title, setTitle] = useState('')
    const [tableData, setTableData] = useState([])
    const [selectedTableDataId, setSelectedTableDataId] = useState(null)

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showEditSeasonResultModal, setShowEditSeasonResultModal]= useState(false)
    const [showResultSeasonResultModal, setShowResultSeasonResultModal]= useState(false)
    
    const [editSeasonResultState, setEditSeasonResultState] = useState({
        exam: null,
        group: null,
        title: null,
    })

    const [resultSeasonResultState, setResultSeasonResultState] = useState({
        exam: null,
        title: null,
        urlData: null,
    })
    
    const seasonResultEditHandler = (state) => {
        setEditSeasonResultState({
            exam: state?.exam,
            group: state?.group,
            title: state?.title,
        })
        setShowEditSeasonResultModal(true)
    }

    const seasonResultResultHandler = (state) => {
        setResultSeasonResultState({
            exam: state?.exam,
            title: state?.title,
            urlData: state?.group,
        })
        setShowResultSeasonResultModal(true)
    }

    const config = {
        showFilter: false,
        showAllData: true,
        showPagination: false,
        defaultSort: [{ dataField: 'createdDate', order: 'asc' }],
    };

    const columns = [
        {
            dataField: 'isPublish',
            text: translations(locale)?.status,
            align: 'center',
            style: { verticalAlign: 'middle' },
            formatter: cell => 
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className={`table-circle ${cell === true && "active"}`} />
                </div>
            // <i className='fas fa-circle' style={{ color: cell ? '#6dd400' : '#d8d8d8' }} />
        },
        {
            dataField: 'createdDate',
            text: translations(locale)?.exam_template?.created_date,
        },
        {
            dataField: 'publishedDate',
            text: translations(locale)?.season_score?.published_date,
        },
        {
            dataField: 'action',
            text: '',
            align: 'center',
            style: { verticalAlign: 'middle' },
            headerStyle: { width: 100 },
            formatter: (cell, row) => {
                if (!row?.isPublish) return (
                    <div>
                        <button
                            className='btn btn-primary m-btn--icon btn-sm m-btn--icon-only m-btn--pill mr-2'
                            onClick={() => seasonResultEditHandler({exam: row?.id, group: group, title: title,})}
                            // onClick={() => navigate('/teacher/journals/season-result/edit', { state: { exam: row?.id, group, title } })}
                        >
                            <i className='fa flaticon-edit-1' />
                        </button>
                        <button
                            className='btn btn-danger m-btn--icon btn-sm m-btn--icon-only m-btn--pill'
                            onClick={() => handleDeleteButtonClick(row?.id)}
                        >
                            <i className='fa flaticon-delete-1' />
                        </button>
                    </div>
                )
                else return (
                    <button
                        className='btn btn-secondary m-btn--icon btn-sm m-btn--icon-only m-btn--pill'
                        onClick={() => seasonResultResultHandler({exam: row?.id, title: title, urlData: {backUrl: 'teacher/journals'}})}
                        // onClick={() => navigate('/teacher/journals/season-result/result', { state: { exam: row?.id, title: title, urlData: {backUrl: '/teacher/journals'} } })}
                    >
                        <i className='fa flaticon-eye text-white' />
                    </button>
                )
            }
        },
    ]

    // useEffect(() => {
    //     setLoading(true)
    //     fetchRequest(teacherJournalExamInit, 'POST', { group, final: 1, season })
    //         .then((res) => {
    //             if (res.success) {
    //                 const { title, examLists } = res.data
    //                 setTitle(title || '')
    //                 setTableData(examLists || [])
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

    const handleDelete = () => {
        console.log('handleDelete')
        // setLoading(true)
        // fetchRequest(teacherJournalSeasonResultDelete, 'POST', { ...group, group: group?.id, exam: selectedTableDataId })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             closeModal()
        //             rerender()
        //             onClose()
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

    const handleDeleteButtonClick = id => {
        setSelectedTableDataId(id)
        setShowDeleteModal(true)
    }

    const closeModal = () => {
        setSelectedTableDataId(null)
        setShowDeleteModal(false)
    }

    return (
        <Modal
            size='xl'
            dimmer='blurring'
            show={true}
            onHide={onClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{color: '#212529'}}>
                <DTable
                    locale={locale}
                    config={config}
                    data={tableData}
                    columns={columns}
                />
            </Modal.Body>
            <Modal.Footer className='text-center'>
                <button className='btn m-btn--pill btn-outline-metal text-uppercase' onClick={onClose}>
                    {translations(locale)?.close}
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
            {
                showDeleteModal && selectedTableDataId &&
                <DeleteModal
                    onClose={closeModal}
                    onDelete={handleDelete}
                    locale={locale}
                    title={translations(locale)?.delete}
                >
                    {translations(locale)?.delete_confirmation}
                    <br />
                    <br />
                    {translations(locale)?.delete_confirmation_description}
                </DeleteModal>
            }
            {
                editSeasonResultState?.exam && editSeasonResultState?.group &&
                <EditSeasonResult
                    onClose={() => setShowEditSeasonResultModal(false)}
                    show={showEditSeasonResultModal}
                    data={editSeasonResultState}
                />
            }
            {
                resultSeasonResultState?.exam && 
                // resultSeasonResultState?.urlData
                <ResultSeasonResult
                    onClose={() => setShowResultSeasonResultModal(false)}
                    show={showResultSeasonResultModal}
                    data={resultSeasonResultState}
                />
            }
        </Modal>
    )
}

export default seasonResult