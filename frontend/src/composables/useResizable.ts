import { ref, type Ref } from 'vue';

interface Size {
    width: number;
    height: number;
}

interface UseResizableOptions {
    onResizeStart?: () => void;
    onResizeEnd?: (size: Size) => void;
    minWidth?: number;
    minHeight?: number;
}

export function useResizable(
    getSize: () => Size,
    updateSize: (size: Size) => void,
    isLocked: Ref<boolean>,
    options: UseResizableOptions = {}
) {
    const isResizing = ref(false);

    function onResizeStart(e: MouseEvent) {
        if (isLocked.value) return;
        e.stopPropagation(); // Evitar conflicto con drag

        isResizing.value = true;
        options.onResizeStart?.();

        const startX = e.clientX;
        const startY = e.clientY;
        const { width: startWidth, height: startHeight } = getSize();

        function onResizeMove(e: MouseEvent) {
            if (!isResizing.value) return;

            const currentWidth = startWidth + (e.clientX - startX);
            const currentHeight = startHeight + (e.clientY - startY);

            // Aplicar mínimos
            const newWidth = Math.max(options.minWidth || 200, currentWidth);
            const newHeight = Math.max(options.minHeight || 150, currentHeight);

            updateSize({ width: newWidth, height: newHeight });
        }

        function onResizeEnd() {
            isResizing.value = false;
            window.removeEventListener('mousemove', onResizeMove);
            window.removeEventListener('mouseup', onResizeEnd);

            const finalSize = getSize();
            options.onResizeEnd?.(finalSize);
        }

        window.addEventListener('mousemove', onResizeMove);
        window.addEventListener('mouseup', onResizeEnd);
    }

    return {
        isResizing,
        onResizeStart
    };
}
