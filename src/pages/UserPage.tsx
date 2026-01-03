import React, { useEffect, useState, useRef } from 'react';
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
import { Upload } from 'lucide-react';

const UserPage: React.FC = () => {
  const authStore = useAuth();
  const { logout, updateUser } = authStore;
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UpdateProfilePayload>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'success' | 'error' | null>(
    null
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

        updateUser(profile);
        console.log("Synced authStore with complete profile on mount");
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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUpdateStatus('error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = 280;
        canvas.height = 280;

        const size = Math.min(img.width, img.height);
        const x = (img.width - size) / 2;
        const y = (img.height - size) / 2;

        ctx.drawImage(img, x, y, size, size, 0, 0, 280, 280);

        const base64 = canvas.toDataURL('image/jpeg', 0.9);

        setAvatarPreview(base64);
        setFormData((prev) => ({ ...prev, avatar: base64 }));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("=== handleUpdate triggered ===");
    console.log("FormData being submitted:", formData);
    setIsUpdating(true);
    setUpdateStatus(null);
    try {
      console.log("Sending PATCH request to /api/v1/users/profile...");
      await updateUserProfile(formData);
      console.log("PATCH request successful. Refetching profile...");

      const profile = await getUserProfile();
      console.log("Refetched profile:", profile);
      setUserProfile(profile);

      updateUser(profile);
      console.log("Updated authStore with new profile");

      setUpdateStatus('success');
      setAvatarPreview(null);
      setIsEditMode(false);
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
    setAvatarPreview(null);
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
        <label>头像</label>
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={avatarPreview || userProfile?.avatar || undefined}
              alt="头像预览"
            />
            <AvatarFallback>
              {(userProfile?.nickname || userProfile?.username || 'U').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              上传头像
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              支持JPG、PNG格式
            </p>
          </div>
        </div>
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
