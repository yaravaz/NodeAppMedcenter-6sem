import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Descriptions, message, Select, Divider, Collapse, Tag, Typography,Empty,Row,Col,Tabs} from 'antd';
import { FaUserInjured, FaNotesMedical, FaPills, FaCalendarAlt,FaUserMd,FaClinicMedical,FaHeartbeat,FaEye,FaTooth,FaBrain,FaChild} from 'react-icons/fa';
import { fetchPatientById, createMedicalResult, fetchDiseases, fetchMedications, fetchMedicationResults,fetchPatientDiagnosisData, fetchDoctorByUserId} from '../../redux/slices/DoctorSlice';
import { fetchPatientByUserId} from '../../redux/slices/PatientSlice';
import { fetchDoctors } from '../../redux/slices/AdminSlice';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;
const { Title, Text } = Typography;

const PatientMedicalResultPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const { diseases, medications, results, patientDiagnosisData, doctor  } = useSelector(state => state.doctor);
  const { items: doctors } = useSelector(state => state.admin);
  const { currentPatient } = useSelector((state) => state.patient);
  const { user, token } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchDoctors());
    if (user?.id) {
        dispatch(fetchPatientByUserId({ userId: user.id, token }));
    }
  }, [dispatch, user?.id, token]);

  useEffect(() => {
    if(currentPatient){
      dispatch(fetchMedicationResults({ patientId: currentPatient.ID }));
      dispatch(fetchPatientDiagnosisData({ patientId: currentPatient.ID }));
    }
  }, [dispatch, currentPatient]);

  const getMergedResults = () => {
    if (!results || !patientDiagnosisData || !doctors) return [];
    
    return results.map(result => {
      const matchingDiagnosis = patientDiagnosisData.find(
        d => moment(d.date).isSame(moment(result.Date))
      );
      
      const recordDoctor = matchingDiagnosis?.doctorId 
        ? doctors.find(d => d.id === matchingDiagnosis.doctorId)
        : null;
      
      return {
        ...result,
        diseases: matchingDiagnosis?.diseases || [],
        medications: matchingDiagnosis?.medications || [],
        doctor: recordDoctor
      };
    }).sort((a, b) => new Date(b.Date) - new Date(a.Date));
  };

  const mergedResults = getMergedResults();

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
            {item.doctor ? (
              `${item.doctor.lastName} ${item.doctor.firstName} ${item.doctor.patronymic}`
            ) : (
              'Врач не указан'
            )}
          </Text>
        </div>
      </div>
    );
  };

  const groupedResults = React.useMemo(() => {
    if (!mergedResults.length) return {};
    console.log(mergedResults)
    
    return mergedResults.reduce((acc, record) => {
      const specialization = record.doctor?.specialization || 'Другое';
      if (!acc[specialization]) {
        acc[specialization] = [];
      }
      acc[specialization].push(record);
      return acc;
    }, {});
  }, [mergedResults]);

  const renderSpecialtyTab = (specialization, records) => {
    return (
      <Collapse 
        accordion 
        style={{ marginBottom: 24 }}
        defaultActiveKey={[0]}
      >
        {records.map((item, index) => (
          <Panel 
            header={`Обследование от ${moment(item.Date).format('DD.MM.YYYY HH:mm')}`}
            key={item.id || index}
            extra={<Tag color="blue">{specialization}</Tag>}
          >
            {renderMedicalRecord(item, index)}
          </Panel>
        ))}
      </Collapse>
    );
  };

  return (
    <div className="medical-card-page">
        {currentPatient && (
          <>
            <Divider orientation="left">История обследований по направлениям</Divider>
            
            {mergedResults.length > 0 ? (
              <Tabs
                defaultActiveKey="all"
                tabPosition="left"
                style={{ minHeight: 400 }}
              >
                <Tabs.TabPane
                  tab={
                    <span>
                      <FaUserMd />
                      Все записи ({mergedResults.length})
                    </span>
                  }
                  key="all"
                >
                  <Collapse 
                    accordion 
                    style={{ marginBottom: 24 }}
                    defaultActiveKey={[0]}
                  >
                    {mergedResults.map((item, index) => (
                      <Panel 
                        header={`Обследование от ${moment(item.Date).format('DD.MM.YYYY HH:mm')}`}
                        key={item.id || index}
                        extra={<Tag color="blue">{item.doctor?.specialty || 'Другое'}</Tag>}
                      >
                        {renderMedicalRecord(item, index)}
                      </Panel>
                    ))}
                  </Collapse>
                </Tabs.TabPane>

                {Object.entries(groupedResults).map(([specialty, records]) => (
                  <Tabs.TabPane
                    tab={
                      <span>
                        {specialty} ({records.length})
                      </span>
                    }
                    key={specialty}
                  >
                    {renderSpecialtyTab(specialty, records)}
                  </Tabs.TabPane>
                ))}
              </Tabs>
            ) : (
              <Empty 
                description="Нет данных о медицинских обследованиях" 
                style={{ marginBottom: 24 }}
              />
            )}
          </>
        )}
    </div>
  );

  // return (
  //   <div className="medical-card-page">
  //       {currentPatient && (
  //         <>
  //           <Divider orientation="left">История медицинских обследований</Divider>
            
  //           {mergedResults.length > 0 ? (
  //             <Collapse 
  //               accordion 
  //               style={{ marginBottom: 24 }}
  //               defaultActiveKey={[0]}
  //             >
  //               {mergedResults.map((item, index) => (
  //                 <Panel 
  //                   header={`Обследование от ${moment(item.Date).format('DD.MM.YYYY HH:mm')}`}
  //                   key={item.id || index}
  //                 >
  //                   {renderMedicalRecord(item, index)}
  //                 </Panel>
  //               ))}
  //             </Collapse>
  //           ) : (
  //             <Empty 
  //               description="Нет данных о медицинских обследованиях" 
  //               style={{ marginBottom: 24 }}
  //             />
  //           )}

  //         </>
  //       )}
  //   </div>
  // );
};

export default PatientMedicalResultPage;