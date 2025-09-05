import { getRequestConfig, setRequestLocale } from 'next-intl/server';
import { routing } from './routing';
import path from 'path';
import fs from 'fs/promises';
import { Folder } from 'lucide-react';

export default getRequestConfig(
    async ({
        requestLocale,
    }: {
        requestLocale: Promise<string | undefined>;
    }): Promise<{ locale: string; messages: Record<string, any>; timeZone: string }> => {
        let locale = await requestLocale;

        if (!locale || !routing.locales.includes(locale as 'en' | 'pt')) {
            locale = routing.defaultLocale;
        }

        const appRoot = path.join(process.cwd(), 'app/[locale]');
        const messages: Record<string, any> = {};
        let adminPath = path.join(appRoot, 'admin/(main)');

        if (['login', 'forgot-password', 'reset-password'].includes(Folder.name))
            adminPath = path.join(appRoot, 'admin/auth');

        try {
            const folders = await fs.readdir(adminPath, { withFileTypes: true });

            for (const folder of folders) {
                if (!folder.isDirectory()) continue;

                const messagesFile = path.join(
                    adminPath,
                    folder.name,
                    'utils/i18n/messages',
                    `${locale}.json`
                );

                try {
                    const content = await fs.readFile(messagesFile, 'utf-8');
                    messages[`${folder.name}`] = JSON.parse(content);
                } catch {
                    //   console.warn(`Admin translation not found: ${messagesFile}`);
                }
            }
        } catch (error) {
            console.error('Error loading admin translation: ', error);
        }
        let userPath = path.join(appRoot, 'user/(main)');

        if (['login', 'forgot-password', 'reset-password'].includes(Folder.name))
            userPath = path.join(appRoot, 'auth');

        try {
            const folders = await fs.readdir(userPath, { withFileTypes: true });

            for (const folder of folders) {
                if (!folder.isDirectory()) continue;

                const messagesFile = path.join(
                    userPath,
                    folder.name,
                    'utils/i18n/messages',
                    `${locale}.json`
                );

                try {
                    const content = await fs.readFile(messagesFile, 'utf-8');
                    messages[`${folder.name}`] = JSON.parse(content);
                } catch {
                    //   console.warn(`Admin translation not found: ${messagesFile}`);
                }
            }
        } catch (error) {
            console.error('Error loading admin translation: ', error);
        }

        try {
            const authLoginPath = path.join(
                appRoot,
                'auth/login/utils/i18n/messages',
                `${locale}.json`
            );

            const content = await fs.readFile(authLoginPath, 'utf-8');
            messages['login'] = JSON.parse(content);
        } catch {
            console.warn(`Auth/login translation not foundw`);
        }

        try {
            const topLevelFolders = await fs.readdir(appRoot, { withFileTypes: true });

            for (const folder of topLevelFolders) {
                const sectionName = folder.name;

                if (!folder.isDirectory()) continue;
                if (['admin', 'auth', 'public'].includes(sectionName)) continue;

                const messagesFile = path.join(
                    appRoot,
                    sectionName,
                    'utils/i18n/messages',
                    `${locale}.json`
                );

                try {
                    const content = await fs.readFile(messagesFile, 'utf-8');
                    messages[sectionName] = JSON.parse(content);
                } catch {
                    console.warn(`Translation not found: ${sectionName}`);
                }
            }
        } catch (error) {
            console.error('Error loading general translations: ', error);
        }

        return {
            locale,
            messages,
            timeZone: 'Africa/Cairo',
        };
    }
);
