import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";

import { MENU_BEHAVIOUR, MENU_PLACEMENT } from "constants.js";
import NavUserMenu from "./NavUserMenu";
import NavIconMenu from "./NavIconMenu";
import StudentInfoMenu from "./StudentInfoMenu";
import StudentIconMenu from "./StudentIconMenu";
import SchoolMenu from "./main-menu/SchoolMenu"
import MainMenu from "./main-menu/MainMenu";
import NavLogo from "./NavLogo";
import NavMobileButtons from "./NavMobileButtons";
import {
    menuChangeAttrMenuAnimate,
    menuChangeCollapseAll,
} from "./main-menu/menuSlice";
import School from "./School";
import { useWindowSize } from "hooks/useWindowSize";

const DELAY = 80;

const Nav = () => {
    const dispatch = useDispatch();
    const { height, width } = useWindowSize()
    const {
        navClasses,
        placementStatus,
        behaviourStatus,
        attrMobile,
        menuPadding,
    } = useSelector((state) => state.menu);
    const { isStudent, isOrganizationUser } = useSelector(state => state.person)
    const mouseActionTimer = useRef(null);

    // Vertical menu semihidden state showing
    // Only works when the vertical menu is active and mobile menu closed
    const onMouseEnterDelay = () => {
        if (
            placementStatus.placementHtmlData === MENU_PLACEMENT.Vertical &&
            behaviourStatus.behaviourHtmlData === MENU_BEHAVIOUR.Unpinned &&
            attrMobile !== true
        ) {
            dispatch(menuChangeCollapseAll(false));
            dispatch(menuChangeAttrMenuAnimate("show"));
        }
    };

    // Delayed one that hides or shows the menu. It's required to prevent collapse animation getting stucked
    const onMouseEnter = () => {
        if (mouseActionTimer.current) clearTimeout(mouseActionTimer.current);

        mouseActionTimer.current = setTimeout(() => {
            onMouseEnterDelay();
        }, DELAY);
    };
    // Vertical menu semihidden state hiding
    // Only works when the vertical menu is active and mobile menu closed
    const onMouseLeaveDelay = () => {
        if (
            placementStatus.placementHtmlData === MENU_PLACEMENT.Vertical &&
            behaviourStatus.behaviourHtmlData === MENU_BEHAVIOUR.Unpinned &&
            attrMobile !== true
        ) {
            dispatch(menuChangeCollapseAll(true));
            dispatch(menuChangeAttrMenuAnimate("hidden"));
        }
    };

    const onMouseLeave = () => {
        if (mouseActionTimer.current) clearTimeout(mouseActionTimer.current);
        mouseActionTimer.current = setTimeout(() => {
            onMouseLeaveDelay();
        }, DELAY);
    };

    return (
        <div
            id="nav"
            className={isOrganizationUser ? classNames("nav-container d-flex", navClasses) : (isStudent ? classNames("nav-container d-flex nav-student", navClasses) : classNames("nav-container d-flex", navClasses))}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div
                className="nav-content d-flex"
                style={
                    placementStatus.placementHtmlData === MENU_PLACEMENT.Horizontal &&
                        menuPadding
                        ? { paddingRight: menuPadding }
                        : {}
                }
            >
                <NavLogo />
                <NavUserMenu />
                <NavIconMenu />
                {/* <SchoolMenu/> */}
                <MainMenu />
                {
                    !isOrganizationUser && isStudent &&
                    <StudentInfoMenu />
                }
                {
                    !isOrganizationUser && isStudent &&
                    <StudentIconMenu />
                }
                {
                    width < 992 &&
                    <NavMobileButtons />

                }
            </div>
            <div className="nav-shadow" />
        </div>
    );
};
export default React.memo(Nav);
