import { React, useState, useEffect } from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap'
import secureLocalStorage from 'react-secure-storage'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import HtmlHead from 'components/html-head/HtmlHead'
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList'
import DTable from 'modules/DataTable/DTable'
import {Tab} from "semantic-ui-react"
import { useTranslation } from "react-i18next"
import {dateFormat} from 'utils/Util'
import message from 'modules/message'
import {cloneDeep} from 'lodash'
import DayPickerInput from "react-day-picker/DayPickerInput"
import TimelineIcon from '@mui/icons-material/Timeline'
import {Link} from 'react-router-dom'
import {Dropdown, Modal} from 'semantic-ui-react'
import CloseIcon from '@mui/icons-material/Close'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import { CleaningServices } from '@mui/icons-material'
import DownloadAttendanceModal from './modals/downloadAttendance'

const WEEKDAYS_LONG = {
    mn: {
        1: 'Даваа ',
        2: 'Мягмар',
        3: 'Лхагва',
        4: 'Пүрэв',
        5: 'Баасан',
        6: 'Бямба',
        0: 'Ням',
    },
    en: {
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday',
        0: 'Sunday',
    },
    ru: {
        1: 'Понедельник',
        2: 'Вторник',
        3: 'Среда',
        4: 'Четверг',
        5: 'Пятница',
        6: 'Суббота',
        0: 'Воскресенье',
    }
};

const baseButton = {
    fontFamily: 'MulishRegular',
    padding: "0.65rem 1rem",
    border: '1px solid',
    cursor: 'pointer',
    height: '35px',
    width: '35px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}

const index = () => {
    const locale="mn";
    const localSchool = secureLocalStorage.getItem('selectedSchool')
    const { t } = useTranslation();
    const history = useHistory();
    const [loading, setLoading] = useState(false);

    const { selectedSchool } = useSelector(state => state.schoolData);

    const title = t('class.attendance.title');
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "class/attendance", text: title }
    ];

    const [hdr, setHdr] = useState(null);
    const [types, setTypes] = useState([]);

    const [tabIndex, setTabIndex] = useState(0)
    const [date, setDate] = useState(dateFormat(new Date()))
    const [dateTitle, setDateTitle] = useState(dateFormat(new Date()) + ' ' + WEEKDAYS_LONG[locale][(new Date()).getDay()])

    const [canLog, setCanLog] = useState(false)
    const [updateView, setUpdateView] = useState(false)

    const [seasonStart, setSeasonStart] = useState(null)
    const [seasonEnd, setSeasonEnd] = useState(null)

    const [students, setStudents] = useState([])
    const [reportStudents, setReportStudents] = useState([])

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showTeacherLogModal, setShowTeacherLogModal] = useState(false)

    const [schoolShifts, setSchoolShifts] = useState([])
    const [selectedShift, setSelectedShift] = useState(null)
    const [selectedTimeTemplate, setSelectedTimeTemplate] = useState(null)
    const [selectedTeacherLog, setSelectedTeacherLog] = useState(null)
    

    const reportColumns = [
        {
            dataField: 'avatar',
            text: t('teacher.photo'),
            sort: false,
            align: 'center',
            headerStyle: () => {
                return {
                    width: 100,
                };
            },
            formatter: (cell) => 
                <img width={40} height={40}
                            className='img-responsive img-circle'
                            src={cell || '/img/profile/avatar.png'}
                            alt='profile picture'
                            onError={(e) => {
                                e.target.onError = null
                                e.target.src = '/img/profile/avatar.png'
                            }}
                />
        },
        {
            dataField: 'code',
            text: t('studentCode'),
            sort: true,
        },
        {
            dataField: 'lastName',
            text: t('studentLastName'),
            sort: true,
        },
        {
            dataField: 'firstName',
            text: t('studentFirstName'),
            sort: true
        },
        {
            dataField: 'total',
            text: t('total'),
            sort: false,
            align: 'right'
        },
        {
            dataField: 'percentage',
            text: '%',
            sort: false,
            align: 'right',
            formatter: (cell) => cell + '%'
        }
    ];

    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)

    const [totalCount, setTotalCount] = useState(0);
    const [tableData, setTableData] = useState([
        {id: 11, code: 555, firstName: "john"}, 
        {id: 12, code: 333, firstName: "joy"}, 
        {id: 13, code: 888, firstName: "julie"}, 
        {id: 14, code: 77, firstName: "julia"}, 
    ]);

    const attendanceConfig = {
        // excelExport: false,
        // printButton: false,
        // columnButton: false,
        // defaultSort: [{
        //     dataField: 'firstName',
        //     order: 'asc'
        // }],
        // defaultPageOptions: {
        //     page: 1,
        //     sizePerPage: 10,
        // }
                excelExport: false,
                printButton: false,
                showAllData: true,
                showPagination: false,
                showLeftButton: true,
                leftButtonStyle: {position: 'relative', paddind: '0 0 10 0' ,bottom: '5px'},
                leftButtonClassName: 'btn btn-sm m-btn--pill btn-publish m-btn--uppercase m-btn--wide mr-2 d-inline-flex',
                leftButtonText: t('attendance.sent_attendance'),

                showSecondaryLeftButton: true,
                secondaryLeftButtonStyle: {position: 'relative', bottom: '5px'},
                secondaryLeftButtonClassName: 'btn btn-sm m-btn--pill btn-secondary-left m-btn--uppercase m-btn--wide d-inline-flex',
                secondaryLeftButtonText: t('attendance.download_attendance'),

                defaultSort: [{
                    dataField: 'firstName',
                    order: 'asc'
                }]
    }

    const [selectedTableDataId, setSelectedTableDataId] = useState(null)
    const [selectedTabData, setSelectedTabData] = useState(0)

    
   

    // const [tableState, setTableState] = useState(
    //     selectedTabData?.code == 'ATTENDANCE'
    //         ?
    //         secureLocalStorage.getItem(localeActiveTableState)
    //             ?
    //             secureLocalStorage.getItem(localeActiveTableState)
    //             :
    //             {
    //                 filter: {},
    //                 page: 1,
    //                 pageSize: 10,
    //                 search: '',
    //                 sort: 'firstName',
    //                 order: 'asc'
    //             }
    //         :
    //         secureLocalStorage.getItem(localeActiveTableState)
    //             ?
    //             secureLocalStorage.getItem(localeActiveTableState)
    //             :
    //             {
    //                 filter: {},
    //                 page: 1,
    //                 pageSize: 10,
    //                 search: '',
    //                 sort: 'firstName',
    //                 order: 'asc'
    //             }
    // )
    // const onTypeChange = (rowTypeId = null, isEditing = false) => {
    //     const rowArray = rowTypeId?.split('_');
    //     if (rowArray?.length > 1) {
    //         submitLog({
    //             date,
    //             student: rowArray[0],
    //             type: rowArray[1]
    //         }, isEditing)
    //     }
    // }
     
    const attendanceColumns = [
        {
            dataField: 'avatar',
            text: t('teacher.photo'),
            sort: false,
            width: 40,
            align: 'center',
            formatter: (cell) => 
                <img className='img-responsive img-circle'
                            src={cell || '/img/profile/avatar.png'}
                            width={40} height={40} alt='profile picture'
                            onError={(e) => {
                                e.target.onError = null
                                e.target.src = '/img/profile/avatar.png'
                            }}
                />
        },
        {
            dataField: 'code',
            text: t('studentCode'),
            sort: true,
        },
        {
            dataField: 'lastName',
            text: t('studentLastName'),
            sort: true
        },
        {
            dataField: 'firstName',
            text: t('studentFirstName'),
            sort: true
        },
        {
            dataField: 'attendanceType',
            text: t('attendance.title'),
            sort: false,
            align: 'center',
            headerStyle: () => {
                return {
                    width: 300,
                };
            },
            formatter: (cell, row) => {
                return <div className='container'>
                            <div className='row flex-row flex-nowrap px-3' style={{gap: 9}}>
                                <button style={{...baseButton, color: 'rgb(255, 255, 255)', borderColor: 'rgb(62, 191, 163)', backgroundColor: 'rgb(62, 191, 163)'}} type='button' className='br-08'>Т</button>
                                <button style={{...baseButton, color: 'rgb(244, 81, 107)', borderColor: 'rgb(244, 81, 107)', backgroundColor: 'rgb(255, 255, 255)'}} type='button' className='br-08'>Т</button>
                                <button style={{...baseButton, color: 'rgb(155, 155, 155)', borderColor: 'rgb(155, 155, 155)', backgroundColor: 'rgb(255, 255, 255)'}} type='button' className='br-08'>Х</button>
                                <button style={{...baseButton, color: 'rgb(144, 18, 254)', borderColor: 'rgb(144, 18, 254)', backgroundColor: 'rgb(255, 255, 255)'}} type='button' className='br-08'>Ө</button>
                                <button style={{...baseButton, color: 'rgb(255, 108, 0)', borderColor: 'rgb(255, 108, 0)', backgroundColor: 'rgb(255, 255, 255)'}} type='button' className='br-08'>Ч</button>
                            </div>
                        </div>
            }
        }
    ];

    const [columns, setColumns] = useState(attendanceColumns)

    const onDayChange = (day) => {
        let selectedDay = dateFormat(new Date(day));

        let date1 = new Date(selectedDay).getTime();
        let unableToChangeToData = false
        if (seasonStart && seasonEnd) {
            let startDate = new Date(seasonStart).getTime();
            let endDate = new Date(seasonEnd).getTime();

            if (date1 >= startDate && date1 <= endDate) {
                unableToChangeToData = false;
            } else {
                unableToChangeToData = true;
            }
        }

        setDate(selectedDay)
        setDateTitle(selectedDay + ' ' + WEEKDAYS_LONG[locale][(new Date(day)).getDay()])

        if (unableToChangeToData) {
            setCanLog(false)
            message(t('attendance.unable_to_log_date'))
        } else {
            // loadData({
            //     date: selectedDay
            // })
        }
    }

    const reportConfig = {
        excelExport: true,
        excelFileName: `${localSchool?.classes?.find(el => el?.value == secureLocalStorage.getItem('selectedClassId'))?.text}-${t('class.attendance.title')}`,
        printButton: false,
        showAllData: true,
        showPagination: false,
        defaultSort: [{
            dataField: 'firstName',
            order: 'asc'
        }]
    }

    const getConfig = (hasHdr = false, ableToLog = false) => {       
        if (hasHdr) {
            return {
                excelExport: false,
                printButton: false,
                showAllData: true,
                showPagination: false,
                showLeftButton: false,
                showLeftText: true,
                leftText: (hdr?.teacherLog ? (t('attendance.download_timetable') + ' (' + hdr?.teacherLog + ') ') : '') + t('attendance.sent_time') + ': ' + hdr?.createdUser,
                leftTextStyle: {fontSize: 16, whiteSpace: 'nowrap', fontFamily: 'PinnacleRegular'},
                defaultSort: [{
                    dataField: 'firstName',
                    order: 'asc'
                }]
            }
        } else {
            return {
                excelExport: false,
                printButton: false,
                showAllData: true,
                showPagination: false,
                showLeftButton: true,
                leftButtonStyle: {position: 'relative', paddind: '0 0 10 0' ,bottom: '5px'},
                leftButtonClassName: 'btn btn-sm m-btn--pill btn-publish m-btn--uppercase m-btn--wide mr-2 d-inline-flex',
                leftButtonText: t('attendance.sent_attendance'),

                showSecondaryLeftButton: true,
                secondaryLeftButtonStyle: {position: 'relative', bottom: '5px'},
                secondaryLeftButtonClassName: 'btn btn-sm m-btn--pill btn-secondary-left m-btn--uppercase m-btn--wide d-inline-flex',
                secondaryLeftButtonText: t('attendance.download_attendance'),

                defaultSort: [{
                    dataField: 'firstName',
                    order: 'asc'
                }]
            }
        }
    }

    const clearDateRange = () => {
        setStartDate(null)
        setEndDate(null)
    }

    const dateRangeChange = (type, date) => {
        let selectedDay = dateFormat(new Date(date));

        let start = null;
        let end = null;
        if (type === 'start') {
            start = selectedDay;
            end = endDate;
            setStartDate(selectedDay);
                       
        } else if (type === 'end') {
            start = startDate;
            end = selectedDay;
            setEndDate(selectedDay);
        }
    }

    const closeModal = () => {
        setSelectedTableDataId(null)
    }

    const onCloseTeacherLog = () => {
        setShowTeacherLogModal(false)
    }

    const submitDownloadAttendance = () => {
        const tTemplate = (schoolShifts.find(obj => obj.id === selectedShift)?.timeTemplates || []).find(obj => obj.id === selectedTimeTemplate)
        if (tTemplate) {
            loadTeacherLog({
                date,
                submit: 1,
                shift: selectedShift,
                start: tTemplate?.start,
                end: tTemplate?.end,
            })
        }
    }

    const onUserInteraction = state => {
        console.log('onUserInteraction');     
    }

  
    
    const handleTabChange = (e, data) => {
        console.log( e, data.activeIndex)
        setSelectedTabData(data.activeIndex)
        // setSelectedTabData({...data?.panes?.[data?.activeIndex]})
        // secureLocalStorage.setItem(localeSelectedTab, data?.panes?.[data?.activeIndex])

        // let selectedTableState = null;
        // if (data?.panes?.[data?.activeIndex] && data?.panes?.[data?.activeIndex]?.code == 'ACTIVE') {
        //     setTableState(secureLocalStorage.getItem(localeActiveTableState))
        //     selectedTableState = secureLocalStorage.getItem(localeActiveTableState)
        // } else if (data?.panes?.[data?.activeIndex]?.code == 'QUIT') {
        //     setTableState(secureLocalStorage.getItem(localeQuitTableState))
        //     selectedTableState = secureLocalStorage.getItem(localeQuitTableState)
        // } else if (data?.panes?.[data?.activeIndex]?.code == 'ABSENT') {
        //     setTableState(secureLocalStorage.getItem(localeAbsentTableState))
        //     selectedTableState = secureLocalStorage.getItem(localeAbsentTableState)
        // }

        // init(selectedTableState, selectedTreeDataId, data?.panes?.[data?.activeIndex]?.code)
    }

    useEffect(() => {
        if (selectedTabData == 0) {           
            setColumns(attendanceColumns)
        } else {
            if (selectedTabData === 1) {
            } 
            setColumns(reportColumns)
        }
    }, [selectedTabData, tableData])

    // useEffect(() => {
    //     if (treeData.length && !selectedTreeDataId.length) {
    //         setSelectedTreeDataId(treeData?.[0]?.key)
    //     }
    // }, [treeData])

    // useEffect(() => {
    //     if (tabData.length && !selectedTabData?.id) {
    //         setSelectedTabData(tabData?.[0])

    //         tabData.forEach(element => {
    //             if (element.code == 'ACTIVE') {
    //                 if (!secureLocalStorage.getItem(localeActiveTableState)) {
    //                     secureLocalStorage.setItem(localeActiveTableState, {
    //                             filter: {},
    //                             page: 1,
    //                             pageSize: 10,
    //                             search: '',
    //                             sort: 'firstName',
    //                             order: 'asc'
    //                         }
    //                     )
    //                 }
    //             } else if (element.code == 'QUIT') {
    //                 if (!secureLocalStorage.getItem(localeQuitTableState)) {
    //                     secureLocalStorage.setItem(localeQuitTableState, {
    //                             filter: {},
    //                             page: 1,
    //                             pageSize: 10,
    //                             search: '',
    //                             sort: 'firstName',
    //                             order: 'asc'
    //                         }
    //                     )
    //                 }
    //             } else if (element.code == 'ABSENT') {
    //                 if (!secureLocalStorage.getItem(localeAbsentTableState)) {
    //                     secureLocalStorage.setItem(localeAbsentTableState, {
    //                             filter: {},
    //                             page: 1,
    //                             pageSize: 10,
    //                             search: '',
    //                             sort: 'firstName',
    //                             order: 'asc'
    //                         }
    //                     )
    //                 }
    //             }
    //         });
    //     }
    // }, [tabData])
    return (
        <>
            <HtmlHead title={title} description={description} />

            <div className="page-title-container mb-2">
                <Col md="7" className='p-0'>
                    <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
                    <BreadcrumbList items={breadcrumbs} />
                </Col>
            </div>

            <div className='m-content'>
                <Row className=''>
                    <Col xl="12" xxl="12">
                        <div className='m-portlet tab br-12'>
                            <div className=''>
                                <Tab
                                    menu={{secondary: true, pointing: true, className: 'primaryColor m-0 h-4'}}
                                    onTabChange={(e, data) => handleTabChange(e, data)}
                                    className='m-portlet-header'
                                    panes={[
                                        {
                                            menuItem: t('class.attendance.log'),
                                            render: () => (
                                                <div className='m-portlet__body'>
                                                    <div className="d-flex align-items-center justify-content-start mb-5 mt-4">
                                                        <a href="#" style={{color: 'black'}} onClick={() => {
                                                            let selectedDay = date.substring(0, 10);
                                                            let selectedDate = new Date(selectedDay);
                                                            selectedDate.setDate(selectedDate.getDate() - 1);
                                                            onDayChange(dateFormat(selectedDate))
                                                        }}
                                                        className="d-flex align-items-center justify-content-center no-decoration">
                                                            <i className='la la-angle-left'/>
                                                        </a>
                                                        <div className="col-auto p-0 text-center pl-1">
                                                            <DayPickerInput
                                                                onDayChange={onDayChange}
                                                                value={dateTitle}
                                                                hideOnDayClick={true}
                                                                inputProps={{readOnly: true}}
                                                                placeholder={dateTitle}
                                                                dayPickerProps={{
                                                                    disabledDays: seasonStart && seasonEnd
                                                                        ? {
                                                                            before: new Date(seasonStart),
                                                                            after: new Date(seasonEnd)
                                                                        }
                                                                        :
                                                                        {
                                                                            before: new Date(seasonStart),
                                                                            after: new Date(date)
                                                                        }
                                                                }}
                                                                classNames={{
                                                                    overlay: 'DayPickerInputOverlay',
                                                                    container: 'myToday-DayPicker'
                                                                }}
                                                            />
                                                        </div>
                                                        <a href="#" style={{color: 'black'}} onClick={() => {
                                                            let selectedDay = date.substring(0, 10);
                                                            let selectedDate = new Date(selectedDay);
                                                            selectedDate.setDate(selectedDate.getDate() + 1);
                                                            onDayChange(dateFormat(selectedDate))
                                                        }}
                                                        className="d-flex align-items-center justify-content-center no-decoration">
                                                            <i className='la la-angle-right'/>
                                                        </a>
                                                </div>
                                                    <DTable
                                                        remote
                                                        // config={getConfig((hdr?.id, canLog))}
                                                        config={attendanceConfig}
                                                        locale={locale}
                                                        columns={columns}
                                                        data={tableData}
                                                        onLeftButtonClick={() => sendLogs()}
                                                        onSecondaryLeftButtonClick={() => {
                                                                setShowTeacherLogModal(true)
                                                            }}
                                                        totalDataSize={totalCount}
                                                        onInteraction={onUserInteraction}
                                                    />
                                                </div>
                                            )

                                        },
                                        {
                                            menuItem: t('class.attendance.report'),
                                            render: () => (
                                                <div className='m-portlet__body'>
                                                <div className='d-flex justify-content-center'>
                                                    <div className={"text-right mr-4"}>
                                                        <label
                                                            className="col-form-label text-right label-pinnacle-bold">
                                                            {t('date')}
                                                        </label>
                                                    </div>
                                                    <DayPickerInput
                                                        onDayChange={(e) => dateRangeChange('start', e)}
                                                        style={{
                                                            width: 160
                                                        }}
                                                        value={startDate}
                                                        hideOnDayClick={true}
                                                        inputProps={{className: 'form-control'}}
                                                        placeholder={t('datePickerPlaceholder')}
                                                        dayPickerProps={{
                                                            disabledDays: seasonStart && seasonEnd
                                                                ? {
                                                                    before: new Date(seasonStart),
                                                                    after: new Date(seasonEnd)
                                                                }
                                                                :
                                                                {
                                                                    before: new Date(seasonStart),
                                                                    after: new Date(date)
                                                                }
                                                        }}
                                                        classNames={{
                                                            overlay: 'DayPickerInputOverlay',
                                                            container: 'position-relative'
                                                        }}
                                                    />
                                                    <div className="pickerSeparator"
                                                         style={{cursor: 'pointer',
                                                             padding: '8px 13px 2px',
                                                             lineHeight: '1em'}}
                                                         onClick={clearDateRange}>
                                                        <i className="la la-ellipsis-h"/>
                                                    </div>
                                                    <DayPickerInput
                                                        onDayChange={(e) => dateRangeChange('end', e)}
                                                        value={endDate}
                                                        hideOnDayClick={true}
                                                        inputProps={{className: 'form-control'}}
                                                        placeholder={t('datePickerPlaceholder')}
                                                        dayPickerProps={{
                                                            disabledDays: seasonStart && seasonEnd
                                                                ? {
                                                                    before: new Date(seasonStart),
                                                                    after: new Date(seasonEnd)
                                                                }
                                                                :
                                                                { 
                                                                    before: new Date(startDate),
                                                                    after: new Date(date)                                                                    
                                                                }
                                                        }}
                                                        classNames={{
                                                            overlay: 'DayPickerInputOverlay',
                                                            container: 'position-relative'
                                                        }}
                                                    />
                                                    <div
                                                        className="actions justify-content-center d-flex align-items-center ml-4">
                                                        <button
                                                            className='btn btn-sm m-btn--pill m-btn--uppercase d-inline-flex br-8'
                                                            style={{
                                                                backgroundColor: '#41c5dc',
                                                                color: 'white',
                                                                borderColor: '#41c5dc'
                                                            }}
                                                            onClick={() => {
                                                                if (startDate && endDate) {
                                                                    // loadData({
                                                                    //     start: startDate,
                                                                    //     end: endDate,
                                                                    //     viewType: 'REPORT'
                                                                    // })
                                                                } else {
                                                                    message(t('err.select_date'))
                                                                }
                                                            }}
                                                        >
                                                                <TimelineIcon className='d-flex' style={{
                                                                    marginLeft: '0.5rem',
                                                                    marginRight: '0.5rem',
                                                                    padding: '0px'
                                                                }}/>
                                                                <span style={{
                                                                    marginLeft: '0.5rem',
                                                                    marginRight: '0.5rem'
                                                                }}>{t('view')}</span>
                                                        </button>
                                                    </div>
                                                    
                                                </div>
                                                    <DTable
                                                        remote
                                                        config={reportConfig}
                                                        locale={locale}
                                                        columns={columns}
                                                        data={tableData}                                                        
                                                        totalDataSize={totalCount}
                                                        onInteraction={onUserInteraction}
                                                    />
                                                </div>                                               
                                            )
                                        }
                                    ]}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            {
                showTeacherLogModal &&
                <DownloadAttendanceModal
                    selectedShift={selectedShift}
                    setSelectedShift={setSelectedShift}
                    schoolShifts={schoolShifts}
                    setSchoolShifts={setSchoolShifts}
                    selectedTimeTemplate={selectedTimeTemplate}
                    setSelectedTimeTemplate={setSelectedTimeTemplate}
                    selectedTeacherLog={selectedTeacherLog}
                    onClose={onCloseTeacherLog}
                    onSubmit={submitDownloadAttendance}
                />
            }
            {
                loading &&
                <>
                    <div className='loader-container'>
                        <svg className="splash-spinner" viewBox="0 0 50 50">
                            <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
                        </svg>
                    </div>
                </>
            }
        </>
    )

    
}

export default index