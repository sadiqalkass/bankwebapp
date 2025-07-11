import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <main className="flex min-h-screen w-full justify-center font-inter">
    {children}
    <div className="auth-asset">
      <div>
        <Image src='/icons/auth-image.jpg' width={500} height={500} alt="Auth Image"/>
      </div>
    </div>
  </main>
  );
}

