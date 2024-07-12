import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Col, Form, Input } from 'reactstrap';
import { MENUITEMS } from '../SideBar-Layout/Menu';
import { LI, UL } from '../../AbstractElements';
import ListOfMenu from './Bookmark/ListOfMenu';
import EmpltyClass from './Bookmark/EmptyClass';
import CustomContext from '../../_helper/customizer';

const Searchbar = () => {
    const mainmenu = MENUITEMS;
    const [searchValue, setSearchValue] = useState('');
    const [searchIcon, setSearchIcon] = useState(false);
    const [searchToggle, setSearchToggle] = useState(false);
    const [searchResult, setSearchResult] = useState(false);
    const { setIsClose, setToggleSearch, toggleSearch } = useContext(CustomContext);
    const escFunction = useCallback((event) => {
        if (event.keyCode === 27) {
            setSearchValue('');
            setSearchResult([]);
            setIsClose(false);
        }// eslint-disable-next-line
    }, []);
    const HandelClick = () => {
        setToggleSearch(!toggleSearch);
    };
    useEffect(() => {
        document.addEventListener('keydown', escFunction, false);
        return () => {
            document.removeEventListener('keydown', escFunction, false);
        };
    }, [escFunction, searchValue]);
    const checkSearchResultEmpty = (items) => {
        if (!items.length) {
            setSearchIcon(true);
        } else {
            setSearchIcon(false);
        }
    };
    const addFix = () => {
        setSearchToggle(true);
    };
    const removeFix = () => {
        setSearchValue('');
        setSearchToggle(false);
    };
    const handleSearchKeyword = (keyword) => {
        keyword = keyword.toLowerCase()
        keyword ? addFix() : removeFix();
        const items = [];
        setSearchValue(keyword);
        mainmenu.map(menuItems => {
            menuItems.Items.filter(mItems => {
                if (mItems.title.split('').filter(char => char !== ' ').join('').toLowerCase().includes(keyword) && mItems.type === 'link') {
                    items.push(mItems);
                }
                if (!mItems.children) return false;
                mItems.children.filter(subItems => {
                    if (subItems.title.split('').filter(char => char !== ' ').join('').toLowerCase().includes(keyword) && subItems.type === 'link') {
                        subItems.icon = mItems.icon;
                        items.push(subItems);
                    }
                    if (!subItems.children) return false;
                    subItems.children.filter(suSubItems => {
                        if (suSubItems.title.split('').filter(char => char !== ' ').join('').toLowerCase().includes(keyword)) {
                            suSubItems.icon = mItems.icon;
                            items.push(suSubItems);
                        }
                        return suSubItems;
                    });
                    return subItems;
                });
                checkSearchResultEmpty(items);
                setSearchResult(items);
                return mItems;
            });
            return menuItems;
        });
    };
    return (
        <Col className="left-menu-header">
            <UL attrUL={{ className: 'simple-list' }}>
                <LI>
                    <Form className="form-inline search-form">
                        <div className="search-bg">
                            <i className="fa fa-search"></i>
                        </div>
                        <Input className={`form-control-plaintext ${toggleSearch ? 'open' : ''}`} type="text" placeholder="Search menu"
                            defaultValue={searchValue} onChange={(e) => handleSearchKeyword(e.target.value)} />
                        <ListOfMenu searchValue={searchValue} searchResult={searchResult} removeFix={removeFix} searchBar={true} searchToggle={searchToggle} />
                        <EmpltyClass searchIcon={searchIcon} search={true} />
                    </Form>
                    <span className='d-sm-none mobile-search search-bg'>
                        <i className="fa fa-search" onClick={() => HandelClick(!toggleSearch)}></i>
                    </span>
                </LI>
            </UL>
        </Col>
    );
};

export default Searchbar;