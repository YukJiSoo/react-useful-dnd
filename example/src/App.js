import React from "react";
import "App.css";

import Draggable from "Draggable";

function App() {
	return (
		<div>
			{[...Array(4)].map((_, index) => (
				<Draggable key={index} id={index} className="Draggable" />
			))}
		</div>
	);
}

export default App;
