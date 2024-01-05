'use client';

import React, { useState } from 'react';
import { addMonths } from 'date-fns';

export interface DateRange {
  startDate: string;
  endDate: string;
}

type Props = {
  dateRange: DateRange
};

const GlobalDateFilter = (props: Props) => {
  return (
    <div className="w-1/2">
      <div className="w-full grid gap-4 my-2 grid-cols-2">
        <input
          type="date"
          name="startDate"
          className="bg-transparent border rounded-lg p-2"
          value={props.dateRange.startDate}
          readOnly
        />
        <input
          type="date"
          name="endDate"
          className="bg-transparent border rounded-lg p-2"
          value={props.dateRange.endDate}
          readOnly
        />
      </div>
    </div>
  );
};

export default GlobalDateFilter;
