CREATE TABLE IF NOT EXISTS community_projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    author_avatar VARCHAR(10) DEFAULT '👤',
    thumbnail VARCHAR(10) DEFAULT '🌟',
    likes INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO community_projects (title, author_name, author_avatar, thumbnail, likes, views) VALUES
('Космический исследователь', 'Алексей М.', '👨‍🚀', '🚀', 42, 256),
('Подводное приключение', 'Мария К.', '👩‍🎨', '🐠', 38, 189),
('Гонки на луне', 'Дмитрий В.', '👦', '🏎️', 56, 412),
('Сказочный лес', 'София Л.', '👧', '🌲', 31, 145),
('Космические битвы', 'Иван П.', '🧑', '⚔️', 67, 523),
('Прыжки панды', 'Ксения Н.', '👩', '🐼', 44, 298),
('Танцующие роботы', 'Артём С.', '👨', '🤖', 29, 167),
('Пиратский остров', 'Елена Р.', '👩‍🦰', '🏴‍☠️', 52, 334),
('Магия и драконы', 'Максим Г.', '👨‍💼', '🐉', 73, 589),
('Футбольный матч', 'Анна Т.', '👧', '⚽', 35, 221),
('Цветочный сад', 'Олег Ф.', '🧑‍🌾', '🌸', 28, 134),
('Космическая станция', 'Вика Ш.', '👩‍🔬', '🛸', 61, 445);