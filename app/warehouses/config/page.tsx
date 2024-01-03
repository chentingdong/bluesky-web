'use client';

import { useCallback, useMemo } from 'react'; // Corrected useState import
import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import 'ag-grid-enterprise';
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { ColDef, GridReadyEvent, TextFilterModel, NumberFilterModel } from 'ag-grid-community';
import { ICombinedSimpleModel } from 'ag-grid-community/dist/lib/filter/provided/simpleFilter';
import { createWarehouseDataSource } from '@/graphql/warehouses';

type Props = {};

interface Warehouse {
  WAREHOUSE_NAME: string;
  WAREHOUSE_SIZE: string;
  AUTO_SUSPEND: number;
  QUERY_CREDIT: string;
  COST_HISTORY: number;
  UTILIZATION: number;
}

interface Filter {
  WAREHOUSE_NAME?: TextFilterModel | ICombinedSimpleModel<TextFilterModel>;
  WAREHOUSE_SIZE?: TextFilterModel | ICombinedSimpleModel<TextFilterModel>;
  AUTO_SUSPEND?: NumberFilterModel | ICombinedSimpleModel<NumberFilterModel>;
  QUERY_CREDIT?: TextFilterModel | ICombinedSimpleModel<TextFilterModel>;
  COST_HISTORY?: NumberFilterModel | ICombinedSimpleModel<NumberFilterModel>;
  UTILIZATION?: NumberFilterModel | ICombinedSimpleModel<NumberFilterModel>;
}

const WarehouseListView = (props: Props) => {
  const colDefs: ColDef[] = [
    { field: "WAREHOUSE_NAME", filter: 'agTextColumnFilter' },
    { field: "WAREHOUSE_SIZE", filter: 'agTextColumnFilter' },
    { field: "AUTO_SUSPEND", filter: 'agNumberColumnFilter', maxWidth: 100 },
    { field: "QUERY_CREDIT", filter: 'agNumberColumnFilter' },
    { field: "COST_HISTORY", filter: 'agNumberColumnFilter' },
    { field: "UTILIZATION", filter: 'agNumberColumnFilter' },
  ];

  const onGridReady = useCallback((params: GridReadyEvent) => {
    const gridApi = params.api;
    const dataSource = createWarehouseDataSource();
    gridApi.setGridOption('serverSideDatasource', dataSource);
  }, []);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
      menuTabs: ['filterMenuTab'],
    };
  }, []);

  return (
    <div className='h-768'>
      <h1>Warehouses</h1>
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