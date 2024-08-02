import React, {useEffect, useState} from "react";
import {translations} from "utils/translations";
import {Row, Col} from 'react-bootstrap'
// import SubHeader from "Src/SubHeader";
import secureLocalStorage from "react-secure-storage";
import {NDropdown as Dropdown} from "widgets/Dropdown";
import message from "modules/message";

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded'
// import {fetchRequest} from "utils/fetchRequest";
// import {managerCurriculumPlan} from "Utilities/url";

const plan = () => {

    const [loading, setLoading] = useState(false)
    const [grades, setGrades] = useState([
        {
            "key": "2117",
            "refId": 5,
            "gid": "2117",
            "title": "1-р анги"
        },
        {
            "key": "2118",
            "refId": 6,
            "gid": "2118",
            "title": "2-р анги"
        },
        {
            "key": "2119",
            "refId": 39,
            "gid": "2119",
            "title": "3-р анги"
        }
    ])
    const [selectedGrade, setSelectedGrade] = useState(null)
    const [subjects, setSubjects] = useState([])
    const [seasons, setSeasons] = useState([])
    const [showResult, setShowResult] = useState(false)
    const [totalWeekCount, setTotalWeekCount] = useState(0)

    const [sortColumn, setSortColumn] = useState(null)
    const [sortOrder, setSortOrder] = useState('asc')

    const [isEdit, setIsEdit] = useState(false)

    // const loadData = (gradeId = null) => {
    //     console.log('loadData')
    //     setLoading(true)
    //     fetchRequest(managerCurriculumPlan, 'POST', {
    //         grade: gradeId
    //     })
    //         .then((res) => {
    //             if (res?.success) {
    //                 if (gradeId) {
    //                     setShowResult(true)
    //                     setTotalWeekCount(res?.data?.totalWeekCount || 0);
    //                     setSeasons(res?.data?.seasons || [])
    //                     setSubjects(res?.data?.subjects || [])
    //                 } else {
    //                     setShowResult(false)
    //                     setGrades(res?.data?.grades || [])
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

    const loadData = (gradeId = null) => {
        const res = {
            data: {
                totalWeekCount: 15,
                seasons: [
                    {
                        id: "518",
                        name: "1-р улирал",
                        start: "2023-08-01",
                        weekCount: 5
                    },
                    {
                        id: "520",
                        name: "2-р улирал",
                        start: "2023-11-09",
                        weekCount: 4
                    },
                    {
                        id: "1138",
                        name: "3-р улирал",
                        start: "2024-01-29",
                        weekCount: 2
                    },
                    {
                        id: "1176",
                        name: "4-р улирал",
                        start: "2024-04-08",
                        weekCount: 4
                    }
                ],
                subjects: [
                    {
                        id: "27650",
                        code: "МОН0101",
                        name: "Монгол хэл",
                        totalCount: 25,
                        season_518: 1,
                        season_520: 2,
                        season_1138: 2,
                        season_1176: 2
                    },
                    {
                        id: "27651",
                        code: "МАТ0101",
                        name: "Математик Математик Математик Математик",
                        totalCount: 22,
                        season_518: 2,
                        season_520: 1,
                        season_1138: 2,
                        season_1176: 1
                    },
                    {
                        id: "27652",
                        code: "БТА0101",
                        name: "Биеийн тамир",
                        totalCount: 23,
                        season_518: 1,
                        season_520: 2,
                        season_1138: 1,
                        season_1176: 2
                    },
                    {
                        id: "27653",
                        code: "ХӨГ0101",
                        name: "Хөгжим",
                        totalCount: 24,
                        season_518: 2,
                        season_520: 1,
                        season_1138: 1,
                        season_1176: 2
                    },
                    {
                        id: "27654",
                        code: "ДҮУ0101",
                        name: "Дүрслэх урлаг",
                        totalCount: 25,
                        season_518: 1,
                        season_520: 2,
                        season_1138: 2,
                        season_1176: 2
                    },
                    {
                        id: "38086",
                        code: "PHY0101",
                        name: "Physics",
                        totalCount: 34,
                        season_518: 2,
                        season_520: 2,
                        season_1138: 2,
                        season_1176: 3
                    },
                    {
                        id: "50241",
                        code: "ЦХЛ0101",
                        name: "Цахилгаан",
                        totalCount: 15,
                        season_518: 1,
                        season_520: 1,
                        season_1138: 1,
                        season_1176: 1
                    },
                    {
                        id: "61594",
                        code: "202312",
                        name: "математик",
                        totalCount: 20,
                        season_518: 2,
                        season_520: 1,
                        season_1138: 1,
                        season_1176: 1
                    },
                    {
                        id: "61596",
                        code: "2113",
                        name: "мат",
                        totalCount: 15,
                        season_518: 1,
                        season_520: 1,
                        season_1138: 1,
                        season_1176: 1
                    },
                    {
                        id: "70492",
                        code: "eC_EngA1-12",
                        name: "English A1 Level",
                        totalCount: 0,
                        season_518: null,
                        season_520: null,
                        season_1138: null,
                        season_1176: null
                    },
                    {
                        id: "70493",
                        code: "eC_EngA2-12",
                        name: "English A2 Level",
                        totalCount: 0,
                        season_518: null,
                        season_520: null,
                        season_1138: null,
                        season_1176: null
                    }
                ],
                message: "Амжилттай"
            },
            success: true
        }

        // if (gradeId) {
            setShowResult(true)
            setTotalWeekCount(res?.data?.totalWeekCount || 0);
            setSeasons(res?.data?.seasons || [])
            setSubjects(res?.data?.subjects || [])
        // } else {
        //     setShowResult(false)
        //     setGrades(res?.data?.grades || [])
        // }
    }

    useEffect(() => {
        loadData()
    }, [])

    const onWeeklyCountChange = (subjectId = null, seasonId = null, weeklyCount = '') => {
        const clone = [...subjects]
        for (let s = 0; s < clone?.length; s++) {
            if (clone[s]?.id === subjectId) {
                for (let ss = 0; ss < seasons?.length; ss++) {
                    if (seasons[ss].id === seasonId) {
                        clone[s]['season_' + seasons[ss].id] = parseInt(weeklyCount);
                        break;
                    }
                }
                let totalWeeklyCount = 0;
                for (let ss = 0; ss < seasons?.length; ss++) {
                    if (clone[s]['season_' + seasons[ss].id]) {
                        totalWeeklyCount += (seasons[ss]?.weekCount || 0) *clone[s]['season_' + seasons[ss].id];
                    }
                }
                clone[s].totalCount = totalWeeklyCount;
                break;
            }
        }
        setSubjects(clone)
    }

    const getTotalCount = (id = null) => {
        let all = 0;
        if (id === 'all') {
            for (let s = 0; s < subjects?.length; s++) {
                all += subjects[s].totalCount || 0;
            }
        } else {
            for (let s = 0; s < subjects?.length; s++) {
                for (let ss = 0; ss < seasons?.length; ss++) {
                    if (seasons[ss]?.id === id) {
                        all += (subjects[s]['season_' + seasons[ss]?.id] || 0);
                        break;
                    }
                }
            }
        }
        return all;
    }

    const submitSave = () => {
        console.log('submitSave')
        // setLoading(true)
        // fetchRequest(managerCurriculumPlan, 'POST', {
        //     submit : 1,
        //     grade: selectedGrade,
        //     subjects: JSON.stringify(subjects)
        // })
        //     .then((res) => {
        //         if (res?.success) {
        //             setIsEdit(false);
        //             setShowResult(true)
        //             setTotalWeekCount(res?.data?.totalWeekCount || 0);
        //             setSeasons(res?.data?.seasons || [])
        //             setSubjects(res?.data?.subjects || [])
        //         } else {
        //             message(res?.data?.message || translations(locale)?.err?.error_occurred)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(translations(locale)?.err?.error_occurred)
        //         setLoading(false)
        //     })
    }

    const onSortChange = (column = null, order = null) => {
        if (column) {
            setSortColumn(column)
            setSortOrder(order)

            const clone = [...subjects]

            switch (column) {
                case 'code':
                    clone?.sort((a, b) => {
                        return order === 'asc' ? a.code?.localeCompare(b.code) : b.code?.localeCompare(a.code);
                    })
                    break;
                case 'name':
                    clone?.sort((a, b) => {
                        return order === 'asc' ? a.name?.localeCompare(b.name) : b.name?.localeCompare(a.name);
                    })
                    break;
                case 'total':
                    clone?.sort((a, b) => {
                        return order === 'asc' ? (a?.totalCount - b?.totalCount) : (b?.totalCount - a?.totalCount);
                    })
                    break;
            }
            setSubjects(clone)
        }
    }

    return (
        <div>
            {/* <SubHeader
                title={translations(locale).manager?.curriculum}
                locale={locale}
            /> */}
            <div className="m-portlet mt-2">
                <div className="m-portlet__body">
                    <div className={'ml-5 d-flex py-4'} style={{
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <label className='d-flex modal-label mr-4' style={{
                            fontWeight: 800,
                            fontFamily: 'PinnacleBold',
                            position: 'relative',
                            top: 5,
                        }}>
                            {translations(locale)?.grade}
                        </label>
                        <Dropdown
                            style={{width: 250}}
                            className='content-search-inputs'
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

                        <button
                            className='btn btn-sm m-btn--pill text-uppercase d-inline-flex align-content-center justify-content-center ml-4'
                            style={{backgroundColor: '#41c5dc', color: 'white', maxHeight: 32}}
                            onClick={() => {
                                if (selectedGrade) {
                                    loadData(selectedGrade)
                                } else {
                                    message(translations(locale)?.select_grade)
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
                selectedGrade && showResult && <>
                    {
                        isEdit
                            ?
                            <>
                                <button
                                    className='btn btn-sm btn-success m-btn--pill text-uppercase d-inline-flex align-content-center justify-content-center'
                                    onClick={submitSave}
                                >
                                    {translations(locale)?.save}
                                </button>
                                <button
                                    className='btn btn-link m-btn--custom'
                                    onClick={() => setIsEdit(false)}
                                >
                                    {translations(locale)?.back}
                                </button>
                            </>
                            :
                            <button
                                className='btn btn-sm btn-primary m-btn--pill text-uppercase d-inline-flex align-content-center justify-content-center'
                                style={{color: 'white', maxHeight: 32}}
                                onClick={() => {
                                    setIsEdit(true)
                                }}
                            >
                                <span>{translations(locale)?.edit}</span>
                            </button>
                    }

                    <div className="m-portlet mt-2">
                        <div className="m-portlet__body">
                            {
                                subjects && subjects?.length > 0 && <>
                                    <p>{
                                        // isEdit ? 
                                        translations(locale)?.manager?.curriculum_weekly_count_description
                                        //:  translations(locale)?.manager?.curriculum_weekly_count
                                        }
                                    </p>
                                    <table className={'table table-striped table-bordered table-custom react-bootstrap-table'} style={{width: '100%'}}>
                                        <thead style={{width: '100%'}}>
                                        <tr>
                                            <th rowSpan={2} width={50} className={'text-center'}>№</th>
                                            <th rowSpan={2} width={180} onClick={() => {
                                                onSortChange('code', sortOrder === 'desc' ? 'asc' : 'desc')
                                            }} className={'text-center td-clickable'}>{translations(locale)?.subject?.code}
                                                {
                                                    sortColumn === 'code'
                                                        ? (sortOrder === 'desc' ? <span class="caret-4-desc"/> :
                                                        <span class="caret-4-asc"/>)
                                                        : <span class="order-4"/>
                                                }
                                            </th>
                                            <th rowSpan={2} width={250} onClick={() => {
                                                onSortChange('name', sortOrder === 'desc' ? 'asc' : 'desc')
                                            }} className={'text-center td-clickable'}>{translations(locale)?.subject?.name}
                                                {
                                                    sortColumn === 'name'
                                                        ? (sortOrder === 'desc' ? <span class="caret-4-desc"/> :
                                                        <span class="caret-4-asc"/>)
                                                        : <span class="order-4"/>
                                                }
                                            </th>
                                            <th width={120} className={'text-center td-clickable'} onClick={() => {
                                                onSortChange('total', sortOrder === 'desc' ? 'asc' : 'desc')
                                            }} >{translations(locale)?.total}
                                                {
                                                    sortColumn === 'total'
                                                        ? (sortOrder === 'desc' ? <span class="caret-4-desc"/> :
                                                        <span class="caret-4-asc"/>)
                                                        : <span class="order-4"/>
                                                }
                                            </th>
                                            {
                                                seasons && seasons?.length > 0 && seasons?.map(seasonObj => {
                                                    return <th key={'th_1_' + seasonObj?.id} className={'text-center'}>{seasonObj?.name}</th>
                                                })
                                            }
                                        </tr>
                                        <tr>
                                            <th className={'text-right'}>{totalWeekCount}</th>
                                            {
                                                seasons && seasons?.length > 0 && seasons?.map(seasonObj => {
                                                    return <th className={'text-right'}
                                                        key={'th_2_' + seasonObj?.id}><span>{seasonObj?.weekCount || '-'}</span></th>
                                                })
                                            }
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {subjects?.map((subjectObj, i) => {
                                            return <tr key={'tbody_tr_' + subjectObj?.id}>
                                                <td className={'text-right'}>{i + 1}</td>
                                                <td>{subjectObj?.code}</td>
                                                <td>{subjectObj?.name}</td>
                                                <td style={{
                                                    backgroundColor: '#DFE2EA'
                                                }} className={'text-right'}>{subjectObj?.totalCount}</td>
                                                {
                                                    seasons && seasons?.map(seasonObj => {
                                                        return <td
                                                            className={'text-right'}
                                                            key={'tbody_s_' + subjectObj?.id + '_' + seasonObj?.id}>
                                                            {
                                                                isEdit
                                                                ?
                                                                    <input
                                                                        type="number"
                                                                        onWheel={(e) => e?.target?.blur()}
                                                                        autoFocus={true}
                                                                        min={0}
                                                                        step={1}
                                                                        className="form-control"
                                                                        value={seasonObj?.weeklyCount || subjectObj['season_' + seasonObj?.id]}
                                                                        onChange={(e) => {
                                                                            if (e?.target?.value) {
                                                                                if (parseInt(e?.target?.value) >= 0) {
                                                                                    onWeeklyCountChange(subjectObj?.id, seasonObj?.id, e?.target?.value)
                                                                                }
                                                                            } else {
                                                                                onWeeklyCountChange(subjectObj?.id, seasonObj?.id, null)
                                                                            }
                                                                        }}
                                                                        inputMode="numeric"
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter') {
                                                                            }
                                                                        }}
                                                                    />
                                                                    :
                                                                    <span>{subjectObj['season_' + seasonObj?.id] ?
                                                                        subjectObj['season_' + seasonObj?.id] : '-'}</span>
                                                            }
                                                        </td>
                                                    })
                                                }
                                            </tr>
                                        })}
                                        </tbody>
                                        <tfoot style={{
                                            backgroundColor: '#DFE2EA'
                                        }}>
                                            <tr>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th className={'text-right'}>{getTotalCount('all')}</th>
                                                {
                                                    seasons && seasons?.map(seasonObj => {
                                                        return <th key={'tfoot_' + seasonObj?.id}  className={'text-right'}>
                                                            {getTotalCount(seasonObj?.id)}
                                                        </th>
                                                    })
                                                }
                                            </tr>
                                        </tfoot>
                                    </table>
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

export default plan