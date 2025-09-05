// app/layout.tsx
import { Inter } from 'next/font/google';
import '../globals.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import "react-toastify/dist/ReactToastify.css";

import DashboardWrapper from '../components/layouts/DashboardWrapper';
import { ToastContainer } from 'react-toastify';

config.autoAddCss = false;

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Admin Dashboard',
  description: 'A modern dashboard template built with Next.js 15',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DashboardWrapper>{children}</DashboardWrapper>
         <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
    </>
  );
}
