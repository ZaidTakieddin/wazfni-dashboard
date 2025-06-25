import type {
  DataGridProps,
  GridColDef,
  GridColumnVisibilityModel,
  GridSlots,
  GridToolbarProps,
  GridValidRowModel,
  ToolbarPropsOverrides,
} from '@mui/x-data-grid';

import { Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import {
  DataGrid,
  gridClasses,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { useState } from 'react';
import { Iconify } from '../iconify';

interface CustomDataGridProps<T extends GridValidRowModel> extends Omit<DataGridProps<T>, 'rows'> {
  data: T[];
  columns: GridColDef<T>[];
}

const HIDE_COLUMNS = { id: false };

const HIDE_COLUMNS_TOGGLABLE = ['id', 'actions'];

export default function CustomDataGrid<T extends GridValidRowModel>({
  data: rows,
  columns,
  ...props
}: CustomDataGridProps<T>) {
  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  return (
    <DataGrid
      disableRowSelectionOnClick
      rows={rows}
      columns={columns}
      columnVisibilityModel={columnVisibilityModel}
      onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
      slots={{
        // toolbar: CustomToolbar as GridSlots['toolbar'],
        noRowsOverlay: () => (
          <Stack width="100%" height="100%" alignItems="center" justifyContent="center" gap={2}>
            <Iconify icon="material-symbols:database-off-rounded" width={48} height={48} />
            <Typography variant="caption">No data found</Typography>
          </Stack>
        ),
        noResultsOverlay: () => (
          <Stack width="100%" height="100%" alignItems="center" justifyContent="center" gap={2}>
            <Iconify icon="material-symbols:filter-alt-off-rounded" width={48} height={48} />
            <Typography variant="caption">No data found with the current filters</Typography>
          </Stack>
        ),
      }}
      slotProps={{
        panel: { anchorEl: filterButtonEl },
        // toolbar: { setFilterButtonEl, showQuickFilter: true },
        columnsManagement: { getTogglableColumns },
      }}
      sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' } }}
      pageSizeOptions={[10, 20, 50, 100]}
      initialState={{
        pagination: { paginationModel: { pageSize: 10 } },
      }}
      disableColumnMenu
      disableColumnSorting
      {...props}
    />
  );
}

// ----------------------------------------------------------------------

interface CustomToolbarProps extends GridToolbarProps, ToolbarPropsOverrides {
  setFilterButtonEl: (el: HTMLButtonElement | null) => void;
}

function CustomToolbar({ setFilterButtonEl }: CustomToolbarProps) {
  return (
    <GridToolbarContainer>
      <GridToolbarQuickFilter />
      <Box sx={{ flexGrow: 1 }} />
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton ref={setFilterButtonEl} />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}
