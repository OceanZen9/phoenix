import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/stores/authStore';
import { getUserProfile, updateUserProfile } from '@/services/user';
import type { UserProfile, UpdateProfilePayload } from '@/types/user';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const UserPage: React.FC = () => {
  const { logout } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UpdateProfilePayload>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'success' | 'error' | null>(
    null
  );
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const profile = await getUserProfile();
        setUserProfile(profile);
        setFormData({
          username: profile.username,
          email: profile.email,
        });
      } catch (err) {
        setError('获取用户信息失败，请稍后再试。');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateStatus(null);
    try {
      const updatedProfile = await updateUserProfile(formData);
      setUserProfile(updatedProfile);
      setUpdateStatus('success');
      setIsEditMode(false); // Switch back to display mode on success
    } catch (err) {
      setUpdateStatus('error');
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset form data to the original profile data
    if (userProfile) {
      setFormData({
        username: userProfile.username,
        email: userProfile.email,
      });
    }
    setIsEditMode(false);
  };

  const handleLogout = () => {
    logout();
  };

  const renderDisplayMode = () => (
    <div className="space-y-4">
      <div className="grid gap-2">
        <label>用户名</label>
        <p className="font-semibold">{userProfile?.username}</p>
      </div>
      <div className="grid gap-2">
        <label>邮箱</label>
        <p className="font-semibold">{userProfile?.email}</p>
      </div>
      <div className="grid gap-2">
        <label>角色</label>
        <p className="font-semibold">{userProfile?.role}</p>
      </div>
      <div className="grid gap-2">
        <label>地址</label>
        <p className="font-semibold">{userProfile?.address || '未设置'}</p>
      </div>
      <div className="grid gap-2">
        <label>加入时间</label>
        <p className="font-semibold">{new Date(userProfile!.createdAt).toLocaleString()}</p>
      </div>
      <Button onClick={() => setIsEditMode(true)} className="w-full">
        修改信息
      </Button>
    </div>
  );

  const renderEditMode = () => (
    <form onSubmit={handleUpdate} className="space-y-4">
      <div className="grid gap-2">
        <label htmlFor="username">用户名</label>
        <Input
          id="username"
          value={formData.username}
          onChange={handleInputChange}
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="email">邮箱</label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
        />
      </div>
      {updateStatus === 'success' && (
        <p className="text-green-500">用户信息更新成功！</p>
      )}
      {updateStatus === 'error' && (
        <p className="text-red-500">更新失败，请稍后再试。</p>
      )}
      <div className="flex space-x-2">
        <Button type="submit" className="flex-1" disabled={isUpdating}>
          {isUpdating ? '正在保存...' : '保存更改'}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={handleCancelEdit}
        >
          取消
        </Button>
      </div>
    </form>
  );

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={userProfile?.avatar || undefined}
                alt={userProfile?.username}
              />
              <AvatarFallback>
                {userProfile?.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <CardTitle className="text-2xl">{userProfile?.username}</CardTitle>
              <CardDescription>用户ID: {userProfile?.userId}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading && <p>正在加载用户信息...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {userProfile && (
            <>
              {isEditMode ? renderEditMode() : renderDisplayMode()}
              <Button onClick={handleLogout} variant="outline" className="w-full mt-4">
                退出登录
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPage;
