export interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  isActive: boolean;
  usageCount: number;
  expiresAt?: string | null;
  createdAt: string;
}

export interface CreateCouponDTO {
  code: string;
  discountPercentage: number;
  expiresAt?: string | null;
}

export interface UpdateCouponDTO {
  code: string;
  discountPercentage: number;
  expiresAt?: string | null;
}

export interface CouponValidateResponse {
  isValid: boolean;
  code?: string;
  discountPercentage?: number;
  message?: string;
}
