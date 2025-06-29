'use client';

import type { Subcategory } from 'src/types/category';

import { useState, useCallback } from 'react';

import {
  Box,
  Card,
  Table,
  Select,
  Tooltip,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  Typography,
  InputLabel,
  FormControl,
  TableContainer,
  CircularProgress,
} from '@mui/material';

import {
  useCategories,
  useDeleteSubcategory,
  useSubcategoriesByCategory,
} from 'src/lib/hooks/use-categories';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { SubcategoryEditDialog } from './subcategory-edit-dialog';

// ----------------------------------------------------------------------

export function SubcategoryListTable() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [deletingSubcategoryId, setDeletingSubcategoryId] = useState<string | null>(null);

  const { data: categories = [] } = useCategories();
  const {
    data: subcategories = [],
    isLoading,
    error,
  } = useSubcategoriesByCategory(selectedCategoryId);

  const deleteSubcategory = useDeleteSubcategory();

  const handleEdit = useCallback((subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
  }, []);

  const handleDelete = useCallback((subcategoryId: string) => {
    setDeletingSubcategoryId(subcategoryId);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingSubcategoryId) return;

    try {
      await deleteSubcategory.mutateAsync(deletingSubcategoryId);
      setDeletingSubcategoryId(null);
    } catch (err) {
      console.error('Failed to delete subcategory:', err);
    }
  }, [deletingSubcategoryId, deleteSubcategory]);

  const renderCategorySelector = (
    <Box sx={{ mb: 3 }}>
      <FormControl fullWidth>
        <InputLabel>Select Category</InputLabel>
        <Select
          value={selectedCategoryId}
          label="Select Category"
          onChange={(e) => setSelectedCategoryId(e.target.value)}
        >
          <MenuItem value="">
            <em>Select a category</em>
          </MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );

  const renderContent = () => {
    if (!selectedCategoryId) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <Typography color="text.secondary">
            Please select a category to view its subcategories
          </Typography>
        </Box>
      );
    }

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
          <Typography color="error">Failed to load subcategories</Typography>
        </Box>
      );
    }

    return (
      <Scrollbar>
        <TableContainer sx={{ minWidth: 600 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {subcategories.map((subcategory) => (
                <TableRow key={subcategory.id} hover>
                  <TableCell>
                    <Typography variant="subtitle2">{subcategory.name}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {subcategory.category?.name || 'N/A'}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(subcategory.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <Tooltip title="Edit subcategory">
                      <IconButton color="default" onClick={() => handleEdit(subcategory)}>
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete subcategory">
                      <IconButton color="error" onClick={() => handleDelete(subcategory.id)}>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}

              {subcategories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No subcategories found for this category
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
    );
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        {renderCategorySelector}
        <Card>{renderContent()}</Card>
      </Box>

      {/* Edit Dialog */}
      {editingSubcategory && (
        <SubcategoryEditDialog
          subcategory={editingSubcategory}
          open={!!editingSubcategory}
          onClose={() => setEditingSubcategory(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deletingSubcategoryId}
        onClose={() => setDeletingSubcategoryId(null)}
        title="Delete Subcategory"
        content="Are you sure you want to delete this subcategory? This action cannot be undone."
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={() => setDeletingSubcategoryId(null)}>Cancel</IconButton>
            <IconButton
              color="error"
              onClick={handleConfirmDelete}
              disabled={deleteSubcategory.isPending}
            >
              {deleteSubcategory.isPending ? <CircularProgress size={20} /> : 'Delete'}
            </IconButton>
          </Box>
        }
      />
    </>
  );
}
