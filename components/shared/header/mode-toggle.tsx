'use client';
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { SunIcon,MoonIcon,SunMoonIcon } from "lucide-react";
import { useTheme } from "next-themes";


const ModeToggle = () => {
    const [mounted, setMounted] = useState(false)
    const {theme, setTheme} = useTheme();
    useEffect(() => {
        setMounted(true);
    },[]);
    if(!mounted){
        return null;
    }

    return <DropdownMenu>
       <DropdownMenuTrigger asChild>
        <Button variant = 'ghost' className=" focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full h-10 w-10 p-0 hover:bg-muted">
            {theme === 'system'?(<SunMoonIcon className="h-5 w-5" />
            )  : theme === 'dark' ?(
                <MoonIcon className="h-5 w-5" />
            ):(<SunIcon className="h-5 w-5" />)
            }
        </Button>
       </DropdownMenuTrigger>
       <DropdownMenuContent className="w-44 p-2 rounded-2xl bg-popover/95 backdrop-blur-md border border-muted/50 shadow-xl" align="end">
        <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1.5">
            Appearance
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />
        <div className="flex flex-col gap-1 mt-1">
          <DropdownMenuItem asChild>
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-2.5 w-full px-2.5 py-2 text-sm rounded-xl transition-all duration-200 outline-none cursor-pointer ${
                theme === 'light'
                  ? 'bg-orange-500 text-white font-medium shadow-md shadow-orange-500/20 hover:bg-orange-600 hover:text-white'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <SunIcon className="h-4 w-4" />
              Light
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-2.5 w-full px-2.5 py-2 text-sm rounded-xl transition-all duration-200 outline-none cursor-pointer ${
                theme === 'dark'
                  ? 'bg-orange-500 text-white font-medium shadow-md shadow-orange-500/20 hover:bg-orange-600 hover:text-white'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <MoonIcon className="h-4 w-4" />
              Dark
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <button
              onClick={() => setTheme('system')}
              className={`flex items-center gap-2.5 w-full px-2.5 py-2 text-sm rounded-xl transition-all duration-200 outline-none cursor-pointer ${
                theme === 'system'
                  ? 'bg-orange-500 text-white font-medium shadow-md shadow-orange-500/20 hover:bg-orange-600 hover:text-white'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <SunMoonIcon className="h-4 w-4" />
              System
            </button>
          </DropdownMenuItem>
        </div>
       </DropdownMenuContent>
    </DropdownMenu>
}

export default ModeToggle;