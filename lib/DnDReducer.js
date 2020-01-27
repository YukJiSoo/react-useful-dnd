import DnDActions from "./DnDActions";

const updateOneDroppable = (
	state,
	{ targetId, prevIndexOfDraggingElement, nextIndexOfDraggingElement }
) => {
	const { data } = state[targetId];
	const newState = data.filter(
		(_, index) => index !== prevIndexOfDraggingElement
	);

	newState.splice(
		nextIndexOfDraggingElement,
		0,
		data[prevIndexOfDraggingElement]
	);

	return { ...state, [targetId]: { data: [...newState] } };
};
const updateTwoDroppable = (
	state,
	{ targetId, sourceId, prevIndexOfDraggingElement, nextIndexOfDraggingElement }
) => {
	const newItem = state[sourceId].data[prevIndexOfDraggingElement];
	const addedState = state[targetId].data;
	addedState.splice(nextIndexOfDraggingElement + 1, 0, newItem);

	const removedState = state[sourceId].data;
	removedState.splice(prevIndexOfDraggingElement, 1);

	return {
		...state,
		[sourceId]: { data: [...removedState] },
		[targetId]: { data: [...addedState] }
	};
};

const revertToOrigin = state => ({ ...state });

const DnDReducer = (state, { type, payload }) => {
	const { Types } = DnDActions;

	const reducers = {
		[Types.updateOneDroppable]: updateOneDroppable,
		[Types.updateTwoDroppable]: updateTwoDroppable,
		[Types.revertToOrigin]: revertToOrigin
	};

	const reducer = reducers[type];
	return reducer ? reducer(state, payload) : state;
};

export default DnDReducer;
