import React from 'react';
import { AwardIcon, ClipboardListIcon, Home, QrCodeIcon, SettingsIcon, LogOut } from 'lucide-react';
import NavBarLink from '@/components/layout/NavBarLink';
import { createClient } from '@/supabase/server';

export default async function NavBar() {
  const supabase = await createClient();

  const user = await supabase.auth.getUser();
  console.log('NavBar user:', user);

  return (
    <nav className="flex h-16 min-h-16 justify-end border-t-2 pr-5">
      {user.data.user && (
        <NavBarLink text="" url="/auth/logout">
          <LogOut className="size-6" />
        </NavBarLink>
      )}
    </nav>
  );
}
