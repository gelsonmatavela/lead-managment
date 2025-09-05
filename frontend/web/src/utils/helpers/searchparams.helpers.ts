import { useRouter } from "next/navigation";

export function useUpdateSearchParams(){
    const router = useRouter();

    function useUpdateSearchParams(fields: {name: string; value: string}[]){
         const url = new URL(location.href);
    fields.forEach((field) => url.searchParams.set(field.name, field.value));
    router.push(url.href, { scroll: true });

    }

    return useUpdateSearchParams;
}