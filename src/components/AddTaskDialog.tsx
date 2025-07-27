import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Plus } from "lucide-react";

interface AddTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (title: string, description?: string) => void;
}

const AddTaskDialog: React.FC<AddTaskDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await onSubmit(title.trim(), description.trim() || undefined);
      setTitle("");
      setDescription("");
    } catch {
      // Error handling is done in parent component
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setTitle("");
      setDescription("");
      onClose();
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50' />
        <Dialog.Content className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md z-50'>
          <div className='flex items-center justify-between mb-4'>
            <Dialog.Title className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
              Add New Task
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className='text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'>
                <X className='h-5 w-5' />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label
                htmlFor='title'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
              >
                Task Title *
              </label>
              <input
                type='text'
                id='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-transparent'
                placeholder='Enter task title...'
                required
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor='description'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
              >
                Description (Optional)
              </label>
              <textarea
                id='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-transparent resize-none'
                placeholder='Enter task description...'
                rows={3}
                disabled={loading}
              />
            </div>

            <div className='flex justify-end space-x-3 pt-4'>
              <Dialog.Close asChild>
                <button
                  type='button'
                  className='px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors disabled:opacity-50'
                  disabled={loading}
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type='submit'
                disabled={!title.trim() || loading}
                className='flex items-center space-x-2 px-4 py-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 rounded-lg hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? (
                  <>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white dark:border-gray-800'></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <Plus className='h-4 w-4' />
                    <span>Add Task</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddTaskDialog;
