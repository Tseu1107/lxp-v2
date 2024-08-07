import React, { useEffect, useState, memo, forwardRef, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import classNames from "classnames";
import { Collapse, Dropdown } from "react-bootstrap";
import { DEFAULT_SETTINGS, USE_MULTI_LANGUAGE } from "config.js";
import { MENU_PLACEMENT } from "constants.js";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import { layoutShowingNavMenu } from "layout/layoutSlice";
import { useTranslation } from "react-i18next";
import { menuChangeCollapseAll } from "./menuSlice";
import { ClickAwayListener } from "@material-ui/core";


const HorizontalMenuDropdownToggle = memo(
  forwardRef(({ children, onClick, href = "#", active = false }, ref) => (
    <a
      ref={ref}
      className={classNames("dropdown-toggle", { active })}
      data-toggle="dropdown"
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </a>
  ))
);

const MainMenuItem = memo(
  ({
    active,
    onClick,
    item,
    id,
    isSubItem = false,
    menuPlacement = DEFAULT_SETTINGS.MENU_PLACEMENT,
  }) => {
    const dispatch = useDispatch();
    const dropdownMenuRef = useRef();
    const { collapseAll } = useSelector((state) => state.menu);
    const { showingNavMenu } = useSelector((state) => state.layout);
    const { pathname } = useLocation();
    const isActive = item.path.startsWith("#")
      ? false
      : pathname === item.path || pathname.indexOf(`${item.path}/`) > -1;
    const { t } = useTranslation();
    const [verticalMenuCollapseExpanded, setVerticalMenuCollapseExpanded] =
      useState(isActive);
    const [horizontalDropdownIsOpen, setHorizontalDropdownIsOpen] =
      useState(false);
      // console.log(item.path, isActive)

    const getLabel = (icon, label) => (
      <div style={{display: 'flex', alignItems: 'center'}}>
        <div>
        {icon && (
          <>
            <CsLineIcons icon={icon} viewBox="0 0 23 23" size={23} className="cs-icon icon" />{" "}
          </>
        )}
        </div>
        <div className="nav-item-important" style={{width: '70%'}}>
          <span className="label">{USE_MULTI_LANGUAGE ? t(label) : label}</span>
        </div>
      </div>
    );

    const onToggleItem = (isOpen) => {
      setHorizontalDropdownIsOpen(isOpen);
    };

    const [activeIndex, setActiveIndex] = useState("0")
    const [mainMenuActive, setMainMenuActive] = useState(false)
    const onVerticalMenuCollapseClick = (e, index) => {
      e.preventDefault();
      e.stopPropagation();
      if (activeIndex === index) {
        setMainMenuActive(false)
      } else {
        setMainMenuActive(true)
      }

      setActiveIndex(activeIndex === index ? null : index);
      setVerticalMenuCollapseExpanded(!verticalMenuCollapseExpanded);
      dispatch(menuChangeCollapseAll(false));
    };

    const onHorizontalMenuDropdownToggleClick = () => {
      onToggleItem(!horizontalDropdownIsOpen);
      dispatch(layoutShowingNavMenu(""));
    };


    // init navigation menus
    useEffect(() => {
      if (showingNavMenu !== "" && horizontalDropdownIsOpen) {
        onToggleItem(false);
      }
    }, [showingNavMenu, horizontalDropdownIsOpen]);

    if (
      item.subs &&
      menuPlacement === MENU_PLACEMENT.Horizontal &&
      !item.megaParent
    ) {
      return (
        <Dropdown
          as="li"
          key={id}
          onToggle={onToggleItem}
          className={classNames({ mega: item.mega })}
          show={horizontalDropdownIsOpen}
        >
          <Dropdown.Toggle
            as={HorizontalMenuDropdownToggle}
            onClick={onHorizontalMenuDropdownToggleClick}
            href={item.path}
            active={isActive}
          >
            {getLabel(item.icon, item.label)}
          </Dropdown.Toggle>
          <Dropdown.Menu
            ref={dropdownMenuRef}
            renderOnMount
            as="ul"
            align="left"
            className={classNames("opacityIn", {
              "row align-items-start": item.mega,
              [`row-cols-${item.subs.length}`]: item.mega,
            })}
            popperConfig={{
              strategy: item.mega ? "fixed" : "absolute",
              modifiers: [
                {
                  name: "computeStyles",
                  options: {
                    gpuAcceleration: true, // true by default
                    adaptive: false,
                    roundOffsets: ({ x, y }) => {
                      if (item.mega) {
                        try {
                          return {
                            x: Math.round(
                              (window.innerWidth -
                                dropdownMenuRef.current.clientWidth) /
                                2 -
                                8
                            ),
                            y: y + 7,
                          };
                        } catch (e) {
                          console.warn("error:", e);
                        }
                      }
                      if (isSubItem) {
                        return { x, y: y - 34 };
                      }
                      return { x, y: y + 2 };
                    },
                  },
                },
              ],
            }}
          >
            <MainMenuItems
              menuItems={item.subs}
              menuPlacement={menuPlacement}
              isSubItem
            />
          </Dropdown.Menu>
        </Dropdown>
      );
    }
    if (item.subs && menuPlacement === MENU_PLACEMENT.Horizontal) {
      return (
        <li className="dropdown col d-flex flex-column">
          <NavLink
            to={item.path}
            className={classNames("dropdown-toggle", { active: isActive })}
          >
            {getLabel(item.icon, item.label)}
          </NavLink>
          <ul>
            <MainMenuItems
              menuItems={item.subs}
              menuPlacement={menuPlacement}
              isSubItem
            />
          </ul>
        </li>
      );
    }
    if (item.subs && menuPlacement === MENU_PLACEMENT.Vertical) {
      return (
        <li>
          <a
            href={item.path}
            data-bs-toggle="collapse"
            id = {id}
            role="button"
            aria-expanded={!collapseAll && mainMenuActive}
            onClick={(e) => onVerticalMenuCollapseClick(e, id)}
            className={classNames({ active: mainMenuActive})}
          >
            {getLabel(item.icon, item.label)}
          </a>
          {/*-------------------------------------------------------------------- SubMenu---------------------------------------------------------- */}
          {/* {console.log(activeIndex, id)} */}
          <Collapse in={!collapseAll && mainMenuActive}>
            <ul>
              <MainMenuItems
                menuItems={item.subs}
                menuPlacement={menuPlacement}
                isSubItem
              />
            </ul>
          </Collapse>

          {/*-------------------------------------------------------------------- SubMenu---------------------------------------------------------- */}
        </li>
      );
    }
    if (item.isExternal) {
      return (
        <li key={id}>
          <a href={item.path} target="_blank" rel="noopener noreferrer">
            {getLabel(item.icon, item.label)}
          </a>
        </li>
      );
    }
    if (!isSubItem || menuPlacement === MENU_PLACEMENT.Vertical) {
      return (
        <li>
          <NavLink
            to={item.path}
            className={classNames({ active: isActive })}
            activeClassName=""
          >
            {getLabel(item.icon, item.label)}
          </NavLink>
        </li>
      );
    }
    if (menuPlacement === MENU_PLACEMENT.Horizontal && item.megaParent) {
      return (
        <li className="col d-flex flex-column">
          <NavLink
            to={item.path}
            className={classNames({ active: isActive })}
            activeClassName=""
          >
            {getLabel(item.icon, item.label)}
          </NavLink>
        </li>
      );
    }
    return (
      <Dropdown.Item as="li">
        <NavLink
          to={item.path}
          className={classNames({ active: isActive })}
          activeClassName=""
        >
          {getLabel(item.icon, item.label)}
        </NavLink>
      </Dropdown.Item>
    );
  }
);

MainMenuItem.displayName = "MainMenuItem";

const MainMenuItems = React.memo(
  ({
    menuItems = [],
    menuPlacement = DEFAULT_SETTINGS.MENU_PLACEMENT,
    isSubItem = false,
  }) =>
    menuItems.map((item, index) => (
      <MainMenuItem
        key={`menu.${item.path}.${index}`}
        id={isSubItem ? 'subMenu' : parseInt(index)}
        item={item}
        menuPlacement={menuPlacement}
        isSubItem={isSubItem}
      />
    ))
);

MainMenuItems.displayName = "MainMenuItems";

export default React.memo(MainMenuItems);
