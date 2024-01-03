'use client';

import { useCallback, useState } from 'react'; // Corrected useState import
import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import 'ag-grid-enterprise';
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { createWarehouseDataSource } from '@/graphql/warehouses';

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

  const onGridReady = useCallback((params: GridReadyEvent) => {
    const gridApi = params.api;
    const dataSource = createWarehouseDataSource();
    gridApi.setGridOption('serverSideDatasource', dataSource);
  }, []);

  return (
    <div className='h-768'>
      <h1>Warehouses</h1>
      <AgGridReact<Warehouse>
        className='ag-theme-quartz'
        columnDefs={colDefs}
        pagination={true}
        paginationPageSize={10}
        cacheBlockSize={10}
        rowModelType={'serverSide'}
        onGridReady={onGridReady}
      />
    </div>
  );
};

export default WarehouseListView;