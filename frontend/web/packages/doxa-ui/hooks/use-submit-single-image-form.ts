import { useCallback } from "react";
import { toast } from "@/src/utils/hooks/use-toast";
import api from "@/src/utils/hooks/api.hooks";

export function useSubmitSingleImageForm<T extends Record<any, any>>(
  onSubmit: Function,
  form: any,
  uploadField: string
) {
  const {mutateAsync: uploadImages,  isPending: isUploadingImage } =
    api.upload.useUploadImage();
  const {mutateAsync: deleteImage} = api.upload.useDeleteImage();

  const deleteOldImage = useCallback(
    (image: string) => {
      deleteImage(image?.split?.("/api/uploads/images/")?.[1]);
    },
    [deleteImage]
  );

  const uploadAndSubmit = useCallback(
    async (data: Partial<T>, oldData: T) => {
      if ((data[uploadField] as any) instanceof File) {
        try {
          if (data[uploadField]) {
            const formData = new FormData();

            formData.append("images", data[uploadField] as File);

            if (oldData?.[uploadField]) {
              deleteOldImage(oldData?.[uploadField] as string);
            }

            const res = await uploadImages(formData);
            (data[uploadField] as string) = (res.data as any).data[0] as string;
          }

          function onError() {
            if (typeof data[uploadField] === "string")
              deleteOldImage(data[uploadField] as string);
          }

          await onSubmit(data as any, form, onError);
          // form.reset(oldData?.id ? data : {});
        } catch (err: any) {
          console.error(err);
          toast({
            title: "Ocorreu um erro",
            description:
              `Ocorreu um erro ao carregar as imagens, ${err.message}`,
            variant: "destructive",
          });
        }
      } else {
        onSubmit(data as any, form);
        // form.reset(oldData?.id ? data : {});
      }
    },
    [uploadImages, deleteOldImage]
  );

  return { uploadAndSubmit, isUploadingImage };
}
