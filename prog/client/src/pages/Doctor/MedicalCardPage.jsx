import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Descriptions, message, Select, Divider, Collapse, Tag, Typography,Empty,Row,Col} from 'antd';
import { FaUserInjured, FaNotesMedical, FaSave, FaPills, FaStethoscope,FaCalendarAlt,FaUserMd} from 'react-icons/fa';
import { fetchPatientById, createMedicalResult, fetchDiseases, fetchMedications, fetchMedicationResults,fetchPatientDiagnosisData, fetchDoctorByUserId} from '../../redux/slices/DoctorSlice';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;
const { Title, Text } = Typography;

const MedicalCardPage = () => {
  const { patientId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const { currentPatient, diseases, medications, results, status, patientDiagnosisData, doctor  } = useSelector(state => state.doctor);
  const { user } = useSelector(state => state.auth);
  
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [selectedMedications, setSelectedMedications] = useState([]);
  const [dosages, setDosages] = useState({});
  const [durations, setDurations] = useState({});
  const [loading, setLoading] = useState(false);

  console.log(currentPatient)

  useEffect(() => {
      if (user?.id) {
        dispatch(fetchDoctorByUserId(user.id));
      }
    }, [dispatch, user?.id]);

  useEffect(() => {
    dispatch(fetchPatientById({ patientId }));
    dispatch(fetchMedicationResults({ patientId }));
    dispatch(fetchDiseases());
    dispatch(fetchMedications());
    dispatch(fetchPatientDiagnosisData({ patientId }));
  }, [dispatch, patientId]);

  const handleDiseaseChange = (values) => {
    setSelectedDiseases(values);
  };

  const handleMedicationChange = (values) => {
    setSelectedMedications(values);
  };

  const handleDosageChange = (medId, value) => {
    setDosages(prev => ({ ...prev, [medId]: value }));
  };

  const handleDurationChange = (medId, value) => {
    setDurations(prev => ({ ...prev, [medId]: value }));
  };

  const getMergedResults = () => {
    if (!results || !patientDiagnosisData) return [];
    
    return results.map(result => {
      const matchingDiagnosis = patientDiagnosisData.find(
        d => moment(d.date).isSame(moment(result.Date))
      );
      
      return {
        ...result,
        diseases: matchingDiagnosis?.diseases || [],
        medications: matchingDiagnosis?.medications || []
      };
    }).sort((a, b) => new Date(b.Date) - new Date(a.Date));
  };

  const mergedResults = getMergedResults();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const medicalResultData = {
        patientId,
        description: values.description,
        diseases: selectedDiseases,
        medications: selectedMedications.map(medId => ({
          medicationId: medId,
          dosage: dosages[medId],
          duration: durations[medId]
        }))
      };
      
      await dispatch(createMedicalResult(medicalResultData)).unwrap();
      message.success('Медицинский результат успешно сохранен');
      form.resetFields();
      setSelectedDiseases([]);
      setSelectedMedications([]);
      dispatch(fetchMedicationResults({ patientId }));
      dispatch(fetchPatientDiagnosisData({ patientId }));
    } catch (err) {
      message.error('Ошибка при сохранении данных');
    } finally {
      setLoading(false);
    }
  };

  const renderDiagnosesSection = (diagnoses) => {
    if (!diagnoses || diagnoses.length === 0) {
      return (
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">Диагнозы не указаны</Text>
        </div>
      );
    }

    return (
      <div style={{ marginTop: 16 }}>
        <Title level={5} style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
          <FaStethoscope style={{ marginRight: 8, color: '#ff4d4f' }} />
          Диагнозы
        </Title>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {diagnoses.map(disease => (
            <Tag 
              color="red" 
              key={disease.id} 
              style={{ 
                fontSize: 14, 
                padding: '4px 8px',
                borderRadius: 4,
                marginBottom: 4
              }}
            >
              {disease.name}
            </Tag>
          ))}
        </div>
      </div>
    );
  };

  const renderMedicationsSection = (medications) => {
    if (!medications || medications.length === 0) {
      return (
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">Лекарства не назначены</Text>
        </div>
      );
    }

    return (
      <div style={{ marginTop: 16 }}>
        <Title level={5} style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
          <FaPills style={{ marginRight: 8, color: '#1890ff' }} />
          Назначения
        </Title>
        <div style={{ background: '#fafafa', borderRadius: 8, padding: 12 }}>
          {medications.map((medication, idx) => (
            <div key={idx} style={{ 
              marginBottom: idx !== medications.length - 1 ? 12 : 0,
              paddingBottom: idx !== medications.length - 1 ? 12 : 0,
              borderBottom: idx !== medications.length - 1 ? '1px dashed #f0f0f0' : 'none'
            }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Text strong>{medication.name}</Text>
                  <div style={{ marginTop: 4 }}>
                    <Text type="secondary">{medication.form}</Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text>Дозировка: <Text strong>{medication.dosage}</Text></Text>
                    <Text>Продолжительность: <Text strong>{medication.duration} дней</Text></Text>
                  </div>
                </Col>
              </Row>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMedicalRecord = (item, index) => {
    return (
      <div style={{ padding: 16 }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaCalendarAlt style={{ marginRight: 8, color: '#888' }} />
            <Text strong>
              {moment(item.Date).format('DD.MM.YYYY HH:mm')}
            </Text>
          </div>
          <Tag color="#108ee9">Запись #{mergedResults.length - index}</Tag>
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <Title level={5} style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
            <FaNotesMedical style={{ marginRight: 8, color: '#52c41a' }} />
            Заключение врача
          </Title>
          <div style={{ 
            background: '#f6ffed', 
            padding: 12, 
            borderRadius: 8,
            borderLeft: '4px solid #52c41a'
          }}>
            <Text>{item.Result_Description || 'Описание отсутствует'}</Text>
          </div>
        </div>
        
        {renderDiagnosesSection(item.diseases)}
        {renderMedicationsSection(item.medications)}
        
        <div style={{ 
          marginTop: 16,
          paddingTop: 16,
          borderTop: '1px dashed #f0f0f0',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <Text type="secondary" style={{ display: 'flex', alignItems: 'center' }}>
            <FaUserMd style={{ marginRight: 8 }} />
            {doctor.lastName} {doctor.firstName} {doctor.patronymic}
          </Text>
        </div>
      </div>
    );
  };

  return (
    <div className="medical-card-page">
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaUserInjured style={{ marginRight: 10 }} />
            <span>Медицинская карта пациента</span>
          </div>
        }
        extra={<Button onClick={() => navigate(-1)}>Назад к расписанию</Button>}
      >
        {currentPatient && (
          <>
            <Descriptions bordered column={1} style={{ marginBottom: 24 }}>
              <Descriptions.Item label="ФИО">
                {`${currentPatient.lastName} ${currentPatient.firstName} ${currentPatient.patronymic}`}
              </Descriptions.Item>
              <Descriptions.Item label="Дата рождения">
                {currentPatient.birthdate ? moment(currentPatient.birthdate).format('DD.MM.YYYY') : 'Не указана'}
              </Descriptions.Item>
              <Descriptions.Item label="Возраст">
                {currentPatient.birthdate ? `${moment().diff(currentPatient.birthdate, 'years')} лет` : 'Не указан'}
              </Descriptions.Item>
              <Descriptions.Item label="Телефон">
                {currentPatient.phone || 'Не указан'}
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">История медицинских обследований</Divider>
            
            {mergedResults.length > 0 ? (
              <Collapse 
                accordion 
                style={{ marginBottom: 24 }}
                defaultActiveKey={[0]}
              >
                {mergedResults.map((item, index) => (
                  <Panel 
                    header={`Обследование от ${moment(item.Date).format('DD.MM.YYYY HH:mm')}`}
                    key={item.id || index}
                  >
                    {renderMedicalRecord(item, index)}
                  </Panel>
                ))}
              </Collapse>
            ) : (
              <Empty 
                description="Нет данных о медицинских обследованиях" 
                style={{ marginBottom: 24 }}
              />
            )}

            <Divider orientation="left">Новое медицинское обследование</Divider>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
            >
              <Form.Item
                name="description"
                label="Заключение врача"
                rules={[{ required: true, message: 'Пожалуйста, введите описание' }]}
              >
                <TextArea 
                  rows={4} 
                  placeholder="Опишите результаты осмотра, жалобы пациента, проведенные процедуры и рекомендации" 
                />
              </Form.Item>

              <Form.Item label="Диагнозы">
                <Select
                  mode="multiple"
                  placeholder="Выберите диагнозы"
                  value={selectedDiseases}
                  onChange={handleDiseaseChange}
                  style={{ width: '100%' }}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {diseases?.map(disease => (
                    <Option key={disease.ID} value={disease.ID}>
                      {disease.Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Назначения">
                <Select
                  mode="multiple"
                  placeholder="Выберите лекарственные препараты"
                  value={selectedMedications}
                  onChange={handleMedicationChange}
                  style={{ width: '100%' }}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {medications?.map(med => (
                    <Option key={med.ID} value={med.ID}>
                      {med.IGN} ({med.Dosage_Form})
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {selectedMedications.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <Title level={5} style={{ marginBottom: 16 }}>
                    Укажите дозировки и продолжительность приема
                  </Title>
                  {selectedMedications.map(medId => {
                    const medication = medications.find(m => m.ID === medId);
                    return (
                      <Card 
                        key={medId} 
                        size="small" 
                        style={{ marginBottom: 16 }}
                        title={medication?.IGN}
                      >
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              label="Дозировка"
                              help="Например: 1 таблетка 2 раза в день"
                            >
                              <Input
                                placeholder="Дозировка"
                                value={dosages[medId] || ''}
                                onChange={(e) => handleDosageChange(medId, e.target.value)}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label="Продолжительность (дней)"
                            >
                              <Input
                                type="number"
                                placeholder="Количество дней"
                                value={durations[medId] || ''}
                                onChange={(e) => handleDurationChange(medId, e.target.value)}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Card>
                    );
                  })}
                </div>
              )}

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<FaSave />}
                  loading={loading}
                  size="large"
                  style={{ width: '100%', maxWidth: 300 }}
                >
                  Сохранить запись
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </Card>
    </div>
  );
};

export default MedicalCardPage;