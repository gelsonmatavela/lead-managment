import Button from '@/packages/doxa-ui/components/ui/button';
import { useSession } from '@/packages/doxa-ui/hooks/use-session';
import api from '@/src/utils/hooks/api.hooks';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@radix-ui/react-dropdown-menu';
import { User, LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function AccountDropdown({ children }: { children: React.ReactNode }) {
  const { mutateAsync: logOut } = api.auth.useLogout();
  const router = useRouter();
  const session = useSession();
  const translations = useTranslations('layout.sidebar');
  const [isDialogUserOpen, setIsDialogUserOpen] = useState(false);

  const handleProfileClick = () => {
  setIsDialogUserOpen(false); 
  router.push('/admin/users/profile/'); 
};

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className='w-60 bg-white grid gap-2 p-2 rounded-md border border-zinc-300 mt-2 shadow-md shadow-zinc-500/20'>
        {session.user && (
          <>
            <DropdownMenuItem className='w-full'>
              <Button
                className='w-full flex justify-start'
                onClick={handleProfileClick}
              >
                <User className='size-4' />
                {translations('account')}
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button onClick={() => logOut()} className='w-full flex justify-start'>
                <LogOut className='size-4' />
                {translations('signOut')}
              </Button>
            </DropdownMenuItem>
          </>
        )}

        {!session.isLoading && !session.user && (
          <DropdownMenuItem className='w-full'>
            <Button
              className='w-full flex justify-start'
              href={`/auth/login?origin=${encodeURIComponent(location.href)}`}
            >
              <User className='size-4' />
              {translations('login')}
            </Button>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
