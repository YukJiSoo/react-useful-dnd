import { useRef, useEffect, useContext } from "react";
import DnDActions from "./DnDActions";
import uuid from "uuid";

const DROPPABLE = "Droppable";
const DRAGGABLE = "Draggable";
const IS_DRAGGING = "Is-Dragging";

function useDroppable({ id = uuid(), context }) {
	const { dndState, dispatchDnD, groupId } = useContext(context);

	const droppableRef = useRef(null);
	const dragginElementHeightRef = useRef(null);

	const onDragStart = () => {
		const droppableElement = droppableRef.current;

		const draggingElement = droppableElement.querySelector(`.${IS_DRAGGING}`);
		if (!draggingElement) return;

		const draggableElements = Array.from(
			droppableElement.querySelectorAll(`.${DRAGGABLE}`)
		);

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

		draggingElement.dataset.draggingIndex = indexOfDraggingElement;
		draggingElement.dataset.originDraggableId = indexOfDraggingElement;
	};

	const onDragLeave = event => {
		const droppableElement = droppableRef.current;

		if (!event.relatedTarget) return;
		if (droppableElement.contains(event.relatedTarget)) return;
		if (event.target.classList.contains(DRAGGABLE)) return;

		const draggingElement = document.querySelector(`.${IS_DRAGGING}`);
		draggingElement.style.display = "none";

		Array.from(droppableElement.querySelectorAll(`.${DRAGGABLE}`))
			.filter(element => !element.classList.contains(IS_DRAGGING))
			.forEach(element => element.removeAttribute("style"));

		const { originDroppableId } = draggingElement.dataset;
		draggingElement.dataset.draggingIndex = -2;
		draggingElement.dataset.droppableId = originDroppableId;
	};

	const onDragOver = event => {
		event.preventDefault();

		const draggableElement = event.target;
		if (!draggableElement.classList.contains(DRAGGABLE)) return;

		const draggingElement = document.querySelector(`.${IS_DRAGGING}`);
		if (draggableElement === draggingElement) return;
		if (groupId !== draggingElement.dataset.groupId) return;

		const droppableElement = droppableRef.current;
		const draggableElements = Array.from(
			droppableElement.querySelectorAll(`.${DRAGGABLE}`)
		);

		const indexOfDraggingElement = Number(
			draggingElement.dataset.draggingIndex
		);
		let indexOfDraggableElement = draggableElements.findIndex(
			element => element === draggableElement
		);

		const elementStyle = window.getComputedStyle(draggableElement);
		const rect = draggableElement.getBoundingClientRect();
		const absoluteTop =
			window.pageYOffset + rect.top + parseInt(elementStyle.marginTop, 10);
		const absoluteLeft =
			window.pageXOffset + rect.left + parseInt(elementStyle.marginLeft, 10);

		draggingElement.style.display = "block";
		draggingElement.style.top = `${absoluteTop}px`;
		draggingElement.style.left = `${absoluteLeft}px`;

		if (!dragginElementHeightRef.current) {
			dragginElementHeightRef.current =
				draggingElement.getBoundingClientRect().height +
				parseInt(elementStyle.marginBottom, 10);
		}

		if (
			indexOfDraggingElement !== -2 &&
			indexOfDraggingElement < indexOfDraggableElement
		) {
			draggingElement.dataset.draggingIndex = indexOfDraggableElement;
			indexOfDraggableElement += 1;
		} else {
			const { originDroppableId } = draggingElement.dataset;
			const { droppableId } = draggableElement.dataset;
			draggingElement.dataset.draggingIndex =
				originDroppableId === droppableId
					? indexOfDraggableElement
					: indexOfDraggableElement - 1;
		}

		draggableElements.slice(0, indexOfDraggableElement).forEach(element => {
			element.style.removeProperty("transform");
		});
		draggableElements
			.slice(indexOfDraggableElement, draggableElements.length)
			.filter(element => !element.classList.contains(IS_DRAGGING))
			.forEach(element => {
				element.style.transform = `translateY(${dragginElementHeightRef.current}px)`;
			});

		const { droppableId } = draggableElement.dataset;
		if (draggingElement.dataset.droppableId === droppableId) return;

		draggingElement.dataset.droppableId = droppableId;
	};

	const onDragEnd = () => {
		const droppableElement = droppableRef.current;

		const draggingElement = document.querySelector(`.${IS_DRAGGING}`);
		const nextIndexOfDraggingElement = Number(
			draggingElement.dataset.draggingIndex
		);

		const droppableIdOfDraggingElement = draggingElement.dataset.droppableId;

		let actionCreator,
			payload = {};
		if (nextIndexOfDraggingElement === -2) {
			actionCreator = DnDActions.Creators.revertToOrigin;
		} else if (droppableIdOfDraggingElement === droppableElement.id) {
			const draggableElements = Array.from(
				droppableElement.querySelectorAll(`.${DRAGGABLE}`)
			);
			const prevIndexOfDraggingElement = draggableElements.findIndex(
				element => element === draggingElement
			);

			payload = {
				targetId: id,
				prevIndexOfDraggingElement,
				nextIndexOfDraggingElement
			};
			actionCreator = DnDActions.Creators.updateOneDroppable;
		} else if (droppableIdOfDraggingElement !== droppableElement.id) {
			const {
				droppableId,
				originDraggableId,
				originDroppableId
			} = draggingElement.dataset;

			payload = {
				targetId: droppableId,
				sourceId: originDroppableId,
				prevIndexOfDraggingElement: originDraggableId,
				nextIndexOfDraggingElement
			};
			actionCreator = DnDActions.Creators.updateTwoDroppable;
		}

		const action = actionCreator(payload);
		dispatchDnD(action);
	};

	useEffect(() => {
		const droppableElement = droppableRef.current;
		if (!droppableElement) return;

		droppableElement.classList.add(DROPPABLE);

		droppableElement.ondragstart = onDragStart;
		droppableElement.ondragleave = onDragLeave;
		droppableElement.ondragover = onDragOver;
		droppableElement.addEventListener("dragend", onDragEnd, true);
	}, [droppableRef]);

	const datas = dndState[id].data;

	return [droppableRef, id, datas, groupId];
}

export default useDroppable;
