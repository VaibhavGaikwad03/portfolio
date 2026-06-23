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

const projects: Project[] = [
  {
    id: 'bingo',
    index: '01',
    title: 'Bingo WebSocket Server',
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
    index: '02',
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
    index: '03',
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
    index: '04',
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

function useCanvasNetwork(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
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
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
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
  }, [canvasRef])
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

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Project | null>(null)
  const [palette, setPalette] = useState(false)
  const [menu, setMenu] = useState(false)
  const [scroll, setScroll] = useState(0)
  useCanvasNetwork(canvasRef)

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
          {['about', 'projects', 'lab', 'skills', 'contact'].map((item, i) =>
            <button key={item} onClick={() => go(`#${item}`)}><span>0{i + 1}</span>{item}</button>
          )}
        </nav>
        <div className="nav-actions">
          <button className="command" onClick={() => setPalette(true)}><span>COMMAND</span><kbd>CTRL K</kbd></button>
          <button className="menu" aria-label="Toggle menu" onClick={() => setMenu(v => !v)}><i /><i /></button>
        </div>
      </header>

      <main>
        <section id="home" className="hero-section">
          <div className="eyebrow"><i /> AVAILABLE FOR SYSTEMS ENGINEERING ROLES <span>INDIA / REMOTE</span></div>
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="super">VAIBHAV GAIKWAD / HIGH-PERFORMANCE SOFTWARE ENGINEER</p>
              <h1>Engineering software<br />closer to the <em>metal.</em></h1>
              <p className="lede">I build performance-critical C++ systems, real-time industrial communication software, GPU-accelerated graphics, and concurrent networked services—with a focus on predictable behavior and measurable speed.</p>
              <div className="hero-actions">
                <button className="primary" onClick={() => go('#projects')}>EXPLORE SYSTEMS <Icon name="arrow" /></button>
                <a href="resume-vaibhav-gaikwad.pdf" target="_blank" rel="noreferrer">VIEW RESUME <Icon name="download" /></a>
              </div>
            </div>
            <CpuVisual />
          </div>
          <div className="runtime-strip">
            <span>RUNTIME STATUS <b>STABLE</b></span>
            <span>PRIMARY <b>C / C++</b></span>
            <span>FOCUS <b>REAL-TIME + GRAPHICS</b></span>
            <span>LOCAL TIME <b>UTC+05:30</b></span>
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
        </section>

        <section id="skills" className="section skills">
          <div className="section-head"><span>04 / TECHNICAL INDEX</span><h2>Working knowledge,<br />organized by system.</h2></div>
          <div className="skill-grid">{skills.map(([title, ...items], i) =>
            <article key={title}><div><span>0{i+1}</span><h3>{title}</h3></div><ul>{items.map(item=><li key={item}>{item}<i /></li>)}</ul></article>
          )}</div>
        </section>

        <section className="section experience">
          <div className="section-head"><span>05 / EXECUTION HISTORY</span><h2>Experience & trajectory.</h2></div>
          <div className="timeline">
            <article><time>JAN 2025 — PRESENT</time><div><span>SOFTWARE ENGINEER · STANDARD UNITS SUPPLY INDIA</span><h3>Real-Time Industrial Systems</h3><p>Performing R&D on C++ EtherCAT services for industrial machine communication while developing C#/.NET tools for configuring, running, and monitoring automation actuators.</p><ul><li>~4 ms communication cycles</li><li>C++ real-time service work</li><li>C#/.NET actuator tooling</li></ul></div></article>
            <article><time>JUN 2024 — JAN 2025</time><div><span>C++ DEVELOPER · TECHZEST GLOBAL SOLUTIONS</span><h3>Latency & Throughput Engineering</h3><p>Diagnosed production latency bottlenecks, optimized TCP/UDP socket communication, and applied thread pools, mutexes, condition variables, and lock-free queues to improve throughput.</p><ul><li>450 ms → 180 ms round-trip latency</li><li>~60% latency improvement</li><li>~40% processing speed improvement</li></ul></div></article>
            <article><time>FEB 2024 — JUN 2024</time><div><span>SOFTWARE DEVELOPER INTERN · AVHAN TECHNOLOGIES</span><h3>High-Frequency Data Streams</h3><p>Enhanced telecom-sector real-time data processing components and implemented efficient data structures for high-frequency event streams.</p><ul><li>10,000+ events/sec</li><li>Low-overhead processing</li><li>Real-time telecom workloads</li></ul></div></article>
            <article><time>2024 — 2027</time><div><span>EDUCATION</span><h3>BCA + Real-Time Rendering</h3><p>Bachelor of Computer Applications at Bharati Vidyapeeth, Pune, plus Real-Time Rendering Batch 6 at Astromedicomp, with coursework in DSA, UNIX system design, GNU x86 assembly, and heterogeneous parallel programming.</p></div></article>
          </div>
        </section>

        <section id="contact" className="contact-section">
          <div className="contact-copy"><span>06 / OPEN CHANNEL</span><h2>Work with<br />Vaibhav Gaikwad.</h2><p>I’m interested in roles and collaborations involving C/C++, real-time systems, graphics APIs, networking, CUDA, and performance-sensitive software.</p></div>
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
          <p>QUICK NAVIGATION</p>{[['Home','#home'],['Selected systems','#projects'],['Engineering lab','#lab'],['Technical index','#skills'],['Open channel','#contact']].map(([label,id],i)=><button key={id} onClick={()=>go(id)}><span>0{i+1}</span>{label}<kbd>↵</kbd></button>)}
        </div>
      </div>}
    </>
  )
}

export default App
