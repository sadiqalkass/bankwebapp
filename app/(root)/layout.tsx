import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggenIn = {firstname: 'Sadiq', lastName: 'Dayyub'}
  return (
  <main className="w-full h-screen flex font-inter">
    <Sidebar user={loggenIn}/>
    <div className="flex flex-col size-full">
      <div className="root-layout">
        <Image src='/icons/logo.svg' width={30} height={30} alt="logo"/>
        <div>
          <MobileNav user={loggenIn}/>
        </div>
      </div>
      {children}
    </div>
  </main>
  );
}

