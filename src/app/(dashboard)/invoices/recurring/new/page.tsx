import { redirect } from "next/navigation";

export default function NewRecurringInvoicePage() {
  redirect("/invoices/new?mode=recurring");
}

