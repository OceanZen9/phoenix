import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/stores/authStore";

import { LoginMascot } from "@/components/LoginMascot";

export default function AuthPage() {
  const { login, register } = useAuth();

  const [activeTab, setActiveTab] = useState("login");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  // In a real app, you'd want to get the code from an email
  const [registerCode] = useState("123456"); 


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({
        loginType: "password",
        email: loginEmail,
        password: loginPassword,
      });
      // navigate("/"); // Removed, PublicRoute will handle this.
    } catch (error) {
      console.error("Login failed", error);
      // Here you should show an error message to the user
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Attempting to register...");
    try {
      await register({
        username: registerUsername,
        email: registerEmail,
        password: registerPassword,
        verificationCode: registerCode, // This should be from user input
      });
      console.log("Registration API call successful");
      // On successful registration, switch to login tab and pre-fill email
      setLoginEmail(registerEmail);
      console.log("Setting active tab to login");
      setActiveTab("login");
      console.log("Registration successful, please login.");
      // In a real app, you would show a toast notification here.
    } catch (error) {
      console.error("Registration failed", error);
      // Here you should show an error message to the user
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-[400px] flex flex-col items-center">
        <LoginMascot focusedField={focusedField} />
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
         <TabsList className="grid w-full grid-cols-2">
           <TabsTrigger value="login">登录</TabsTrigger>
           <TabsTrigger value="register">注册</TabsTrigger>
         </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>登录</CardTitle>
              <CardDescription>
                输入您的凭据以访问您的帐户。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">邮箱</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">密码</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="请输入密码"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    登录
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>注册</CardTitle>
              <CardDescription>
                创建一个新帐户。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">用户名</Label>
                    <Input
                      id="username"
                      placeholder="用户名"
                      required
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="register-email">邮箱</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="register-password">密码</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="请输入密码"
                      required
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    注册
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}