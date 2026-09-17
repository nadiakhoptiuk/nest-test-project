export interface ShopifyOrderWebhook {
  id: number;
  admin_graphql_api_id: string;
  name: string;
  order_number: number;
  email: string | null;
  contact_email: string | null;
  phone: string | null;
  currency: string;
  presentment_currency: string;
  subtotal_price: string | null;
  total_price: string | null;
  total_discounts: string | null;
  total_tax: string | null;
  total_shipping_price_set: ShopifyMoneySet | null;
  financial_status: string | null;
  fulfillment_status: string | null;
  cancel_reason: string | null;
  cancelled_at: string | null;
  confirmed: boolean;
  test: boolean;
  created_at: string;
  updated_at: string;
  processed_at: string | null;
  closed_at: string | null;
  customer: ShopifyOrderCustomer | null;
  line_items: ShopifyOrderLineItem[];
}

export interface ShopifyOrderCustomer {
  id: number;
  admin_graphql_api_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  state: string;
  verified_email: boolean;
  currency: string;
  default_address: ShopifyAddress | null;
}

export interface ShopifyOrderLineItem {
  id: number;
  admin_graphql_api_id: string;
  name: string;
  title: string;
  price: string;
  quantity: number;
  current_quantity: number;
  fulfillable_quantity: number;
  sku: string | null;
  product_id: number | null;
  variant_id: number | null;
  product_exists: boolean;
  requires_shipping: boolean;
  taxable: boolean;
  fulfillment_service: string | null;
  fulfillment_status: string | null;
  gift_card: boolean;
  variant_title: string | null;
  total_discount: string;
}

export interface ShopifyMoneySet {
  shop_money: ShopifyMoney;
  presentment_money: ShopifyMoney;
}

export interface ShopifyMoney {
  amount: string;
  currency_code: string;
}

export interface ShopifyAddress {
  first_name: string | null;
  last_name: string | null;

  address1: string | null;
  address2: string | null;

  city: string | null;
  province: string | null;
  province_code: string | null;

  country: string | null;
  country_code: string | null;

  zip: string | null;
  phone: string | null;

  company: string | null;
  name: string | null;
}

export interface OrderWebhookJobData {
  body: ShopifyOrderWebhook;
  topic: string;
  name: string;
}
