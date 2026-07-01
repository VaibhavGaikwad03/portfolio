import { useEffect, useRef, useState } from 'react'
import './App.css'

type Project = {
  id: string
  index: string
  title: string
  category: string
  summary: string
  metrics: [string, string][]
  stack: string[]
  challenge: string
  solution: string
  architecture: string[]
  repo?: string
}

type GitHubRepo = {
  name: string
  full_name: string
  description: string | null
  fork: boolean
  language: string | null
  html_url: string
  created_at: string
  pushed_at: string | null
  updated_at: string
  size: number
}

type GitHubStats = {
  repoCount: number
  totalCommits: number
  totalCommitsEstimated: boolean
  activeProjects: number
  longestMaintainedProject: string
  heatLevels: number[]
  repos: GitHubRepo[]
}

const projects: Project[] = [
  {
    id: 'remote-desktop',
    index: '01',
    title: 'Remote Desktop System',
    category: 'SYSTEMS PROGRAMMING / NETWORKING',
    summary:
      'Building a high-performance remote desktop application enabling real-time screen streaming, remote input control, and low-latency communication across machines.',
    metrics: [['low latency', 'communication'], ['real-time', 'screen streaming'], ['remote input', 'synchronization'], ['multithreaded', 'processing']],
    stack: ['C++', 'Win32 API', 'TCP/IP', 'Multithreading', 'Synchronization Primitives', 'Networking'],
    challenge: 'Stream a remote machine interactively while keeping capture, compression, network transfer, and user input synchronized under tight latency pressure.',
    solution:
      'Designed a custom TCP/IP protocol with separated input and frame channels, multithreaded processing, compression-aware streaming, and explicit synchronization around shared frame state.',
    architecture: ['Remote Client', 'Input Channel', 'Network Layer', 'Remote Host', 'Screen Capture', 'Compression', 'Frame Streaming'],
  },
  {
    id: 'bingo',
    index: '02',
    title: 'Bingo Server',
    category: 'NETWORKING / CONCURRENCY',
    summary:
      'A high-performance C++ WebSocket chat server with thread-safe message routing and persistent storage.',
    metrics: [['500+', 'sessions'], ['thread-safe', 'routing'], ['MySQL', 'persistence']],
    stack: ['C++', 'WebSocket', 'Multithreading', 'MySQL'],
    challenge: 'Keep chat sessions responsive while hundreds of clients produce bursty concurrent traffic.',
    solution:
      'Separated connection I/O from message routing, guarded shared state carefully, and persisted session data through MySQL.',
    architecture: ['WebSocket Clients', 'Connection Layer', 'Message Router', 'Worker Threads', 'MySQL Store'],
    repo: 'https://github.com/VaibhavGaikwad03/Bingo-Server',
  },
  {
    id: 'cuda',
    index: '03',
    title: 'CUDA VFX Engine',
    category: 'GPU COMPUTE / VIDEO',
    summary:
      'A GPU-accelerated real-time video effects engine for per-pixel grayscale, sepia, and hue-shift operations on 1080p frames.',
    metrics: [['~20x', 'CPU speedup'], ['1080p', 'frames'], ['per-pixel', 'kernels']],
    stack: ['CUDA', 'C++', 'GPU Kernels', 'Video Processing'],
    challenge: 'Apply pixel effects fast enough for interactive video without letting CPU-side loops dominate frame time.',
    solution:
      'Moved embarrassingly parallel per-pixel work into CUDA kernels and structured the pipeline around GPU-friendly memory access.',
    architecture: ['Frame Input', 'Device Buffer', 'CUDA Kernel', 'Pixel Transform', 'Frame Output'],
    repo: 'https://github.com/VaibhavGaikwad03/cuda-vfx',
  },
  {
    id: 'vfs',
    index: '04',
    title: 'Customized Virtual File System',
    category: 'SYSTEMS / STORAGE',
    summary:
      'A Linux-like user-space file system built in C with custom inode and block structures simulating a standalone storage device.',
    metrics: [['800MB', 'virtual disk'], ['C', 'implementation'], ['inode', 'metadata']],
    stack: ['C', 'UNIX Concepts', 'Inodes', 'Block Storage'],
    challenge: 'Represent files, metadata, allocation, and lookup behavior without relying on the host file system abstraction.',
    solution:
      'Modeled a virtual disk with explicit inode/block metadata so file operations can be inspected at the storage-structure level.',
    architecture: ['CLI', 'VFS API', 'Inode Table', 'Block Bitmap', 'Virtual Disk'],
    repo: 'https://github.com/VaibhavGaikwad03/Customized-Virtual-File-System',
  },
  {
    id: 'ethercat',
    index: '05',
    title: 'Real-Time EtherCAT Services',
    category: 'INDUSTRIAL / REAL-TIME C++',
    summary:
      'R&D on real-time C++ EtherCAT services for industrial machine communication and factory automation actuator control.',
    metrics: [['~4 ms', 'cycle time'], ['C#/.NET', 'monitoring'], ['factory', 'automation']],
    stack: ['C++', 'EtherCAT', 'C#', '.NET WPF'],
    challenge: 'Coordinate industrial actuators where communication timing, reliability, and operator visibility matter together.',
    solution:
      'Build low-level C++ communication services alongside C# tools for configuring, running, and monitoring automation systems.',
    architecture: ['Actuators', 'EtherCAT Service', 'Cycle Scheduler', 'Telemetry', 'C# Control UI'],
  },
]

const skills = [
  ['LANGUAGES', 'C', 'C++', 'C#', 'x86 GNU Assembly', 'JavaScript'],
  ['SYSTEMS', 'Multithreading', 'Mutexes', 'Condition Variables', 'Lock-Free Queues', 'UNIX'],
  ['GRAPHICS', 'OpenGL', 'OpenGL ES', 'WebGL', 'DirectX 11', 'Real-Time Rendering'],
  ['NETWORKING', 'TCP / UDP', 'Sockets', 'WebSockets', 'Protocols', 'Backpressure'],
  ['PERFORMANCE', 'Profiling', 'Latency Reduction', 'CUDA', 'Data Layout', 'GPU Acceleration'],
  ['TOOLS', 'Qt', '.NET WPF', 'MySQL', 'STL', 'Linux / Windows'],
]

const fallbackGitHubStats: GitHubStats = {
  repoCount: 24,
  totalCommits: 850,
  totalCommitsEstimated: true,
  activeProjects: 8,
  longestMaintainedProject: 'Bingo Server',
  heatLevels: Array.from({ length: 84 }, (_, i) => ((i * 19 + Math.floor(i / 7) * 11) % 5)),
  repos: [],
}

const featuredRepos = [
  ['Bingo Server', 'Concurrent WebSocket messaging service', 'C++', 'Socket I/O and thread-safe routing'],
  ['CUDA Video Processor', 'GPU-accelerated frame effects pipeline', 'CUDA / C++', 'Per-pixel kernels and memory movement'],
  ['Virtual File System', 'User-space inode and block storage model', 'C', 'Storage structures and metadata lookup'],
  ['Remote Desktop System', 'Low-latency remote screen and input bridge', 'C++ / Win32', 'Streaming protocol and synchronization'],
]

const repoAliases: Record<string, string[]> = {
  'Bingo Server': ['bingo-server'],
  'CUDA Video Processor': ['cuda-vfx', 'cuda-video-processor'],
  'Virtual File System': ['customized-virtual-file-system', 'virtual-file-system'],
  'Remote Desktop System': ['remote-desktop-system', 'remote-desktop'],
}

const activityLog = [
  ['COMMIT', 'Optimized socket communication'],
  ['PROJECT', 'Implemented lock-free queue'],
  ['RESEARCH', 'Explored frame compression pipeline'],
  ['SYSTEM', 'Improved thread synchronization'],
]

function useCanvasNetwork(canvasRef: React.RefObject<HTMLCanvasElement | null>, lowPower: boolean) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let frame = 0
    let width = 0
    let height = 0
    let mouseX = 0
    let mouseY = 0
    let last = 0
    const reduced = lowPower || matchMedia('(prefers-reduced-motion: reduce)').matches
    const nodes = Array.from({ length: 46 }, (_, i) => ({
      x: ((i * 83) % 997) / 997,
      y: ((i * 47) % 811) / 811,
      vx: Math.sin(i * 1.7) * 0.000035,
      vy: Math.cos(i * 2.1) * 0.000035,
      phase: i * 0.71,
    }))

    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 1.5)
      width = innerWidth
      height = innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const pointer = (event: PointerEvent) => {
      mouseX = (event.clientX / width - 0.5) * 12
      mouseY = (event.clientY / height - 0.5) * 12
    }
    const draw = (time: number) => {
      if (time - last < 32 && !reduced) {
        frame = requestAnimationFrame(draw)
        return
      }
      last = time
      ctx.clearRect(0, 0, width, height)
      ctx.strokeStyle = 'rgba(255,255,255,.022)'
      ctx.lineWidth = 1
      for (let x = 0; x < width; x += 80) {
        ctx.beginPath()
        ctx.moveTo(x + mouseX * 0.12, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += 80) {
        ctx.beginPath()
        ctx.moveTo(0, y + mouseY * 0.12)
        ctx.lineTo(width, y)
        ctx.stroke()
      }
      nodes.forEach((node, i) => {
        if (!reduced) {
          node.x = (node.x + node.vx + 1) % 1
          node.y = (node.y + node.vy + 1) % 1
        }
        const x = node.x * width + mouseX * (0.08 + (i % 4) * 0.025)
        const y = node.y * height + mouseY * (0.08 + (i % 3) * 0.025)
        nodes.slice(i + 1).forEach((other) => {
          const ox = other.x * width
          const oy = other.y * height
          const distance = Math.hypot(x - ox, y - oy)
          if (distance < 145) {
            ctx.strokeStyle = `rgba(0,229,255,${(1 - distance / 145) * 0.09})`
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(ox, oy)
            ctx.stroke()
          }
        })
        ctx.fillStyle = `rgba(0,229,255,${0.18 + Math.sin(time * 0.001 + node.phase) * 0.08})`
        ctx.fillRect(x, y, 1.5, 1.5)
      })
      frame = requestAnimationFrame(draw)
    }
    resize()
    addEventListener('resize', resize)
    addEventListener('pointermove', pointer, { passive: true })
    frame = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener('resize', resize)
      removeEventListener('pointermove', pointer)
    }
  }, [canvasRef, lowPower])
}

function parseLastPage(linkHeader: string | null) {
  if (!linkHeader) return null
  const last = linkHeader.split(',').find(part => part.includes('rel="last"'))
  const page = last?.match(/[?&]page=(\d+)/)?.[1]
  return page ? Number(page) : null
}

function formatStat(value: number, estimated = false) {
  const formatted = value >= 1000 ? `${(value / 1000).toFixed(1).replace('.0', '')}K` : String(value).padStart(value < 10 ? 2 : 1, '0')
  return estimated ? `${formatted}+` : formatted
}

function friendlyRepoName(name: string) {
  return name
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase())
    .replace(/\bCuda\b/, 'CUDA')
    .replace(/\bVfx\b/, 'VFX')
}

function buildHeatLevels(repos: GitHubRepo[]) {
  const buckets = Array.from({ length: 84 }, () => 0)
  const now = Date.now()
  const day = 86_400_000
  repos.forEach((repo, index) => {
    const pushed = repo.pushed_at ? new Date(repo.pushed_at).getTime() : new Date(repo.updated_at).getTime()
    const age = Math.floor((now - pushed) / day)
    if (age >= 0 && age < buckets.length) {
      buckets[buckets.length - 1 - age] += 2 + (repo.size > 1000 ? 1 : 0)
    }
    const created = new Date(repo.created_at).getTime()
    const createdAge = Math.floor((now - created) / day)
    if (createdAge >= 0 && createdAge < buckets.length) {
      buckets[buckets.length - 1 - createdAge] += 1
    }
    buckets[(index * 7) % buckets.length] += repo.fork ? 0 : 1
  })
  const max = Math.max(1, ...buckets)
  return buckets.map(value => Math.min(4, Math.ceil((value / max) * 4)))
}

function useGitHubStats(username: string) {
  const [stats, setStats] = useState<GitHubStats>(fallbackGitHubStats)
  const [status, setStatus] = useState<'cached' | 'live' | 'fallback'>('fallback')

  useEffect(() => {
    const cacheKey = `github-activity:${username}`
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as { savedAt: number; stats: GitHubStats }
        if (Date.now() - parsed.savedAt < 3_600_000) {
          setStats(parsed.stats)
          setStatus('cached')
          return
        }
        setStats(parsed.stats)
        setStatus('cached')
      } catch {
        localStorage.removeItem(cacheKey)
      }
    }

    const controller = new AbortController()
    const headers = { Accept: 'application/vnd.github+json' }

    async function load() {
      try {
        const userResponse = await fetch(`https://api.github.com/users/${username}`, { headers, signal: controller.signal })
        if (!userResponse.ok) throw new Error('GitHub user request failed')
        const user = await userResponse.json() as { public_repos?: number }

        const repoResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers, signal: controller.signal })
        if (!repoResponse.ok) throw new Error('GitHub repo request failed')
        const repos = (await repoResponse.json() as GitHubRepo[]).filter(repo => !repo.fork)
        const activeSince = Date.now() - 1000 * 60 * 60 * 24 * 365
        const activeProjects = repos.filter(repo => new Date(repo.pushed_at || repo.updated_at).getTime() >= activeSince).length
        const longest = repos
          .filter(repo => repo.pushed_at)
          .sort((a, b) => (Date.now() - new Date(a.created_at).getTime()) - (Date.now() - new Date(b.created_at).getTime()))
          .at(-1)

        const commitCounts = await Promise.all(
          repos.slice(0, 24).map(async repo => {
            try {
              const response = await fetch(`https://api.github.com/repos/${repo.full_name}/commits?author=${username}&per_page=1`, { headers, signal: controller.signal })
              if (!response.ok) return 0
              const lastPage = parseLastPage(response.headers.get('Link'))
              if (lastPage) return lastPage
              const data = await response.json() as unknown[]
              return data.length
            } catch {
              return 0
            }
          })
        )

        const totalCommits = commitCounts.reduce((sum, count) => sum + count, 0)
        const nextStats: GitHubStats = {
          repoCount: user.public_repos || repos.length,
          totalCommits: totalCommits || fallbackGitHubStats.totalCommits,
          totalCommitsEstimated: repos.length > 24 || totalCommits === 0,
          activeProjects,
          longestMaintainedProject: longest ? friendlyRepoName(longest.name) : fallbackGitHubStats.longestMaintainedProject,
          heatLevels: buildHeatLevels(repos),
          repos,
        }
        setStats(nextStats)
        setStatus('live')
        localStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), stats: nextStats }))
      } catch {
        setStatus(cached ? 'cached' : 'fallback')
      }
    }

    load()
    return () => controller.abort()
  }, [username])

  return { stats, status }
}

function Icon({ name }: { name: 'arrow' | 'github' | 'linkedin' | 'mail' | 'download' | 'phone' }) {
  const paths = {
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    github: <><path d="M15 22v-3.9c.04-1-.35-1.96-1.1-2.6 3.6-.4 7.38-1.77 7.38-8A6.24 6.24 0 0 0 19.61 3.2 5.8 5.8 0 0 0 19.45 0S18.4-.34 15 1.65a15 15 0 0 0-8 0C3.6-.34 2.55 0 2.55 0a5.8 5.8 0 0 0-.16 3.2A6.24 6.24 0 0 0 .72 7.5c0 6.22 3.78 7.6 7.38 8-.74.63-1.13 1.58-1.1 2.58V22" /></>,
    linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6ZM2 9h4v12H2z" /><path d="M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /></>,
    mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 7L2 7" /></>,
    download: <><path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14" /></>,
    phone: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.35 1.89.67 2.77a2 2 0 0 1-.45 2.11L8.09 9.84a16 16 0 0 0 6.07 6.07l1.24-1.24a2 2 0 0 1 2.11-.45c.88.32 1.81.54 2.77.67A2 2 0 0 1 22 16.92Z" /></>,
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>
}

function Loader({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
  const stages = ['ALLOCATING MEMORY', 'INITIALIZING THREAD POOL', 'COMPILING SHADERS', 'RUNTIME READY']
  useEffect(() => {
    const timer = setInterval(() => {
      setStep((current) => {
        if (current >= stages.length - 1) {
          clearInterval(timer)
          setTimeout(onDone, 380)
          return current
        }
        return current + 1
      })
    }, 420)
    return () => clearInterval(timer)
  }, [onDone, stages.length])
  return (
    <div className="loader" role="status" aria-live="polite">
      <div className="loader-mark"><span>VG</span><i /></div>
      <div className="loader-copy">
        <span>BOOT SEQUENCE / {String(step + 1).padStart(2, '0')}</span>
        <strong>{stages[step]}</strong>
        <div className="loader-bar"><i style={{ width: `${((step + 1) / stages.length) * 100}%` }} /></div>
      </div>
    </div>
  )
}

function CpuVisual() {
  return (
    <div className="cpu-visual" aria-label="Animated CPU task scheduler visualization">
      <div className="cpu-label top"><span>INPUT QUEUE</span><b>06 TASKS</b></div>
      <div className="queue">{[0,1,2,3,4,5].map(i => <i key={i} style={{ animationDelay: `${i * .18}s` }} />)}</div>
      <div className="chip">
        <div className="chip-title"><span>EXECUTION UNIT</span><b>C++ / 8T</b></div>
        <div className="cores">{Array.from({ length: 8 }, (_, i) => <div key={i}><span>CORE {i}</span><i style={{ animationDelay: `${i * -.31}s` }} /></div>)}</div>
      </div>
      <div className="cpu-label bottom"><span>FRAME BUDGET</span><b>4.16 MS</b></div>
      <div className="scanline" />
    </div>
  )
}

function Profiler() {
  const bars = [42, 58, 35, 69, 54, 76, 48, 61, 39, 72, 57, 45, 67, 51, 73, 46, 64, 55]
  return (
    <div className="profiler">
      <div className="profiler-head"><div><i /> LATENCY CASE STUDY</div><span>TCP / UDP SOCKET PATH</span></div>
      <div className="profiler-grid">
        <div className="gauge"><span>BEFORE</span><strong>450<em>ms</em></strong><small>round trip</small></div>
        <div className="gauge"><span>AFTER</span><strong>180<em>ms</em></strong><small>round trip</small></div>
        <div className="gauge"><span>GAIN</span><strong>60<em>%</em></strong><small>latency reduction</small></div>
        <div className="gauge"><span>THROUGHPUT</span><strong>40<em>%</em></strong><small>processing uplift</small></div>
      </div>
      <div className="frame-chart">
        <div className="axis"><span>4 ms</span><span>0 ms</span></div>
        <div className="bars">{bars.map((bar, i) => <i key={i} style={{ height: `${bar}%`, animationDelay: `${i * -0.13}s` }} />)}</div>
        <div className="budget-line"><span>bottleneck budget</span></div>
      </div>
      <div className="profile-rows">
        {[['SocketRoundTrip()', '180 ms', 72], ['ThreadPoolDispatch()', '+40%', 44], ['QueueContention()', '-35%', 18]].map(row =>
          <div key={row[0]}><code>{row[0]}</code><i><b style={{ width: `${row[2]}%` }} /></i><span>{row[1]}</span></div>
        )}
      </div>
    </div>
  )
}

function RemoteDesktopDiagram() {
  return (
    <div className="remote-diagram" aria-label="Remote desktop architecture visualization">
      <div className="remote-node client"><span>REMOTE CLIENT</span><b>INPUT + DISPLAY</b></div>
      <div className="remote-node input"><span>INPUT CHANNEL</span><b>mouse / keyboard</b></div>
      <div className="remote-node network"><span>NETWORK LAYER</span><b>TCP/IP protocol</b></div>
      <div className="remote-node host"><span>REMOTE HOST</span><b>Win32 runtime</b></div>
      <div className="remote-branches">
        <i />
        {['SCREEN CAPTURE', 'COMPRESSION', 'FRAME STREAMING'].map((label, i) => (
          <b key={label} style={{ animationDelay: `${i * .18}s` }}>{label}</b>
        ))}
      </div>
      <div className="remote-packets">{Array.from({ length: 7 }, (_, i) => <i key={i} style={{ animationDelay: `${i * .22}s` }} />)}</div>
    </div>
  )
}

function EngineeringActivity() {
  const { stats, status } = useGitHubStats('VaibhavGaikwad03')
  const liveStats = [
    ['TOTAL REPOSITORIES', formatStat(stats.repoCount)],
    ['TOTAL COMMITS', formatStat(stats.totalCommits, stats.totalCommitsEstimated)],
    ['ACTIVE PROJECTS', formatStat(stats.activeProjects)],
    ['LONGEST MAINTAINED PROJECT', stats.longestMaintainedProject],
  ]
  const repoLookup = new Map(stats.repos.map(repo => [repo.name.toLowerCase(), repo]))
  const repositoryCards = featuredRepos.map(([name, purpose, tech, focus]) => {
    const aliases = repoAliases[name] || [name.toLowerCase().replaceAll(' ', '-')]
    const repo = aliases.map(alias => repoLookup.get(alias)).find(Boolean)
    return {
      name,
      purpose: repo?.description || purpose,
      tech: repo?.language || tech,
      focus,
      updated: repo?.pushed_at ? new Date(repo.pushed_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }).toUpperCase() : null,
      url: repo?.html_url || `https://github.com/VaibhavGaikwad03/${aliases[0]}`
    }
  })
  return (
    <section id="activity" className="section activity">
      <div className="section-head split">
        <div><span>07 / ENGINEERING ACTIVITY</span><h2>Code never stops.</h2></div>
        <p>Open-source experiments, systems research, performance prototypes, and continuous engineering work.</p>
      </div>

      <div className="activity-dashboard">
        <div className="activity-panel heatmap-panel">
          <div className="panel-top"><span>CONTRIBUTION HEATMAP</span><b>{status === 'live' ? 'GITHUB LIVE' : status === 'cached' ? 'GITHUB CACHE' : 'FALLBACK SIGNAL'}</b></div>
          <div className="heatmap" aria-label="Cyan contribution activity heatmap">
            {stats.heatLevels.map((level, i) => <i key={i} className={`level-${level}`} style={{ animationDelay: `${i * .012}s` }} />)}
          </div>
        </div>

        <div className="activity-panel stats-panel">
          <div className="panel-top"><span>REPOSITORY STATISTICS</span><b>LIVE INDEX</b></div>
          <div className="stat-grid">
            {liveStats.map(([label, value]) => <div key={label}><span>{label}</span><b>{value}</b></div>)}
          </div>
        </div>

        <div className="activity-panel repo-panel">
          <div className="panel-top"><span>FEATURED REPOSITORIES</span><b>ENGINEERING SURFACE</b></div>
          <div className="repo-grid">
            {repositoryCards.map(({ name, purpose, tech, focus, updated, url }) => (
              <a key={name} href={url} target="_blank" rel="noreferrer" style={{ display: 'contents', color: 'inherit', textDecoration: 'none' }}>
                <article style={{ cursor: 'pointer' }}>
                  <span>{tech}</span>
                  <h3>{name}</h3>
                  <p>{purpose}</p>
                  <code>{updated ? `${focus} / PUSHED ${updated}` : focus}</code>
                </article>
              </a>
            ))}
          </div>
        </div>

        <div className="activity-panel stream-panel">
          <div className="panel-top"><span>ACTIVITY STREAM</span><b>TERMINAL LOG</b></div>
          <div className="activity-stream">
            {activityLog.map(([type, text], i) => (
              <div key={text} style={{ animationDelay: `${i * .16}s` }}>
                <code>[{type}]</code>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

function SchedulerLab() {
  const [running, setRunning] = useState(false)
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (!running) return
    const timer = setInterval(() => setTick(t => t + 1), 700)
    return () => clearInterval(timer)
  }, [running])
  return (
    <div className="lab-panel">
      <div className="lab-head">
        <div><span>INTERACTIVE / 01</span><h3>Thread pool scheduler</h3></div>
        <button onClick={() => setRunning(v => !v)}><i className={running ? 'live' : ''} />{running ? 'PAUSE' : 'RUN SIMULATION'}</button>
      </div>
      <div className="scheduler">
        <div className="task-queue"><span>BOUNDED QUEUE</span>{Array.from({length: 7}, (_, i) => <b key={i} className={running && i === tick % 7 ? 'active' : ''}>T{(tick + i) % 9 + 1}</b>)}</div>
        <div className="dispatch"><i /><i /><i /><i /></div>
        <div className="workers">{Array.from({length: 4}, (_, i) => {
          const active = running && i === tick % 4
          return <div className={active ? 'active' : ''} key={i}><span>WORKER {i}</span><b>{active ? `TASK T${tick % 9 + 1}` : 'IDLE'}</b><i><em /></i></div>
        })}</div>
      </div>
      <div className="lab-log"><code>{running ? `dispatch: task_${tick % 9 + 1} → worker_${tick % 4}  [queue=${6 - tick % 5}]` : 'scheduler paused — inspect state, then run'}</code><span>O(1) DISPATCH</span></div>
    </div>
  )
}

function CacheLineLab() {
  const [layout, setLayout] = useState<'AoS' | 'SoA'>('SoA')
  const [tick, setTick] = useState(0)
  
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 600)
    return () => clearInterval(timer)
  }, [])

  const blocks = Array.from({ length: 16 }, (_, i) => i)
  
  return (
    <div className="lab-panel cache-lab">
      <div className="lab-head">
        <div><span>INTERACTIVE / 03</span><h3>Data Layout (AoS vs SoA)</h3></div>
        <button onClick={() => setLayout(l => l === 'AoS' ? 'SoA' : 'AoS')}>
          <i className="live" />{layout === 'SoA' ? 'SWITCH TO AoS' : 'SWITCH TO SoA'}
        </button>
      </div>
      <div className="cache-sim">
        <div className="cache-line">
           <span>L1 CACHE LINE [64B]</span>
           <div className="blocks">
             {blocks.map(i => {
                const isX = layout === 'SoA' ? i < 8 : i % 2 === 0
                const type = isX ? 'X' : 'Y'
                const isActive = layout === 'SoA' ? i === (tick % 8) : i === (tick % 8) * 2
                return <b key={i} className={`${type} ${isActive ? 'active' : ''}`}>{type}</b>
             })}
           </div>
        </div>
      </div>
      <div className="lab-log">
        <code>{layout === 'SoA' ? 'struct SoA { float x[N]; float y[N]; }; // contiguous cache hits' : 'struct AoS { float x, y; }; // 50% cache line utilization'}</code>
        <span>{layout === 'SoA' ? 'HW PREFETCHER EFFICIENT' : 'CACHE SATURATION'}</span>
      </div>
    </div>
  )
}


function NetworkPing() {
  const [ping, setPing] = useState(12);
  useEffect(() => {
    const interval = setInterval(() => {
      setPing(p => Math.max(8, Math.min(24, p + (Math.floor(Math.random() * 5) - 2))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  return <b>{ping}ms</b>;
}

function LiveClock() {
  const [time, setTime] = useState('--:--:-- IST');
  useEffect(() => {
    const update = () => {
      const formatted = new Date().toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setTime(`${formatted} IST`);
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);
  return <b>{time}</b>;
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Project | null>(null)
  const [palette, setPalette] = useState(false)
  const [menu, setMenu] = useState(false)
  const [scroll, setScroll] = useState(0)
  const [lowPower, setLowPower] = useState(false)
  useCanvasNetwork(canvasRef, lowPower)

  useEffect(() => {
    document.body.classList.toggle('low-power', lowPower)
  }, [lowPower])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPalette(v => !v)
      }
      if (event.key === 'Escape') {
        setPalette(false)
        setSelected(null)
      }
    }
    const onScroll = () => setScroll(scrollY / (document.documentElement.scrollHeight - innerHeight))
    addEventListener('keydown', onKey)
    addEventListener('scroll', onScroll, { passive: true })
    return () => {
      removeEventListener('keydown', onKey)
      removeEventListener('scroll', onScroll)
    }
  }, [])

  const go = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
    setPalette(false)
    setMenu(false)
  }

  return (
    <>
      {loading && <Loader onDone={() => setLoading(false)} />}
      <canvas className="webgl-bg" ref={canvasRef} aria-hidden="true" />
      <div className="scroll-progress" style={{ transform: `scaleX(${scroll})` }} />
      <header>
        <a className="brand" href="#home" aria-label="Vaibhav Gaikwad home"><span>VAIBHAV GAIKWAD</span><i>VG</i></a>
        <nav className={menu ? 'open' : ''} aria-label="Primary navigation">
          {['about', 'projects', 'lab', 'skills', 'experience', 'education', 'activity', 'contact'].map((item, i) =>
            <button key={item} onClick={() => go(`#${item}`)}><span>0{i + 1}</span>{item}</button>
          )}
        </nav>
        <div className="nav-actions">
          <button className={`command ${lowPower ? 'active' : ''}`} onClick={() => setLowPower(!lowPower)} style={{color: lowPower ? 'var(--cyan)' : undefined}}><span>PWR</span><kbd>LOW</kbd></button>
          <button className="command" onClick={() => setPalette(true)}><span>COMMAND</span><kbd>CTRL K</kbd></button>
          <button className="menu" aria-label="Toggle menu" onClick={() => setMenu(v => !v)}><i /><i /></button>
        </div>
      </header>

      <main>
        <section id="home" className="hero-section">
          <div className="eyebrow"><i /> AVAILABLE FOR C++ SOFTWARE ENGINEERING ROLES <span>INDIA / REMOTE</span></div>
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="super">C++ SOFTWARE ENGINEER</p>
              <h1>Engineering software<br />where <em>every millisecond matters.</em></h1>
              <p className="lede">C++ Software Engineer specializing in Networking, Multithreading, Real-Time Systems, CUDA, Distributed Systems, and Performance Engineering.</p>
              <div className="hero-tags">
                <code>C++</code>
                <code>Networking</code>
                <code>TCP/IP</code>
                <code>Multithreading</code>
                <code>Distributed Systems</code>
                <code>CUDA</code>
                <code>Real-Time Systems</code>
                <code>Performance Engineering</code>
              </div>
              <div className="hero-actions">
                <button className="primary" onClick={() => go('#projects')}>EXPLORE SYSTEMS <Icon name="arrow" /></button>
                <a href="resume-vaibhav-gaikwad.pdf" target="_blank" rel="noreferrer">VIEW RESUME <Icon name="download" /></a>
              </div>
            </div>
            <CpuVisual />
          </div>
          <div className="runtime-strip">
            <span>RUNTIME STATUS <b>STABLE</b></span>
            <span>NETWORK PING <NetworkPing /></span>
            <span>FOCUS <b>DISTRIBUTED SYSTEMS</b></span>
            <span>LOCAL TIME <LiveClock /></span>
          </div>
        </section>

        <section id="about" className="section about">
          <div className="section-head"><span>01 / OPERATING PRINCIPLES</span><h2>Software that earns<br />its complexity.</h2></div>
          <div className="principles">
            <article><span>01</span><h3>Measure first.</h3><p>Optimization starts with evidence. Profile the real workload, identify the limiting resource, then change the smallest thing that matters.</p><code>trace → isolate → optimize → verify</code></article>
            <article><span>02</span><h3>Make state explicit.</h3><p>Clear ownership, bounded queues, and visible lifetimes make concurrent systems easier to reason about—and much harder to break.</p><code>ownership &gt; convention</code></article>
            <article><span>03</span><h3>Design for failure.</h3><p>Backpressure, timeouts, transactional updates, and useful telemetry belong in the architecture—not in the postmortem.</p><code>failure is an input</code></article>
          </div>
          <div className="terminal">
            <div className="terminal-top"><span>vaibhav@portfolio: ~/about</span><i /><i /><i /></div>
            <pre><b>$</b> whoami{'\n'}<span>Vaibhav Gaikwad — C/C++ software engineer working across real-time systems, networking, graphics, and performance.</span>{'\n\n'}<b>$</b> cat current_work.txt{'\n'}<span>EtherCAT services · C# automation tools · CUDA VFX · WebSocket servers · virtual file systems</span>{'\n\n'}<b>$</b> echo $ENGINEERING_GOAL{'\n'}<em>"Build software whose performance and correctness are explainable."</em></pre>
          </div>
        </section>

        <section id="projects" className="section projects">
          <div className="section-head split"><div><span>02 / SELECTED SYSTEMS</span><h2>Built to be inspected.</h2></div><p>Each project is presented as an engineering case study: constraints, architecture, measurements, and tradeoffs—not just screenshots.</p></div>
          <div className="project-list">
            {projects.map(project => (
              <article key={project.id} onClick={() => setSelected(project)}>
                <div className="project-index">{project.index}</div>
                <div className={`project-diagram ${project.id}`}>
                  <div className="diagram-grid" />
                  {project.id === 'remote-desktop' && <RemoteDesktopDiagram />}
                  {project.id === 'bingo' && <><div className="server">SERVER<small>8 WORKERS</small></div>{[0,1,2,3,4].map(i => <i className={`packet p${i}`} key={i} />)}{[0,1,2,3].map(i => <b className={`client c${i}`} key={i}>C{i+1}</b>)}</>}
                  {project.id === 'cuda' && <><div className="pipeline">{['HOST', 'H→D', 'KERNEL', 'D→H'].map((x,i)=><b key={x} style={{animationDelay:`${i*.2}s`}}>{x}</b>)}</div><div className="pixels">{Array.from({length:48},(_,i)=><i key={i} style={{opacity: (i%7)/7}} />)}</div></>}
                  {project.id === 'vfs' && <div className="tree"><b>root/</b><span>├── src/</span><span>│   ├── core.cpp</span><span>│   └── io.cpp</span><span>└── build/</span><i>inode: 0x03F2</i></div>}
                  {project.id === 'ethercat' && <div className="crypto-flow"><b>ACTUATOR</b><i>4ms</i><span>ETHERCAT</span><i>CYCLE</i><b>MONITOR</b></div>}
                </div>
                <div className="project-body">
                  <span>{project.category}</span><h3>{project.title}</h3><p>{project.summary}</p>
                  <div className="metrics">{project.metrics.map(([value,label])=><div key={label}><b>{value}</b><span>{label}</span></div>)}</div>
                  <div className="project-foot"><div>{project.stack.map(x=><code key={x}>{x}</code>)}</div><button aria-label={`Open ${project.title} case study`}><Icon name="arrow" /></button></div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="lab" className="section lab">
          <div className="section-head split"><div><span>03 / ENGINEERING LAB</span><h2>Concepts you can run.</h2></div><p>Small, deterministic simulations turn abstract systems concepts into inspectable behavior.</p></div>
          <SchedulerLab />
          <Profiler />
          <CacheLineLab />
        </section>

        <section id="skills" className="section skills">
          <div className="section-head"><span>04 / TECHNICAL INDEX</span><h2>Working knowledge,<br />organized by system.</h2></div>
          <div className="skill-grid">{skills.map(([title, ...items], i) =>
            <article key={title}><div><span>0{i+1}</span><h3>{title}</h3></div><ul>{items.map(item=><li key={item}>{item}<i /></li>)}</ul></article>
          )}</div>
        </section>

        <section id="experience" className="section experience">
          <div className="section-head"><span>05 / EXECUTION HISTORY</span><h2>Experience & trajectory.</h2></div>
          <div className="timeline">
            <article><time>JAN 2025 — PRESENT</time><div><span>SOFTWARE ENGINEER · STANDARD UNITS SUPPLY INDIA</span><h3>Real-Time Industrial Systems</h3><p>Performing R&D on C++ EtherCAT services for industrial machine communication while developing C#/.NET tools for configuring, running, and monitoring automation actuators.</p><ul><li>~4 ms communication cycles</li><li>C++ real-time service work</li><li>C#/.NET actuator tooling</li></ul></div></article>
            <article><time>JUN 2024 — JAN 2025</time><div><span>C++ DEVELOPER · TECHZEST GLOBAL SOLUTIONS</span><h3>Latency & Throughput Engineering</h3><p>Diagnosed production latency bottlenecks, optimized TCP/UDP socket communication, and applied thread pools, mutexes, condition variables, and lock-free queues to improve throughput.</p><ul><li>450 ms → 180 ms round-trip latency</li><li>~60% latency improvement</li><li>~40% processing speed improvement</li></ul></div></article>
            <article><time>FEB 2024 — JUN 2024</time><div><span>SOFTWARE DEVELOPER INTERN · AVHAN TECHNOLOGIES</span><h3>High-Frequency Data Streams</h3><p>Enhanced telecom-sector real-time data processing components and implemented efficient data structures for high-frequency event streams.</p><ul><li>10,000+ events/sec</li><li>Low-overhead processing</li><li>Real-time telecom workloads</li></ul></div></article>
          </div>
        </section>

        <section id="education" className="section experience">
          <div className="section-head"><span>06 / ACADEMIC FOUNDATION</span><h2>Education & training.</h2></div>
          <div className="timeline">
            <article><time>2024 — 2027</time><div><span>EDUCATION · BHARATI VIDYAPEETH, PUNE</span><h3>Bachelor of Computer Applications</h3><p>Core curriculum covering Data Structures, Algorithms, Mathematics, and Computer Science fundamentals.</p></div></article>
            <article><time>2023 — 2024</time><div><span>EDUCATION · VOID DERIVATIVES</span><h3>Systems & Architecture</h3><p>Deep-dive systems programming training focusing on operating system internals, low-level architecture, and assembly.</p><div className="coursework-tags"><span>SPECIALIZED COURSEWORK</span><code>UNIX System Design</code><code>GNU x86 Assembly</code></div></div></article>
            <article><time>2024 — 2026</time><div><span>EDUCATION · ASTROMEDICOMP</span><h3>Real-Time Rendering - Batch 6</h3><p>Comprehensive training in cross-platform graphics programming, developing renderers from scratch across Windows, Linux, macOS, Android, iOS, and Web using OpenGL, WebGL, and DirectX.</p><div className="coursework-tags"><span>SPECIALIZED COURSEWORK</span><code>Real-Time Rendering</code><code>Heterogeneous Parallel Programming</code></div></div></article>
          </div>
        </section>

        <EngineeringActivity />

        <section id="contact" className="contact-section">
          <div className="contact-copy"><span>08 / OPEN CHANNEL</span><h2>Work with<br />Vaibhav Gaikwad.</h2><p>I’m interested in roles and collaborations involving C/C++, real-time systems, graphics APIs, networking, CUDA, and performance-sensitive software.</p></div>
          <div className="contact-links">
            <a href="mailto:im.vaibhavtg07@gmail.com"><span><Icon name="mail" /> EMAIL</span><b>im.vaibhavtg07@gmail.com</b><Icon name="arrow" /></a>
            <a href="tel:+917887401312"><span><Icon name="phone" /> PHONE</span><b>+91 7887401312</b><Icon name="arrow" /></a>
            <a href="https://github.com/VaibhavGaikwad03" target="_blank" rel="noreferrer"><span><Icon name="github" /> GITHUB</span><b>VaibhavGaikwad03</b><Icon name="arrow" /></a>
            <a href="https://www.linkedin.com/in/vaibhavgaikwad03" target="_blank" rel="noreferrer"><span><Icon name="linkedin" /> LINKEDIN</span><b>linkedin.com/in/vaibhavgaikwad03</b><Icon name="arrow" /></a>
          </div>
        </section>
      </main>

      <footer><div><span>VAIBHAV GAIKWAD / SYSTEMS ENGINEER</span><p>Performance is a feature. Predictability is architecture.</p></div><div><span>BUILT WITH</span><p>React · TypeScript · Canvas 2D</p></div><button onClick={() => go('#home')}>BACK TO TOP ↑</button></footer>

      {selected && <div className="modal-wrap" role="dialog" aria-modal="true" aria-label={`${selected.title} case study`} onMouseDown={e => e.target === e.currentTarget && setSelected(null)}>
        <div className="modal">
          <button className="modal-close" onClick={() => setSelected(null)} aria-label="Close case study">×</button>
          <span>{selected.index} / CASE STUDY</span><h2>{selected.title}</h2><p className="modal-summary">{selected.summary}</p>
          <div className="architecture">{selected.architecture.map((item,i)=><div key={item}><b>{item}</b>{i < selected.architecture.length - 1 && <i>→</i>}</div>)}</div>
          <div className="modal-grid"><div><span>THE CONSTRAINT</span><p>{selected.challenge}</p></div><div><span>THE DESIGN</span><p>{selected.solution}</p></div></div>
          <div className="modal-metrics">{selected.metrics.map(([value,label])=><div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
          <div className="modal-stack">
            {selected.stack.map(x=><code key={x}>{x}</code>)}
            {selected.repo && <a href={selected.repo} target="_blank" rel="noreferrer">VIEW SOURCE <Icon name="github" /></a>}
          </div>
        </div>
      </div>}

      {palette && <div className="palette-wrap" role="dialog" aria-modal="true" aria-label="Command palette" onMouseDown={e => e.target === e.currentTarget && setPalette(false)}>
        <div className="palette"><div className="palette-input"><span>›</span><input autoFocus placeholder="Navigate portfolio..." aria-label="Command search" /></div>
          <p>QUICK NAVIGATION</p>{[['Home','#home'],['Selected systems','#projects'],['Engineering lab','#lab'],['Technical index','#skills'],['Engineering activity','#activity'],['Open channel','#contact']].map(([label,id],i)=><button key={id} onClick={()=>go(id)}><span>0{i+1}</span>{label}<kbd>↵</kbd></button>)}
        </div>
      </div>}
    </>
  )
}

export default App
