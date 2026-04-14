import React, { createContext, useContext, useState, ReactNode } from 'react';

type Car = {
  id: string;
  brand: string;
  model: string;
  plate: string;
  year: string;
  vin: string;
  fuel: string;
  gearbox: string;
  drive: string;
  mileage: number;
  lastOilChangeMileage: number;
  lastGearboxServiceMileage: number;
  lastDiffServiceMileage: number;
};

type User = {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  birthday: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  cars: Car[];
  login: () => void;
  logout: () => void;
  addCar: (car: Omit<Car, 'id'>) => void;
  updateUser: (data: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: User = {
  id: 'u1',
  name: 'Олександр Степанюк',
  phone: '+380 97 123 45 67',
  email: 'alex@automobility.ua',
  city: 'Київ',
  birthday: '15.05.1990',
};

const MOCK_CAR: Car = {
  id: 'c1',
  brand: 'Audi',
  model: 'Q7',
  plate: 'AA 0001 AA',
  year: '2021',
  vin: 'WAUZZZ4M0MD000000',
  fuel: 'Дизель',
  gearbox: 'Автомат',
  drive: 'Повний (AWD)',
  mileage: 120000,
  lastOilChangeMileage: 112000,
  lastGearboxServiceMileage: 65000,
  lastDiffServiceMileage: 110000,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(MOCK_USER);
  const [cars, setCars] = useState<Car[]>([MOCK_CAR]);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  const addCar = (newCarData: Omit<Car, 'id'>) => {
    const newCar = {
        ...newCarData,
        id: Math.random().toString(36).substr(2, 9),
    };
    setCars(prev => [...prev, newCar]);
  };

  const updateUser = (data: Partial<User>) => {
      setUser(prev => prev ? { ...prev, ...data } : null);
  };

  return (
    <AuthContext.Provider value={{ 
        isLoggedIn, 
        user, 
        cars, 
        login, 
        logout, 
        addCar,
        updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
