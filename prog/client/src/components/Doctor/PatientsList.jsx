import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message,Descriptions,Tag,DatePicker} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatientDetails, updatePatientRecord } from '../../redux/slices/DoctorSlice';
import moment from 'moment';

const { TextArea } = Input;

const PatientsList = () => {
  const dispatch = useDispatch();
  const { patients, status, currentPatient } = useSelector(state => state.doctor);
  const token = useSelector(state => state.auth.token);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (currentPatient) {
      form.setFieldsValue({
        ...currentPatient,
        birthdate: currentPatient.birthdate ? moment(currentPatient.birthdate) : null,
      });
    }
  }, [currentPatient, form]);

  const showModal = (patientId) => {
    dispatch(fetchPatientDetails({ patientId, token }));
    setVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await dispatch(updatePatientRecord({
        patientId: currentPatient.id,
        updates: {
          ...values,
          birthdate: values.birthdate?.format('YYYY-MM-DD')
        },
        token
      })).unwrap();
      message.success('Данные пациента обновлены');
      setVisible(false);
    } catch (error) {
      message.error('Ошибка при обновлении');
    }
  };

  const columns = [
    {
      title: 'ФИО',
      render: (_, record) => (
        <span>
          {record.lastName} {record.firstName} {record.patronymic}
        </span>
      )
    },
    {
      title: 'Дата рождения',
      dataIndex: 'birthdate',
      render: date => date ? moment(date).format('DD.MM.YYYY') : '-'
    },
    {
      title: 'Действия',
      render: (_, record) => (
        <Button 
          type="link" 
          onClick={() => showModal(record.id)}
        >
          Открыть карту
        </Button>
      )
    }
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={patients}
        loading={status === 'loading'}
        rowKey="id"
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title={`Медкарта пациента`}
        visible={visible}
        onOk={handleSubmit}
        onCancel={() => setVisible(false)}
        width={800}
        footer={[
          <Button key="back" onClick={() => setVisible(false)}>
            Закрыть
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={handleSubmit}
          >
            Сохранить
          </Button>
        ]}
      >
        {currentPatient && (
          <>
            <Descriptions bordered column={1} style={{ marginBottom: 24 }}>
              <Descriptions.Item label="ФИО">
                {currentPatient.lastName} {currentPatient.firstName} {currentPatient.patronymic}
              </Descriptions.Item>
              <Descriptions.Item label="Дата рождения">
                {currentPatient.birthdate ? moment(currentPatient.birthdate).format('DD.MM.YYYY') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Пол">
                <Tag color={currentPatient.gender === 'М' ? 'blue' : 'pink'}>
                  {currentPatient.gender === 'М' ? 'Мужской' : 'Женский'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Form form={form} layout="vertical">
              <Form.Item name="medicalHistory" label="История болезни">
                <TextArea rows={3} />
              </Form.Item>
              <Form.Item name="allergies" label="Аллергии">
                <Input />
              </Form.Item>
              <Form.Item name="diagnosis" label="Диагноз">
                <Input />
              </Form.Item>
              <Form.Item name="treatment" label="Лечение">
                <TextArea rows={3} />
              </Form.Item>
              <Form.Item name="notes" label="Примечания">
                <TextArea rows={2} />
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>
    </>
  );
};

export default PatientsList;