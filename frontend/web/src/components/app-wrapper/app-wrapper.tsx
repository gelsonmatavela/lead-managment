'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl';
import { useParams} from 'next/navigation';
import React, { ReactNode } from 'react';
import { Toaster } from '../shadcn-ui/toaster';
import tailwindConfig from '@/tailwind.config';
import NextTopLoader from 'nextjs-toploader';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

type Props = {
    children: ReactNode;
    locale?: any;
    messages: AbstractIntlMessages;
};

export default function AppWrapper({ children, messages }: Props) {
    const { locale } = useParams();

    return (
        <QueryClientProvider client={queryClient}>
            <NextIntlClientProvider
                timeZone='Africa/Cairo'
                messages={messages}
                locale={(locale as any) || 'pt'}
            >
                <NextTopLoader color={tailwindConfig.theme.extend.colors.primary['500']} />
                <Toaster />
                <AuthWraper>{children}</AuthWraper>
            </NextIntlClientProvider>
        </QueryClientProvider>
    );
}

function AuthWraper({ children }: { children: React.ReactNode }) {
    const pathname = useParams();

    return children;
}
