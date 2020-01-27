import React from "react";
import { createContext, useReducer, useMemo } from "react";
import uuid from "uuid";
import DnDReducer from "./DnDReducer";

function useDnDContext(datas) {
	const DnDContext = useMemo(() => createContext(), []);
	const DnDStore = ({ children }) => {
		const [dndState, dispatchDnD] = useReducer(DnDReducer, datas);
		const groupId = useMemo(() => uuid(), []);

		return (
			<DnDContext.Provider value={{ dndState, dispatchDnD, groupId }}>
				{children}
			</DnDContext.Provider>
		);
	};
	const droppableIds = Object.keys(datas);

	return [DnDStore, DnDContext, droppableIds];
}

export default useDnDContext;
