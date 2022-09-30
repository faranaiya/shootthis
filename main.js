const stats = {
    score: 0,
    lives: 3,
    bullets: 8,
    canReload: true,
};
let elementPos = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
];
const RENDER_STATS = "render-stats";
const RENDER_ELEMENT = "render-element";
const SCORE_KEY = "BEST_SCORE";
const givenTime = 3000; //IN MILISECONDS
const bgm = new Audio("./assets/bgm.ogg");

const randNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const pickPosition = () => {
    let row = randNumber(0, 2);
    let col = randNumber(0, 2);
    while (elementPos[row][col] !== 0) {
        row = randNumber(0, 2);
        col = randNumber(0, 2);
    }
    return [row, col];
};

const removeElement = (pos) => {
    const colPos = pos % 3;
    if (pos < 3) elementPos[0][colPos] = 0;
    else if (pos < 6) elementPos[1][colPos] = 0;
    else if (pos < 9) elementPos[2][colPos] = 0;
    document.dispatchEvent(new Event(RENDER_ELEMENT));
};

const reduceLives = (value) => {
    stats.lives -= value;
};

const enemyEscape = () => {
    for (const elementPosRow of elementPos) {
        for (const elementPosCol of elementPosRow) {
            if (elementPosCol === 1) {
                return true;
            }
        }
    }
    return false;
};

const timesUp = () => {
    if (enemyEscape()) {
        const hurtSound = new Audio("./assets/hurt.mp3");
        hurtSound.play();
        reduceLives(1);
    }
    elementPos = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ];
    document.dispatchEvent(new Event(RENDER_ELEMENT));
    document.dispatchEvent(new Event(RENDER_STATS));
};

const shotEnemy = (pos) => {
    if (stats.lives > 0 && stats.bullets > 0) {
        const gunSound = new Audio("./assets/gunshot.wav");
        gunSound.play();
        removeElement(pos);
        stats.score += 10;
        stats.bullets--;
        document.dispatchEvent(new Event(RENDER_STATS));
    }
};

const shotEmptyEnemy = () => {
    if (stats.lives > 0 && stats.bullets > 0) {
        const missSound = new Audio("./assets/miss.wav");
        missSound.play();
        stats.bullets--;
        document.dispatchEvent(new Event(RENDER_STATS));
    }
};

const shotHostage = (pos) => {
    if (stats.lives > 0 && stats.bullets > 0) {
        const hurtSound = new Audio("./assets/hurt.mp3");
        hurtSound.play();
        removeElement(pos);
        reduceLives(1);
        stats.bullets--;
        document.dispatchEvent(new Event(RENDER_STATS));
    }
};

const shotBomb = (pos) => {
    if (stats.lives > 0 && stats.bullets > 0) {
        const bombSound = new Audio("./assets/bomb.WAV");
        bombSound.play();
        removeElement(pos);
        reduceLives(3);
        stats.bullets--;
        document.dispatchEvent(new Event(RENDER_STATS));
    }
};

const reloadGuns = () => {
    if (stats.lives > 0 && stats.canReload) {
        const reloadSound = new Audio("./assets/reload.wav");
        reloadSound.play();
        stats.canReload = false;
        stats.bullets = 0;
        const timesToReload = 2000; //IN MILISECONDS
        document.dispatchEvent(new Event(RENDER_STATS));
        setTimeout(() => {
            stats.canReload = true;
            stats.bullets = 8;
            document.dispatchEvent(new Event(RENDER_STATS));
        }, timesToReload);
    }
};

const createEnemy = (pos) => {
    const enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemy.addEventListener("click", () => {
        shotEnemy(pos);
    });
    return enemy;
};

const createEmptyEnemy = () => {
    const emptyEnemy = document.createElement("div");
    emptyEnemy.classList.add("empty");
    emptyEnemy.addEventListener("click", () => {
        shotEmptyEnemy();
    });
    return emptyEnemy;
};

const createHostage = (pos) => {
    const hostage = document.createElement("div");
    hostage.classList.add("hostage");
    hostage.addEventListener("click", () => {
        shotHostage(pos);
    });
    return hostage;
};

const createBomb = (pos) => {
    const bomb = document.createElement("div");
    bomb.classList.add("bomb");
    bomb.addEventListener("click", () => {
        shotBomb(pos);
    });
    return bomb;
};

const elementAppear = () => {
    const numberOfEnemy = randNumber(0, 5);
    for (let i = 1; i <= numberOfEnemy; i++) {
        const enemyIndex = pickPosition();
        elementPos[enemyIndex[0]][enemyIndex[1]] = 1;
    }
    const numberOfHostage = randNumber(0, 2);
    for (let i = 1; i <= numberOfHostage; i++) {
        const hostageIndex = pickPosition();
        elementPos[hostageIndex[0]][hostageIndex[1]] = 2;
    }
    const numberOfBomb = randNumber(0, 2);
    for (let i = 1; i <= numberOfBomb; i++) {
        const bombIndex = pickPosition();
        elementPos[bombIndex[0]][bombIndex[1]] = 3;
    }
    document.dispatchEvent(new Event(RENDER_ELEMENT));
    setTimeout(() => {
        timesUp();
    }, givenTime);
};

const setBestScore = (value) => {
    const currentBest = localStorage.getItem(SCORE_KEY);
    if (currentBest === null || value > currentBest) {
        localStorage.setItem(SCORE_KEY, value);
    }
};

const gameOverScreen = () => {
    bgm.pause();
    const gameOverSound = new Audio("./assets/gameover.WAV");
    gameOverSound.play();
    const container = document.createElement("div");
    const title = document.createElement("h1");
    title.classList.add("game-over-title");
    title.innerText = "KASIAN GAMENYA UDAHAN";
    const score = document.createElement("h3");
    score.innerText = `SKOR AKHIR: ${stats.score}`;
    const message = document.createElement("p");
    if (stats.score <= 100) message.innerText = `"Nenek gw lebih jago dari loh"`;
    else if (stats.score <= 200) message.innerText = `"Yahh kalah sama bocil warnet"`;
    else if (stats.score <= 300) message.innerText = `"Loemayan lah ya daripada loemanyun"`;
    else if (stats.score <= 400) message.innerText = `"Wih jago juga bang"`;
    else if (stats.score > 400) message.innerText = `"Ampunn bang jago"`;
    container.append(title, score, message);
    if (typeof Storage !== undefined) {
        const bestScoreContainer = document.createElement("div");
        const bestScore = document.createElement("h3");
        bestScore.classList.add("best-score");
        bestScoreValue = localStorage.getItem(SCORE_KEY);
        bestScore.innerText = `SKOR TERBAIK: ${bestScoreValue}`;
        bestScoreContainer.appendChild(bestScore);
        container.appendChild(bestScoreContainer);
    }
    const button = document.createElement("button");
    button.classList.add("restart-button");
    button.innerText = "Main Lagi lah";
    button.addEventListener("click", () => {
        location.reload();
    });
    container.appendChild(button);
    return container;
};

const loadingScreen = () => {
    const container = document.createElement("div");
    const title = document.createElement("h1");
    title.classList.add("loading");
    title.innerText = "LOADING";
    container.appendChild(title);
    return container;
};

const startScreen = () => {
    const container = document.createElement("div");
    container.classList.add("start-screen");
    const title = document.createElement("h1");
    title.classList.add("start-title");
    title.innerText = "Shoot That!";
    const copyright = document.createElement("p");
    copyright.innerHTML = "penasaran ya ama gamenya";
    const button = document.createElement("button");
    button.classList.add("start-button");
    button.innerText = "Mulai";
    button.addEventListener("click", () => {
        toggleScreen();
        startGame();
    });
    const socialMedia = document.createElement("div");
    socialMedia.classList.add("social-media");
    socialMediaValue = [
        
    ];
    socialMediaValue.forEach((element) => {
        const span = document.createElement("span");
        span.innerHTML = `<a href="${element.url}" target="_blank">${element.icon}</a>`;
        socialMedia.appendChild(span);
    });
    container.append(title, button, copyright, socialMedia);
    return container;
};

const toggleScreen = (element = null) => {
    const menu = document.querySelector(".menu");
    menu.innerHTML = "";
    if (element) menu.appendChild(element);
    menu.classList.toggle("invisible");
};

const makeElementAppear = () => {
    const appear = setInterval(() => {
        if (stats.lives >= 1) {
            elementAppear();
        } else {
            //GAME OVER
            clearInterval(appear);
            if (typeof Storage !== undefined) {
                setBestScore(stats.score);
            }
            toggleScreen(gameOverScreen());
        }
    }, givenTime + 1000);
};

const makeIcon = (amount) => {
    const icons = [];
    for (let i = 1; i <= amount; i++) {
        const icon = document.createElement("span");
        icons.push(icon);
    }
    return icons;
};

document.addEventListener(RENDER_STATS, () => {
    const score = document.querySelector("#score");
    const lives = document.querySelector("#lives");
    const bullets = document.querySelector("#bullets");
    score.innerText = stats.score;
    lives.innerText = stats.lives;
    lives.innerHTML = "";
    bullets.innerHTML = "";
    const livesElement = makeIcon(stats.lives);
    lives.append(...livesElement);
    const bulletsElement = makeIcon(stats.bullets);
    bullets.append(...bulletsElement);
});

document.addEventListener(RENDER_ELEMENT, () => {
    const elementSpot = document.querySelectorAll(".element-spot");
    elementSpot.forEach((e) => {
        e.innerHTML = "";
    });
    let index = -1;
    for (const elementPosRow of elementPos) {
        for (const elementPosCol of elementPosRow) {
            index++;
            if (elementPosCol === 1) {
                const enemy = createEnemy(index);
                elementSpot[index].appendChild(enemy);
            } else if (elementPosCol === 2) {
                const hostage = createHostage(index);
                elementSpot[index].appendChild(hostage);
            } else if (elementPosCol === 3) {
                const bomb = createBomb(index);
                elementSpot[index].appendChild(bomb);
            } else {
                const emptyEnemy = createEmptyEnemy();
                elementSpot[index].appendChild(emptyEnemy);
            }
        }
    }
});

const startGame = () => {
    bgm.loop = true;
    bgm.play();
    document.dispatchEvent(new Event(RENDER_ELEMENT));
    document.dispatchEvent(new Event(RENDER_STATS));
    const reloadButton = document.querySelector("#reload");
    reloadButton.addEventListener("click", () => {
        reloadGuns();
    });
    makeElementAppear();
};

document.addEventListener("readystatechange", () => {
    if (document.readyState === "complete") {
        toggleScreen();
        toggleScreen(startScreen());
    } else {
        toggleScreen(loadingScreen());
    }
});
