# 🚀 Automobility Roadmap / Стратегічна Дорожня Карта

🇺🇦 **Українська версія** | 🇬🇧 **English version below**

---

## 🇺🇦 Українська версія: Стратегія Обходу Конкурентів

Automobility засновано з єдиною метою — змінити архаїчний ринок СТО на інноваційний Mobile-First сервіс. У той час як конкуренти фокусуються лише на онлайн-каталогах майстрів, наша мета: **Штучний Інтелект (AI), Інтернет Речей (IoT), Дата-Аналітика та B2B (Fleet Management)**.

Ми будуємо надійну екосистему:
1. **Клієнтський Додаток (User Hub)** - Елегантно, просто, розумно.
2. **Панель Майстра (Mechanic App)** - Точність замовлень, навігація та фінальний фотозвіт.
3. **Обчислювальне Ядро (Admin & Dispatcher Core)** - Live-мапи, модерація, динамічне ціноутворення.
4. **Хмарна База Даних (Cloud Database Hub)** - Запланований перехід до PostgreSQL, де зберігається вся база деталей (VIN-каталоги) та історія ремонтів.

---

### 📜 Історія змін (Changelog)

## **2026-03-07 v1.2.0 - Інтерактивні послуги та профілі**
- **Додано:** сторінка налаштувань (`/settings`) та профіль клієнта з "Гаражем".
- **Додано:** сторінка замовлень (`/orders`) з трекінгом статусів (нові, в процесі, виконані).
- **Додано:** інтерактивний флоу замовлення Заміни масла з аналізом VIN та вибором фільтрів.
- **Додано:** інтерактивний флоу замовлення Заміни гальм з діагностикою типу запчастин та осі.
- **Оновлено:** Панель майстра та Дашборд клієнта (вбудовано нові лінки-переходи).
- **Оновлено:** `start.sh` тепер має жорсткі правила збереження коду (ніколи не видаляй, а використовуй `// DISABLED`).

---

### 🎯 Фаза 1: Міцний Фундамент та Бази Даних (Поточний Етап)
*Перехід від демо-версії до production-ready екосистеми.*

- [ ] **Розгортання Бази Даних (Database Migration):** Налаштування PostgreSQL та Prisma ORM (або Supabase) для централізованого зберігання:
  - Профілів користувачів і сесій авторизації (NextAuth).
  - Профілів майстрів, їх локацій та рейтингів.
  - "Гаража" з VIN-кодами автомобілів та історією ремонтів.
- [ ] **Інтеграція реального VIN-декодера:** API-інтеграція для парсингу технічних характеристик авто, щоб ідеально підбирати літраж мастила та маркування гальм.
- [ ] **Адмін Ядро (Fleet Dispatcher 2.0):** WebSocket-інтеграція серверу для відображення механіків на карті в режимі реального часу.

### 🧠 Фаза 2: Розумна Діагностика та AI (Q3 2026)
*Щоб випередити конкурентів (YourMechanic / Wrench) у швидкості та точності оцінювання ремонту.*

- [ ] **AI-Генерація Кошторисів:** Інтеграція AI (LLM) для миттєвого прорахунку вартості запчастин та роботи на основі текстового опису проблеми чи фотографії поломки.
- [ ] **Розпізнавання Деталей (Computer Vision):** Клієнт робить фото пошкодження або зносу (наприклад, стертих гальмівних дисків), і AI автоматично пропонує потрібну послугу та деталі.
- [ ] **CRM для Майстрів (B2B Партнерство):** Інтерфейс для майстрів, де вони одним кліком можуть замовити фільтри/мастило у локальних постачальників для поточного завдання.

### 🌐 Фаза 3: IoT та Предиктивне Обслуговування (Q4 2026)
*Щоб перетворити сервіс з реактивного на проактивний.*

- [ ] **Інтеграція з OBD2-сканерами (Bluetooth IoT):** Продаж або підписка на фірмові OBD2-донгли, які підключаються до додатка Automobility.
- [ ] **Авто-сповіщення "Вашому авто потрібен ремонт":** Додаток автоматично зчитує помилки двигуна і надсилає Push-сповіщення, пропонуючи одразу викликати майстра на завтра.
- [ ] **Цифровий Гараж (Digital Garage on Chain):** Історія авто (схоже на CarFax), що зберігає усі ремонти у захищеній хмарній базі. Це підіймає вартість авто на вторинному ринку.

### 🏢 Фаза 4: B2B Флот (Fleet Management) та Підписки (Q1 2027)
*Щоб забезпечити стабільний щомісячний дохід (MRR).*

- [ ] **Fleet Management Dashboard:** Спеціальний B2B кабінет для таксопарків, кур'єрів (Glovo/Bolt), логістичних компаній.
- [ ] **Підписка "Mechanic Prime":** Щомісячна плата за базові перевірки стану флоту та безкоштовні екстрені виїзди.
- [ ] **Офісне партнерство (White-Collar Perks):** Обслуговування на парковках бізнес-центрів. Клієнт працює в офісі, поки Automobility замінює йому колодки.

---

## 🇬🇧 English Version: Competitor Bypass Strategy

Automobility is built to disrupt the archaic stationary mechanic industry by deploying a unified Mobile-First platform focused on **AI, IoT, and B2B Fleet Management**.

Our Ecosystem consists of:
1. **User Hub** - Clean, intuitive client booking interface.
2. **Mechanic App** - For workers to navigate, track tasks, and submit "After" photos.
3. **Admin & Dispatcher Core** - Real-time map overviews and dynamic task assignment.
4. **Cloud Database (Planned)** - Moving to PostgreSQL / Supabase, managing VIN logs and user history.

### 📜 Changelog

## **2026-03-07 v1.2.0 - Interactive Services & Profiles**
- **Added:** Global `/settings` page for user profile and Garage.
- **Added:** Trackable `/orders` page (New, In Progress, Completed).
- **Added:** Smart Oil Change flow with VIN-based volume/filter checks.
- **Added:** Smart Brake Change flow with axle/type diagnosis.
- **Updated:** Mechanic & Client dashboards connected to new settings/orders pages.
- **Updated:** `start.sh` rule (Never delete code: use `// DISABLED`).

### 🎯 Phase 1: Solid Foundation & Databases (Current)
- [ ] **Database Migration:** Implementing PostgreSQL + Prisma (or Supabase) to transition away from local states to permanent cloud storage (Users, Mechanics, Cars, Orders).
- [ ] **Real VIN Decoder API:** Plug into an automotive API to mathematically fetch exact oil volumes, filter IDs, and brake part numbers.
- [ ] **Fleet Dispatcher 2.0:** Real-time WebSockets integration so dispatchers can track technicians on a live map.

### 🧠 Phase 2: Smart Diagnostics & AI (Q3 2026)
- [ ] **AI-Powered Quotes:** LLM-based estimation for parts and labor based on a simple text description or a photo.
- [ ] **Damage Recognition (Computer Vision):** The client takes a photo of worn brake pads, and the AI proposes the exact required service and part.
- [ ] **Mechanic CRM & Fast Orders:** Seamlessly allowing mechanics to bulk-order oil/filters directly via partner vendor APIs.

### 🌐 Phase 3: IoT & Predictive Maintenance (Q4 2026)
- [ ] **OBD2 Scanner Integration (IoT):** Branded Automobility OBD2 dongles connecting via Bluetooth to the client app.
- [ ] **Proactive Service Alerts:** The app automatically reads engine fault codes and sends actionable push notifications ("Check Engine detected: send mechanic tomorrow?").
- [ ] **Verified Digital Garage:** A digital logbook (CarFax alternative) stored in a secure cloud, boosting vehicle resale values.

### 🏢 Phase 4: B2B Fleet & Subscriptions (Q1 2027)
- [ ] **B2B Fleet Management Dashboard:** Serving logistics, taxi hubs, and delivery services.
- [ ] **"Mechanic Prime" Subscription:** A recurring revenue model for companies ensuring flat-rate routine maintenance and fast-response SOS dispatches.
- [ ] **Corporate Office Perks:** Servicing client vehicles directly in business center parking lots during an employee's 9-to-5 shift.
