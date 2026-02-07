'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

interface LayoutWrapperProps {
    children: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
    const pathname = usePathname();

    // Halaman yang tidak perlu header dan footer
    const noHeaderFooterPages = [
        '/login',
        '/register',
        '/admin-login',
        '/dashboard'
    ];

    // Cek apakah halaman saat ini termasuk yang tidak perlu header/footer
    const shouldHideHeaderFooter = noHeaderFooterPages.some(page =>
        pathname === page || pathname.startsWith('/dashboard')
    );

    if (shouldHideHeaderFooter) {
        return <>{children}</>;
    }

    return (
        <>
            <Header />
            <main>{children}</main>
            <Footer />
        </>
    );
};

export default LayoutWrapper;