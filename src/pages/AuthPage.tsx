import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/stores/authStore";
import { cn } from "@/lib/utils";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [activeTab, setActiveTab] = useState("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  // In a real app, you'd want to get the code from an email
  const [registerCode, setRegisterCode] = useState("123456"); 


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
    try {
      await register({
        username: registerUsername,
        email: registerEmail,
        password: registerPassword,
        code: registerCode, // This should be from user input
      });
      // On successful registration, switch to login tab and pre-fill email
      setLoginEmail(registerEmail);
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
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
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Input
                      id="password"
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
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
                    <Input
                      id="username"
                      placeholder="用户名"
                      required
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Input
                      id="password"
                      type="password"
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
  );
}