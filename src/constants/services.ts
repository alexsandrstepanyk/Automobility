// import { Droplets, Disc, Settings, Car, ShieldCheck, Zap } from 'lucide-react'; // Currently unused

export const ALL_SERVICES = [
    {
        id: 'oil',
        name: 'Заміна масла',
        description: 'Заміна масла та всіх фільтрів (масляний, повітряний, паливний)',
        price: 1500,
        iconName: 'Droplets'
    },
    {
        id: 'brakes',
        name: 'Заміна тормозів',
        description: 'Діагностика та заміна гальмівних колодок та дисків',
        price: 1200,
        iconName: 'Settings'
    },
    {
        id: 'wheels',
        name: 'Заміна коліс',
        description: 'Сезонний шиномонтаж або ремонт проколів',
        price: 800,
        iconName: 'Disc'
    },
    {
        id: 'detailing',
        name: 'Хімчистка',
        description: 'Глибока хімчистка салону з професійною хімією',
        price: 2500,
        iconName: 'Car'
    },
    // Легко підключити нові сервіси в майбутньому:
    /*
    { 
      id: 'battery', 
      name: 'Зарядка / Заміна АКБ', 
      description: 'Виїздна діагностика та заміна акумулятора',
      price: 600,
      iconName: 'Zap'
    },
    */
];
