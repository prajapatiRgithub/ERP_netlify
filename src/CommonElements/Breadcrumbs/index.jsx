import React, { Fragment } from 'react';
import { Container, Row, Col, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Home } from 'react-feather';
import H3 from '../Headings/H3Element';

const Breadcrumbs = (props) => {
  const { title = '', parent = '' } = props;
  return (
    <Fragment>
      <Container fluid={true}>
        <Row>
          <Col xs="6">
            <H3>{title}</H3>
          </Col>
          <Col xs="6">
            <div className="breadcrumb-sec">
              <Breadcrumb>
                <BreadcrumbItem>
                  <Link to={`/dashboard`}>
                    <Home />
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbItem>{parent}</BreadcrumbItem>
                <BreadcrumbItem active>{title}</BreadcrumbItem>
              </Breadcrumb>
            </div>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Breadcrumbs;
