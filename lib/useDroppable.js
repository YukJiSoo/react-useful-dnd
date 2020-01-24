import { useRef, useEffect } from "react";
import uuid from "uuid";

const DROPPABLE = "Droppable";
const DRAGGABLE = "Draggable";
const IS_DRAGGING = "Is-Dragging";

function useDroppable({ id = uuid(), groupId = uuid(), items, setItems }) {
	const droppableRef = useRef(null);
	const dragginElementHeightRef = useRef(null);

	const onDragStart = () => {
		const droppableElement = droppableRef.current;

		const draggableElements = Array.from(
			droppableElement.querySelectorAll(`.${DRAGGABLE}`)
		);

		const draggingElement = droppableElement.querySelector(`.${IS_DRAGGING}`);
		if (!draggingElement) return;

		const elementStyle = window.getComputedStyle(draggingElement);
		dragginElementHeightRef.current =
			draggingElement.getBoundingClientRect().height +
			parseInt(elementStyle.marginBottom, 10);
		const indexOfDraggingElement = draggableElements.findIndex(element =>
			element.classList.contains(IS_DRAGGING)
		);

		draggableElements
			.slice(indexOfDraggingElement + 1, draggableElements.length)
			.forEach(element => {
				element.style.transform = `translateY(${dragginElementHeightRef.current}px)`;
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

	const onDragOver = event => {
		const draggableElement = event.target;
		if (!draggableElement.classList.contains(DRAGGABLE)) return;

		const draggingElement = document.querySelector(`.${IS_DRAGGING}`);
		if (draggableElement === draggingElement) return;

		const droppableElement = droppableRef.current;
		const draggableElements = Array.from(
			droppableElement.querySelectorAll(`.${DRAGGABLE}`)
		);

		const indexOfDraggingElement = draggableElements.findIndex(element =>
			element.classList.contains(IS_DRAGGING)
		);
		const indexOfDraggableElement = draggableElements.findIndex(
			element => element === draggableElement
		);

		const valueYTranslate = dragginElementHeightRef.current;

		draggableElements.slice(0, indexOfDraggableElement).forEach(element => {
			element.style.removeProperty("transform");
		});

		draggableElements
			.slice(indexOfDraggableElement + 1, draggableElements.length)
			.forEach(element => {
				element.style.transform = `translateY(${valueYTranslate}px)`;
			});

		const dragingTranslateYValue =
			valueYTranslate * (indexOfDraggableElement - indexOfDraggingElement);

		const draggableElementStyle = window.getComputedStyle(draggableElement);
		if (draggableElementStyle.transform !== "none") {
			draggableElement.style.removeProperty("transform");

			if (indexOfDraggingElement > indexOfDraggableElement)
				draggingElement.style.transform = `translateY(${dragingTranslateYValue +
					valueYTranslate}px)`;
			else
				draggingElement.style.transform = `translateY(${dragingTranslateYValue}px)`;
		} else {
			draggableElement.style.transform = `translateY(${valueYTranslate}px)`;
			draggableElement.style.transition = "none 0s ease 0s";

			if (indexOfDraggingElement < indexOfDraggableElement)
				draggingElement.style.transform = `translateY(${dragingTranslateYValue -
					valueYTranslate}px)`;
			else
				draggingElement.style.transform = `translateY(${dragingTranslateYValue}px)`;
		}
		draggingElement.style.display = "block";
	};

	useEffect(() => {
		const droppableElement = droppableRef.current;
		if (!droppableElement) return;

		droppableElement.classList.add(DROPPABLE);

		droppableElement.ondragstart = onDragStart;
		droppableElement.ondragend = onDragEnd;
		droppableElement.ondragleave = onDragLeave;
		droppableElement.ondragover = onDragOver;
	}, [droppableRef]);

	return [droppableRef, id, groupId];
}

export default useDroppable;
