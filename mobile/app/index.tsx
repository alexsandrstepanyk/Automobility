import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, ScrollView, 
  SafeAreaView, Dimensions, Platform, Alert 
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MotiView, AnimatePresence } from 'moti';
import { 
  Droplets, Settings, Disc, Car, Activity, 
  Globe, Settings as SettingsIcon, CheckCircle, ChevronRight, Search 
} from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const SERVICES = [
  { id: 'oil', name: 'Заміна масла', icon: Droplets, price: '~1500₴' },
  { id: 'brakes', name: 'Заміна тормозів', icon: Settings, price: '~1200₴' },
  { id: 'wheels', name: 'Заміна коліс', icon: Disc, price: '~800₴' },
  { id: 'detailing', name: 'Хімчистка', icon: Car, price: '~2500₴' },
  { id: 'buying_help', name: 'Допомога в купівлі', icon: Search, price: '~2000₴' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  console.log('App Reloaded: V1.1 - Smart Maintenance Active');

  const toggleService = (id: string) => {
    console.log('Toggling service:', id);
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerInfo} 
            onPress={() => !isLoggedIn ? router.push('/login') : router.push('/add-car')}
          >
            <Text style={styles.headerTitle}>{isLoggedIn ? 'Привіт, Олександре! 👋' : 'Привіт! 👋'}</Text>
            <Text style={styles.headerSubtitle}>
              {isLoggedIn ? 'Audi Q7 (AA 0001 AA)' : 'Авто не додано. Натисніть щоб додати'}
            </Text>
          </TouchableOpacity>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => Alert.alert('Мова', 'Ця функція в розробці. Незабаром ви зможете змінити мову на EN або PL.')}
            >
              <Globe size={24} color={COLORS.foreground} />
            </TouchableOpacity>
            {isLoggedIn && (
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => router.push('/settings')}
              >
                <SettingsIcon size={24} color={COLORS.foreground} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Services List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Оберіть послуги</Text>
          <View style={styles.servicesGrid}>
            {SERVICES.map((service, index) => {
              const isSelected = selectedServices.includes(service.id);
              const Icon = service.icon;
              
              return (
                <TouchableOpacity
                  key={service.id}
                  activeOpacity={0.8}
                  style={[
                    styles.serviceCard,
                    isSelected && styles.serviceCardSelected
                  ]}
                  onPress={() => toggleService(service.id)}
                >
                  <View style={styles.cardIconContainer}>
                    <Icon size={24} color={isSelected ? COLORS.foreground : COLORS.accent} />
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardName}>{service.name}</Text>
                    <Text style={styles.cardPrice}>Орієнтовно {service.price}</Text>
                  </View>
                  <View style={[
                    styles.checkbox,
                    isSelected && styles.checkboxSelected
                  ]}>
                    {isSelected && <CheckCircle size={16} color={COLORS.foreground} />}
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Special Service: Diagnostics */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.serviceCard,
                styles.diagnosticsCard,
                selectedServices.includes('diagnostics') && styles.serviceCardSelected
              ]}
              onPress={() => toggleService('diagnostics')}
            >
              <View style={[styles.cardIconContainer, { backgroundColor: COLORS.accent }]}>
                <Activity size={24} color={COLORS.foreground} />
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.cardName, { color: COLORS.foreground }]}>Діагностика на виїзді</Text>
                <Text style={[styles.cardPrice, { color: 'rgba(255,255,255,0.7)' }]}>Орієнтовно ~1000₴</Text>
              </View>
              <View style={[
                styles.checkbox,
                { borderColor: COLORS.foreground },
                selectedServices.includes('diagnostics') && styles.checkboxSelected
              ]}>
                {selectedServices.includes('diagnostics') && <CheckCircle size={16} color={COLORS.foreground} />}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Authentication Options (only if guest) */}
        {!isLoggedIn && (
          <View style={styles.authSection}>
            <Text style={styles.authLabel}>Авторизація Майстра</Text>
            <TouchableOpacity style={styles.glassButton} onPress={() => {
              if (isLoggedIn) {
                Alert.alert('Статус', 'Ви вже авторизовані як Олександр');
              } else {
                router.push('/login');
              }
            }}>
              <Text style={styles.glassButtonText}>Панель Майстра</Text>
            </TouchableOpacity>
            <View style={styles.loginRow}>
              <Text style={styles.authText}>Вхід для клієнтів: </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.loginLink}>Увійти</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation (Identical to Web) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/')}>
          <Globe size={24} color={COLORS.accent} />
          <Text style={[styles.navText, { color: COLORS.accent }]}>Головна</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => !isLoggedIn ? router.push('/login') : router.push('/settings')}>
          <Activity size={24} color={COLORS.muted} />
          <Text style={styles.navText}>Замовлення</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => !isLoggedIn ? router.push('/login') : router.push('/settings')}>
          <SettingsIcon size={24} color={COLORS.muted} />
          <Text style={styles.navText}>Профіль</Text>
        </TouchableOpacity>
      </View>

      {/* Checkout Bar */}
      <AnimatePresence>
        {selectedServices.length > 0 && (
          <MotiView
            from={{ translateY: 150 }}
            animate={{ translateY: 0 }}
            exit={{ translateY: 150 }}
            style={styles.checkoutBar}
          >
            <View>
              <Text style={styles.checkoutCount}>{selectedServices.length} послуги обрано</Text>
              <Text style={styles.checkoutLabel}>Замовити</Text>
            </View>
            <TouchableOpacity 
              style={styles.checkoutButton} 
              onPress={() => {
                if (isLoggedIn) {
                  Alert.alert('Замовлення', 'Вашу заявку на обслуговування Audi Q7 прийнято! Майстер зателефонує вам найближчим часом.');
                } else {
                  router.push('/login');
                }
              }}
            >
              <Text style={styles.checkoutButtonText}>Замовити</Text>
            </TouchableOpacity>
          </MotiView>
        )}
      </AnimatePresence>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    padding: SPACING.lg,
    paddingBottom: 150, // Space for checkout bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingTop: Platform.OS === 'android' ? SPACING.xl : 0,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.foreground,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.muted,
    marginTop: 4,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.foreground,
    marginBottom: SPACING.md,
  },
  servicesGrid: {
    gap: SPACING.md,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  serviceCardSelected: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.surfaceHover,
  },
  cardIconContainer: {
    marginRight: SPACING.md,
  },
  cardContent: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.foreground,
  },
  cardPrice: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: COLORS.accent,
  },
  diagnosticsCard: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.accentGlowSoft,
    borderColor: COLORS.accent,
  },
  authSection: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  authLabel: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: SPACING.md,
  },
  glassButton: {
    width: '100%',
    padding: SPACING.md,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  glassButtonText: {
    color: COLORS.foreground,
    fontSize: 14,
    fontWeight: '500',
  },
  loginRow: {
    flexDirection: 'row',
    marginTop: SPACING.md,
  },
  authText: {
    color: COLORS.muted,
    fontSize: 14,
  },
  loginLink: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(5, 7, 10, 0.95)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 20,
    zIndex: 100,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 4,
  },
  checkoutBar: {
    position: 'absolute',
    bottom: 100, // Above bottom nav
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: 30,
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 110,
  },
  checkoutCount: {
    fontSize: 14,
    color: COLORS.muted,
  },
  checkoutLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.foreground,
  },
  checkoutButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 16,
    backgroundColor: COLORS.accent,
  },
  checkoutButtonText: {
    color: COLORS.foreground,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
