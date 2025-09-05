import { useSession } from '@/packages/doxa-ui/hooks/use-session';
import Image from 'next/image';
import LanguageSelector from '../language-switcher/language-switcher';
import AccountDropdown from './account-dropdown';
import { useContext } from 'react';
import { AppContext } from '@/src/utils/contexts/app.context';
import Button from '@/packages/doxa-ui/components/ui/button';
import { Columns3, MenuIcon, XIcon } from 'lucide-react';
import Logo from '../ui/logo';

export default function Navbar({
  setIsSidebarOpen,
  isSidbebarOpen,
}: {
  isSidbebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const session = useSession();
  const { state } = useContext(AppContext);

  return (
    <div className='flex flex-row justify-end fixed lg:w-[calc(100%-254px)] w-full top-0 right-[0] bg-background-900 p-2 md:px-4 text-white z-[50] border-l-none items-center border-b-2 border-secondary-800/30'>
      <Button className='size-8 p-0 lg:hidden' onClick={() => setIsSidebarOpen((prev) => !prev)}>
        {isSidbebarOpen ? <XIcon size={16} /> : <MenuIcon size={16} />}
      </Button>
      <div className='sm:ml-4 ml-3 flex-1 w-full justify-start  flex gap-2 items-center'>
        <Logo theme='light' className='h-5 w-fit lg:hidden inline ' />

        <h1 className='font-bold md:text-xl hidden lg:block'>{state.pageTitle}</h1>
      </div>
      <div className='flex w-full flex-1 flex-row justify-end'>
        <div className='mr-8'>
          <LanguageSelector />
        </div>
        <div>
          <AccountDropdown>
            <button className='flex gap-3 items-center'>
              <span>
               <small> Olá, <b>{session?.user?.staffCode
                
                ?.split(' ')?.[0]}</b></small>
              </span>
              <Image
                src={'/logotipo/Servana Logo 2 PNG.png'}
                alt='User Avatar'
                width={40}
                height={40}
                className='cursor-pointer object-cover size-8 rounded-full border-1 border-transparent bg-gradient-to-tr  p-0.5 bg-clip-border'
              />
            </button>
          </AccountDropdown>
        </div>
      </div>
    </div>
  );
}
