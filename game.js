// Game Constants
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
const GRAVITY = 0.5;
const JUMP_STRENGTH = 12;
const MOVE_SPEED = 4;
const PLATFORM_HEIGHT = 20;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;

// Player variables
let player = {
    x: 100,
    y: canvas.height - 150,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    velocityX: 0,
    velocityY: 0,
    speed: MOVE_SPEED,
    isJumping: false,
    isGrounded: false,
};

// Platform array
let platforms = [];
let platformCount = 10;

// Event listeners for player movement
let keys = { left: false, right: false, space: false };

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'ArrowRight') keys.right = true;
    if (e.key === ' ') keys.space = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowRight') keys.right = false;
    if (e.key === ' ') keys.space = false;
});

// Platform generation
function generatePlatforms() {
    platforms = [];
    let yPos = canvas.height - 100;
    for (let i = 0; i < platformCount; i++) {
        let xPos = Math.random() * (canvas.width - 100);
        platforms.push({ x: xPos, y: yPos, width: 100, height: PLATFORM_HEIGHT });
        yPos -= Math.random() * 150 + 50; // space between platforms
    }
}

// Physics: gravity and collision
function applyPhysics() {
    // Gravity
    if (!player.isGrounded) {
        player.velocityY += GRAVITY;
    } else {
        player.velocityY = 0;
    }

    // Player movement
    if (keys.left) player.velocityX = -player.speed;
    else if (keys.right) player.velocityX = player.speed;
    else player.velocityX = 0;

    player.x += player.velocityX;
    player.y += player.velocityY;

    // Platform collision check
    player.isGrounded = false;
    for (let plat of platforms) {
        if (
            player.x + player.width > plat.x &&
            player.x < plat.x + plat.width &&
            player.y + player.height <= plat.y &&
            player.y + player.height + player.velocityY >= plat.y
        ) {
            player.y = plat.y - player.height;
            player.isGrounded = true;
        }
    }

    // Boundary checks
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

// Jumping mechanism
function jump() {
    if (keys.space && player.isGrounded) {
        player.velocityY = -JUMP_STRENGTH;
        player.isJumping = true;
    }
}

// Render the game
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = 'green';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw platforms
    ctx.fillStyle = 'brown';
    for (let plat of platforms) {
        ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
    }
}

// Update game state
function update() {
    applyPhysics();
    jump();
    render();
    requestAnimationFrame(update);
}

// Initialize and start the game
generatePlatforms();
update();
