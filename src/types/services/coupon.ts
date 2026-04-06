export interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateCouponDTO {
  code: string;
  discountPercentage: number;
}

export interface UpdateCouponDTO {
  code: string;
  discountPercentage: number;
}

export interface CouponValidateResponse {
  isValid: boolean;
  code?: string;
  discountPercentage?: number;
  message?: string;
}
