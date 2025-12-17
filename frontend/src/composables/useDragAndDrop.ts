import { ref, type Ref } from 'vue';

interface DragPosition {
    x: number;
    y: number;
}

interface UseDragAndDropOptions {
    onDragStart?: () => void;
    onDragEnd?: (position: DragPosition) => void;
}

export function useDragAndDrop(
    getInitialPosition: () => DragPosition,
    updatePosition: (position: DragPosition) => void,
    options: UseDragAndDropOptions = {}
) {
    const isDragging = ref(false);
    const startX = ref(0);
    const startY = ref(0);
    const initialX = ref(0);
    const initialY = ref(0);

    function onMouseDown(e: MouseEvent) {
        options.onDragStart?.();

        isDragging.value = true;
        startX.value = e.clientX;
        startY.value = e.clientY;

        const initialPosition = getInitialPosition();
        initialX.value = initialPosition.x;
        initialY.value = initialPosition.y;

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }

    function onMouseMove(e: MouseEvent) {
        if (!isDragging.value) return;

        const dx = e.clientX - startX.value;
        const dy = e.clientY - startY.value;

        updatePosition({
            x: initialX.value + dx,
            y: initialY.value + dy,
        });
    }

    function onMouseUp() {
        if (!isDragging.value) return;

        isDragging.value = false;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);

        const finalPosition = getInitialPosition();
        options.onDragEnd?.(finalPosition);
    }

    return {
        isDragging,
        onMouseDown,
    };
}
