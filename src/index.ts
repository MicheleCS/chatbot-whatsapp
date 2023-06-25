import { Message, Whatsapp, create } from "venom-bot"
import { initPrompt } from "./prompts/initPrompt"
import { redis } from "./lib/redis"
import {CustomerChat} from "./interfaces/customerChat"
import { completion } from "./lib/chatCompletion"
import { ChatCompletionRequestMessage } from "openai"
import { openai } from "./lib/openai"


create({
  session: "chatbot-whatsapp",
  disableWelcome: true,
})

.then(async (client: Whatsapp) => await start(client))
.catch((err) => {
  console.log(err)
})
console.log( "criou");

async function start(client: Whatsapp) {
  const storeName = 'VMD Credito'

  client.onMessage(async (message: Message) => {
    if (!message.body || message.isGroupMsg) return

    const customerPhone = `+${message.from.replace("@c.us", "")}`
    const customerName = message.author
    const customerKey = `customer:${customerPhone}:chat`
    const orderCode = `#sk-${("00000" + Math.random()).slice(-5)}`

    const lastChat = JSON.parse((await redis.get(customerKey)) || "{}")

    const customerChat: CustomerChat =
      lastChat?.status === "open"
        ? (lastChat as CustomerChat)
        : {
            status: "open",
            orderCode,
            chatAt: new Date().toISOString(),
            customer: {
              name: customerName,
              phone: customerPhone,
            },
            messages: [
              {
                role: "system",
                content: initPrompt(storeName, orderCode),
              },
            ],
            orderSummary: "",
          }

    console.debug(customerPhone, "Cliente:", message.body)

    customerChat.messages.push({
      role: "user",
      content: message.body,
    })

    const content =
      (await completion(customerChat.messages)) || "Desculpa, mas essas informações não são validas... "

    customerChat.messages.push({
      role: "assistant",
      content,
    })

    console.debug(customerPhone, "Atendente:", content)

    await client.sendText(message.from, content)

    if (
      customerChat.status === "open" &&
      content.match(customerChat.orderCode)
    ) {
      customerChat.status = "closed"

      customerChat.messages.push({
        role: "user",
        content:
          "Gere um resumo do cadastro como se fosse uma lista",
      })

      const content =
        (await completion(customerChat.messages)) || "Desculpa, mas essas informações não são validas... "

      console.debug(customerPhone, "Finalizando Cadastro:", content)

      customerChat.orderSummary = content
    }

    redis.set(customerKey, JSON.stringify(customerChat))
  })
}