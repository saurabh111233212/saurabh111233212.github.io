// Fun website effects: floating animals and cursor trail - CHAOS MODE
(function() {
    'use strict';

    // Array of fun animals - MORE COWS!
    const animals = ['🐄', '🦆', '🐮', '🦕', '🦖', '🐄', '🐥', '🦙', '🐄', '🐮', '🦆', '🐄', '🦕', '🐸'];

    // State tracking
    let floatingInterval = null;
    let mouseMoveHandler = null;
    let isActive = false;

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
        const animal = document.createElement('div');
        animal.className = 'floating-animal';
        animal.textContent = animals[Math.floor(Math.random() * animals.length)];

        // Random vertical position
        const topPosition = Math.random() * (window.innerHeight - 100);
        animal.style.top = topPosition + 'px';

        // FASTER animation duration
        const duration = 8 + Math.random() * 8; // 8-16 seconds (was 15-30)
        animal.style.animationDuration = duration + 's';

        // Random delay
        const delay = Math.random() * 2;
        animal.style.animationDelay = delay + 's';

        document.body.appendChild(animal);

        // Remove after animation completes
        setTimeout(() => {
            if (animal.parentNode) {
                animal.parentNode.removeChild(animal);
            }
        }, (duration + delay) * 1000);
    }

    // Cursor trail effect
    let lastTrailTime = 0;
    const trailDelay = 50; // milliseconds between trail emissions (was 150 - MORE TRAILS!)

    function createCursorTrail(e) {
        const now = Date.now();
        if (now - lastTrailTime < trailDelay) return;
        lastTrailTime = now;

        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.textContent = animals[Math.floor(Math.random() * animals.length)];
        trail.style.left = e.pageX + 'px';
        trail.style.top = e.pageY + 'px';

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

        // Create WAY MORE initial animals
        for (let i = 0; i < 15; i++) {
            setTimeout(() => createFloatingAnimal(), i * 500);
        }

        // Create new animal every 2 seconds (was 5 - MORE ANIMALS!)
        floatingInterval = setInterval(createFloatingAnimal, 2000);

        // Add cursor trail on mouse move
        let mouseMoveTimeout;
        mouseMoveHandler = function(e) {
            // Less throttling for more trails
            if (!mouseMoveTimeout) {
                mouseMoveTimeout = setTimeout(() => {
                    createCursorTrail(e);
                    mouseMoveTimeout = null;
                }, 30);
            }
        };
        document.addEventListener('mousemove', mouseMoveHandler);
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

        // Remove mouse move listener
        if (mouseMoveHandler) {
            document.removeEventListener('mousemove', mouseMoveHandler);
            mouseMoveHandler = null;
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
