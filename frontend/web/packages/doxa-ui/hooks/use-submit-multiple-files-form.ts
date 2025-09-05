import { useCallback } from 'react';
import { toast } from '@/src/utils/hooks/use-toast';
import api from '@/src/utils/hooks/api.hooks';

// File type categories based on MIME types
const FILE_TYPE_CATEGORIES = {
  image: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/bmp',
  ],
  video: [
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/wmv',
    'video/flv',
    'video/webm',
    'video/mkv',
    'video/3gp',
  ],
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    'application/rtf',
  ],
};

// Helper function to determine file category based on MIME type
const getFileCategory = (mimeType: string): 'images' | 'videos' | 'documents' | 'files' => {
  if (FILE_TYPE_CATEGORIES.image.includes(mimeType)) {
    return 'images';
  }
  if (FILE_TYPE_CATEGORIES.video.includes(mimeType)) {
    return 'videos';
  }
  if (FILE_TYPE_CATEGORIES.document.includes(mimeType)) {
    return 'documents';
  }
  return 'files'; // Default for other file types
};

// Helper function to extract file path from URL based on category
const extractFilePathFromUrl = (
  url: string,
  category: 'images' | 'videos' | 'documents' | 'files'
): string | null => {
  const pattern = new RegExp(`/api/uploads/${category}/(.+)$`);
  const match = url.match(pattern);
  return match ? match[1] : null;
};

export function useSubmitMultiFieldFilesForm<T extends Record<string, any>>(
  onSubmit: Function,
  form: any,
  uploadFields: string[]
) {
  const { mutateAsync: uploadImages, isPending: isUploadingImages } = api.upload.useUploadImage();
  const { mutateAsync: uploadVideos, isPending: isUploadingVideos } = api.upload.useUploadVideo();
  const { mutateAsync: uploadDocuments, isPending: isUploadingDocuments } =
    api.upload.useUploadDocument();
  const { mutateAsync: uploadFiles, isPending: isUploadingFiles } = api.upload.useUploadFile();

  const { mutateAsync: deleteImage } = api.upload.useDeleteImage();
  const { mutateAsync: deleteVideo } = api.upload.useDeleteVideo();
  const { mutateAsync: deleteDocument } = api.upload.useDeleteDocument();
  const { mutateAsync: deleteFile } = api.upload.useDeleteFile();

  const isUploading =
    isUploadingImages || isUploadingVideos || isUploadingDocuments || isUploadingFiles;

  const deleteOldFile = useCallback(
    (fileUrl: string) => {
      // Determine file category from URL and delete accordingly
      if (fileUrl.includes('/api/uploads/images/')) {
        const fileName = extractFilePathFromUrl(fileUrl, 'images');
        if (fileName) deleteImage(fileName);
      } else if (fileUrl.includes('/api/uploads/videos/')) {
        const fileName = extractFilePathFromUrl(fileUrl, 'videos');
        if (fileName) deleteVideo(fileName);
      } else if (fileUrl.includes('/api/uploads/documents/')) {
        const fileName = extractFilePathFromUrl(fileUrl, 'documents');
        if (fileName) deleteDocument(fileName);
      } else if (fileUrl.includes('/api/uploads/files/')) {
        const fileName = extractFilePathFromUrl(fileUrl, 'files');
        if (fileName) deleteFile(fileName);
      }
    },
    [deleteImage, deleteVideo, deleteDocument, deleteFile]
  );

  const deleteOldFiles = useCallback(
    (files: string | string[]) => {
      if (Array.isArray(files)) {
        files.forEach((file) => deleteOldFile(file));
      } else if (files) {
        deleteOldFile(files);
      }
    },
    [deleteOldFile]
  );

  // Helper function to get nested field value
  const getNestedValue = useCallback((obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }, []);

  // Helper function to set nested field value
  const setNestedValue = useCallback((obj: any, path: string, value: any) => {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
  }, []);

  // Helper function to upload files based on their category
  const uploadFilesByCategory = useCallback(
    async (files: File[], category: 'images' | 'videos' | 'documents' | 'files') => {
      const formData = new FormData();
      files.forEach((file) => {
        const fieldName =
          category === 'images'
            ? 'images'
            : category === 'videos'
            ? 'videos'
            : category === 'documents'
            ? 'documents'
            : 'files';
        formData.append(fieldName, file);
      });

      switch (category) {
        case 'images':
          return await uploadImages(formData);
        case 'videos':
          return await uploadVideos(formData);
        case 'documents':
          return await uploadDocuments(formData);
        case 'files':
          return await uploadFiles(formData);
        default:
          throw new Error(`Unsupported file category: ${category}`);
      }
    },
    [uploadImages, uploadVideos, uploadDocuments, uploadFiles]
  );

  const uploadAndSubmit = useCallback(
    async (data: Partial<T>, oldData: T) => {
      const uploadPromises: Promise<any>[] = [];
      const fieldsToUpload: string[] = [];
      const oldFilesToDelete: string[] = [];

      try {
        // Check which fields need uploading
        for (const field of uploadFields) {
          const fieldValue = getNestedValue(data, field) as any;

          if (fieldValue instanceof File) {
            // Single file upload
            fieldsToUpload.push(field);
            const category = getFileCategory(fieldValue.type);

            uploadPromises.push(
              uploadFilesByCategory([fieldValue], category).then((res) => ({
                field,
                category,
                isSingle: true,
                result: res,
              }))
            );

            // Mark old file for deletion
            const oldFieldValue = getNestedValue(oldData, field);
            if (oldFieldValue) {
              oldFilesToDelete.push(oldFieldValue as string);
            }
          } else if (
            Array.isArray(fieldValue) &&
            fieldValue.some((item: any) => item instanceof File)
          ) {
            // Multiple files upload
            fieldsToUpload.push(field);

            // Separate files from existing URLs
            const filesToUpload = fieldValue.filter((item: any) => item instanceof File) as File[];
            const existingUrls = fieldValue.filter((item: any) => typeof item === 'string');

            if (filesToUpload.length > 0) {
              // Group files by category
              const filesByCategory = filesToUpload.reduce((acc, file) => {
                const category = getFileCategory(file.type);
                if (!acc[category]) acc[category] = [];
                acc[category].push(file);
                return acc;
              }, {} as Record<string, File[]>);

              // Upload each category separately
              const categoryUploadPromises = Object.entries(filesByCategory).map(
                ([category, files]) =>
                  uploadFilesByCategory(files, category as any).then((res) => ({
                    category,
                    result: res,
                  }))
              );

              uploadPromises.push(
                Promise.all(categoryUploadPromises).then((results) => ({
                  field,
                  isSingle: false,
                  existingUrls,
                  categoryResults: results,
                }))
              );
            } else {
              // No new files to upload, just keep existing URLs
              setNestedValue(data, field, existingUrls);
            }

            // Mark old files for deletion if completely replacing
            const oldFieldValue = getNestedValue(oldData, field);
            if (oldFieldValue && Array.isArray(oldFieldValue)) {
              const oldFiles = oldFieldValue as string[];
              const keptFiles = existingUrls;
              const filesToDelete = oldFiles.filter((file: string) => !keptFiles.includes(file));
              oldFilesToDelete.push(...filesToDelete);
            }
          }
        }

        // Delete old files before uploading new ones
        if (oldFilesToDelete.length > 0) {
          deleteOldFiles(oldFilesToDelete);
        }

        // Wait for all uploads to complete
        if (uploadPromises.length > 0) {
          const uploadResults = await Promise.all(uploadPromises);

          // Process upload results
          uploadResults.forEach((result: any) => {
            const field = result.field;

            if (result.isSingle) {
              // Single file result
              setNestedValue(data, field, (result.result.data as any).data[0] as string);
            } else {
              // Multiple files result
              const allNewUrls: string[] = [];
              result.categoryResults.forEach((categoryResult: any) => {
                allNewUrls.push(...(categoryResult.result.data as any).data);
              });
              setNestedValue(data, field, [...result.existingUrls, ...allNewUrls]);
            }
          });
        }

        function onError() {
          // Clean up uploaded files on error
          fieldsToUpload.forEach((field: string) => {
            const fieldValue = getNestedValue(data, field) as any;
            if (typeof fieldValue === 'string') {
              deleteOldFile(fieldValue);
            } else if (Array.isArray(fieldValue)) {
              deleteOldFiles(fieldValue.filter((item: any) => typeof item === 'string'));
            }
          });
        }

        await onSubmit(data as any, form, onError);
      } catch (err: any) {
        console.error(err);

        // Clean up any uploaded files on error
        fieldsToUpload.forEach((field: string) => {
          const fieldValue = getNestedValue(data, field) as any;
          if (typeof fieldValue === 'string') {
            deleteOldFile(fieldValue);
          } else if (Array.isArray(fieldValue)) {
            deleteOldFiles(fieldValue.filter((item: any) => typeof item === 'string'));
          }
        });

        toast({
          title: 'Ocorreu um erro',
          description: `Ocorreu um erro ao carregar os arquivos, ${err.message}`,
          variant: 'destructive',
        });
      }
    },
    [
      uploadFilesByCategory,
      deleteOldFile,
      deleteOldFiles,
      uploadFields,
      getNestedValue,
      setNestedValue,
      onSubmit,
      form,
      toast,
    ]
  );

  return { uploadAndSubmit, isUploading };
}
