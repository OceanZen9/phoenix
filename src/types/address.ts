export interface Address {
  id: number;
  receiverName: string;
  receiverPhone: string;
  province: string;
  city: string;
  district: string;
  detailAddress: string;
  zipCode: string;
  isDefault: boolean;
  tag: string;
}

export interface CreateAddressPayload {
  receiverName: string;
  receiverPhone: string;
  province: string;
  city: string;
  district: string;
  detailAddress: string;
  zipCode: string;
  isDefault: boolean;
  tag: string;
}

export interface UpdateAddressPayload {
  receiverName: string;
  receiverPhone: string;
  province: string;
  city: string;
  district: string;
  detailAddress: string;
  zipCode: string;
  isDefault: boolean;
  tag: string;
}
