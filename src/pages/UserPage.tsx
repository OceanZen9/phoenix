import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/stores/authStore';

const UserPage: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    // No need to navigate, ProtectedRoute will automatically redirect
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold">个人中心</h1>
      <p className="mt-4">这里是用户的个人中心页面。</p>
      <Button onClick={handleLogout} className="mt-6">
        退出登录
      </Button>
    </div>
  );
};

export default UserPage;
