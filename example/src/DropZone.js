import React from "react";
import Draggable from "Draggable";

import { useDroppable } from "../../lib";

function DropZone({ id, context }) {
	const [droppableRef, droppableId, datas, groupId] = useDroppable({
		id,
		context
	});

	return (
		<div id={droppableId} ref={droppableRef}>
			{datas.map(item => (
				<Draggable
					key={groupId + "-" + droppableId + "-" + item}
					data={item}
					groupId={groupId}
					droppableId={droppableId}
				/>
			))}
		</div>
	);
}

export default DropZone;
