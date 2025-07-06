import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctors, addDoctor, updateDoctor, deleteDoctor } from '../../redux/slices/AdminSlice';
import { Button, Modal, Table, Form, Input, Select, Space, message, DatePicker, Row, Col, Upload, Card, Avatar, TimePicker, Checkbox, Collapse, Divider } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined, UserOutlined, DownOutlined, SearchOutlined, CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import '../../styles/adminTables.css';

const { Option } = Select;
const { Panel } = Collapse;

const AdminDoctors = () => {
  const dispatch = useDispatch();
  const { items = [], status } = useSelector(state => state.admin || {});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [activePanels, setActivePanels] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchSpecialization, setSearchSpecialization] = useState('');
  const [isCredentialsModalVisible, setIsCredentialsModalVisible] = useState(false);
  const [credentials, setCredentials] = useState({ login: '', password: '' });

  const [schedules, setSchedules] = useState({
    Понедельник: { isWorking: false, startTime: '09:00', endTime: '18:00', interval: '00:30' },
    Вторник: { isWorking: false, startTime: '09:00', endTime: '18:00', interval: '00:30' },
    Среда: { isWorking: false, startTime: '09:00', endTime: '18:00', interval: '00:30' },
    Четверг: { isWorking: false, startTime: '09:00', endTime: '18:00', interval: '00:30' },
    Пятница: { isWorking: false, startTime: '09:00', endTime: '18:00', interval: '00:30' },
    Суббота: { isWorking: false, startTime: '09:00', endTime: '18:00', interval: '00:30' },
    Воскресенье: { isWorking: false, startTime: '09:00', endTime: '18:00', interval: '00:30' }
  });

  const handleCancel = () => {
    setIsModalVisible(false);
    setSchedules(initialSchedules()); 
    setActivePanels([]);
  };

  const initialSchedules = () => ({
      Понедельник: { isWorking: false, startTime: '09:00', endTime: '18:00', interval: '00:30' },
      Вторник: { isWorking: false, startTime: '09:00', endTime: '18:00', interval: '00:30' },
      Среда: { isWorking: false, startTime: '09:00', endTime: '18:00', interval: '00:30' },
      Четверг: { isWorking: false, startTime: '09:00', endTime: '18:00', interval: '00:30' },
      Пятница: { isWorking: false, startTime: '09:00', endTime: '18:00', interval: '00:30' },
      Суббота: { isWorking: false, startTime: '09:00', endTime: '18:00', interval: '00:30' },
      Воскресенье: { isWorking: false, startTime: '09:00', endTime: '18:00', interval: '00:30' }
  });

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  const filteredDoctors = items.filter(doctor => {
    if (!doctor) return false;
  
    const lastName = doctor.lastName || '';
    const firstName = doctor.firstName || '';
    const patronymic = doctor.patronymic || '';
    const specialization = doctor.specialization || '';
  
    const searchNameLower = searchName.toLowerCase();
    const searchSpecLower = searchSpecialization.toLowerCase();
  
    const matchesName = 
      lastName.toLowerCase().includes(searchNameLower) ||
      firstName.toLowerCase().includes(searchNameLower) ||
      patronymic.toLowerCase().includes(searchNameLower);
    
    const matchesSpecialization = 
      specialization.toLowerCase().includes(searchSpecLower);
    
    return matchesName && matchesSpecialization;
  });

  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    const lastNameA = a.lastName || '';
    const lastNameB = b.lastName || '';
    return lastNameA.localeCompare(lastNameB);
  });

  const handleAddDoctor = () => {
    setCurrentDoctor(null);
    setFileList([]);
    form.resetFields();
    setSchedules(initialSchedules());
    setActivePanels([]);
    setIsModalVisible(true);
  };

  const handleEditDoctor = (doctor) => {
    console.log(doctor);
    setCurrentDoctor(doctor);
    setFileList(doctor.photo ? [{ uid: '-1', name: 'photo', url: doctor.photo, status: 'done' }] : []);
    form.setFieldsValue({
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      patronymic: doctor.patronymic,
      birthdate: moment(doctor.birthdate),
      phone: doctor.phone,
      specialization: doctor.specialization,
      category: doctor.category,
      photo: doctor.photo
    });
    const newSchedules = { ...initialSchedules() };

    if (doctor.schedule) {
        doctor.schedule.forEach(s => {
            newSchedules[s.day_of_week] = {
                isWorking: true,
                startTime: s.start_time,
                endTime: s.end_time,
                interval: s.interval
            };
        });
    }

    setSchedules(newSchedules);
    setActivePanels(Object.keys(newSchedules).filter(day => newSchedules[day].isWorking));
    setIsModalVisible(true);
  };

  const handleDeleteDoctor = (id) => {
    Modal.confirm({
      title: 'Удалить врача?',
      content: 'Вы уверены, что хотите удалить этого врача?',
      onOk: () => dispatch(deleteDoctor(id))
        .then(() => {
          message.success('Врач успешно удален');
          dispatch(fetchDoctors());
        })
        .catch(() => message.error('Ошибка при удалении врача')),
    });
  };

  const handleScheduleChange = (day, field, value) => {
    const newSchedules = {
      ...schedules,
      [day]: {
        ...schedules[day],
        [field]: value
      }
    };
    
    setSchedules(newSchedules);
    
    if (field === 'isWorking' && value) {
      setActivePanels(prev => [...prev, day]);
    }
    else if (field === 'isWorking' && !value) {
      setActivePanels(prev => prev.filter(d => d !== day));
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const formData = new FormData();
      
      formData.append('First_Name', values.firstName);
      formData.append('Last_Name', values.lastName);
      formData.append('Patronymic', values.patronymic);
      formData.append('Birthdate', values.birthdate.format('YYYY-MM-DD'));
      formData.append('Phone', values.phone);
      formData.append('Specialization', values.specialization);
      formData.append('Category', values.category);

      const scheduleData = Object.entries(schedules)
        .filter(([_, s]) => s.isWorking)
        .map(([day, schedule]) => ({
          day_of_week: day,
          start_time: schedule.startTime,
          end_time: schedule.endTime,
          interval: schedule.interval
        }));

      formData.append('Schedule', JSON.stringify(scheduleData));
      
      if (fileList.length > 0 && fileList[0]) {
        formData.append('Photo', fileList[0]);
      } else if (currentDoctor?.photo) {
        formData.append('Photo', currentDoctor.photo);
      }

      if (currentDoctor) {
        formData.append('id', currentDoctor.id);
        await dispatch(updateDoctor(formData));
        message.success('Данные врача обновлены');
        setIsModalVisible(false);
        dispatch(fetchDoctors());
      } else {
        const response = await dispatch(addDoctor(formData));
        
        setCredentials({
          login: response.payload.credentials.login,
          password: response.payload.credentials.password
        });
        setIsCredentialsModalVisible(true);
        
        setIsModalVisible(false);
        dispatch(fetchDoctors());
      }
    } catch (error) {
      message.error(error.message || 'Произошла ошибка');
    }
  };

  const specializations = [
    'Терапевт', 'Хирург', 'Кардиолог', 'Невролог',
    'Офтальмолог', 'Отоларинголог', 'Стоматолог'
  ];

  const categories = [
    'Высшая', 'Первая', 'Вторая', 'Кандидат медицинских наук',
    'Доктор медицинских наук'
  ];

  const uploadProps = {
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Можно загружать только изображения!');
        return Upload.LIST_IGNORE;
      }
      const isLt5M = file.size / 1024 / 1024 < 15;
      if (!isLt5M) {
        message.error('Изображение должно быть меньше 15MB!');
        return Upload.LIST_IGNORE;
      }
      setFileList([file]);
      return false;
    },
    fileList,
  };

  return (
    <div className="admin-table-container">
      <div className="admin-table-title">
          <h2>Управление врачами</h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddDoctor}
            className="add-btn"
          >
            Добавить врача
          </Button>
        </div>

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={12}>
            <Input
              placeholder="Поиск по ФИО"
              prefix={<SearchOutlined />}
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={12}>
            <Input
              placeholder="Поиск по специализации"
              prefix={<SearchOutlined />}
              value={searchSpecialization}
              onChange={e => setSearchSpecialization(e.target.value)}
              allowClear
            />
          </Col>
        </Row>

        <Table
          dataSource={sortedDoctors}
          rowKey="id"
          loading={status === 'loading'}
          className="admin-table"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) => `Всего врачей: ${total}`,
          }}
        >
          <Table.Column 
            title="Фамилия" 
            dataIndex="lastName" 
            key="lastName"
            sorter={(a, b) => a.lastName.localeCompare(b.lastName)}
            defaultSortOrder="ascend"
          />
          <Table.Column 
            title="Имя" 
            dataIndex="firstName" 
            key="firstName"
          />
          <Table.Column 
            title="Отчество" 
            dataIndex="patronymic" 
            key="patronymic"
          />
          <Table.Column
            title="Дата рождения"
            dataIndex="birthdate"
            key="birthdate"
            render={date => moment(date).format('DD.MM.YYYY')}
          />
          <Table.Column 
            title="Телефон" 
            dataIndex="phone" 
            key="phone"
          />
          <Table.Column 
            title="Специализация" 
            dataIndex="specialization" 
            key="specialization"
          />
          <Table.Column 
            title="Категория" 
            dataIndex="category" 
            key="category"
          />
          <Table.Column
            title="Фото"
            dataIndex="photo"
            key="photo"
            render={photo => (
              <Avatar 
                src={photo} 
                icon={<UserOutlined />}
                size={40}
              />
            )}
          />
          <Table.Column
            title="Действия"
            key="actions"
            render={(_, record) => (
              <Space size="middle">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleEditDoctor(record)}
                />
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteDoctor(record.id)}
                />
              </Space>
            )}
          />
        </Table>

        <Modal
          title={currentDoctor ? 'Редактировать врача' : 'Добавить врача'}
          visible={isModalVisible}
          onOk={handleSubmit}
          onCancel={handleCancel}
          width={800}
        >
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="lastName"
                  label="Фамилия"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="firstName"
                  label="Имя"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="patronymic"
                  label="Отчество"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="birthdate"
                  label="Дата рождения"
                  rules={[{ required: true }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="Телефон"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="specialization"
                  label="Специализация"
                  rules={[{ required: true }]}
                >
                  <Select>
                    {specializations.map(spec => (
                      <Option key={spec} value={spec}>{spec}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="category"
                  label="Категория"
                  rules={[{ required: true }]}
                >
                  <Select>
                    {categories.map(cat => (
                      <Option key={cat} value={cat}>{cat}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="photo"
              label="Фото врача"
            >
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Загрузить фото</Button>
              </Upload>
            </Form.Item>
            <Divider orientation="left">Расписание</Divider>
            <Collapse 
              bordered={false} 
              expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 180 : 0} />}
              activeKey={activePanels}
              onChange={keys => setActivePanels(keys)}
            >
              {Object.entries(schedules).map(([day, schedule]) => (
                <Panel 
                  header={
                    <Checkbox
                      checked={schedule.isWorking}
                      onChange={e => handleScheduleChange(day, 'isWorking', e.target.checked)}
                    >
                      {day}
                    </Checkbox>
                  } 
                  key={day}
                  disabled={!schedule.isWorking}
                >
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item label="Начало работы">
                        <TimePicker
                          format="HH:mm"
                          value={moment(schedule.startTime, 'HH:mm')}
                          onChange={time => handleScheduleChange(day, 'startTime', time.format('HH:mm'))}
                          style={{ width: '100%' }}
                          disabled={!schedule.isWorking}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="Конец работы">
                        <TimePicker
                          format="HH:mm"
                          value={moment(schedule.endTime, 'HH:mm')}
                          onChange={time => handleScheduleChange(day, 'endTime', time.format('HH:mm'))}
                          style={{ width: '100%' }}
                          disabled={!schedule.isWorking}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="Интервал приема">
                        <Select
                          value={schedule.interval}
                          onChange={value => handleScheduleChange(day, 'interval', value)}
                          disabled={!schedule.isWorking}
                        >
                          <Option value="00:15">15 минут</Option>
                          <Option value="00:30">30 минут</Option>
                          <Option value="00:45">45 минут</Option>
                          <Option value="01:00">1 час</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Panel>
              ))}
            </Collapse>
          </Form>
        </Modal>
        <Modal
          title="Учетные данные врача"
          visible={isCredentialsModalVisible}
          footer={[
            <Button 
              key="close" 
              type="primary" 
              icon={<CloseOutlined />}
              onClick={() => setIsCredentialsModalVisible(false)}
            >
              Закрыть
            </Button>
          ]}
          closable={false} // Запрещаем закрытие по клику вне модального окна или ESC
        >
          <div style={{ marginBottom: 16 }}>
            <p><strong>Логин:</strong> {credentials.login}</p>
            <p><strong>Пароль:</strong> {credentials.password}</p>
          </div>
          <p style={{ color: 'red', fontWeight: 'bold' }}>
            Сохраните эти данные! Они больше не будут отображаться.
          </p>
        </Modal>
    </div>
  );
};

export default AdminDoctors;