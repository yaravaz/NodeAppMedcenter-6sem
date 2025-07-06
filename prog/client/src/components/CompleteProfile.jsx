import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updatePatient, fetchPatientByUserId } from '../redux/slices/PatientSlice';
import { Form, Input, Button, DatePicker, Select, message } from 'antd';
import moment from 'moment';

const { Option } = Select;

const CompleteProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentPatient, status } = useSelector((state) => state.patient);
  const { user, token } = useSelector((state) => state.auth);
  const [form] = Form.useForm();

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchPatientByUserId({ userId: user.id, token: token}));
    }
  }, [dispatch, user?.id, token]);
 
  useEffect(() => {
    if (currentPatient && !isProfileEmpty(currentPatient)) {
      navigate('/profile');
    }
  }, [currentPatient, navigate]);

  const isProfileEmpty = (patient) => {
    return !patient.First_Name || !patient.Last_Name || !patient.Birthdate;
  };

  const onFinish = async (values) => {
    try {
      await dispatch(updatePatient({
        id: currentPatient.ID,
        patientData: {
          ...values,
          Birthdate: values.Birthdate.format('YYYY-MM-DD')
        },
        token: token
      })).unwrap();
      navigate('/');
      message.success('Профиль успешно сохранен!');
    } catch (error) {
      message.error('Ошибка при сохранении профиля' + error);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h2>Завершите регистрацию</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          Gender: currentPatient?.Gender || 'М',
          Birthdate: currentPatient?.Birthdate ? moment(currentPatient.Birthdate) : moment().subtract(18, 'years')
        }}
      >
        <Form.Item
          name="First_Name"
          label="Имя"
          rules={[{ required: true, message: 'Введите имя' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="Last_Name"
          label="Фамилия"
          rules={[{ required: true, message: 'Введите фамилию' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="Patronymic"
          label="Отчество"
          rules={[{ required: true, message: 'Введите отчество' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="Birthdate"
          label="Дата рождения"
          rules={[{ required: true, message: 'Укажите дату рождения' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

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
            loading={status === 'loading'}
            style={{ width: '100%' }}
          >
            Сохранить профиль
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CompleteProfile;