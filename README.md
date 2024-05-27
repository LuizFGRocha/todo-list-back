# To Do List Back

Back end de um aplicativo de gestão de listas de tarefas.

## Tecnologias

- Express.js
- MongoDB

## Ambiente de desenvolvimento

- Windows 11 com WSL Ubuntu 20.04.6.
- Node.js 21.7.1.
- npm 10.5.0.
- O aplicativo foi testado no Chrome, no Edge e no Firefox.

## Features

- O usuário possui uma conta que salva seus dados.
- O usuário pode criar listas de tarefas.
- Cada lista de tarefas possui título, data limite, descrição e tarefas.
- Cada tarefa possui um título e pode estar ou não concluída.

## Instruções para execução

Para executar o back end do aplicativo, certifique-se de ter Node.js e npm instalados.

Além disso, é necessário criar um arquivo .env e definir o URI do banco MongoDB a ser utilizado, 
a porta a ser utilizada e um segredo para o JWT (alguma string de caracteres). Para esse projeto, 
utilizei a free tier do MongoDB Atlas.

Feito isso, entre os seguintes comandos na raiz do projeto:

```
npm i
npm start
```

O aplicativo ficará disponível na porta escolhida do host local.

## Aplicativo no ar

Foi realizado o deploy do aplicativo na Azure. Ele está acessível pelo seguinte link:

[https://jolly-rock-0c17fe50f.5.azurestaticapps.net/](https://jolly-rock-0c17fe50f.5.azurestaticapps.net/)
