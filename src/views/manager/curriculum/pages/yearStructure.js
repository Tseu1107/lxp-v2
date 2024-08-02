import React, {useEffect, useState, useRef} from "react";
import {translations} from "utils/translations";
import {Row, Col} from 'react-bootstrap'
// import SubHeader from "Src/SubHeader";
import secureLocalStorage from "react-secure-storage";
// import {fetchRequest} from "utils/fetchRequest";
// import {managerCurriculumIndex, managerCurriculumEdit, managerCurriculumDelete} from "utils/fetchRequest/Urls";
import message from "modules/message";
import DTable from "modules/DataTable/DTable";

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'

const yearStructure = () => {

    const tableRef = useRef(null)

    const [loading, setLoading] = useState(false)
    const [seasons, setSeasons] = useState([])
    const [updateView, setUpdateView] = useState(false)

    const config = {
        showFilter: false,
        showAllData: true,
        showPagination: false
    };

    const onRowEdit = (rowId, isEditing = false) => {

        // const seasonList = tableRef?.current?.getCurrentDatas();
        const seasonList = [...seasons]

        for (let s = 0; s < seasonList?.length; s++) {
            if (seasonList[s]?.id === rowId) {
                seasonList[s].isEdit = isEditing;
                break;
            }
        }
        setSeasons(seasonList)
        setUpdateView(!updateView)
        tableRef?.current?.updateDatas(seasonList)
    }

    const onWeekCountChange = (rowId, value) => {
        const list = tableRef?.current?.getCurrentDatas();
        for (let s = 0; s < list?.length; s++) {
            if (list[s]?.id === rowId) {
                list[s].weekCount = value;
                break;
            }
        }
        setSeasons(list)
    }

    const onSubmitEdit = (row) => {
        console.log('onSubmitEdit')
        // setLoading(true)
        // fetchRequest(managerCurriculumEdit, 'POST', {
        //     id: row?.id,
        //     week: row?.weekCount
        // })
        //     .then((res) => {
        //         if (res?.success) {
        //             const list = res?.data?.seasons;
        //             const seasonList = tableRef?.current?.getCurrentDatas();
        //             for (let c = 0; c < list?.length; c++) {
        //                 if (list[c]?.id?.toString() === row?.id?.toString()) {
        //                     list[c].isEdit = false;
        //                 } else {
        //                     list[c].isEdit = seasonList.find(obj => obj?.id?.toString() === list[c]?.id?.toString())?.isEdit;
        //                 }
        //             }
        //             setSeasons(list)
        //             setUpdateView(!updateView)
        //             tableRef?.current?.updateDatas(list)
        //             message(res?.data?.message, true)
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

    const onSubmitDelete = (rowId) => {
        console.log('onSubmitDelete')
        // setLoading(true)
        // fetchRequest(managerCurriculumDelete, 'POST', {
        //     id: rowId
        // })
        //     .then((res) => {
        //         if (res?.success) {
        //             const list = res?.data?.seasons;
        //             const clone = tableRef?.current?.getCurrentDatas();
        //             for (let c = 0; c < list?.length; c++) {
        //                 if (list[c]?.id === rowId) {
        //                     list[c].isEdit = false;
        //                 } else {
        //                     list[c].isEdit = clone.find(obj => obj?.id === list[c]?.id)?.isEdit;
        //                 }
        //             }
        //             setSeasons(list)
        //             tableRef?.current?.updateDatas(list)
        //             message(res?.data?.message, true)
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

    const columns =  [
        {
            dataField: 'name',
            text: translations(locale)?.season,
            sort: true,
            headerStyle: () => {
                return {
                    width: '50%',
                };
            },
        },
        {
            dataField: 'weekCount',
            text: translations(locale)?.manager?.season_week_count,
            sort: true,
            colType: 'html',
            style: {
                textAlign: 'right',
            },
            headerStyle: () => {
                return {
                    width: '30%',
                };
            },
            formatter: (cell, row) => {
                if (row?.isEdit) {
                    return <input
                            type="number"
                            onWheel={(e) => e?.target?.blur()}
                            min={0}
                            step={1}
                            autoFocus={true}
                            className="form-control"
                            value={row?.weekCount || ''}
                            onChange={(e) => {
                                if (e?.target?.value) {
                                    if (parseInt(e?.target?.value) >= 0) {
                                        onWeekCountChange(row?.id, e?.target?.value)
                                    }
                                } else {
                                    onWeekCountChange(row?.id, null)
                                }
                            }}
                            inputMode="numeric"
                            onKeyDown={(e) => {
                                if(e.key === 'Enter'){
                                    onSubmitEdit(row, seasons)
                                }
                            }}
                        />
                } else {
                    return <span>{cell}</span>
                }
            }
        },
        {
            dataField: '',
            text: "",
            sort: false,
            colType: 'html',
            headerStyle: () => {
                return {
                    width: '20%',
                };
            },
            formatter: (cell, row) => {
                if (row?.isEdit) {
                    return <div style={{display: 'flex', alignItems: 'center'}}>
                        <button
                            className='btn btn-success m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-flex text-white align-items-center justify-content-center'
                            onClick={() => {
                                onSubmitEdit(row)
                            }}
                        >
                            <CheckIcon style={{color: 'white'}}/>
                        </button>
                        <button
                            className='btn btn-danger m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-flex text-white align-items-center justify-content-center ml-2'
                            onClick={() => {
                                onRowEdit(row?.id, false)
                            }}
                        >
                            <ClearIcon />
                        </button>
                    </div>
                } else {
                    return <div style={{display: 'flex'}}>
                        <button
                            className='btn btn-primary m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-flex text-white align-items-center justify-content-center'
                            onClick={() => {
                                onRowEdit(row?.id, true)
                            }}
                        >
                            <i className="flaticon-edit" />
                        </button>
                        <button
                            className='btn btn-danger m-btn--icon btn-sm m-btn--icon-only m-btn--pill d-flex text-white align-items-center justify-content-center ml-2'
                            onClick={() => {
                                onSubmitDelete(row?.id)
                            }}
                        >
                            <i className='fa flaticon-delete' />
                        </button>
                    </div>
                }
            }
        },
    ]

    // const loadData = () => {
    //     console.log('loadDat')
    //     setLoading(true)
    //     fetchRequest(managerCurriculumIndex, 'POST', {})
    //         .then((res) => {
    //             if (res?.success) {
    //                 setSeasons(res?.data?.seasons || [])
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
                message: "Амжилттай"
            },
            success: true
        }
        setSeasons(res?.data?.seasons || [])
    }

    useEffect(() => {
        loadData();
    }, [])

    return (
        <div>
            {/* <SubHeader
                title={translations(locale).manager?.year_structure}
                links={[{
                    name: translations(locale).manager.curriculum,
                    to: '/manager/curriculum',
                }]}
                locale={locale}
            /> */}
            <div className="m-portlet mt-2">
                <div className="m-portlet__body">
                    <DTable
                        ref={tableRef}
                        locale={locale}
                        columns={columns}
                        data={seasons}
                        config={config}
                        selectMode={'radio'}
                    />

                </div>
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

export default yearStructure