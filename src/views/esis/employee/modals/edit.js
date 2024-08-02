import message from 'modules/message'
import { Col, Row, Modal } from 'react-bootstrap'
import Checkbox from '@mui/material/Checkbox'
// import { ESISEmployeeLink } from 'utils/fetchRequest/Urls'
import React, { useEffect, useState } from 'react'
import secureLocalStorage from 'react-secure-storage'
import { fetchRequest } from 'utils/fetchRequest'
import DTable from 'modules/DataTable/DTable'
import { useTranslation } from 'react-i18next'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'
const localTableState = 'esis_employee_table_state'

const edit = ({ onClose, onSubmit, esisUser }) => {

    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)
    const [totalDataSize, setTotalDataSize] = useState(0)
    const [checkChecked, setCheckChecked] = useState(false)
    const [checkedCell, setCheckedCell] = useState(null)
    const [tableState, setTableState] = useState(secureLocalStorage.getItem(localTableState) ||
    {
        page: 1,
        pageSize: 10,
        search: ''
    })
    
    const [tableData, setTableData] = useState([
        {id: "8295", firstName: "Тулга", lastName: "Чулуунсүх", birthday: "2023-01-09", code: "1938", checked: false},
        {id: "17", firstName: "Мэргэнсанаа", lastName: "Энхтөр", birthday: null, code: "1829", checked: false},
    ])
    const [filteredTableData, setFilteredTableData] = useState([
        {id: "8295", firstName: "Тулга", lastName: "Чулуунсүх", birthday: "2023-01-09", code: "1938", checked: true},
        {id: "17", firstName: "Мэргэнсанаа", lastName: "Энхтөр", birthday: null, code: "1829", checked: false},
    ])

    const config = {
        showPagination: false,
        defaultSort: [{
            dataField: 'esisFirstName',
            order: 'asc'
        }],
        defaultPageOptions: {
            page: tableState?.page || 1,
            sizePerPage: tableState?.pageSize || 10,
            search: tableState?.search || '',
        }
    }

    // useEffect(() => {
    //     setLoading(true)
    //     fetchRequest(ESISEmployeeLink, 'POST')
    //         .then(res => {
    //             if (res.success) {
    //                 const { employees } = res.data
    //                 setTableData(employees || [])
    //                 setFilteredTableData(employees || [])
    //             } else {
    //                 message(res.data.message)
    //             }
    //             setLoading(false)
    //         })
    //         .catch(() => {
    //             message(t('err.error_occurred'))
    //             setLoading(false)
    //         })
    // }, [])

    const handleCheckboxChange = (data, checked) => {
        setCheckedCell(data)
        const clone = [...tableData]
        clone?.forEach(el => {
            if (el?.id == data.id){
                el.checked = checked
            }
            else
                el.checked = false
        })
        setTableData(clone)
    }

    const handleSubmit = () => {
        const employees = tableData?.filter(el => el?.checked == true)
        if (!employees?.length)
            return message(t('esis.selectTeacherStaff'))
        if (employees?.length > 1)
            return message(t('esis.selectOnlyOneTeacherStaff'))
        onSubmit({ esisPersonId: esisUser?.id, eschoolUserId: employees?.[0]?.id })
    }

    const handleSearch = keyword => {
        if (keyword)
            setFilteredTableData(tableData?.filter(employee =>
                employee?.firstName?.toLowerCase()?.includes(keyword)
            ) || [])
        else
            setFilteredTableData(tableData || [])
    }

    const columns = [
        {
            dataField: 'checked',
            text: '',
            align: 'center',
            formatter: (cell, row) => {
                return (
                    <Checkbox
                        checked={cell || false}
                        style={{color: '#ff5b1d'}}
                        onChange={(e) => handleCheckboxChange(row, e?.target?.checked)}
                    />
                );
            },
        },
        {
            dataField: 'code',
            text: t('code'),
            sort: true
        },
        {
            dataField: 'lastName',
            text: t('last_name'),
            sort: true
        },
        {
            dataField: 'firstName',
            text: t('first_name'),
            sort: true
        },
        {
            dataField: 'birthday',
            text: t('studentBook.birth_day'),
            sort: true
        },
        {
            dataField: 'workRole',
            text: t('studentBook.work_role'),
            sort: true
        },
    ]

    return (
        <Modal
            centered
            show={true}
            onHide={onClose}
            size='lg'
            dimmer='blurring'
            aria-labelledby="contained-modal-title-vcenter"
        >
            <Modal.Header closeButton style={{padding: '1rem'}}>
                <Modal.Title className="modal-title d-flex flex-row justify-content-between w-100">
                    {t('esis.linkTeacherStaff')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='br-20 border-orange p-3 text-grey'>
                    <Row>
                        <Col className='text-right pr-2'>{t('esis.shortName')}</Col>
                        <Col className='pl-2'>{esisUser?.esisShortName || '-'}</Col>
                    </Row>
                    <Row>
                        <Col className='text-right pr-2'>{t('studentBook.parent_name')}</Col>
                        <Col className='pl-2'>{esisUser?.esisLastName || '-'}</Col>
                    </Row>
                    <Row>
                        <Col className='text-right pr-2'>{t('studentBook.name')}</Col>
                        <Col className='pl-2'>{esisUser?.esisFirstName || '-'}</Col>
                    </Row>
                    <Row>
                        <Col className='text-right pr-2'>{t('studentBook.birth_day')}</Col>
                        <Col className='pl-2'>{esisUser?.esisBirthDay || '-'}</Col>
                    </Row>
                </div>
                <div className='br-20 border-orange p-3 mt-2'>
                    {/* <div className='d-flex justify-content-end mb-2'>
                        <input
                            type='text'
                            style={{ width: '15rem' }}
                            className='form-control br-08'
                            placeholder={t('action.search')}
                            onChange={(e) => handleSearch(e?.target?.value?.toLowerCase())}
                        />
                    </div> */}
                    <DTable
                        remote
                        config={config}
                        locale={locale}
                        data={tableData}
                        columns={columns}
                        totalDataSize={totalDataSize}
                    />
                    {/* <table className='table table-bordered react-bootstrap-table'>
                        <thead>
                            <tr>
                                <th>№</th>
                                <th></th>
                                <th>{t('code')}</th>
                                <th>{t('last_name')}</th>
                                <th>{t('first_name')}</th>
                                <th>{t('studentBook.birth_day')}</th>
                                <th>{t('studentBook.work_role')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredTableData?.length > 0
                                    ? filteredTableData?.map((el, key) =>
                                        <tr key={key}>
                                            <th>{key + 1}</th>
                                            <th>
                                                <Checkbox
                                                    checked={el?.checked || false}
                                                    onChange={(e) => handleCheckboxChange(el?.id, e?.target?.checked)}
                                                />
                                            </th>
                                            <th>{el?.code}</th>
                                            <th>{el?.lastName}</th>
                                            <th>{el?.firstName}</th>
                                            <th>{el?.birthday}</th>
                                            <th>{el?.title}</th>
                                        </tr>
                                    )
                                    : <tr><th colSpan={7} className='text-center'>{t('action.emptyTable')}</th></tr>
                            }
                        </tbody>

                    </table> */}
                </div>
            </Modal.Body>
            <Modal.Footer className="text-center">
                <button
                    className='btn m-btn--pill btn-link m-btn m-btn--custom'
                    onClick={onClose}
                >
                    {t('close')}
                </button>
                <button
                    className='btn m-btn--pill btn-success m-btn--wide'
                    onClick={handleSubmit}
                >
                    {t('connect').toUpperCase()}
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

export default edit