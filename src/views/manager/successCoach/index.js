import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
// import * as actions from "Actions/action";
import { Checkbox, Dropdown, Modal, Tab } from 'semantic-ui-react'
import DTable from "modules/DataTable/DTable";
import Search from "modules/DataTable/Search";
import TreeView from "modules/TreeView";
import { useSelector } from 'react-redux'
import { sessionService } from 'redux-react-session';
import { Row, Col, Button } from "react-bootstrap";
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import message from "modules/message";
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import GroupsIcon from '@mui/icons-material/Groups';
import CloseIcon from '@mui/icons-material/Close';
import secureLocalStorage from "react-secure-storage";
import { useTranslation } from "react-i18next";

import AddStudent from './modals/addStudent'
import DeleteModal from 'utils/deleteModal';

import { fetchRequest } from 'utils/fetchRequest'
import { managerSuccessCoachIndex, managerSuccessCoachAddStudent, managerSuccessCoachRemoveStudent } from 'utils/fetchRequest/Urls'


const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const index = () => {
    const { t } = useTranslation()
    const { selectedSchool } = useSelector(state => state.schoolData);

    const title = t('successCoach.group');
    const description = t('successCoach.group');
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "manager/success-coach", text: title }
    ];

    const [loading, setLoading] = useState(false)
    const [initLoaded, setInitLoaded] = useState(false)

    const [coachSearchQuery, setCoachSearchQuery] = useState('')
    const [selectedCoachUser, setSelectedCoachUser] = useState(null)
    const [coachUsers, setCoachUsers] = useState([])
    const [tmpCoachUsers, setTmpCoachUsers] = useState([])

    const [totalCount, setTotalCount] = useState(0)
    const [tableData, setTableData] = useState([])

    const [selectedTableDataId, setSelectedTableDataId] = useState(null)
    const [showAddStudent, setShowAddStudent] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const contextMenus = [
        {
            key: 'DELETE',
            icon: <DeleteTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: t('successCoach.removeStudent')
        }
    ]

    const [updateView, setUpdateView] = useState(false)

    const [tableState, setTableState] = useState({
        page: 1,
        pageSize: 10,
        search: '',
        sort: 'subjectName',
        order: 'asc'
    })

    const config = {
        excelExport: true,
        printButton: true,
        excelFileName: t('successCoach.group') + (selectedCoachUser ? '-' + coachUsers?.find(obj => obj?.id === selectedCoachUser)?.firstName : ''),
        defaultSort: [{
            dataField: tableState?.sort || 'subjectName',
            order: tableState?.order || 'asc'
        }],
        defaultPageOptions: {
            page: tableState?.page || 1,
            sizePerPage: tableState?.pageSize || 10,
            search: tableState?.search || '',
        }
    }

    const columns = [
        {
            dataField: 'avatar',
            text: t('teacher.photo'),
            sort: false,
            width: 40,
            align: 'center',
            formatter: (cell) =>
                <img className='img-responsive img-circle'
                    src={cell || '/img/profile/placeholder.jpg'}
                    width={40} height={40} alt='profile picture'
                    onError={(e) => {
                        e.target.onError = null
                        e.target.src = '/img/profile/avatar.png'
                    }}
                />
        },
        {
            dataField: 'className',
            text: t('group.title'),
            sort: true
        },
        {
            dataField: 'code',
            text: t('studentCode'),
            sort: true,
            formatter: (cell, row) => { return <span className='underline' onClick={() => onClickName(row)}>{cell}</span> }
        },
        {
            dataField: 'lastName',
            text: t('studentLastName'),
            sort: true
        },
        {
            dataField: 'firstName',
            text: t('studentFirstName'),
            sort: true,
        },
        {
            dataField: 'curriculumName',
            text: t('group.curriculum'),
            sort: true,
        },
        {
            dataField: 'performance',
            text: t('common.performance'),
            sort: true,
        },
        {
            dataField: 'lastContactDate',
            text: t('successCoach.contactDate'),
            sort: true,
        },
    ]

    const loadData = (params = {}) => {
        setLoading(true)
        fetchRequest(managerSuccessCoachIndex, 'POST', params)
            .then((res) => {
                if (res.success) {
                    setCoachUsers(res?.users || [])
                    setTmpCoachUsers(res?.users || [])
                    setTotalCount(res?.totalCount || 0)
                    setTableData(res?.students || [])
                } else {
                    message(res.message)
                }
                setInitLoaded(true)
                setLoading(false)
            })
            .catch(() => {
                message(t('err.error_occurred'))
                setLoading(false)
            })
    }

    useEffect(() => {
        loadData({
            school: selectedSchool?.id
        })
    }, [])

    const _contextMenuItemClick = (id, key) => {
        if (id && key) {
            setSelectedTableDataId(tableData?.find(obj => obj.id === id)?.studentId)
            if (key === 'DELETE') {
                setShowDeleteModal(true)
            }
        }
    }

    const onUserInteraction = state => {
        if (initLoaded) {
            let page = state?.page
            if (tableState?.search !== state?.search) {
                page = 1;
            }

            let params = {
                page: page,
                pageSize: state?.pageSize,
                search: state?.search,
                sort: state?.sort,
                order: state?.order
            }

            setTableState(params)
            loadData({
                school: selectedSchool?.id,
                coach: selectedCoachUser,
                page: page,
                pageSize: state?.pageSize,
                search: state?.search,
                sort: state?.sort,
                order: state?.order
            })
        }
    }

    const closeDeleteModal = () => {
        setSelectedTableDataId(null)
        setShowDeleteModal(false)
    };

    const onCoachSearch = (value = '') => {
        console.log('Coach search', value)
        let clone = [...coachUsers]
        console.log('Clone', clone)
        if (value && value?.length > 0) {
            clone = clone.filter(obj => {
                return obj?.firstName?.toLowerCase()?.includes(value?.toLowerCase()) 
                    || obj?.lastName?.toLowerCase()?.includes(value?.toLowerCase())
                    || obj?.teacherCode?.toLowerCase()?.includes(value?.toLowerCase())
            })
        } 
        setTmpCoachUsers(clone)
    }

    const submitStudent = (params = {}) => {
        const updateParams = Object.assign(params, {
            school: selectedSchool?.id,
            coach: selectedCoachUser
        })

        setLoading(true)
        fetchRequest(managerSuccessCoachAddStudent, 'POST', updateParams)
            .then((res) => {
                if (res.success) {
                    setShowAddStudent(false)
                    loadData({
                        school: selectedSchool?.id,
                        coach: selectedCoachUser,
                        page: tableState?.page,
                        pageSize: tableState?.pageSize,
                        search: tableState?.search,
                        sort: tableState?.sort,
                        order: tableState?.order
                    })
                } else {
                    setLoading(false)
                    message(res.message)
                }
            })
            .catch(() => {
                message(t('err.error_occurred'))
                setLoading(false)
            })
    }

    const _onSubmitDelete = () => {
        let params = {
            school: selectedSchool?.id,
            coach: selectedCoachUser,
            student: selectedTableDataId
        };

        setLoading(true)
        fetchRequest(managerSuccessCoachRemoveStudent, 'POST', params)
            .then((res) => {
                if (res.success) {
                    closeDeleteModal()
                    loadData({
                        school: selectedSchool?.id,
                        coach: selectedCoachUser,
                        page: tableState?.page,
                        pageSize: tableState?.pageSize,
                        search: tableState?.search,
                        sort: tableState?.sort,
                        order: tableState?.order
                    })
                } else {
                    setLoading(false)
                    message(res.message)
                }
            })
            .catch(() => {
                message(t('err.error_occurred'))
                setLoading(false)
            })
    }

    return (
        <div className="m-grid__item m-grid__item--fluid m-wrapper">
            <HtmlHead title={title} description={description} />

            <div className="page-title-container mb-2">
                <Col md="7" className='p-0'>
                    <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
                    <BreadcrumbList items={breadcrumbs} />
                </Col>
            </div>
            <div className="m-content">
                <div className={"row myTimetable-IndexStyle"}>
                    <Col xl="2" xxl="2">

                        <Search
                            value={coachSearchQuery}
                            onSearch={() => onCoachSearch(coachSearchQuery)}
                            setter={value => {
                                setCoachSearchQuery(value || '')
                                onCoachSearch(value || '')
                            }}
                            rootStyle={{
                                width: '100%',
                                fontSize: '1rem !important',
                                padding: '0px 4px',
                                display: 'flex',
                                alignItems: 'center',
                                border: '1px solid #EBEDF2',
                                boxShadow: 'none',
                                borderRadius: 8,
                                height: 35
                            }}
                            showSearchButton={false}
                            onSubmit={(query) => {
                                if (query && query.length > 0) {
                                    onCoachSearch()
                                }
                            }}
                            locale={locale}
                        />

                        <Row className="m-0 mt-2">
                            <Col md={12} className="text-right p-0">
                                <span>{t('total')}: {tmpCoachUsers?.length}</span>
                            </Col>
                        </Row>

                        <div className="mt-2 unattached-tab">
                            {
                                tmpCoachUsers?.map(obj => {
                                    return <div className={selectedCoachUser && obj?.id === selectedCoachUser ? "m-portlet br-12 item active" : "m-portlet br-12 item"} key={obj?.id} style={{
                                        cursor: 'pointer'
                                    }}
                                        onClick={() => {
                                            if (obj?.id) {
                                                setSelectedCoachUser(obj?.id)

                                                loadData({
                                                    school: selectedSchool?.id,
                                                    coach: obj?.id
                                                })
                                            }
                                        }}>
                                        <div className="m-portlet__body font-pinnacle bolder" style={{
                                            color: selectedCoachUser && obj?.id === selectedCoachUser ? 'white' : '#ff5b1d'
                                        }}>
                                            <p className="m-0">{obj?.firstName} ({obj?.code} {obj?.lastName})</p>
                                            <p className="m-0">{obj?.studentCount}</p>
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    </Col>
                    <Col xl="10" xxl="10">
                        <button
                            type="button"
                            disabled={selectedCoachUser === null}
                            onClick={() => setShowAddStudent(true)}
                            className="btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3"
                        >
                            <AddCircleOutlineRoundedIcon className='MuiSvg-customSize' />
                            <span className='ml-2'>{t('common.register')}</span>
                        </button>
                        <div className="m-portlet br-12">
                            <div className="m-portlet__body">
                                <DTable
                                    remote
                                    config={config}
                                    data={tableData}
                                    columns={columns}
                                    locale={locale}
                                    clickContextMenu
                                    contextMenus={contextMenus}
                                    currentPage={tableState?.page}
                                    onContextMenuItemClick={_contextMenuItemClick}
                                    onInteraction={onUserInteraction}
                                    totalDataSize={totalCount}
                                />
                            </div>
                        </div>
                    </Col>
                </div>
            </div>

            {
                showAddStudent &&
                <AddStudent
                    onClose={() => {
                        setShowAddStudent(false)
                    }}
                    onSubmit={submitStudent}
                    users={coachUsers}
                    teacherUserId={selectedCoachUser}
                />
            }

            {
                showDeleteModal &&
                <DeleteModal
                    show={showDeleteModal}
                    onClose={closeDeleteModal}
                    onDelete={_onSubmitDelete}
                    locale={locale}
                    title={t('delete')}
                >
                    <div className="row">
                        <div className="col-md-12">
                            <div>
                                <p>{t('warning.delete_confirmation')}</p>
                                <p>{t('warning.delete_confirmation_description')}</p>
                            </div>
                        </div>
                    </div>
                </DeleteModal>
            }
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