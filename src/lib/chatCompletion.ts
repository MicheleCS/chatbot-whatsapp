import { ChatCompletionRequestMessage } from "openai"
import { openai } from "./openai"

export async function completion(
  messages: ChatCompletionRequestMessage[]
): Promise<string | undefined> {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0,
    max_tokens: 256,
    messages
  })

  return completion.data.choices[0].message?.content
}