import { useRef, useEffect } from "react";
import uuid from "uuid";

const DRAGGABLE = "Draggable";
const IS_DRAGGING = "Is-Dragging";

function useDraggable({ id = uuid(), groupId = uuid(), droppableId = uuid() }) {
	const draggableRef = useRef(null);

	const onDragStart = () => {
		const draggableElement = draggableRef.current;

		const elementStyle = window.getComputedStyle(draggableElement);
		const rect = draggableElement.getBoundingClientRect();
		const absoluteTop =
			window.pageYOffset + rect.top + parseInt(elementStyle.marginTop, 10);
		const absoluteLeft =
			window.pageXOffset + rect.left + parseInt(elementStyle.marginLeft, 10);

		draggableElement.classList.add(IS_DRAGGING);

		draggableElement.style.position = "absolute";
		draggableElement.style.top = `${absoluteTop}px`;
		draggableElement.style.left = `${absoluteLeft}px`;
	};

	const onDragEnd = () => {
		Array.from(document.querySelectorAll(`.${DRAGGABLE}`)).forEach(element =>
			element.style.removeProperty("transform")
		);

		const draggableElement = draggableRef.current;
		if (!draggableElement) return;

		draggableElement.classList.remove(IS_DRAGGING);

		draggableElement.style.removeProperty("position");
		draggableElement.style.removeProperty("top");
		draggableElement.style.removeProperty("left");
		draggableElement.style.removeProperty("display");

		const { droppableId } = draggableElement.dataset;

		draggableElement.dataset.originDroppableId = droppableId;
		delete draggableElement.dataset.draggingIndex;
	};

	useEffect(() => {
		const draggableElement = draggableRef.current;
		if (!draggableElement) return;

		draggableElement.draggable = true;
		draggableElement.classList.add(DRAGGABLE);

		draggableElement.dataset.groupId = groupId;
		draggableElement.dataset.droppableId = droppableId;
		draggableElement.dataset.originDroppableId = droppableId;

		draggableElement.ondragstart = onDragStart;
		draggableElement.ondragend = onDragEnd;
	}, [draggableRef]);

	return [draggableRef, id];
}

export default useDraggable;
