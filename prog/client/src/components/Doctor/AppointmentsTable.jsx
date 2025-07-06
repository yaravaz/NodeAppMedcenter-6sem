import React, { useEffect } from 'react';
import { Table, Tag, Button, Space, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments, updateAppointmentStatus} from '../../redux/slices/DoctorSlice';
import moment from 'moment';

const statusColors = {
  pending: 'orange',
  confirmed: 'green',
  cancelled: 'red',
  completed: 'blue'
};

const statusText = {
  pending: 'Ожидание',
  confirmed: 'Подтвержден',
  cancelled: 'Отменен',
  completed: 'Завершен'
};

const AppointmentsTable = () => {
  const dispatch = useDispatch();
  const { appointments, status, doctor } = useSelector(state => state.doctor);
  const token = useSelector(state => state.auth.token);

  console.log(doctor)
  useEffect(() => {
    if (doctor?.id ) {
      dispatch(fetchAppointments({ doctorId: doctor.id, token }));
    }
  }, [dispatch, doctor?.id, token, appointments.length]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await dispatch(updateAppointmentStatus({ 
        appointmentId: id, 
        status: newStatus,
        token
      })).unwrap();
      
      message.success('Статус обновлен');
      dispatch(fetchAppointments({ doctorId: doctor.id, token }));
    } catch (error) {
      message.error('Ошибка обновления');
    }
  };

  const columns = [
    {
      title: 'Пациент',
      render: (_, record) => (
        <span>
          {record.patient?.lastName} {record.patient?.firstName}
        </span>
      )
    },
    {
      title: 'Дата приема',
      dataIndex: 'date',
      render: date => moment(date).format('DD.MM.YYYY HH:mm')
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      render: status => (
        <Tag color={statusColors[status]}>
          {statusText[status]}
        </Tag>
      )
    },
    {
      title: 'Действия',
      render: (_, record) => (
        <Space size="middle">
          {record.status === 'pending' && (
            <>
              <Button 
                size="small" 
                onClick={() => handleStatusChange(record.id, 'confirmed')}
              >
                Подтвердить
              </Button>
              <Button 
                size="small" 
                danger
                onClick={() => handleStatusChange(record.id, 'cancelled')}
              >
                Отменить
              </Button>
            </>
          )}
          {record.status === 'confirmed' && (
            <Button 
              size="small" 
              type="primary"
              onClick={() => handleStatusChange(record.id, 'completed')}
            >
              Завершить
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={appointments}
      loading={status === 'loading'}
      rowKey="id"
      pagination={{ pageSize: 8 }}
    />
  );
};

export default AppointmentsTable;