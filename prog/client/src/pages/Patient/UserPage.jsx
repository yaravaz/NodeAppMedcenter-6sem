import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout as logoutAction, deleteUser, updateUser, fetchUserData } from '../../redux/slices/AuthSlice';
import { updatePatient, fetchPatientByUserId } from '../../redux/slices/PatientSlice';
import { Form, Input, Button, DatePicker, Select, message, Card, Divider, Avatar, Row, Col, Space } from 'antd';
import { UserOutlined, LogoutOutlined, DeleteOutlined } from '@ant-design/icons';
import { FaSignOutAlt} from 'react-icons/fa';
import moment from 'moment';
import '../../styles/userPage.css';

const { Option } = Select;

const UserProfile = () => {
    const { user, token } = useSelector((state) => state.auth);
    const { currentPatient } = useSelector((state) => state.patient);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [usernameForm] = Form.useForm();
    const [patientForm] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchPatientByUserId({ userId: user.id, token }));
        }
    }, [dispatch, user?.id, token]);

    useEffect(() => {
        if (user) {
            usernameForm.setFieldsValue({
                username: user.login
            });
        }
    }, [user, usernameForm]);

    useEffect(() => {
        if (currentPatient) {
            patientForm.setFieldsValue({
                First_Name: currentPatient.First_Name,
                Last_Name: currentPatient.Last_Name,
                Patronymic: currentPatient.Patronymic,
                Birthdate: currentPatient.Birthdate ? moment(currentPatient.Birthdate) : null,
                Gender: currentPatient.Gender,
                Phone: currentPatient.Phone
            });
        }
    }, [currentPatient, patientForm]);

    const handleLogout = async () => {
        try {
            await dispatch(logoutAction()).unwrap();
            navigate('/');
            message.success('Вы успешно вышли из системы');
        } catch (error) {
            console.error('Ошибка выхода из системы:', error);
            message.error('Произошла ошибка при выходе из системы');
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя отменить.')) {
            try {
                await dispatch(deleteUser()).unwrap();
                await dispatch(logoutAction()).unwrap();
                navigate('/');
                message.success('Аккаунт успешно удален');
            } catch (error) {
                console.error('Ошибка удаления аккаунта:', error);
                message.error('Произошла ошибка при удалении аккаунта');
            }
        }
    };

    const onUsernameUpdate = async (values) => {
        try {
            await dispatch(updateUser({ 
                userId: user.id, 
                username: values.username, 
                token
            })).unwrap();
            message.success('Логин успешно обновлен');
            dispatch(fetchUserData(token));
            setIsEditing(false);
        } catch (error) {
            message.error(error.message || 'Ошибка при обновлении логина');
        }
    };

    const onPatientUpdate = async (values) => {
        try {
            await dispatch(updatePatient({
                id: currentPatient.ID,
                patientData: {
                    ...values,
                    Birthdate: values.Birthdate?.format('YYYY-MM-DD')
                },
                token
            })).unwrap();
            message.success('Данные профиля обновлены');
            dispatch(fetchPatientByUserId({ userId: user.id, token }));
        } catch (error) {
            message.error('Ошибка при обновлении профиля');
        }
    };

    if (!user) {
        return (
            <div className="user-profile-container">
                <Card className="profile-card">
                    <p className="not-logged-message">Пожалуйста, войдите чтобы увидеть профиль</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="user-profile-container">
            <Card className="profile-card">
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={8}>
                        <div className="profile-sidebar">
                            <h2 className="profile-username">{user.login}</h2>
                            
                            <Divider />
                            
                            <div className="profile-actions">
                                <Button 
                                    type="primary"
                                    icon={<FaSignOutAlt />}
                                    onClick={handleLogout}
                                    className="logout-btn"
                                    block
                                >
                                    Выйти
                                </Button>
                                
                                <Button 
                                    type="default"
                                    icon={<DeleteOutlined />}
                                    onClick={handleDeleteAccount}
                                    className="delete-account-btn"
                                    block
                                >
                                    Удалить аккаунт
                                </Button>
                            </div>
                        </div>
                    </Col>
                    
                    {/* Правая колонка - Формы редактирования */}
                    <Col xs={24} md={16}>
                        <div className="profile-content">
                            <h3 className="section-title">Основная информация</h3>
                            
                            {!isEditing ? (
                                <div className="profile-info">
                                    <p><strong>Логин:</strong> {user.login}</p>
                                    <Button 
                                        type="default" 
                                        onClick={() => setIsEditing(true)}
                                        className="edit-btn"
                                    >
                                        Изменить логин
                                    </Button>
                                </div>
                            ) : (
                                <Form
                                    form={usernameForm}
                                    layout="vertical"
                                    onFinish={onUsernameUpdate}
                                    className="edit-form"
                                >
                                    <Form.Item
                                        name="username"
                                        label="Новый логин"
                                        rules={[
                                            { required: true, message: 'Введите логин' },
                                            { min: 3, message: 'Минимум 3 символа' },
                                            { max: 20, message: 'Максимум 20 символов' }
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item>
                                        <Space>
                                            <Button type="primary" htmlType="submit">
                                                Сохранить
                                            </Button>
                                            <Button 
                                                onClick={() => setIsEditing(false)}
                                                className="cancel-btn"
                                            >
                                                Отмена
                                            </Button>
                                        </Space>
                                    </Form.Item>
                                </Form>
                            )}
                            
                            <Divider />
                            
                            <h3 className="section-title">Персональные данные</h3>
                            
                            {currentPatient ? (
                                <Form
                                    form={patientForm}
                                    layout="vertical"
                                    onFinish={onPatientUpdate}
                                >
                                    <Row gutter={16}>
                                        <Col xs={24} md={8}>
                                            <Form.Item
                                                name="First_Name"
                                                label="Имя"
                                                rules={[{ required: true, message: 'Введите имя' }]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={8}>
                                            <Form.Item
                                                name="Last_Name"
                                                label="Фамилия"
                                                rules={[{ required: true, message: 'Введите фамилию' }]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={8}>
                                            <Form.Item
                                                name="Patronymic"
                                                label="Отчество"
                                                rules={[{ required: true, message: 'Введите отчество' }]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    
                                    <Row gutter={16}>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                name="Birthdate"
                                                label="Дата рождения"
                                                rules={[{ required: true, message: 'Укажите дату рождения' }]}
                                            >
                                                <DatePicker style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                name="Gender"
                                                label="Пол"
                                                rules={[{ required: true, message: 'Укажите пол' }]}
                                            >
                                                <Select>
                                                    <Option value="М">Мужской</Option>
                                                    <Option value="Ж">Женский</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    
                                    <Form.Item
                                        name="Phone"
                                        label="Телефон"
                                        rules={[{ required: true, message: 'Введите номер телефона' }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item>
                                        <Button 
                                            type="primary" 
                                            htmlType="submit"
                                            className="save-profile-btn"
                                        >
                                            Сохранить изменения
                                        </Button>
                                    </Form.Item>
                                </Form>
                            ) : (
                                <p>Загрузка данных профиля...</p>
                            )}
                        </div>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default UserProfile;