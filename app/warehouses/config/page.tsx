'use client';

import { useCallback, useMemo } from 'react'; // Corrected useState import
import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import 'ag-grid-enterprise';
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { createWarehouseDataSource } from '@/graphql/warehouses';
import GlobalDateFilter from '@/app/components/globalDateFilter';

type Props = {};
interface Warehouse {
  WAREHOUSE_NAME: string;
  WAREHOUSE_SIZE: string;
  CLUSTERS: string;
  AUTO_SUSPEND: number;
  QUERY_CREDIT: string;
  UTILIZATION: number;
  ANNUAL_WASTE_USD: number;
}

const WarehouseListView = (props: Props) => {
  const dateRange = {startDate: '2023-11-01', endDate: '2024-01-01'}

  const colDefs: ColDef[] = [
    { field: "WAREHOUSE_NAME", filter: 'agTextColumnFilter' },
    { field: "WAREHOUSE_SIZE", filter: 'agTextColumnFilter' },
    { field: "CLUSTERS", filter: 'agTextColumnFilter' },
    { field: "AUTO_SUSPEND", filter: 'agNumberColumnFilter', maxWidth: 100 },
    { field: "QUERY_CREDIT", filter: 'agNumberColumnFilter' },
    { field: "UTILIZATION", filter: 'agNumberColumnFilter' },
    { field: "ANNUAL_WASTE_USD", filter: 'agNumberColumnFilter'},
  ];

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
      menuTabs: ['filterMenuTab'],
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    const gridApi = params.api;
    const dataSource = createWarehouseDataSource(dateRange);
    gridApi.setGridOption('serverSideDatasource', dataSource);
  }, []);

  return (
    <div className='h-768'>
      <h1>Warehouses</h1>
      <GlobalDateFilter dateRange={dateRange}/>
      <AgGridReact<Warehouse>
        className='ag-theme-quartz-auto-dark'
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
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