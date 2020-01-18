export function getChildNodeIndex(parent, child) {
	return Array.from(parent.childNodes).findIndex(element => {
		return element === child;
	});
}
