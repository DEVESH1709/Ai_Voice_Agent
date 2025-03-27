import  {ReactNode}from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/actions/auth.action'



const layout = async({children}:{children:ReactNode}) => {
const isUserAuthenticated =await isAuthenticated();
  if(!isUserAuthenticated) redirect('/sign-in')

  return (
    <div className='root-layout'>
   <nav>
    <Link href="/" className="flex items-center gap-2">
    <Image src="/logo.svg" alt="logo" width={30} height={32}></Image>
    <h2 className='text-primary-100'>PrepView</h2>
    </Link>
   </nav>
  {children}
    </div>
  )
}

export default layout;
// import { ReactNode } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { redirect } from 'next/navigation';
// import { isAuthenticated } from '@/lib/actions/auth.action';

// const Layout = async ({ children }: { children: ReactNode }) => {
//   const isUserAuthenticated = await isAuthenticated();

//   if (!isUserAuthenticated) {
//     redirect('/sign-in');
//   }

//   return (
//     <div className="root-layout">
//       <nav>
//         <Link href="/" className="flex items-center gap-2">
//           <Image src="/logo.svg" alt="logo" width={30} height={32} />
//           <h2 className="text-primary-100">PrepView</h2>
//         </Link>
//       </nav>
//       {children}
//     </div>
//   );
// };

// export default Layout;



// import { ReactNode } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { redirect } from 'next/navigation';
// import { isAuthenticated } from '@/lib/actions/auth.action';

// const Layout = async ({ children }: { children: ReactNode }) => {
//   const isUserAuthenticated = await isAuthenticated();

//   if (!isUserAuthenticated) {
//     // Agar user already '/sign-in' par hai to redirect na kare
//     if (typeof window !== "undefined" && window.location.pathname === "/sign-in") {
//       return <>{children}</>; 
//     }
//     redirect('/sign-in');
//   }

//   return (
//     <div className="root-layout">
//       <nav>
//         <Link href="/" className="flex items-center gap-2">
//           <Image src="/logo.svg" alt="logo" width={30} height={32} />
//           <h2 className="text-primary-100">PrepView</h2>
//         </Link>
//       </nav>
//       {children}
//     </div>
//   );
// };

// export default Layout;


// import { ReactNode } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { redirect } from 'next/navigation';
// import { isAuthenticated } from '@/lib/actions/auth.action';

// const Layout = async ({ children }: { children: ReactNode }) => {
//   const isUserAuthenticated = await isAuthenticated();
//   const isOnSignInPage = typeof window !== "undefined" && window.location.pathname === "/sign-in";

//   if (!isUserAuthenticated && !isOnSignInPage) {
//     redirect('/sign-in');
//   }

//   return (
//     <div className="root-layout">
//       <nav>
//         <Link href="/" className="flex items-center gap-2">
//           <Image src="/logo.svg" alt="logo" width={30} height={32} />
//           <h2 className="text-primary-100">PrepView</h2>
//         </Link>
//       </nav>
//       {children}
//     </div>
//   );
// };

// export default Layout;
