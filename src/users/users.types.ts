export interface ShopifyCustomerWebhook {
  id: number;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  verified_email: boolean;
  state: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerWebhookJobData {
  body: ShopifyCustomerWebhook;
  topic: string;
  name: string;
}
