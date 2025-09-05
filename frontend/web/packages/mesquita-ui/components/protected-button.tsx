// protected-page.tsx (versão corrigida)
interface Permission {
  resource: string;
  action: string;
}

interface Role {
  permissions: Permission[];
}

interface UserRole {
  role: Role;
}

interface User {
  isSuperUser?: boolean;
  roles?: UserRole[];
}

interface HasPermissionProps {
  resource: string;
  action: string;
  user: User;
}

export function hasPermission({ resource, action, user }: HasPermissionProps): boolean {
  // Verificação defensiva: se não há usuário, negar acesso
  if (!user) {
    return false;
  }

  // Super usuário tem acesso a tudo
  if (user.isSuperUser) {
    return true;
  }

  // Verificação defensiva: se não há roles ou é um array vazio
  if (!user.roles || !Array.isArray(user.roles) || user.roles.length === 0) {
    return false;
  }

  // Buscar permissão nos roles do usuário
  return user.roles.some(({ role }) => {
    // Verificação defensiva: se role não existe ou não tem permissions
    if (!role || !role.permissions || !Array.isArray(role.permissions)) {
      return false;
    }

    // Procurar pela permissão específica
    return role.permissions.some(
      (permission) => 
        permission && 
        permission.resource === resource && 
        permission.action === action
    );
  });
}

// protected-button.tsx (versão corrigida)
import Button, { ButtonProps } from '@/packages/doxa-ui/components/ui/button';
import { useSession } from '@/packages/doxa-ui/hooks/use-session';
import React from 'react';

export type ProtectedButtonProps = {
  resource: string;
  action: string;
  children: React.ReactNode;
  onNoPermission?: 'disabled' | 'hide';
};

export default function ProtectedButton({
  resource,
  action,
  children,
  onNoPermission = 'disabled',
  ...props
}: ProtectedButtonProps & ButtonProps) {
  const session = useSession({ redirect: false });

  // Loading state
  if (session.isLoading) {
    return <Button disabled={true} {...props}>{children}</Button>;
  }

  // No session/user - hide or disable based on onNoPermission
  if (!session?.user) {
    if (onNoPermission === 'hide') {
      return null;
    }
    return <Button disabled={true} {...props}>{children}</Button>;
  }

  // Check permissions
  const isAllowed = hasPermission({ 
    resource, 
    action, 
    user: session.user 
  });

  // Hide if not allowed and onNoPermission is 'hide'
  if (onNoPermission === 'hide' && !isAllowed) {
    return null;
  }

  // Render button with appropriate disabled state
  return (
    <Button 
      disabled={onNoPermission === 'disabled' && !isAllowed} 
      {...props}
    >
      {children}
    </Button>
  );
}

// Hook personalizado para verificar permissões (opcional)
export function usePermission(resource: string, action: string) {
  const session = useSession({ redirect: false });

  if (session.isLoading || !session?.user) {
    return {
      isLoading: session.isLoading,
      hasPermission: false,
      user: session?.user
    };
  }

  return {
    isLoading: false,
    hasPermission: hasPermission({ 
      resource, 
      action, 
      user: session.user 
    }),
    user: session.user
  };
}

// Componente ProtectedRoute para proteger páginas inteiras
interface ProtectedRouteProps {
  resource: string;
  action: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  resource,
  action,
  children,
  fallback = <div>Access Denied</div>,
  redirectTo
}: ProtectedRouteProps) {
  const session = useSession({ redirect: !!redirectTo });

  if (session.isLoading) {
    return <div>Loading...</div>;
  }

  if (!session?.user) {
    return fallback;
  }

  const isAllowed = hasPermission({ 
    resource, 
    action, 
    user: session.user 
  });

  if (!isAllowed) {
    return fallback;
  }

  return <>{children}</>;
}

// Exemplo de uso dos componentes corrigidos:

// 1. Uso básico do ProtectedButton
function ExampleUsage() {
  return (
    <div>
      {/* Botão que fica desabilitado se não tiver permissão */}
      <ProtectedButton 
        resource="users" 
        action="create"
        onNoPermission="disabled"
      >
        Create User
      </ProtectedButton>

      {/* Botão que fica oculto se não tiver permissão */}
      <ProtectedButton 
        resource="users" 
        action="delete"
        onNoPermission="hide"
      >
        Delete User
      </ProtectedButton>
    </div>
  );
}

// 2. Uso do hook usePermission
function ComponentWithPermissionCheck() {
  const { hasPermission: canEdit, isLoading } = usePermission('posts', 'edit');

  if (isLoading) {
    return <div>Loading permissions...</div>;
  }

  return (
    <div>
      <h1>Post Title</h1>
      {canEdit && (
        <button>Edit Post</button>
      )}
    </div>
  );
}

// 3. Uso do ProtectedRoute
function AdminPage() {
  return (
    <ProtectedRoute 
      resource="admin" 
      action="access"
      fallback={<div>You don't have admin access</div>}
    >
      <div>Admin Dashboard Content</div>
    </ProtectedRoute>
  );
}