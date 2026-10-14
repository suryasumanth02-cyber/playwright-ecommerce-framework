export interface CustomerInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export interface OrderSummary {
  paymentInfo: string;
  shippingInfo: string;
  itemTotal: number;
  tax: number;
  total: number;
}

export interface OrderConfirmation {
  header: string;
  message: string;
}
