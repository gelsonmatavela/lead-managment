'use client';
import { Button } from '@/src/components/shadcn-ui/ui/button';
import { Input } from '@/src/components/shadcn-ui/ui/input';
import { Label } from '@/src/components/shadcn-ui/ui/label';
import Logo from '@/src/components/ui/logo';
import { useParams, useRouter } from 'next/navigation';
import { type ReactElement, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import React from 'react';
import { Eye, EyeOff, Lock, ArrowRight, Key } from 'lucide-react';
import api from '@/src/utils/hooks/api.hooks';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { queryClient } from '@/src/components/app-wrapper/app-wrapper';
import { Form, FormField, FormItem } from '@/src/components/shadcn-ui/ui/form';
import FormInput from '@/packages/doxa-ui/components/ui/form-input';
import { AnimatedBackground } from '@/src/components/azra-ui/floating-components/animated-background';
import { FloatingParticles } from '@/src/components/azra-ui/floating-components/floating-particles';
import { GlowingInputWrapper } from '@/src/components/azra-ui/floating-components/glitch-text';

const updatePasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, 'A palavra-passe deve ter pelo menos 8 caracteres')
    .regex(/(?=.*[a-z])/, 'Deve conter pelo menos uma letra minúscula')
    .regex(/(?=.*[A-Z])/, 'Deve conter pelo menos uma letra maiúscula')
    .regex(/(?=.*\d)/, 'Deve conter pelo menos um número'),
  confirmPassword: z.string().min(1, 'Confirmação da palavra-passe é obrigatória'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As palavras-passe não coincidem',
  path: ['confirmPassword'],
});

const translations = {
  en: {
    title: 'Update Password',
    subtitle: 'Set your new password for  Lead System Managment account',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    updatePassword: 'Update Password',
    newPasswordPlaceholder: 'Enter your new password',
    confirmPasswordPlaceholder: 'Confirm your new password',
    backToLogin: 'Back to Login',
    poweredBy: '© 2025  Lead System Managment - Remote Work Aproved, All rights reserved.',
    passwordRequirements: 'Password must contain at least 8 characters, including uppercase, lowercase, number and special character',
  },
  pt: {
    title: 'Atualizar Palavra-passe',
    subtitle: 'Defina sua nova palavra-passe para a conta  Lead System Managment',
    newPassword: 'Nova Palavra-passe',
    confirmPassword: 'Confirmar Palavra-passe',
    updatePassword: 'Atualizar Palavra-passe',
    newPasswordPlaceholder: 'Digite sua nova palavra-passe',
    confirmPasswordPlaceholder: 'Confirme sua nova palavra-passe',
    backToLogin: 'Voltar ao Login',
    poweredBy: '© 2025  Lead System Managment - Trabalho Remoto Aprovado, Todos os direitos reservados.',
    passwordRequirements: 'A palavra-passe deve conter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial',
  },
};

export default function UpdatePasswordPage(): ReactElement {
  const router = useRouter();
  const { locale } = useParams();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const { mutateAsync: updatePassword, isPending } = api.auth.useUpdatePassword();

  const form = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const currentLocale = (locale as string) || 'en';
  const isValidLocale = currentLocale === 'pt' || currentLocale === 'en';
  const t = translations[isValidLocale ? (currentLocale as keyof typeof translations) : 'en'];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (data: z.infer<typeof updatePasswordSchema>) => {
    try {
      await updatePassword({
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      router.push(`/${locale}/admin/dashboard`);
    } catch (error) {
      console.error('Error updating password: ', error);
    }
  };

  const handleBackToLogin = () => {
    router.push(`/${currentLocale}/auth/login`);
  };

  return (
    <div className='relative min-h-screen overflow-hidden'>
      <AnimatedBackground />

      <FloatingParticles />

      <div
        className='fixed w-96 h-96 bg-gradient-to-r from-orange-500/8 to-yellow-500/8 rounded-full blur-3xl pointer-events-none z-10 transition-all duration-500 ease-out'
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      <div className='relative z-20 flex min-h-screen items-center justify-center px-4 py-8'>
        <div className='w-full max-w-md space-y-8'>
          <div className='text-center space-y-4 transform hover:scale-105 transition-transform duration-300'>
            <Logo
              theme='dark'
              className='h-12 md:h-16 object-contain w-full filter drop-shadow-2xl'
              width={200}
            />
            <div className='space-y-2'>
              <h1 className='text-3xl md:text-4xl font-bold text-white drop-shadow-lg'>
                {t.title}
              </h1>
              <p className='text-gray-300 text-lg'>{t.subtitle}</p>
            </div>
          </div>

          <div className='relative backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl p-8 rounded-2xl transform hover:scale-[1.02] transition-all duration-500 hover:bg-white/15'>
            <div className='absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full animate-ping opacity-60' />
            <div
              className='absolute -bottom-2 -right-2 w-4 h-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full animate-ping opacity-60'
              style={{ animationDelay: '6s' }}
            />

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
                <div className='space-y-2'>
                  <Label htmlFor='newPassword' className='text-white font-medium flex items-center gap-2'>
                    <Key className='w-4 h-4 text-orange-400' />
                    {t.newPassword}
                  </Label>
                  <GlowingInputWrapper isFocused={newPasswordFocused}>
                    <div className='relative'>
                      <FormField
                        control={form.control}
                        name='newPassword'
                        render={({ field }) => (
                          <FormItem>
                            <Input
                              {...field}
                              id='newPassword'
                              type={showNewPassword ? 'text' : 'password'}
                              placeholder={t.newPasswordPlaceholder}
                              className='bg-black/50 border-white/20 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 h-12 pr-12'
                              onFocus={() => setNewPasswordFocused(true)}
                              onBlur={(e) => {
                                setNewPasswordFocused(false);
                                field.onBlur();
                              }}
                            />
                          </FormItem>
                        )}
                      />
                      <button
                        type='button'
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-400 transition-colors duration-200'
                      >
                        {showNewPassword ? (
                          <EyeOff className='w-5 h-5' />
                        ) : (
                          <Eye className='w-5 h-5' />
                        )}
                      </button>
                    </div>
                  </GlowingInputWrapper>
                  {form.formState.errors.newPassword && (
                    <p className='text-red-400 text-sm'>
                      {form.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label
                    htmlFor='confirmPassword'
                    className='text-white font-medium flex items-center gap-2'
                  >
                    <Lock className='w-4 h-4 text-orange-400' />
                    {t.confirmPassword}
                  </Label>
                  <GlowingInputWrapper isFocused={confirmPasswordFocused}>
                    <div className='relative'>
                      <FormField
                        control={form.control}
                        name='confirmPassword'
                        render={({ field }) => (
                          <FormItem>
                            <Input
                              {...field}
                              id='confirmPassword'
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder={t.confirmPasswordPlaceholder}
                              className='bg-black/50 border-white/20 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 h-12 pr-12'
                              onFocus={() => setConfirmPasswordFocused(true)}
                              onBlur={(e) => {
                                setConfirmPasswordFocused(false);
                                field.onBlur();
                              }}
                            />
                          </FormItem>
                        )}
                      />
                      <button
                        type='button'
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-400 transition-colors duration-200'
                      >
                        {showConfirmPassword ? (
                          <EyeOff className='w-5 h-5' />
                        ) : (
                          <Eye className='w-5 h-5' />
                        )}
                      </button>
                    </div>
                  </GlowingInputWrapper>
                  {form.formState.errors.confirmPassword && (
                    <p className='text-red-400 text-sm'>
                      {form.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className='bg-blue-900/20 border border-blue-500/30 rounded-lg p-3'>
                  <p className='text-blue-300 text-xs'>
                    {t.passwordRequirements}
                  </p>
                </div>

                <Button
                  type='submit'
                  disabled={isPending}
                  className='w-full group relative overflow-hidden bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white font-semibold py-3 h-12 rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <span className='relative z-10 flex items-center justify-center gap-2'>
                    {isPending ? (
                      <>
                        <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                        Atualizando...
                      </>
                    ) : (
                      <>
                        {t.updatePassword}
                        <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform duration-200' />
                      </>
                    )}
                  </span>
                  <div className='absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                </Button>
              </form>
            </Form>
          </div>

          <div className='text-center'>
            <button
              onClick={handleBackToLogin}
              className='text-orange-400 hover:text-orange-300 font-semibold transition-colors duration-200 hover:underline'
            >
              {t.backToLogin}
            </button>
          </div>

          <div className='flex justify-center items-center space-x-4 text-white/40'>
            <div className='w-12 h-px bg-gradient-to-r from-transparent to-white/30' />
            <div className='w-2 h-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full animate-pulse' />
            <div className='w-12 h-px bg-gradient-to-l from-transparent to-white/30' />
          </div>
        </div>
      </div>

      <div className='fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-r from-black/80 via-orange-900/80 to-black/80 backdrop-blur-sm border-t border-white/10'>
        <div className='text-center py-4 px-4'>
          <small className='text-xs text-gray-300 font-medium'>{t.poweredBy}</small>
        </div>
      </div>
    </div>
  );
}