export type User = {
  me_id: number;
  me_role: number;
  me_email: string;
  me_name: string;
  me_firstname: string;
}

export type Purchase = {
  pu_id: number;
  pu_label: string;
  pu_member: number;
  pu_amount: number;
  pu_date: string;
}

export type Contribution = {
  co_id: number;
  co_bonus: number;
  co_member: number;
  co_amount: number;
  co_date: string;
}

export type Role = {
  ro_id: number;
  ro_label: string;
  ro_amount: number;
}