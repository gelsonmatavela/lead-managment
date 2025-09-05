import { useCallback } from 'react';
import { toast } from '@/src/utils/hooks/use-toast';
import api from '@/src/utils/hooks/api.hooks';

export function useSubmitMultiFieldImagesForm<T extends Record<string, any>>(
  onSubmit: Function,
  form: any,
  uploadFields: string[]
) {
  const { mutateAsync: uploadImages, isPending: isUploadingImage } = api.upload.useUploadImage();
  const { mutateAsync: deleteImage } = api.upload.useDeleteImage();

  const deleteOldImage = useCallback(
    (image: string) => {
      deleteImage(image?.split?.('/api/uploads/images/')?.[1]);
    },
    [deleteImage]
  );

  const deleteOldImages = useCallback(
    (images: string | string[]) => {
      if (Array.isArray(images)) {
        images.forEach((image) => deleteOldImage(image));
      } else if (images) {
        deleteOldImage(images);
      }
    },
    [deleteOldImage]
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

  const uploadAndSubmit = useCallback(
    async (data: Partial<T>, oldData: T) => {
      const uploadPromises: Promise<any>[] = [];
      const fieldsToUpload: string[] = [];
      const oldImagesToDelete: string[] = [];

      try {
        // Check which fields need uploading
        for (const field of uploadFields) {
          const fieldValue = getNestedValue(data, field) as any;

          if (fieldValue instanceof File) {
            // Single file upload
            fieldsToUpload.push(field);
            const formData = new FormData();
            formData.append('images', fieldValue);
            uploadPromises.push(uploadImages(formData));

            // Mark old image for deletion
            const oldFieldValue = getNestedValue(oldData, field);
            if (oldFieldValue) {
              oldImagesToDelete.push(oldFieldValue as string);
            }
          } else if (
            Array.isArray(fieldValue) &&
            fieldValue.some((item: any) => item instanceof File)
          ) {
            // Multiple files upload
            fieldsToUpload.push(field);
            const formData = new FormData();

            // Separate files from existing URLs
            const filesToUpload = fieldValue.filter((item: any) => item instanceof File);
            const existingUrls = fieldValue.filter((item: any) => typeof item === 'string');

            filesToUpload.forEach((file: File) => {
              formData.append('images', file);
            });

            if (filesToUpload.length > 0) {
              uploadPromises.push(
                uploadImages(formData).then((res) => ({
                  field,
                  newUrls: (res.data as any).data,
                  existingUrls,
                }))
              );
            } else {
              // No new files to upload, just keep existing URLs
              setNestedValue(data, field, existingUrls);
            }

            // Mark old images for deletion if completely replacing
            const oldFieldValue = getNestedValue(oldData, field);
            if (oldFieldValue && Array.isArray(oldFieldValue)) {
              const oldImages = oldFieldValue as string[];
              const keptImages = existingUrls;
              const imagesToDelete = oldImages.filter((img: string) => !keptImages.includes(img));
              oldImagesToDelete.push(...imagesToDelete);
            }
          }
        }

        // Delete old images before uploading new ones
        if (oldImagesToDelete.length > 0) {
          deleteOldImages(oldImagesToDelete);
        }

        // Wait for all uploads to complete
        if (uploadPromises.length > 0) {
          const uploadResults = await Promise.all(uploadPromises);

          // Process upload results
          uploadResults.forEach((result: any, index: number) => {
            const field = fieldsToUpload[index];

            if (result.field) {
              // Multiple files result
              setNestedValue(data, field, [...result.existingUrls, ...result.newUrls]);
            } else {
              // Single file result
              setNestedValue(data, field, (result.data as any).data[0] as string);
            }
          });
        }

        function onError() {
          // Clean up uploaded images on error
          fieldsToUpload.forEach((field: string) => {
            const fieldValue = getNestedValue(data, field) as any;
            if (typeof fieldValue === 'string') {
              deleteOldImage(fieldValue);
            } else if (Array.isArray(fieldValue)) {
              deleteOldImages(fieldValue.filter((item: any) => typeof item === 'string'));
            }
          });
        }

        await onSubmit(data as any, form, onError);
      } catch (err: any) {
        console.error(err);

        // Clean up any uploaded images on error
        fieldsToUpload.forEach((field: string) => {
          const fieldValue = getNestedValue(data, field) as any;
          if (typeof fieldValue === 'string') {
            deleteOldImage(fieldValue);
          } else if (Array.isArray(fieldValue)) {
            deleteOldImages(fieldValue.filter((item: any) => typeof item === 'string'));
          }
        });

        toast({
          title: 'Ocorreu um erro',
          description: `Ocorreu um erro ao carregar as imagens, ${err.message}`,
          variant: 'destructive',
        });
      }
    },
    [uploadImages, deleteOldImage, deleteOldImages, uploadFields, getNestedValue, setNestedValue]
  );

  return { uploadAndSubmit, isUploadingImage };
}
