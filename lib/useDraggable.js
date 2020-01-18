import { useRef, useEffect } from "react";
import uuid from "uuid";

function useDraggable() {
	const id = uuid();
	const draggableRef = useRef(null);

	const onDragStart = () => {
		const draggingTarget = draggableRef.current;
		draggingTarget.classList.add("Is-Dragging");
	};

	const onDragEnd = () => {
		const draggingTarget = draggableRef.current;
		draggingTarget.classList.remove("Is-Dragging");
	};

	useEffect(() => {
		const targetElement = draggableRef.current;
		if (!targetElement) return;

		targetElement.draggable = true;
		targetElement.ondragstart = onDragStart;
		targetElement.ondragend = onDragEnd;
	}, [draggableRef]);

	return [id, draggableRef];
}

export default useDraggable;
