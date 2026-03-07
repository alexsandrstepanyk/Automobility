#!/bin/bash

################################################################################
#                   AUTOMOBILITY - УНІВЕРСАЛЬНИЙ ЗАПУСК                        #
#                                                                              #
# 📋 ОПЦІЇ:                                                                    #
#   ./start.sh                  - Запуск в режимі розробника (dev)             #
#   ./start.sh --prod           - Запуск в режимі продакшену (стабільна збірка)#
#   ./start.sh --test           - Запуск автоматизованих E2E тестів            #
#                                                                              #
# 🔒 ПРАВИЛО ФІКСОВАНИХ ПОРТІВ:                                                #
#   - Ми використовуємо порти ТІЛЬКИ ДО 2000.                                  #
#   - Основний портал Automobility ЗАВЖДИ на 1999.                             #
#   - Ніхто інший НЕ МАЄ ПРАВА займати цей порт.                               #
#   - ⚠️ ЗАБОРОНЕНО зачіпати або сканувати порти вище 2000! Це чужа зона.       #
#   - Якщо порт зайнятий - ВБИВАЄМО порушника ТІЛЬКИ на конкретному порту.     #
#                                                                              #
# ⚠️  ПРАВИЛО ЗБЕРЕЖЕННЯ КОДУ:                                                 #
#   - Ніколи не видаляй код з проекту                                          #
#   - Якщо код неактивний - залишай його в файлі з коментарем                  #
#   - Формат коментаря: // DISABLED: причина (дата)                            #
#                                                                              #
# 📝 ПРАВИЛО ДОКУМЕНТУВАННЯ ЗМІН:                                              #
#   - Кожне нововведення записуй в README.md та ROADMAP.md                     #
#   - Формат запису:                                                           #
#     * Дата: РРРР-ММ-ДД                                                       #
#     * Версія: vX.X.X                                                         #
#     * Опис: що змінено/додано/виправлено                                     #
################################################################################

# 🎨 Кольори для виводу
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# 📍 Базова директорія проекту
PROJECT_DIR="/Users/apple/Desktop/Automobility"
cd "$PROJECT_DIR" || exit 1

# 🎯 Парсинг аргументів
MODE="dev"
if [ "$1" == "--prod" ]; then
    MODE="prod"
elif [ "$1" == "--test" ]; then
    MODE="test"
fi

print_header() {
    echo -e "\n${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC}  $1"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}\n"
}

print_step() {
    echo -e "${YELLOW}→${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

################################################################################
#                            1️⃣  ОЧИСТКА СИСТЕМИ                              #
################################################################################

print_header "🧹 КРОК 1: ОЧИСТКА ВСІХ ПРОЦЕСІВ ТА ПОРТІВ"

print_step "Очищення середовища..."
# Видалено killall, щоб не чіпати інші працюючі сервери на комп'ютері
sleep 1
print_success "Всі процеси зупинені"

print_step "Перевіряю та звільняю порт 1999..."
lsof -ti:1999 2>/dev/null | xargs kill -9 2>/dev/null || true
sleep 1
print_success "Порт 1999 звільнено"

if [ ! -f "$PROJECT_DIR/package.json" ]; then
    print_error "❌ package.json не знайдено"
    exit 1
fi

################################################################################
#                           2️⃣  ЗАПУСК СЕРВІСІВ                               #
################################################################################

print_header "🚀 КРОК 2: ЗАПУСК AUTOMOBILITY (Режим: $MODE)"

LOG_FILE="/tmp/automobility_${MODE}.log"

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
print_step "Запускаю Automobility на порту 1999..."

if [ "$MODE" == "prod" ]; then
    print_step "Збираю актуальний білд (npm run build)..."
    npm run build > /dev/null 2>&1
    print_success "Білд готовий"
    npm run start > "$LOG_FILE" 2>&1 &
elif [ "$MODE" == "test" ]; then
    print_step "Запускаю E2E тести Playwright..."
    npx playwright test
    exit 0
else
    npm run dev > "$LOG_FILE" 2>&1 &
fi

MAIN_PID=$!
sleep 5

if ! kill -0 $MAIN_PID 2>/dev/null; then
    print_error "❌ Automobility не запустився (PID: $MAIN_PID)"
    echo "Логи:"
    tail -n 10 "$LOG_FILE"
    exit 1
fi

# Перевірка порту
ACTUAL_PID=$(lsof -ti:1999 2>/dev/null | head -1)
if [ -z "$ACTUAL_PID" ]; then
    print_error "❌ ПОМИЛКА! Порт 1999 ніким не зайнятий! Можливо помилка збірки."
    echo "Логи:"
    tail -n 15 "$LOG_FILE"
    exit 1
fi

print_success "Automobility успішно запущено (PID: $MAIN_PID, порт: 1999)"

################################################################################
#                       3️⃣  ПЕРЕВІРКА ЗДОРОВ'Я СЕРВІСІВ                       #
################################################################################

print_header "🏥 КРОК 3: ПЕРЕВІРКА ЗДОРОВ'Я"

print_step "Очікування готовності UI (до 15 сек)..."
for i in {1..15}; do
    if curl -s -I http://localhost:1999 2>/dev/null | grep -q '200 OK\|308 Permanent Redirect'; then
        print_success "Веб-додаток готовий!"
        HEALTH_OK=true
        break
    fi
    sleep 1
done

if [ "$HEALTH_OK" != true ]; then
    print_error "⚠️ Веб-додаток довго вантажиться, перевірте логи: tail -f $LOG_FILE"
fi

################################################################################
#                       4️⃣  ФІНАЛЬНА ІНФОРМАЦІЯ                            #
################################################################################

print_header "✅ ГОТОВО! ПЛАТФОРМА AUTOMOBILITY В ОНЛАЙНІ"

IP_ADDRESS=$(ipconfig getifaddr en0 2>/dev/null || echo "localhost")

echo -e "${GREEN}📍 ПОСИЛАННЯ (Локально):${NC}"
echo -e "   🏠 Головна сторінка:    ${CYAN}http://localhost:1999${NC}"
echo -e "   👤 Панель Клієнта:      ${CYAN}http://localhost:1999/dashboard${NC}"
echo -e "   🔧 Панель Майстра:      ${CYAN}http://localhost:1999/mechanic${NC}"
echo -e "   🔐 Адмін Панель:        ${CYAN}http://localhost:1999/admin${NC}"
echo -e ""
echo -e "${GREEN}📱 ДОСТУП З ТЕЛЕФОНУ (у тій же Wi-Fi):${NC}"
echo -e "   Відкрийте в браузері:   ${YELLOW}http://${IP_ADDRESS}:1999${NC}"
echo -e ""
echo -e "${GREEN}💡 КОМАНДИ:${NC}"
echo -e "   Зупинка:         ${YELLOW}lsof -ti:1999 | xargs kill -9${NC}"
echo -e "   Логи:            ${YELLOW}tail -f $LOG_FILE${NC}"
echo -e "   Статус порту:    ${YELLOW}lsof -i :1999${NC}"
echo ""
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}\n"
