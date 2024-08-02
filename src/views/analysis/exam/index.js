import { React, useState, useEffect } from 'react'
import message from 'modules/message'
import HtmlHead from 'components/html-head/HtmlHead'
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList'
import {Col, Row} from 'react-bootstrap'
import {Tab} from 'semantic-ui-react'
import {Link, useHistory} from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage'
import {fetchRequest} from 'utils/fetchRequest'
import {translations} from 'utils/translations'
import {analysisExamIndex, analysisExamExcel} from 'utils/fetchRequest/Urls'
import { NDropdown as Dropdown } from 'widgets/Dropdown'
import {queryUrl} from "utils/Util";

const localeSelectedTab = 'analysis_exam_tab';
const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const index = () => {
    const history = useHistory()

    const title = translations(locale)?.analysis?.exam?.title;
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "analysis/exam", text: title }
    ];

    const [loading, setLoading] = useState(false)
    const [selectedTabData, setSelectedTabData] = useState({
        index: 0
    })

    const urlParams = queryUrl(window.location.href);

    const [grades, setGrades] = useState([])
    const [seasons, setSeasons] = useState([])
    const [subjects, setSubjects] = useState([])
    const [seasonRows, setSeasonRows] = useState([])
    const [selectedGrade, setSelectedGrade] = useState(null)
    const [selectedSeason, setSelectedSeason] = useState(null)
    const [selectedSubject, setSelectedSubject] = useState(null)

    const [selectedSeasons, setSelectedSeasons] = useState([])
    const [selectedExamType, setSelectedExamType] = useState(null)
    const [examTypes, setExamTypes] = useState([])

    const init = (params) => {
        setLoading(true)
        // fetchRequest(analysisExamIndex, 'POST', params)
        //     .then((res) => {
        //         if (res.success) {
        //             if (params?.grade) {
        //                 if (params?.subject && params?.season) {
        //                     const cloneRows = [...seasonRows]
        //                     for (let r = 0; r < cloneRows?.length; r++) {
        //                         if (cloneRows[r].selectedSeason === res?.data?.season) {
        //                             cloneRows[r].exams = res?.data?.exams
        //                             break;
        //                         }
        //                     }
        //                     setSeasonRows(cloneRows)
        //                 } else {
        //                     setSubjects(res?.data?.subjects)
        //                 }
        //             } else {
        //                 setGrades(res?.data?.grades)
        //                 setSeasons(res?.data?.seasons)
        //                 setExamTypes(res?.data?.examTypes)
        //                 setSeasonRows([
        //                     {
        //                         selectedSeason: null,
        //                         selectedExams: [],
        //                         exams: []
        //                     }
        //                 ])
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

    useEffect(() => {
        if (urlParams && urlParams?.msg) {
            message(decodeURIComponent(urlParams?.msg))
        }
        // init({})
        // if (selectedTreeData) {
        //     init(selectedTreeData, selectedTabData, tableState)
        // } else {
        //     init()
        // }
    }, [])

    const onTabChange = tab => {
        setSelectedTabData(tab)
        secureLocalStorage?.setItem(localeSelectedTab, tab)
    }

    const onGradeChange = (e, data) => {
        setSelectedGrade(data?.value)
        if (data?.value) {
            init({
                grade: data?.value
            })
        }
        setSeasonRows([{
            selectedSeason: null,
            selectedExams: [],
            exams: []
        }])
    }

    const onSubjectChange = (e, data) => {
        setSelectedSubject(data?.value)
        setSeasonRows([{
            selectedSeason: null,
            selectedExams: [],
            exams: []
        }])
    }

    const onSeasonChange = (i, data) => {
        const cloneRows = [...seasonRows]
        for (let r = 0; r < cloneRows?.length; r++) {
            if (i === r) {
                cloneRows[r].selectedSeason = data?.value;
                break;
            }
        }
        if (data?.value) {
            init({
                grade: selectedGrade,
                subject: selectedSubject,
                season: data?.value
            })
        }
        setSeasonRows(cloneRows)
    }

    const onExamChange = (i, data) => {
        const cloneRows = [...seasonRows];
        for (let r = 0; r < cloneRows?.length; r++) {
            if (r === i) {
                cloneRows[r].selectedExams = data?.value;
                break;
            }
        }
        setSeasonRows(cloneRows)
    }

    const onAddSeason = () => {
        if (seasons?.length > seasonRows?.length) {
            const cloneRows = [...seasonRows];
            cloneRows.push({
                selectedSeason: null,
                selectedExam: null,
                exams: []
            })
            setSeasonRows(cloneRows)
        }
    }

    const onRemoveSeason = (i) => {
        const cloneRows = [...seasonRows];
        cloneRows.splice(i, 1);
        setSeasonRows(cloneRows)
    }

    const downloadExcel = () => {
        if (selectedTabData?.index === 0) {
            if (!selectedGrade) {
                message(translations(locale)?.select_grade)
                return;
            }
            if (!selectedSubject) {
                message(translations(locale)?.timetable?.select_subject)
                return;
            }
            if (seasonRows && seasonRows?.length > 0) {
                const seasonIds = [];
                let examIds = []
                for (let sr = 0; sr < seasonRows?.length; sr++) {
                    seasonIds.push(seasonRows[sr]?.selectedSeason)
                    examIds = examIds.concat(seasonRows[sr]?.selectedExams)
                }

                if (seasonIds && seasonIds?.length > 0) {
                    if (examIds && examIds?.length > 0) {
                        const gradeName = grades.find(obj => {
                            return obj?.key?.toString() === selectedGrade?.toString()
                        })?.title;
                        const subjectName = subjects.find(obj => {
                            return obj?.id?.toString() === selectedSubject?.toString()
                        })?.name
                        // const urlParams = new URLSearchParams({
                        //     grade: selectedGrade,
                        //     gradeName,
                        //     subject: selectedSubject,
                        //     subjectName,
                        //     exams: examIds,
                        //     seasons: seasonIds,
                        //     type: 'EXAM'
                        // }).toString();
                        // window.open('/' + analysisExamExcel + '?' + urlParams, '_blank');
                    } else {
                        message(translations(locale)?.err?.select_exam)
                    }
                } else {
                    message(translations(locale)?.err?.select_season)
                }
            } else {
                message(translations(locale)?.err?.select_season)
            }
        } else if (selectedTabData?.index === 1) {
            if (!selectedGrade) {
                message(translations(locale)?.select_grade)
                return;
            }
            if (!selectedSubject) {
                message(translations(locale)?.timetable?.select_subject)
                return;
            }
            if (!selectedExamType) {
                message(translations(locale)?.exam_template?.select_exam_type)
                return;
            }
            if (selectedSeasons && selectedSeasons?.length > 0) {
                const gradeName = grades.find(obj => {
                    return obj?.key?.toString() === selectedGrade?.toString()
                })?.title;
                const subjectName = subjects.find(obj => {
                    return obj?.id?.toString() === selectedSubject?.toString()
                })?.name

                // const urlParams = new URLSearchParams({
                //     grade: selectedGrade,
                //     gradeName,
                //     subject: selectedSubject,
                //     subjectName,
                //     examType: selectedExamType,
                //     seasons: selectedSeasons,
                //     type: 'EXAM_TYPE'
                // }).toString();
                // window.open('/' + analysisExamExcel + '?' + urlParams, '_blank');
            } else {
                message(translations(locale)?.err?.select_season)
            }
        }

    }

    const onExamTypeChange = (e, data) => {
        setSelectedExamType(data?.value)
    }

    const onExamTypeSeasonChange = (e, data) => {
        setSelectedSeasons(data?.value)
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
                        activeIndex={selectedTabData?.index}
                        renderActiveOnly
                        panes={[
                            {
                                index: 0,
                                menuItem: translations(locale)?.analysis?.exam?.title,
                                isPublish: 1,
                            },
                            {
                                index: 1,
                                menuItem: translations(locale)?.analysis?.exam?.examType,
                                isPublish: 0,
                            }
                        ]}
                        className='no-shadow'
                        menu={{secondary: true, pointing: true, className: 'primaryColor'}}
                        onTabChange={(e, data) => onTabChange(data?.panes[data?.activeIndex])}
                    />

                    <div className='m-portlet tab mt-4'>
                        <div className='m-portlet__body'>
                            {
                                selectedTabData?.index === 0 && <>
                                    {
                                        // seasonRows?.map((seasonRowObj, s) => {
                                            // return  key={'season_row_' + s}
                                            <Row > 
                                                <Col>
                                                    {
                                                        // s === 0 && 
                                                        <>
                                                            <span
                                                                className={"pinnacle-demi-bold"}>{translations(locale)?.class?.grade}</span>
                                                            <Dropdown
                                                                placeholder={'-' + translations(locale).select + '-' || ""}
                                                                fluid
                                                                selection
                                                                search={true}
                                                                additionPosition='bottom'
                                                                upward={false}
                                                                className={'mt-2'}
                                                                selectOnBlur={false}
                                                                value={selectedGrade}
                                                                options={grades.map(gradeObj => {
                                                                    return {
                                                                        value: gradeObj?.key,
                                                                        text: gradeObj?.title
                                                                    }
                                                                })}
                                                                onChange={onGradeChange}
                                                            />
                                                        </>
                                                    }
                                                </Col>
                                                <Col>
                                                    {
                                                        // s === 0 && 
                                                        <>
                                                            <span
                                                                className={"pinnacle-demi-bold"}>{translations(locale)?.subject?.title}</span>
                                                            <Dropdown
                                                                placeholder={'-' + translations(locale).select + '-' || ""}
                                                                fluid
                                                                selection
                                                                search={true}
                                                                additionPosition='bottom'
                                                                className={'mt-2'}
                                                                upward={false}
                                                                selectOnBlur={false}
                                                                value={selectedSubject}
                                                                options={subjects.map(subjectObj => {
                                                                    return {
                                                                        value: subjectObj?.id,
                                                                        text: subjectObj?.name
                                                                    }
                                                                })}
                                                                onChange={onSubjectChange}
                                                            />
                                                        </>
                                                    }
                                                </Col>
                                                <Col>
                                                    {
                                                        // s === 0 &&  key={'row_season_' + s}
                                                        <span
                                                            className={"pinnacle-demi-bold"}>{translations(locale)?.exam?.season}</span>
                                                    }
                                                    {/* <Row  className={'mt-2'}> */}
                                                        <Dropdown
                                                            placeholder={'-' + translations(locale).select + '-' || ""}
                                                            fluid
                                                            selection
                                                            search={true}
                                                            additionPosition='bottom'
                                                            className='mt-2'
                                                            upward={false}
                                                            selectOnBlur={false}
                                                            // value={seasonRowObj?.selectedSeason}
                                                            options={seasons}
                                                            // onChange={(e, data) => onSeasonChange(s, data)}
                                                        />
                                                    {/* </Row> */}
                                                    {
                                                        // seasons?.length > seasonRows?.length && 
                                                        <button
                                                            onClick={onAddSeason}
                                                            className="btn m-btn--pill btn-outline-secondary mt-3"
                                                        >
                                                            {translations(locale)?.analysis?.add_season}
                                                        </button>
                                                    }

                                                </Col>
                                                <Col>
                                                    {
                                                        // s === 0 && key={'row_season_' + s}
                                                        <span
                                                            className={"pinnacle-demi-bold"}>{translations(locale)?.exam?.title}</span>
                                                    }
                                                    <Row  className={'mt-2'}>
                                                        <Col>
                                                            <Dropdown
                                                                placeholder={'-' + translations(locale).select + '-' || ""}
                                                                fluid
                                                                selection
                                                                search={true}
                                                                additionPosition='bottom'
                                                                upward={false}
                                                                multiple={true}
                                                                selectOnBlur={false}
                                                                // value={seasonRowObj?.selectedExams}
                                                                // options={seasonRowObj?.exams}
                                                                // onChange={(e, data) => onExamChange(s, data)}
                                                            />
                                                        </Col>
                                                        <Col md={'auto'}>
                                                            {
                                                                // s > 0
                                                                //     ? 
                                                                <button
                                                                        // onClick={() => onRemoveSeason(s)}
                                                                        className="btn btn-danger m-btn m-btn--icon m-btn--icon-only m-btn--pill"
                                                                    >
                                                                        <i className="la la-remove"/>
                                                                    </button>
                                                                //     :
                                                                    // <button
                                                                    //     onClick={() => null}
                                                                    //     style={{visibility: 'hidden'}}
                                                                    //     className="btn btn-danger m-btn m-btn--icon m-btn--icon-only m-btn--pill"
                                                                    // >
                                                                    //     <i className="la la-remove"/>
                                                                    // </button>
                                                            }
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        // })
                                    }
                                </>
                            }

                            {
                                selectedTabData?.index === 1 && <Row>
                                    <Col>
                                        <span className={"pinnacle-demi-bold"}>{translations(locale)?.class?.grade}</span>
                                        <Dropdown
                                            placeholder={'-' + translations(locale).select + '-' || ""}
                                            fluid
                                            selection
                                            search={true}
                                            additionPosition='bottom'
                                            upward={false}
                                            className={'mt-2'}
                                            selectOnBlur={false}
                                            value={selectedGrade}
                                            options={grades.map(gradeObj => {
                                                return {
                                                    value: gradeObj?.key,
                                                    text: gradeObj?.title
                                                }
                                            })}
                                            onChange={onGradeChange}
                                        />
                                    </Col>
                                    <Col>
                                        <>
                                            <span
                                                className={"pinnacle-demi-bold"}>{translations(locale)?.subject?.title}</span>
                                            <Dropdown
                                                placeholder={'-' + translations(locale).select + '-' || ""}
                                                fluid
                                                selection
                                                search={true}
                                                additionPosition='bottom'
                                                className={'mt-2'}
                                                upward={false}
                                                selectOnBlur={false}
                                                value={selectedSubject}
                                                options={subjects.map(subjectObj => {
                                                    return {
                                                        value: subjectObj?.id,
                                                        text: subjectObj?.name
                                                    }
                                                })}
                                                onChange={onSubjectChange}
                                            />
                                        </>
                                    </Col>
                                    <Col>
                                        <span
                                            className={"pinnacle-demi-bold"}>{translations(locale)?.exam_template?.exam_type}</span>
                                        <Dropdown
                                            placeholder={'-' + translations(locale).select + '-' || ""}
                                            fluid
                                            selection
                                            search={true}
                                            className={'mt-2'}
                                            additionPosition='bottom'
                                            upward={false}
                                            selectOnBlur={false}
                                            value={selectedExamType}
                                            options={examTypes?.map(examTypeObj => {
                                                return {
                                                    value: examTypeObj?.id,
                                                    text: examTypeObj?.name
                                                }
                                            })}
                                            onChange={onExamTypeChange}
                                        />
                                    </Col>
                                    <Col>
                                        <span className={"pinnacle-demi-bold"}>{translations(locale)?.exam?.season}</span>
                                        <Dropdown
                                            placeholder={'-' + translations(locale).select + '-' || ""}
                                            fluid
                                            selection
                                            search={true}
                                            additionPosition='bottom'
                                            className={'mt-2'}
                                            upward={false}
                                            selectOnBlur={false}
                                            value={selectedSeasons}
                                            options={seasons}
                                            multiple={true}
                                            onChange={onExamTypeSeasonChange}
                                        />
                                    </Col>
                                </Row>
                            }
                        </div>
                        <div className="m-portlet__foot text-center">
                            <button
                                onClick={downloadExcel}
                                className="btn m-btn--pill btn-secondary m-btn--wide"
                            >
                                {translations(locale).download_excel}
                            </button>
                        </div>
                    </div>

                    {/*<div className='row'>*/}
                    {/*    <div className='col-3 pr-0'>*/}
                    {/*        <div className='m-portlet'>*/}
                    {/*            <div className='m-portlet__body'>*/}
                    {/*                <TreeView*/}
                    {/*                    defaultExpandAll*/}
                    {/*                    treeData={treeData}*/}
                    {/*                    selectedNodes={[selectedTreeData]}*/}
                    {/*                    onSelect={(key) => init(key?.[0], selectedTabData, tableState)}*/}
                    {/*                />*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*    <div className='col-9'>*/}

                    {/*    </div>*/}
                    {/*</div>*/}
                </div>

            
            {
                loading &&
                <>
                    <div className='loader-container'>
                        <svg className="splash-spinner" viewBox="0 0 50 50">
                            <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"/>
                        </svg>
                    </div>
                </>
            }        
        </div>
    )
}

export default index