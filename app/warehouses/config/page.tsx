'use client';

import React, { use, useEffect, useState } from 'react'; // Corrected useState import
import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { ColDef, GridOptions, IServerSideDatasource, createGrid } from 'ag-grid-community';
import { fetchWarehouses } from '@/graphql/warehouses';

type Props = {};

interface Warehouse {
  WAREHOUSE_NAME: string;
  WAREHOUSE_SIZE: string;
  AUTO_SUSPEND: string;
  QUERY_CREDIT: string;
  COST_HISTORY: string;
  UTILIZATION: string;
}

const WarehouseListView = (props: Props) => {
  const [rowData, setRowData] = useState([]);

  const colDefs: ColDef[] = [
    { field: "WAREHOUSE_NAME", filter: 'agSetColumnFilter' },
    { field: "WAREHOUSE_SIZE", filter: 'agSetColumnFilter' },
    { field: "AUTO_SUSPEND", filter: 'agSetColumnFilter', maxWidth: 100 },
    { field: "QUERY_CREDIT", filter: 'agSetColumnFilter' },
    { field: "COST_HISTORY", filter: 'agNumberColumnFilter' },
    { field: "UTILIZATION", filter: 'agNumberColumnFilter' },
  ];

  useEffect(() => {
    fetchWarehouses(10, 10).then(data => {
      setRowData(data);
    });
  }, []);



  return (
    <div className='h-768'>
      <h1>Warehouses</h1>
      <AgGridReact
        className='ag-theme-quartz'
        rowData={rowData}
        columnDefs={colDefs}
        pagination={true}
        paginationPageSize={10}
        cacheBlockSize={10}
        rowModelType='serverSide'
      />
    </div>
  );
};

export default WarehouseListView;