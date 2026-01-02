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
          nickname: profile.nickname || '',
          phone: profile.phone || '',
          avatar: profile.avatar || '',
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
    console.log("=== handleUpdate triggered ==="); // DEBUG
    console.log("FormData being submitted:", formData); // DEBUG
    setIsUpdating(true);
    setUpdateStatus(null);
    try {
      console.log("Sending PATCH request to /api/v1/users/profile..."); // DEBUG
      await updateUserProfile(formData);
      console.log("PATCH request successful. Refetching profile..."); // DEBUG
      
      // 重新获取用户信息以确保数据显示最新
      const profile = await getUserProfile();
      console.log("Refetched profile:", profile); // DEBUG
      setUserProfile(profile);
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
        nickname: userProfile.nickname || '',
        phone: userProfile.phone || '',
        avatar: userProfile.avatar || '',
      });
    }
    setIsEditMode(false);
  };

  const handleLogout = () => {
    logout();
  };

  const renderDisplayMode = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-4 mb-6">
        <label className="font-semibold min-w-16">头像</label>
        <Avatar className="h-16 w-16">
          <AvatarImage
            src={userProfile?.avatar || undefined}
            alt={userProfile?.nickname || userProfile?.username || '用户'}
          />
          <AvatarFallback>
            {(userProfile?.nickname || userProfile?.username || 'U').charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="grid gap-2">
        <label>用户名</label>
        <p className="font-semibold text-gray-500">{userProfile?.username}</p>
      </div>
      <div className="grid gap-2">
        <label>昵称</label>
        <p className="font-semibold">{userProfile?.nickname || '未设置'}</p>
      </div>
      <div className="grid gap-2">
        <label>手机号</label>
        <p className="font-semibold">{userProfile?.phone || '未设置'}</p>
      </div>
      <div className="grid gap-2">
        <label>邮箱</label>
        <p className="font-semibold text-gray-500">{userProfile?.email}</p>
      </div>
       <div className="grid gap-2">
        <label>角色</label>
        <p className="font-semibold text-gray-500">{userProfile?.role}</p>
      </div>
      <div className="grid gap-2">
        <label>加入时间</label>
        <p className="font-semibold text-gray-500">{userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleString() : '未知'}</p>
      </div>
      <Button onClick={() => setIsEditMode(true)} className="w-full">
        修改个人信息
      </Button>
    </div>
  );

  const renderEditMode = () => (
    <form onSubmit={handleUpdate} className="space-y-4">
      <div className="grid gap-2">
        <label htmlFor="avatar">头像 URL</label>
        <Input
          id="avatar"
          value={formData.avatar || ''}
          onChange={handleInputChange}
          placeholder="请输入头像图片链接"
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="nickname">昵称</label>
        <Input
          id="nickname"
          value={formData.nickname || ''}
          onChange={handleInputChange}
          placeholder="请输入昵称"
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="phone">手机号</label>
        <Input
          id="phone"
          value={formData.phone || ''}
          onChange={handleInputChange}
          placeholder="请输入手机号"
        />
      </div>
      {updateStatus === 'success' && (
        <p className="text-green-500">此人信息更新成功！</p>
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
                alt={userProfile?.username || '用户'}
              />
              <AvatarFallback>
                {(userProfile?.username || userProfile?.email || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <CardTitle className="text-2xl">{userProfile?.username || '用户'}</CardTitle>
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
