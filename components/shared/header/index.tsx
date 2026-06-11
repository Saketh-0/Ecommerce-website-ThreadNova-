import Image from 'next/image';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import Menu from './menu';
import Search from './search';

const Header = () => {
  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <Link href="/" className="flex-start ml-4 group">
            <Image
              src="/images/logo.svg"
              alt={`${APP_NAME} logo`}
              height={48}
              width={48}
              priority={true}
              className="transition-transform duration-200 group-hover:scale-110"
            />
            <span className="hidden lg:block font-bold text-2xl ml-3 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <div className="hidden md:block flex-1 max-w-xl mx-8">
          <Search />
        </div>
        <Menu />
      </div>
    </header>
  );
};

export default Header;