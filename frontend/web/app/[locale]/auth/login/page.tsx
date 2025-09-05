'use client';
import { Button } from '@/src/components/shadcn-ui/ui/button';
import { Input } from '@/src/components/shadcn-ui/ui/input';
import { Label } from '@/src/components/shadcn-ui/ui/label';
import Logo from '@/src/components/ui/logo';
import { useParams, useRouter } from 'next/navigation';
import { type ReactElement, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import React from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import api from '@/src/utils/hooks/api.hooks';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { queryClient } from '@/src/components/app-wrapper/app-wrapper';
import { Form, FormField, FormItem } from '@/src/components/shadcn-ui/ui/form';
import FormInput from '@/packages/doxa-ui/components/ui/form-input';
import { AnimatedBackground } from '@/src/components/azra-ui/floating-components/animated-background';
import { FloatingParticles } from '@/src/components/azra-ui/floating-components/floating-particles';
import { GlowingInputWrapper } from '@/src/components/azra-ui/floating-components/glitch-text';
import { loginSchema } from '@/src/schemas/auth/login.schema';

const translations = {
  en: {
    welcomeBack: 'Welcome Back',
    loginSubtitle: 'Sign in to your Lead System Managment account',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot your password?',
    signIn: 'Sign In',
    dontHaveAccount: "Don't have an account?",
    signUp: 'Sign up',
    emailPlaceholder: 'Enter your email',
    passwordPlaceholder: 'Enter your password',
    poweredBy: '© 2025 Lead System Managment - Remote Work Aproved, All rights reserved.',
  },
  pt: {
    welcomeBack: 'Bem-vindo de Volta',
    loginSubtitle: 'Entre na sua conta Lead System Managment',
    email: 'E-mail',
    password: 'Senha',
    forgotPassword: 'Esqueceu sua senha?',
    signIn: 'Entrar',
    dontHaveAccount: 'Não tem uma conta?',
    signUp: 'Cadastre-se',
    emailPlaceholder: 'Digite seu e-mail',
    passwordPlaceholder: 'Digite sua senha',
    poweredBy: '© 2025 Lead System Managment - Trabalho Remoto Aprovado, Todos os direitos reservados.',
  },
};

export default function LoginPage(): ReactElement {
  const router = useRouter();
  const { locale } = useParams();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const { mutateAsync: login, isPending } = api.auth.useLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
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

  const handleSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      await login(data);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      router.push(`/${locale}/admin/dashboard`);
    } catch (error) {
      console.error('Error on login section: ', error);
    }
  };

  const handleForgotPassword = () => {
    router.push(`/${currentLocale}/auth/verify-email`);
  };

  const handleSignUp = () => {
    router.push(`/${currentLocale}/auth/register`);
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
              width={500}
            />
            <div className='space-y-2'>
              <h1 className='text-3xl md:text-4xl font-bold text-white drop-shadow-lg'>
                {t.welcomeBack}
              </h1>
              <p className='text-gray-300 text-lg'>{t.loginSubtitle}</p>
            </div>
          </div>
          <div className='relative backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl p-8 rounded-2xl transform hover:scale-[1.02] transition-all duration-500 hover:bg-white/15'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
                <div className='space-y-2'>
                  <Label htmlFor='email' className='text-white font-light flex items-center gap-2'>
                    <Mail className='w-4 h-4 text-orange-400' />
                    {t.email}
                  </Label>
                  <GlowingInputWrapper isFocused={emailFocused}>
                    <FormField
                      control={form.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <Input
                            {...field}
                            id='email'
                            type='email'
                            placeholder={t.emailPlaceholder}
                            className='bg-black/50 border-white/20 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 h-[38px]'
                            onFocus={() => setEmailFocused(true)}
                            onBlur={(e) => {
                              setEmailFocused(false);
                              field.onBlur();
                            }}
                          />
                        </FormItem>
                      )}
                    />
                  </GlowingInputWrapper>
                </div>

                <div className='space-y-2'>
                  <Label
                    htmlFor='password'
                    className='text-white font-medium flex items-center gap-2'
                  >
                    <Lock className='w-4 h-4 text-orange-400' />
                    {t.password}
                  </Label>
                  <GlowingInputWrapper isFocused={passwordFocused}>
                    <div className='relative'>
                      <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                          <FormItem>
                            <Input
                              {...field}
                              id='password'
                              type={showPassword ? 'text' : 'password'}
                              placeholder={t.passwordPlaceholder}
                              className='bg-black/50 border-white/20 h-[38px] text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 pr-12'
                              onFocus={() => setPasswordFocused(true)}
                              onBlur={(e) => {
                                setPasswordFocused(false);
                                field.onBlur();
                              }}
                            />
                          </FormItem>
                        )}
                      />
                      <button
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-400 transition-colors duration-200'
                      >
                        {showPassword ? (
                          <EyeOff className='w-5 h-5' />
                        ) : (
                          <Eye className='w-5 h-5' />
                        )}
                      </button>
                    </div>
                  </GlowingInputWrapper>
                </div>

                <div className='text-right'>
                  <button
                    type='button'
                    onClick={handleForgotPassword}
                    className='text-sm text-orange-400 hover:text-orange-300 transition-colors duration-200 hover:underline'
                  >
                    {t.forgotPassword}
                  </button>
                </div>

                <Button
                  type='submit'
                  disabled={isPending}
                  className='w-full group relative overflow-hidden bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white font-semibold py-3 h-[38px] rounded-sm transform transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <span className='relative z-10 flex items-center justify-center gap-2'>
                    {isPending ? (
                      <>
                        <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                        Loading...
                      </>
                    ) : (
                      <>
                        {t.signIn}
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
            <p className='text-gray-300'>
              {t.dontHaveAccount}{' '}
              <button
                onClick={handleSignUp}
                className='text-orange-400 hover:text-orange-300 font-semibold transition-colors duration-200 hover:underline'
              >
                {t.signUp}
              </button>
            </p>
          </div>

          <div className='flex justify-center items-center space-x-4 text-white/40'>
            <div className='w-12 h-px bg-gradient-to-r from-transparent to-white/30' />
            <div className='w-2 h-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full animate-pulse' />
            <div className='w-12 h-px bg-gradient-to-l from-transparent to-white/30' />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-r from-black/80 via-orange-900/80 to-black/80 backdrop-blur-sm border-t border-white/10'>
        <div className='text-center py-4 px-4'>
          <small className='text-xs text-gray-300 font-medium'>{t.poweredBy}</small>
        </div>
      </div>
    </div>
  );
}
