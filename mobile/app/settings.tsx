import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, ScrollView, TouchableOpacity, 
  SafeAreaView, Dimensions, TextInput, Alert, Platform, Modal,
  KeyboardTypeOptions
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, User, Car, History, 
  Settings as SettingsIcon, LogOut, ChevronRight, Phone, Mail,
  MapPin, Calendar, Hash, Fuel, Settings2, Save, Activity, Info
} from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

const CITIES = ['Київ', 'Львів', 'Одеса', 'Харків', 'Дніпро', 'Вінниця', 'Запоріжжя'];
const FUELS = ['Бензин', 'Дизель', 'Гібрид', 'Електро', 'Газ/Бензин'];
const GEARBOXES = ['Автомат', 'Механіка', 'Робот', 'Варіатор'];
const DRIVES = ['Передній', 'Задній', 'Повний (AWD)'];

const TABS = [
  { id: 'data', label: 'Дані' },
  { id: 'cars', label: 'Авто' },
  { id: 'orders', label: 'Замовлення' },
  { id: 'more', label: 'Інше' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { logout, user, cars, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('data');

  // Profile Data State (local for editing, then synced)
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profileCity, setProfileCity] = useState(user?.city || '');
  const [profileBirthday, setProfileBirthday] = useState(user?.birthday || '');

  // Car Data for editing
  const [isEditingCar, setIsEditingCar] = useState(false);
  const [selectedCarIndex, setSelectedCarIndex] = useState<number | null>(null);
  const [editCarData, setEditCarData] = useState<any>(null);

  // Picker States
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerType, setPickerType] = useState(''); // 'city', 'fuel', 'gearbox', 'drive'

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  const handleSaveProfile = () => {
    updateUser({
        name: profileName,
        phone: profilePhone,
        email: profileEmail,
        city: profileCity,
        birthday: profileBirthday
    });
    Alert.alert('Профіль', 'Ваші особисті дані збережено!');
  };

  const startEditCar = (car: any, index: number) => {
      setEditCarData({ ...car });
      setSelectedCarIndex(index);
      setIsEditingCar(true);
  };

  const handleSaveCar = () => {
    const currentMileage = parseInt(editCarData.mileage.toString()) || 0;
    const suggestions = [];

    if (currentMileage - editCarData.lastOilChangeMileage >= 10000) {
      suggestions.push("Мотор: пора замінити мастило (кожні 10к км)");
    }

    const gearboxThreshold = editCarData.gearbox === 'Автомат' ? 60000 : 100000;
    if (currentMileage - editCarData.lastGearboxServiceMileage >= gearboxThreshold) {
      suggestions.push(`КПП (${editCarData.gearbox}): рекомендована заміна мастила (кожні ${gearboxThreshold/1000}к км)`);
    }

    if (editCarData.drive === 'Повний (AWD)' || editCarData.drive === 'Задній') {
        if (editCarData.lastDiffServiceMileage === 0 || currentMileage - editCarData.lastDiffServiceMileage >= 100000) {
            suggestions.push(`Редуктор (${editCarData.drive}): Рекомендуємо перевірити мастило (кожні 100к км)`);
        }
    }

    if (suggestions.length > 0) {
        Alert.alert(
            'Сервісна рекомендація 🛠️',
            `На основі вашого пробігу (${currentMileage} км) ми рекомендуємо:\n\n• ${suggestions.join('\n• ')}\n\nБажаєте записатися на сервіс?`,
            [
                { text: 'Пізніше', style: 'cancel', onPress: () => setIsEditingCar(false) },
                { text: 'Записатися', onPress: () => {
                    setIsEditingCar(false);
                    router.replace('/');
                }}
            ]
        );
    } else {
        Alert.alert('Автомобіль', 'Дані автомобіля успішно оновлено!');
        setIsEditingCar(false);
    }
  };

  const openPicker = (type: string) => {
      setPickerType(type);
      setPickerVisible(true);
  };

  const onSelectOption = (option: string) => {
      if (pickerType === 'city') setProfileCity(option);
      if (pickerType === 'fuel') setEditCarData({...editCarData, fuel: option});
      if (pickerType === 'gearbox') setEditCarData({...editCarData, gearbox: option});
      if (pickerType === 'drive') setEditCarData({...editCarData, drive: option});
      setPickerVisible(false);
  };

  const getOptions = () => {
      if (pickerType === 'city') return CITIES;
      if (pickerType === 'fuel') return FUELS;
      if (pickerType === 'gearbox') return GEARBOXES;
      if (pickerType === 'drive') return DRIVES;
      return [];
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={COLORS.foreground} />
        </TouchableOpacity>
        <Text style={styles.title}>Мій Профіль</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.tabsContainer}>
        {TABS.map(tab => (
          <TouchableOpacity 
            key={tab.id} 
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => {
                setActiveTab(tab.id);
                setIsEditingCar(false);
            }}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'data' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionHeader}>Особиста інформація</Text>
            <InputField label="Повне ім'я" value={profileName} onChange={setProfileName} icon={User} />
            <InputField label="Номер телефону" value={profilePhone} onChange={setProfilePhone} icon={Phone} keyboard="phone-pad" />
            <InputField label="Email адреса" value={profileEmail} onChange={setProfileEmail} icon={Mail} keyboard="email-address" />
            <SelectField label="Місто" value={profileCity} onPress={() => openPicker('city')} icon={MapPin} />
            <InputField label="Дата народження" value={profileBirthday} onChange={setProfileBirthday} icon={Calendar} />

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
              <Text style={styles.saveButtonText}>Зберегти зміни</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'cars' && (
          <View style={styles.tabContent}>
            {!isEditingCar ? (
              <View>
                <Text style={styles.sectionHeader}>Ваші автомобілі ({cars.length})</Text>
                {cars.map((car, index) => (
                    <TouchableOpacity key={car.id} style={styles.itemCard} onPress={() => startEditCar(car, index)}>
                        <View style={[styles.itemIcon, { backgroundColor: COLORS.accentGlowSoft }]}>
                            <Car size={32} color={COLORS.accent} />
                        </View>
                        <View style={styles.itemTextContent}>
                            <Text style={styles.itemName}>{car.brand} {car.model}</Text>
                            <Text style={styles.itemSubtitle}>{car.plate || 'Без номерів'} • {car.year} рік</Text>
                            <View style={styles.mileageBadge}>
                                <Activity size={12} color={COLORS.accent} />
                                <Text style={styles.mileageText}>{car.mileage} км</Text>
                            </View>
                        </View>
                        <View style={styles.editBadge}>
                            <Text style={styles.editText}>Деталі</Text>
                            <ChevronRight size={16} color={COLORS.accent} />
                        </View>
                    </TouchableOpacity>
                ))}

                <TouchableOpacity style={styles.addCarBtn} onPress={() => router.push('/add-car')}>
                  <Text style={styles.addCarBtnText}>+ Додати ще одне авто</Text>
                </TouchableOpacity>
              </View>
            ) : (
                <View style={styles.editCarSection}>
                    <Text style={styles.sectionHeader}>Технічні дані {editCarData?.brand}</Text>
                    
                    <InputField label="Державний номер" value={editCarData.plate} onChange={(v) => setEditCarData({...editCarData, plate: v})} icon={Hash} />
                    <InputField label="Рік випуску" value={editCarData.year} onChange={(v) => setEditCarData({...editCarData, year: v})} icon={Calendar} keyboard="numeric" />
                    <InputField label="VIN-код" value={editCarData.vin} onChange={(v) => setEditCarData({...editCarData, vin: v})} icon={Hash} />
                    
                    <SelectField label="Тип палива" value={editCarData.fuel} onPress={() => openPicker('fuel')} icon={Fuel} />
                    <SelectField label="Коробка передач" value={editCarData.gearbox} onPress={() => openPicker('gearbox')} icon={Settings2} />
                    <SelectField label="Привід" value={editCarData.drive} onPress={() => openPicker('drive')} icon={Settings2} />

                    <View style={styles.divider} />
                    <Text style={styles.sectionHeader}>Сервісний облік</Text>
                    
                    <InputField label="Поточний пробіг (км)" value={editCarData.mileage.toString()} onChange={(v) => setEditCarData({...editCarData, mileage: v})} icon={Activity} keyboard="numeric" />
                    <InputField label="Остання заміна масла (км)" value={editCarData.lastOilChangeMileage.toString()} onChange={(v) => setEditCarData({...editCarData, lastOilChangeMileage: parseInt(v) || 0})} icon={Settings2} keyboard="numeric" />
                    <InputField label="Остання заміна в КПП (км)" value={editCarData.lastGearboxServiceMileage.toString()} onChange={(v) => setEditCarData({...editCarData, lastGearboxServiceMileage: parseInt(v) || 0})} icon={Settings2} keyboard="numeric" />

                    {(editCarData.drive === 'Повний (AWD)' || editCarData.drive === 'Задній') && (
                        <InputField label="Мастило в редукторах (км)" value={editCarData.lastDiffServiceMileage.toString()} onChange={(v) => setEditCarData({...editCarData, lastDiffServiceMileage: parseInt(v) || 0})} icon={Settings2} keyboard="numeric" />
                    )}

                    <View style={styles.editActions}>
                        <TouchableOpacity style={[styles.saveButton, {flex: 1}]} onPress={handleSaveCar}>
                            <Text style={styles.saveButtonText}>Зберегти оновлення</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditingCar(false)}>
                            <Text style={styles.cancelButtonText}>Назад</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
          </View>
        )}

        {activeTab === 'orders' && (
            <View style={styles.tabContent}>
                <Text style={styles.sectionHeader}>Історія замовлень</Text>
                <TouchableOpacity style={styles.itemCard}>
                    <View style={styles.itemIcon}><History size={20} color={COLORS.foreground} /></View>
                    <View style={styles.itemTextContent}>
                        <Text style={styles.itemName}>Заміна масла</Text>
                        <Text style={styles.itemSubtitle}>112,000 км • 12.04.2026</Text>
                    </View>
                    <Text style={styles.price}>1500₴</Text>
                </TouchableOpacity>
            </View>
        )}

        {activeTab === 'more' && (
           <View style={styles.tabContent}>
             <TouchableOpacity style={styles.menuItem}>
               <Text style={styles.menuText}>Політика конфіденційності</Text>
               <ChevronRight size={20} color={COLORS.muted} />
             </TouchableOpacity>
             <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0, marginTop: 20 }]} onPress={handleLogout}>
               <LogOut size={20} color="#ff4444" />
               <Text style={[styles.menuText, { color: '#ff4444' }]}>Вийти з системи</Text>
             </TouchableOpacity>
           </View>
        )}
      </ScrollView>

      <Modal visible={pickerVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
              <View style={styles.pickerContainer}>
                  <Text style={styles.pickerTitle}>Оберіть варіант</Text>
                  <ScrollView>
                      {getOptions().map(opt => (
                          <TouchableOpacity key={opt} style={styles.pickerOption} onPress={() => onSelectOption(opt)}>
                              <Text style={styles.pickerOptionText}>{opt}</Text>
                          </TouchableOpacity>
                      ))}
                  </ScrollView>
                  <TouchableOpacity style={styles.modalClose} onPress={() => setPickerVisible(false)}>
                      <Text style={styles.modalCloseText}>Закрити</Text>
                  </TouchableOpacity>
              </View>
          </View>
      </Modal>
    </SafeAreaView>
  );
}

const InputField = ({ label, value, onChange, icon: Icon, keyboard = 'default' as KeyboardTypeOptions }) => (
    <View style={styles.inputCard}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Icon size={18} color={COLORS.muted} style={{ marginRight: 12 }} />
        <TextInput 
            style={styles.settingsInput}
            value={value?.toString()}
            onChangeText={onChange}
            placeholder={label}
            placeholderTextColor={COLORS.muted}
            keyboardType={keyboard}
        />
      </View>
    </View>
);

const SelectField = ({ label, value, onPress, icon: Icon }) => (
    <TouchableOpacity style={styles.inputCard} onPress={onPress}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Icon size={18} color={COLORS.muted} style={{ marginRight: 12 }} />
        <Text style={styles.settingsInput}>{value || 'Оберіть...'}</Text>
        <ChevronRight size={18} color={COLORS.muted} />
      </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.foreground,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: 8,
    marginBottom: SPACING.sm,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
  },
  activeTab: {
    backgroundColor: COLORS.accent,
  },
  tabText: {
    color: COLORS.muted,
    fontWeight: '600',
    fontSize: 14,
  },
  activeTabText: {
    color: COLORS.foreground,
  },
  tabContent: {
    flex: 1,
  },
  editCarSection: {
    flex: 1,
  },
  sectionHeader: {
      fontSize: 20,
      fontWeight: 'bold',
      color: COLORS.foreground,
      marginBottom: SPACING.lg,
      marginTop: SPACING.sm,
  },
  divider: {
      height: 1,
      backgroundColor: COLORS.border,
      marginVertical: SPACING.lg,
  },
  inputCard: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 6,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  settingsInput: {
    flex: 1,
    color: COLORS.foreground,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: COLORS.accent,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  saveButtonText: {
    color: COLORS.foreground,
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: 24,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  itemTextContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.foreground,
  },
  itemSubtitle: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 2,
  },
  mileageBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.accentGlowSoft,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
      marginTop: 6,
      alignSelf: 'flex-start',
  },
  mileageText: {
      fontSize: 12,
      color: COLORS.accent,
      fontWeight: 'bold',
      marginLeft: 4,
  },
  editBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
  },
  editText: {
      color: COLORS.accent,
      fontWeight: 'bold',
      fontSize: 14,
  },
  editActions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 20,
  },
  cancelButton: {
      height: 56,
      paddingHorizontal: 20,
      backgroundColor: COLORS.surface,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: SPACING.lg,
  },
  cancelButtonText: {
      color: COLORS.muted,
      fontWeight: '600',
  },
  price: {
      fontSize: 16,
      fontWeight: 'bold',
      color: COLORS.accent,
  },
  modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'flex-end',
  },
  pickerContainer: {
      backgroundColor: COLORS.background,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      padding: SPACING.xl,
      maxHeight: height * 0.7,
  },
  pickerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: COLORS.foreground,
      marginBottom: SPACING.lg,
      textAlign: 'center',
  },
  pickerOption: {
      paddingVertical: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
  },
  pickerOptionText: {
      fontSize: 18,
      color: COLORS.foreground,
      textAlign: 'center',
  },
  modalClose: {
      marginTop: SPACING.lg,
      paddingVertical: SPACING.md,
      backgroundColor: COLORS.surface,
      borderRadius: 16,
  },
  modalCloseText: {
      color: COLORS.foreground,
      textAlign: 'center',
      fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.foreground,
  },
  addCarBtn: {
      padding: SPACING.md,
      alignItems: 'center',
      marginTop: 10,
  },
  addCarBtnText: {
      color: COLORS.accent,
      fontWeight: '600',
  },
});
