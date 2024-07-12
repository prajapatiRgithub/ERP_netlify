import React, { Fragment } from 'react';
import { H6, UL } from '../../../AbstractElements';
import { Bookmark } from '../../../Constant';
import BookmarkList from './BookmarkList';

const RemoveBookmark = ({ bookmarkItems }) => {
    return (
        <Fragment>
            <div className="front">
                <H6 attrH6={{ className: 'f-18 mb-0 f-w-600 border-bottom' }}>{Bookmark}</H6>
                <UL attrUL={{ className: 'simple-list droplet-dropdown bookmark-dropdown' }}>
                    <BookmarkList bookmarkItems={bookmarkItems} />
                </UL>
            </div>
        </Fragment>
    );
};
export default RemoveBookmark;