// components/SiteFooter.tsx
import Link from 'next/link';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import { BiLogoGmail } from "react-icons/bi";

type SocialLink = {
    name: string;
    href: string;
    icon: React.ReactNode;
};

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const socialLinks: SocialLink[] = [
        { name: 'GitHub', href: 'https://github.com/RohaidAhmed', icon: <FaGithub /> },
        { name: 'LinkedIn', href: 'https://www.linkedin.com/in/rohaid-ahmed-mirza-11a35721a/', icon: <FaLinkedin className='bg-blue-600 ' /> },
        { name: 'Email', href: 'mailto:rohaidahmed123@gmail.com', icon: <BiLogoGmail className='fill-red-600' /> }
    ];

    return (
        <footer className="mt-auto py-6 px-4 border-t">
            <div className="container mx-auto max-w-4xl">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                        © {currentYear} Rohaid Ahmed Mirza
                    </p>

                    <nav className="flex gap-4">
                        {socialLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex"
                            >
                                {link.icon} {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </footer>
    );
}