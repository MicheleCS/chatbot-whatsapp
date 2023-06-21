import { prompt } from "../prompts/agent"

export function initPrompt(storeName: string, orderCode: string): string {
  return prompt
    .replace(/{{[\s]?storeName[\s]?}}/g, storeName) // aqui é onde substituímos o nome da loja - {{ storeName }}
    .replace(/{{[\s]?orderCode[\s]?}}/g, orderCode) // aqui é onde substituímos o código do pedido - {{ orderCode }}
}