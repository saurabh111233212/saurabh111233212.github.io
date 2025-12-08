// Fun website effects: floating animals and cursor trail - CHAOS MODE
(function() {
    'use strict';

    // Array of fun animals - COWS, DINOS, AND DUCKS ONLY - MAXIMUM CHAOS!
    const animals = ['🐄', '🐮', '🦕', '🦖', '🦆', '🐄', '🐮', '🦕', '🦖', '🦆', '🐄', '🐮', '🦕', '🦖', '🦆', '🐄', '🐮', '🦕', '🦖', '🦆'];

    // State tracking
    let floatingInterval = null;
    let mouseMoveHandler = null;
    let scrollHandler = null;
    let mouseMoveTimeout = null;
    let pendingTimeouts = [];
    let isActive = false;
    let lastMouseClientX = 0; // Position relative to viewport
    let lastMouseClientY = 0; // Position relative to viewport

    // Play the real MOO sound!
    function playMooSound() {
        try {
            const audio = new Audio('/assets/moo.mp3');
            audio.volume = 0.5; // Set volume to 50%
            audio.play().catch(e => {
                console.log('Could not play moo sound:', e);
            });
        } catch (e) {
            console.log('Could not play moo sound:', e);
        }
    }

    // Create floating animals
    function createFloatingAnimal() {
        if (!isActive) return; // Don't create if not active

        const animal = document.createElement('div');
        animal.className = 'floating-animal';
        animal.textContent = animals[Math.floor(Math.random() * animals.length)];

        // Random vertical position
        const topPosition = Math.random() * (window.innerHeight - 100);
        animal.style.top = topPosition + 'px';

        // Start offscreen to the left
        animal.style.left = '-150px';

        // ULTRA FAST animation duration - MAXIMUM CHAOS MODE!
        const duration = 3 + Math.random() * 5; // 3-8 seconds (was 4-10)
        animal.style.animationDuration = duration + 's';

        // No delay - animals should start moving immediately
        // const delay = Math.random() * 2;
        // animal.style.animationDelay = delay + 's';

        document.body.appendChild(animal);

        // Remove after animation completes
        const removeTimeout = setTimeout(() => {
            if (animal.parentNode) {
                animal.parentNode.removeChild(animal);
            }
        }, duration * 1000);

        // Track this timeout so we can clear it if needed
        pendingTimeouts.push(removeTimeout);
    }

    // Cursor trail effect - ULTRA TRAILS!
    let lastTrailTime = 0;
    const trailDelay = 30; // milliseconds between trail emissions (was 50 - MAXIMUM TRAILS!)

    function createCursorTrail(x, y) {
        if (!isActive) return; // Don't create trails if not active
        const now = Date.now();
        if (now - lastTrailTime < trailDelay) return;
        lastTrailTime = now;

        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.textContent = animals[Math.floor(Math.random() * animals.length)];
        trail.style.left = x + 'px';
        trail.style.top = y + 'px';

        document.body.appendChild(trail);

        // Remove after animation
        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        }, 1500);
    }

    // Start the fun effects - CHAOS MODE
    function start() {
        if (isActive) return;
        isActive = true;

        // PLAY THE MOO!
        playMooSound();

        // Create INSANE number of initial animals - ULTIMATE CHAOS!
        for (let i = 0; i < 40; i++) {
            const timeout = setTimeout(() => createFloatingAnimal(), i * 200);
            pendingTimeouts.push(timeout);
        }

        // Create new animal every 0.5 seconds - ABSOLUTE MAXIMUM CHAOS!
        floatingInterval = setInterval(createFloatingAnimal, 500);

        // Add cursor trail on mouse move - MAXIMUM TRAILS!
        mouseMoveHandler = function(e) {
            // Track last mouse position relative to viewport
            lastMouseClientX = e.clientX;
            lastMouseClientY = e.clientY;

            // MINIMAL throttling for MAXIMUM trails
            if (!mouseMoveTimeout) {
                mouseMoveTimeout = setTimeout(() => {
                    // Use viewport coordinates directly (position: fixed in CSS)
                    createCursorTrail(lastMouseClientX, lastMouseClientY);
                    mouseMoveTimeout = null;
                }, 15); // Even less delay!
            }
        };
        document.addEventListener('mousemove', mouseMoveHandler);

        // Add cursor trail on scroll too - CHAOS EVERYWHERE!
        scrollHandler = function() {
            // Use viewport coordinates directly (position: fixed in CSS)
            createCursorTrail(lastMouseClientX, lastMouseClientY);
        };
        document.addEventListener('scroll', scrollHandler, { passive: true });
    }

    // Stop the fun effects
    function stop() {
        if (!isActive) return;
        isActive = false;

        // Clear the interval
        if (floatingInterval) {
            clearInterval(floatingInterval);
            floatingInterval = null;
        }

        // Clear any pending mouse move timeout
        if (mouseMoveTimeout) {
            clearTimeout(mouseMoveTimeout);
            mouseMoveTimeout = null;
        }

        // Clear all pending timeouts (for delayed animal creation)
        pendingTimeouts.forEach(timeout => clearTimeout(timeout));
        pendingTimeouts = [];

        // Remove mouse move listener
        if (mouseMoveHandler) {
            document.removeEventListener('mousemove', mouseMoveHandler);
            mouseMoveHandler = null;
        }

        // Remove scroll listener
        if (scrollHandler) {
            document.removeEventListener('scroll', scrollHandler);
            scrollHandler = null;
        }

        // Remove all existing animals and trails
        const animals = document.querySelectorAll('.floating-animal, .cursor-trail');
        animals.forEach(animal => {
            if (animal.parentNode) {
                animal.parentNode.removeChild(animal);
            }
        });
    }

    // Expose API globally
    window.funEffects = {
        start: start,
        stop: stop,
        isActive: function() { return isActive; }
    };
})();
