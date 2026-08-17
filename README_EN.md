# dsh-pelican 🐦

A pelican riding a bicycle along a seashore in the bottom-right corner of the DSH Web GUI — a static two-end (Host + Client) plugin that also shows the agent's working state.

- **Host half** (`lib/index.js`): listens to global agent events and keeps an `idle / thinking / done` state machine; exposes `GET /api/pelican/status` for the browser to poll; ships a `pelican_debug` tool.
- **Client half** (`lib/client.js`): an SVG cycling animation in the `shell.overlay` slot — while the agent is thinking the pelican says "我在呢，稍等～", and when a reply finishes it shows a "任务完成啦 🎉" bubble, plays a chime, and optionally sends a system notification.

## Install

Local path (no publishing needed):

```bash
dsh plugin --profile web add ./dsh-pelican
```

npm (published):

```bash
dsh plugin --profile web add dsh-pelican
```

GitHub:

```bash
dsh plugin --profile web add github:Little-Star888/dsh-pelican
```

Restart the dsh process after installing (this is a persistent static plugin, not a session-scoped dynamic plugin).

## State machine

| Event | State |
|---|---|
| User message (`agent/inbox/inserted`) | `thinking` |
| Reply wraps up (`agent/turn-stopping` / `agent/status: idle`) | `done` |
| No activity | `idle` |

Debug: the `pelican_debug` tool returns `state / seq / pendingAgentId / event counters`.

## License

MIT
