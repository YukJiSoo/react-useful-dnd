const Types = {
	updateOneDroppable: "updateOneDroppable",
	updateTwoDroppable: "updateTwoDroppable",
	revertToOrigin: "revertToOrigin"
};

const Creators = {
	updateOneDroppable({
		targetId,
		prevIndexOfDraggingElement,
		nextIndexOfDraggingElement
	}) {
		return {
			type: Types.updateOneDroppable,
			payload: {
				targetId,
				prevIndexOfDraggingElement,
				nextIndexOfDraggingElement
			}
		};
	},
	updateTwoDroppable({
		targetId,
		sourceId,
		prevIndexOfDraggingElement,
		nextIndexOfDraggingElement
	}) {
		return {
			type: Types.updateTwoDroppable,
			payload: {
				targetId,
				sourceId,
				prevIndexOfDraggingElement,
				nextIndexOfDraggingElement
			}
		};
	},
	revertToOrigin() {
		return {
			type: Types.revertToOrigin
		};
	}
};

const DnDActions = { Types, Creators };
export default DnDActions;
