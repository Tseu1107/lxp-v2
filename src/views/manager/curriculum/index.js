import React, {useEffect, useState} from "react";
import {translations} from "utils/translations";
import {Row, Col} from 'react-bootstrap'
// import SubHeader from "Src/SubHeader";
import secureLocalStorage from "react-secure-storage";
import YearStructure from './pages/yearStructure'
import Plan from './pages/plan'
import Progress from './pages/progress'
import {Tab} from "semantic-ui-react";
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import { useTranslation } from "react-i18next";

const locale = secureLocalStorage?.getItem('selectedLang') || 'mn'

const index = () => {

    const { t } = useTranslation()
    const [selectedPage, setSelectedPage] = useState('PROGRESS');

    const title = t('manager.curriculum');
    const description = "E-learning";
    const breadcrumbs = [
        { to: "", text: "Home" },
        { to: "school/teacher", text: title }
    ];

    const renderPage = () => {
        switch (selectedPage) {
            case 'PROGRESS':
                return <Progress/>
            case 'PLAN':
                return <Plan/>
            case 'STRUCTURE':
                return <YearStructure/>
            default:
                return <Progress/>
        }
    }

    return (
        <div className="m-grid__item m-grid__item--fluid m-wrapper mt-2">

            <HtmlHead title={title} description={description} />

            <div className="page-title-container mb-2">
                <Col md="7" className='p-0'>
                    <h1 className="mb-0 pb-0 display-4 relative">{title}</h1>
                    <BreadcrumbList items={breadcrumbs} />
                </Col>
            </div>

            <Tab
                renderActiveOnly
                menu={{
                    fluid: true,
                    vertical: true,
                    className: 'vertical-tab col-3',
                    tabular: false,
                    attached: true,
                    borderless: true
                }}
                panes={
                    [
                        {
                            menuItem: translations(locale).manager.teacher_progress,
                            render: () => <Progress locale={locale}/>
                        },
                        {
                            menuItem: translations(locale).manager.curriculum,
                            render: () => <Plan locale={locale}/>
                        },
                        {
                            menuItem: translations(locale).manager.year_structure,
                            render: () => <YearStructure locale={locale}/>
                        }
                    ]
                }
                grid={{paneWidth: 13, tabWidth: 3}}
            />
        </div>
    )
}

export default index