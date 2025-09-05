import { useCallback } from "react";
import { toast } from "@/src/utils/hooks/use-toast";
import api from "@/src/utils/hooks/api.hooks";

export function useSubmitMultipleImagesForm<T extends Record<any, any>>(
  onSubmit: Function,
  form: any,
  uploadField: string
) {
  const {mutateAsync: uploadImages,  isPending: isUploadingImage } =
    api.upload.useUploadImage();
  const {mutateAsync: deleteImage} = api.upload.useDeleteImage();

  const deleteOldImages = useCallback(
    (images: string[]) => {
      images?.forEach((image) => {
        if (
          image?.includes?.("/api/uploads/images/") &&
          typeof image === "string"
        ) {
          deleteImage(image?.split?.("/api/uploads/images/")?.[1]);
        }
      });
    },
    [deleteImage]
  );

  const uploadAndSubmit = useCallback(
    async (data: Partial<T>, oldData: T) => {
      const images = data[uploadField] as (File | string)[];
      const hasNewImages = images?.some((image) => image instanceof File);

      if (hasNewImages) {
        const formData = new FormData();
        const fileImages = images.filter(
          (image): image is File => image instanceof File
        );
        fileImages.forEach((image) => formData.append("images", image));

        // Delete old images if they exist
        if (oldData?.[uploadField]) {
          deleteOldImages(oldData[uploadField] as string[]);
        }

        let uploadedImageUrls: string[] = [];
        try {
          const res = await uploadImages(formData);
          uploadedImageUrls = (res?.data as any)?.data as string[];

          // Replace File objects with uploaded URLs while keeping existing URLs
          const newImages = images.map((image) =>
            image instanceof File
              ? uploadedImageUrls[fileImages.indexOf(image)]
              : image
          );

          (data[uploadField] as string[]) = newImages;

          onSubmit(data as any, form);
        } catch (err: any) {
          console.error(err);
          toast({
            title: "Ocorreu um erro",
            description:
              `Ocorreu um erro ao carregar as imagens, ${err.message}`,
            variant: "destructive",
          });
          if (uploadedImageUrls.length > 0) {
            deleteOldImages(uploadedImageUrls);
          }
        }
      } else {
        onSubmit(data as any, form);
      }
    },
    [uploadImages, deleteOldImages]
  );

  return { uploadAndSubmit, isUploadingImage };
}
