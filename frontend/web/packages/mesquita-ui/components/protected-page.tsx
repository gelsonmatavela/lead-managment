import { useSession } from '@/packages/doxa-ui/hooks/use-session';
import UnauthorizedAccess from '@/src/components/access-denied/access-denied';
import { User} from '@/src/types/api';
import React from 'react';

export type ProtectedPageProps = {
  resource: string;
  action: string;
  children: React.ReactNode;
  area?: string;
};

export default function ProtectedPage({ resource, action, area, children }: ProtectedPageProps) {
  const session = useSession({ redirect: false });

  if (session.isLoading || !session?.user) return;

  if (!hasPermission({ resource, action, user: session.user })) {
    return (
      <UnauthorizedAccess 
        area={area}
        userPicture={session.user.picture}
        userName={session.user.name}
      />
    );
  }

  return children;
}

export function hasPermission({
  resource,
  action,
  user,
}: Omit<ProtectedPageProps, 'children'> & { user: User }) {
  return (
    user.isSuperUser ||
    !!user.roles.find(({ role }) =>
      role.permissions.find(
        (permission) => permission.resource === resource && permission.action === action
      )
    )
  );
}