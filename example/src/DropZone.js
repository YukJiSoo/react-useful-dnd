import React from "react";
import { useDroppable } from "../../lib";

function DropZone({ children }) {
	const droppableRef = useDroppable();

	return <div ref={droppableRef}>{children}</div>;
}

export default DropZone;
