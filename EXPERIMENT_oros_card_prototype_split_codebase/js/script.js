const card = document.querySelector('.card');
const front = document.querySelector('.front');
const back = document.querySelector('.back');
const qrContainer = document.querySelector('.qr-container');  // New QR container element
let isFlipped = false;

// Flip card when 'X' key is pressed
document.addEventListener('keydown', (e) => {
    if (e.key === 'x' || e.key === 'X') {
        flipCard();
    }
});

// Double-tap for touch devices
let lastTouchTime = 0;
const DOUBLE_TAP_THRESHOLD = 300; // Maximum time between taps in milliseconds

card.addEventListener('touchstart', (e) => {
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - lastTouchTime;

    if (timeDifference < DOUBLE_TAP_THRESHOLD) {
        flipCard(); // Call the flipCard function on double-tap
    }

    // Update last touch time
    lastTouchTime = currentTime;
});

// Function to handle the card flip
function flipCard() {
    // Stop the floating animation when flip starts
    card.style.animation = 'none';

    // Apply the flip transform with a delay to allow the animation to trigger
    setTimeout(() => {
        card.style.transform = isFlipped ? '' : 'rotateY(180deg)';
        isFlipped = !isFlipped;

        // Delay changing backface visibility to sync with animation duration
        setTimeout(() => {
            front.style.backfaceVisibility = isFlipped ? 'hidden' : 'visible';
            back.style.backfaceVisibility = isFlipped ? 'visible' : 'hidden';

            // Resume floating animation after flip completes
            card.style.animation = 'float 3s ease-in-out infinite';
        }, 200); // Sync this delay with the flip transition time
    }, 10); // Small delay to ensure animation triggers
}

// Parallax effect during mouse or touch movement (optional)
const applyParallax = (e) => {
    const cardRect = card.getBoundingClientRect();
    const centerX = cardRect.left + cardRect.width / 2;
    const centerY = cardRect.top + cardRect.height / 2;

    let deltaX, deltaY;

    if (e.touches) {
        // For touch events
        deltaX = (e.touches[0].clientX - centerX) / (cardRect.width / 2);
        deltaY = (e.touches[0].clientY - centerY) / (cardRect.height / 2);
    } else {
        // For mouse events
        deltaX = (e.clientX - centerX) / (cardRect.width / 2);
        deltaY = (e.clientY - centerY) / (cardRect.height / 2);
    }

    // Increase the factor to make the parallax stronger (e.g., double the intensity)
    const intensity = 50;

    const rotateX = Math.min(Math.max(deltaY * intensity, -intensity), intensity);
    const rotateY = Math.min(Math.max(deltaX * intensity, -intensity), intensity);

    card.style.transform = `rotateY(${rotateY}deg) rotateX(${-rotateX}deg)`;
}

// Stop floating animation when dragging (mouse or touch)
card.addEventListener('mousedown', () => {
    card.style.animation = 'none'; // Stop floating animation
});

card.addEventListener('touchstart', () => {
    card.style.animation = 'none'; // Stop floating animation
});

// Resume floating animation after dragging
document.addEventListener('mouseup', () => {
    card.style.animation = 'float 3s ease-in-out infinite'; // Resume floating if not flipped
    card.style.transform = ''; // Reset parallax if not flipped
});

document.addEventListener('touchend', () => {
    card.style.animation = 'float 3s ease-in-out infinite'; // Resume floating after touch
    card.style.transform = ''; // Reset parallax if not flipped
});

// Update parallax effect during mousemove or touchmove
document.addEventListener('mousemove', applyParallax);
card.addEventListener('touchmove', applyParallax);
