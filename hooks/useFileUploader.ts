// hooks/useFileUploader.ts
import { useDropzone } from 'react-dropzone';
import { useCallback } from 'react';

export function useFileUploader(setFiles: React.Dispatch<React.SetStateAction<File[]>>) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, [setFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  return {
    getRootProps,
    getInputProps,
    isDragActive,
  };
}
