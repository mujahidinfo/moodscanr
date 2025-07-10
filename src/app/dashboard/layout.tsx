import React from 'react';
import { Navbar } from '../_components/navbar';
import { Footer } from '../_components/footer';
import { auth } from '~/server/auth';
import { redirect } from 'next/navigation';

const DashboardLayout = async ({
	children,
}: Readonly<{ children: React.ReactNode }>) => {
   const session = await auth();
   if (!session?.user) {
      redirect('/auth/signin');
   }
   return (
      <div className='flex flex-col min-h-screen'>
         <Navbar session={session} />
         <main className='flex-grow'>
            {children}
         </main>
         <Footer />
      </div>
   );
};

export default DashboardLayout;