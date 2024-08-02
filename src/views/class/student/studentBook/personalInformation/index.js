import React, { useState } from 'react'
import { Tab } from 'semantic-ui-react'
import { Row, Col } from 'react-bootstrap'
import secureLocalStorage from 'react-secure-storage'
import { useTranslation } from "react-i18next";
import SelfInformation from './components/selfInformation'
import ContactPersons from './components/contactPersons'
import ParentsInformation from './components/parentsInformation'

const index = ({ student, refresh, countries = [] }) => {
    const locale = "mn"
    const { t } = useTranslation();

    const [selectedType, setSelectedType] = useState('SELF_INFORMATION')

    const renderContent = () => {
        switch (selectedType) {
            case 'SELF_INFORMATION':
                return <SelfInformation student={student} refresh={refresh} countries={countries}/>
            case 'CONTACT':
                return <ContactPersons student={student} />
            case 'RELATION':
                return <ParentsInformation student={student} />
            default:
                return null
        }
    }

    return (
        <div className='m-portlet__body'>
            <Row>
                <Col md={2}>
                    <div className='unattached-tab'>
                        <div className={selectedType === 'SELF_INFORMATION' ? "m-portlet br-12 item active" : "m-portlet br-12 item"} style={{
                            cursor: 'pointer',
                            textTransform: 'none'
                        }}
                            onClick={() => {
                                setSelectedType('SELF_INFORMATION')
                            }}>
                            <div className="m-portlet__body font-pinnacle bolder" style={{
                                color: selectedType === 'SELF_INFORMATION' ? 'white' : '#ff5b1d'
                            }}>
                                <span>{t('studentBookNavs.self_info')}</span>
                            </div>
                        </div>
                        <div className={selectedType === 'CONTACT' ? "m-portlet br-12 item active" : "m-portlet br-12 item"} style={{
                            cursor: 'pointer',
                            textTransform: 'none'
                        }}
                            onClick={() => {
                                setSelectedType('CONTACT')
                            }}>
                            <div className="m-portlet__body font-pinnacle bolder" style={{
                                color: selectedType === 'CONTACT' ? 'white' : '#ff5b1d'
                            }}>
                                <span>{t('studentBookNavs.contact')}</span>
                            </div>
                        </div>
                        <div className={selectedType === 'RELATION' ? "m-portlet br-12 item active" : "m-portlet br-12 item"} style={{
                            cursor: 'pointer',
                            textTransform: 'none'
                        }}
                            onClick={() => {
                                setSelectedType('RELATION')
                            }}>
                            <div className="m-portlet__body font-pinnacle bolder" style={{
                                color: selectedType === 'RELATION' ? 'white' : '#ff5b1d'
                            }}>
                                <span>{t('studentBookNavs.relation')}</span>
                            </div>
                        </div>
                    </div>
                </Col>

                <Col md={10}>
                    {
                        renderContent()
                    }
                </Col>
            </Row>
        </div>

    )
}

export default index