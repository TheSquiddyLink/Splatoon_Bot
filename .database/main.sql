CREATE TABLE `stats` (
    id INT PRIMARY KEY,
    smallfry INT DEFAULT 0,
    chum INT DEFAULT 0,
    cohock INT DEFAULT 0,
    big_shot INT DEFAULT 0,
    drizzler INT DEFAULT 0,
    fish_stick INT DEFAULT 0,
    flipper_flopper INT DEFAULT 0,
    flyfish INT DEFAULT 0,
    maws INT DEFAULT 0,
    scrapper INT DEFAULT 0,
    slammin_lid INT DEFAULT 0,
    steel_eel INT DEFAULT 0,
    steelhead INT DEFAULT 0,
    stinger INT DEFAULT 0,
    goldie INT DEFAULT 0,
    coho INT DEFAULT 0,
    boris INT DEFAULT 0
);

CREATE TABLE invintory (
    id INT PRIMARY KEY,
    goldenEggs INT DEFAULT 0,
    wb INT DEFAULT 0,
    kw INT DEFAULT 0,
    bb INT DEFAULT 0
);

CREATE TABLE lesser_salmon (
    stats_id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    health INT,
    chance INT,
    hitbox INT,
    points INT,
    emoji VARCHAR(255),
    image VARCHAR(255)
);
DELETE FROM lesser_salmon;
INSERT INTO lesser_salmon (stats_id, name, health, chance, hitbox, points, emoji, image) VALUES
('smallfry', 'Smallfry', 1, 50, 40, 1, '<:smallfry:1142682637018873876>', 'https://media.discordapp.net/attachments/1116032437588340826/1143654495520313384/120px-S3_Smallfry_icon.png?width=240&height=240'),
('chum', 'Chum', 2, 35, 50, 2, '<:chum:1143398328571281509>', 'https://media.discordapp.net/attachments/1142680467825500264/1143654353014636624/120px-S3_Chum_icon.png?width=240&height=240'),
('cohock', 'Cohock', 4, 0, 60, 4, '<:cohock:1143398327065509948>', 'https://media.discordapp.net/attachments/1142680467825500264/1143654352691658792/500.png?width=884&height=884');

CREATE TABLE boss_salmon (
    stats_id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    health INT,
    chance INT,
    timer INT,
    bomb BOOLEAN,
    hitbox INT,
    points INT,
    bonus INT,
    emoji VARCHAR(255),
    image VARCHAR(255)
);
DELETE FROM boss_salmon;

INSERT INTO boss_salmon (stats_id, name, health, chance, timer, bomb, hitbox, points, bonus, emoji, image) VALUES
('big_shot','Big Shot', 8, 91, 0, FALSE, 90, 5, 0, '<:bigshot:1143636605307994254>', 'https://media.discordapp.net/attachments/1142680467825500264/1143651512917164143/bigshot.png?width=300&height=300'),
('drizzler', 'Drizzler', 4, 82, 0, FALSE, 80, 5, 0, '<:drizzler:1143636603206635571>', 'https://media.discordapp.net/attachments/1142680467825500264/1143651512594223284/drizzler.png?width=300&height=300'),
('fish_stick', 'Fish Stick', 3, 73, 0, FALSE, 45, 5, 0, '<:fishstick:1143636601939955832>', 'https://media.discordapp.net/attachments/1142680467825500264/1143651512199950346/fishstick.png?width=300&height=300'),
('flipper_flopper', 'Flipper Flopper', 1, 64, 10, FALSE, 85, 5, 0, '<:flipperflopper:1143636599742148788>', 'https://media.discordapp.net/attachments/1142680467825500264/1143651511944085564/flipperflopper.png?width=300&height=300'),
('flyfish', 'Flyfish', 2, 55, 10, TRUE, 40, 5, 0, '<:flyfish:1143636597766631527>', 'https://media.discordapp.net/attachments/1142680467825500264/1143651463420194816/flyfish.png?width=300&height=300'),
('maws', 'Maws', 1, 46, 10, TRUE, 80, 5, 0, '<:maws:1143636596495753316>', 'https://media.discordapp.net/attachments/1142680467825500264/1143651463155957900/maws.png?width=300&height=300'),
('scrapper', 'Scrapper', 4, 37, 0, FALSE, 90, 5, 0, '<:scrapper:1143636592871870475>', 'https://media.discordapp.net/attachments/1142680467825500264/1143651462900088976/scrapper.png?width=300&height=300'),
('slammin_lid', 'Slammin Lid', 2, 28, 0, FALSE, 90, 5, 0, '<:slamminlid:1143636590854418543>', 'https://media.discordapp.net/attachments/1142680467825500264/1143651462627471554/slamminlid.png?width=300&height=300'),
('steel_eel', 'Steel Eel', 3, 19, 0, FALSE, 60, 5, 0, '<:steeleel:1143636589218648145>', 'https://media.discordapp.net/attachments/1142680467825500264/1143651462342262914/steeleel.png?width=300&height=300'),
('steelhead', 'Steelhead', 3, 10, 10, FALSE, 70, 5, 0, '<:steelhead:1143636587838709780>', 'https://media.discordapp.net/attachments/1142680467825500264/1143651462090588331/steelhead.png?width=300&height=300'),
('stinger', 'Stinger', 4, 2, 10, FALSE, 85, 5, 0, '<:stinger:1143636585754132630>', 'https://media.discordapp.net/attachments/1142680467825500264/1143651461776027731/stinger.png?width=300&height=300'),
('goldie','Goldie', 4, 1, 10, FALSE, 85, 5, 2, '<:goldie:1143398987479646308>', 'https://media.discordapp.net/attachments/1142680467825500264/1143654352255459348/120px-S3_Goldie_icon.png?width=240&height=240');

CREATE TABLE king_salmon (
    stats_id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    health INT,
    chance INT,
    hitbox INT,
    points INT,
    emoji VARCHAR(255),
    image VARCHAR(255)
);

DELETE FROM king_salmon;
INSERT INTO king_salmon (stats_id, name, health, chance, hitbox, points, emoji, image) VALUES
('cohozuna', 'Cohozuna', 2, 50, 90, 100, '<:cohozuna:1145205344621039677>', 'https://media.discordapp.net/attachments/1142680467825500264/1145209514388369418/S3_Cohozuna_icon.png?width=800&height=800'),
('horrorboros', 'Horrorboros', 2, 0, 80, 100, '<:horrorboros:1145205346399420468>', 'https://media.discordapp.net/attachments/1142680467825500264/1145209514153480283/S3_Horrorboros_icon.png?width=800&height=800');