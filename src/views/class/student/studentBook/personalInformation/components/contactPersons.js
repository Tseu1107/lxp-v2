import message from 'modules/message'
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router'
import CustomInlineEdit from 'modules/CustomInlineEdit'
import { Col, Container, Row } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux'
import { fetchRequest } from 'utils/fetchRequest'
import DTable from "modules/DataTable/DTable";
import { NDropdown as Dropdown } from 'widgets/Dropdown'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { studentBookContactPersons, studentBookContactPersonDelete } from 'utils/fetchRequest/Urls'
import AddContactPerson from './modal/AddContactPerson'
import EditContactPerson from './modal/EditContactPerson'
import DeleteModal from 'utils/deleteModal'

const ContactPersons = ({ student }) => {
    const location = useLocation()
    const locale = "mn"
    const { t } = useTranslation();
    const { selectedSchool, selectedClass } = useSelector(state => state.schoolData);
    const [loading, setLoading] = useState(false)
    const [selectedTableDataId, setSelectedTableDataId] = useState(null)

    const config = {
        showFilter: false,
        excelExport: false,
        printButton: false,
        showAllData: true,
        showPagination: false
    }

    const columns = [
        {
            dataField: 'typeName',
            text: t('student.relation_type'),
            sort: false
        },
        {
            dataField: 'personName',
            text: t('name'),
            sort: false
        },
        {
            dataField: 'phoneNumber',
            text: t('studentBook.phone'),
            sort: false
        },
        {
            dataField: 'email',
            text: t('studentBook.email'),
            sort: false
        }
    ]
    const contextMenus = [
        {
            key: 'EDIT',
            icon: <BorderColorTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: t('common.edit')
        },
        {
            key: 'DELETE',
            icon: <DeleteTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: t('common.delete')
        }
    ]

    const [contactPersons, setContactPersons] = useState([]);
    const [relationTypes, setRelationTypes] = useState([]);

    const [showAddContact, setShowAddContact] = useState(false);
    const [showEditContact, setShowEditContact] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedParentId, setSelectedParentId] = useState(null);

    const loadData = (params) => {
        setLoading(true)
        fetchRequest(studentBookContactPersons, 'POST', params)
            .then(res => {
                if (res.success) {
                    setContactPersons(res?.contacts || [])
                    setRelationTypes(res?.relationTypes || [])
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
        loadData({
            school: selectedSchool?.id,
            student: student?.id
        })
    }, [student])

    const _contextMenuItemClick = (id, key) => {
        if (id && key) {
            setSelectedTableDataId(id)
            if (key === 'EDIT') {
                setShowEditContact(true)
            }
            if (key === 'DELETE') {
                setShowDeleteModal(true)
            }
        }
    }

    const closeModal = () => {
        setSelectedTableDataId(null);
        setShowDeleteModal(false);
    };

    const handleDelete = () => {
        setLoading(true)
        const params = {
            school: selectedSchool?.id,
            student: student?.id,
            contactPerson: selectedTableDataId
        }
        closeModal()
        fetchRequest(studentBookContactPersonDelete, 'POST', params)
            .then(res => {                
                if (res.success) {
                    message(res?.message, true)
                    setContactPersons(res?.contacts || [])                    
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

    const onCloseAdd = (reloadData = false) => {
        if (reloadData) {
            loadData({
                school: selectedSchool?.id,
                student: student?.id
            })
        }
        setShowAddContact(false)
    }

    const onCloseEdit = (reloadData = false) => {
        if (reloadData) {
            loadData({
                school: selectedSchool?.id,
                student: student?.id
            })
        }
        setSelectedTableDataId(null)
        setShowEditContact(false)
    }

    return (
        <>
            <div className='d-flex'>
                <button
                    type="button"
                    onClick={() => {
                        setShowAddContact(true)
                    }}
                    className="btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3"
                >
                    <AddCircleOutlineRoundedIcon className='MuiSvg-customSize' />
                    <span className='ml-2'>{t('common.register')}</span>
                </button>
            </div>
            <div className='br-08 position-relative mt-2' style={{ border: '1px solid rgba(255, 91, 29, 0.1)' }}>
                <Container fluid>
                    <Row>
                        <Col md={'auto'} className='d-flex'>
                            <DTable
                                config={config}
                                clickContextMenu
                                contextMenus={contextMenus}
                                data={contactPersons}
                                onContextMenuItemClick={_contextMenuItemClick}
                                columns={columns}
                                locale={locale}
                            />
                        </Col>
                    </Row>
                </Container>
            </div>

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

            {
                showAddContact && <AddContactPerson
                    onClose={onCloseAdd}
                    studentId={student?.id}
                    relationTypes={relationTypes}
                />
            }

            {
                showEditContact && selectedTableDataId && <EditContactPerson
                    onClose={onCloseEdit}
                    contactPerson={contactPersons?.find(obj => obj?.id === selectedTableDataId)}
                    studentId={student?.id}
                    relationTypes={relationTypes}
                />
            }

            {showDeleteModal && selectedTableDataId &&
                <DeleteModal
                    onClose={closeModal}
                    onDelete={handleDelete}
                    locale={locale}
                    title={t('delete')}
                >
                    {t('delete_confirmation')}
                    <br />
                    <br />
                    {t('delete_confirmation_description')}
                </DeleteModal>
            }
        </>
    )
}

export default ContactPersons