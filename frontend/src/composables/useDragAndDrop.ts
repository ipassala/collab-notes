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
    getPosition: () => DragPosition,
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

        // Guardo la posición inicial
        const initialPosition = getPosition();
        initialX.value = initialPosition.x;
        initialY.value = initialPosition.y;

        // Asocio funciones a los eventos de click
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }

    function onMouseMove(e: MouseEvent) {
        if (!isDragging.value) return;

        // Calculo la diferencia entre la posición inicial y la actual
        const dx = e.clientX - startX.value;
        const dy = e.clientY - startY.value;

        // Actualizo la posición
        updatePosition({
            x: initialX.value + dx,
            y: initialY.value + dy,
        });
    }

    function onMouseUp() {
        if (!isDragging.value) return;

        // Desasocio funciones a los eventos de click
        isDragging.value = false;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);

        // Actualizo la posición final
        const finalPosition = getPosition();
        options.onDragEnd?.(finalPosition);
    }

    return {
        isDragging,
        onMouseDown,
    };
}
