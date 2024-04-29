// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Cost = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  cost_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  cost_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CostsTableType = {
  id: string;
  project_name: string;
  employee_name: string;
  cost_per_hour: number;
  cost_currency: number;
}

export type FormattedCostsTable = {
  id: string;
  project_name: string;
  employee_name: string;
  cost_per_hour: number;
  cost_currency: number;
}

export type FormattedWorksTable = {
  id: string;
  project_name: string;
  employee_name: string;
  start_date: Date;
  end_date: Date;
  hours_per_day: string;
}

export type CostField = {
  id: string;
  project_name: string;
  employee_name: string;
  cost_per_hour: number;
};

export type ProjectField = {
  id: string;
  name: string;
};

export type EmployeeField = {
  id: string;
  name: string;
};

export type CostForm = {
  id: string;
  project_id: string;
  employee_id: string;
  cost_per_hour: number;
  cost_currency: 'INR' | 'EUR' | 'USD';
};
