# React Useful DnD 🎇 → 🌁

react에서 drag & drop 기능을 편하게 사용하기 위해 구현한 라이브러리 입니다.

custom hooks로 구현하였으며 drag & drop을 적용하고 싶은 component에서 해당 라이브러리를 호출하여 사용할 수 있습니다.

<br>

## ✍️ usage

component를 drag할 수 있도록 하기 위해서는 `useDraggable` 을 사용하고, drag요소를 drop하기 위해서는 `useDroppable` 을 사용합니다.

<br>

#### 🎇 `useDraggable`

`useDraggable` hooks는 배열 형태의 값을 반환합니다.

배열의 첫번째 요소는 해당 component의 id 이며, 두번째 요소는 해당 component를 가리키게 될 ref입니다.

해당 component의 상위 태그에 ref와 id props를 부여해줌으로써 사용가능합니다.

```javascript
import React from "react";
import { useDraggable } from "react-useful-dnd";

function Draggable() {
	const [id, draggableRef] = useDraggable();

	return <div ref={draggableRef} id={id}></div>;
}

export default Draggable;
```

#### 🌁 `useDroppable`

`useDroppable` hooks 또한 배열 형태의 값을 반환하며 option 객체를 인자로 넘겨주어여 합니다.

option 객체는 id, items를 프로퍼티로 가지고 있습니다.
id는 해당 dropzone의 id가 될 값이며 넘겨주지 않으면 자동으로 생성됩니다.
items는 dropzone에서 관리 될 아이템의 목록이며 내부적으로 state로서 관리합니다. 이는, 여러개의 dropzone에서 draggable한 요소를 이동 시킬 경우 상태관리를 위해서 입니다.

`useDroppable` hooks를 호출하여 반환되는 배열의 첫번째 요소는 해당 component의 id 이며, 두번째 요소는 해당 component를 가리키게 될 ref입니다.

세번째 dataList는 dropzone에서 관리할 state이며 해당 data를 가지고 데이터 로직을 관리할 것을 권장합니다. dataList를 사용하여 view를 구성한 경우 제대로 동작하지 않을 가능성이 존재합니다.

해당 component의 상위 태그에 ref와 id props를 부여해줌으로써 사용가능합니다.

<br>

> 앞에서도 언급했듯이 useDroppable의 호출로 인해 반환된 dataList는 jsx내부에서 사용하지 않을 것을 권장합니다. 제대로 동작하지 않을 가능성이 존재합니다.

<br>

```javascript
import React from "react";
import { useDraggable } from "react-useful-dnd";
import Draggable from "Draggable";

function DropZone({ id, datas }) {
	const [dropZoneId, droppableRef, dataList] = useDroppable({
		id,
		items: datas
	});

	return (
		<div id={dropZoneId} ref={droppableRef}>
			{datas.map(data => (
				<Draggable key={data} data={data} />
			))}
		</div>
	);
}

export default DropZone;
```
