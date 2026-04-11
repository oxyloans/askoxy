import { useState, useEffect } from "react";
import { CodeFile } from "../type/file";
import { fetchProjects, fetchProjectTitles, fetchProjectFiles, fetchFileContent } from "../hooks/driveApi";
import { getWebContainer } from "../services/webcontainer";
import { WebContainer } from "@webcontainer/api";
import { loadProjectStructure, LoadProgress } from "../services/autoLoadFiles";

type View = "titles" | "tree";

export default function CodeExplorer() {
  // --- Title-level state ---
  const [projects, setProjects] = useState<CodeFile[]>([]);
  const [titles, setTitles] = useState<string[]>([]);
  const [loadingTitles, setLoadingTitles] = useState(true);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [view, setView] = useState<View>("titles");
  const [loadProgress, setLoadProgress] = useState<LoadProgress | null>(null);

  // --- Tree / file state ---
  const [tree, setTree] = useState<CodeFile[]>([]);
  const [fullTree, setFullTree] = useState<CodeFile[]>([]); // raw API data for WebContainer
  const [loadingTree, setLoadingTree] = useState(false);
  const [selectedFile, setSelectedFile] = useState<CodeFile | null>(null);
  const [openFiles, setOpenFiles] = useState<CodeFile[]>([]); // Track open files like VS Code tabs
  const [fileContent, setFileContent] = useState<string>("");
  const [loadingContent, setLoadingContent] = useState(false);
  const [fileCache, setFileCache] = useState<Map<string, string>>(new Map());

  // --- WebContainer state ---
  const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);
  const [webContainerError, setWebContainerError] = useState(false);
  const [isServerRunning, setIsServerRunning] = useState(false);
  const [showConsole, setShowConsole] = useState(false);

  // --- Search / filter ---
  const [titleSearch, setTitleSearch] = useState("");

  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const [consoleHeight, setConsoleHeight] = useState(30);
  const [isResizingConsole, setIsResizingConsole] = useState(false);
  const [isConsoleMinimized, setIsConsoleMinimized] = useState(false);

  useEffect(() => {
    loadTitles();
    initWebContainer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 600) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingConsole) return;
      const mainContent = document.getElementById('main-content');
      if (!mainContent) return;
      const rect = mainContent.getBoundingClientRect();
      const newHeight = ((e.clientY - rect.top) / rect.height) * 100;
      if (newHeight >= 20 && newHeight <= 70) {
        setConsoleHeight(100 - newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsResizingConsole(false);
    };

    if (isResizingConsole) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingConsole]);

  // ─── Load project titles ───────────────────────────────────────
  async function loadTitles() {
    setLoadingTitles(true);
    try {
      const data = await fetchProjects();
      setProjects(data);
      const normalized: string[] = data.map((item: any) => item.name || String(item));
      setTitles(normalized);
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setLoadingTitles(false);
    }
  }

  // ─── Handle title click ───────────────────────────────────────
  async function handleTitleClick(title: string) {
    const project = projects.find(p => p.name === title);
    if (!project) return;

    setSelectedTitle(title);
    setSelectedProjectId(project.id);
    setView("tree");
    setLoadingTree(true);
    setTree([]);
    setFullTree([]);
    setSelectedFile(null);
    setFileContent("");
    setFileCache(new Map());
    setLoadProgress(null);
    setShowConsole(false);
    setLogs([]);

    try {
      // Load project structure progressively
      const { tree: loadedTree, fileCache: loadedCache } = await loadProjectStructure(
        project.id,
        (updatedTree) => {
          // Update tree as folders load
          setTree(updatedTree);
          setFullTree(updatedTree);
        }
      );

      setFullTree(loadedTree);
      setTree(loadedTree);
      setFileCache(loadedCache);
    } catch (error) {
      console.error("Error loading project files:", error);
    } finally {
      setLoadingTree(false);
      setLoadProgress(null);
    }
  }

  // ─── Back to titles ───────────────────────────────────────────
  function handleBackToTitles() {
    setView("titles");
    setSelectedTitle(null);
    setSelectedProjectId(null);
    setTree([]);
    setFullTree([]);
    setSelectedFile(null);
    setOpenFiles([]);
    setFileContent("");
    setFileCache(new Map());
    setShowPreview(false);
    setLogs([]);
    setIsServerRunning(false);
    setPreviewUrl("");
    setLoadProgress(null);
    setShowConsole(false);
  }

  function addLog(msg: string) {
    setLogs(prev => [...prev, msg]);
  }

  async function initWebContainer() {
    try {
      if (!crossOriginIsolated) {
        console.warn("WebContainer requires crossOriginIsolated. Run button will be disabled.");
        setWebContainerError(true);
        return;
      }
      
      const container = await getWebContainer();
      setWebcontainer(container);
      console.log("✅ WebContainer initialized");
    } catch (error) {
      console.error("Failed to initialize WebContainer:", error);
      setWebContainerError(true);
    }
  }

  async function handleFileClick(file: CodeFile) {
    // Add to open files if not already open
    if (!openFiles.find(f => f.id === file.id)) {
      setOpenFiles(prev => [...prev, file]);
    }
    
    setSelectedFile(file);
    
    const cached = fileCache.get(file.id);
    if (cached) {
      setFileContent(cached);
      return;
    }
    
    // If not in cache, load it (fallback)
    setLoadingContent(true);
    try {
      const content = await fetchFileContent(file.id);
      setFileContent(content);
      setFileCache(prev => new Map(prev).set(file.id, content));
    } catch (error) {
      console.error("Error loading file content:", error);
      setFileContent("Error loading file content");
    } finally {
      setLoadingContent(false);
    }
  }

  function handleCloseFile(fileId: string, e?: React.MouseEvent) {
    e?.stopPropagation();
    
    const fileIndex = openFiles.findIndex(f => f.id === fileId);
    const newOpenFiles = openFiles.filter(f => f.id !== fileId);
    setOpenFiles(newOpenFiles);
    
    // If closing the selected file, select another one
    if (selectedFile?.id === fileId) {
      if (newOpenFiles.length > 0) {
        // Select the previous file, or the next one if it was the first
        const newIndex = fileIndex > 0 ? fileIndex - 1 : 0;
        const newSelectedFile = newOpenFiles[newIndex];
        setSelectedFile(newSelectedFile);
        const content = fileCache.get(newSelectedFile.id);
        if (content) setFileContent(content);
      } else {
        setSelectedFile(null);
        setFileContent("");
      }
    }
  }

  function handleTabClick(file: CodeFile) {
    setSelectedFile(file);
    const content = fileCache.get(file.id);
    if (content) setFileContent(content);
  }

  function buildFileMapFromCache(nodes: CodeFile[], basePath: string = ""): Map<string, string> {
    const fileMap = new Map<string, string>();

    function collectFiles(nodes: CodeFile[], base: string = "") {
      for (const node of nodes) {
        const currentPath = base ? `${base}/${node.name}` : node.name;
        
        if (node.children === null || node.hasChildren === false) {
          // This is a file - get content from cache
          const content = fileCache.get(node.id);
          if (content) {
            fileMap.set(currentPath, content);
          }
        } else if (node.children && node.children.length > 0) {
          collectFiles(node.children, currentPath);
        }
      }
    }

    collectFiles(nodes, basePath);
    return fileMap;
  }

  function collectAllFiles(nodes: CodeFile[]): CodeFile[] {
    const files: CodeFile[] = [];
    
    function traverse(node: CodeFile) {
      if (node.children === null || node.hasChildren === false) {
        files.push(node);
      } else if (node.children && node.children.length > 0) {
        node.children.forEach(child => traverse(child));
      }
    }
    
    nodes.forEach(node => traverse(node));
    return files;
  }

  function buildWCTree(nodes: CodeFile[], fileMap: Map<string, string>, basePath: string = ""): any {
    const tree: any = {};

    nodes.forEach(node => {
      const currentPath = basePath ? `${basePath}/${node.name}` : node.name;

      if (node.children === null) {
        tree[node.name] = {
          file: { contents: fileMap.get(currentPath) || "" }
        };
      } else if (node.children && node.children.length > 0) {
        tree[node.name] = {
          directory: buildWCTree(node.children, fileMap, currentPath)
        };
      }
    });

    return tree;
  }

  // Collects all folders that contain a package.json (including root-level folders)
  function collectRunnableProjects(nodes: CodeFile[]): CodeFile[] {
    const projects: CodeFile[] = [];

    function walk(list: CodeFile[], isRoot: boolean = false) {
      for (const node of list) {
        if (node.children && node.children.length > 0) {
          const hasPackageJson = node.children.some((c) => c.name === "package.json");
          if (hasPackageJson) {
            projects.push(node);
          }
          // Continue walking through children
          walk(node.children, false);
        }
      }
    }

    // Start with root level
    walk(nodes, true);
    return projects;
  }

  type CandidateScore = {
    node: CodeFile;
    score: number;
    packageJsonContent: string;
  };

  async function selectBestFrontendProject(candidates: CodeFile[]): Promise<CandidateScore | null> {
    if (candidates.length === 0) return null;

    const scored: CandidateScore[] = await Promise.all(
      candidates.map(async (node) => {
        let score = 0;
        const nodeName = node.name.toLowerCase();
        const children = node.children || [];
        // Use plain array instead of Set — avoids TS downlevelIteration requirement
        const childNames: string[] = children.map((c) => c.name.toLowerCase());

        if (/(frontend|client|web|ui)/.test(nodeName)) score += 50;
        if (/(backend|server|api)/.test(nodeName)) score -= 40;

        if (childNames.some((n) => n.startsWith("vite.config"))) score += 35;
        if (childNames.some((n) => n.startsWith("next.config"))) score += 35;
        if (childNames.includes("angular.json")) score += 30;
        if (childNames.includes("index.html")) score += 15;

        const hasSrcFolder = children.some((c) => c.name.toLowerCase() === "src" && c.children !== null);
        if (hasSrcFolder) score += 10;

        let packageJsonContent = "";
        const packageJsonNode = children.find((c) => c.name === "package.json");
        if (packageJsonNode) {
          packageJsonContent =
            fileCache.get(packageJsonNode.id) || (await fetchFileContent(packageJsonNode.id));
        }

        try {
          const pkg = JSON.parse(packageJsonContent);
          const scripts = pkg?.scripts || {};
          const allDeps = {
            ...(pkg?.dependencies || {}),
            ...(pkg?.devDependencies || {}),
          };
          const depKeys = Object.keys(allDeps).map((d) => d.toLowerCase());

          if (scripts.dev) score += 15;
          if (scripts.start) score += 10;
          if (scripts.serve) score += 8;

          const hasFrontendDeps = depKeys.some((d) =>
            ["react", "next", "vue", "@angular/core", "svelte", "vite"].includes(d)
          );
          const hasBackendDeps = depKeys.some((d) =>
            ["express", "koa", "fastify", "@nestjs/core", "hono"].includes(d)
          );

          if (hasFrontendDeps) score += 35;
          if (hasBackendDeps && !hasFrontendDeps) score -= 25;
          if (pkg?.workspaces) score -= 10;
        } catch {
          // Ignore invalid package.json content and keep structural score
        }

        return { node, score, packageJsonContent };
      })
    );

    scored.sort((a, b) => b.score - a.score);
    return scored[0];
  }

  // Checks if a project is backend-only (Java, Python, Go, .NET — not runnable in WebContainer)
  function isBackendOnly(nodes: CodeFile[]): { is: boolean; type: string } {
    // Check root level first
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        const names = node.children.map(c => c.name.toLowerCase());
        
        // Java/Spring Boot
        if (names.includes('pom.xml') || names.some(n => n.endsWith('.java')))
          return { is: true, type: 'Spring Boot (Java)' };
        if (names.includes('build.gradle'))
          return { is: true, type: 'Gradle (Java)' };
        
        // Python
        if (names.includes('manage.py'))
          return { is: true, type: 'Django (Python)' };
        
        // Check if it's Python backend (has requirements.txt but no frontend indicators)
        if (names.includes('requirements.txt')) {
          const hasFrontendIndicators = names.some(n => 
            n === 'package.json' || 
            n.startsWith('vite.config') || 
            n.startsWith('next.config') ||
            n === 'angular.json'
          );
          if (!hasFrontendIndicators) {
            return { is: true, type: 'Python' };
          }
        }
        
        // Go
        if (names.includes('go.mod'))
          return { is: true, type: 'Go' };
        
        // .NET
        if (names.some(n => n.endsWith('.csproj')))
          return { is: true, type: '.NET' };
      }
    }
    return { is: false, type: '' };
  }

  async function runProject() {
    // Show console when user clicks run
    setShowConsole(true);
    
    // Pick only the folder matching the selected title
    let runTree: CodeFile[] = [];
    if (selectedTitle && fullTree.length > 0) {
      const match = fullTree.find(
        (node) => node.name.toLowerCase() === selectedTitle.toLowerCase()
      );
      runTree = match ? [match] : fullTree;
    } else {
      runTree = fullTree.length > 0 ? fullTree : tree;
    }

    if (!webcontainer) {
      if (webContainerError) {
        addLog("⚠️ WebContainer not supported in this environment");
        addLog("💡 Tip: WebContainer needs special server headers (Cross-Origin-Isolated)");
      } else {
        addLog("❌ WebContainer not initialized");
      }
      return;
    }
    
    if (runTree.length === 0) {
      addLog("❌ No project files loaded");
      return;
    }

    if (isServerRunning && previewUrl) {
      setShowPreview(true);
      addLog("✅ Showing existing preview");
      return;
    }

    setIsRunning(true);
    setLogs([]);
    addLog(`🚀 Starting "${selectedTitle}"...`);

    try {
      // First, check if the selected folder itself has package.json (root-level project)
      let runnableProject: CodeFile | null = null;
      let bestCandidate: CandidateScore | null = null;
      
      // Check if the root folder itself is a runnable project
      if (runTree.length === 1 && runTree[0].children && runTree[0].children.length > 0) {
        const rootNode = runTree[0];
        const hasPackageJson = rootNode.children!.some((c) => c.name === "package.json");
        
        if (hasPackageJson) {
          addLog(`✅ Found package.json in root: ${rootNode.name}`);
          
          // Check if it's backend-only
          const backendCheck = isBackendOnly([rootNode]);
          if (backendCheck.is) {
            addLog(`⚠️ "${selectedTitle}" is a ${backendCheck.type} project`);
            addLog("❌ Backend projects cannot run in the browser");
            addLog("💡 To run this project locally:");
            if (backendCheck.type.includes('Java')) {
              addLog("   1. mvn clean install");
              addLog("   2. mvn spring-boot:run");
            } else if (backendCheck.type.includes('Python')) {
              addLog("   1. pip install -r requirements.txt");
              addLog("   2. python manage.py runserver");
            } else if (backendCheck.type.includes('Go')) {
              addLog("   1. go mod tidy");
              addLog("   2. go run main.go");
            } else if (backendCheck.type.includes('.NET')) {
              addLog("   1. dotnet restore");
              addLog("   2. dotnet run");
            }
            setIsRunning(false);
            return;
          }
          
          // It's a frontend project at root level
          runnableProject = rootNode;
          
          // Score it
          const candidates = await selectBestFrontendProject([rootNode]);
          bestCandidate = candidates;
        }
      }
      
      // If no root-level project found, search in nested folders
      if (!runnableProject) {
        addLog("🔍 Looking for runnable frontend project in subfolders...");
        const runnableProjects = collectRunnableProjects(runTree);
        
        if (runnableProjects.length === 0) {
          addLog("❌ No runnable frontend project found");
          addLog("💡 A project needs a package.json to run in the browser");
          setIsRunning(false);
          return;
        }
        
        bestCandidate = await selectBestFrontendProject(runnableProjects);
        runnableProject = bestCandidate?.node || null;
      }

      if (!runnableProject || !bestCandidate) {
        addLog("❌ No runnable frontend project found");
        addLog("💡 A project needs a package.json to run in the browser");
        setIsRunning(false);
        return;
      }

      addLog(`✅ Found: ${runnableProject.name}`);
      addLog(`🎯 Selected best frontend candidate (score: ${bestCandidate.score})`);
      
      // Log what was detected
      const children = runnableProject.children || [];
      const hasViteConfig = children.some(c => c.name.toLowerCase().startsWith('vite.config'));
      const hasNextConfig = children.some(c => c.name.toLowerCase().startsWith('next.config'));
      const hasAngularJson = children.some(c => c.name === 'angular.json');
      const hasCreateReactApp = children.some(c => c.name === 'react-scripts');
      
      if (hasViteConfig) addLog("⚡ Detected: Vite project");
      else if (hasNextConfig) addLog("▲ Detected: Next.js project");
      else if (hasAngularJson) addLog("🔴 Detected: Angular project");
      else if (hasCreateReactApp) addLog("⚛️ Detected: Create React App");
      else addLog("📦 Detected: Node.js project");

      addLog("📦 Building file structure from cache...");
      const fileMap = buildFileMapFromCache([runnableProject]);
      addLog(`✅ Using ${fileMap.size} cached files`);

      addLog("🏗️ Building WebContainer structure...");
      const wcTree = buildWCTree([runnableProject], fileMap);

      addLog("📁 Mounting...");
      await webcontainer.mount(wcTree);
      addLog("✅ Mounted");

      // Find package.json content
      let packageJson = bestCandidate.packageJsonContent;
      if (!packageJson) {
        fileMap.forEach((content, path) => {
          if (path.endsWith("package.json") && !path.includes("node_modules")) {
            packageJson = content;
          }
        });
      }

      if (packageJson) {
        const cwd = `/${runnableProject.name}`;
        addLog(`📦 Installing in ${cwd}...`);
        
        const installProc = await webcontainer.spawn("npm", ["install"], { cwd });
        installProc.output.pipeTo(new WritableStream({ write: (d) => addLog(d) }));

        const exitCode = await installProc.exit;
        if (exitCode !== 0) {
          addLog("❌ Install failed");
          setIsRunning(false);
          return;
        }
        addLog("✅ Installed");

        // Detect the right start command
        let cmd = "dev";
        try {
          const pkg = JSON.parse(packageJson);
          if (pkg.scripts?.dev) cmd = "dev";
          else if (pkg.scripts?.start) cmd = "start";
          else if (pkg.scripts?.serve) cmd = "serve";
        } catch (e) {}

        addLog(`🚀 Starting (npm run ${cmd})...`);
        const devProc = await webcontainer.spawn("npm", ["run", cmd], { cwd });
        devProc.output.pipeTo(new WritableStream({ write: (d) => addLog(d) }));

        webcontainer.on("server-ready", (port, url) => {
          addLog(`✅ Ready: ${url}`);
          addLog("🎉 Project is live!");
          setPreviewUrl(url);
          setShowPreview(true);
          setIsServerRunning(true);
        });
      } else {
        addLog("❌ No package.json found in project");
        addLog("💡 Cannot run without package.json");
      }
    } catch (error) {
      addLog(`❌ Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  }

  const filteredTitles = titles.filter(t =>
    String(t).toLowerCase().includes(titleSearch.toLowerCase())
  );

  // ─── RENDER ────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-[#020414]" style={{fontFamily:"'Sora',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;800;900&family=Sora:wght@300;400;500;600&display=swap');
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes pulseGlow { 0%,100%{opacity:1} 50%{opacity:.3} }
      `}</style>
      {/* ── Sidebar ── */}
      {view === "tree" && (
        <div id="sidebar-container" className="bg-[#0a0e1a] border-r border-[#1a1f2e] flex flex-col relative" style={{ width: `${sidebarWidth}px` }}>
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#1a1f2e]" style={{background:"rgba(0,245,255,.03)"}}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{background:"linear-gradient(135deg,#00f5ff,#7c3aed)"}}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div className="flex-1">
              <h1 style={{fontFamily:"'Orbitron',monospace",fontWeight:800,fontSize:"0.85rem",background:"linear-gradient(90deg,#00f5ff,#a855f7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>OXYBFS.AI</h1>
              <p className="text-[#6c7a8a] text-[10px] font-medium mt-0.5">
                {selectedTitle}
              </p>
            </div>
          </div>
        </div>

        {/* ── Tree View ── */}
        <>
          {/* Back button + Run */}
          <div className="p-2 border-b border-[#1a1f2e] space-y-1.5" style={{background:"rgba(0,0,0,.2)"}}>
              <button
                onClick={handleBackToTitles}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs font-medium text-[#a0aec0] hover:bg-[#1a1f2e] transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                All Projects
              </button>

              <button
                onClick={runProject}
                disabled={isRunning || webContainerError || tree.length === 0 || isPreloading}
                className="w-full px-2 py-2 text-white rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{background:isRunning||isPreloading?"rgba(0,245,255,.2)":"linear-gradient(135deg,rgba(0,245,255,.18),rgba(124,58,237,.12))",border:"1px solid rgba(0,245,255,.3)"}}
              >
                {isRunning ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Running...
                  </>
                ) : webContainerError ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Not Supported
                  </>
                ) : isPreloading ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading Files...
                  </>
                ) : isServerRunning ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                    Show Preview
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                    Run Project
                  </>
                )}
              </button>
            </div>

            {/* File tree */}
            <div className="flex-1 overflow-y-auto p-2" style={{background:"rgba(0,0,0,.15)"}}>
              {loadingTree && tree.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-2.5">
                  <div className="w-8 h-8 border-2 border-[#1a1f2e] border-t-[#00f5ff] rounded-full animate-spin"></div>
                  <p className="text-[#6c7a8a] font-medium text-[10px]">Loading project...</p>
                  <p className="text-[#00f5ff] text-[10px]">{selectedTitle}</p>
                </div>
              ) : tree.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-2">
                  <div className="w-10 h-10 bg-[#1a1f2e] rounded flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#6c7a8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <p className="text-[#6c7a8a] text-[10px]">No files found</p>
                </div>
              ) : (
                <>
                  {/* File count badge */}
                  <div className="mb-2 px-2 py-1 rounded text-[9px] font-semibold" style={{background:"rgba(0,245,255,.05)",color:"#00f5ff",border:"1px solid rgba(0,245,255,.2)"}}>
                    {collectAllFiles(tree).length} files in project
                  </div>
                  <FileTreeView
                    nodes={tree}
                    onFileClick={handleFileClick}
                    selectedFile={selectedFile}
                    autoExpandTitles={selectedTitle ? [selectedTitle] : []}
                  />
                </>
              )}
            </div>
          </>
        </div>
      )}

      {/* Resizer */}
      {view === "tree" && (
        <div
          className="w-1 bg-transparent hover:bg-[#00f5ff] cursor-col-resize transition-colors relative group"
          onMouseDown={() => setIsResizing(true)}
        >
          <div className="absolute inset-0 w-3 -left-1" />
        </div>
      )}

      {/* ── Main Content ── */}
      <div id="main-content" className="flex-1 flex flex-col overflow-hidden" style={{background:"#020414"}}>
        {showPreview ? (
          <>
            <div className="border-b border-[#1a1f2e] px-4 py-2.5 flex items-center justify-between" style={{background:"rgba(0,245,255,.03)"}}>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded flex items-center justify-center" style={{background:"linear-gradient(135deg,#00f5ff,#7c3aed)"}}>
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-white font-semibold text-xs" style={{fontFamily:"'Orbitron',monospace"}}>Live Preview</h2>
                  <p className="text-[#00f5ff] text-[10px] font-medium">Running</p>
                </div>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="px-2.5 py-1 rounded text-[10px] font-medium transition-colors flex items-center gap-1"
                style={{background:"rgba(255,255,255,.05)",color:"#a0aec0",border:"1px solid rgba(255,255,255,.1)"}}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.1)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.05)"}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close
              </button>
            </div>

            <div className="flex-1" style={{background:"#020414"}}>
              {previewUrl ? (
                <iframe src={previewUrl} className="w-full h-full border-0" title="Preview" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="w-8 h-8 border-2 border-[#e5e5e5] border-t-[#007acc] rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Horizontal Resizer for Console */}
            <div
              className="h-1 bg-transparent hover:bg-[#00f5ff] cursor-row-resize transition-colors relative group"
              onMouseDown={() => setIsResizingConsole(true)}
            >
              <div className="absolute inset-0 h-3 -top-1" />
            </div>

            <div className="bg-[#0a0e1a] border-t border-[#1a1f2e] overflow-y-auto" style={{ height: `${consoleHeight}%` }}>
              <div className="p-2.5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded flex items-center justify-center" style={{background:"linear-gradient(135deg,#00f5ff,#7c3aed)"}}>
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-[#00f5ff] font-semibold text-xs" style={{fontFamily:"'Orbitron',monospace"}}>Console</h3>
                </div>
                <div className="font-mono text-[10px] space-y-0.5">
                  {logs.map((log, i) => (
                    <div key={i} className="text-[#a0aec0]">{log}</div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : selectedFile ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* VS Code-like Tab Bar */}
            {openFiles.length > 0 && (
              <div className="flex items-center border-b border-[#1a1f2e] overflow-x-auto flex-shrink-0" style={{background:"rgba(0,0,0,.2)",scrollbarWidth:"thin"}}>
                {openFiles.map((file) => {
                  const isActive = selectedFile?.id === file.id;
                  return (
                    <div
                      key={file.id}
                      onClick={() => handleTabClick(file)}
                      className="flex items-center gap-2 px-3 py-2 border-r border-[#1a1f2e] cursor-pointer transition-colors group relative"
                      style={{
                        background: isActive ? "rgba(0,245,255,.05)" : "transparent",
                        borderBottom: isActive ? "2px solid #00f5ff" : "2px solid transparent",
                        minWidth: "120px",
                        maxWidth: "200px"
                      }}
                      onMouseEnter={e => {
                        if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,.02)";
                      }}
                      onMouseLeave={e => {
                        if (!isActive) e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <span className="text-xs">{getFileIcon(file.name)}</span>
                      <span 
                        className="flex-1 text-xs font-medium truncate" 
                        style={{color: isActive ? "#00f5ff" : "#a0aec0"}}
                      >
                        {file.name}
                      </span>
                      <button
                        onClick={(e) => handleCloseFile(file.id, e)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-[#1a1f2e]"
                        title="Close"
                      >
                        <svg className="w-3 h-3" style={{color: isActive ? "#00f5ff" : "#6c7a8a"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* File Header */}
            <div className="border-b border-[#1a1f2e] px-4 py-2 flex-shrink-0" style={{background:"rgba(0,245,255,.03)"}}>
              <div className="flex items-center gap-2.5">
                <span className="text-base">{getFileIcon(selectedFile.name)}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-white font-semibold text-xs" style={{fontFamily:"'Orbitron',monospace"}}>{selectedFile.name}</h2>
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-medium" style={{background:"rgba(0,245,255,.1)",color:"#00f5ff"}}>{getLanguageLabel(selectedFile.name)}</span>
                  </div>
                  <p className="text-[#6c7a8a] text-[9px] font-medium mt-0.5">{getFilePath(selectedFile, tree)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(fileContent)}
                    className="px-2.5 py-1 text-white rounded text-[10px] font-medium transition-colors flex items-center gap-1"
                    style={{background:"linear-gradient(135deg,rgba(0,245,255,.18),rgba(124,58,237,.12))",border:"1px solid rgba(0,245,255,.3)"}}
                    onMouseEnter={e => e.currentTarget.style.background = "linear-gradient(135deg,rgba(0,245,255,.28),rgba(124,58,237,.2))"}
                    onMouseLeave={e => e.currentTarget.style.background = "linear-gradient(135deg,rgba(0,245,255,.18),rgba(124,58,237,.12))"}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </button>
                  <button
                    onClick={(e) => handleCloseFile(selectedFile.id, e)}
                    className="px-2 py-1 rounded text-[10px] font-medium transition-colors"
                    style={{background:"rgba(255,255,255,.05)",color:"#a0aec0",border:"1px solid rgba(255,255,255,.1)"}}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.1)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.05)"}
                    title="Close File"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto" style={{background:"#0a0e1a"}}>
              {loadingContent ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-[#1a1f2e] border-t-[#00f5ff] rounded-full animate-spin mb-2.5"></div>
                    <p className="text-[#6c7a8a] font-medium text-[10px]">Loading file...</p>
                  </div>
                </div>
              ) : (
                <CodeBlock code={fileContent} fileName={selectedFile.name} />
              )}
            </div>

            {/* VS Code-like Status Bar */}
            <div className="flex items-center justify-between px-4 py-1 border-t border-[#1a1f2e] text-[10px] flex-shrink-0" style={{background:"rgba(0,0,0,.3)"}}>
              <div className="flex items-center gap-4">
                <span className="text-[#6c7a8a]">
                  <span className="text-[#00f5ff] font-semibold">{getLanguageLabel(selectedFile.name)}</span>
                </span>
                <span className="text-[#6c7a8a]">
                  {fileContent.split('\n').length} lines
                </span>
                <span className="text-[#6c7a8a]">
                  {fileContent.length} characters
                </span>
                <span className="text-[#6c7a8a]">
                  UTF-8
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#6c7a8a]">
                  {openFiles.length} file{openFiles.length !== 1 ? 's' : ''} open
                </span>
                <span className="text-[#00f5ff] font-semibold" style={{fontFamily:"'Orbitron',monospace"}}>OXYBFS.AI</span>
              </div>
            </div>

            {(isRunning || isServerRunning || (logs.length > 0 && showConsole)) && (
              <>
                {!isConsoleMinimized && (
                  <>
                    {/* Horizontal Resizer for Console */}
                    <div
                      className="h-1 bg-transparent hover:bg-[#007acc] cursor-row-resize transition-colors relative group"
                      onMouseDown={() => setIsResizingConsole(true)}
                    >
                      <div className="absolute inset-0 h-3 -top-1" />
                    </div>

                    <div className="bg-[#1e1e1e] border-t border-[#2d2d2d] overflow-y-auto" style={{ height: `${consoleHeight}%` }}>
                      <div className="p-2.5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-[#007acc] rounded flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <h3 className="text-[#cccccc] font-semibold text-xs">Console</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setLogs([])}
                              className="text-[#cccccc] hover:text-white transition-colors p-1 text-[9px]"
                              title="Clear Console"
                            >
                              Clear
                            </button>
                            <button
                              onClick={() => setIsConsoleMinimized(true)}
                              className="text-[#cccccc] hover:text-white transition-colors p-1"
                              title="Minimize Console"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="font-mono text-[10px] space-y-0.5">
                          {logs.map((log, i) => (
                            <div key={i} className="text-[#cccccc]">{log}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {isConsoleMinimized && (
                  <div className="bg-[#1e1e1e] border-t border-[#2d2d2d] px-2.5 py-1.5 flex items-center justify-between cursor-pointer hover:bg-[#252525] transition-colors" onClick={() => setIsConsoleMinimized(false)}>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#007acc] rounded flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-[#cccccc] font-semibold text-[10px]">Console</h3>
                      <span className="text-[#6c6c6c] text-[9px]">({logs.length} logs)</span>
                    </div>
                    <svg className="w-3.5 h-3.5 text-[#cccccc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </div>
                )}
              </>
            )}
          </div>
        ) : isPreloading ? (
          <div className="flex-1 flex items-center justify-center" style={{background:"#020414"}}>
            <div className="text-center">
              <div className="w-14 h-14 rounded flex items-center justify-center mx-auto mb-3" style={{background:"rgba(0,245,255,.05)",border:"1px solid rgba(0,245,255,.2)"}}>
                <div className="w-10 h-10 border-2 border-[#00f5ff] border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h2 className="text-base font-semibold text-white mb-1.5" style={{fontFamily:"'Orbitron',monospace"}}>Loading Files</h2>
              <p className="text-[#6c7a8a] text-xs">Preparing project files...</p>
            </div>
          </div>
        ) : view === "titles" ? (
          <div className="flex-1 flex flex-col overflow-hidden" style={{background:"#020414"}}>
            {/* Header */}
            <div className="border-b border-[#1a1f2e] px-6 py-4" style={{background:"rgba(0,245,255,.03)"}}>
              <h2 className="text-2xl font-bold text-white mb-1" style={{fontFamily:"'Orbitron',monospace"}}>Projects</h2>
              <p className="text-[#6c7a8a] text-sm">Select a project to explore and run</p>
            </div>

            {/* Projects Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingTitles ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-12 h-12 border-3 border-[#1a1f2e] border-t-[#00f5ff] rounded-full animate-spin mb-3"></div>
                    <p className="text-[#6c7a8a] font-medium text-sm">Loading projects...</p>
                  </div>
                </div>
              ) : filteredTitles.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#1a1f2e] rounded-lg flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-[#6c7a8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p className="text-[#6c7a8a] text-sm">No projects found</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredTitles.map((title, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleTitleClick(title)}
                      className="group rounded-lg p-5 hover:shadow-lg transition-all duration-200 text-left"
                      style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)"}}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = "rgba(0,245,255,.3)";
                        e.currentTarget.style.boxShadow = "0 0 24px rgba(0,245,255,.1)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,.06)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform" style={{background:"linear-gradient(135deg,#00f5ff,#7c3aed)"}}>
                          <span className="text-white font-bold text-lg">
                            {title.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-sm mb-1 truncate group-hover:text-[#00f5ff] transition-colors" style={{fontFamily:"'Orbitron',monospace"}}>
                            {title}
                          </h3>
                          <p className="text-[#6c7a8a] text-xs">Project Folder</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t" style={{borderColor:"rgba(255,255,255,.05)"}}>
                        <span className="text-[#6c7a8a] text-xs">Click to explore</span>
                        <svg className="w-4 h-4 text-[#00f5ff] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Stats */}
            {!loadingTitles && titles.length > 0 && (
              <div className="border-t border-[#1a1f2e] px-6 py-3" style={{background:"rgba(0,0,0,.2)"}}>
                <p className="text-xs text-[#6c7a8a] text-center">
                  Showing {filteredTitles.length} of {titles.length} project{titles.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center" style={{background:"#020414"}}>
            <div className="text-center">
              <div className="w-16 h-16 rounded flex items-center justify-center mx-auto mb-3" style={{background:"rgba(0,245,255,.05)",border:"1px solid rgba(0,245,255,.2)"}}>
                <svg className="w-8 h-8 text-[#00f5ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h2 className="text-sm font-semibold text-white mb-1" style={{fontFamily:"'Orbitron',monospace"}}>Select a File</h2>
              <p className="text-[#6c7a8a] text-xs">Choose from <span className="font-semibold text-[#00f5ff]">{selectedTitle}</span> to view code</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────

interface FileTreeViewProps {
  nodes: CodeFile[];
  onFileClick: (file: CodeFile) => void;
  selectedFile: CodeFile | null;
  level?: number;
  autoExpandTitles?: string[];
}

function FileTreeView({ nodes, onFileClick, selectedFile, level = 0, autoExpandTitles }: FileTreeViewProps) {
  return (
    <div className="space-y-1">
      {nodes.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          onFileClick={onFileClick}
          selectedFile={selectedFile}
          level={level}
          autoExpand={autoExpandTitles?.some(t => t.toLowerCase() === node.name.toLowerCase()) ?? false}
          autoExpandTitles={autoExpandTitles}
        />
      ))}
    </div>
  );
}

interface TreeNodeProps {
  node: CodeFile;
  onFileClick: (file: CodeFile) => void;
  selectedFile: CodeFile | null;
  level: number;
  autoExpand?: boolean;
  autoExpandTitles?: string[];
}

function TreeNode({ node, onFileClick, selectedFile, level, autoExpand = false, autoExpandTitles }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(autoExpand);
  const isFolder = node.children !== null && node.children !== undefined;
  const isSelected = selectedFile?.id === node.id;
  const isLoading = node.isLoading;

  return (
    <div>
      <div
        className={`flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer transition-colors ${
          isSelected ? "bg-[#1a1f2e] text-white" : "hover:bg-[#1a1f2e] text-[#a0aec0]"
        }`}
        style={{ paddingLeft: `${level * 10 + 8}px` }}
        onClick={() => isFolder ? setExpanded(!expanded) : onFileClick(node)}
      >
        {isFolder && (
          isLoading ? (
            <div className="w-2.5 h-2.5 border border-[#00f5ff] border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className={`w-2.5 h-2.5 transition-transform text-[#6c7a8a] ${expanded ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )
        )}
        <span className="text-sm">{isFolder ? (expanded ? "📂" : "📁") : getFileIcon(node.name)}</span>
        <span className="flex-1 text-xs font-normal truncate">{node.name}</span>
        {!isFolder && <span className="text-[9px] px-1 py-0.5 rounded font-medium" style={{background:"rgba(0,245,255,.1)",color:"#00f5ff"}}>{getFileExtension(node.name)}</span>}
        {isLoading && <span className="text-[9px] text-[#00f5ff]">Loading...</span>}
      </div>
      {isFolder && expanded && node.children && node.children.length > 0 && (
        <FileTreeView nodes={node.children} onFileClick={onFileClick} selectedFile={selectedFile} level={level + 1} autoExpandTitles={autoExpandTitles} />
      )}
    </div>
  );
}

function CodeBlock({ code, fileName }: { code: string; fileName?: string }) {
  const lines = code.split("\n");
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  
  return (
    <div className="flex h-full w-full" style={{background:"#0a0e1a"}}>
      <div className="text-right py-3 px-3 font-mono text-xs border-r select-none flex-shrink-0" style={{background:"rgba(0,0,0,.2)",color:"#6c7a8a",borderColor:"#1a1f2e",minWidth:"50px"}}>
        {lines.map((_, i) => (
          <div 
            key={i} 
            className="leading-5 px-1 transition-colors" 
            style={{
              background: hoveredLine === i ? "rgba(0,245,255,.05)" : "transparent",
              color: hoveredLine === i ? "#00f5ff" : "#6c7a8a"
            }}
            onMouseEnter={() => setHoveredLine(i)}
            onMouseLeave={() => setHoveredLine(null)}
          >
            {i + 1}
          </div>
        ))}
      </div>
      <div className="flex-1 overflow-auto">
        <pre 
          className="p-3 font-mono text-xs leading-5 min-h-full" 
          style={{color:"#e2e8f0"}}
        >
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

function getFileIcon(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase();
  const icons: Record<string, string> = {
    js: "🟨", jsx: "⚛️", ts: "🔷", tsx: "⚛️", java: "☕", py: "🐍",
    html: "🌐", css: "🎨", json: "📋", md: "📝"
  };
  return icons[ext || ""] || "📄";
}

function getFileExtension(name: string): string {
  return name.split(".").pop()?.toUpperCase() || "FILE";
}

function getLanguageLabel(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase();
  const langs: Record<string, string> = {
    js: "JavaScript", jsx: "React", ts: "TypeScript", tsx: "React TS",
    java: "Java", py: "Python", html: "HTML", css: "CSS", json: "JSON",
    md: "Markdown", xml: "XML", yml: "YAML", yaml: "YAML", sql: "SQL"
  };
  return langs[ext || ""] || "Text";
}

function getFilePath(file: CodeFile, tree: CodeFile[]): string {
  const path: string[] = [];
  
  function findPath(nodes: CodeFile[], target: CodeFile, currentPath: string[] = []): boolean {
    for (const node of nodes) {
      if (node.id === target.id) {
        path.push(...currentPath, node.name);
        return true;
      }
      if (node.children && node.children.length > 0) {
        if (findPath(node.children, target, [...currentPath, node.name])) {
          return true;
        }
      }
    }
    return false;
  }
  
  findPath(tree, file);
  return path.join(" / ") || file.name;
}
