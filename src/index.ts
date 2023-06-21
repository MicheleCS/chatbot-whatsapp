import { ChatCompletionRequestMessage } from "openai"
import { Message, Whatsapp, create } from "venom-bot"
import { config } from "./config"
import { openai } from "./lib/openai"

async function completion(
  messages: ChatCompletionRequestMessage[]
): Promise<string | undefined> {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0,
    max_tokens: 256,
    messages,
  })

  return completion.data.choices[0].message?.content
}

const customerChat: ChatCompletionRequestMessage[] = [
  {
    role: "system",
    content:
      "Você é uma assistente virtual de atedimento de emprestimo consignado da empresa VMD Credito. Você deve ser educada, atenciosa e sempre informar o cliente sobre o andamento do processo de cadastro."
  },
]

create({
  session: "chatbot-whatsapp",
  disableWelcome: true,
})
  .then(async (client: Whatsapp) => await start(client))
  .catch((err) => {
    console.log(err)
  })

async function start(client: Whatsapp) {
  client.onMessage(async (message: Message) => {
    if (!message.body || message.isGroupMsg) return

    customerChat.push({
      role: "user",
      content: message.body
    })

    console.log("message: ", message.body)

    const response = (await completion(customerChat)) || "Não entendi..."

    customerChat.push({
      role: "assistant",
      content: response
    })

    await client.sendText(message.from, response)
  })
}