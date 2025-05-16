// components/FileUploader.tsx
import React from 'react';
import { DropzoneRootProps, DropzoneInputProps } from 'react-dropzone';

type FileUploaderProps = {
    getRootProps: () => DropzoneRootProps;
    getInputProps: () => DropzoneInputProps;
    isDragActive: boolean;
    files: File[];
    required?: boolean;
    onRemoveFile?: (index: number) => void; // 삭제 콜백 추가
};

const FileUploader: React.FC<FileUploaderProps> = ({
    getRootProps,
    getInputProps,
    isDragActive,
    files,
    required,
    onRemoveFile
}) => {
    return (
        <div>
            <div {...getRootProps()} className="dropzone border p-4 rounded-md bg-gray-50 cursor-pointer">
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>파일을 여기로 놓아주세요...</p>
                ) : (
                    <p>
                        파일을 업로드하세요 {required && <span className="text-red-500 ml-2">(필수)</span>}
                    </p>
                )}
            </div>
            <div className="file-preview mt-2 space-y-1">
                {files.length === 0 && required && (
                    <p className="text-sm text-red-500">※ 이 항목은 필수입니다.</p>
                )}
                {files.map((file, index) => (
                    <div key={index} className="file-item flex items-center justify-between bg-white border rounded px-3 py-1 text-sm">
                        <span>
                            📄 {file.name} ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                        {onRemoveFile && (
                            <button
                                onClick={() => onRemoveFile(index)}
                                className="ml-4 text-red-500 hover:text-red-700 text-xs"
                            >
                                삭제
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileUploader;
