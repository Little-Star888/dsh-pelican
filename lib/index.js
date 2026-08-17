// 鹈鹕环海骑行 —— 主机半（静态插件）
// 职责：监听全局代理事件，维护 thinking/done 状态机；暴露 HTTP 端点给浏览器轮询；
//       附带 pelican_debug 调试工具。
export const name = 'pelican-sea-ride'
export const inject = ['timer', 'webServer']

export function apply(ctx) {
  let state = 'idle'
  let seq = 0
  let pendingAgentId = null
  let lastActivity = Date.now()
  const counters = { inbox: 0, stopping: 0, status: 0 }

  const touch = (next) => {
    state = next
    seq++
    lastActivity = Date.now()
  }

  // 用户发消息 → thinking
  ctx.on('agent/inbox/inserted', (payload) => {
    const msg = payload && payload.message
    if (msg && msg.source && msg.source.kind === 'user') {
      counters.inbox++
      pendingAgentId = payload && payload.agent && typeof payload.agent.id === 'string' ? payload.agent.id : null
      touch('thinking')
    }
  }, { global: true })

  // 回复收尾（序列模式下模型不再欠回复）→ done
  ctx.on('agent/turn-stopping', (payload) => {
    const id = payload && payload.agent && payload.agent.id
    counters.stopping++
    if (state === 'thinking' && pendingAgentId !== null && id === pendingAgentId) touch('done')
  }, { global: true })

  // idle 兜底
  ctx.on('agent/status', (payload) => {
    const id = payload && payload.agent && payload.agent.id
    const status = payload && payload.status
    counters.status++
    if (state === 'thinking' && pendingAgentId !== null && id === pendingAgentId && status === 'idle') touch('done')
  }, { global: true })

  // 浏览器轮询用的状态端点
  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: '/api/pelican/status',
    handler: (req, res) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405)
        res.end()
        return
      }
      const body = JSON.stringify({ state, seq })
      res.writeHead(200, {
        'content-type': 'application/json',
        'cache-control': 'no-cache'
      })
      res.end(body)
    }
  }), 'pelican-sea-ride: status route')

  // 可选调试工具：失败不影响主逻辑
  try {
    const tools = ctx.get('tools')
    if (tools !== undefined && typeof tools.register === 'function') {
      const tool = {
        name: 'pelican_debug',
        description: '查鹈鹕环海骑行插件主机状态机：返回 state(idle/thinking/done)、seq、pendingAgentId 与事件计数，用于排查「任务完成啦」是否触发。',
        parameters: {},
        execute: async () => ({
          state,
          seq,
          pendingAgentId: pendingAgentId === null ? '' : pendingAgentId,
          inbox: counters.inbox,
          stopping: counters.stopping,
          status: counters.status
        }),
        output: {
          schema: {
            type: 'object',
            additionalProperties: true,
            properties: {
              state: { type: 'string' },
              seq: { type: 'number' },
              pendingAgentId: { type: 'string' },
              inbox: { type: 'number' },
              stopping: { type: 'number' },
              status: { type: 'number' }
            }
          },
          render: (args, value) => [{ type: 'text', text: JSON.stringify(value) }]
        }
      }
      ctx.effect(() => {
        try { return tools.register(tool) } catch (e) { return () => {} }
      })
    }
  } catch (e) {
    // 可选工具注册失败不致命
  }
}
