import React from "react";
import "App.css";

import DropZone from "DropZone";
import { useDnDContext } from "../../lib";

const firstItem = [1, 2, 3, 4, 5];
const secondItem = [6, 7, 8, 9, 10];

const firstItemT = [11, 12, 13, 14, 15];
const secondItemT = [16, 17, 18, 19, 20];

const dndData = {
	first: { data: firstItem },
	second: { data: secondItem }
};

const dndDataT = {
	first: { data: firstItemT },
	second: { data: secondItemT }
};
function App() {
	const [DnDStore, DnDContext, droppableIds] = useDnDContext(dndData);
	const [DnDStoreT, DnDContextT, droppableIdsT] = useDnDContext(dndDataT);

	return (
		<>
			<h1 className="Title">Drag & Drop Example page</h1>
			<div className="Dnd-Wrapper">
				<DnDStore>
					{droppableIds.map(id => (
						<DropZone key={id} id={id} context={DnDContext} />
					))}
				</DnDStore>
			</div>
			<div className="Dnd-Wrapper">
				<DnDStoreT>
					{droppableIdsT.map(id => (
						<DropZone key={id} id={id} context={DnDContextT} />
					))}
				</DnDStoreT>
			</div>
		</>
	);
}

export default App;
