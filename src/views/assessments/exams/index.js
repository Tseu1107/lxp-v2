import { useState } from 'react'
import message from 'modules/message'
// import SubHeader from 'Src/SubHeader'
import React, { useEffect } from 'react'
import { Tab } from 'semantic-ui-react'
import TreeView from 'modules/TreeView'
import {Redirect} from "react-router-dom";
import DTable from 'modules/DataTable/DTable'
import DeleteModal from 'utils/deleteModal'
import secureLocalStorage from 'react-secure-storage'
import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
import { Row, Col, Modal } from 'react-bootstrap'
import HtmlHead from 'components/html-head/HtmlHead'
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList'
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone'
import PreviewTwoToneIcon from '@mui/icons-material/PreviewTwoTone'
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded'
// import { assessmentExamDelete, assessmentExamInit, assessmentExamUnPublish } from 'utils/url'
import e from '@toast-ui/react-image-editor'
import { useTranslation } from 'react-i18next'

const treeIndex = 'assessments_exams_tree_index';
const localeSelectedTab = 'assessments_exams_tab_data';
const localePublishTableState = 'assessments_exams_publish_table_state';
const localeUnpublishTableState = 'assessments_exams_unpublish_table_state';

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const contextMenus = [
    {
        key: 'view',
        icon: <PreviewTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
        title: translations(locale)?.view,
    },
    {
        key: 'unPublish',
        icon: <HighlightOffRoundedIcon sx={{ fontSize: '1.8rem !important', color: '#ff5b1d' }} />,
        title: translations(locale)?.unPublish
    },
    {
        key: 'delete',
        icon: <DeleteTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
        title: translations(locale)?.delete
    },
]

const index = () => {

    const { t } = useTranslation()
    
    const title = t('exam.flow_exam');
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "assessments/exams", text: title }
    ];

    const [loading, setLoading] = useState(false)

    const [pdfExported, setPdfExported] = useState(false)
    const [treeData, setTreeData] = useState([])
    const [selectedTreeData, setSelectedTreeData] = useState(secureLocalStorage?.getItem(treeIndex) || null)

    const [tableData, setTableData] = useState([])
    const [selectedTableDataId, setSelectedTableDataId] = useState(null)
    const [tableDataTotalCount, setTableDataTotalCount] = useState(0)

    const [selectedTabData, setSelectedTabData] = useState(
        secureLocalStorage?.getItem(localeSelectedTab)
        || {
            index: 0,
            menuItem: translations(locale)?.published,
            isPublish: 1,
        })

    const state = 
        selectedTabData?.isPublish
        ? 
            secureLocalStorage.getItem(localePublishTableState)
        : 
            secureLocalStorage.getItem(localeUnpublishTableState)

    const [tableState, setTableState] = useState(
        {
            page: state?.page || 1,
            pageSize: state?.pageSize || 10,
            search: state?.search || '',
            sort: state?.sort || 'takenDate',
            order: state?.order || 'desc'
        }
    )

    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const columns = [
        {
            dataField: 'templateName',
            text: translations(locale)?.exam?.template_name,
            sort: true
        },
        {
            dataField: 'takenDate',
            text: translations(locale)?.exam?.date,
            sort: true
        },
        {
            dataField: 'name',
            text: translations(locale)?.exam?.name,
            sort: true,
            formatter: (cell, row) => { return <span className='underline' onClick={() => handleContextMenuClick(row?.id, 'view', row)}>{cell}</span> }
        },
        {
            dataField: 'groupName',
            text: translations(locale)?.className,
            sort: true
        },
        {
            dataField: 'subjectName',
            text: translations(locale)?.subject?.title,
            sort: true
        },
        {
            dataField: 'totalStudentNumber',
            text: translations(locale)?.group?.student_count,
            align: 'right',
            sort: true
        },
        {
            dataField: 'averageScore',
            text: translations(locale)?.average,
            align: 'right',
            sort: true
        },
        {
            dataField: 'maxScore',
            text: translations(locale)?.max,
            align: 'right',
            sort: true
        },
        {
            dataField: 'minScore',
            text: translations(locale)?.min,
            align: 'right',
            sort: true
        },
        {
            dataField: 'createdUserName',
            text: translations(locale)?.teacher?.title,
            sort: true
        }
    ]

    const config = {
        excelExport: true,
        printButton: true,
        columnButton: true,
        excelFileName: `${secureLocalStorage.getItem('selectedSchool')?.text}-${translations(locale)?.exam?.flow_exam}-${selectedTabData?.menuItem}`,
        defaultSort: [{
            dataField: tableState?.sort || 'takenDate',
            order: tableState?.order || 'desc'
        }],
        defaultPageOptions: {
            page: tableState?.page || 1,
            sizePerPage: tableState?.pageSize || 10,
            search: tableState?.search || '',
        }
    }

    const init = (season, tabData, selectedTableState) => {
        console.log('init')
        // setLoading(true)
        // fetchRequest(assessmentExamInit, 'POST', { 
        //     publish: tabData?.isPublish, 
        //     season: season || selectedTreeData, 
        //     ...selectedTableState 
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             const { examList, treeData: seasons, selectedTreeId, totalCount } = res.data

        //             setPdfExported(res?.data?.pdfExported || false)

        //             if (!selectedTreeData) {
        //                 setSelectedTreeData(selectedTreeId || null)
        //                 secureLocalStorage?.setItem(treeIndex, selectedTreeId)
        //             } else {
        //                 setSelectedTreeData(season || null)
        //                 secureLocalStorage?.setItem(treeIndex, season)
        //             }

        //             setTableDataTotalCount(totalCount || 0)
        //             setTableData(examList || [])
        //             if (!treeData?.length) setTreeData(seasons || [])
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
            init(selectedTreeData, selectedTabData, tableState)
        } else {
            init()
        }
    }, [])

    useEffect(() => {
        if (selectedTabData?.isPublish) {
            tableData?.forEach(el => el.contextMenuKeys && el.contextMenuKeys?.length > 0 ? el.contextMenuKeys : (el.contextMenuKeys = (pdfExported ? 'view' : 'view,unPublish')))
        } else {
            tableData?.forEach(el => el.contextMenuKeys && el.contextMenuKeys?.length > 0 ? el.contextMenuKeys : (el.contextMenuKeys = (pdfExported ? 'view' : 'view,delete')))
        }
    }, [selectedTabData, tableData])

    const handleUnPublish = exam => {
        console.log('handleUnPublish')
        // setLoading(true)
        // fetchRequest(assessmentExamUnPublish, 'POST', { exam, season: selectedTreeData, ...tableState })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             setTableDataTotalCount(res.data?.totalCount || 0)
        //             setTableData(res.data?.examList || [])
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

    const handleDelete = () => {
        console.log('handleDelete')
        // setLoading(true)
        // fetchRequest(assessmentExamDelete, 'POST', { exam: selectedTableDataId, season: selectedTreeData, publish: 0, ...tableState })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             setTableDataTotalCount(res.data?.totalCount || 0)
        //             setTableData(res.data?.examList || [])
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

    const handleContextMenuClick = (id, key, row) => {
        if (id && key) {
            setSelectedTableDataId(id)
            if (key === 'view') {
                if (selectedTabData?.isPublish || row?.isTemplate)
                {
                    console.log('asi')
                }
                    // <Link to="/online-exam/template-add">
                    // navigate('/teacher/journals/exams/result', {
                    //     state: {
                    //         id,
                    //         isTemplate: row?.isTemplate,
                    //         urlData: {
                    //             backUrl: '/assessments/exams',
                    //         }
                    //     }
                    // })
                else{
                    console.log('re')
                    // <Redirect to="/teacher/journals" />
                    // navigate('/teacher/journals/exams/edit', {
                    //     state: {
                    //         id,
                    //         urlData: {
                    //             backUrl: '/assessments/exams',
                    //         }
                    //     }
                    // })
                }
            } else if (key === 'unPublish') {
                handleUnPublish(id)
            } else if (key === 'delete') {
                setShowDeleteModal(true)
            }
        }
    }

    const closeModal = () => {
        setShowDeleteModal(false)
        setSelectedTableDataId(null)
    }

    const onTabChange = tab => {
        setSelectedTabData(tab)
        
        if (tab?.isPublish) {
            let publishTableState = secureLocalStorage.getItem(localePublishTableState)
            if(publishTableState){
                publishTableState.page = 1;
            } else {
                publishTableState = {
                    page: 1,
                    pageSize: 10,
                    search: '',
                    sort: 'takenDate',
                    order: 'desc'
                }
            }

            setTableState(publishTableState)
            secureLocalStorage.setItem(localePublishTableState, publishTableState)
            init(selectedTreeData, tab, publishTableState)
        } else {
            let unPublishTableState = secureLocalStorage.getItem(localeUnpublishTableState)
            if(unPublishTableState){
                unPublishTableState.page = 1;
            } else {
                unPublishTableState = {
                    page: 1,
                    pageSize: 10,
                    search: '',
                    sort: 'takenDate',
                    order: 'desc'
                }
            }

            setTableState(unPublishTableState)
            secureLocalStorage.setItem(localeUnpublishTableState, unPublishTableState)
            init(selectedTreeData, tab, unPublishTableState)
        }

        secureLocalStorage?.setItem(localeSelectedTab, tab)
    }

    const handleInteraction = params => {
        if(params.page){
            setTableState(params)

            init(selectedTreeData, selectedTabData, params)

            if (selectedTabData?.isPublish){
                secureLocalStorage.setItem(localePublishTableState, params)
            } else {
                secureLocalStorage.setItem(localeUnpublishTableState, params)
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
                                    selectedNodes={[selectedTreeData]}
                                    onSelect={(key) => init(key?.[0], selectedTabData, tableState)}
                                />
                            </div>
                        </div>
                    </Col>
                    <Col xl="10" xxl="10">
                        <div className='m-portlet tab'>
                            <div className='m-portlet__head'>
                                <Tab
                                    activeIndex={selectedTabData?.index}
                                    renderActiveOnly
                                    panes={[
                                        {
                                            index: 0,
                                            menuItem: translations(locale)?.published,
                                            isPublish: 1,
                                        },
                                        {
                                            index: 1,
                                            menuItem: translations(locale)?.not_published,
                                            isPublish: 0,
                                        }
                                    ]}
                                    className='no-shadow'
                                    menu={{ secondary: true, pointing: true, className: 'primaryColor' }}
                                    onTabChange={(e, data) => onTabChange(data?.panes[data?.activeIndex])}
                                />
                            </div>
                            <div className='m-portlet__body'>
                                <Tab.Pane attached={false}>
                                    <DTable
                                        remote
                                        locale={locale}
                                        config={config}
                                        data={tableData}
                                        columns={columns}
                                        individualContextMenus
                                        contextMenus={contextMenus}
                                        onInteraction={handleInteraction}
                                        totalDataSize={tableDataTotalCount}
                                        onContextMenuItemClick={handleContextMenuClick}
                                    />
                                </Tab.Pane>
                            </div>
                        </div>
                    </Col>
                </div>
            </div>
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
                loading &&
                <>
                    <div className='blockUI blockOverlay' />
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg' />
                    </div>
                </>
            }
        </div>
    )
}

export default index