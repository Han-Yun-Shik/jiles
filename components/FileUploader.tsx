// components/FileUploader.tsx
import React from 'react';
import { DropzoneRootProps, DropzoneInputProps } from 'react-dropzone';

type FileUploaderProps = {
    getRootProps: () => DropzoneRootProps;
    getInputProps: () => DropzoneInputProps;
    isDragActive: boolean;
    files: File[];
    required?: boolean;
};

const FileUploader: React.FC<FileUploaderProps> = ({ getRootProps, getInputProps, isDragActive, files, required }) => {
    return (
        <div>
            <div {...getRootProps()} className="dropzone border p-4 rounded-md bg-gray-50">
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>파일을 여기로 놓아주세요...</p>
                ) : (
                    <p>
                        파일을 업로드하세요 {required && <span className="text-red-500 ml-2">(필수)</span>}
                    </p>
                )}
            </div>
            <div className="file-preview mt-2">
                {files.length === 0 && required && (
                    <p className="text-sm text-red-500">※ 이 항목은 필수입니다.</p>
                )}
                {files.map((file, index) => (
                    <div key={index} className="file-item">
                        📄 {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileUploader;
