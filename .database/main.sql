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
    powerEggs INT DEFAULT 0,
    goldenEggs INT DEFAULT 999,
    WB INT DEFAULT 0,
    KW INT DEFAULT 0,
    BB INT DEFAULT 0,
    bronzeScale INT DEFAULT 0,
    silverScale INT DEFAULT 0,
    goldScale INT DEFAULT 0
);

CREATE TABLE blacklistChannels (
    serverID INT,
    channelID INT 
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