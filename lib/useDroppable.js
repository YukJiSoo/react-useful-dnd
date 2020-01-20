import { useState, useRef, useEffect } from "react";
import uuid from "uuid";
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
		return true;
	}
	if (targetItemIndex === baseItemIndex) return false;
	if (targetItemIndex < baseItemIndex) {
		container.insertBefore(target, base.nextSibling);
	} else {
		if (baseItemIndex === -1) return false;
		container.insertBefore(target, base);
	}

	return true;
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

function useDroppable({ id = uuid(), items }) {
	const [dataList, setDataList] = useState(
		items.map(item => ({ data: item, id: uuid() }))
	);
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
			const result = insertNode(
				droppableElement,
				draggingItemElement,
				targetElement
			);
			if (result) {
				const droppableElement = droppableRef.current;
				const newElements = Array.from(
					droppableElement.childNodes
				).map(element => JSON.parse(element.dataset.item));
				setDataList(newElements);
			}
			return;
		}

		// target must draggable emelment
		// insert draggable element to target's after or before
		if (!targetElement.classList.contains(DRAGGABLE_CLASS_NAME)) return;
		const result = insertNode(
			droppableElement,
			draggingItemElement,
			targetElement
		);
		if (result) {
			const droppableElement = droppableRef.current;
			const newElements = Array.from(droppableElement.childNodes).map(element =>
				JSON.parse(element.dataset.item)
			);
			setDataList(newElements);
		}
	};
	const onDragLeave = event => {
		event.stopPropagation();
		const elementWhichMouseOver = document.elementFromPoint(
			event.pageX,
			event.pageY
		);

		let exitFlag = true;
		const eventTargetClassList = event.target.classList;
		const mouseOverTargetClassList = elementWhichMouseOver.classList;

		// onDragLeave call when following conditions are met
		// 1) target element is droppable element & mouse over element is droppable element
		if (
			eventTargetClassList.contains(DROP_ZONE_CLASS_NAME) &&
			mouseOverTargetClassList.contains(DROP_ZONE_CLASS_NAME)
		)
			exitFlag = false;
		// 2) target element is droppable element & mouse over element is sibling of target element
		const isChild = Array.from(droppableRef.current.parentNode.childNodes).some(
			element => element === elementWhichMouseOver
		);
		if (eventTargetClassList.contains(DROP_ZONE_CLASS_NAME) && isChild)
			exitFlag = false;
		// 3) target element is droppable element & mouse over element is parent of target element
		if (
			eventTargetClassList.contains(DROP_ZONE_CLASS_NAME) &&
			elementWhichMouseOver.contains(event.target)
		)
			exitFlag = false;
		// 4) target element is draggable element and isn't parent of mouse over element
		//    mouse over element isn't draggable element
		//    mouse over element isn't droppable element
		if (
			eventTargetClassList.contains(DRAGGABLE_CLASS_NAME) &&
			!event.target.contains(elementWhichMouseOver) &&
			!mouseOverTargetClassList.contains(DRAGGABLE_CLASS_NAME) &&
			!mouseOverTargetClassList.contains(DROP_ZONE_CLASS_NAME)
		) {
			exitFlag = false;
		}

		if (exitFlag) return;

		const draggingItemElement = document.querySelector(".Is-Dragging");
		draggingItemElement.classList.add("Draggable-Leave");

		const droppableElement = droppableRef.current;
		const exceptElement = Array.from(droppableElement.childNodes).find(
			element => element === draggingItemElement
		);

		setDataList(prev => {
			const item = JSON.parse(exceptElement.dataset.item);
			return prev.filter(({ id }) => id !== item.id);
		});

		return;
	};
	const onDragEnd = () => {
		const willRemoveElements = Array.from(
			document.querySelectorAll(".Draggable-Leave")
		);
		willRemoveElements.forEach(element => element.remove());
	};

	useEffect(() => {
		const droppableElement = droppableRef.current;
		if (!droppableElement) return;

		droppableElement.classList.add(DROP_ZONE_CLASS_NAME);

		droppableElement.ondragover = onDragOver;
		droppableElement.ondragleave = onDragLeave;
		droppableElement.ondragend = onDragEnd;

		Array.from(droppableElement.childNodes).forEach((element, index) => {
			element.dataset.item = JSON.stringify(dataList[index]);
			element.dataset.parentId = id;
		});
	}, [droppableRef]);

	return [id, droppableRef, dataList.map(({ data }) => data)];
}

export default useDroppable;
