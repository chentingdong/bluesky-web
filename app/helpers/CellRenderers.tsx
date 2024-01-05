import React from 'react';
import { ICellRendererParams,  } from 'ag-grid-community';

export const ButtonRenderer = function CellRenderer(props: ICellRendererParams) {
  const cellValue = props.valueFormatted ? props.valueFormatted : props.value;

  const buttonClicked = () => {
    alert(`Finding ${cellValue} was clicked`);
  }

  return (
    <span>
      {cellValue && cellValue.length > 0 && (
        <button 
          className="focus:outline-none text-white bg-yellow-600 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-1.5 me-2 mb-2 dark:focus:ring-yellow-900"
          onClick={buttonClicked}
        >{cellValue}</button>
      )}
    </span>
  );
};


export const currencyFormatter = (params: ICellRendererParams) => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD', 
    maximumFractionDigits: 0 
  }).format(params.value || 0);
};