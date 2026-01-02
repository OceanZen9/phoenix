import React, { useEffect, useState } from "react";
import {
  getAddressList,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/services/address";
import type { Address, CreateAddressPayload } from "@/types/address";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
//   DialogTrigger, // Not used
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";
// Import simple Toast
import { Toast } from "@/components/ui/toast";

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentAddressId, setCurrentAddressId] = useState<number | null>(null);
  
  // Toast State
  const [toastState, setToastState] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });

  // Form State
  const [formData, setFormData] = useState<CreateAddressPayload>({
    receiverName: "",
    receiverPhone: "",
    province: "",
    city: "",
    district: "",
    detailAddress: "",
    zipCode: "",
    tag: "",
    isDefault: false,
  });

  const showToast = (message: string) => {
    setToastState({ show: true, message });
  };

  const closeToast = () => {
    setToastState((prev) => ({ ...prev, show: false }));
  };

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const data = await getAddressList();
      // Sort: Default address first
      const sorted = [...data].sort((a, b) =>
        a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1
      );
      setAddresses(sorted);
    } catch (error) {
      console.error("Failed to fetch addresses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
      setFormData((prev) => ({ ...prev, isDefault: checked }));
  }

  const resetForm = () => {
    setFormData({
      receiverName: "",
      receiverPhone: "",
      province: "",
      city: "",
      district: "",
      detailAddress: "",
      zipCode: "",
      tag: "",
      isDefault: false,
    });
    setIsEditMode(false);
    setCurrentAddressId(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (address: Address) => {
    setFormData({
      receiverName: address.receiverName,
      receiverPhone: address.receiverPhone,
      province: address.province,
      city: address.city,
      district: address.district,
      detailAddress: address.detailAddress,
      zipCode: address.zipCode,
      tag: address.tag,
      isDefault: address.isDefault,
    });
    setIsEditMode(true);
    setCurrentAddressId(address.id);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && currentAddressId) {
        await updateAddress(currentAddressId, formData);
        showToast("地址已更新");
      } else {
        await createAddress(formData);
        showToast("新地址已添加");
      }
      setIsDialogOpen(false);
      fetchAddresses();
    } catch (error) {
      console.error(error);
      showToast("操作失败，请重试");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定要删除这个地址吗？")) return;
    try {
      await deleteAddress(id);
      showToast("地址已删除");
      fetchAddresses();
    } catch (error) {
        console.error(error);
        showToast("删除失败");
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await setDefaultAddress(id);
      showToast("默认地址已设置");
      fetchAddresses();
    } catch (error) {
        console.error(error);
        showToast("设置默认地址失败");
    }
  };

  if (loading && addresses.length === 0) {
      return <div className="p-8 text-center">加载中...</div>
  }

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MapPin className="h-6 w-6" /> 我的地址
        </h1>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" /> 新增地址
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {addresses.map((address) => (
          <Card
            key={address.id}
            className={`relative transition-all hover:shadow-md ${
              address.isDefault ? "border-primary border-2 bg-primary/5" : ""
            }`}
          >

            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                 <Badge variant="outline">{address.tag}</Badge>
                 {address.isDefault && <Badge>默认</Badge>}
              </div>
            </CardHeader>
            <CardContent className="grid gap-1.5 text-sm pt-4">
              <div className="flex items-start gap-2">
                <span className="font-semibold min-w-[4rem] text-muted-foreground">收货人:</span>
                <span className="font-medium">{address.receiverName}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold min-w-[4rem] text-muted-foreground">手机号码:</span>
                <span className="font-medium">{address.receiverPhone}</span>
              </div>
              <div className="flex items-start gap-2">
                 <span className="font-semibold min-w-[4rem] text-muted-foreground">所在地区:</span>
                 <span className="font-medium">{address.province} {address.city} {address.district}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold min-w-[4rem] text-muted-foreground">详细地址:</span>
                <span className="font-medium">{address.detailAddress}</span>
              </div>
               <div className="flex items-start gap-2">
                <span className="font-semibold min-w-[4rem] text-muted-foreground">邮政编码:</span>
                <span className="font-medium">{address.zipCode}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
                {!address.isDefault && (
                    <Button variant="ghost" size="sm" onClick={() => handleSetDefault(address.id)}>
                        设为默认
                    </Button>
                )}
               <div className="flex gap-2 ml-auto">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(address)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(address.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
               </div>
            </CardFooter>
          </Card>
        ))}
        {addresses.length === 0 && !loading && (
            <div className="col-span-full text-center py-12 text-gray-500 border-2 border-dashed rounded-lg">
                <p>暂无地址，请添加新地址</p>
            </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "编辑地址" : "新增地址"}</DialogTitle>
            <DialogDescription>
              请填写真实的收货信息以确保商品准确送达。
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="receiverName">收货人姓名</Label>
                <Input
                  id="receiverName"
                  value={formData.receiverName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="receiverPhone">手机号码</Label>
                <Input
                  id="receiverPhone"
                  value={formData.receiverPhone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
             <div className="grid grid-cols-3 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="province">省份</Label>
                 <Input
                  id="province"
                  placeholder="省"
                  value={formData.province}
                  onChange={handleInputChange}
                  required
                />
              </div>
               <div className="grid gap-2">
                <Label htmlFor="city">城市</Label>
                 <Input
                  id="city"
                  placeholder="市"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
               <div className="grid gap-2">
                <Label htmlFor="district">区/县</Label>
                 <Input
                  id="district"
                  placeholder="区"
                  value={formData.district}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="detailAddress">详细地址</Label>
              <Input
                id="detailAddress"
                placeholder="街道门牌、楼层房间号等信息"
                value={formData.detailAddress}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                 <div className="grid gap-2">
                    <Label htmlFor="zipCode">邮政编码</Label>
                    <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="tag">地址标签</Label>
                    <Input
                        id="tag"
                        placeholder="例如：家、公司"
                        value={formData.tag}
                        onChange={handleInputChange}
                        required
                    />
                </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                    id="isDefault" 
                    checked={formData.isDefault}
                    onCheckedChange={(checked) => handleCheckboxChange(checked as boolean)}
                />
                <label
                    htmlFor="isDefault"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    设为默认地址
                </label>
            </div>

            <DialogFooter className="mt-4">
              <Button type="submit">{isEditMode ? "保存此地址" : "保存并使用"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Toast 
        message={toastState.message}
        show={toastState.show}
        onClose={closeToast}
      />
    </div>
  );
}
