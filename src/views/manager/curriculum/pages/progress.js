import React, {useEffect, useRef, useState} from "react";
import {translations} from "utils/translations";
import {Row, Col} from 'react-bootstrap'
// import SubHeader from "Src/SubHeader";
import secureLocalStorage from "react-secure-storage";
import ReactToPrint from 'react-to-print';
import {NDropdown as Dropdown} from "widgets/Dropdown";
import message from "modules/message";
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles, InputBase, IconButton, Paper } from "@material-ui/core";

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded'
import Search from "modules/DataTable/Search";
// import {fetchRequest} from "utils/fetchRequest";
// import {managerCurriculumProgress, managerCurriculumProgressExcel} from "Utilities/url";

const useStyles = makeStyles({
    root: {
        fontSize: '1rem !important',
        padding: '0px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 220,
        border: '1px solid #EBEDF2',
        boxShadow: 'none',
        borderRadius: 8,
        height: 35
    },
    input: {
        fontSize: '1rem !important',
        color: '#4e4e4e',
        marginLeft: 8,
        flex: 1,
        width: 200,
        fontFamily: 'Mulish'
    },
    iconButton: {
        padding: 8,
        color: '#32a9e2'
    },
});

const progress = () => {
    const printRef = useRef();
    const [loading, setLoading] = useState(false)
    const [grades, setGrades] = useState([])
    const [selectedGrade, setSelectedGrade] = useState(null)
    const [selectedSeasons, setSelectedSeasons] = useState([])
    const [seasons, setSeasons] = useState([])
    const [resultSeasonList, setResultSeasonList] = useState([]);
    const [teachers, setTeachers] = useState([])
    const [showResult, setShowResult] = useState(false)

    const [sortColumn, setSortColumn] = useState(null)
    const [sortOrder, setSortOrder] = useState('asc')

    const [searchQuery, setSearchQuery] = useState('')

    // const loadData = (gradeId = null, seasons = null) => {
    //     console.log('loadData')
    //     setLoading(true)
    //     fetchRequest(managerCurriculumProgress, 'POST', {
    //         grade: gradeId,
    //         seasons
    //     })
    //         .then((res) => {
    //             if (res?.success) {
    //                 if (gradeId) {
    //                     setShowResult(true)
    //                     setResultSeasonList(res?.data?.selectedSeasons || [])
    //                     setTeachers(res?.data?.teachers || [])
    //                     // setTotalWeekCount(res?.data?.totalWeekCount || 0);
    //                     // setSeasons(res?.data?.seasons || [])
    //                     // setSubjects(res?.data?.subjects || [])
    //                 } else {
    //                     setShowResult(false)
    //                     setGrades(res?.data?.grades || [])
    //                     setSeasons(res?.data?.seasons || [])
    //                 }
    //             } else {
    //                 message(res?.data?.message || translations(locale)?.err?.error_occurred)
    //             }
    //             setLoading(false)
    //         })
    //         .catch(() => {
    //             message(translations(locale)?.err?.error_occurred)
    //             setLoading(false)
    //         })
    // }

    const loadData = () => {
        const res = {
            data: {
                selectedSeasons: [
                    {
                        id: "520",
                        name: "2-р улирал",
                        start: "2023-11-09",
                        weekCount: 4
                    }
                ],
                teachers: [
                    {
                        id: "10233",
                        code: "09090909",
                        firstName: "Bold",
                        lastName: "Dulam",
                        groups: []
                    },
                    {
                        id: "11356",
                        code: "Financeeeee",
                        firstName: "Санхүүч",
                        lastName: "Санхүүч",
                        groups: []
                    },
                    {
                        id: "11365",
                        code: "20000",
                        firstName: "Цэрэнсодном",
                        lastName: "Бямбадорж",
                        groups: []
                    },
                    {
                        id: "14205",
                        code: "0000",
                        firstName: "Erdenejargal",
                        lastName: "Narantuya",
                        groups: [
                            {
                                id: "129579",
                                name: "Physics | 1А",
                                subjectId: "38086",
                                subjectName: "Physics",
                                subjectCode: "PHY0101",
                                className: "1А",
                                gradeName: "1-р анги",
                                teacherId: "14205",
                                teacherCode: "0000",
                                teacherFirstname: "Erdenejargal",
                                teacherLastname: "Narantuya",
                                seasons: [
                                    {
                                        id: "520",
                                        curriculumHour: 8,
                                        timetableCount: 0,
                                        attendanceCount: 0,
                                        journalCount: 0
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: "6702",
                        code: "TE12",
                        firstName: "Enkhdelger",
                        lastName: "Ankhbayar",
                        groups: []
                    },
                    {
                        id: "11698",
                        code: "111",
                        firstName: "Саруул",
                        lastName: "У",
                        groups: [
                            {
                                id: "112665",
                                name: "Математик | 1В",
                                subjectId: "27651",
                                subjectName: "Математик",
                                subjectCode: "МАТ0101",
                                className: "1В",
                                gradeName: "1-р анги",
                                teacherId: "11698",
                                teacherCode: "111",
                                teacherFirstname: "Cаруул",
                                teacherLastname: "Уранчимэг",
                                seasons: [
                                    {
                                        id: "520",
                                        curriculumHour: 4,
                                        timetableCount: 0,
                                        attendanceCount: 0,
                                        journalCount: 0
                                    }
                                ]
                            },
                            {
                                id: "112666",
                                name: "Математик | 1с",
                                subjectId: "27651",
                                subjectName: "Математик",
                                subjectCode: "МАТ0101",
                                className: "1с",
                                gradeName: "1-р анги",
                                teacherId: "11698",
                                teacherCode: "111",
                                teacherFirstname: "Cаруул",
                                teacherLastname: "Уранчимэг",
                                seasons: [
                                    {
                                        id: "520",
                                        curriculumHour: 4,
                                        timetableCount: 20,
                                        attendanceCount: 0,
                                        journalCount: 0
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: "11163",
                        code: "891014",
                        firstName: "Цэрэнсодном",
                        lastName: "Бямбадорж",
                        groups: []
                    },
                    {
                        id: "9635",
                        code: "ES0018",
                        firstName: "Nomin-Erdene",
                        lastName: "eSchool",
                        groups: [
                            {
                                id: "112664",
                                name: "Математик | 1А",
                                subjectId: "27651",
                                subjectName: "Математик",
                                subjectCode: "МАТ0101",
                                className: "1А",
                                gradeName: "1-р анги",
                                teacherId: "9635",
                                teacherCode: "ES0018",
                                teacherFirstname: "Nomin-Erdene",
                                teacherLastname: "eSchool",
                                seasons: [
                                    {
                                        id: "520",
                                        curriculumHour: 4,
                                        timetableCount: 4,
                                        attendanceCount: 0,
                                        journalCount: 0
                                    }
                                ]
                            },
                            {
                                id: "137947",
                                name: "Цахилгаан | 1А",
                                subjectId: "50241",
                                subjectName: "Цахилгаан",
                                subjectCode: "ЦХЛ0101",
                                className: "1А",
                                gradeName: "1-р анги",
                                teacherId: "9635",
                                teacherCode: "ES0018",
                                teacherFirstname: "Nomin-Erdene",
                                teacherLastname: "eSchool",
                                seasons: [
                                    {
                                        id: "520",
                                        curriculumHour: 4,
                                        timetableCount: 0,
                                        attendanceCount: 0,
                                        journalCount: 0
                                    }
                                ]
                            },
                            {
                                id: "156151",
                                name: "Цахилгаан | 1В",
                                subjectId: "50241",
                                subjectName: "Цахилгаан",
                                subjectCode: "ЦХЛ0101",
                                className: "1В",
                                gradeName: "1-р анги",
                                teacherId: "9635",
                                teacherCode: "ES0018",
                                teacherFirstname: "Nomin-Erdene",
                                teacherLastname: "eSchool",
                                seasons: [
                                    {
                                        id: "520",
                                        curriculumHour: 4,
                                        timetableCount: 0,
                                        attendanceCount: 0,
                                        journalCount: 0
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: "10287",
                        code: "T024",
                        firstName: "Bilguuntamir",
                        lastName: "eSchool",
                        groups: []
                    },
                    {
                        id: "13918",
                        code: "TShiMo01",
                        firstName: "Туяа",
                        lastName: "Энхболд",
                        groups: [
                            {
                                id: "138935",
                                name: "Биеийн тамир | 1с",
                                subjectId: "27652",
                                subjectName: "Биеийн тамир",
                                subjectCode: "БТА0101",
                                className: "1с",
                                gradeName: "1-р анги",
                                teacherId: "13918",
                                teacherCode: "TShiMo01",
                                teacherFirstname: "Туяа",
                                teacherLastname: "Энхболд",
                                seasons: [
                                    {
                                        id: "520",
                                        curriculumHour: 8,
                                        timetableCount: 4,
                                        attendanceCount: 0,
                                        journalCount: 0
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: "14555",
                        code: "95166223",
                        firstName: "Jerry",
                        lastName: "Tom",
                        groups: [
                            {
                                id: "154166",
                                name: "мат | 1В",
                                subjectId: "61596",
                                subjectName: "мат",
                                subjectCode: "2113",
                                className: "1В",
                                gradeName: "1-р анги",
                                teacherId: "14555",
                                teacherCode: "95166223",
                                teacherFirstname: "Jerry",
                                teacherLastname: "Tom",
                                seasons: [
                                    {
                                        id: "520",
                                        curriculumHour: 4,
                                        timetableCount: 0,
                                        attendanceCount: 0,
                                        journalCount: 0
                                    }
                                ]
                            },
                            {
                                id: "154167",
                                name: "мат | 1с",
                                subjectId: "61596",
                                subjectName: "мат",
                                subjectCode: "2113",
                                className: "1с",
                                gradeName: "1-р анги",
                                teacherId: "14555",
                                teacherCode: "95166223",
                                teacherFirstname: "Jerry",
                                teacherLastname: "Tom",
                                seasons: [
                                    {
                                        id: "520",
                                        curriculumHour: 4,
                                        timetableCount: 0,
                                        attendanceCount: 0,
                                        journalCount: 0
                                    }
                                ]
                            },
                            {
                                id: "152977",
                                name: "математик | 1В",
                                subjectId: "61594",
                                subjectName: "математик",
                                subjectCode: "202312",
                                className: "1В",
                                gradeName: "1-р анги",
                                teacherId: "14555",
                                teacherCode: "95166223",
                                teacherFirstname: "Jerry",
                                teacherLastname: "Tom",
                                seasons: [
                                    {
                                        id: "520",
                                        curriculumHour: 4,
                                        timetableCount: 0,
                                        attendanceCount: 0,
                                        journalCount: 0
                                    }
                                ]
                            },
                            {
                                id: "152979",
                                name: "математик | 2651",
                                subjectId: "61594",
                                subjectName: "математик",
                                subjectCode: "202312",
                                className: "2651",
                                gradeName: "1-р анги",
                                teacherId: "14555",
                                teacherCode: "95166223",
                                teacherFirstname: "Jerry",
                                teacherLastname: "Tom",
                                seasons: [
                                    {
                                        id: "520",
                                        curriculumHour: 4,
                                        timetableCount: 0,
                                        attendanceCount: 0,
                                        journalCount: 0
                                    }
                                ]
                            },
                            {
                                id: "152980",
                                name: "математик | 1с",
                                subjectId: "61594",
                                subjectName: "математик",
                                subjectCode: "202312",
                                className: "1с",
                                gradeName: "1-р анги",
                                teacherId: "14555",
                                teacherCode: "95166223",
                                teacherFirstname: "Jerry",
                                teacherLastname: "Tom",
                                seasons: [
                                    {
                                        id: "520",
                                        curriculumHour: 4,
                                        timetableCount: 0,
                                        attendanceCount: 0,
                                        journalCount: 0
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: "474",
                        code: "test1-1",
                        firstName: "Admin",
                        lastName: "eSchool",
                        groups: []
                    }
                ],
                message: "Амжилттай"
            },
            success: true
        }
        // if (gradeId) {
            setShowResult(true)
            setResultSeasonList(res?.data?.selectedSeasons || [])
            setTeachers(res?.data?.teachers || [])
            // setTotalWeekCount(res?.data?.totalWeekCount || 0);
            // setSeasons(res?.data?.seasons || [])
            // setSubjects(res?.data?.subjects || [])
        // } else {
        //     setShowResult(false)
        //     setGrades(res?.data?.grades || [])
        //     setSeasons(res?.data?.seasons || [])
        // }
    }

    useEffect(() => {
        loadData()
    }, [])

    const getFilteredTeachers = (list = []) => {
        if (searchQuery && searchQuery?.length > 0) {
            const filtered = [];
            for (let l = 0; l < list?.length; l++) {
                const obj = list[l];
                if (obj?.code?.toLowerCase().includes(searchQuery?.toLowerCase())
                    || obj?.lastName?.toLowerCase().includes(searchQuery?.toLowerCase())
                    || obj?.firstName?.toLowerCase().includes(searchQuery?.toLowerCase())) {
                    filtered.push(obj)
                } else {
                    if (obj?.groups && obj?.groups?.length > 0) {
                        let groupFound = false;
                        for (let g = 0; g < obj?.groups?.length; g++) {
                            if (obj?.groups[g]?.name?.toLowerCase().includes(searchQuery?.toLowerCase())) {
                                groupFound = true;
                                break;
                            }
                        }
                        if (groupFound) {
                            filtered.push(obj);
                        }
                    }
                }
            }
            return filtered;
        } else {
            return list;
        }
    }

    const onSortChange = (column = null, order = null) => {
        if (column) {
            setSortColumn(column)
            setSortOrder(order)

            const clone = [...teachers];

            switch (column) {
                case 'code':
                    clone?.sort((a, b) => {
                        return order === 'asc' ? a.code?.localeCompare(b.code) : b.code?.localeCompare(a.code);
                    })
                    break;
                case 'lastName':
                    clone?.sort((a, b) => {
                        return order === 'asc' ? a.lastName?.localeCompare(b.lastName) : b.lastName?.localeCompare(a.lastName);
                    })
                    break;
                case 'firstName':
                    clone?.sort((a, b) => {
                        return order === 'asc' ? a.firstName?.localeCompare(b.firstName) : b.firstName?.localeCompare(a.firstName);
                    })
                // case 'name':
                //     clone?.sort((a, b) => {
                //         console.log(a)
                //         return order === 'asc' ? a.groups?.localeCompare(b.groups) : b.groups?.localeCompare(a.groups)
                //     })
                //     break;
            }
            setTeachers(clone)
        }
    }

    // const prepareToPrint = () => {
    //     hideOnPrintRef.current.map(x => {
    //         if (x) {
    //             x.style.display = 'none'
    //         }
    //     })
    //     styleOnPrintRef.current.map(x => {
    //         if (x) {
    //             x.style.padding = '0.2rem'
    //         }
    //     })
    //     printRef.current.children[0].style.display = 'block'
    // }
    //
    // const unPrepareToPrint = () => {
    //     hideOnPrintRef.current.map(x => {
    //         if (x) {
    //             x.style.display = 'table-cell'
    //         }
    //     })
    //     styleOnPrintRef.current.map(x => {
    //         if (x) {
    //             x.style.padding = '0.75rem'
    //         }
    //     })
    //     printRef.current.children[0].style.display = 'none'
    // }
    const classes = useStyles();

    return (
        <div>
            {/* <SubHeader
                title={translations(locale).manager?.teacher_progress}
                locale={locale}
            /> */}
            <div className="m-portlet mt-2">
                <div className="m-portlet__body">
                    <div className={'ml-5 d-flex py-4'} style={{
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <label className='d-flex col-form-label mr-4' style={{
                            fontWeight: 800,
                            fontFamily: 'PinnacleBold',
                            position: 'relative',
                        }}>
                            {translations(locale)?.grade}
                        </label>
                        <Dropdown
                            style={{width: 250, height: 35}}
                            className='content-search-inputs mr-4'
                            placeholder={'-' + translations(locale).select + '-' || ""}
                            fluid
                            selection
                            clearable
                            search
                            additionPosition='bottom'
                            upward={false}
                            selectOnBlur={false}
                            value={selectedGrade}
                            options={grades?.map(gradeObj => {
                                return {
                                    value: gradeObj?.key,
                                    text: gradeObj?.title
                                }
                            })}
                            onChange={(e, data) => setSelectedGrade(data?.value)}
                        />

                        <label className='d-flex col-form-label ml-4 mr-4' style={{
                            fontWeight: 800,
                            fontFamily: 'PinnacleBold',
                            position: 'relative',
                        }}>
                            {translations(locale)?.season}
                        </label>
                        <Dropdown
                            style={{width: 280}}
                            className='content-search-inputs'
                            placeholder={'-' + translations(locale).select + '-' || ""}
                            fluid
                            selection
                            clearable
                            search
                            multiple={true}
                            additionPosition='bottom'
                            upward={false}
                            selectOnBlur={false}
                            value={selectedSeasons}
                            options={seasons?.map(seasonObj => {
                                return {
                                    value: seasonObj?.id,
                                    text: seasonObj?.name
                                }
                            })}
                            onChange={(e, data) => setSelectedSeasons(data?.value)}
                        />

                        <button
                            className='btn btn-sm m-btn--pill text-uppercase d-inline-flex align-content-center justify-content-center ml-4'
                            style={{backgroundColor: '#41c5dc', color: 'white', maxHeight: 32}}
                            onClick={() => {
                                if (selectedGrade && selectedSeasons?.length > 0) {
                                    loadData(selectedGrade, selectedSeasons)
                                } else {
                                    message(translations(locale)?.err?.fill_all_fields)
                                }
                            }}
                        >
                            <QueryStatsRoundedIcon/>
                            <span className='ml-2'>{translations(locale)?.view}</span>
                        </button>
                    </div>
                </div>
            </div>

            {
                showResult && <>
                    <div className="m-portlet mt-2">
                        <div className="m-portlet__body">
                            {
                                teachers && teachers?.length > 0 && <>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: 10
                                    }}>
                                        <div className={'w-100 text-right mx-1'}>
                                            <button
                                                className="btn m-btn--icon m-btn--icon-only btn-info br-03 mx-1"
                                                style={{
                                                    height: 33,
                                                    width: 33
                                                }}
                                                onClick={() => {
                                                    if (selectedGrade && selectedSeasons && selectedSeasons?.length > 0) {
                                                        let seasonParams = '';
                                                        for (let s = 0; s < selectedSeasons?.length; s++) {
                                                            seasonParams = seasonParams + '&seasons[]=' + selectedSeasons[s];
                                                        }
                                                        // window.open(`/${managerCurriculumProgressExcel}?grade=${selectedGrade}${seasonParams}&query=${searchQuery}`, '_blank')
                                                    }
                                                }}
                                            >
                                                <i className="la-old la-file-excel-o"
                                                   style={{
                                                       fontSize: 22,
                                                       color: 'white'
                                                   }}></i>
                                            </button>
                                            <ReactToPrint
                                                trigger={() => <button
                                                    className="btn m-btn m-btn--icon m-btn--icon-only"
                                                    style={{
                                                        backgroundColor: '#ff5b1d',
                                                        boxShadow: '0 2px 10px 0 #ff5b1d',
                                                        border: 'none',
                                                        width: '33px',
                                                        height: '33px',
                                                        alignItems: 'center',
                                                        marginRight: '0.5rem'
                                                    }}
                                                >
                                                    <i
                                                        className="la la-print m-0 p-0"
                                                        style={{
                                                            fontSize: '22px',
                                                            color: '#ffffff',
                                                        }}
                                                    />
                                                </button>
                                                }
                                                pageStyle='@page {margin: 0.2cm 1cm !important;}'
                                                content={() => printRef.current}
                                                // onBeforeGetContent={() => prepareToPrint()}
                                                // onAfterPrint={() => unPrepareToPrint()}
                                                suppressErrors={true}
                                            />
                                        </div>
                                            <Paper className={classes.root}>
                                                <InputBase
                                                    className={classes.input}
                                                    placeholder="Хайх"
                                                    type="text"
                                                    aria-label="Search..."
                                                    onChange={(e) => {
                                                        setSearchQuery(e?.target?.value)
                                                    }}
                                                    value={searchQuery}
                                                />
                                                <IconButton
                                                    className={classes.iconButton}
                                                    aria-label="Search"
                                                >
                                                    <SearchIcon />
                                                </IconButton>
                                            </Paper>
                                    </div>
                                    <div className={'table-responsive'}>
                                        <table
                                            ref={printRef}
                                            className={'table table-striped table-bordered table-custom react-bootstrap-table'}
                                            style={{width: '100%', borderCollapse: 'collapse'}}
                                            cellPadding={0}>
                                            <thead style={{width: '100%'}}>
                                            <tr>
                                                <th rowSpan={2} width={40} className={'text-center'}>№</th>
                                                <th rowSpan={2} width={120}
                                                    onClick={() => {
                                                        onSortChange('code', sortOrder === 'desc' ? 'asc' : 'desc')
                                                    }}
                                                    className={'text-center td-clickable'}>{translations(locale)?.teacher?.code}
                                                    {
                                                        sortColumn === 'code'
                                                            ? (sortOrder === 'desc' ? <span className="caret-4-desc"/> :
                                                            <span className="caret-4-asc"/>)
                                                            : <span className="order-4"/>
                                                    }
                                                </th>
                                                <th rowSpan={2} width={200}
                                                    onClick={() => {
                                                        onSortChange('lastName', sortOrder === 'desc' ? 'asc' : 'desc')
                                                    }}
                                                    className={'text-center td-clickable'}>{translations(locale)?.teacher?.lastname}
                                                    {
                                                        sortColumn === 'lastName'
                                                            ? (sortOrder === 'desc' ? <span className="caret-4-desc"/> :
                                                            <span className="caret-4-asc"/>)
                                                            : <span className="order-4"/>
                                                    }
                                                </th>
                                                <th rowSpan={2} width={200}
                                                    onClick={() => {
                                                        onSortChange('lastName', sortOrder === 'desc' ? 'asc' : 'desc')
                                                    }}
                                                    className={'text-center td-clickable'}>{translations(locale)?.teacher?.name}
                                                    {
                                                        sortColumn === 'lastName'
                                                            ? (sortOrder === 'desc' ? <span className="caret-4-desc"/> :
                                                            <span className="caret-4-asc"/>)
                                                            : <span className="order-4"/>
                                                    }
                                                </th>
                                                <th rowSpan={2} width={220}
                                                    className={'text-center'}>{translations(locale)?.subject?.title}</th>
                                                {
                                                    resultSeasonList && resultSeasonList?.length > 0 && resultSeasonList?.map(seasonObj => {
                                                        return <th className={'text-center'}
                                                                   key={'thead_1_' + seasonObj?.id}
                                                                   colSpan={4}>{seasonObj?.name}</th>
                                                    })
                                                }
                                            </tr>
                                            <tr>
                                                {
                                                    resultSeasonList && resultSeasonList?.length > 0 && resultSeasonList?.map(seasonObj => {
                                                        return <>
                                                            <th className={'text-center capitalize'}>{translations(locale)?.planned_time}</th>
                                                            <th className={'text-center capitalize'}>{translations(locale)?.timetable?.title}</th>
                                                            <th className={'text-center capitalize'}>{translations(locale)?.attendance?.title}</th>
                                                            <th className={'text-center capitalize'}>{translations(locale)?.teacher?.note}</th>
                                                        </>
                                                    })
                                                }
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {getFilteredTeachers(teachers)?.map((teacherObj, i) => {
                                                if (teacherObj?.groups && teacherObj?.groups?.length > 0) {
                                                    return teacherObj?.groups?.map((teacherGroup, gIndex) => {
                                                        return <tr
                                                            key={'tbody_tr_' + teacherObj?.id + '_' + teacherGroup?.id}>
                                                            {
                                                                gIndex === 0 && <>
                                                                    <td className={'text-right'}
                                                                        rowSpan={teacherObj?.groups?.length}>{i + 1}</td>
                                                                    <td rowSpan={teacherObj?.groups?.length}>{teacherObj?.code}</td>
                                                                    <td rowSpan={teacherObj?.groups?.length}>{teacherObj?.lastName}</td>
                                                                    <td rowSpan={teacherObj?.groups?.length}>{teacherObj?.firstName}</td>
                                                                </>
                                                            }
                                                            <td>{teacherGroup?.name}</td>
                                                            {
                                                                resultSeasonList && resultSeasonList?.map(seasonObj => {
                                                                    const teacherGroupSeason = teacherGroup?.seasons?.find(obj => {
                                                                        return obj?.id === seasonObj?.id
                                                                    })

                                                                    if (teacherGroupSeason) {
                                                                        return <>
                                                                            <td className={'text-right'}>
                                                                                {teacherGroupSeason?.curriculumHour || '-'}
                                                                            </td>
                                                                            <td
                                                                                className={'text-right'}
                                                                                style={teacherGroupSeason?.curriculumHour ? {
                                                                                    backgroundColor: teacherGroupSeason?.timetableCount >= teacherGroupSeason?.curriculumHour
                                                                                        ? '#C5EBE3'
                                                                                        : (teacherGroupSeason?.timetableCount === 0 ? '#F9A8B5' : 'transparent')
                                                                                } : {}}>
                                                                                {teacherGroupSeason?.timetableCount || '-'}
                                                                            </td>
                                                                            <td style={teacherGroupSeason?.curriculumHour ? {
                                                                                backgroundColor: teacherGroupSeason?.attendanceCount >= teacherGroupSeason?.curriculumHour
                                                                                    ? '#C5EBE3'
                                                                                    : (teacherGroupSeason?.attendanceCount === 0 ? '#F9A8B5' : 'transparent')
                                                                            } : {}}>{teacherGroupSeason?.attendanceCount || '-'}{teacherGroupSeason?.attendanceCount && teacherGroupSeason?.curriculumHour && teacherGroupSeason?.curriculumHour > 0
                                                                                ? ' | ' + (100 * teacherGroupSeason?.attendanceCount / teacherGroupSeason?.curriculumHour)?.toFixed(2) + '%' : ''}</td>
                                                                            <td style={teacherGroupSeason?.curriculumHour ? {
                                                                                backgroundColor: teacherGroupSeason?.journalCount >= teacherGroupSeason?.curriculumHour
                                                                                    ? '#C5EBE3'
                                                                                    : (teacherGroupSeason?.journalCount === 0 ? '#F9A8B5' : 'transparent')
                                                                            } : {}}>{teacherGroupSeason?.journalCount || '-'}{teacherGroupSeason?.journalCount && teacherGroupSeason?.curriculumHour && teacherGroupSeason?.curriculumHour > 0
                                                                                ? ' | ' + (100 * teacherGroupSeason?.journalCount / teacherGroupSeason?.curriculumHour)?.toFixed(2) + '%' : ''}</td>
                                                                        </>
                                                                    } else {
                                                                        return <>
                                                                            <td className={'text-right'}>-</td>
                                                                            <td className={'text-right'}>-</td>
                                                                            <td>-</td>
                                                                            <td>-</td>
                                                                        </>
                                                                    }
                                                                })
                                                            }
                                                        </tr>
                                                    })
                                                } else {
                                                    return <tr key={'tbody_tr_' + teacherObj?.id}>
                                                        <td className={'text-right'}>{i + 1}</td>
                                                        <td>{teacherObj?.code}</td>
                                                        <td>{teacherObj?.lastName}</td>
                                                        <td>{teacherObj?.firstName}</td>
                                                        <td>-</td>
                                                        {
                                                            resultSeasonList && resultSeasonList?.map(seasonObj => {
                                                                return <>
                                                                    <td className={'text-right'}>-</td>
                                                                    <td className={'text-right'}>-</td>
                                                                    <td>-</td>
                                                                    <td>-</td>
                                                                </>
                                                            })
                                                        }
                                                    </tr>
                                                }
                                            })}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </>
            }


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

export default progress