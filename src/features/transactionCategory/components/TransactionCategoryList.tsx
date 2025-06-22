// src/features/transactionCategory/components/TransactionCategoryList.tsx
import React, { useState } from 'react';
import { useCategories, useDeleteCategory } from '../hooks';
import TransactionCategoryForm from './TransactionCategoryForm';
import { TransactionCategory } from './types';

const TransactionCategoryList: React.FC = () => {
  const { data: categories, isLoading, error } = useCategories();
  const deleteMutation = useDeleteCategory();

  const [editing, setEditing] = useState<TransactionCategory | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Transaction Categories</h2>
      <button
        onClick={() => {
          setIsCreating(true);
          setEditing(null);
        }}
      >
        + Add New
      </button>
      {(isCreating || editing) && (
        <TransactionCategoryForm
          initialData={editing || undefined}
          onSuccess={() => {
            setEditing(null);
            setIsCreating(false);
          }}
          onCancel={() => {
            setEditing(null);
            setIsCreating(false);
          }}
        />
      )}
      <ul>
        {categories?.map((cat) => (
          <li key={cat.id}>
            <strong>{cat.name}</strong> ({cat.categoryType})
            <button
              onClick={() => {
                setEditing(cat);
                setIsCreating(false);
              }}
            >
              Edit
            </button>
            <button onClick={() => deleteMutation.mutate(cat.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionCategoryList;
