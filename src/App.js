import React, { useState, useEffect } from "react";

import "./App.css";

const useDragAndDrop = (
  items = [],
  slots = [],
  containers = []
) => {
  const [Dragables, setDragables] = useState(items ? items : []);
  const [DropSlots, setDropSlots] = useState(slots ? slots : []);
  const [Containers, setContainers] = useState(containers ? containers : []);

  const onDragOver = (event) => {
    event.preventDefault();
  };

  const onDragStart = (event, id , slot , containerId ) => {
    console.log("container", containerId);
    event.dataTransfer.setData("dragableId", id);
    event.dataTransfer.setData("currentDropSlotId", slot);
    if (containerId)
      event.dataTransfer.setData("currentContainerId", containerId);
  };

  const onDrop = (
    event,
    newCategory,
    newDropSlot ,
    newContainer
  ) => {
    const currentDropSlotId = event.dataTransfer.getData("currentDropSlotId");
    const dragableId = event.dataTransfer.getData("dragableId");
    const currentContainerId = event.dataTransfer.getData("currentContainerId"); // check which table id we are referencing

    console.log("droppedId", dragableId);
    console.log("droppedSlot", currentDropSlotId);
    console.log("container", currentContainerId);

    console.log("newCat", newCategory);
    console.log("newDropSlot", newDropSlot);
    console.log("newCont", newContainer);

    const newDragables = Dragables.filter(d => {
      console.log("idIs", d.Id);
      if (d.Id === Number(dragableId)) {
        console.log("made it");
        d.DropSlotId = Number(newDropSlot);
        d.Category = newCategory;
        d.CId = newContainer;
      }
      return d;
    });

    if (
      Number(currentDropSlotId) !== newDropSlot &&
      newCategory !== "coCategory" &&
      currentDropSlotId !== 0
    ) {
      const dragablesPush = newDragables.filter(d => {
        if (
          d.DropSlotId === Number(newDropSlot) &&
          d.Id !== Number(dragableId)
        ) {
          console.log("DONT");
          if (d.DropSlotId + 1 <= DropSlots.length)
            d.DropSlotId = d.DropSlotId + 1;
          else {
            d.DropSlotId = Number(currentDropSlotId);
          }
        }
        return d;
      });
      console.log("Never here");
      setDragables(dragablesPush);
    } else {
      console.log("here");
      console.log(newDragables);
      setDragables(newDragables);
    }
  };

  return {
    onDragOver,
    onDragStart,
    onDrop,
    Dragables,
    DropSlots,
    Containers
  };
};

const tables = [
  {
    ContainerId: 22,
    type: "Feel"
  },
  {
    ContainerId: 23,
    type: "Feel"
  },
  {
    ContainerId: 24,
    type: "Cool"
  },
  {
    ContainerId: 25,
    type: "Cool"
  }
];
const items = [
  {
    Id: 1,
    taskName: "Read book",
    type: "inProgress",
    backgroundColor: "red",
    DropSlotId: 1,
    CId: 22
  },
  {
    Id: 2,
    taskName: "Pay bills",
    type: "inProgress",
    backgroundColor: "green",
    DropSlotId: 2,
    CId: 23
  },
  {
    Id: 3,
    taskName: "Go to the gym",
    type: "Done",
    backgroundColor: "blue",
    DropSlotId: 0,
    CId: 24
  }
];
const InProgressArea = [
  {
    DropArea: 1
  },
  {
    DropArea: 2
  },
  {
    DropArea: 3
  }
];

const ItemsToRender = props => {
  const { onDragStart, Dragables } = useDragAndDrop(props.data, props.slots);

  const onDragEnd = (event, newPos, data) => {
    //post
  };

  return (
    <>
      {props.items.map(p =>
        p.DropSlotId === props.parentArea ? (
          <div
            key={p.id}
            onDragStart={event =>
              onDragStart(event, p.Id, p.DropSlotId, props.container)
            }
            onDragEnd={event => {
              onDragEnd(event, p.refArea, p.id);
            }}
            draggable
            className="draggable"
            style={{ backgroundColor: p.bgcolor }}
          >
            {p.taskName}
          </div>
        ) : (
          <></>
        )
      )}
    </>
  );
};

const Area = props => {
  const { onDragOver, onDrop, DropSlots, Dragables } = useDragAndDrop(
    props.ii,
    props.slots
  );
  const progress = [];
  Dragables.filter(t => {
    if (t.CId !== 24) {
      progress.push(t);
    }
    return progress;
  });

  return (
    <>
      {DropSlots.map(p => (
        <div
          className="dropaAbleHere"
          onDragOver={event => onDragOver(event, props.items, props.DropArea)}
          onDrop={event => {
            onDrop(event, "inProgress", p.DropArea, props.ContainerID);
          }}
        >
          <ItemsToRender
            data={Dragables}
            parentArea={p.DropArea}
            items={progress}
            container={props.ContainerID}
            slots={props.slots}
          />
        </div>
      ))}
    </>
  );
};

const MyFuncApp = props => {
  const {
    Dragables,
    onDrop,
    onDragOver,
    onDragStart,
    DropSlots
  } = useDragAndDrop(items, InProgressArea, tables);
  const initial = Dragables.filter(i => {
    return i.DropSlotId === 0;
  });
  const [unassigned, setUnassigned] = useState(initial);
  const onDragEnd = (event, newPos, data) => {
    setUnassigned(curr => curr.filter(item => item.CId !== data));
    //post
  };
  useEffect(() => {
    setUnassigned(
      Dragables.filter(i => {
        return i.DropSlotId === 0;
      })
    );
  }, [Dragables]);
  return (
    <>
      <div className="drag-container">
        <h2 className="head">Drag and drop</h2>
        <div className="inProgress">
          {/* container should be here */}
          <Area ContainerID={22} ii={Dragables} slots={DropSlots} />
        </div>
      </div>

      <div>
        OutsideOF
        <div
          className="droppable"
          onDragOver={event => onDragOver(event)}
          onDrop={event => onDrop(event, "coCategory", 0, 24)}
        >
          <span className="group-header"> Bag</span>
          {unassigned.map(p => (
            <div
              key={p.id}
              onDragStart={event => onDragStart(event, p.Id, 0, 24)}
              onDragEnd={event => {
                onDragEnd(event, p.refArea, p.CId);
              }}
              draggable
              className="draggable"
              style={{ backgroundColor: p.bgcolor }}
            >
              {p.taskName}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MyFuncApp;