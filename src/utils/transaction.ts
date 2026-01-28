import { BenjiConnectEventTransactionData } from "../types/event";
import { BenjiConnectTransactionData } from "../types/transaction";

export const mapEventToConnectTransactionData = (data?: BenjiConnectEventTransactionData): BenjiConnectTransactionData | null => {
    if (!data) return null;
    return {
        action: data.action,
        amount: data.amount,
        trigger_event_id: data.trigger_event_id,
        trigger_name: data.trigger_name
    };
}