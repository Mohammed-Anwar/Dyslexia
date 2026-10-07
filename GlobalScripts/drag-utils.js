/**
 * Drag & Drop Utility
 * Filename: drag-utils.js
 * 
 * Provides a reusable, touch-friendly drag system.
 * Attach to any element with:
 *   GameHub.utils.makeDraggable(element, onDropCallback)
 *
 * onDropCallback receives (pointerX, pointerY, element)
 * The element gets a .resetPosition() method to snap it back.
 */
(function () {
    window.GameHub = window.GameHub || {};
    window.GameHub.utils = window.GameHub.utils || {};

    /**
     * Check if a point (x, y) is inside an element's bounding box.
     * Useful for hit-testing drop targets.
     */
    window.GameHub.utils.isInside = function (x, y, targetEl) {
        const r = targetEl.getBoundingClientRect();
        return x > r.left && x < r.right && y > r.top && y < r.bottom;
    };

    /**
     * Make an element draggable via mouse or touch.
     * @param {HTMLElement} element - The element to drag.
     * @param {Function} onDrop - Called on release with (x, y, element).
     */
    window.GameHub.utils.makeDraggable = function (element, onDrop) {
        let startX = 0;
        let startY = 0;
        let isDragging = false;

        // Give every draggable a way to snap back to origin
        element.resetPosition = function () {
            element.style.transform = 'translate3d(0, 0, 0)';
            element.style.zIndex = '';
            element.style.transition = 'transform 0.3s ease';
            setTimeout(() => { element.style.transition = ''; }, 300);
        };

        function onStart(e) {
            isDragging = true;
            const pointer = e.touches ? e.touches[0] : e;
            startX = pointer.clientX;
            startY = pointer.clientY;
            element.style.zIndex = '1000';
            element.style.transition = 'none';
            element.style.cursor = 'grabbing';
            e.preventDefault();
        }

        function onMove(e) {
            if (!isDragging) return;
            const pointer = e.touches ? e.touches[0] : e;
            const dx = pointer.clientX - startX;
            const dy = pointer.clientY - startY;
            element.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
            e.preventDefault();
        }

        function onEnd(e) {
            if (!isDragging) return;
            isDragging = false;
            element.style.cursor = 'grab';

            const pointer = e.changedTouches ? e.changedTouches[0] : e;

            if (typeof onDrop === 'function') {
                onDrop(pointer.clientX, pointer.clientY, element);
            }
        }

        // Mouse events
        element.addEventListener('mousedown', onStart);
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);

        // Touch events (passive: false so we can preventDefault scrolling)
        element.addEventListener('touchstart', onStart, { passive: false });
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onEnd);
    };
})();