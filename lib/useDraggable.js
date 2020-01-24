import { useRef, useEffect } from "react";
import uuid from "uuid";

const DRAGGABLE = "Draggable";
const IS_DRAGGING = "Is-Dragging";

function useDraggable({ id = uuid(), groupId = uuid() }) {
	const draggableRef = useRef(null);

	const onDragStart = event => {
		const draggableElement = draggableRef.current;

		const elementStyle = window.getComputedStyle(draggableElement);
		const rect = draggableElement.getBoundingClientRect();
		const absoluteTop =
			window.pageYOffset + rect.top + parseInt(elementStyle.marginTop, 10);
		const absoluteLeft =
			window.pageXOffset + rect.left + parseInt(elementStyle.marginLeft, 10);

		draggableElement.classList.add(IS_DRAGGING);

		draggableElement.style.position = "fixed";
		draggableElement.style.top = `${absoluteTop}px`;
		draggableElement.style.left = `${absoluteLeft}px`;
	};

	const onDragEnd = () => {
		const draggableElement = draggableRef.current;
		draggableElement.classList.remove(IS_DRAGGING);
	};

	useEffect(() => {
		const draggableElement = draggableRef.current;
		if (!draggableElement) return;

		draggableElement.draggable = true;
		draggableElement.classList.add(DRAGGABLE);

		draggableElement.dataset.groupId = groupId;

		draggableElement.ondragstart = onDragStart;
		draggableElement.ondragend = onDragEnd;
	}, [draggableRef]);

	return [draggableRef, groupId];
}

export default useDraggable;
