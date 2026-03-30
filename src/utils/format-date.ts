export function formatDate(dateStr?: string | null) {
  if (!dateStr) return "—";
  return format(new Date(dateStr), "dd/MM/yyyy HH:mm");
}
