import React, { createContext, useContext, useState, useEffect } from 'react';

// Interfaces for our custom file-system routing system
export interface RoutePattern {
  file: string;
  originalPath: string; // e.g. /berita/[id]
  routePath: string;    // e.g. /berita/:id
  regex: RegExp;
  paramKeys: string[];
  component: React.ComponentType<any>;
}

export interface RouterContextType {
  pathname: string;
  params: Record<string, string>;
  navigate: (path: string) => void;
  routes: RoutePattern[];
}

const RouterContext = createContext<RouterContextType | null>(null);

// Parses Vite import.meta.glob to build actual dynamic route matchers
export function buildRoutes(): RoutePattern[] {
  const modules = (import.meta as any).glob('/src/pages/**/*.tsx', { eager: true });
  const routesList: RoutePattern[] = [];

  for (const [file, module] of Object.entries(modules)) {
    const mod = module as any;
    if (!mod || !mod.default) continue;

    // Convert `/src/pages/blog/[id].tsx` -> `/blog/[id]`
    let relPath = file
      .replace(/^\/src\/pages/, '')
      .replace(/\.tsx$/, '');

    // Handle index routes (e.g., `/blog/index` -> `/blog`)
    if (relPath.endsWith('/index')) {
      relPath = relPath.substring(0, relPath.length - 6);
    }
    if (relPath === '/index' || relPath === '') {
      relPath = '/';
    }

    // Clean leading/trailing slashes for segment parsing, while preserving '/'
    let cleanRelPath = relPath;
    if (cleanRelPath !== '/' && cleanRelPath.endsWith('/')) {
      cleanRelPath = cleanRelPath.slice(0, -1);
    }

    const segments = cleanRelPath.split('/').filter(Boolean);
    const paramKeys: string[] = [];

    const regexSegments = segments.map(seg => {
      // Dynamic route syntax matches [paramName]
      if (seg.startsWith('[') && seg.endsWith(']')) {
        const paramName = seg.slice(1, -1);
        paramKeys.push(paramName);
        return '([^/]+)';
      }
      return seg.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    });

    // Make regex strict, optionally accommodating hash prefixes
    const regex = new RegExp(`^\\/${regexSegments.join('\\/')}$`);

    routesList.push({
      file,
      originalPath: relPath,
      routePath: relPath.replace(/\[([^\]]+)\]/g, ':$1'),
      regex,
      paramKeys,
      component: mod.default
    });
  }

  // Sort routes so that static paths are evaluated before dynamic paths
  // e.g., `/berita/kategori` matched before `/berita/[id]`
  return routesList.sort((a, b) => {
    const aLen = a.paramKeys.length;
    const bLen = b.paramKeys.length;
    if (aLen !== bLen) return aLen - bLen; // fewer dynamic keys first
    return b.originalPath.length - a.originalPath.length; // deeper path first
  });
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [routes] = useState<RoutePattern[]>(buildRoutes);
  
  // Get route path from window.location.pathname
  const getPath = () => {
    let path = window.location.pathname;
    if (!path) return '/';
    // Remove query params if any
    const queryIdx = path.indexOf('?');
    if (queryIdx !== -1) {
      path = path.substring(0, queryIdx);
    }
    return path || '/';
  };

  const [pathname, setPathname] = useState<string>(getPath);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(getPath());
    };

    window.addEventListener('popstate', handlePopState);
    // Set initially
    handlePopState();

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = (path: string) => {
    let targetPath = path;
    if (!targetPath.startsWith('/')) {
      targetPath = '/' + targetPath;
    }
    window.history.pushState({}, '', targetPath);
    setPathname(targetPath);
  };

  // Match the route and extract parameters
  let matchedParams: Record<string, string> = {};
  let currentCleanPath = pathname;
  if (currentCleanPath !== '/' && currentCleanPath.endsWith('/')) {
    currentCleanPath = currentCleanPath.slice(0, -1);
  }

  let matchedRoute = routes.find(r => currentCleanPath.match(r.regex));
  if (matchedRoute) {
    const matchMatch = currentCleanPath.match(matchedRoute.regex);
    if (matchMatch) {
      matchedRoute.paramKeys.forEach((key, idx) => {
        matchedParams[key] = decodeURIComponent(matchMatch[idx + 1]);
      });
    }
  }

  return (
    <RouterContext.Provider value={{ pathname, params: matchedParams, navigate, routes }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return ctx;
}

// Visual SPA Link component designed to feel luxurious
export function Link({ 
  to, 
  children, 
  className = '', 
  activeClassName = '',
  ...rest
}: { 
  to: string; 
  children: React.ReactNode; 
  className?: string;
  activeClassName?: string;
  [key: string]: any;
}) {
  const { pathname, navigate } = useRouter();
  
  // Normalize checking active status
  const normalizedTo = to.startsWith('/') ? to : '/' + to;
  const normalizedPath = pathname.startsWith('/') ? pathname : '/' + pathname;
  const isActive = normalizedPath === normalizedTo || 
    (normalizedTo !== '/' && normalizedPath.startsWith(normalizedTo + '/')) ||
    (normalizedTo === '/' && normalizedPath === '/');

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <a 
      href={`${to}`} 
      onClick={handleClick} 
      className={`${className} ${isActive ? activeClassName : ''}`}
    >
      {children}
    </a>
  );
}

export function RouteRenderer({ pageProps }: { pageProps: any }) {
  const { pathname, routes, navigate } = useRouter();
  
  // Clean paths
  let currentCleanPath = pathname;
  if (currentCleanPath !== '/' && currentCleanPath.endsWith('/')) {
    currentCleanPath = currentCleanPath.slice(0, -1);
  }

  const matchedRoute = routes.find(r => currentCleanPath.match(r.regex));

  if (!matchedRoute) {
    // 404 screen
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-4xl font-serif font-black text-emerald-900 mb-2">404</h1>
        <p className="text-sm text-gray-500 mb-6">Halaman tidak ditemukan di sistem MWCNU.</p>
        <button 
          onClick={() => navigate('/')} 
          className="bg-emerald-700 hover:bg-emerald-805 text-white font-semibold text-xs px-5 py-2 rounded-xl shadow-xs transition cursor-pointer"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const Component = matchedRoute.component;
  return <Component {...pageProps} />;
}
