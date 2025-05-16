import { useDropzone } from 'react-dropzone';
import { useCallback } from 'react';

const MAX_FILE_SIZE = 1024 * 1024; // 1MB

export function useFileUploader(setFiles: React.Dispatch<React.SetStateAction<File[]>>) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // acceptedFiles는 이미 유효성 검사를 통과한 파일만 들어옴
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, [setFiles]);

  const onDropRejected = useCallback((fileRejections: any[]) => {
    fileRejections.forEach(rejection => {
      const file = rejection.file;
      if (file.size > MAX_FILE_SIZE) {
        alert(`"${file.name}" 파일은 1MB를 초과하여 업로드할 수 없습니다.`);
      }
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    multiple: true,
    maxSize: MAX_FILE_SIZE, // ✅ 이 설정이 핵심입니다.
  });

  return {
    getRootProps,
    getInputProps,
    isDragActive,
  };
}
