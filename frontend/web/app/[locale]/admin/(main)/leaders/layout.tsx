import Navbar from '@/src/components/azra-ui/navbar/navbar';
import Sidebar from '@/src/components/azra-ui/sidebar/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex max-h-[100vh] bg-gray-950'>
      <Sidebar />

      <div className='flex-1 flex flex-col'>
        <Navbar />

        <main className='flex-1 overflow-auto'>{children}</main>
      </div>
    </div>
  );
}
