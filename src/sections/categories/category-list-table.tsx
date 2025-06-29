'use client';

import type { Category } from 'src/types/category';

import { useState, useCallback } from 'react';

import {
  Box,
  Card,
  Table,
  Tooltip,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  Typography,
  TableContainer,
  CircularProgress,
} from '@mui/material';

import { useCategories, useDeleteCategory } from 'src/lib/hooks/use-categories';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';

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
      <Card>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Icon</TableCell>
                  <TableCell>Subcategories</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2">{category.name}</Typography>
                    </TableCell>

                    <TableCell>
                      {category.icon && <Iconify icon={category.icon} width={24} height={24} />}
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {category.subcategories?.length || 0} subcategories
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(category.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Tooltip title="Edit category">
                        <IconButton color="default" onClick={() => handleEdit(category)}>
                          <Iconify icon="solar:pen-bold" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete category">
                        <IconButton color="error" onClick={() => handleDelete(category.id)}>
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}

                {categories.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No categories found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Card>

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
