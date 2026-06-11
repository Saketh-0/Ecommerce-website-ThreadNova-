import { Button } from '@/components/ui/button';
import ModeToggle from './mode-toggle';
import Link from 'next/link';
import { ShoppingCart, UserIcon, LogOut, Package, LayoutDashboard } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical } from 'lucide-react';
import { getCurrentUser, signOut } from '@/lib/actions/user.actions';
import { getMyCart } from '@/lib/actions/cart.actions';
import Search from './search';

const Menu = async () => {
  const user = await getCurrentUser();
  const cart = await getMyCart();
  const cartItemsCount = cart?.items?.reduce((a: number, c: { qty: number }) => a + c.qty, 0) || 0;

  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1 items-center">
        <ModeToggle />
        <Button asChild variant="ghost" className="relative">
          <Link href="/cart">
            <ShoppingCart className="h-5 w-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {cartItemsCount}
              </span>
            )}
            <span className="ml-1">Cart</span>
          </Link>
        </Button>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden lg:inline">{user.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/user/orders" className="cursor-pointer">
                  <Package className="mr-2 h-4 w-4" />
                  My Orders
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/user/profile" className="cursor-pointer">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              {user.role === 'admin' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <form action={signOut} className="w-full">
                  <button type="submit" className="flex w-full items-center cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild>
            <Link href="/sign-in">
              <UserIcon className="mr-1 h-4 w-4" /> Sign In
            </Link>
          </Button>
        )}
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle" asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <EllipsisVertical className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col w-[300px] sm:w-[320px] p-6 bg-background/95 backdrop-blur-md border-l border-muted/50 overflow-y-auto">
            <SheetTitle className="text-xl font-bold tracking-tight bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              ThreadNova
            </SheetTitle>
            <div className="w-full mt-4">
              <Search />
            </div>
            
            <div className="w-full space-y-1 py-4">
              <Link href="/" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-orange-500 transition-colors py-2 pl-1">
                Home
              </Link>
              <Link href="/cart" className="flex items-center justify-between w-full text-sm font-medium text-foreground hover:text-orange-500 transition-colors py-2 pl-1">
                <span className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  Cart
                </span>
                {cartItemsCount > 0 && (
                  <span className="bg-orange-500 text-white text-xs rounded-full px-2.5 py-0.5 font-semibold">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            </div>

            <div className="w-full space-y-2 py-4 border-t border-muted/50">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Categories</p>
              <Link href="/search?category=Men%27s+Dress+Shirts" className="flex items-center text-sm font-medium text-foreground hover:text-orange-500 transition-colors py-1.5">
                {"👔 Men's Dress Shirts"}
              </Link>
              <Link href="/search?category=Men%27s+Sweatshirts" className="flex items-center text-sm font-medium text-foreground hover:text-orange-500 transition-colors py-1.5">
                {"🧥 Men's Sweatshirts"}
              </Link>
              <Link href="/search?category=Accessories" className="flex items-center text-sm font-medium text-foreground hover:text-orange-500 transition-colors py-1.5">
                {"⌚ Accessories"}
              </Link>
              <Link href="/search?category=Women%27s+Tops" className="flex items-center text-sm font-medium text-foreground hover:text-orange-500 transition-colors py-1.5">
                {"👚 Women's Tops"}
              </Link>
            </div>

            {user ? (
              <div className="w-full space-y-3 py-4 border-t border-muted/50 mt-auto">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/40 border border-muted/50">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-semibold text-sm truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1 w-full pl-1">
                  <Link href="/user/orders" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-orange-500 transition-colors py-1.5">
                    <Package className="h-4 w-4 text-muted-foreground" /> My Orders
                  </Link>
                  <Link href="/user/profile" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-orange-500 transition-colors py-1.5">
                    <UserIcon className="h-4 w-4 text-muted-foreground" /> Profile
                  </Link>
                  {user.role === 'admin' && (
                    <Link href="/admin" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-orange-500 transition-colors py-1.5">
                      <LayoutDashboard className="h-4 w-4 text-muted-foreground" /> Admin Dashboard
                    </Link>
                  )}
                  <form action={signOut} className="w-full pt-2">
                    <Button type="submit" variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/15 rounded-xl h-9">
                      <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </Button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="w-full pt-4 border-t border-muted/50 mt-auto">
                <Button asChild className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl shadow-md">
                  <Link href="/sign-in" className="flex justify-center items-center">
                    <UserIcon className="mr-2 h-4 w-4" /> Sign In
                  </Link>
                </Button>
              </div>
            )}

            <div className="flex items-center justify-between w-full border-t pt-4 border-muted/50">
              <span className="text-sm font-medium text-muted-foreground">Appearance</span>
              <ModeToggle />
            </div>
            <SheetDescription className="sr-only">Mobile Menu Drawer</SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;