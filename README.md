# 🚗 Automobility - Автосервіс на колесах / Auto Service on Wheels

🇺🇦 **Українська версія** | 🇬🇧 **English version below**

---

## 🇺🇦 Українська версія

**Automobility** — це преміальний та інноваційний веб-додаток (Mobile-First PWA) для замовлення послуг автосервісу з виїздом майстра безпосередньо до клієнта. 

### 🎯 Яку проблему ми вирішуємо?
Традиційні СТО вимагають від клієнта витрачати багато часу на запис, поїздку, очікування в чергах та залишення авто на невизначений термін. До того ж, процес ціноутворення часто є непрозорим. 
**Automobility закриває ці болі:**
- **Економія часу:** Майстер приїжджає туди, де знаходиться авто (додому, в офіс, на парковку).
- **Прозорість:** Завдяки системі рейтингів, фіксованим цінам та фотозвітам ("До/Після") клієнт бачить за що він платить.
- **Точність (Вбудований AI підбір):** Інтерактивні флоу аналізують VIN-код автомобіля та автоматично пропонують необхідний об'єм мастила, точні деталі та гальмівні системи, що унеможливлює людський фактор.

### 🌟 Основні модулі системи

Система складається з трьох ключових панелей:

1. **📱 Клієнтський додаток (User App)**
   - Зручний онбордінг та інтерактивна реєстрація зі збереженням профілю і гаража (додавання своїх авто).
   - Інтерактивний вибір послуг з логікою під капотом (флоу заміни масла, заміни гальм з вибором деталей).
   - `Мої замовлення`: Трекінг виконання замовлення у реальному часі (нові, в процесі, виконані).
   - Глобальна панель налаштувань (`/settings`): Управління автомобілями, зміна мови (працює миттєво без перезавантажень) та політики безпеки.
   - Дизайн виконано у стилі преміального Dark Glassmorphism.

2. **🔧 Панель майстра (Mechanic Dashboard)**
   - Робочий кабінет фахівця з переліком доступних та призначених завдань (\`/mechanic\`).
   - Можливість приймати замовлення в роботу.
   - Надання фотозвітів (До ремонту / Після ремонту) безпосередньо через інтерфейс.
   - Управління рейтингом та власним статусом.

3. **⚙️ Ядро: Адмін-Панель та Диспетчер (Admin Core)**
   - Центральний пульт управління компанією (`/admin`).
   - Верифікація клієнтів та нових майстрів.
   - Live-моніторинг: Спостереження за всіма активними замовленнями, розподіл навантаження на майстрів.
   - Фінансовий звіт та статистика послуг.

### 🛠 Технологічний стек
Проект побудований з використанням найсучасніших та найшвидших технологій:
- **Frontend / Framework**: [Next.js 15](https://nextjs.org/) (App Router). Дозволяє швидко вантажити сторінки, ідеально підходить для SEO та мобільних PWA.
- **Styling**: Vanilla CSS. Власна дизайн-система преміум-класу (CSS змінні, Glassmorphism, жодних важких бібліотек).
- **UI / Анімації**: [Framer Motion](https://framer.com/motion) для плавних переходів та мікроінтеракцій. Icon-пак: `lucide-react`.
- **Логіка / State**: React Hooks (`useState`, `useEffect`), Global Context API (для багатомовності).
- **QA / Тестування**: [Playwright](https://playwright.dev/) для наскрізного E2E (End-to-End) автотестування критичних сценаріїв (реєстрація, зміна мови, виклик майстра, адмін-панель).
- **База Даних (Заплановано / Next Step)**: PostgreSQL + Prisma ORM (або Supabase) для зберігання користувачів, запчастин, логів автомобілів. На даному етапі логіка працює на рівні розумного state-management та LocalStorage для демонстрації.

### 📂 Структура проекту (`/src`)

- `/app/page.tsx` - Landing Page (Продаюча сторінка).
- `/app/register/*`, `/app/login/*` - Модулі аутентифікації.
- `/app/dashboard/*` - Клієнтський хаб, де містяться підмодулі флоу (`OilChangeFlow.tsx`, `BrakeChangeFlow.tsx`).
- `/app/orders/*` - Історія замовлень клієнта.
- `/app/settings/*` - Глобальні налаштування.
- `/app/admin/*`, `/app/mechanic/*` - Робочі платформи персоналу.
- `/context/LanguageContext.tsx` - Ядро багатомовності (доступні UA, EN, DE, PL, RU, FR).
- `start.sh` - Універсальний баш-скрипт фірмового запуску системи.

### ⚡️ Як запустити локально

1. Встановіть залежності:
   ```bash
   npm install
   ```
2. Запустіть сервер (обов'язково через скрипт `start.sh` - він фіксує порт і слідкує за безпекою):
   ```bash
   ./start.sh
   ```
3. Відкрийте [http://localhost:1999](http://localhost:1999) у вашому браузері.

### 🏷 Версіонування проекту
Ми дотримуємося семантичного версіонування (Semantic Versioning):
- **Глобальні оновлення (Major):** `2.0.0` (Суттєві архітектурні зміни, перехід на новий глобальний Roadmap).
- **Великі фічі (Minor):** `1.1.0`, `1.2.0` (Реліз нових функцій з Roadmap).
- **Малі допрацювання (Patch):** `1.1.1`, `1.1.2` (Виправлення багів, дрібні покращення).

### 📜 Історія змін (Changelog)

## 2026-03-07 v1.2.0 - Інтерактивні послуги та профілі
- Додано: сторінка налаштувань (`/settings`) та профіль клієнта.
- Додано: сторінка замовлень (`/orders`) з трекінгом (нові, в процесі, виконані).
- Додано: інтерактивні флоу для Заміни масла і Заміни гальм з розумним прорахунком.
- Оновлено: `start.sh` з правилами збереження коду та документування змін.

---

## 🇬🇧 English Version

**Automobility** is a premium mobile-first PWA for booking on-demand, on-site auto repair services straight to the client's location.

### 🎯 The Problem We Solve
Traditional auto repair shops require clients to spend hours scheduling, driving, queuing, and leaving their cars for unpredictable periods, often with opaque pricing.
**Automobility resolves these pain points:**
- **Time Savings:** Mechanics travel directly to the car (home, office, parking lot).
- **Transparency:** Fixed pricing, mechanic rating systems, and Before/After photo reports ensure clients know exactly what they are paying for.
- **Precision (AI & VIN integration):** Interactive flows analyze the vehicle's VIN and automatically suggest correct fluid volumes, premium parts, and filters, eliminating human error.

### 🌟 Core Modules

1. **📱 Client App (User Hub)**
   - Seamless onboarding and garage building.
   - Interactive booking flows with logic (e.g., matching brake pads dynamically).
   - Real-time order tracking (`/orders`).
   - Global Settings (`/settings`) with instant multi-language toggling (no reloads).
   - Premium Dark Glassmorphism aesthetics.

2. **🔧 Mechanic Dashboard**
   - Task management portal (`/mechanic`) tailored for field workers.
   - Order acceptance, navigation, and photo-report uploading.
   - Personal rating tracking.

3. **⚙️ Core: Admin & Dispatcher Panel**
   - The company's central nervous system (`/admin`).
   - Live queue monitoring, mechanic dispatch, and staff verification.
   - Business & financial analytics.

### 🛠 Tech Stack
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, highly optimized for SSR/CSR).
- **Styling**: Vanilla CSS (Custom premium tokens, no bloated frameworks).
- **Animations**: [Framer Motion](https://www.framer.com/motion/).
- **Icons**: Lucide React.
- **Language & Logic**: TypeScript, native React Hooks, Global Context.
- **QA/Testing**: [Playwright](https://playwright.dev/) for E2E testing.
- **Database (Planned):** PostgreSQL with Prisma ORM (currently operating on local state logic for prototyping).

### ⚡️ How to run

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the server (must use `start.sh` script to enforce strict port 1999 rules):
   ```bash
   ./start.sh
   ```
3. Open [http://localhost:1999](http://localhost:1999)

### 📜 Changelog

## 2026-03-07 v1.2.0 - Interactive Services & Profiles
- Added: Settings page (`/settings`) and client profile.
- Added: Orders tracking page (`/orders`).
- Added: Deeply interactive flows for Oil & Brake changes.
- Updated: `start.sh` with strict code preservation rules.
