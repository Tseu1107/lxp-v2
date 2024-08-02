import { useState } from 'react'
import message from 'modules/message'
import ViewModal from './modal/view'
import React, { useEffect } from 'react'
import TreeView from 'modules/TreeView'
import DTable from 'modules/DataTable/DTable'
import DeleteModal from 'utils/deleteModal'
import secureLocalStorage from 'react-secure-storage'
// import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
import { useTranslation } from 'react-i18next'
import { Row, Col } from 'react-bootstrap'
// import { managerClubDelete, managerClubInit } from 'utils/fetchRequest/Urls'
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone'
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone'
import ControlPointIcon from '@mui/icons-material/ControlPoint';

import AddClub from './modal/add'
import EditClub from './modal/edit'

const index = () => {

    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
    const { t } = useTranslation()

    const treeIndex = ['manager_club_tree_index'];
    const localeActiveTableState = 'manager_club_table_index'
    const [loading, setLoading] = useState(false)

    const title = t('club.title');
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "manager/clubs", text: title }
    ];

    const [treeData, setTreeData] = useState([])
    const [selectedTreeData, setSelectedTreeData] = useState(secureLocalStorage?.getItem(treeIndex) || {})

    const [tableData, setTableData] = useState([
        {
            "id": 155134,
            "groupId": 155134,
            "groupName": "Япон хэлний дугуйлан",
            "groupType": "Дугуйлан",
            "subjectId": 67932,
            "subjectName": "Дугайлан",
            "subjectCode": "Дугайлан",
            "teacherFirstName": "Admin",
            "teacherLastName": "eSchool",
            "teacherAvatar": "https://lxp-cdn.eschool.mn/u/6434f913cf1c5.png",
            "teacherId": 14811,
            "classIds": [],
            "classList": [],
            "classes": "",
            "studentCount": 0,
            "isAll": true
        },
        {
            "id": 155136,
            "groupId": 155136,
            "groupName": "Япон хэл-N5",
            "groupType": "Дугуйлан",
            "subjectId": 67932,
            "subjectName": "Дугайлан",
            "subjectCode": "Дугайлан",
            "teacherFirstName": "Admin",
            "teacherLastName": "eSchool",
            "teacherAvatar": "https://lxp-cdn.eschool.mn/u/6434f913cf1c5.png",
            "teacherId": 14811,
            "classIds": [
                "6978",
                "11830",
                "11823",
                "6979"
            ],
            "classList": [
                {
                    "id": "6978",
                    "className": "2A"
                },
                {
                    "id": "11830",
                    "className": "8А"
                },
                {
                    "id": "11823",
                    "className": "9A"
                },
                {
                    "id": "6979",
                    "className": "2B"
                }
            ],
            "classes": "2A, 8А, 9A, 2B",
            "studentCount": 15,
            "isAll": false
        },
        {
            "id": 155139,
            "groupId": 155139,
            "groupName": "Сагсан бөмбөг 2-8",
            "groupType": "Секц",
            "subjectId": 67933,
            "subjectName": "Секц",
            "subjectCode": "Секц",
            "teacherFirstName": "Admin",
            "teacherLastName": "eSchool",
            "teacherAvatar": "https://lxp-cdn.eschool.mn/u/6434f913cf1c5.png",
            "teacherId": 14811,
            "classIds": [
                "6978",
                "6979",
                "11830"
            ],
            "classList": [
                {
                    "id": "6978",
                    "className": "2A"
                },
                {
                    "id": "6979",
                    "className": "2B"
                },
                {
                    "id": "11830",
                    "className": "8А"
                }
            ],
            "classes": "2A, 2B, 8А",
            "studentCount": 14,
            "isAll": false
        },
    ])
    const [selectedTableDataId, setSelectedTableDataId] = useState([])

    const [showViewModal, setShowViewModal] = useState(false)
    const [showAddClub, setShowAddClub] = useState(false)
    const [showEditClub, setShowEditClub] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [totalCount, setTotalCount] = useState(0)

    const [tableState, setTableState] = useState(secureLocalStorage.getItem(localeActiveTableState) ||
    {
        filter: {},
        page: 1,
        pageSize: 10,
        search: '',
        sort: 'teacherFirstName',
        order: 'asc'
    }
    )

    const columns = [
        {
            dataField: 'groupType',
            text: translations(locale)?.course_type,
            sort: true,
        },
        {
            dataField: 'subjectName',
            text: translations(locale)?.course_lesson,
            sort: true
        },
        {
            dataField: 'groupName',
            text: translations(locale)?.club?.title,
            sort: true,
        },
        {
            dataField: 'teacherFirstName',
            text: translations(locale)?.teacher_title,
            sort: true
        },
        {
            dataField: 'studentCount',
            text: translations(locale)?.season_score?.student_count,
            sort: true,
            align: 'right',
            formatter: (cell, row) => <span className='underline' onClick={() => handleContextMenuClick(row?.id, 'view')}>{cell}</span>,
        },
    ]

    const contextMenus = [
        {
            key: 'edit',
            icon: <BorderColorTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: translations(locale)?.edit
        },
        {
            key: 'delete',
            icon: <DeleteTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: translations(locale)?.delete
        },
    ]

    const config = {
        excelExport: true,
        printButton: true,
        excelFileName: `${secureLocalStorage.getItem('selectedSchool')?.text}-${selectedTreeData?.title}-${translations(locale)?.club?.title}`,
        defaultSort: [
            {
                dataField: tableState?.sort || 'teacherFirstName',
                order: tableState?.order || 'asc'
            }
        ],
        defaultPageOptions: {
            page: tableState?.page,
            sizePerPage: tableState?.pageSize,
            search: tableState?.search,
        }
    }

    const init = (pagination, treeData) => {
        console.log('init')
        // setLoading(true)
        // fetchRequest(managerClubInit, 'POST', {
        //     filter: pagination?.filter,
        //     order: pagination?.order,
        //     sort: pagination?.sort,
        //     page: pagination?.page,
        //     pageSize: pagination?.pageSize,
        //     search: pagination?.search,
        //     gradeIds: treeData ? JSON.stringify(treeData?.ids) : null
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             const { groups, grades, totalCount } = res.data
        //             setTableData(groups || [])
        //             setTreeData(grades || [])
        //             setTotalCount(totalCount || 0)
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

    useEffect(() => {
        if (selectedTreeData) {
            init(tableState, selectedTreeData)
        } else {
            init(tableState)
        }
    }, [])

    const handleContextMenuClick = (id, key) => {
        if (id && key) {
            setSelectedTableDataId(id)
            if (key === 'view') {
                setShowViewModal(true)
            } else if (key === 'edit') {
                setShowEditClub(true)
                // navigate('/manager/clubs/edit', { state: { id, tab: 0 } })
                console.log('edit page')
            } else if (key === 'delete') {
                setShowDeleteModal(true)
            }
        } else if (!id) {
            return message('no_info')
        }
    }

    const handleDelete = () => {
        console.log('handleDelete')
        // setLoading(true)
        // fetchRequest(managerClubDelete, 'POST', {
        //     filter: tableState?.filter,
        //     order: tableState?.order,
        //     sort: tableState?.sort,
        //     page: tableState?.page,
        //     pageSize: tableState?.pageSize,
        //     search: tableState?.search,
        //     gradeIds: JSON.stringify(selectedTreeData?.ids),
        //     group: selectedTableDataId
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             const { groups, totalCount } = res.data
        //             setTableData(groups || [])
        //             setTotalCount(totalCount || 0)
        //             closeModal()
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

    const closeModal = () => {
        setShowAddClub(false)
        setShowEditClub(false)
        setShowViewModal(false)
        setShowDeleteModal(false)
        setSelectedTableDataId(null)
    }

    const handleTreeChange = (node) => {
        setSelectedTreeData(node);
        secureLocalStorage?.setItem(treeIndex, node);

        let cloneData = {
            page: 1,
            pageSize: tableState.pageSize,
            search: tableState.search,
            sort: tableState.sort,
            order: tableState.order,
            filter: {
                page: 1,
                pageSize: tableState?.filter?.pageSize || 10
            }
        };

        setTableState(cloneData)
        secureLocalStorage.setItem(localeActiveTableState, cloneData)

        init(cloneData, node)
    }

    const onUserInteraction = (state) => {
        if (state.search) {
            let cloneData = {
                page: 1,
                pageSize: state.pageSize,
                search: state.search,
                filter: {
                    page: 1,
                    pageSize: state?.filter?.pageSize || 10
                }
            };

            setTableState(cloneData)
            secureLocalStorage.setItem(localeActiveTableState, cloneData)
            init(cloneData, selectedTreeData)
        } else {
            if (state.page) {
                setTableState(state)
                secureLocalStorage.setItem(localeActiveTableState, state)
                init(state, selectedTreeData)
            }
        }
    }

    return (
        <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <HtmlHead title={title} description={description} />

            <div className="page-title-container mb-2">
                <Col md="7" className='p-0'>
                    <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
                    <BreadcrumbList items={breadcrumbs} />
                </Col>
            </div>
            <div className='m-content'>
                <div className='row'>
                    <Col xl="2" xxl="2">
                        <div className='m-portlet'>
                            <div className='m-portlet__body'>
                                <TreeView
                                    defaultExpandAll
                                    treeData={treeData}
                                    selectedNodes={[selectedTreeData?.key]}
                                    onSelect={(params, { node } = info) => handleTreeChange(node)}
                                />
                            </div>
                        </div>
                    </Col>
                    <Col xl="10" xxl="10">
                        <button
                            onClick={() => setShowAddClub(true)}
                            className='btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3'
                        >
                            <ControlPointIcon style={{ color: "white", marginRight: "4px" }} className='MuiSvg-customSize'/>
                            {t('add')}
                        </button>
                        <div className='m-portlet tab'>
                            <div className='m-portlet__body'>
                                <DTable
                                    remote
                                    config={config}
                                    locale={locale}
                                    data={tableData}
                                    columns={columns}
                                    clickContextMenu
                                    contextMenus={contextMenus}
                                    onContextMenuItemClick={handleContextMenuClick}
                                    onInteraction={onUserInteraction}
                                    totalDataSize={totalCount}
                                />
                            </div>
                        </div>
                    </Col>
                </div>
            </div>
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
                showAddClub &&
                <AddClub
                    onClose={closeModal}
                />
            }
            {
                showEditClub && selectedTableDataId &&
                <EditClub
                    onClose={closeModal}
                    selectedTableId={selectedTableDataId}
                />
            }
            {
                showViewModal && selectedTableDataId &&
                <ViewModal
                    onClose={closeModal}
                    group={selectedTableDataId}
                />
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
        </div>
    )
}

export default index