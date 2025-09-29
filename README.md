# RSS阅读器
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/bsqsbylt/rss-reader)
A minimalist, elegant, and fast RSS feed reader powered by Cloudflare Workers.
RSS阅读器 is a minimalist, elegant, and high-performance RSS feed reader designed for a serene and focused reading experience. Built entirely on the Cloudflare serverless stack, it leverages the edge network for unparalleled speed. The application features a clean, multi-panel interface: a sidebar for managing RSS subscriptions, a central panel for listing articles from a selected feed, and a main content area that provides a clutter-free, reader-mode view of the selected article. Users can effortlessly add, view, and remove their favorite RSS feeds. All subscription data is persistently stored using Cloudflare's Durable Objects, ensuring a seamless experience across sessions. The design philosophy is 'less is more', emphasizing typography, generous white space, and subtle micro-interactions to create a visually stunning and intuitive application.
## Key Features
- **Elegant Three-Panel Layout**: A responsive, resizable interface for managing feeds, browsing articles, and reading content.
- **Blazing Fast Performance**: Built on Cloudflare Workers and Durable Objects for edge-network speed.
- **Minimalist Design**: A clean, clutter-free UI with a focus on typography and readability.
- **Persistent Subscriptions**: Your feed list is saved and synced using Cloudflare Durable Objects.
- **CORS Handling**: A built-in server-side proxy fetches feeds, bypassing browser CORS restrictions.
- **Content Sanitization**: Article content is sanitized to prevent XSS vulnerabilities, ensuring a safe reading experience.
## Technology Stack
- **Frontend**: React, Vite, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide React, Framer Motion
- **State Management**: Zustand
- **Backend**: Hono on Cloudflare Workers
- **Storage**: Cloudflare Durable Objects
- **Tooling**: Bun, ESLint, Prettier
## Getting Started
Follow these instructions to get a local copy up and running for development and testing purposes.
### Prerequisites
- [Bun](https://bun.sh/) installed on your machine.
- A [Cloudflare account](https://dash.cloudflare.com/sign-up).
- The [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) authenticated with your Cloudflare account.
### Installation
1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd aura_reader
    ```
2.  **Install dependencies:**
    ```bash
    bun install
    ```
## Development
To run the application locally, which includes the Vite frontend development server and a local Wrangler instance for the backend worker, use the following command:
```bash
bun dev
```
This will start the development server, typically on `http://localhost:3000`. The frontend will automatically proxy API requests to the local worker instance.
## Deployment
Deploying RSS阅读器 to the Cloudflare global network is a single command.
1.  **Build and deploy the application:**
    ```bash
    bun run deploy
    ```
This command will build the React frontend, bundle the worker code, and deploy everything to your Cloudflare account using Wrangler.
Alternatively, you can deploy directly from your GitHub repository with a single click.
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/bsqsbylt/rss-reader)
## 部署指南 (Deployment Guide in Chinese)
将 RSS阅读器 部署到 Cloudflare 全球网络非常简单，只需一个命令。
1.  **构建并部署应用程序：**
    ```bash
    bun run deploy
    ```
此命令将构建 React 前端，打包 Worker 代码，并使用 Wrangler 将所有内容部署到您的 Cloudflare 帐户。
或者，您也可以一键从您的 GitHub 仓库直��部署。
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/bsqsbylt/rss-reader)
## Project Structure
-   `src/`: Contains the React frontend application.
    -   `pages/`: Main application views/pages.
    -   `components/`: Reusable React components.
    -   `store/`: Zustand state management stores.
    -   `lib/`: Utility functions, types, and mock data.
-   `worker/`: Contains the Hono backend application running on Cloudflare Workers.
    -   `index.ts`: The main worker entry point.
    -   `user-routes.ts`: API route definitions.
    -   `entities.ts`: Durable Object entity definitions.
-   `shared/`: TypeScript types and data shared between the frontend and backend.
## Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
## License
Distributed under the MIT License. See `LICENSE` for more information.