import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchMedicines, 
  addMedicine, 
  updateMedicineStatus, 
  deleteMedicine,
  updateMedicinePrice
} from '../../redux/slices/MedicineSlice';
import { 
  Button, 
  Modal, 
  Table, 
  Form, 
  Input, 
  InputNumber, 
  Space, 
  message, 
  Switch,
  Row,
  Col,
  Select
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import '../../styles/adminTables.css';

const { Option } = Select;

const pharmSubgroups = [
  "А02А Антацидные средства",
  "А02В Противоязвенные средства и средства, применяемые при гастроэзофагеальной рефлюксной болезни",
  "А03А Средства, применяемые при нарушениях функции кишечника",
  "А03В Средства на основе красавки и ее производных",
  "A03F Прокинетики",
  "А04А Противорвотные средства и средства для устранения тошноты",
  "А05А Средства для лечения заболеваний желчевыводящих путей",
  "А05В Средства для лечения заболеваний печени, липотропные средства",
  "А06А Слабительные средства",
  "А07А Противомикробные средства, действующие на кишечник",
  "A07D Средства, снижающие моторную функцию желудочно-кишечного тракта",
  "А07Е Противовоспалительные средства, действующие на кишечник",
  "A07F Противодиарейные средства биологического происхождения, регулирующие равновесие кишечной микрофлоры (пробиотики)",
  "А09А Средства, способствующие пищеварению, включая ферменты",
  "А10А Инсулины и их аналоги",
  "А10В Пероральные гипогликемизирующие средства",
  "A11С Витамины А и D и их комбинации",
  "А11Н Прочие витамины (исключая комбинации)",
  "А12А Средства на основе кальция",
  "А12С Прочие минеральные добавки",
  "А16А Прочие средства для лечения заболеваний пищеварительного тракта и нарушений обмена веществ",
  "B01AA Антагонисты витамина К",
  "B01AB Прямые антикоагулянты на основе гепарина и его производных",
  "B01AC Ингибиторы агрегации тромбоцитов, исключая гепарин",
  "B01AE Прямые ингибиторы тромбина",
  "B01AF Прямые ингибиторы фактора Xa",
  "B02B Витамин К и другие гемостатики",
  "B03A Средства на основе железа",
  "B03B Витамин В12 и фолиевая кислота",
  "B03X Прочие противоанемические средства",
  "B05BA Растворы для парентерального питания",
  "B05BB Растворы, влияющие на электролитный баланс",
  "B05D Растворы для перитонеального диализа",
  "B05X Добавки к растворам для внутривенного введения",
  "B06A Прочие гематологические средства",
  "С01А Сердечные гликозиды",
  "С01В Антиаритмические средства, классы I и III",
  "С01D Периферические вазодилататоры, используемые при лечении заболеваний сердца",
  "С01Е Прочие средства для лечения заболеваний сердца",
  "С02А Средства центрального действия, уменьшающие стимулирующее влияние адренергической иннервации",
  "С02К Прочие антигипертензивные средства",
  "С03А Мочегонные средства с низким потолком дозы, тиазиды",
  "С03В Мочегонные средства с низким потолком дозы, исключая тиазиды",
  "С03С Мочегонные средства с высоким потолком дозы («петлевые» диуретики)",
  "C03D Калийсберегающие диуретики",
  "С04А Периферические вазодилататоры",
  "C05B Средства, применяемые при варикозном расширении вен",
  "С05С Средства, снижающие проницаемость капилляров (ангиопротекторы)",
  "С07А Бета-адреноблокаторы",
  "С08С Селективные блокаторы кальциевых каналов с преимущественным влиянием на сосуды",
  "C08D Селективные блокаторы кальциевых каналов с преимущественным влиянием на сердце",
  "С09А Ингибиторы ангиотензинпревращающего фермента",
  "С09В Ингибиторы ангиотензинпревращающего фермента в комбинации с другими средствами",
  "С09С Антагонисты ангиотензина II",
  "Н02А Кортикостероиды для системного применения",
  "Н03А Средства для лечения заболеваний щитовидной железы",
  "J02A Противогрибковые средства для системного применения",
  "М01А Нестероидные противовоспалительные и противоревматические средства",
  "М04А Противоподагрические средства",
  "N03A Противоэпилептические средства",
  "N05A Антипсихотические средства",
  "N06A Антидепрессанты",
  "N06B Психостимуляторы и ноотропные средства",
  "N07X Прочие средства для лечения заболеваний нервной системы",
  "R03A Адренергические средства для ингаляционного применения",
  "R03B Прочие средства ингаляционного применения для лечения обструктивных заболеваний дыхательных путей",
  "R05C Отхаркивающие средства, исключая комбинации с противокашлевыми средствами",
  "R06A Антигистаминные средства для системного применения",
  "S01EE Аналоги простагландинов",
  "S01EX Прочие средства для лечения глаукомы",
  "S01F Мидриатические и циклоплегические средства",
  "S01G Средства для устранения воспалительного отека (деконгестанты) и противоаллергические средства",
  "S01X Прочие офтальмологические средства",
  "V03A Прочие лекарственные средства"
];


const AdminMedicines = () => {
  const dispatch = useDispatch();
  const { items: medicines = [], status } = useSelector(state => state.medicine || {});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPriceModalVisible, setIsPriceModalVisible] = useState(false);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [currentMedicine, setCurrentMedicine] = useState(null);
  const [form] = Form.useForm();
  const [priceForm] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [searchSubgroup, setSearchSubgroup] = useState('');

  useEffect(() => {
    dispatch(fetchMedicines());
  }, [dispatch]);

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.ign.toLowerCase().includes(searchText.toLowerCase());
    const matchesSubgroup = medicine.pharmSubgroup.toLowerCase().includes(searchSubgroup.toLowerCase());
    return matchesSearch && matchesSubgroup;
  });

  const sortedMedicines = [...filteredMedicines].sort((a, b) => 
    a.pharmSubgroup.localeCompare(b.pharmSubgroup)
  );

  const handleAddMedicine = () => {
    setCurrentMedicine(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleDeleteMedicine = (id) => {
    Modal.confirm({
      title: 'Удалить лекарство?',
      content: 'Вы уверены, что хотите удалить это лекарство?',
      onOk: () => dispatch(deleteMedicine(id))
        .then(() => {
          message.success('Лекарство успешно удалено');
          dispatch(fetchMedicines());
        })
        .catch(() => message.error('Ошибка при удалении лекарства')),
    });
  };

  const handleOpenPriceModal = (medicine) => {
    setCurrentMedicine(medicine);
    priceForm.setFieldsValue({
      Price: parseFloat(medicine.price)
    });
    setIsPriceModalVisible(true);
  };

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        dispatch(addMedicine(values))
            .then(() => {
              message.success('Лекарство успешно добавлено');
              setIsModalVisible(false);
            });
      });
  };

  const handlePriceSubmit = () => {
    priceForm.validateFields()
      .then(({ Price }) => {
        dispatch(updateMedicinePrice({ id: currentMedicine.id, Price }))
          .then(() => {
            message.success('Цена лекарства обновлена');
            setIsPriceModalVisible(false);
          });
      });
  };

  const handleStatusChange = (medicine, checked) => {
    setCurrentMedicine(medicine);
    setIsStatusModalVisible(true);
  };

  const confirmStatusChange = () => {
    const newStatus = !currentMedicine.isAvailable;
    dispatch(updateMedicineStatus({ 
      id: currentMedicine.id, 
      isAvailable: newStatus 
    }))
    .then(() => {
      message.success(`Лекарство ${newStatus ? 'доступно' : 'недоступно'} в стране`);
      setIsStatusModalVisible(false);
    })
    .catch(() => {
      message.error('Ошибка при изменении статуса');
    });
  };

  return (
    <div className="admin-table-container">
      <div className="admin-table-title">
        <h2>Управление лекарствами</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAddMedicine}
          className="add-btn"
        >
          Добавить лекарство
        </Button>
      </div>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Input
            placeholder="Поиск по МНН"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            allowClear
          />
        </Col>
        <Col span={12}>
          <Input
            placeholder="Поиск по фарм. подгруппе"
            prefix={<SearchOutlined />}
            value={searchSubgroup}
            onChange={e => setSearchSubgroup(e.target.value)}
            allowClear
          />
        </Col>
      </Row>

      <Table 
        dataSource={sortedMedicines} 
        rowKey="id"
        loading={status === 'loading'}
        className="admin-table"
        scroll={{ x: true }}
      >
        <Table.Column 
          title="Фарм. подгруппа" 
          dataIndex="pharmSubgroup" 
          key="pharmSubgroup" 
          width="25%"
          sorter={(a, b) => a.pharmSubgroup.localeCompare(b.pharmSubgroup)}
          defaultSortOrder="ascend"
        />
        <Table.Column 
          title="МНН" 
          dataIndex="ign" 
          key="ign" 
          width="20%"
        />
        <Table.Column 
          title="Форма выпуска" 
          dataIndex="dosageForm" 
          key="dosageForm" 
          width="25%"
        />
        <Table.Column 
          title="Цена" 
          dataIndex="price" 
          key="price" 
          width="10%"
          render={(price, record) => (
            <Button type="link" onClick={() => handleOpenPriceModal(record)}>
              {price} BYN
            </Button>
          )}
        />
        <Table.Column 
          title="Статус" 
          dataIndex="isAvailable" 
          key="isAvailable"
          width="10%"
          render={(isAvailable, record) => (
            <Switch 
              checked={isAvailable} 
              checkedChildren="Доступен" 
              unCheckedChildren="Недоступен"
              onChange={(checked) => handleStatusChange(record, checked)}
            />
          )}
        />
        <Table.Column
          title="Действия"
          key="actions"
          width="10%"
          render={(_, record) => (
            <Space size="middle">
              <Button 
                danger 
                icon={<DeleteOutlined />} 
                onClick={() => handleDeleteMedicine(record.id)}
                className="action-btn"
              />
            </Space>
          )}
        />
      </Table>
      <Modal
        title="Подтверждение изменения статуса"
        visible={isStatusModalVisible}
        onOk={confirmStatusChange}
        onCancel={() => setIsStatusModalVisible(false)}
        okText="Подтвердить"
        cancelText="Отмена"
      >
        <p>Вы уверены, что хотите {currentMedicine?.isAvailable ? 'сделать недоступным' : 'сделать доступным'} лекарство <strong>{currentMedicine?.ign}</strong>?</p>
      </Modal>

      <Modal
        title={'Добавить лекарство'}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="Pharm_Subgroup"
            label="Фармацевтическая подгруппа"
            rules={[{ required: true, message: 'Выберите фармацевтическую подгруппу' }]}
          >
            {currentMedicine ? (
              <Input />
            ) : (
              <Select
                showSearch
                placeholder="Выберите фарм. подгруппу"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {pharmSubgroups.map(group => (
                  <Option key={group} value={group}>{group}</Option>
                ))}
              </Select>
            )}
          </Form.Item>

          <Form.Item
            name="IGN"
            label="Международное непатентованное название (МНН)"
            rules={[{ required: true, message: 'Введите МНН' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="Dosage_Form"
            label="Форма выпуска"
            rules={[{ required: true, message: 'Введите форму выпуска' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="Price"
            label="Цена"
            rules={[{ required: true, message: 'Укажите цену' }]}
          >
            <InputNumber 
              min={0} 
              step={0.01} 
              style={{ width: '100%' }} 
              formatter={value => `${value} BYN`}
              parser={value => value.replace(' BYN', '')}
            />
          </Form.Item>

          <Form.Item
            name="isAvailable"
            label="Статус"
            valuePropName="checked"
          >
            <Switch 
              checkedChildren="Доступен" 
              unCheckedChildren="Недоступен"
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Изменение цены для ${currentMedicine?.ign || ''}`}
        visible={isPriceModalVisible}
        onOk={handlePriceSubmit}
        onCancel={() => setIsPriceModalVisible(false)}
      >
        <Form form={priceForm} layout="vertical">
          <Form.Item
            name="Price"
            label="Новая цена"
            rules={[{ required: true, message: 'Укажите цену' }]}
          >
            <InputNumber 
              min={0} 
              step={0.01} 
              style={{ width: '100%' }} 
              formatter={value => `${value} BYN`}
              parser={value => value.replace(' BYN', '')}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminMedicines;