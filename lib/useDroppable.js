import { useRef, useEffect } from "react";
import { getChildNodeIndex } from "./utils";

const DRAGGABLE_CLASS_NAME = "Draggable";
const DROP_ZONE_CLASS_NAME = "DropZone";

function useDroppable() {
	const droppableRef = useRef(null);

	const onDragOver = event => {
		event.preventDefault();

		// check target element is draggable
		const targetElement = event.target;
		if (!targetElement.classList.contains(DRAGGABLE_CLASS_NAME)) return;

		// if target element is dropzone, return
		// must over draggable element
		const droppableElement = droppableRef.current;
		if (targetElement === droppableElement) return;

		// if target element is dragging, return
		const draggingItemElement = document.querySelector(".Is-Dragging");
		if (targetElement === draggingItemElement) return;

		// dropzone is empty, append child
		if (!droppableElement.childNodes.length) {
			droppableElement.appendChild(draggingItemElement);
			return;
		}

		// check draggable element insert to target's after or before
		const draggingItemIndex = getChildNodeIndex(
			droppableElement,
			draggingItemElement
		);
		const targetItemIndex = getChildNodeIndex(droppableElement, targetElement);

		if (draggingItemIndex < targetItemIndex) {
			droppableElement.insertBefore(
				draggingItemElement,
				targetElement.nextSibling
			);
		} else {
			droppableRef.current.insertBefore(draggingItemElement, targetElement);
		}
	};

	useEffect(() => {
		const droppableElement = droppableRef.current;
		if (!droppableElement) return;

		droppableElement.classList.add(DROP_ZONE_CLASS_NAME);

		droppableElement.ondragover = onDragOver;
	}, [droppableRef]);

	return droppableRef;
}

export default useDroppable;
