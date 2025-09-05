// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";

//   const form = useForm({
//     defaultValues: {
//       id: crypto.randomUUID(),
//       supplier: { id: '' },
//       request: { id: request?.id || '' },
//       quotationDate: new Date().toISOString().split('T')[0],
//       totalCost: '',
//       files: [],
//       poNumber: '',
//       paymentMethod: 'Credit' as 'Credit' | 'Cash',
//       paymentDate: '',
//       isRejected: false,
//       ...defaultValues,
//     } as any,
//     resolver: zodResolver(schema),
//   });

// export default function Debug() {
//   const watchedFiles = form.watch('files') || [];

//   return (
//     <div>
//           {process.env.NODE_ENV === 'development' && (
//                     <details className='bg-gray-100 p-2 rounded text-xs'>
//                       <summary>Debug Info</summary>
//                       <pre>
//                         {JSON.stringify(
//                           {
//                             errors: form.formState.errors,
//                             values: form.getValues(),
//                             filesCount: watchedFiles.length,
//                             isUploading,
//                           },
//                           null,
//                           2
//                         )}
//                       </pre>
//                     </details>
//                   )}
//   }
//     </div>
// )
// }