import { ref, type Ref } from 'vue';

export function useDraggableScroll(containerRef: Ref<HTMLElement | null>) {
    const isDragging = ref(false);
    const startX = ref(0);
    const startY = ref(0);
    const scrollLeft = ref(0);
    const scrollTop = ref(0);

    function onMouseDown(e: MouseEvent) {
        if (!containerRef.value) return;
        if (e.target !== containerRef.value) return; // Solo permitir drag si el click es en el contenedor

        isDragging.value = true;

        // Capturo posición inicial
        startX.value = e.pageX - containerRef.value.offsetLeft;
        startY.value = e.pageY - containerRef.value.offsetTop;
        scrollLeft.value = containerRef.value.scrollLeft;
        scrollTop.value = containerRef.value.scrollTop;

        // Agregar eventos mientras se hace grab
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }

    function onMouseMove(e: MouseEvent) {
        if (!isDragging.value || !containerRef.value) return;

        e.preventDefault();

        // Calcular movimiento
        const x = e.pageX - containerRef.value.offsetLeft;
        const y = e.pageY - containerRef.value.offsetTop;

        // Mover scroll
        containerRef.value.scrollLeft = scrollLeft.value - (x - startX.value);
        containerRef.value.scrollTop = scrollTop.value - (y - startY.value);
    }

    function onMouseUp() {
        isDragging.value = false;

        // Quitar eventos ya que se terminó el drag
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    }

    return {
        onMouseDown,
        isDragging
    };
}
