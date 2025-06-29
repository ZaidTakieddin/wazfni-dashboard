'use client';

import type { CreateSubcategoryRequest } from 'src/types/category';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Box,
  Dialog,
  Button,
  MenuItem,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';

import { useCategories, useCreateSubcategory } from 'src/lib/hooks/use-categories';

import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const SubcategorySchema = zod.object({
  name: zod.string().min(1, 'Name is required'),
  categoryId: zod.string().min(1, 'Category is required'),
});

type SubcategoryFormData = zod.infer<typeof SubcategorySchema>;

type Props = {
  open: boolean;
  onClose: () => void;
};

export function SubcategoryCreateDialog({ open, onClose }: Props) {
  const { data: categories = [] } = useCategories();
  const createSubcategory = useCreateSubcategory();

  const methods = useForm<SubcategoryFormData>({
    resolver: zodResolver(SubcategorySchema),
    defaultValues: {
      name: '',
      categoryId: '',
    },
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = handleSubmit(async (data: SubcategoryFormData) => {
    try {
      const createData: CreateSubcategoryRequest = {
        name: data.name,
      };

      await createSubcategory.mutateAsync({
        categoryId: data.categoryId,
        data: createData,
      });

      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create subcategory:', error);
    }
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Create New Subcategory</DialogTitle>

        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Field.Select
              name="categoryId"
              label="Parent Category"
              placeholder="Select a category"
              required
            >
              <MenuItem value="">
                <em>Select a category</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Text
              name="name"
              label="Subcategory Name"
              placeholder="Enter subcategory name"
              required
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={createSubcategory.isPending}
            startIcon={createSubcategory.isPending ? <CircularProgress size={20} /> : null}
          >
            Create Subcategory
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
