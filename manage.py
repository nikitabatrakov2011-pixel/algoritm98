# ==================================================================
# УПРАВЛЕНИЕ САЙТОМ МЕДИАЦЕНТРА
# Запуск: python manage.py  (или F5 в Wing)
# ==================================================================
import json
import datetime
from pathlib import Path

BASE = Path(__file__).resolve().parent
POSTS_FILE = BASE / "posts.json"
DATA_FILE = BASE / "data.js"

MONTHS = ["января","февраля","марта","апреля","мая","июня",
          "июля","августа","сентября","октября","ноября","декабря"]

# ------------------------------------------------------------------
# РАБОТА С ФАЙЛАМИ
# ------------------------------------------------------------------
def load_posts():
    if not POSTS_FILE.exists():
        return []
    with open(POSTS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_posts(posts):
    with open(POSTS_FILE, "w", encoding="utf-8") as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)

def generate_data_js(posts):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        f.write("// data.js — автогенерируется manage.py. Не редактировать вручную!\n")
        f.write("const ARTICLES = ")
        f.write(json.dumps(posts, ensure_ascii=False, indent=2))
        f.write(";\n")
    print(f"✅ data.js обновлён ({len(posts)} статей)")

def next_id(posts):
    if not posts:
        return 1
    return max(p["id"] for p in posts) + 1

# ------------------------------------------------------------------
# МЕНЮ
# ------------------------------------------------------------------
def show_menu():
    print()
    print("=" * 52)
    print("  📰  УПРАВЛЕНИЕ САЙТОМ МЕДИАЦЕНТРА")
    print("=" * 52)
    print("  1 — Показать все статьи")
    print("  2 — Добавить статью")
    print("  3 — Удалить статью")
    print("  4 — Пересобрать data.js")
    print("  0 — Выход")
    print("=" * 52)

def list_posts(posts):
    if not posts:
        print("\n📭 Пока нет ни одной статьи.")
        return
    print(f"\n📚 Всего статей: {len(posts)}\n")
    for p in posts:
        print(f"  [{p['id']}] {p['title']}")
        print(f"      {p['category']} · {p['author']} · {p['date']}")
        print()

# ------------------------------------------------------------------
# ДОБАВЛЕНИЕ
# ------------------------------------------------------------------
def add_post(posts):
    print("\n➕ ДОБАВЛЕНИЕ СТАТЬИ")
    print("(нажми Enter, чтобы оставить поле пустым; 'отмена' — для отмены)\n")

    title = input("Заголовок: ").strip()
    if title.lower() == "отмена":
        return

    print("\nКатегории: Новости, Спорт, Культура, Анонсы, Интервью")
    category = input("Категория: ").strip() or "Новости"

    author = input("Автор (Иванов Иван, 9 «А»): ").strip() or "Редакция"

    today = datetime.date.today()
    default_date = f"{today.day} {MONTHS[today.month - 1]} {today.year}"
    date = input(f"Дата (Enter = {default_date}): ").strip() or default_date

    lead = input("Краткое описание (1-2 строки): ").strip()

    print("\nТекст статьи (введи 'КОНЕЦ' с новой строки, чтобы закончить).")
    print("Подсказки: '## Заголовок' — подзаголовок, '> Цитата' — цитата, пустая строка — новый абзац.\n")
    lines = []
    while True:
        line = input()
        if line.strip() == "КОНЕЦ":
            break
        lines.append(line)
    text = "\n".join(lines)

    image = input("\nКартинка (имя файла, Enter — без картинки): ").strip()

    new_post = {
        "id": next_id(posts),
        "title": title,
        "category": category,
        "author": author,
        "date": date,
        "lead": lead,
        "text": text,
    }
    if image:
        new_post["image"] = image

    posts.insert(0, new_post)
    print(f"\n✅ Статья добавлена! ID: {new_post['id']}")

# ------------------------------------------------------------------
# УДАЛЕНИЕ
# ------------------------------------------------------------------
def delete_post(posts):
    if not posts:
        print("\n📭 Нечего удалять.")
        return
    list_posts(posts)
    try:
        pid = int(input("Введи ID статьи для удаления (0 — отмена): "))
    except ValueError:
        print("❌ Нужно число.")
        return
    if pid == 0:
        return
    for i, p in enumerate(posts):
        if p["id"] == pid:
            confirm = input(f"Удалить «{p['title']}»? (да/нет): ").strip().lower()
            if confirm == "да":
                posts.pop(i)
                print("✅ Удалено.")
            return
    print("❌ Статья с таким ID не найдена.")

# ------------------------------------------------------------------
# ГЛАВНЫЙ ЦИКЛ
# ------------------------------------------------------------------
def main():
    print("\n📂 Папка проекта:", BASE)
    posts = load_posts()
    print(f"📚 Загружено статей: {len(posts)}")

    while True:
        show_menu()
        choice = input("Твой выбор: ").strip()

        if choice == "0":
            print("\n👋 Пока! Не забудь залить posts.json и data.js на GitHub.\n")
            break
        elif choice == "1":
            list_posts(posts)
        elif choice == "2":
            add_post(posts)
            save_posts(posts)
            generate_data_js(posts)
        elif choice == "3":
            delete_post(posts)
            save_posts(posts)
            generate_data_js(posts)
        elif choice == "4":
            generate_data_js(posts)
        else:
            print("❌ Нет такого пункта.")

if __name__ == "__main__":
    main()