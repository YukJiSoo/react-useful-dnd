import { useRef, useEffect } from "react";
import uuid from "uuid";

const DROPPABLE = "Droppable";
const DRAGGABLE = "Draggable";
const IS_DRAGGING = "Is-Dragging";

function useDroppable({ id = uuid(), groupId = uuid(), items, setItems }) {
	const droppableRef = useRef(null);

	const onDragStart = () => {
		const droppableElement = droppableRef.current;

		const draggableElements = Array.from(
			droppableElement.querySelectorAll(`.${DRAGGABLE}`)
		);

		const draggingElement = droppableElement.querySelector(`.${IS_DRAGGING}`);
		if (!draggingElement) return;

		const elementStyle = window.getComputedStyle(draggingElement);
		const valueYTranslate =
			draggingElement.getBoundingClientRect().height +
			parseInt(elementStyle.marginBottom, 10);
		const indexOfDraggingElement = draggableElements.findIndex(element =>
			element.classList.contains(IS_DRAGGING)
		);

		draggableElements
			.slice(indexOfDraggingElement + 1, draggableElements.length)
			.forEach(element => {
				element.style.transform = `translateY(${valueYTranslate}px)`;
				element.style.transition = "none 0s ease 0s";
			});
	};

	const onDragEnd = () => {
		const droppableElement = droppableRef.current;

		Array.from(
			droppableElement.querySelectorAll(`.${DRAGGABLE}`)
		).forEach(element => element.removeAttribute("style"));
	};

	const onDragLeave = event => {
		const droppableElement = droppableRef.current;

		if (event.target !== event.currentTarget) return;
		if (droppableElement.contains(event.relatedTarget)) return;

		const draggingElement = droppableElement.querySelector(`.${IS_DRAGGING}`);
		draggingElement.style.display = "none";

		Array.from(droppableElement.querySelectorAll(`.${DRAGGABLE}`))
			.filter(element => !element.classList.contains(IS_DRAGGING))
			.forEach(element => element.removeAttribute("style"));
	};

	useEffect(() => {
		const droppableElement = droppableRef.current;
		if (!droppableElement) return;

		droppableElement.classList.add(DROPPABLE);

		droppableElement.ondragstart = onDragStart;
		droppableElement.ondragend = onDragEnd;
		droppableElement.ondragleave = onDragLeave;
	}, [droppableRef]);

	return [droppableRef, id, groupId];
}

export default useDroppable;
