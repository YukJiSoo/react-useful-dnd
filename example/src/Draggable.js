import React from "react";
import { useDraggable } from "../../lib";

function Draggable({ data, groupId, droppableId }) {
	const [draggableRef, id] = useDraggable({ droppableId, groupId });

	return (
		<div ref={draggableRef} id={id}>
			<h3>Draggable #{data}</h3>
		</div>
	);
}

export default React.memo(Draggable);
