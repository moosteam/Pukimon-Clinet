"use client"

import React, { useState } from 'react';
import { DndContext } from '@dnd-kit/core';

import { Droppable } from '../components/Droppable';
import { Draggable } from '../components/Draggable';

function App() {
  return (
    <DndContext>
      <div className="flex flex-col gap-4 p-4">
        <div
          className='absolute w-full h-full'
          style={{ touchAction: "none", pointerEvents: "none" }}
        ></div>
        <h1 className="text-xl font-bold">Drag and Drop Example</h1>

        <div className="flex gap-4 mb-4">
          {/* 드롭되지 않은 항목만 표시 */}
          <Draggable id="item1"><img
            src="Charizard.jpg"
            alt=""
            className="w-18 transition-all duration-500 cursor-grab"
          /></Draggable>
          <Draggable id="item2">Item 2</Draggable>
          <Draggable id="item3">Item 3</Draggable>
        </div>

        <Droppable>
          <div className="min-h-20 p-4">
            {/* 드롭된 항목 표시 */}
            <Draggable id="item4">Item 1</Draggable>
            <Draggable id="item5">Item 2</Draggable>
            <Draggable id="item6">Item 3</Draggable>
          </div>
        </Droppable>
      </div>
    </DndContext>
  );
}

export default App;