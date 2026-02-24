# 🚗 Automobility - Автосервіс на колесах / Auto Service on Wheels

🇺🇦 **Українська версія** | 🇬🇧 **English version below**

## 🇺🇦 Українська версія

Це преміальний веб-додаток (Mobile-First PWA) для замовлення послуг автосервісу з виїздом до клієнта.

### 🌟 Основні можливості

- **📱 Клієнтський додаток**:
  - Реєстрація користувача та його автомобіля.
  - Вибір послуг: заміна масла, гальмів, коліс та хімчистка.
  - Вибір дати, часу та геолокації авто.
  - Дизайн у преміальному стилі Dark Glassmorphism.
  - Підтримка багатьох мов (українська, англійська, німецька, польська тощо).
- **⚙️ Ядро (Admin Dashboard)**:
  - Моніторинг черги замовлень у реальному часі.
  - Верифікація нових майстрів та користувачів.
  - Призначення майстрів на замовлення та перегляд статусу (FLEET Map).
- **🔧 Панель майстра (Mechanic Dashboard)**:
  - Реєстрація майстрів з вказанням послуг та досвіду.
  - Отримання замовлень, звітність "До/Після" за допомогою фотографій.
  - Рейтинг та відгуки від клієнтів.
- **🚀 Масштабованість**:
  - Легке додавання нових сервісів через конфіг `src/constants/services.ts`.

### 🛠 Технологічний стек

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: Vanilla CSS (Premium Custom Theme)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript

### 📂 Структура проекту

- `/` - Головна сторінка (Landing)
- `/register` - Інтерактивна покрокова реєстрація
- `/login` - Сторінка входу клієнта
- `/dashboard` - Панель клієнта (замовлення послуг)
- `/admin` - Адмін-панель (Модерація та Диспетчер)
- `/mechanic` - Панель майстра (Задачі та звіти)

### ⚡️ Як запустити

1. Встановіть залежності:
   ```bash
   npm install
   ```
2. Запустіть сервер розробки:
   ```bash
   npm run dev
   ```
3. Відкрийте [http://localhost:3000](http://localhost:3000)

### 🏷 Версіонування проекту
Ми дотримуємося семантичного версіонування (Semantic Versioning):
- **Глобальні оновлення (Major):** `4.0.0` (Суттєві архітектурні зміни, перехід на новий глобальний Roadmap).
- **Великі фічі (Minor):** `3.1.0`, `3.2.0` (Реліз нових функцій з Roadmap).
- **Малі допрацювання (Patch):** `3.1.1`, `3.1.2` (Виправлення багів, дрібні покращення).

---

## 🇬🇧 English Version

This is a premium web application (Mobile-First PWA) for booking on-site auto repair and maintenance services.

### 🌟 Core Features

- **� Client Application**:
  - User and car registration.
  - Service selection: oil change, brake change, wheel change, and detailing.
  - Select date, time, and car geolocation.
  - Premium Dark Glassmorphism design.
  - Multi-language support (English, Ukrainian, German, Polish, etc.).
- **⚙️ Core (Admin Dashboard)**:
  - Real-time order queue monitoring.
  - Verification of new mechanics and users.
  - Assigning mechanics to orders and status overview (FLEET Map).
- **🔧 Mechanic Dashboard**:
  - Mechanic registration with skills and experience.
  - Receiving orders, "Before/After" reporting with photos.
  - Rating and reviews from clients.
- **🚀 Scalability**:
  - Easy addition of new services via config `src/constants/services.ts`.

### 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: Vanilla CSS (Premium Custom Theme)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript

### 📂 Project Structure

- `/` - Landing Page
- `/register` - Interactive step-by-step registration
- `/login` - Client login page
- `/dashboard` - Client dashboard (booking services)
- `/admin` - Admin Panel (Moderation and Dispatcher)
- `/mechanic` - Mechanic Dashboard (Tasks and reports)

### ⚡️ How to run

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000)

### 🏷 Versioning Strategy
We follow Semantic Versioning rules:
- **Global Updates (Major):** `4.0.0` (Significant architectural overhauls, advancing to a new global Roadmap).
- **Large Features (Minor):** `3.1.0`, `3.2.0` (Release of new features from the current Roadmap).
- **Small Fixes (Patch):** `3.1.1`, `3.1.2` (Bug fixes, minor tweaks).
