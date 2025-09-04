import { AppShell } from '@/components/app-shell';
import React from 'react';

interface AppLayoutProps {
    children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    return <AppShell>{children}</AppShell>;
}

export default AppLayout;