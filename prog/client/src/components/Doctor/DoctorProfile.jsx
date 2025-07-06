import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Upload, Avatar,Select,Divider} from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { updateDoctorProfile } from '../../redux/slices/DoctorSlice';

const { Option } = Select;
const { TextArea } = Input;

const specialties = [
  'Терапевт',
  'Хирург',
  'Кардиолог',
  'Невролог',
  'Офтальмолог',
  'Отоларинголог',
  'Дерматолог'
];

const DoctorProfile = () => {
  const dispatch = useDispatch();
  const { doctor } = useSelector(state => state.doctor);
  const token = useSelector(state => state.auth.token);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(doctor?.photoUrl);

  useEffect(() => {
    if (doctor) {
      form.setFieldsValue({
        ...doctor,
        specialization: doctor.specialization || specialties[0]
      });
      setImageUrl(doctor.photoUrl);
    }
  }, [doctor, form]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await dispatch(updateDoctorProfile({
        doctorId: doctor.id,
        updates: {
          ...values,
          photoUrl: imageUrl
        },
        token
      })).unwrap();
      message.success('Профиль обновлен');
    } catch (error) {
      message.error('Ошибка при обновлении профиля');
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    beforeUpload: file => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Можно загружать только изображения!');
      }
      return isImage || Upload.LIST_IGNORE;
    },
    onChange: info => {
      if (info.file.status === 'done') {
        const reader = new FileReader();
        reader.readAsDataURL(info.file.originFileObj);
        reader.onload = () => setImageUrl(reader.result);
      }
    },
    showUploadList: false,
  };

  return (
    <Card bordered={false}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Avatar 
          size={128} 
          src={imageUrl} 
          icon={<UserOutlined />}
          style={{ marginBottom: 16 }}
        />
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Загрузить фото</Button>
        </Upload>
      </div>

      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
      >
        <Divider orientation="left">Основная информация</Divider>
        
        <Form.Item
          name="firstName"
          label="Имя"
          rules={[{ required: true, message: 'Введите имя' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Фамилия"
          rules={[{ required: true, message: 'Введите фамилию' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Телефон"
          rules={[{ required: true, message: 'Введите телефон' }]}
        >
          <Input />
        </Form.Item>

        <Divider orientation="left">Профессиональная информация</Divider>

        <Form.Item
          name="specialization"
          label="Специализация"
          rules={[{ required: true, message: 'Выберите специализацию' }]}
        >
          <Select>
            {specialties.map(spec => (
              <Option key={spec} value={spec}>{spec}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="qualification"
          label="Квалификация"
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="bio"
          label="О себе"
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            size="large"
          >
            Сохранить
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default DoctorProfile;