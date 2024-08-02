import message from 'modules/message'
import React, { useState, useRef, useImperativeHandle, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { Col, Row } from 'react-bootstrap'
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from "react-i18next";
import { cloneDeep } from 'lodash'
import { NDropdown as Dropdown } from 'widgets/Dropdown'
import DTable from 'modules/DataTable/DTable'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const config = {
    showPagination: false,
    showAllData: true,
    defaultSort: [{
        dataField: 'esisClassName',
        order: 'asc'
    }]
}

const createEsisClass = ({ onClose, onSubmit }) => {
    
    const { t } = useTranslation();

    const [loading, setLoading] = useState(false)
    const [tableData, setTableData] = useState([
        {id: 123, eschoolClassId: 123123, esisGradeName: 9000000495636, esisClassCode: 9000000495636, esisClassName: "Б.Золсайхан", esisClassTeacher: "Базарсад", eschoolClassName: 90000004952636, eschoolTeacher: '', eschoolShift: '', eschoolScoreType: '', eschoolRoom: '', eschoolUserId: 123123123},
        {id: 232, eschoolClassId: 372432, esisGradeName: 9000000305129, esisClassCode: 9000000305129, esisClassName: "Д.Эрдэнэчимэг", esisClassTeacher: "Даржаа", eschoolClassName: 90000004956346, eschoolTeacher: '', eschoolShift: '', eschoolScoreType: '', eschoolRoom: '',},
        {id: 293,  esisGradeName: 9000000158302, esisClassCode: 9000000158302, esisClassName: "М.Сансармаа", esisClassTeacher: "Мухаршар", eschoolClassName: 90000004956326, eschoolTeacher: "Бааза", eschoolTeacher: '', eschoolShift: '', eschoolScoreType: '', eschoolRoom: '',}
    ])

    const [rooms, setRooms] = useState([{id: 1, value: '323', text: 'Room 1'}, {id: 12, value: '326', text: 'Room 2'}, {id: 13, value: '325', text: 'Room 3'}])
    const [teachers, setTeachers] = useState([{id: 15, value: '323', text: 'Teach 1'}, {id: 1243, value: '326', text: 'Teach 2'}, {id: 134, value: '325', text: 'Teach 3'}])
    const [scoreTypes, setScoreTypes] = useState([{id: 152, value: '3231', text: 'scoreTypes 1'}, {id: 1232, value: '3264', text: 'scoreTypes 2'}, {id: 1341, value: '32567', text: 'scoreTypes 3'}])
    const [shifts, setShifts] = useState([{id: 154, value: '32325', text: 'shifts 1'}, {id: 1235, value: '32615', text: 'shifts 2'}, {id: 1348, value: '32534', text: 'shifts 3'}])

    const [updated, setUpdated] = useState(false)

    const loadInit = () => {
        console.log('inputTable init')
        // setLoading(true)
        // fetchRequest(ESISClassOptions, 'POST')
        //     .then((res) => {
        //         if (res.success) {
        //             setRooms(res?.data?.rooms || [])
        //             setShifts(res?.data?.shifts || [])
        //             setTeachers(res?.data?.teachers || [])
        //             setScoreTypes(res?.data?.scoreTypes || [])

        //             setUpdated(true)

        //         } else {
        //             message(res.data.message)
        //         }
        //         setLoading(false)
        //     })
        //     .catch(() => {
        //         message(t('err.error_occurred'))
        //         setLoading(false)
        //     })
    }

    // useEffect(() => {
    //     setUpdated(false)
    //     loadInit()
    // }, [])

    // useEffect(() => {
    //     setTableData((cloneDeep(data) || []).map(obj => {
    //         return {
    //             ...obj,
    //             ...{eschoolClassName: obj?.eschoolClassName || obj?.esisClassName }
    //         }
    //     }))
    // }, [data])

    // useImperativeHandle(ref, () => ({
    //     submit() {
    //         onSubmit(JSON.stringify(tableData.filter(obj => {
    //             console.log('Obj', obj)
    //             return obj.eschoolClassName && obj.eschoolClassName.length > 0 && obj.eschoolTeacher && obj.eschoolShift
    //         })))
    //     }
    // }))

    const setColumns = () => {
        // console.log('>>>>>>>', teachers)
        return [
            {
                dataField: 'esisGradeName',
                text: t('esis.gradeName'),
                sort: true
            },
            {
                dataField: 'esisClassCode',
                text: t('esis.classCode'),
                sort: true
            },
            {
                dataField: 'esisClassName',
                text: t('esis.className'),
                sort: true,
            },
            {
                dataField: 'esisClassTeacher',
                text: t('esis.classTeacher'),
                sort: true
            },
            {
                dataField: 'eschoolClassName',
                text: t('esis.eschoolClassName'),
                style: { padding: 2 },
                formatter: (cell, row) =>
                    <input
                        autoFocus
                        type='text'
                        value={cell || ''}
                        className='form-control'
                        style={{fontSize: '15px'}}
                        onChange={(e) => handleChange(row?.id, 'eschoolClassName', e?.target?.value)}
                    />
            },
            {
                dataField: 'eschoolTeacher',
                text: t('esis.classTeacher'),
                style: { padding: 2 },
                formatter: (cell, row) =>
                    <div>
                        <Dropdown
                            fluid
                            clearable
                            selection
                            search
                            value={cell}
                            selectOnBlur={false}
                            closeOnChange
                            options={teachers || []}
                            placeholder={'-' + t('select') + '-'}
                            onChange={(e, data) => handleChange(row?.id, 'eschoolTeacher', data?.value)}
                        />
                    </div>
            },
            {
                dataField: 'eschoolShift',
                text: t('school_shift'),
                style: { padding: 2 },
                formatter: (cell, row) =>
                    <Dropdown
                        fluid
                        clearable
                        selection
                        search
                        value={cell}
                        selectOnBlur={false}
                        closeOnChange
                        options={shifts || []}
                        placeholder={'-' + t('select') + '-'}
                        onChange={(e, data) => handleChange(row?.id, 'eschoolShift', data?.value)}
                    />
            },
            {
                dataField: 'eschoolScoreType',
                text: t('group.score_type'),
                style: { padding: 2 },
                formatter: (cell, row) =>
                    <Dropdown
                        fluid
                        clearable
                        selection
                        search
                        value={cell}
                        selectOnBlur={false}
                        closeOnChange
                        options={scoreTypes || []}
                        placeholder={'-' + t('select') + '-'}
                        onChange={(e, data) => handleChange(row?.id, 'eschoolScoreType', data?.value,e)}
                    />
            },
            {
                dataField: 'eschoolRoom',
                text: t('group.classroom'),
                style: { padding: 2 },
                formatter: (cell, row) =>
                    <Dropdown
                        fluid
                        clearable
                        selection
                        search
                        selectOnBlur={false}
                        value={cell}
                        closeOnChange
                        options={rooms || []}
                        placeholder={'-' + t('select') + '-'}
                        onChange={(e, data) => handleChange(row?.id, 'eschoolRoom', data?.value)}
                    />
            },
        ]
    }

    const handleChange = (id, name, value) => {
        const clone = [...tableData]
        const employee = clone?.find(el => el?.id == id)
        employee[name] = value
        setTableData(clone)
    }

    return (
        <Modal
            centered
            show={true}
            onHide={onClose}
            size='xxl'
            dimmer='blurring'
            aria-labelledby="contained-modal-title-vcenter"
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('esis.createClass')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <DTable
                    config={config}
                    locale={locale}
                    data={tableData}
                    columns={setColumns()}
                    wrapperClassName='overflowXVisible white-space-unset'
                />
                {/* {
                    updated && <DTable
                        config={config}
                        locale={locale}
                        data={tableData}
                        columns={setColumns()}
                        wrapperClassName='overflowXVisible'
                    />
                } */}
            </Modal.Body>
            <Modal.Footer className="text-center">
                <button
                    className="btn m-btn--pill btn-link m-btn m-btn--custom"
                    onClick={onClose}
                >
                    {t('back')}
                </button>
                <button
                    className="btn m-btn--pill btn-success m-btn--wide"
                    onClick={onSubmit}
                >
                    {t('save').toUpperCase()}
                </button>
            </Modal.Footer>
            {
                loading &&
                <>
                    <div className='blockUI blockOverlay' />
                    <div className='blockUI blockMsg blockPage'>
                        <div className='m-loader m-loader--brand m-loader--lg' />
                    </div>
                </>
            }
        </Modal>
    )
}

export default createEsisClass