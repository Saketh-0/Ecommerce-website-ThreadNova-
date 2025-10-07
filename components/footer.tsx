import { APP_NAME } from "@/lib/constants"
const Footer = () => {
    const currentYear = new Date().getFullYear();
    return ( <footer className="w-full p-4 bg-gray-800 text-center text-gray-400 text-sm">
            {currentYear} {APP_NAME}. All Rights Reserved
    </footer> );
}
 
export default Footer;
