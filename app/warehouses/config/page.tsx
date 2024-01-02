'use client'

import React, { use, useEffect, useState } from 'react'; // Corrected useState import
import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { ColDef, GridOptions } from 'ag-grid-community';
import { fetchWarehouses } from '@/graphql/warehouses';

type Props = {}

const WarehouseListView = (props: Props) => {
  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState([]);
  
  // Column Definitions: Defines & controls grid columns.
  const [colDefs, setColDefs] = useState<ColDef[]>([
    { field: "WAREHOUSE_NAME", filter: 'agSetColumnFilter'},
    { field: "WAREHOUSE_SIZE" },
    { field: "AUTO_SUSPEND" },
    { field: "QUERY_CREDIT" },
    { field: "COST_HISTORY" },
    { field: "UTILIZATION" },
  ]);

  useEffect(() => {
    fetchWarehouses().then(data => {
      setRowData(data);
    });
  });

  return (
    <div className='h-dvh'>
      <h1>Warehouses</h1>
      <AgGridReact rowData={rowData} columnDefs={colDefs} className="ag-theme-quartz-auto-dark"/>
    </div>
  );
}

export default WarehouseListView;