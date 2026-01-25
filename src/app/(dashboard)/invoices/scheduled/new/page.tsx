import { redirect } from "next/navigation";

export default function NewScheduledInvoicePage() {
  redirect("/invoices/new?mode=scheduled");
}

