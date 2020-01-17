import React from "react";
import { useDraggable } from "../../lib";

function Draggable({ id, className }) {
	const draggableRef = useDraggable({ id });
	return (
		<div className={className} ref={draggableRef}>
			Draggable #{id}
		</div>
	);
}

export default Draggable;
