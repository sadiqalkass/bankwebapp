"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"
import Footer from "./Footer";

const MobileNav = ({ user }: MobileNavProps) => {
  const pathname = usePathname();
  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger>
          <Image
            src="/icons/hamburger.svg"
            width={30}
            height={30}
            className="cursor-pointer"
            alt="menu"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-white">
          <Link
            href="/"
            className="cursor-pointer items-center gap-1 flex px-4"
          >
            <Image
              src="/icons/logo.svg"
              width={30}
              height={30}
              alt="logo"
              className="size-[24px] max-xl:size-14"
            />
            <h1 className="text-26 text-ibm-plex-serif font-bold text-black-1">
              Horizon
            </h1>
          </Link>
          <div className="mobilenav-sheet">
            <SheetClose asChild>
              <nav className="h-full gap-6 flex flex-col pt-16 text-white">
                {sidebarLinks.map((item, index) => {
                  const isActive =
                    pathname === item.route ||
                    pathname.startsWith(`${item.route}/`);
                  return (
                    <SheetClose asChild key={index}>
                      <Link
                        href={item.route}
                        key={index}
                        className={cn("mobilenav-sheet_close w-full", {
                          "bg-bank-gradient": isActive,
                        })}
                      >
                        <Image
                          alt={item.label}
                          src={item.imgURL}
                          width={20}
                          height={20}
                          className={cn({
                            "brightness-[3] invert-0": isActive,
                          })}
                        />
                        <p
                          className={cn("text-16 font-semibold text-black-2 ", {
                            "text-white": isActive,
                          })}
                        >
                          {item.label}
                        </p>
                      </Link>
                    </SheetClose>
                  );
                })}
                USER
              </nav>
            </SheetClose>
            <Footer user={user} type="mobile"/>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
