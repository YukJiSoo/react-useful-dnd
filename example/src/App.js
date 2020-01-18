import React, { useState } from "react";
import "App.css";

import Draggable from "Draggable";
import DropZone from "DropZone";

function App() {
	const [itemList] = useState([1, 2, 3, 4, 5]);
	const [secodeItemList] = useState([6, 7, 8, 9, 10]);

	return (
		<>
			<DropZone>
				{itemList.map(item => (
					<Draggable key={item} />
				))}
			</DropZone>
			<DropZone>
				{secodeItemList.map(item => (
					<Draggable key={item} />
				))}
			</DropZone>
		</>
	);
}

export default App;
