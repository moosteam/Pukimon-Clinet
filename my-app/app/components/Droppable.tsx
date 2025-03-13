import React from 'react';
import {useDroppable} from '@dnd-kit/core';

export function Droppable(props: {
  children: React.ReactNode;
  id?: string;
}) {
  const {isOver, setNodeRef} = useDroppable({
    id: props.id || 'droppable',
  });
  
  const style = {
    color: isOver ? 'green' : undefined,
    backgroundColor: isOver ? 'rgba(0, 255, 0, 0.1)' : undefined,
    transition: 'all 0.3s ease',
  };
  
  return (
    <div ref={setNodeRef} style={style} className="rounded-lg p-2">
      {props.children}
    </div>
  );
}