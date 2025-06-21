export function traduzirStatus(status: string): string {
  switch (status) {
    case "pending":
      return "Aguardando aprovação do prestador";
    case "accepted":
      return "Aceita";
    case "rejected":
      return "Rejeitada";
    case "in_progress":
      return "Em andamento";
    case "done":
    case "completed":
      return "Finalizada";
    case "cancelled":
    case "canceled":
      return "Cancelada";
    default:
      return status;
  }
}