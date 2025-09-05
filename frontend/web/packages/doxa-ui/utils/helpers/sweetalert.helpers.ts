import Swal, { SweetAlertOptions } from 'sweetalert2';

export function promptConfirm(
  options: SweetAlertOptions,
  confirmedFn?: () => void,
  deniedFn?: () => void
) {
  Swal.fire({
    showCancelButton: false,
    confirmButtonText: 'Ok',
    icon: 'error',
    customClass: {
      icon: 'size-16 ',
      actions: 'flex  w-full pr-2 flex-row-reverse',
      container: 'text-inherit z-[1000] bg-red-500', // Added z-index here
      title: 'text-lg ',
      htmlContainer: 'text-[0.875rem] text-sm ',
      confirmButton: 'button text-[0.875rem] font-normal self-end bg-blue-500',
      cancelButton: 'cancel-button text-[0.875rem] font-normal',
      ...options.customClass,
    },

    ...options,
  }).then((result) => {
    if (result.isConfirmed) {
      confirmedFn && confirmedFn();
    } else {
      deniedFn && deniedFn();
    }
  });
}

export function promptYesOrNo(
  { customClass, ...options }: SweetAlertOptions,
  confirmedFn?: () => void,
  deniedFn?: () => void
) {
  Swal.fire({
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Confirmar',
    icon: 'warning',
    target: document.body, // Ensure it renders at body level
    backdrop: true,
    allowOutsideClick: false,
    customClass: {
      icon: 'size-16 ',
      actions: 'flex  w-full pr-2 flex-row-reverse',
      container: 'text-inherit z-[1000] bg-red-500 swal-high-z fixed top-0 left-0', // Added z-index here
      title: 'text-lg ',
      htmlContainer: 'text-[0.875rem] text-sm ',
      confirmButton: 'button text-[0.875rem] font-normal self-end bg-blue-500 z-[1000] rounded-sm',
      cancelButton: 'cancel-button text-[0.875rem] font-normal rounded-sm',
      ...customClass,
    },
    ...options,
  }).then((result) => {
    if (result.isConfirmed) {
      confirmedFn && confirmedFn();
    } else {
      deniedFn && deniedFn();
    }
  });
}
