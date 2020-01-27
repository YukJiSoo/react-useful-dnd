# React Useful DnD 🎇 → 🌁

react에서 drag & drop 기능을 편하게 사용하기 위해 구현한 라이브러리 입니다.

custom hooks로 구현하였으며 drag & drop을 적용하고 싶은 component에서 해당 라이브러리를 호출하여 사용할 수 있습니다.

<br>

## 💻 install

```bash
yarn add react-useful-dnd

npm install react-useful-dnd
```

<br>

## ✍️ usage

component를 drag할 수 있도록 하기 위해서는 `useDraggable` 을 사용하고, drag요소를 drop하기 위해서는 `useDroppable` 을 사용합니다.

drag요소간의 state관리를 위해 `useDnDContext`를 사용합니다.

<br>

#### 🕋 `useDnDContext`

`useDnDContext` hooks는 drag 가능한 요소들의 상태관리를 제어하기 위해 존재하는 요소입니다. 초기 상태값을 인자로 받습니다.

초기 상태값은 다음과 같은 형식을 갖는 data이어야 합니다.

```javascript
const initialState = {
	first: { data: [...] },
	second: { data: [...] }
};
```

객체이며 key값은 해당 droppable의 id가 될 값, value값은 상태관리가 이루어질 값이 되는 값입니다.

`useDnDContext`를 호출하면 `DnDStore`, `DnDContext`, `droppableIds`를 반환합니다. 각각, Store jsx, context, droppable을 대표하는 id 배열을 의미합니다.

다음과 같은 형식으로 사용할 수 있습니다.

```javascript
import React from "react";
import DropZone from "DropZone";
import { useDnDContext } from "react-useful-dnd";

const firstItem = [1, 2, 3, 4, 5];
const secondItem = [6, 7, 8, 9, 10];

const initialState = {
	first: { data: firstItem },
	second: { data: secondItem }
};

function App() {
	const [DnDStore, DnDContext, droppableIds] = useDnDContext(initialState);

	return (
		<DnDStore>
			{droppableIds.map(id => (
				<DropZone key={id} id={id} context={DnDContext} />
			))}
		</DnDStore>
	);
}

export default App;
```

`DnDStore` 내부에서 사용되는 Droppable한 요소는 id와 contexts를 props로 넘겨주어야 합니다.

#### 🎇 `useDraggable`

`useDraggable` hooks는 배열 형태의 값을 반환하며, option 객체를 인자로 넘겨주어여 합니다.

option 객체는 droppableId, groupId를 프로퍼티로 가지고 있습니다.
droppableId는 해당 dropzone의 id가 될 값이며 넘겨주지 않으면 자동으로 생성됩니다.
groupId는 해당 draggable 요소가 속한 context의 id입니다.

배열의 첫번째 요소는 해당 component를 가리키게 될 ref이며, 두번째 요소는 해당 component의 id 입니다.

해당 component의 상위 태그에 ref와 id props를 부여해줌으로써 사용가능합니다.

```javascript
import React from "react";
import { useDraggable } from "react-useful-dnd";

function Draggable({ data, groupId, droppableId }) {
	const [draggableRef, id] = useDraggable({ droppableId, groupId });

	return (
		<div ref={draggableRef} id={id}>
			<h3>Draggable #{data}</h3>
		</div>
	);
}

export default Draggable;
```

#### 🌁 `useDroppable`

`useDroppable` hooks 또한 배열 형태의 값을 반환하며 option 객체를 인자로 넘겨주어여 합니다.

option 객체는 id, context를 프로퍼티로 가지고 있습니다.
id는 해당 dropzone의 id가 될 값이며 넘겨주지 않으면 자동으로 생성됩니다.
context는 해당 droppable 요소가 속한 store의 context입니다.

`useDroppable` hooks를 호출하여 반환되는 배열의 첫번째 요소는 해당 component를 가리키게 될 ref이며, 두번째 요소는 해당 component의 id 입니다.

세번째 요소인 datas는 해당 droppable 요소의 state이며 drag & drop 이벤트의 결과에 따라 변경됩니다.
네번째 요소인 groupId는 해당 droppable 요소가 속한 context의 id입니다.

해당 component의 상위 태그에 ref와 id props를 부여해줌으로써 사용가능합니다.
draggable 요소에 groupId와 droppableId를 props로 넘겨주어 draggable 요소에서 사용할 수 있도록 해주어야 합니다.

<br>

```javascript
import React from "react";
import { useDraggable } from "react-useful-dnd";
import Draggable from "Draggable";

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
```
