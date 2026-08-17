# dsh-pelican 🐦

鹈鹕环海骑行 —— 右下角 SVG 骑行动画 + 全局任务状态提示的 DSH Web 静态双端插件。

- **主机半**（`lib/index.js`）：监听全局代理事件，维护 `idle / thinking / done` 状态机；暴露 `GET /api/pelican/status` 供浏览器轮询；附带 `pelican_debug` 调试工具。
- **客户端半**（`lib/client.js`）：右下角 `shell.overlay` 里的 SVG 骑行动画，任务思考时鹈鹕说话「我在呢，稍等～」，任务完成时弹「任务完成啦 🎉」气泡 + 提示音 + 可选系统通知。

## 安装

本地路径（无需发布）：

```bash
dsh plugin --profile web add ./dsh-pelican
```

npm（需先发布）：

```bash
dsh plugin --profile web add dsh-pelican
```

GitHub（需先推送仓库）：

```bash
dsh plugin --profile web add github:<owner>/dsh-pelican
```

安装后重启 dsh 进程生效（本插件常驻磁盘，不是会话内动态插件）。

## 状态机制

| 事件 | 状态 |
|---|---|
| 用户发消息（`agent/inbox/inserted`） | `thinking` |
| 回复收尾（`agent/turn-stopping` / `agent/status: idle`） | `done` |
| 无活动 | `idle` |

调试：`pelican_debug` 工具返回 `state / seq / pendingAgentId / 事件计数`。

## License

MIT
