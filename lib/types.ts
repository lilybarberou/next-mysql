export type User = {
  me_id: number;
  me_role: number;
  me_email: string;
  me_name: string;
  me_firstname: string;
}

export type Purchase = {
  pu_id: number;
  pu_amount: number;
  pu_date: Date;
}