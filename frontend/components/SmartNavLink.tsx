'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SmartNavLinkProps {
    href: string;
    sectionId?: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

const SmartNavLink: React.FC<SmartNavLinkProps> = ({
    href,
    sectionId,
    children,
    className = '',
    onClick
}) => {
    const pathname = usePathname();
    const isHomePage = pathname === '/';

    const handleClick = (e: React.MouseEvent) => {
        if (onClick) onClick();

        // If we're on the home page and have a sectionId, scroll to section
        if (isHomePage && sectionId) {
            e.preventDefault();
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
        // Otherwise, let the Link handle navigation normally
    };

    return (
        <Link href={href} className={className} onClick={handleClick}>
            {children}
        </Link>
    );
};

export default SmartNavLink;