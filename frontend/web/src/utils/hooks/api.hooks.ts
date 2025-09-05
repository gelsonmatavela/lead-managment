import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import pluralize from "pluralize";
import { toast } from "./use-toast";
import { kebabCase, lowerCase, pascalCase } from "change-case-all";
import { AxiosInstance as apiClient } from "../axios";
import { queryClient } from "@/src/components/app-wrapper/app-wrapper";
import { convertToSearchParams } from "@/packages/doxa-ui/components/ui/filter-builder/utils/filter-builder.helpers";
import { useContext } from "react";
import { AppContext } from "../contexts/app.context";
import { useRouter } from "next/navigation";

type OutputBase = {
    id: string | number;
    [x: string]: any;
};

export type Response<Output> = {
    data: Output;
    [x: string]: any;
};

type Hooks = {
    useCreateOne: <Input, Output>() => ReturnType<
        typeof useMutation<Response<Output>, unknown, Input, unknown>
    >;
    useUploadImage: <Input, Output>() => ReturnType<
        typeof useMutation<Response<Output>, unknown, Input, unknown>
    >;
    useUpdateOne: <Input, Output extends OutputBase>() => ReturnType<
        typeof useMutation<
            Response<Output>,
            unknown,
            { id: string | number; body: Partial<Input> },
            unknown
        >
    >;
    useGetMany: <Output>(
        params?: Record<string, any>,
        options?: Record<string, any>
    ) => ReturnType<typeof useQuery<unknown, Error, Response<Output>>>;
    useGetOne: <Output>(
        params?: { id: string | number },
        options?: Record<string, any>
    ) => ReturnType<typeof useQuery<unknown, Error, Response<Output>>>;
    useDeleteOne: <Output>() => ReturnType<
        typeof useMutation<
            Response<Output> | null | undefined,
            Error,
            number | string,
            unknown
        >
    >;
    useGetMe: <Output>() => ReturnType<typeof useQuery<Response<Output>>>;
    useUpdateMe: <Input, Output extends OutputBase>() => ReturnType<
        typeof useMutation<
            Response<Output>,
            unknown,
            { body: Partial<Input> },
            unknown
        >
    >;
    useSignup: <Input, Output>() => ReturnType<
        typeof useMutation<Response<Output>, unknown, Input, unknown>
    >;
    useLogin: <Input, Output>() => ReturnType<
        typeof useMutation<Response<Output>, unknown, Input, unknown>
    >;
    useLogout: () => ReturnType<typeof useMutation<void, unknown, void, unknown>>;
    useDeleteMe: () => ReturnType<
        typeof useMutation<void, unknown, void, unknown>
    >;
    useDeleteImage: <Output>() => ReturnType<
        typeof useMutation<
            Response<Output> | null | undefined,
            Error,
            number | string,
            unknown
        >
    >;
    
    useUploadVideo: <Input, Output>() => ReturnType<
    typeof useMutation<Response<Output>, unknown, FormData, unknown>
    >;
    useUploadDocument: <Input, Output>() => ReturnType<
    typeof useMutation<Response<Output>, unknown, FormData, unknown>
    >;
    useUploadFile: <Input, Output>() => ReturnType<
    typeof useMutation<Response<Output>, unknown, FormData, unknown>
    >;
    useDeleteDocument: <Input, Output>() => ReturnType<
    typeof useMutation<
    Response<Output> | null | undefined,
    Error,
    number | string,
    unknown
    >
    >;
    useDeleteFile: <Input, Output>() => ReturnType<
    typeof useMutation<
    Response<Output> | null | undefined,
    Error,
    number | string,
    unknown
    >
    >;
    useDeleteVideo: <Output>() => ReturnType<
    typeof useMutation<
    Response<Output> | null | undefined,
    Error,
    number | string,
    unknown
    >
    >;
    
    useVerifyEmail: <Input, Output>() => ReturnType<
        typeof useMutation<Response<Output>, unknown, Input, unknown>
    >;
    
    useUpdatePassword: <Input, Output>() => ReturnType<
        typeof useMutation<Response<Output>, unknown, Input, unknown>
    >;
};

function createReactQueryHooks(tagTypes: string[]) {
    const hooks: Record<string, Hooks> = {};

    tagTypes.forEach((tag) => {
        const url = `/${kebabCase(pluralize(tag))}`;

        hooks[tag] = {
            useCreateOne: <Input, Output>(options = {}) => {
                const queryClient = useQueryClient();
                return useMutation<Response<Output>, unknown, Input, unknown>({
                    ...options,
                    mutationFn: async (data: Input) =>
                        (await apiClient.post(url, data)).data as Response<Output>,
                    onSuccess: () => {
                        queryClient.invalidateQueries({
                            queryKey: [lowerCase(pluralize(tag))],
                        });
                        toast({
                            title: `${pascalCase(tag)} created successfully!`,
                            variant: "success",
                        });
                    },
                    onError: (error: any) => {
                        toast({
                            title: `Error creating ${lowerCase(tag)}`,
                            description:
                                error.status !== 500
                                    ? error?.response?.data?.message
                                    : "Something went wrong.",
                            variant: "destructive",
                        });
                    },
                });
            },

            useGetOne: <Output>(
                params: { id: string | number },
                options?: Record<string, any>
            ) =>
                useQuery({
                    queryKey: [lowerCase(tag), params.id],
                    queryFn: async (): Promise<Response<Output>> =>
                        (await apiClient.get(`${url}/${params.id}`)).data,
                    ...options,
                }),

            useUpdateOne: <Input, Output extends OutputBase>() => {
                const queryClient = useQueryClient();
                return useMutation<
                    Response<Output>,
                    unknown,
                    { id: string | number; body: Input },
                    unknown
                >({
                    mutationFn: async ({
                        id,
                        body,
                    }: {
                        id: string | number;
                        body: Partial<Input>;
                    }): Promise<Response<Output>> =>
                        (await apiClient.patch(`${url}/${id}`, body)).data,
                    onSuccess: (data, vars) => {
                        queryClient.invalidateQueries({
                            queryKey: [lowerCase(pluralize(tag))],
                        });
                        queryClient.invalidateQueries({
                            queryKey: [lowerCase(tag), vars.id],
                        });
                        toast({
                            title: `${pascalCase(tag)} updated successfully!`,
                            variant: "success",
                        });
                    },
                    onError: (error: any) => {
                        toast({
                            title: `Error updating ${lowerCase(tag)}`,
                            description:
                                error.status !== 500
                                    ? error?.response?.data?.message
                                    : "Something went wrong.",
                            variant: "destructive",
                        });
                    },
                });
            },

            useDeleteOne: <Output extends OutputBase>() => {
                return useMutation({
                    mutationFn: async (id: string | number) =>
                        await apiClient.delete(`${url}/${id}`),
                    onSuccess: () => {
                        queryClient.invalidateQueries({
                            queryKey: [lowerCase(pluralize(tag))],
                        });
                        toast({
                            title: `${pascalCase(tag)} delected successfully!`,
                            variant: "success",
                        });
                    },
                    onError: (error: any) => {
                        toast({
                            title: `Error deleting ${lowerCase(tag)}`,
                            description:
                                error.status !== 500
                                    ? error?.response?.data?.message
                                    : "Something went wrong.",
                            variant: "destructive",
                        });
                    },
                    onMutate: async (id) => {
                        const previousData = queryClient.getQueryData([
                            lowerCase(pluralize(tag)),
                        ]);
                        queryClient.setQueryData(
                            [lowerCase(pluralize(tag))],
                            (previousList: Output[]) =>
                                previousList?.filter((data) => data.id !== id)
                        );
                        return { previousData };
                    },
                });
            },

            useGetMany: <Output>(params = {}, options = {}) => {
                return useQuery<Response<Output>>({
                    queryKey: [lowerCase(pluralize(tag)), params],
                    queryFn: async (): Promise<Response<Output>> => {
                        return (
                            await apiClient.get(
                                `${url}?${convertToSearchParams(params, "", { keepAll: true })}`
                            )
                        ).data;
                    },
                    ...options,
                });
            },

            useGetMe: <Output>() =>
                useQuery<Response<Output>>({
                    queryKey: ["me"],
                    queryFn: async (): Promise<Response<Output>> => {
                        const { dispatch } = useContext(AppContext);

                        try {
                            const data = await apiClient.get("/users/me");
                            dispatch({
                                type: "session-renewed",
                            });
                            return data;
                        } catch (err: any) {
                            return err;
                        }
                    },
                }),

            useUpdateMe: <Input, Output extends OutputBase>() => {
                const queryClient = useQueryClient();
                return useMutation<Response<Output>, unknown, { body: Input }, unknown>(
                    {
                        mutationFn: async ({
                            body,
                        }: {
                            body: Partial<Input>;
                        }): Promise<Response<Output>> =>
                            (await apiClient.patch(`/users/me`, body)).data,
                        onSuccess: () => {
                            queryClient.invalidateQueries({
                                queryKey: ["me"],
                            });

                            toast({
                                title: `${pascalCase(tag)} updated successfully!`,
                                variant: "success",
                            });
                        },
                        onError: (error: any) => {
                            toast({
                                title: `Error updating ${lowerCase(tag)}`,
                                description:
                                    error.status !== 500
                                        ? error?.response?.data?.message
                                        : "Something went wrong.",
                                variant: "destructive",
                            });
                        },
                    }
                );
            },
        } as Hooks;
    });

    hooks["auth"] = {
        useDeleteMe: () => {
            const queryClient = useQueryClient();
            return useMutation<void, Error, void, unknown>({
                mutationFn: async () => {
                    await apiClient.delete("/users/me");
                },
                onSuccess: () => {
                    queryClient.removeQueries({ queryKey: ["me"] });
                    toast({
                        title: "Account deleted successfully",
                        variant: "success",
                    });
                },
                onError: (error: any) => {
                    toast({
                        title: "Error deleting account",
                        description:
                            error.status !== 500
                                ? error?.response?.data?.message
                                : "Something went wrong.",
                        variant: "destructive",
                    });
                },
            });
        },

        useGetMe: <Output>() =>
            useQuery<Response<Output>>({
                queryKey: ["me"],
                queryFn: async (): Promise<Response<Output>> =>
                    (await apiClient.get("/users/me")).data,
            }),

        useUpdateMe: <Input, Output extends OutputBase>() => {
            const queryClient = useQueryClient();
            return useMutation<
                Response<Output>,
                unknown,
                { body: Partial<Input> },
                unknown
            >({
                mutationFn: async ({ body }) =>
                    (await apiClient.patch("/users/me", body)).data,
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["me"] });
                    toast({
                        title: "Profile updated successfully!",
                        variant: "success",
                    });
                },
                onError: (error: any) => {
                    toast({
                        title: "Error updating profile",
                        description:
                            error.status !== 500
                                ? error?.response?.data?.message
                                : "Something went wrong.",
                        variant: "destructive",
                    });
                },
            });
        },

        useSignup: <Input, Output>() => {
            const queryClient = useQueryClient();
            return useMutation<Response<Output>, unknown, Input, unknown>({
                mutationFn: async (data: Input) =>
                    (await apiClient.post(`/auth/signup`, data)).data,
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["me"] });
                    toast({
                        title: "Signup successful!",
                        variant: "success",
                    });
                },
                onError: (error: any) => {
                    toast({
                        title: "Error signing up",
                        description:
                            error.status !== 500
                                ? error?.response?.data?.message
                                : "Something went wrong.",
                        variant: "destructive",
                    });
                },
            });
        },

        useLogin: <Input, Output>() => {
            const queryClient = useQueryClient();
            return useMutation<Response<Output>, unknown, Input, unknown>({
                mutationFn: async (data: Input) =>
                    (await apiClient.post(`/auth/login`, data)).data,
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["me"] });
                    toast({
                        title: "Login successful!",
                        variant: "success",
                    });
                },
                onError: (error: any) => {
                    let message = error?.response?.data?.message;

                    switch (error?.status) {
                        case 401:
                            message =
                                "Credenciais invalidas, verifique os seus dados de acesso.";
                            break;
                        case 403:
                            message = "Acesso negado.";
                            break;
                        case 404:
                            message = "Usuário não encontrado.";
                            break;
                        default:
                            message = "Ocorreu um erro tente novamente.";
                    }

                    toast({
                        title: "Login failed",
                        description: message,
                        variant: "destructive",
                    });
                },
            });
        },

        useLogout: () => {
            const queryClient = useQueryClient();
            const { dispatch } = useContext(AppContext);
            const router = useRouter();

            return useMutation<void, unknown, void, unknown>({
                mutationFn: async () => {
                    await apiClient.delete(`/auth/logout`);
                },
                onSuccess: () => {
                    queryClient.removeQueries({ queryKey: ["me"] });
                    toast({
                        title: "Logged out successfully",
                        variant: "success",
                    });
                    router.push("/auth/login");
                    dispatch({
                        type: "session-expired",
                    });
                },
                onError: (error: any) => {
                    toast({
                        title: "Logout failed",
                        description:
                            error.status !== 500
                                ? error?.response?.data?.message
                                : "Something went wrong.",
                        variant: "destructive",
                    });
                },
            });
        },

        useVerifyEmail: <Input, Output>() => {
            const queryClient = useQueryClient();
            return useMutation<Response<Output>, unknown, Input, unknown>({
                mutationFn: async (data: Input) =>
                    (await apiClient.post(`/auth/verify-email`, data)).data,
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["me"] });
                    toast({
                        title: "E-mail verificado com sucesso!",
                        variant: "success",
                    });
                },
                onError: (error: any) => {
                    let message = error?.response?.data?.message;

                    switch (error?.status) {
                        case 401:
                            message =
                                "E-mail inválido, verifique e tente mais uma vez.";
                            break;
                        case 403:
                            message = "Acesso negado.";
                            break;
                        case 404:
                            message = "E-mail não encontrado.";
                            break;
                        default:
                            message = "Ocorreu um erro tente novamente.";
                    }

                    toast({
                        title: "Verificação de e-mail falhou",
                        description: message,
                        variant: "destructive",
                    });
                },
            });
        },

        useUpdatePassword: <Input, Output>() => {
            const queryClient = useQueryClient();
            return useMutation<Response<Output>, unknown, Input, unknown>({
                mutationFn: async (data: Input) =>
                    (await apiClient.patch(`/auth/update-password`, data)).data,
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["me"] });
                    toast({
                        title: "Palavra-passe atualizada com sucesso!",
                        variant: "success",
                    });
                },
                onError: (error: any) => {
                    let message = error?.response?.data?.message;

                    switch (error?.status) {
                        case 400:
                            message = "Palavra-passe atual incorreta.";
                            break;
                        case 401:
                            message = "Não autorizado. Faça login novamente.";
                            break;
                        case 422:
                            message = "Nova palavra-passe não atende aos requisitos.";
                            break;
                        default:
                            message = "Ocorreu um erro. Tente novamente.";
                    }

                    toast({
                        title: "Erro ao atualizar palavra-passe",
                        description: message,
                        variant: "destructive",
                    });
                },
            });
        },

    } as unknown as Hooks;

    hooks["upload"] = {
        useUploadVideo: <Input, Output>() => {
            return useMutation<Response<Output>, unknown, FormData, unknown>({
                mutationFn: async (formData: FormData) =>
                    (await apiClient.post("/uploads/videos", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    })) as Response<Output>,
                onSuccess: () => {
                    toast({
                      title: "Video uploaded successfully!",
                      variant: "success",
                    });
                },
                onError: (error: any) => {
                    toast({
                        title: "Error uploading video",
                        description:
                            error.status !== 500
                                ? error?.response?.data?.message
                                : "Something went wrong.",
                        variant: "destructive",
                    });
                },
            });
        },

        useDeleteVideo: <Output>() => {
            return useMutation<Response<Output>, unknown, string, unknown>({
                mutationFn: async (filename: string) =>
                    (await apiClient.delete(`/uploads/videos/${filename}`)).data,
                onSuccess: () => {
                    toast({
                      title: "Video deleted successfully!",
                      variant: "success",
                    });
                },
                onError: (error: any) => {
                    toast({
                        title: "Erro deletando vídeo no servidor",
                        description:
                            error.status !== 500
                                ? error?.response?.data?.message
                                : "Something went wrong.",
                        variant: "destructive",
                    });
                },
            });
        },

        useUploadDocument: <Input, Output>() => {
            return useMutation<Response<Output>, unknown, FormData, unknown>({
                mutationFn: async (formData: FormData) =>
                    (await apiClient.post("/uploads/documents", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    })) as Response<Output>,
                onSuccess: () => {
                    toast({
                      title: "Document uploaded successfully!",
                      variant: "success",
                    });
                },
                onError: (error: any) => {
                    toast({
                        title: "Error uploading document",
                        description:
                            error.status !== 500
                                ? error?.response?.data?.message
                                : "Something went wrong.",
                        variant: "destructive",
                    });
                },
            });
        },

        useDeleteDocument: <Output>() => {
            return useMutation<Response<Output>, unknown, string, unknown>({
                mutationFn: async (filename: string) =>
                    (await apiClient.delete(`/uploads/documents/${filename}`)).data,
                onSuccess: () => {
                    toast({
                      title: "Document deleted successfully!",
                      variant: "success",
                    });
                },
                onError: (error: any) => {
                    toast({
                        title: "Erro deletando documento no servidor",
                        description:
                            error.status !== 500
                                ? error?.response?.data?.message
                                : "Something went wrong.",
                        variant: "destructive",
                    });
                },
            });
        },

        useUploadFile: <Input, Output>() => {
            return useMutation<Response<Output>, unknown, FormData, unknown>({
                mutationFn: async (formData: FormData) =>
                    (await apiClient.post("/uploads/files", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    })) as Response<Output>,
                onSuccess: () => {
                    toast({
                      title: "Document uploaded successfully!",
                      variant: "success",
                    });
                },
                onError: (error: any) => {
                    toast({
                        title: "Error uploading document",
                        description:
                            error.status !== 500
                                ? error?.response?.data?.message
                                : "Something went wrong.",
                        variant: "destructive",
                    });
                },
            });
        },

        useDeleteFile: <Output>() => {
            return useMutation<Response<Output>, unknown, string, unknown>({
                mutationFn: async (filename: string) =>
                    (await apiClient.delete(`/uploads/documents/${filename}`)).data,
                onSuccess: () => {
                    toast({
                      title: "Document deleted successfully!",
                      variant: "success",
                    });
                },
                onError: (error: any) => {
                    toast({
                        title: "Erro criando documento no servidor",
                        description:
                            error.status !== 500
                                ? error?.response?.data?.message
                                : "Something went wrong.",
                        variant: "destructive",
                    });
                },
            });
        },

        useUploadImage: <Input, Output>() => {
            return useMutation<Response<Output>, unknown, FormData, unknown>({
                mutationFn: async (formData: FormData) =>
                    (await apiClient.post("/uploads/images", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    })) as Response<Output>,
                onSuccess: () => {
                    toast({
                      title: "Image uploaded successfully!",
                      variant: "success",
                    });
                },
                onError: (error: any) => {
                    toast({
                        title: "Error uploading image",
                        description:
                            error.status !== 500
                                ? error?.response?.data?.message
                                : "Something went wrong.",
                        variant: "destructive",
                    });
                },
            });
        },

        useDeleteImage: <Output>() => {
            return useMutation<Response<Output>, unknown, string, unknown>({
                mutationFn: async (filename: string) =>
                    (await apiClient.delete(`/uploads/images/${filename}`)).data,
                onSuccess: () => {
                    toast({
                      title: "Image deleted successfully!",
                      variant: "success",
                    });
                },
                onError: (error: any) => {
                    toast({
                        title: "Erro deletando imagem no servidor",
                        description:
                            error.status !== 500
                                ? error?.response?.data?.message
                                : "Something went wrong.",
                        variant: "destructive",
                    });
                },
            });
        },

        useUpdateOne: <Input, Output extends OutputBase>() => {
            return {} as ReturnType<
                typeof useMutation<
                    Response<Output>,
                    unknown,
                    { id: string | number; body: Partial<Input> },
                    unknown
                >
            >;
        },
        useGetMany: <Output>(params = {}, options = {}) => {
            return {} as ReturnType<
                typeof useQuery<unknown, Error, Response<Output>>
            >;
        },
        useGetOne: <Output>(
            params: { id: string | number },
            options?: Record<string, any>
        ) => {
            return {} as ReturnType<
                typeof useQuery<unknown, Error, Response<Output>>
            >;
        },
        useGetMe: <Output>() => {
            return {} as ReturnType<typeof useQuery<Response<Output>>>;
        },
        useUpdateMe: <Input, Output extends OutputBase>() => {
            return {} as ReturnType<
                typeof useMutation<
                    Response<Output>,
                    unknown,
                    { body: Partial<Input> },
                    unknown
                >
            >;
        },
        useSignup: <Input, Output>() => {
            return {} as ReturnType<
                typeof useMutation<Response<Output>, unknown, Input, unknown>
            >;
        },
        useLogin: <Input, Output>() => {
            return {} as ReturnType<
                typeof useMutation<Response<Output>, unknown, Input, unknown>
            >;
        },
        useLogout: () => {
            return {} as ReturnType<typeof useMutation<void, unknown, void, unknown>>;
        },
        useDeleteMe: () => {
            return {} as ReturnType<typeof useMutation<void, unknown, void, unknown>>;
        },
        useUpdatePassword: <Input, Output>() => {
            return {} as ReturnType<
                typeof useMutation<Response<Output>, unknown, Input, unknown>
            >;
        },

    } as unknown as Hooks;

    return hooks;
}

export const tagTypes = [
    "user",
    "auth",
    "address",
    "authRole",
    "staff",
    "company",
    "authPermission", 
];

const api = createReactQueryHooks(tagTypes);

export default api;