import React, { useEffect, useState } from 'react';
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SettingsPage: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  // Initialize dark mode state based on document class or system preference could be added here
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial state
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = (checked: boolean) => {
    setIsDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">设置</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>通用设置</CardTitle>
            <CardDescription>管理您的应用显示和通知偏好。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium leading-none">系统通知</span>
                <span className="text-sm text-muted-foreground">
                  启用或禁用系统级推送通知。
                </span>
              </div>
              <Switch 
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
                aria-label="Toggle notifications"
              />
            </div>
            
            <div className="flex items-center justify-between space-x-2">
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium leading-none">暗黑模式</span>
                <span className="text-sm text-muted-foreground">
                   切换应用程序的明暗主题风格。
                </span>
              </div>
              <Switch 
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
                aria-label="Toggle dark mode"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
