import React from 'react';
import { TRPCReactProvider } from '~/trpc/react';
import { Navbar } from '../_components/navbar';
import { auth } from '~/server/auth';
import { Footer } from '../_components/footer';

const Layout = async ({ children }: { children: React.ReactNode }) => {
   const session = await auth()

   return (
      <div>
         <TRPCReactProvider>
            <Navbar session={session || null} />
            {children}
            <Footer />
         </TRPCReactProvider>
      </div>
   );
};

export default Layout;