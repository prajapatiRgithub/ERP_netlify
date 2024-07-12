import { LI, Image, P, UL } from '../../../AbstractElements';
import { messageData } from '../../../Data/LayoutData';
import React, { Fragment } from 'react';
import { MessageSquare } from 'react-feather';
import { Media } from 'reactstrap';
import { Link } from 'react-router-dom';

const Message = () => {
  return (
    <Fragment>
      <LI attrLI={{ className: 'onhover-dropdown' }}>
        <i><MessageSquare /></i>
        <div className="chat-dropdown onhover-show-div">
          <div className="m-3">
            <Link className="btn btn-dark w-100" to={`${process.env.PUBLIC_URL}/chat/chatapp`}>You have 3 message</Link>
          </div>
          <UL attrUL={{ className: 'simple-list border-top custom-scrollbar' }}>
            {
              messageData.map((item) => {
                return (
                  <LI key={item.id}>
                    <Media>
                      <Image attrImage={{ className: 'img-fluid rounded-circle me-3', src: `${item.img}`, alt: '' }} />
                      <div className={item.online}></div>
                      <Media body>
                        <Link to={`${process.env.PUBLIC_URL}/chat/chatapp`}>
                          <span>{item.name}</span>
                        </Link>
                        <P attrPara={{ className: 'f-12 light-font' }}>{item.mess}</P>
                      </Media>
                      <P attrPara={{ className: item.badge }}>{item.time}</P>
                    </Media>
                  </LI>
                );
              })
            }
          </UL>
          <div className="m-3">
            <Link className="btn btn-light w-100" to={`${process.env.PUBLIC_URL}/chat/chatapp`}>View all</Link>
          </div>
        </div>
      </LI>
    </Fragment>
  );
};
export default Message;