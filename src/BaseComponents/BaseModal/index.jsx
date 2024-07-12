import React from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from 'reactstrap';
import BaseButton from '../BaseButton';
import { Close, Loading } from '../../../src/Constant/index';

const BaseModal = (props) => {
    return (
        <Modal isOpen={props.isOpen} toggle={props.toggler} size={props.size} centered>
            <ModalHeader toggle={props.toggler}>
                {props.title}
            </ModalHeader>
            <ModalBody className={props.bodyClass}>
                {props.children}
            </ModalBody>
            <ModalFooter>
                <BaseButton color='danger' onClick={props.toggler}>{Close}</BaseButton>
                {props.hasSubmitButton === undefined && <BaseButton color="success" onClick={props.submit} disabled={props.disabled}>{props.loader ? <> <Spinner size='sm'/> {Loading} </> : props.submitText}</BaseButton>}
            </ModalFooter>
        </Modal>
    );
};

export default BaseModal;