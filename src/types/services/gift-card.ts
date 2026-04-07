export type GiftCardStatus = 'PENDING' | 'ACTIVE' | 'USED' | 'EXPIRED' | 'CANCELLED';

export interface GiftCard {
  id: string;
  amount: number;
  status: GiftCardStatus;
  expiresAt: string;
  purchasedAt: string;
  usedAt?: string | null;
  usedOnOrderId?: string | null;
  // Payment info (only present when status = PENDING)
  pixQrCode?: string | null;
  pixQrCodeBase64?: string | null;
  pixCopyPaste?: string | null;
  paymentExpiresAt?: string | null;
  // Admin only
  buyerName?: string | null;
  buyerEmail?: string | null;
}

export interface PurchaseGiftCardDTO {
  amount: number;
  paymentType: 'PIX' | 'CREDIT_CARD' | 'BOLETO';
  payer: {
    email: string;
    firstName?: string;
    lastName?: string;
    identification?: { type: string; number: string };
  };
  token?: string;
  paymentMethodId?: string;
  installments?: number;
  issuerId?: number;
  dateOfExpiration?: string;
  description?: string;
}

export interface InitiateGiftCardDTO {
  amount: number;
}

export interface PayGiftCardDTO {
  paymentType: 'PIX' | 'CREDIT_CARD' | 'BOLETO';
  token?: string | null;
  installments?: number | null;
  issuerId?: string | null;
  paymentMethodId?: string | null;
  payer: {
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    identification?: { type: string; number: string } | null;
  };
  dateOfExpiration?: string | null;
}
