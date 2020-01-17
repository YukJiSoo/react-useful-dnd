import { useRef, useEffect, useCallback } from "react";

function useDraggable({ id, datas }) {
	const draggableRef = useRef(null);

	const ondragstart = useCallback(
		event => {
			event.dataTransfer.setData("text/plain", id);
			datas &&
				datas.forEach(({ key, value }) => {
					event.dataTransfer.setData(key, value);
				});
		},
		[id, datas]
	);

	useEffect(() => {
		const targetElement = draggableRef.current;
		if (!targetElement) return;

		targetElement.draggable = true;
		targetElement.ondragstart = ondragstart;
	}, [draggableRef]);

	return draggableRef;
}

export default useDraggable;
