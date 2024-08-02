import { useState } from 'react'
import message from 'modules/message'
import ViewModal from './modal/view'
import React, { useEffect } from 'react'
import { Tab } from 'semantic-ui-react'
import TreeView from 'modules/TreeView'
import ResponseModal from './modal/response'
import RegisterModal from './modal/register'
import DTable from 'modules/DataTable/DTable'
import { useTranslation } from 'react-i18next'
import secureLocalStorage from 'react-secure-storage'
import { Col, Container, Row } from 'react-bootstrap'
import { fetchRequest } from 'utils/fetchRequest'
import { translations } from 'utils/translations'
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import DayPickerInput from 'react-day-picker/DayPickerInput'
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone'
import PreviewTwoToneIcon from '@mui/icons-material/PreviewTwoTone'
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
// import {
//     schoolClassInit,
//     teacherExcuseReasonInit,
//     teacherExcuseReasonSubmit,
//     teacherExcuseRequestInit,
//     teacherExcuseRequestExcel,
//     teacherExcuseRequestSubmit
// } from 'Utilities/url'

const index = () => {
    const locale = secureLocalStorage?.getItem('selectedLang') || 'mn';
    const { t } = useTranslation()

    const title = t('absent.registration')
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "manager/excuse", text: title }
    ];

    const treeIndex = ['manager_excuses_tree_index'];
    const tabIndex = ['manager_excuses_tab_index'];
    const requestTableIndex = ['manager_excuses_request_table_index'];
    const reasonTableIndex = ['manager_excuses_reason_table_index'];

    const [loading, setLoading] = useState(false)

    const [treeData, setTreeData] = useState([])
    const [selectedTreeData, setSelectedTreeData] = useState(secureLocalStorage?.getItem(treeIndex) || [])

    const [columns, setColumns] = useState([])
    const [tableData, setTableData] = useState([
        {
            id: "76768",
            statusId: null,
            statusName: null,
            statusUser: null,
            statusCode: null,
            statusColor: null,
            statusDate: "-",
            statusDescription: null,
            timetableCount: 7,
            startDate: {
                date: "2024-06-07 00:00:00.000000",
                timezone_type: 3,
                timezone: "Asia/Ulaanbaatar"
            },
            endDate: {
                date: "2024-06-08 00:00:00.000000",
                timezone_type: 3,
                timezone: "Asia/Ulaanbaatar"
            },
            className: "12C",
            firstName: "Энххүслэн",
            lastName: "Мөнхбат",
            createdUser: "Майцэцэг",
            studentId: "1315",
            code: "24180",
            createdDate: {
                date: "2024-06-07 14:41:27.000000",
                timezone_type: 3,
                timezone: "Asia/Ulaanbaatar"
            },
            date: "2024.06.07",
            logCount: 0
        },
        {
            id: "76750",
            statusId: null,
            statusName: null,
            statusUser: null,
            statusCode: null,
            statusColor: null,
            statusDate: "-",
            statusDescription: null,
            timetableCount: 5,
            startDate: {
                date: "2024-06-07 00:00:00.000000",
                timezone_type: 3,
                timezone: "Asia/Ulaanbaatar"
            },
            endDate: {
                date: "2024-06-07 00:00:00.000000",
                timezone_type: 3,
                timezone: "Asia/Ulaanbaatar"
            },
            className: "12C",
            firstName: "Индра",
            lastName: "Тэмүүжин",
            createdUser: "indra",
            studentId: "1333",
            code: "24332",
            createdDate: {
                date: "2024-06-07 11:56:45.000000",
                timezone_type: 3,
                timezone: "Asia/Ulaanbaatar"
            },
            date: "2024.06.07",
            logCount: 0
        },
        {
            id: "76745",
            statusId: null,
            statusName: null,
            statusUser: null,
            statusCode: null,
            statusColor: null,
            statusDate: "-",
            statusDescription: null,
            timetableCount: 7,
            startDate: {
                date: "2024-06-07 00:00:00.000000",
                timezone_type: 3,
                timezone: "Asia/Ulaanbaatar"
            },
            endDate: {
                date: "2024-06-07 00:00:00.000000",
                timezone_type: 3,
                timezone: "Asia/Ulaanbaatar"
            },
            className: "12C",
            firstName: "Амартүвшин",
            lastName: "Анар",
            createdUser: "Ариунгэрэл",
            studentId: "1322",
            code: "22732",
            createdDate: {
                date: "2024-06-07 11:09:57.000000",
                timezone_type: 3,
                timezone: "Asia/Ulaanbaatar"
            },
            date: "2024.06.07",
            logCount: 0
        },
        {
            id: "76743",
            statusId: null,
            statusName: null,
            statusUser: null,
            statusCode: null,
            statusColor: null,
            statusDate: "-",
            statusDescription: null,
            timetableCount: 7,
            startDate: {
                date: "2024-06-07 00:00:00.000000",
                timezone_type: 3,
                timezone: "Asia/Ulaanbaatar"
            },
            endDate: {
                date: "2024-06-07 00:00:00.000000",
                timezone_type: 3,
                timezone: "Asia/Ulaanbaatar"
            },
            className: "12C",
            firstName: "Тэргэл",
            lastName: "Болд",
            createdUser: "Дэлгэрсайхан ",
            studentId: "1313",
            code: "25565",
            createdDate: {
                date: "2024-06-07 11:06:51.000000",
                timezone_type: 3,
                timezone: "Asia/Ulaanbaatar"
            },
            date: "2024.06.07",
            logCount: 0
        },
        {
            id: "76603",
            statusId: null,
            statusName: null,
            statusUser: null,
            statusCode: null,
            statusColor: null,
            statusDate: "-",
            statusDescription: null,
            timetableCount: 7,
            startDate: {
                date: "2024-06-07 00:00:00.000000",
                timezone_type: 3,
                timezone: "Asia/Ulaanbaatar"
            },
            endDate: {
                date: "2024-06-07 00:00:00.000000",
                timezone_type: 3,
                timezone: "Asia/Ulaanbaatar"
            },
            className: "12C",
            firstName: "Тэргэл",
            lastName: "Болд",
            createdUser: "Дэлгэрсайхан ",
            studentId: "1313",
            code: "25565",
            createdDate: {
                date: "2024-06-06 21:18:58.000000",
                timezone_type: 3,
                timezone: "Asia/Ulaanbaatar"
            },
            date: "2024.06.07",
            logCount: 0
        },
        {
            id: "76105",
            statusId: 2,
            statusName: "Зөвшөөрсөн",
            statusUser: "Отгонжаргал",
            statusCode: "ACCEPTED",
            statusColor: "#5dd85c",
            statusDate: "2024-06-05 14:18",
            statusDescription: "Гадаадад зорчих",
            timetableCount: 22,
            startDate: {
                date: "2024-06-03 00:00:00.000000",
                timezone_type: 3,
                timezone: "Asia/Ulaanbaatar"
            },
            endDate: {
                date: "2024-06-04 00:00:00.000000",
                timezone_type: 3,
                timezone: "Asia/Ulaanbaatar"
            },
            className: "8A",
            firstName: "Оюутгоо",
            lastName: "Алтанхуяг",
            createdUser: "Мөнхцэлмэг",
            studentId: "818",
            code: "22556",
            createdDate: {
                date: "2024-06-04 19:20:12.000000",
                timezone_type: 3,
                timezone: "Asia/Ulaanbaatar"
            },
            date: "2024.06.03",
            logCount: 22
        },
        {
            id: "75808",
            statusId: null,
            statusName: null,
            statusUser: null,
            statusCode: null,
            statusColor: null,
            statusDate: "-",
            statusDescription: null,
            timetableCount: 9,
            startDate: {
                date: "2024-06-03 00:00:00.000000",
                timezone_type: 3,
                timezone: "Asia/Ulaanbaatar"
            },
            endDate: {
                date: "2024-06-03 00:00:00.000000",
                timezone_type: 3,
                timezone: "Asia/Ulaanbaatar"
            },
            className: "8A",
            firstName: "Тэлмүүн",
            lastName: "Мөнхтөр",
            createdUser: "Suvd",
            studentId: "1631",
            code: "25092",
            createdDate: {
                date: "2024-06-03 10:47:32.000000",
                timezone_type: 3,
                timezone: "Asia/Ulaanbaatar"
            },
            date: "2024.06.03",
            logCount: 0
        },
        {
            id: "75700",
            statusId: 2,
            statusName: "Зөвшөөрсөн",
            statusUser: "Баясгалан",
            statusCode: "ACCEPTED",
            statusColor: "#5dd85c",
            statusDate: "2024-06-03 08:45",
            statusDescription: null,
            timetableCount: 19,
            startDate: {
                date: "2024-06-03 00:00:00.000000",
                timezone_type: 3,
                timezone: "Asia/Ulaanbaatar"
            },
            endDate: {
                date: "2024-06-04 00:00:00.000000",
                timezone_type: 3,
                timezone: "Asia/Ulaanbaatar"
            },
            className: "8A",
            firstName: "Баттүшиг",
            lastName: "Бат-Өлзий",
            createdUser: "Ninjin",
            studentId: "673",
            code: "22770",
            createdDate: {
                date: "2024-06-03 07:28:43.000000",
                timezone_type: 3,
                timezone: "Asia/Ulaanbaatar"
            },
            date: "2024.06.03",
            logCount: 19
        },
        {
            id: "75634",
            statusId: 2,
            statusName: "Зөвшөөрсөн",
            statusUser: "Уртнасан",
            statusCode: "ACCEPTED",
            statusColor: "#5dd85c",
            statusDate: "2024-06-03 06:39",
            statusDescription: "",
            timetableCount: 0,
            startDate: {
                date: "2024-06-03 00:00:00.000000",
                timezone_type: 3,
                timezone: "Asia/Ulaanbaatar"
            },
            endDate: null,
            className: "8B",
            firstName: "Сүлд",
            lastName: "Энхбаяр",
            createdUser: "Юнгэрэн",
            studentId: "713",
            code: "25187",
            createdDate: {
                date: "2024-06-03 05:16:20.000000",
                timezone_type: 3,
                timezone: "Asia/Ulaanbaatar"
            },
            date: "2024.06.03",
            logCount: 0
        },
        {
            id: "75540",
            statusId: 2,
            statusName: "Зөвшөөрсөн",
            statusUser: "Баясгалан",
            statusCode: "ACCEPTED",
            statusColor: "#5dd85c",
            statusDate: "2024-06-03 08:44",
            statusDescription: null,
            timetableCount: 8,
            startDate: {
                date: "2024-06-04 00:00:00.000000",
                timezone_type: 3,
                timezone: "Asia/Ulaanbaatar"
            },
            endDate: {
                date: "2024-06-04 00:00:00.000000",
                timezone_type: 3,
                timezone: "Asia/Ulaanbaatar"
            },
            className: "8A",
            firstName: "Тэлмүүн",
            lastName: "Мөнхтөр",
            createdUser: "Suvd",
            studentId: "1631",
            code: "25092",
            createdDate: {
                date: "2024-05-31 12:16:14.000000",
                timezone_type: 3,
                timezone: "Asia/Ulaanbaatar"
            },
            date: "2024.06.04",
            logCount: 8
        }
    ])
    const [totalCount, setTotalCount] = useState([])
    const [selectedTableDataId, setSelectedTableDataId] = useState([])

    const [selectedTab, setSelectedTab] = useState(secureLocalStorage?.getItem(tabIndex) ? secureLocalStorage?.getItem(tabIndex).tab : 'request')
    const [activeIndex, setActiveIndex] = useState(secureLocalStorage?.getItem(tabIndex) ? secureLocalStorage?.getItem(tabIndex).index : 0)

    const [showViewModal, setShowViewModal] = useState(false)
    const [responseStatus, setResponseStatus] = useState(null)
    const [showResponseModal, setShowResponseModal] = useState(false)
    const [showRegisterModal, setShowRegisterModal] = useState(false)

    const [statuses, setStatuses] = useState([
        {
            code: "NOT_ANSWERED",
            name: "Хариулаагүй",
            color: "#575962",
            text: "Хариулаагүй",
            ordering: 1,
            count: 65
        },
        {
            id: 1,
            code: "DENIED",
            name: "Татгалзсан",
            color: "#f4516b",
            text: "Татгалзах",
            ordering: 2,
            count: 165
        },
        {
            id: 2,
            code: "ACCEPTED",
            name: "Зөвшөөрсөн",
            color: "#5dd85c",
            text: "Зөвшөөрөх",
            ordering: 3,
            count: 2810
        }
    ])
    const [dates, setDates] = useState({})
    const [statusCode, setStatusCode] = useState(null)

    const [page, setPage] = useState(secureLocalStorage?.getItem(requestTableIndex) ? secureLocalStorage?.getItem(requestTableIndex).page : 1);
    const [pageSize, setPageSize] = useState(secureLocalStorage?.getItem(requestTableIndex) ? secureLocalStorage?.getItem(requestTableIndex).pageSize : 10);
    const [search, setSearch] = useState(secureLocalStorage?.getItem(requestTableIndex) ? secureLocalStorage?.getItem(requestTableIndex).search : '');
    const [order, setOrder] = useState(secureLocalStorage?.getItem(requestTableIndex) ? secureLocalStorage?.getItem(requestTableIndex).order : 'desc');
    const [sort, setSort] = useState(secureLocalStorage?.getItem(requestTableIndex) ? secureLocalStorage?.getItem(requestTableIndex).sort : 'createdDate');

    const [regPage, setRegPage] = useState(secureLocalStorage?.getItem(reasonTableIndex) ? secureLocalStorage?.getItem(reasonTableIndex).page : 1);
    const [regPageSize, setRegPageSize] = useState(secureLocalStorage?.getItem(reasonTableIndex) ? secureLocalStorage?.getItem(reasonTableIndex).pageSize : 10);
    const [regSearch, setRegSearch] = useState(secureLocalStorage?.getItem(reasonTableIndex) ? secureLocalStorage?.getItem(reasonTableIndex).search : '');
    const [regOrder, setRegOrder] = useState(secureLocalStorage?.getItem(reasonTableIndex) ? secureLocalStorage?.getItem(reasonTableIndex).order : 'desc');
    const [regSort, setRegSort] = useState(secureLocalStorage?.getItem(reasonTableIndex) ? secureLocalStorage?.getItem(reasonTableIndex).sort : 'createdDate');

    const [isStatus, setIsStatus] = useState(false);
    const [isSeason, setIsSeason] = useState(false);

    const config = {
        excelExport: true,
        excelFileRemote: true,
        excelFileRemoteUrl: `/${'teacherExcuseRequestExcel'}?type=${selectedTab}&season=${selectedTreeData?.id}&menu=manager&startDate=${dates?.startDate}&endDate=${dates?.endDate}`,
        defaultSort: [{
            dataField: selectedTab == 'request' ? sort : regSort,
            order: selectedTab == 'request' ? order : regOrder
        }],
        defaultPageOptions: {
            page: selectedTab == 'request' ? page : regPage,
            sizePerPage: selectedTab == 'request' ? pageSize : regPageSize,
            search: selectedTab == 'request' ? search : regSearch,
        },
    }

    const requestColumns = [
        {
            dataField: "statusCode",
            text: '',
            align: 'center',
            formatter: (cell, row) => {
                if (cell) return (
                    <div className='br-12 d-flex align-items-center justify-content-center'
                        style={{ backgroundColor: row?.statusColor, height: 25, width: 40, }}>
                        <i className='flaticon-mail-1 fs-19' style={{ color: 'white' }} />
                    </div>
                )
            }
        },
        {
            dataField: "date",
            text: translations(locale)?.date,
            sort: true,
            formatter: (cell, row) => { return <span className='underline' onClick={() => handleContextMenuClick(row?.id, 'view')}>{cell}</span> },
        },
        {
            dataField: "className",
            text: translations(locale)?.className,
            sort: true
        },
        {
            dataField: "code",
            text: translations(locale)?.studentCode,
            sort: true,
        },
        {
            dataField: "lastName",
            text: translations(locale)?.studentLastName,
            sort: true
        },
        {
            dataField: "firstName",
            text: translations(locale)?.studentFirstName,
            sort: true
        },
        {
            dataField: "timetableCount",
            text: translations(locale)?.period,
            sort: true,
            align: 'right',
        },
        {
            dataField: "statusUser",
            text: translations(locale)?.absent?.respondedUser,
            sort: true
        },
    ]

    const registrationColumns = [
        {
            dataField: "date",
            text: translations(locale)?.date,
            sort: true,
            formatter: (cell, row) => { return <span className='underline' onClick={() => handleContextMenuClick(row?.id, 'view')}>{cell}</span> },
        },
        {
            dataField: "className",
            text: translations(locale)?.className,
            sort: true
        },
        {
            dataField: "code",
            text: translations(locale)?.studentCode,
            sort: true,
        },
        {
            dataField: "lastName",
            text: translations(locale)?.studentLastName,
            sort: true
        },
        {
            dataField: "firstName",
            text: translations(locale)?.studentFirstName,
            sort: true
        },
        {
            dataField: "hours",
            text: translations(locale)?.period,
            sort: true,
            align: 'right',
        },
    ]

    const [contextMenus, setContextMenus] = useState([
        {
            key: 'accept',
            icon: <CheckCircleTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: translations(locale)?.approve,
        },
        {
            key: 'decline',
            icon: <CancelTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: translations(locale)?.decline,
        },
        {
            key: 'view',
            icon: <PreviewTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: translations(locale)?.view,
        },
    ])

    const excuseRequestContextMenus = [
        {
            key: 'accept',
            icon: <CheckCircleTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: translations(locale)?.approve,
        },
        {
            key: 'decline',
            icon: <CancelTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: translations(locale)?.decline,
        },
        {
            key: 'view',
            icon: <PreviewTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: translations(locale)?.view,
        },
    ]

    const excuseReportContextMenus = [
        {
            key: 'view',
            icon: <PreviewTwoToneIcon sx={{ fontSize: '2rem !important', color: '#ff5b1d' }} />,
            title: translations(locale)?.view,
        },
    ]

    // useEffect(() => {
    //     setLoading(true)
    //     if (selectedTab == 'request') {
    //         fetchRequest(teacherExcuseRequestInit, 'POST', { 
    //             season: selectedTreeData?.id,
    //             menu: 'manager',
    //             ...dates,
    //             page: page,
    //             pageSize: pageSize,
    //             search: search,
    //             code: statusCode,
    //             sort: sort,
    //             order: order
    //         })
    //             .then((res) => {
    //                 if (res.success) {
    //                     const { requests, seasons, seasonId, statuses, totalCount } = res.data
    //                     if(!isStatus || isSeason){
    //                         setStatuses(statuses || [])
    //                         setIsStatus(true);
    //                         setIsSeason(false)
    //                     }
                        
    //                     setTreeData(seasons || [])
    //                     setTableData(requests || [])
    //                     setTotalCount(totalCount || [])
    //                     if (!selectedTreeData?.id) {
    //                         const season = seasons?.find(el => el?.id == seasonId)
    //                         setSelectedTreeData({ id: season?.id, isCurrent: season?.isCurrent })
    //                     }
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
    //         fetchRequest(teacherExcuseReasonInit, 'POST', { 
    //             season: selectedTreeData?.id, 
    //             menu: 'manager',
    //             code: statusCode,
    //             page: regPage,
    //             pageSize: regPageSize,
    //             search: regSearch,
    //             sort: regSort,
    //             order: regOrder
    //         })
    //             .then((res) => {
    //                 if (res.success) {
    //                     const { requests, seasons, seasonId, totalCount } = res.data
    //                     setTreeData(seasons || [])
    //                     setTableData(requests || [])
    //                     setTotalCount(totalCount || [])
    //                     if (!selectedTreeData?.id) {
    //                         const season = seasons?.find(el => el?.id == seasonId)
    //                         setSelectedTreeData({ id: season?.id, isCurrent: season?.isCurrent })
    //                     }
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
    // }, [selectedTab, selectedTreeData, dates, page, pageSize, search, regPage, regPageSize, regSearch, sort, order, regSort, regOrder])

    useEffect(() => {
        console.log(selectedTab)
        if (selectedTab == 'request') {
            tableData?.forEach(el => el.contextMenuKeys = !selectedTreeData?.isCurrent ? 'view' : (!el?.statusCode ? 'accept, decline' : 'view'))
            setColumns(requestColumns || [])
            setContextMenus(excuseRequestContextMenus)
        } else {
            tableData?.forEach(el => el.contextMenuKeys = 'view')
            setColumns(registrationColumns || [])
            setContextMenus(excuseReportContextMenus)
        }
    }, [tableData, selectedTab])

    const handleRegister = params => {
        console.log('handleRegister')
        // setLoading(true)
        // fetchRequest(teacherExcuseReasonSubmit, 'POST', { ...params, submit: 1, menu: 'manager' })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             const { requests } = res.data
        //             setTableData(requests || [])
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

    const handleResponse = response => {
        console.log('handleResponse')
        // setLoading(true)
        // setStatusCode(null)
        // fetchRequest(teacherExcuseRequestSubmit, 'POST', { 
        //     ...response, 
        //     request: selectedTableDataId, 
        //     season: selectedTreeData?.id, 
        //     menu: 'manager', 
        //     ...dates 
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             message(res.data.message, res.success)
        //             const { requests } = res.data
        //             setTableData(requests || [])
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

    const handleDateChange = (name, value) => {
        setDates({ ...dates, [name]: value })
    }

    const handleContextMenuClick = (id, key) => {
        if (id && key) {
            setSelectedTableDataId(id)
            if (key === 'view') {
                setShowViewModal(true)
            } else if (key === 'accept') {
                setResponseStatus('accepted')
                setShowResponseModal(true)
            } else if (key === 'decline') {
                setResponseStatus('denied')
                setShowResponseModal(true)
            }
        }
    }

    const closeModal = () => {
        setResponseStatus(null)
        setShowViewModal(false)
        setShowResponseModal(false)
        setShowRegisterModal(false)
        setSelectedTableDataId(null)
    }

    const handleTreeChange = node => {
        setIsSeason(true)

        let object = {};

        if(selectedTab == 'request'){
            setPage(1);

            object = {
                page: 1,
                pageSize: pageSize,
                search: search
            }

            secureLocalStorage?.setItem(requestTableIndex, object);
        } else if(selectedTab == 'registration'){
            setRegPage(1);

            object = {
                page: 1,
                pageSize: regPageSize,
                search: regSearch
            }

            secureLocalStorage?.setItem(reasonTableIndex, object);
        }
        
        setSelectedTreeData({ isCurrent: node?.isCurrent, id: node?.key })
        secureLocalStorage?.setItem(treeIndex, { isCurrent: node?.isCurrent, id: node?.key });
    }

    const onReportClick = (code) => {
        setStatusCode(code)
        console.log('onReportClick')
        // setLoading(true)
        // fetchRequest(teacherExcuseRequestInit, 'POST', { 
        //     season: selectedTreeData?.id, 
        //     menu: 'manager', 
        //     ...dates, 
        //     code: code,
        //     page: 1,
        //     pageSize: pageSize,
        //     search: search,
        //     sort: sort,
        //     order: order
        // })
        //     .then((res) => {
        //         if (res.success) {
        //             const { requests, seasons, seasonId, totalCount } = res.data
        //             setTreeData(seasons || [])
        //             setTableData(requests || [])
        //             setTotalCount(totalCount || [])
        //             setPage(1)
        //             if (!selectedTreeData?.id) {
        //                 const season = seasons?.find(el => el?.id == seasonId)
        //                 setSelectedTreeData({ id: season?.id, isCurrent: season?.isCurrent })
        //             }
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

    const clearDateRange = () => {
        setDates({startDate: null, endDate: null})
    }

    const onTabChange = (data) => {
        let tabData = {
            index: String(data?.activeIndex),
            tab: data?.panes[data?.activeIndex]?.code
        }

        setSelectedTab(data?.panes[data?.activeIndex]?.code);
        setActiveIndex(data?.activeIndex);

        setSearch('');
        setRegSearch('');

        secureLocalStorage?.setItem(tabIndex, tabData);
    }

    const onUserInteraction = (object) => {
        if(selectedTab == 'request'){
            setPage(object.page);
            setPageSize(object.pageSize);
            setSearch(object.search);
            setSort(object.sort);
            setOrder(object.order);

            secureLocalStorage?.setItem(requestTableIndex, object);
        } else if(selectedTab == 'registration'){
            setRegPage(object.page);
            setRegPageSize(object.pageSize);
            setRegSearch(object.search);
            setRegSort(object.sort);
            setRegOrder(object.order);

            secureLocalStorage?.setItem(reasonTableIndex, object);
        }
    };

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
                <div className="row">
                    <Col xl="2" xxl="2">
                        <div className='m-portlet'>
                            <div className="m-portlet__body">
                                <TreeView
                                    defaultExpandAll
                                    treeData={treeData}
                                    selectedNodes={[selectedTreeData?.id]}
                                    onSelect={(params, info) => handleTreeChange(info?.node)}
                                />
                            </div>
                        </div>
                    </Col>

                    <Col xl="10" xxl="10">
                        {
                            selectedTab == 'registration' && 
                            // selectedTreeData?.isCurrent && -> commented out for front
                            <button
                                className="btn btn-sm m-btn--pill btn-info m-btn--uppercase d-inline-flex mb-3"
                                onClick={() => setShowRegisterModal(true)}
                            >
                                <AddCircleOutlineRoundedIcon className='MuiSvg-customSize'/>
                                <span className='ml-2'>{translations(locale)?.absent?.register}</span>
                            </button>
                        }
                        <div className="m-portlet tab">
                            <Tab
                                activeIndex={activeIndex}
                                renderActiveOnly
                                className='m-portlet-header'
                                menu={{ secondary: true, pointing: true, className: 'primaryColor m-0 h-4' }}
                                onTabChange={(e, data) => onTabChange(data)}
                                // onTabChange={(e, data) => setSelectedTab(data?.panes[data?.activeIndex]?.code)}
                                panes={[
                                    {
                                        code: 'request',
                                        menuItem: translations(locale)?.absent?.request,
                                    },
                                    {
                                        code: 'registration',
                                        menuItem: translations(locale)?.absent?.registration,
                                    },
                                ]}
                            />
                            <div className='m-portlet__body'>
                                {
                                    selectedTab == 'request' &&
                                    <Container fluid>
                                        <Row className='d-flex gap-05'>
                                            {
                                                statuses?.map((el, key) =>
                                                    <Col key={key} onClick={() => onReportClick(el.code)} className='br-06 p-3 text-white d-flex flex-column' style={{ backgroundColor: el?.color }}>
                                                        <span className='fs-12' style={{ fontFamily: 'MulishMedium' }}>{el?.name}</span>
                                                        <span className='text-right fs-25' style={{ fontFamily: 'MulishBlack' }}>{el?.count}</span>
                                                    </Col>
                                                )
                                            }
                                        </Row>
                                    </Container>
                                }
                                {
                                    selectedTab == 'request' &&
                                    <div className='d-flex justify-content-center'>
                                        <div className='w-50 position-relative' style={{ left: -55 }}>
                                            <Row className='position-absolute' style={{ top: 16 }}>
                                                <Col sm={4} className='col-form-label text-md-right label-pinnacle-bold'>
                                                    {translations(locale)?.absent?.requestDate}
                                                </Col>
                                                <Col>
                                                    <Row>
                                                        <Col className='pr-0'>
                                                            <DayPickerInput
                                                                value={dates?.startDate}
                                                                inputProps={{ className: 'form-control h-100' }}
                                                                placeholder={translations(locale)?.datePickerPlaceholder}
                                                                onDayChange={(day, modifier, input) => handleDateChange('startDate', input?.state?.value)}
                                                                classNames={{ overlay: 'DayPickerInputOverlay', container: 'position-relative h-100' }}
                                                                dayPickerProps={{
                                                                    firstDayOfWeek: 1,
                                                                    disabledDays: { after: new Date(dates?.endDate) },
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
                                                                value={dates?.endDate}
                                                                inputProps={{ className: 'form-control h-100' }}
                                                                placeholder={translations(locale)?.datePickerPlaceholder}
                                                                onDayChange={(day, modifier, input) => handleDateChange('endDate', input?.state?.value)}
                                                                classNames={{ overlay: 'DayPickerInputOverlay', container: 'position-relative h-100' }}
                                                                dayPickerProps={{
                                                                    firstDayOfWeek: 1,
                                                                    disabledDays: { before: new Date(dates?.startDate) },
                                                                }}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                }
                                <DTable
                                    remote
                                    locale={locale}
                                    config={config}
                                    data={tableData}
                                    columns={columns}
                                    // individualContextMenus
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
                    <div className="blockUI blockOverlay" />
                    <div className="blockUI blockMsg blockPage">
                        <div className="m-loader m-loader--brand m-loader--lg" />
                    </div>
                </>
            }
            {
                showRegisterModal &&
                <RegisterModal
                    onClose={closeModal}
                    onSubmit={handleRegister}
                />
            }
            {
                showViewModal && selectedTableDataId &&
                <ViewModal
                    type={selectedTab}
                    onClose={closeModal}
                    id={selectedTableDataId}
                />
            }
            {
                showResponseModal && selectedTableDataId && responseStatus &&
                <ResponseModal
                    onClose={closeModal}
                    status={responseStatus}
                    id={selectedTableDataId}
                    onSubmit={handleResponse}
                />
            }
        </div>
    )
}

export default index