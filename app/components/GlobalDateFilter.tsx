'use client';

import React, { useState } from 'react';
import { addMonths } from 'date-fns';

type Props = {};

const GlobalDateFilter = (props: Props) => {
  const [state, setState] = useState(
    {
      startDate: addMonths(new Date(), -1),
      endDate: new Date(),
    }
  );

  return (
    <div className="w-1/2">
      <div className="w-full grid gap-4 my-2 grid-cols-2">
        <input
          type="date"
          name="startDate"
          className="bg-transparent border rounded-lg p-2"
          value={state.startDate.toISOString().slice(0, 10)}
          onChange={(e) => {
            console.log(e.target.value)
            setState({
              ...state,
              startDate: new Date(e.target.value)
            })
          }}
        />
        <input
          type="date"
          name="endDate"
          className="bg-transparent border rounded-lg p-2"
          value={state.endDate.toISOString().slice(0, 10)}
          onChange={(e) => {
            setState({
              ...state,
              endDate: new Date(e.target.value)
            })
          }}
        />
      </div>
    </div>
  );
};

export default GlobalDateFilter;
