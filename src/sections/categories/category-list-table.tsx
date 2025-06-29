'use client';

import type { GridColDef } from '@mui/x-data-grid';
import type { Category } from 'src/types/category';

import { useState, useCallback } from 'react';

import { Box, Chip, Tooltip, IconButton, Typography, CircularProgress } from '@mui/material';

import { useCategories, useDeleteCategory } from 'src/lib/hooks/use-categories';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomDataGrid from 'src/components/data-grid/custom-datagrid';

import { CategoryEditDialog } from './category-edit-dialog';

// ----------------------------------------------------------------------

export function CategoryListTable() {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

  const { data: categories = [], isLoading, error } = useCategories();
  const deleteCategory = useDeleteCategory();

  const handleEdit = useCallback((category: Category) => {
    setEditingCategory(category);
  }, []);

  const handleDelete = useCallback((categoryId: string) => {
    setDeletingCategoryId(categoryId);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingCategoryId) return;

    try {
      await deleteCategory.mutateAsync(deletingCategoryId);
      setDeletingCategoryId(null);
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  }, [deletingCategoryId, deleteCategory]);

  const columns: GridColDef<Category>[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'icon',
      headerName: 'Icon',
      width: 80,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) =>
        params.value ? (
          <Iconify icon={params.value} width={24} height={24} />
        ) : (
          <Typography variant="body2" color="text.disabled">
            -
          </Typography>
        ),
    },
    {
      field: 'subcategories',
      headerName: 'Subcategories',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip
          size="small"
          label={`${params.row.subcategories?.length || 0} items`}
          color="primary"
          variant="soft"
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {new Date(params.value).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Edit category">
            <IconButton size="small" color="default" onClick={() => handleEdit(params.row)}>
              <Iconify icon="solar:pen-bold" width={18} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete category">
            <IconButton size="small" color="error" onClick={() => handleDelete(params.row.id)}>
              <Iconify icon="solar:trash-bin-trash-bold" width={18} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography color="error">Failed to load categories</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ height: 600, width: '100%' }}>
        <CustomDataGrid data={categories} columns={columns} loading={isLoading} />
      </Box>

      {/* Edit Dialog */}
      {editingCategory && (
        <CategoryEditDialog
          category={editingCategory}
          open={!!editingCategory}
          onClose={() => setEditingCategory(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deletingCategoryId}
        onClose={() => setDeletingCategoryId(null)}
        title="Delete Category"
        content="Are you sure you want to delete this category? This action cannot be undone."
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={() => setDeletingCategoryId(null)}>Cancel</IconButton>
            <IconButton
              color="error"
              onClick={handleConfirmDelete}
              disabled={deleteCategory.isPending}
            >
              {deleteCategory.isPending ? <CircularProgress size={20} /> : 'Delete'}
            </IconButton>
          </Box>
        }
      />
    </>
  );
}
