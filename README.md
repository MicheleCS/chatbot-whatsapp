# ChatBot Whatsapp

- Bot de cadastro por Whatsapp utilizando modelo GPT da OpenAI.
- O bot utiliza o modelo GPT da OpenAI para gerar respostas para as perguntas dos usuários simulando um atendimento humano. Este atendimento é feito através do WhatsApp utilizando o [Venom](https://github.com/orkestral/venom).

# Instalar as dependências do projeto:

npm install
-Executar o bot:

npm run dev

- Banco de dados:
 Banco de dados Redis- NoSQL. Se não possuir o Redis instalado no seu computador, poderá utilizar o Docker para subir um container com o Redis através do docker-compose:


docker-compose up -d


- ChatGPT
Você irá precisar também de uma conta e API Key no [OpenAI](https://platform.openai.com/account/api-keys).

Criar um arquivo `.env` na raiz do projeto, de acordo com o .env.exemplo


OBS: Após rodar a aplicação no terminal vai aparecer um QR code, conecte seu whatsapp nesse QR Code. Outra pessoas deve te mandar msg, assim o Chatbot vai responder.