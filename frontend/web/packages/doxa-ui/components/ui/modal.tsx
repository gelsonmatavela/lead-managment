import Button from '@/packages/doxa-ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/shadcn-ui/ui/dialog';
import { twMerge } from 'tailwind-merge';

export type ModalProps = {
  trigger?: React.ReactElement;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  description?: string;
  children: React.ReactNode;
  dialogContentClassName?: string;
  dialogTriggerClassName?: string;
  showConfirmButton?: boolean;
  doAfterSuccessCreate?: (data: any) => void;
  doAfterSuccessUpdate?: (data: any) => void;
  doAfterSuccessDelete?: (data: any) => void;
};

export function Modal({
  trigger,
  isOpen,
  setIsOpen,
  title = '',
  description = '',
  children,
  dialogContentClassName,
  dialogTriggerClassName,
  showConfirmButton,
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && (
        <DialogTrigger asChild className={twMerge('', dialogTriggerClassName)}>
          {/* <Button variant="outline">Edit Profile</Button> */}
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent
        className={twMerge(
          'sm:max-w-[425px] p-2 sm:p-4 md:p-6 pt-6 rounded-md sm:z-[50] z-[1000]  mx-16',
          dialogContentClassName
        )}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>{children}</div>
        {showConfirmButton && (
          <DialogFooter>
            <Button type='submit'>Save changes</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
