import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  SafeAreaView, FlatList, Dimensions, Modal, ScrollView,
  KeyboardTypeOptions 
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Search, Car, Check, Fuel, Settings2, Calendar, MapPin, Hash } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

const BRANDS = ['Audi', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Tesla', 'Toyota', 'Honda', 'Lexus', 'Porsche', 'Ford'];
const MODELS: Record<string, string[]> = {
  'Audi': ['A3', 'A4', 'A6', 'Q5', 'Q7', 'Q8', 'e-tron'],
  'BMW': ['3 Series', '5 Series', 'X3', 'X5', 'X7', 'iX', 'M4'],
  'Tesla': ['Model 3', 'Model Y', 'Model S', 'Model X'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLE', 'GLS', 'EQS'],
};

const FUELS = ['Бензин', 'Дизель', 'Гібрид', 'Електро', 'Газ/Бензин'];
const GEARBOXES = ['Автомат', 'Механіка', 'Робот', 'Варіатор'];
const DRIVES = ['Передній', 'Задній', 'Повний (AWD)'];

export default function AddCarScreen() {
  const router = useRouter();
  const { addCar } = useAuth();
  const [step, setStep] = useState(1); // 1: Brand, 2: Model, 3: Specs/Details
  
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [plate, setPlate] = useState('');
  const [year, setYear] = useState('');
  const [fuel, setFuel] = useState('Бензин');
  const [gearbox, setGearbox] = useState('Автомат');
  const [drive, setDrive] = useState('Передній');
  const [vin, setVin] = useState('');
  
  const [search, setSearch] = useState('');
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerType, setPickerType] = useState('');

  const filteredBrands = BRANDS.filter(b => b.toLowerCase().includes(search.toLowerCase()));
  const filteredModels = (selectedBrand ? MODELS[selectedBrand] || ['Інша модель'] : []).filter(m => m.toLowerCase().includes(search.toLowerCase()));

  const handleFinish = () => {
    addCar({
        brand: selectedBrand,
        model: selectedModel,
        plate: plate,
        year: year,
        fuel: fuel,
        gearbox: gearbox,
        drive: drive,
        vin: vin,
        mileage: 0,
        lastOilChangeMileage: 0,
        lastGearboxServiceMileage: 0,
        lastDiffServiceMileage: 0
    });
    router.replace('/settings');
  };

  const openPicker = (type: string) => {
    setPickerType(type);
    setPickerVisible(true);
  };

  const onSelectOption = (option: string) => {
    if (pickerType === 'fuel') setFuel(option);
    if (pickerType === 'gearbox') setGearbox(option);
    if (pickerType === 'drive') setDrive(option);
    setPickerVisible(false);
  };

  const getOptions = () => {
    if (pickerType === 'fuel') return FUELS;
    if (pickerType === 'gearbox') return GEARBOXES;
    if (pickerType === 'drive') return DRIVES;
    return [];
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={COLORS.foreground} />
        </TouchableOpacity>
        <Text style={styles.title}>Додати Автомобіль</Text>
        <Text style={styles.stepCount}>Крок {step}/3</Text>
      </View>

      <View style={styles.container}>
        {step === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Оберіть марку</Text>
            <View style={styles.searchBar}>
              <Search size={20} color={COLORS.muted} style={{ marginRight: 10 }} />
              <TextInput 
                placeholder="Пошук марки..." 
                placeholderTextColor={COLORS.muted}
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
              />
            </View>
            <FlatList 
              data={filteredBrands}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.brandItem}
                  onPress={() => {
                    setSelectedBrand(item);
                    setSearch('');
                    setStep(2);
                  }}
                >
                  <Text style={styles.brandText}>{item}</Text>
                  <ChevronLeft size={20} color={COLORS.muted} style={{ transform: [{ rotate: '180deg'}] }} />
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Оберіть модель {selectedBrand}</Text>
            <View style={styles.searchBar}>
              <Search size={20} color={COLORS.muted} style={{ marginRight: 10 }} />
              <TextInput 
                placeholder="Пошук моделі..." 
                placeholderTextColor={COLORS.muted}
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
              />
            </View>
            <FlatList 
              data={filteredModels}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.brandItem}
                  onPress={() => {
                    setSelectedModel(item);
                    setStep(3);
                  }}
                >
                  <Text style={styles.brandText}>{item}</Text>
                  <Check size={20} color={COLORS.accent} />
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {step === 3 && (
          <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.stepTitle}>Технічні деталі</Text>
            
            <View style={styles.finalHeader}>
                <View style={styles.carBadge}>
                    <Car size={32} color={COLORS.accent} />
                </View>
                <Text style={styles.carName}>{selectedBrand} {selectedModel}</Text>
            </View>

            <InputField label="Державний номер" value={plate} onChange={setPlate} icon={Hash} placeholder="Наприклад: AA 1234 BB" />
            <InputField label="Рік випуску" value={year} onChange={setYear} icon={Calendar} placeholder="Наприклад: 2021" keyboard="numeric" />
            
            <SelectField label="Тип палива" value={fuel} onPress={() => openPicker('fuel')} icon={Fuel} />
            <SelectField label="Коробка передач" value={gearbox} onPress={() => openPicker('gearbox')} icon={Settings2} />
            <SelectField label="Привід" value={drive} onPress={() => openPicker('drive')} icon={Settings2} />

            <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
              <Text style={styles.finishButtonText}>Завершити та додати</Text>
            </TouchableOpacity>
            <View style={{ height: 40 }} />
          </ScrollView>
        )}
      </View>

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

const InputField = ({ label, value, onChange, icon: Icon, placeholder, keyboard = 'default' as KeyboardTypeOptions }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Icon size={18} color={COLORS.muted} style={{ marginRight: 12 }} />
        <TextInput 
            style={styles.input}
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            placeholderTextColor={COLORS.muted}
            keyboardType={keyboard}
            autoCapitalize="characters"
        />
      </View>
    </View>
);

const SelectField = ({ label, value, onPress, icon: Icon }) => (
    <TouchableOpacity style={styles.inputGroup} onPress={onPress}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Icon size={18} color={COLORS.muted} style={{ marginRight: 12 }} />
        <Text style={styles.input}>{value || 'Оберіть...'}</Text>
        <ChevronLeft size={18} color={COLORS.muted} style={{ transform: [{ rotate: '270deg'}] }} />
      </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    justifyContent: 'space-between',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.foreground,
  },
  stepCount: {
    color: COLORS.accent,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.foreground,
    marginBottom: SPACING.xl,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    height: 54,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    color: COLORS.foreground,
    fontSize: 16,
  },
  brandItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  brandText: {
    fontSize: 18,
    color: COLORS.foreground,
  },
  finalHeader: {
      alignItems: 'center',
      marginBottom: SPACING.xl,
  },
  carBadge: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: COLORS.accentGlowSoft,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
  },
  carName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: COLORS.foreground,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    color: COLORS.muted,
    marginBottom: 6,
    fontSize: 12,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    height: 56,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    flex: 1,
    color: COLORS.foreground,
    fontSize: 16,
  },
  finishButton: {
    backgroundColor: COLORS.accent,
    height: 56,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  finishButtonText: {
    color: COLORS.foreground,
    fontSize: 18,
    fontWeight: 'bold',
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
});
