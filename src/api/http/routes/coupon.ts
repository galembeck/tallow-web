import { API } from "@/api/connections/tallow";
import type {
  Coupon,
  CreateCouponDTO,
  CouponValidateResponse,
  UpdateCouponDTO,
} from "@/types/services/coupon";

export const couponModule = {
  async getAll(): Promise<Coupon[]> {
    return await API.fetch("/coupon/admin/all", {
      method: "GET",
    });
  },

  async create(data: CreateCouponDTO): Promise<Coupon> {
    return await API.fetch("/coupon/admin", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: UpdateCouponDTO): Promise<Coupon> {
    return await API.fetch(`/coupon/admin/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async toggle(id: string): Promise<Coupon> {
    return await API.fetch(`/coupon/admin/${id}/toggle`, {
      method: "PATCH",
    });
  },

  async validate(code: string): Promise<CouponValidateResponse> {
    return await API.fetch(`/coupon/validate/${encodeURIComponent(code)}`, {
      method: "GET",
    });
  },
};
