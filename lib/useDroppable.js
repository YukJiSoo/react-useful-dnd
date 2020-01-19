import { useRef, useEffect } from "react";
import { getChildNodeIndex } from "./utils";

const DRAGGABLE_CLASS_NAME = "Draggable";
const DROP_ZONE_CLASS_NAME = "DropZone";

/** @function
 * @name insertNode
 *
 * @param container container element
 * @param target target element
 * @param base base element
 *
 * @description Insert target according to base element into container element.
 */
function insertNode(container, target, base) {
	const targetItemIndex = getChildNodeIndex(container, target);
	const baseItemIndex = getChildNodeIndex(container, base);

	// this condition is met when drag to another droppable element
	if (targetItemIndex === -1 && baseItemIndex === -1) {
		container.appendChild(target);
	}
	if (targetItemIndex === baseItemIndex) return;
	if (targetItemIndex < baseItemIndex) {
		container.insertBefore(target, base.nextSibling);
	} else {
		container.insertBefore(target, base);
	}
}

/** @function
 * @name getIndexOfItemWhichMouseOver
 *
 * @param container container element
 * @param mousePointerY Y position of current mouse
 *
 * @description Gets the position of an item based on the current mouse position
 */
function getIndexOfItemWhichMouseOver(container, mousePointerY) {
	let startPoint = container.getBoundingClientRect().top;

	const childNodesArray = Array.from(container.childNodes);
	return childNodesArray.findIndex(child => {
		const rect = child.getBoundingClientRect();
		const endPoint = rect.top + rect.height;
		if (mousePointerY >= startPoint && mousePointerY <= endPoint) return true;

		startPoint = endPoint;
		return false;
	});
}

function useDroppable({ id }) {
	const droppableRef = useRef(null);

	const onDragOver = event => {
		event.preventDefault();

		let targetElement = event.target;
		const droppableElement = droppableRef.current;

		// if target element is dragging, return
		const draggingItemElement = document.querySelector(".Is-Dragging");
		if (targetElement === draggingItemElement) return;

		draggingItemElement.classList.remove("Draggable-Leave");
		// if target element is droppable,
		// 1) get index of item which mouse over
		// 2) insert!
		if (targetElement === droppableElement) {
			const mousePointerY = event.pageY;
			const targetItemIndex = getIndexOfItemWhichMouseOver(
				droppableElement,
				mousePointerY
			);

			targetElement = droppableElement.childNodes[targetItemIndex];
			insertNode(droppableElement, draggingItemElement, targetElement);
			return;
		}

		// target must draggable emelment
		// insert draggable element to target's after or before
		if (!targetElement.classList.contains(DRAGGABLE_CLASS_NAME)) return;
		insertNode(droppableElement, draggingItemElement, targetElement);
	};
	const onDragLeave = event => {
		const elementWhichMouseOver = document.elementFromPoint(
			event.pageX,
			event.pageY
		);
		// onDragLeave call when following conditions are met
		// 1) target element is droppable element
		if (!event.target.classList.contains(DROP_ZONE_CLASS_NAME)) return;
		// 2) now mouse over element is not this element
		if (elementWhichMouseOver === droppableRef.current) return;
		// 3) now mouse over element is not draggable element
		if (elementWhichMouseOver.classList.contains(DRAGGABLE_CLASS_NAME)) return;

		const draggingItemElement = document.querySelector(".Is-Dragging");
		draggingItemElement.classList.add("Draggable-Leave");
	};

	useEffect(() => {
		const droppableElement = droppableRef.current;
		if (!droppableElement) return;

		droppableElement.classList.add(DROP_ZONE_CLASS_NAME);

		droppableElement.ondragover = onDragOver;
		droppableElement.ondragleave = onDragLeave;
	}, [droppableRef]);

	return droppableRef;
}

export default useDroppable;
