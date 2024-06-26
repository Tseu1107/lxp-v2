import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { fetchRequest } from '../../utils/fetchRequest';
import { authRecover, authRecoverSubmit } from '../../utils/fetchRequest/Urls';
import showMessage from "../../modules/message";
import { setLoading } from '../../utils/redux/action';
import Forms from 'modules/Form/Forms';

const recoverPassword = ({
    show,
    setShow
}) => {
    const { t } = useTranslation();
    const formRef = useRef();
    const dispatch = useDispatch();
    const [selectedUsername, setSelectedUsername] = useState('');
    // const [selectedWorkerCode, setSelectedWorkerCode] = useState('');

    const recoverPasswordFields = [
        {
            key: 'registeredPhoneNumber',
            label: t('auth.registeredPhoneNumber') + '*',
            value: '',
            type: 'number',
            errorMessage: t('auth.errorMessage.enterRegisteredPhoneNumber'),
            placeHolder: t('auth.registeredPhoneNumber'),
            labelStyle: {
                fontFamily: 'PinnacleDemiBold',
                fontSize: 12,
                fontWeight: 800,
                color: '#575962',
            },
        },
        // {
        //     key: 'registeredWorkerCode',
        //     label: `${t('auth.registeredWorkerCode')}*`,
        //     labelBold: true,
        //     value: '',
        //     type: 'nonCryllic',
        //     required: true,
        //     errorMessage: t('auth.errorMessage.enterRegisteredWorkerCode'),
        //     placeHolder: t('auth.errorMessage.enterRegisteredWorkerCode'),
        //     upperCase: true,
        // },
    ];

    const [fields, setFields] = useState('recoverPassword');

    const newPasswordFields = [
        {
            key: 'confirmationCode',
            label: `${t('auth.confirmationCode')}*`,
            labelBold: true,
            value: '',
            type: 'nonCryllic',
            required: true,
            errorMessage: t('auth.confirmationCode'),
            placeHolder: t('auth.confirmationCode'),
            upperCase: true,
        },
        {
            key: 'newPassword',
            label: `${t('auth.newPassword')}*`,
            labelBold: true,
            value: '',
            type: 'password',
            required: true,
            errorMessage: t('auth.errorMessage.enterNewPassword'),
            placeHolder: t('auth.errorMessage.enterNewPassword'),
        },
        {
            key: 'newPasswordRepeat',
            label: `${t('auth.repeatNewPassword')}*`,
            labelBold: true,
            value: '',
            type: 'password',
            required: true,
            errorMessage: t('auth.repeatNewPassword'),
            placeHolder: t('auth.repeatNewPassword'),
        },
    ];

    const getRecoverCode = () => {
        const [isValid, states, values] = formRef.current.validate();
        if (isValid) {
            dispatch(setLoading(true));
            const postData = {
                username: values.registeredPhoneNumber,
                // code: values.registeredWorkerCode
            }
            fetchRequest(authRecover, 'POST', postData)
                .then(response => {
                    const { message = '', success = false } = response
                    if (response.success) {
                        setFields('newPassword')
                        setSelectedUsername(values.registeredPhoneNumber)
                        // setSelectedWorkerCode(values.registeredWorkerCode)
                        showMessage(message, success)
                    } else {
                        showMessage(message || t('errorMessage.title'), success)
                    }
                    dispatch(setLoading(false));
                })
                .catch((e) => {
                    showMessage(t('errorMessage.title'))
                    dispatch(setLoading(false));
                });
        }
    };

    const changePassword = () => {
        const [isValid, values] = formRef.current.validate();

        if (isValid) {

            const code = values.find(obj => obj.key == 'confirmationCode')?.value
            const newPass = values.find(obj => obj.key == 'newPassword')?.value;
            const newPassRepeat = values.find(obj => obj.key == 'newPasswordRepeat')?.value;

            if (code) {
                if (newPass?.length < 4) {
                    showMessage(t('auth.errorMessage.enterAtLeastFourCharacter'))                    
                } else if (newPass === newPassRepeat) {
                    dispatch(setLoading(true));
                    const postData = {
                        username: selectedUsername,
                        // code: selectedWorkerCode,
                        code,
                        newPassword: newPass,
                        newPasswordRepeat: newPassRepeat,
                    }
                    fetchRequest(authRecoverSubmit, 'POST', postData)
                        .then(response => {
                            const { message = '', success = false } = response
                            if (response.success) {
                                showMessage(message, success)
                                setShow(false)
                            } else {
                                showMessage(message || t('errorMessage.title'), success)
                            }
                            dispatch(setLoading(false));
                        })
                        .catch((e) => {
                            showMessage(t('errorMessage.title'))
                            dispatch(setLoading(false));
                    });
                }
            } else {
                showMessage(t('auth.errorMessage.confirmationCode'))
            }

            
        }
    };

    useEffect(() => {
        if (fields == 'newPassword') {
            formRef.current.updateFields(newPasswordFields)
        }
    }, [fields])

    return (
        <Modal
            centered
            show={show}
            onHide={() => setShow(false)}
            size='lg'
        >
            <Modal.Header closeButton style={{padding: '1rem 2rem'}}>
                <Modal.Title className='fs-16'>
                    {t('auth.recoverPassword')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='px-0'>
                <Forms 
                    ref={formRef} 
                    fields={recoverPasswordFields} 
                />
            </Modal.Body>
            <Modal.Footer className='d-flex justify-content-center' style={{padding: '1rem 2rem'}}>
                <Button
                    onClick={() => setShow(false)}
                    variant="outline-dark"
                >
                    {t('common.close')}
                </Button>
                {
                    fields == 'newPassword'
                        ?
                        <Button
                            variant="success"
                            className='text-uppercase fs-12 br-8 ps-4 pe-4'
                            onClick={changePassword}
                        >
                            {t('common.save')}
                        </Button>
                        :
                        <Button
                            variant="success"
                            className='text-uppercase fs-12 br-8 ps-4 pe-4'
                            onClick={getRecoverCode}
                        >
                            {t('auth.verificationCode')}
                        </Button>
                }
            </Modal.Footer>
        </Modal >
    );
};

export default recoverPassword;