<div align="center">
	<h1>EvComp (Frontend)
		<h4>Interface gráfica Web para o sistema de gestão e eventos computacionais (EvComp).</h4>
</div>

---

Este repositório contém o código-fonte do Frontend do sistema **EvComp**, construído em **React** e **Next.js**. O sistema provê toda a interface de usuário (UI) para participantes, coletores de presença e administradores, conectando-se diretamente à API do repositório Backend.

## Tecnologias a serem Instaladas

Para rodar o projeto localmente da forma mais fácil e limpa possível, você só precisa ter instalado na sua máquina:

- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Como Rodar o Projeto

Este projeto utiliza containers Docker para garantir que o ambiente seja idêntico em qualquer máquina e contornar erros de CORS. 

> **Atenção sobre a Ordem de Execução:** 
> O Backend (`EvComp`) **DEVE** ser inicializado **PRIMEIRO**, antes que você inicie este Frontend! O Next.js depende da rede interna criada pelo Backend para se comunicar via Proxy.

Para ligar a Interface Gráfica, siga os seguintes passos (após ter ligado o backend):

1. Abra o terminal e navegue até a pasta raiz deste repositório (`EvComp-Front`).
2. Execute o comando de inicialização do Docker Compose:

   ```bash
   docker compose up -d --build
   ```

3. O Docker fará o download das bibliotecas (NPM), fará a compilação de produção e iniciará o Frontend na porta `3000`.
4. Abra o seu navegador de preferência e acesse: [http://localhost:3000](http://localhost:3000)

## Estrutura do Repositório

- **src/app/**: Todas as páginas da aplicação divididas por rotas (Dashboard, Coletor, Admin).
- **src/components/**: Componentes React reutilizáveis de interface.
- **docker-compose.yml**: Orquestração do container do frontend e ligação na rede do backend.
- **Dockerfile**: Instruções de montagem otimizada (Multi-stage) da imagem do Frontend.
- **next.config.ts**: Configuração crucial de roteamento e Proxy reverso para evitar problemas de CORS com a API.

## Author ✨

<table>
	<tr>
		<td align="center">
			<a href="https://github.com/Gabriel-Ciriaco">
				<img src="https://avatars.githubusercontent.com/u/66225865" width="100px;" alt=""/>
				<br>
				<sub>
					<b>Gabriel C. de Carvalho</b>
				</sub>
		</td>
		<td align="center">
			<a href="https://github.com/Carol-Nunes">
				<img src="https://avatars.githubusercontent.com/u/18383333" width="100px;" alt=""/>
				<br>
				<sub>
					<b>Caroline N. Araujo</b>
				</sub>
		</td>
	</tr>
</table>

## Contribuição

Se você quiser contribuir para este projeto, sinta-se à vontade para fazer um fork, enviar um pull request com suas melhorias ou abrir uma *issue*, caso tenha alguma dúvida ou sugestão!

## Licença

Este projeto está licenciado sob a Licença GNU General Public License v3.0 - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
