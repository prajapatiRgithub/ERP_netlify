import React, { Fragment } from 'react';
import { Edit, ShoppingBag, Trash2 } from 'react-feather';
import { Input, Media, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import { H6, LI, Image, UL, P, H5 } from '../../../AbstractElements';
import { ItemCartData } from '../../../Data/LayoutData';

const ItemCart = () => {

  return (
    <Fragment>
      <LI attrLI={{ className: 'onhover-dropdown' }}>
        <div className="notification-box">
          <i><ShoppingBag /></i>
          <span className="badge rounded-pill badge-secondary">4</span>
        </div>
        <div className="notification-dropdown cart onhover-show-div">
          <div className="m-3">
            <Row>
              <div className="col">
                <P> <b>5 </b>Items in Cart</P>
              </div>
              <div className="col text-end">
                <P attrPara={{ className: 'm-0' }}>Cart Subtotal</P>
                <H5 attrH5={{ className: 'txt-primary f-w-700' }}>5000$</H5>
              </div>
            </Row>
            <Link className="btn btn-dark w-100 mt-1" to={`${process.env.PUBLIC_URL}/ecommerce/checkout`}>Process To Checkout</Link>
          </div>
          <UL attrUL={{ className: 'simple-list border-top custom-scrollbar' }}>
            {
              ItemCartData.map((item) => {
                return (
                  <LI key={item.id}>
                    <Media>
                      <Image attrImage={{ src: `${item.img}`, alt: '' }} />&nbsp;
                      <Media body><Link to={`${process.env.PUBLIC_URL}/ecommerce/product`}>{item.title}</Link>
                        <H6 attrH6={{ className: 'price' }}>{item.prize}</H6>
                        <Row>
                          <div className="col-9">
                            <H6 attrH6={{ className: 'qty' }}>{item.qty}
                              <Input className="form-control" type="number" placeholder="1" />
                            </H6>
                          </div>
                          <div className="col-3 text-end d-flex">
                            <Edit className="me-1" />
                            <Trash2 className="me-1" />
                          </div>
                        </Row>
                      </Media>
                    </Media>
                  </LI>
                );
              })
            }
          </UL>
          <div className="m-3 mt-1">
          <Link className="btn btn-light w-100 mt-3" to={`${process.env.PUBLIC_URL}/ecommerce/cart`}>View cart</Link>
          </div>
        </div>
      </LI>
    </Fragment>
  );
};
export default ItemCart;