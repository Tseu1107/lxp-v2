import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import secureLocalStorage from 'react-secure-storage'
import {translations} from 'utils/translations'
import React, {useEffect, useRef, useState} from 'react'
import {Checkbox, Tab} from "semantic-ui-react";
import {Col, Row} from "react-bootstrap";
import {NDropdown as Dropdown} from "widgets/Dropdown";
import DayPickerInput from "react-day-picker/DayPickerInput";
import DTable from 'modules/DataTable/DTable';
import { useTranslation } from 'react-i18next';
// import {fetchRequest} from 'utils/fetchRequest'
// import {ESISAttendanceInit, ESISAttendanceLogs, ESISAttendanceSend} from 'utils/fetchRequest/Urls'
import {dateFormat} from 'utils/Util'
import message from 'modules/message';

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
const esisAttendanceLogTable = 'esis_attendance_log_table'

const tabs = [
    {
        index: 0,
        menuItem: translations(locale)?.esis?.attendance_daily_send,
        id: 0
    },
    {
        index: 1,
        menuItem: translations(locale)?.dashboardAttendence?.response,
        id: 1
    }
]

const index = () => {

    const { t } = useTranslation()

    const title = t('esis.attendance_daily')
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "esis/attendance", text: title }
    ];

    const inputTableRef = useRef()
    const [loading, setLoading] = useState(false)

    const [tabIndex, setTabIndex] = useState(0)

    const [filter, setFilter] = useState({})
    const [attendanceParams, setAttendanceParams] = useState({})

    const [schoolShifts, setSchoolShifts] = useState([{value:5, text:'1-р ээлж', timeTemplates: [{value:54, text:'1-р tsag'}, {value:61, text:'2-р tsag'}]}, {value:6, text:'2-р ээлж'}])
    const [timeTemplates, setTimeTemplates] = useState([{value:54, text:'1-р tsag'}, {value:61, text:'2-р tsag'}])

    const [classList, setClassList] = useState([
        {
            "classId": "12515",
            "className": "1A",
            "esisProgramStage": null,
            "esisAcademicLevel": null,
            "esisGroupId": null,
            "timetables": [{1: '1232', 2:'adfi8uj', hasTeacherLog: true}],
            "esisAttendanceLog": null,
            "esisAttendanceLogColor": null,
            "esisAttendanceLogDate": null
        },
        {
            "classId": "12516",
            "className": "2A",
            "esisProgramStage": null,
            "esisAcademicLevel": null,
            "esisGroupId": null,
            "timetables": [{1: '1232', 2:'adfi8uj'}],
            "esisAttendanceLog": null,
            "esisAttendanceLogColor": null,
            "esisAttendanceLogDate": null
        },
        {
            "classId": "12538",
            "className": "2gg",
            "esisProgramStage": null,
            "esisAcademicLevel": null,
            "esisGroupId": null,
            "timetables": [],
            "esisAttendanceLog": null,
            "esisAttendanceLogColor": null,
            "esisAttendanceLogDate": null
        },
        {
            "classId": "12517",
            "className": "3A",
            "esisProgramStage": null,
            "esisAcademicLevel": null,
            "esisGroupId": null,
            "timetables": [],
            "esisAttendanceLog": null,
            "esisAttendanceLogColor": null,
            "esisAttendanceLogDate": null
        },
        {
            "classId": "12535",
            "className": "3A",
            "esisProgramStage": null,
            "esisAcademicLevel": null,
            "esisGroupId": null,
            "timetables": [],
            "esisAttendanceLog": null,
            "esisAttendanceLogColor": null,
            "esisAttendanceLogDate": null
        },
        {
            "classId": "12518",
            "className": "4A",
            "esisProgramStage": null,
            "esisAcademicLevel": null,
            "esisGroupId": null,
            "timetables": [],
            "esisAttendanceLog": null,
            "esisAttendanceLogColor": null,
            "esisAttendanceLogDate": null
        },
    ])
    const [attendanceTypes, setAttendanceTypes] = useState([])

    const [schoolLogsLoading, setSchoolLogsLoading] = useState(false)
    const [attendanceLogs, setAttendanceLogs] = useState([
        {
            "id": "1",
            "createdDate": "2023-04-12 12:13:43",
            "date": "2023-04-12",
            "sentDate": "2023-04-12 12:13:43",
            "sentUser": "Baatar",
            "totalStudent": "3",
            "reports": [
                {
                    "id": 1,
                    "code": "CAME",
                    "name": "Ирсэн",
                    "studentCount": 0
                },
                {
                    "id": 3,
                    "code": "NONATT",
                    "name": "Тасалсан",
                    "studentCount": 0
                },
                {
                    "id": 5,
                    "code": "LATE",
                    "name": "Хоцорсон",
                    "studentCount": 0
                },
                {
                    "id": 4,
                    "code": "SICK",
                    "name": "Өвчтэй",
                    "studentCount": 0
                },
                {
                    "id": 2,
                    "code": "ABSENT",
                    "name": "Чөлөөтэй",
                    "studentCount": 0
                }
            ]
        },
        {
            "id": "2",
            "createdDate": "2023-04-13 07:23:07",
            "date": "2023-04-13",
            "sentDate": "2023-04-13 07:23:07",
            "sentUser": "Admin",
            "totalStudent": "3",
            "reports": [
                {
                    "id": 1,
                    "code": "CAME",
                    "name": "Ирсэн",
                    "studentCount": 0
                },
                {
                    "id": 3,
                    "code": "NONATT",
                    "name": "Тасалсан",
                    "studentCount": 0
                },
                {
                    "id": 5,
                    "code": "LATE",
                    "name": "Хоцорсон",
                    "studentCount": 0
                },
                {
                    "id": 4,
                    "code": "SICK",
                    "name": "Өвчтэй",
                    "studentCount": 0
                },
                {
                    "id": 2,
                    "code": "ABSENT",
                    "name": "Чөлөөтэй",
                    "studentCount": 0
                }
            ]
        },
        {
            "id": "9",
            "createdDate": "2023-04-22 10:23:36",
            "date": "2023-04-21",
            "sentDate": "2023-04-22 10:23:36",
            "sentUser": "Мөнхзул",
            "totalStudent": null,
            "reports": [
                {
                    "id": 1,
                    "code": "CAME",
                    "name": "Ирсэн",
                    "studentCount": 0
                },
                {
                    "id": 3,
                    "code": "NONATT",
                    "name": "Тасалсан",
                    "studentCount": 0
                },
                {
                    "id": 5,
                    "code": "LATE",
                    "name": "Хоцорсон",
                    "studentCount": 0
                },
                {
                    "id": 4,
                    "code": "SICK",
                    "name": "Өвчтэй",
                    "studentCount": 0
                },
                {
                    "id": 2,
                    "code": "ABSENT",
                    "name": "Чөлөөтэй",
                    "studentCount": 0
                }
            ]
        },
        {
            "id": "110",
            "createdDate": "2023-10-26 14:52:21",
            "date": "2023-10-26",
            "sentDate": "2023-10-26 14:52:21",
            "sentUser": "Мөнхзул",
            "totalStudent": null,
            "reports": [
                {
                    "id": 1,
                    "code": "CAME",
                    "name": "Ирсэн",
                    "studentCount": 0
                },
                {
                    "id": 3,
                    "code": "NONATT",
                    "name": "Тасалсан",
                    "studentCount": 0
                },
                {
                    "id": 5,
                    "code": "LATE",
                    "name": "Хоцорсон",
                    "studentCount": 0
                },
                {
                    "id": 4,
                    "code": "SICK",
                    "name": "Өвчтэй",
                    "studentCount": 0
                },
                {
                    "id": 2,
                    "code": "ABSENT",
                    "name": "Чөлөөтэй",
                    "studentCount": 0
                }
            ]
        }
    ])
    const [totalAttendanceLogCount, setTotalAttendanceLogCount] = useState(0)

    const defaultAttendanceLogColumns = [
        {
            dataField: 'date',
            text: translations(locale)?.date,
            sort: true
        },
        {
            dataField: 'sentDate',
            text: translations(locale)?.esis.sentDate,
            sort: true
        },
        {
            dataField: 'sentUser',
            text: translations(locale)?.esis.sentUser,
            sort: true
        },
        {
            dataField: 'totalStudent',
            text: translations(locale)?.esis.sentStudentCount,
            sort: true
        }
    ];

    const [attendanceLogColumns, setAttendanceLogColumns] = useState(defaultAttendanceLogColumns)
    const [tableState, setTableState] = useState(
        secureLocalStorage.getItem(esisAttendanceLogTable)
            ?
            secureLocalStorage.getItem(esisAttendanceLogTable)
            :
            {
                filter: {},
                page: 1,
                pageSize: 10,
                search: '',
                sort: 'date',
                order: 'desc'
            }
    )

    const attendanceLogConfig = {
        excelExport: true,
        printButton: true,
        isTableStriped: true,
        excelFileName: `${secureLocalStorage.getItem('selectedSchool')?.text}-${translations(locale)?.esis.attendance_daily}`,
        defaultSort: [{
            dataField: tableState?.sort || 'date',
            order: tableState?.order || 'desc'
        }],
        defaultPageOptions: {
            page: tableState?.page,
            sizePerPage: tableState?.pageSize,
            search: tableState?.search,
        }
    };

    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [updateTableView, setUpdateTableView] = useState(false)

    const loadInit = (date = null, schoolShift = null, timeTemplate = null) => {
        console.log('loadInit')
        // const bodyParams = {
        //     date,
        //     schoolShift,
        //     timeTemplate
        // }

        // setAttendanceParams(bodyParams)
        // setClassList([])
        // setLoading(true)
        // fetchRequest(ESISAttendanceInit, 'POST', bodyParams)
        //     .then((res) => {
        //         if (res.success) {
        //             const {classes, schoolShifts, today} = res.data

        //             let filterObj = filter;
        //             setSchoolShifts(schoolShifts || [])
        //             setClassList(classes)
        //             if (schoolShifts && schoolShifts.length === 1) {
        //                 filterObj.schoolShift = schoolShifts[0].value;
        //             }
        //             if (!filterObj.date) {
        //                 filterObj.date = today
        //             }

        //             const attTypes = res?.data?.attendanceTypes;
        //             setAttendanceTypes(attTypes)

        //             setFilter(filterObj)
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

    const loadAttendanceList = (page = 1, pageSize = 10, query = null, sort = null, order = null) => {
        console.log('loadAttendanceList')
        // if (!schoolLogsLoading) {
        //     setSchoolLogsLoading(true)
        //     const bodyParams = {
        //         page,
        //         pageSize,
        //         query,
        //         sort,
        //         order
        //     }
        //     setLoading(true)
        //     fetchRequest(ESISAttendanceLogs, 'POST', bodyParams)
        //         .then((res) => {
        //             if (res.success) {
        //                 setAttendanceLogs(res?.data?.attendances)
        //                 setTotalAttendanceLogCount(res?.data?.totalCount)
        //                 const attTypes = res?.data?.attendanceTypes;
        //                 const attCols = [...defaultAttendanceLogColumns]
        //                 for (let att = 0; att < attTypes.length; att++) {
        //                     attCols.push({
        //                         dataField: 'att_type_' + attTypes[att].id,
        //                         text: attTypes[att].name,
        //                         sort: true,
        //                         formatter: (cell, row) => {
        //                             const selectedReportObj = row?.reports.find(obj => {
        //                                 return obj.id === attTypes[att].id
        //                             })
        //                             return selectedReportObj?.studentCount || 0;
        //                         }
        //                     })
        //                 }

        //                 setAttendanceLogColumns(attCols)

        //             } else {
        //                 message(res.data.message)
        //             }
        //             setLoading(false)
        //             setSchoolLogsLoading(false)
        //         })
        //         .catch(() => {
        //             message(translations(locale)?.err?.error_occurred)
        //             setLoading(false)
        //             setSchoolLogsLoading(false)
        //         })
        // }
    }

    useEffect(() => {
        loadInit()
    }, [])

    const onTabChange = (data) => {
        setTabIndex(data?.activeIndex)
        if (data?.activeIndex === 0) {
            console.log('S shift', schoolShifts)
        } else if (data?.activeIndex === 1) {
            loadAttendanceList(1)
        }
    }

    const onFilterChange = (filterType, value) => {
        let filterObj = filter;
        if (filterType === 'date') {
            filterObj.date = dateFormat(new Date(value));
        } else if (filterType === 'schoolShift') {
            let timeTemplateOptions = []
            if (schoolShifts && schoolShifts.length > 0) {
                for (let ss = 0; ss < schoolShifts.length; ss++) {
                    if (schoolShifts[ss]?.value === value) {
                        timeTemplateOptions = schoolShifts[ss]?.timeTemplates || [];
                        break;
                    }
                }
            }
            setTimeTemplates(timeTemplateOptions)
            filterObj.schoolShift = value;
        } else if (filterType === 'timeTemplate') {
            filterObj.timeTemplate = value;
        }

        setFilter(filterObj)
    }

    const onLoadAttendance = () => {
        if (filter && filter?.date && filter?.schoolShift && filter?.timeTemplate) {
            loadInit(filter?.date, filter.schoolShift, filter.timeTemplate)
        } else {
            message(translations(locale)?.err?.fill_all_fields)
        }
    }

    const onSubmitAttendance = () => {
        let list = [...classList];
        let selectedClasses = [];
        for (let c = 0; c < list.length; c++) {
            if (list[c].checked) {
                selectedClasses.push({
                    id: list[c].classId,
                    programStage: list[c].esisProgramStage,
                    academicLevel: list[c].esisAcademicLevel,
                    esisGroup: list[c].esisGroupId
                })
            }
        }

        if (selectedClasses && selectedClasses.length > 0) {
            const selectedTimeTemplate = timeTemplates.find(tt => {
                return tt.id === attendanceParams?.timeTemplate
            });

            // const bodyParams = {
            //     classes: selectedClasses,
            //     date: attendanceParams?.date,
            //     schoolShift: attendanceParams?.schoolShift,
            //     start: selectedTimeTemplate?.start,
            //     end: selectedTimeTemplate?.end
            // };

            // setLoading(true)
            // fetchRequest(ESISAttendanceSend, 'POST', bodyParams)
            //     .then((res) => {
            //         console.log('Res', res)
            //         // if (res.success) {
            //         //     setAttendanceLogs(res?.data?.attendances)
            //         //     setTotalAttendanceLogCount(res?.data?.totalCount)
            //         // } else {
            //         //     message(res.data.message)
            //         // }
            //         setLoading(false)
            //     })
            //     .catch(() => {
            //         message(translations(locale)?.err?.error_occurred)
            //         setLoading(false)
            //     })
        } else {
            message(translations(locale)?.esis.attendance_daily_empty_class)
        }
    }

    const onLogInteraction = (state) => {
        let cloneData = {
            page: state.page,
            pageSize: state.pageSize,
            search: state.search,
            sort: state.sort,
            order: state.order,
            filter: {
                page: 1,
                pageSize: state?.filter?.pageSize || 10
            }
        };
        console.log('Stat', state)
        setTableState(cloneData)
        secureLocalStorage.setItem(esisAttendanceLogTable, cloneData)

        loadAttendanceList(state.page, state.pageSize, state.search, state.sort, state.order)
    }

    const onAllClassChange = (e = null, classId = null, isChecked = true) => {
        e.preventDefault();
        if (classId) {
            const list = [...classList];
            let selectedClassObj = null;
            for (let c = 0; c < list.length; c++) {
                if (list[c].classId === classId) {
                    selectedClassObj = list[c];

                    let ableToSend = false;
                    if (selectedClassObj && selectedClassObj?.timetables && selectedClassObj?.timetables.length > 0) {
                        for (let tt = 0; tt < selectedClassObj.timetables.length; tt++) {
                            let ttObj = selectedClassObj.timetables[tt];
                            if (ttObj.hasTeacherLog) {
                                ableToSend = true;
                            } else {
                                ableToSend = false;
                                break;
                            }
                        }
                    }

                    if (isChecked) {
                        list[c].checked = ableToSend ? isChecked : false;
                    } else {
                        list[c].checked = isChecked;
                    }
                    break;
                }
            }

            setClassList(list)
        }
    }

    const tabContent = () => {
        switch (tabIndex) {
            case 0:
                return <>
                    <div className='m-portlet' style={{marginTop: 20}}>
                        <div className='m-portlet__body'>
                            <Row>
                                <Col>
                                    <Row>
                                        <Col md={3} className='col-form-label text-right label-pinnacle-bold'>
                                            {translations(locale)?.date}
                                        </Col>
                                        <Col>
                                            <DayPickerInput
                                                onDayChange={(data) => onFilterChange('date', data)}
                                                value={filter?.date}
                                                placeholder={translations(locale).datePickerPlaceholder}
                                                hideOnDayClick={true}
                                                inputProps={{readOnly: true}}
                                                dayPickerProps={{}}
                                                classNames={{
                                                    container: 'myToday-hw-DayPicker',
                                                    overlay: 'DayPickerInputOverlay'
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row>
                                        <Col md={3} className='col-form-label text-right label-pinnacle-bold'>
                                            {translations(locale)?.school_shift}
                                        </Col>
                                        <Col>
                                            <Dropdown
                                                fluid
                                                clearable
                                                search
                                                selection
                                                closeOnChange
                                                options={schoolShifts}
                                                value={filter?.schoolShift}
                                                placeholder={'-' + translations(locale)?.select + '-'}
                                                onChange={(e, data) => onFilterChange('schoolShift', data.value)}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row>
                                        <Col md={3} className='col-form-label text-right label-pinnacle-bold'>
                                            {translations(locale)?.period}
                                        </Col>
                                        <Col>
                                            <Dropdown
                                                fluid
                                                clearable
                                                search
                                                selection
                                                closeOnChange
                                                options={timeTemplates}
                                                value={filter?.timeTemplate}
                                                placeholder={'-' + translations(locale)?.select + '-'}
                                                onChange={(e, data) => onFilterChange('timeTemplate', data?.value)}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={2}>
                                    <button
                                        className='btn m-btn--pill text-uppercase d-inline-flex align-content-center justify-content-center'
                                        style={{backgroundColor: '#41c5dc', color: 'white', fontSize: '13px'}}
                                        onClick={onLoadAttendance}
                                    >
                                        <span className='ml-2'>{translations(locale)?.esis.get_time}</span>
                                    </button>
                                </Col>
                            </Row>
                        </div>
                    </div>

                    {
                        classList && classList.length > 0
                        && <div className='m-portlet mt5'>
                            <div className='m-portlet__body'>
                                {/*<DTable*/}
                                {/*    config={classConfig}*/}
                                {/*    checkable*/}
                                {/*    data={classList}*/}
                                {/*    columns={classColumns}*/}
                                {/*    locale={locale}*/}
                                {/*    onLeftButtonClick={onSubmitAttendance}*/}
                                {/*/>*/}

                                <button
                                    className='btn m-btn--pill text-uppercase d-inline-flex align-content-center justify-content-center'
                                    style={{backgroundColor: '#41c5dc', color: 'black', fontSize: '13px'}}
                                    onClick={onSubmitAttendance}
                                >
                                    <span className='ml-2'>{translations(locale).send}</span>
                                </button>

                                <div className="table-responsive mt-4">
                                    <table 
                                    className={'table table-striped table-bordered table-custom react-bootstrap-table'}
                                    >
                                        <thead>
                                        <tr>
                                            <th></th>
                                            <th>
                                                <Checkbox
                                                    label={''}
                                                    onChange={onAllClassChange}
                                                    className='p-2'
                                                />
                                            </th>
                                            <th>{translations(locale)?.status}</th>
                                            <th>{translations(locale)?.className}</th>
                                            <th>{translations(locale)?.dashboardAttendence.lesson}</th>
                                            <th>{translations(locale)?.dashboardAttendence.teacher}</th>
                                            <th>{translations(locale)?.group.student_count}</th>
                                            <th>{translations(locale)?.dashboardAttendence.info_sent}</th>
                                            {

                                                attendanceTypes && attendanceTypes.map(attTypeObj => {
                                                    return <th key={'at_type_' + attTypeObj.id}>
                                                        {attTypeObj.name}
                                                    </th>
                                                })
                                            }
                                            <th>{translations(locale)?.esis.sentDate}</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            classList && classList.length > 0
                                            &&
                                            classList.map((classObj, cI) => {
                                                if (classObj.timetables && classObj.timetables.length > 0) {
                                                    let rowEls = [];
                                                    for (let tt = 0; tt < classObj.timetables.length; tt++) {
                                                        const ttObj = classObj.timetables[tt];

                                                        if (tt >= 1) {
                                                            rowEls.push(
                                                                <tr key={'class_' + classObj?.classId + '_tt_' + ttObj.id}>
                                                                    <td>
                                                                        {ttObj.subjectName}
                                                                    </td>
                                                                    <td>
                                                                        {ttObj.teacherName}
                                                                    </td>
                                                                    <td>
                                                                        {ttObj.studentCount}
                                                                    </td>
                                                                    <td style={{backgroundColor: ttObj.hasTeacherLog ? '#c9eae3' : '#f3aab6', color: 'black'}}>
                                                                        {ttObj.hasTeacherLog ? t('yes') : t('no')}
                                                                    </td>
                                                                    {
                                                                        attendanceTypes && attendanceTypes.map(attTypeObj => {
                                                                            return <td
                                                                                key={'class_' + classObj?.classId + '_tt_' + ttObj.id + '_at_type_' + attTypeObj.id}>
                                                                                {ttObj.report.find(reportObj => {
                                                                                    return reportObj?.code === attTypeObj?.code;
                                                                                })?.studentNumber || '-'}
                                                                            </td>
                                                                        })
                                                                    }
                                                                </tr>
                                                            );
                                                        } else {
                                                            rowEls.push(
                                                                <tr
                                                                    key={'class_' + classObj?.classId + '_tt_' + ttObj.id}>
                                                                    <td rowSpan={classObj.timetables && classObj.timetables.length > 0 ? classObj.timetables.length : 1}>
                                                                        {cI + 1}
                                                                    </td>
                                                                    <td rowSpan={classObj.timetables && classObj.timetables.length > 0 ? classObj.timetables.length : 1}>
                                                                        <Checkbox
                                                                            label={''}
                                                                            onChange={(e, data) => onAllClassChange(e, classObj.classId, data.checked)}
                                                                            checked={classObj?.checked}
                                                                            className='p-2'
                                                                        />
                                                                    </td>
                                                                    <td rowSpan={classObj.timetables && classObj.timetables.length > 0 ? classObj.timetables.length : 1}>{classObj?.esisAttendanceLog
                                                                        ? <span style={{
                                                                            padding: '5px 10px',
                                                                            borderRadius: 10,
                                                                            color: 'black',
                                                                            background: classObj?.esisAttendanceLogColor
                                                                        }}>{classObj?.esisAttendanceLog}</span>
                                                                        : <span style={{
                                                                            padding: '5px 10px',
                                                                            borderRadius: 10,
                                                                            background: '#cfd0d1',
                                                                            color: 'black',
                                                                        }}>{translations(locale)?.esis.notSent}</span>}</td>
                                                                    <td rowSpan={classObj.timetables && classObj.timetables.length > 0 ? classObj.timetables.length : 1}>{classObj.className}</td>
                                                                    <td>
                                                                        {ttObj.subjectName}
                                                                    </td>
                                                                    <td>
                                                                        {ttObj.teacherName}
                                                                    </td>
                                                                    <td>
                                                                        {ttObj.studentCount}
                                                                    </td>
                                                                    <td style={{backgroundColor: ttObj.hasTeacherLog ? '#c9eae3' : '#f3aab6', color: 'black'}}>
                                                                        {ttObj.hasTeacherLog ? t('yes') : t('no')}
                                                                    </td>
                                                                    {
                                                                        attendanceTypes && attendanceTypes.map(attTypeObj => {
                                                                            return <td
                                                                                key={'class_' + classObj?.classId + '_tt_' + ttObj.id + '_at_type_' + attTypeObj.id}>
                                                                                {ttObj.report.find(reportObj => {
                                                                                    return reportObj?.code === attTypeObj?.code;
                                                                                })?.studentNumber || '-'}
                                                                            </td>
                                                                        })
                                                                    }
                                                                    <td rowSpan={classObj.timetables && classObj.timetables.length > 0 ? classObj.timetables.length : 1}>
                                                                        {classObj?.esisAttendanceLogDate || '-'}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
                                                    }
                                                    return rowEls
                                                } else {
                                                    return (
                                                        <tr
                                                            key={'class_' + classObj?.classId + '_tt_empty'}>
                                                            <td>{cI + 1}</td>
                                                            <td>
                                                                <Checkbox
                                                                    label={''}
                                                                    onChange={(e, data) => onAllClassChange(e, classObj.classId, data.checked)}
                                                                    checked={classObj?.checked}
                                                                    className='p-2'
                                                                />
                                                            </td>
                                                            <td>
                                                                {classObj?.esisAttendanceLog
                                                                    ? <span style={{
                                                                        padding: '5px 10px',
                                                                        borderRadius: 10,
                                                                        background: classObj?.esisAttendanceLogColor,
                                                                        color: 'black',
                                                                    }}>{classObj?.esisAttendanceLog}</span>
                                                                    : <span style={{
                                                                        padding: '5px 10px',
                                                                        borderRadius: 10,
                                                                        background: '#cfd0d1',
                                                                        color: 'black',
                                                                    }}>{translations(locale)?.esis.notSent}</span>}
                                                            </td>
                                                            <td>{classObj.className}</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            {
                                                                attendanceTypes && attendanceTypes.map(attTypeObj => {
                                                                    return <td
                                                                        key={'class_' + classObj?.classId + '_tt_empty_at_type_' + attTypeObj.id}>
                                                                        -
                                                                    </td>
                                                                })
                                                            }
                                                            <td>{classObj?.esisAttendanceLogDate || '-'}</td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    }
                </>
            case 1:
                return <div className='m-portlet' style={{marginTop: 20}}>
                    <div className='m-portlet__body'>
                        <DTable
                            remote
                            config={attendanceLogConfig}
                            data={attendanceLogs}
                            columns={attendanceLogColumns}
                            locale={locale}
                            onInteraction={onLogInteraction}
                            totalDataSize={totalAttendanceLogCount}
                        />
                    </div>
                </div>
            default:
                return null;
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

                <Tab
                    activeIndex={tabIndex}
                    menu={{secondary: true, pointing: true, className: 'primaryColor'}}
                    className='no-shadow'
                    onTabChange={(e, data) => onTabChange(data)}
                    panes={tabs}
                />

                {
                    tabContent()
                }
            </div>

            {
                loading &&
                <>
                    <div className='blockUI blockOverlay'/>
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg'/>
                    </div>
                </>
            }
        </div>
    )
}

export default index