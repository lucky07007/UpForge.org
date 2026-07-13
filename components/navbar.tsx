//components/navbar.tsx

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import {
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Search,
  Sparkles,
  Sun,
  Moon,
  Loader2,
} from "lucide-react";

import { useTheme } from "next-themes";

type NavLink = {
  name: string;
  href: string;
};

type Suggestion = {
  title: string;
  type: string;
  href: string;
  subtitle?: string;
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
  const suggestionClickedRef = useRef(false);
  const navigationInProgressRef = useRef(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setIsOpen(false);
    setShowDropdown(false);
    setSearchQuery("");
    setIsSearchFocused(false);
    setSelectedIndex(-1);
  }, [pathname]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowDropdown(false);
        setIsSearchFocused(false);
        setSelectedIndex(-1);
        searchInputRef.current?.blur();
        mobileSearchInputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // FIXED: Outside click - ONLY closes mobile menu, NOT suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;

      // NEVER close suggestion dropdown from outside clicks
      // It only closes when: X clicked, text cleared, or suggestion selected

      // Check if click is inside mobile dropdown (search suggestions)
      if (mobileDropdownRef.current?.contains(target)) {
        return; // Inside dropdown - do nothing
      }

      // Check if click is inside desktop dropdown
      if (dropdownRef.current?.contains(target)) {
        return; // Inside dropdown - do nothing
      }

      // Desktop search - close only if clicking completely outside
      if (dropdownRef.current && !dropdownRef.current.contains(target) && !navRef.current?.contains(target)) {
        setShowDropdown(false);
        setIsSearchFocused(false);
        setSelectedIndex(-1);
      }

      // Close mobile menu only if clicking outside both nav and mobile menu
      if (isOpen) {
        const clickedInsideNav = navRef.current?.contains(target);
        const clickedInsideMobileMenu = mobileMenuRef.current?.contains(target);
        
        // Mobile dropdown stays open even when mobile menu closes
        // Only close mobile menu, NOT dropdown
        if (!clickedInsideNav && !clickedInsideMobileMenu) {
          setIsOpen(false);
          // Do NOT close showDropdown here - it stays open
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside, true);
    document.addEventListener("touchstart", handleClickOutside, { passive: false, capture: true });
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
      document.removeEventListener("touchstart", handleClickOutside, true);
    };
  }, [isOpen]);

  useEffect(() => {
    let abortController: AbortController | null = null;

    const fetchSuggestions = async () => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        // FIXED: Don't auto-close dropdown when text is cleared
        // Only close if it was showing results
        if (suggestions.length > 0) {
          setShowDropdown(false);
        }
        setSelectedIndex(-1);
        return;
      }

      if (abortController) {
        abortController.abort();
      }

      abortController = new AbortController();
      setIsLoading(true);
      setShowDropdown(true);

      try {
        const timeoutId = setTimeout(() => {
          if (abortController) abortController.abort();
        }, 5000);

        const res = await fetch(
          `/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`,
          { signal: abortController.signal }
        );

        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(`Search API error: ${res.status}`);

        const data = await res.json();
        const results = Array.isArray(data) ? data.slice(0, 8) : [];
        setSuggestions(results);
        setShowDropdown(true);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => {
      clearTimeout(timer);
      if (abortController) abortController.abort();
    };
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeAll = useCallback(() => {
    setIsOpen(false);
    setShowDropdown(false);
    setIsSearchFocused(false);
    setSelectedIndex(-1);
    searchInputRef.current?.blur();
    mobileSearchInputRef.current?.blur();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/registry?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
    closeAll();
  };

  // FIXED: Clear search - close dropdown
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setSuggestions([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
    // Focus the input after clearing
    setTimeout(() => {
      if (window.innerWidth < 768) {
        mobileSearchInputRef.current?.focus();
      } else {
        searchInputRef.current?.focus();
      }
    }, 50);
  }, []);

  // FIXED: Suggestion click handler
  const handleSuggestionClick = useCallback((href: string, e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      if ('nativeEvent' in e) {
        e.nativeEvent.stopImmediatePropagation();
        e.nativeEvent.preventDefault();
      }
    }

    suggestionClickedRef.current = true;
    navigationInProgressRef.current = true;
    
    // Clear everything and close
    setSearchQuery("");
    setSuggestions([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
    setIsOpen(false);
    
    router.push(href);
    
    setTimeout(() => {
      navigationInProgressRef.current = false;
    }, 150);
  }, [router]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || suggestions.length === 0) {
      if (e.key === "Enter") {
        handleSearch(e);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => prev < suggestions.length - 1 ? prev + 1 : 0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : suggestions.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSuggestionClick(suggestions[selectedIndex].href);
      } else {
        handleSearch(e);
      }
    }
  };

  const links: NavLink[] = [
    { name: "Home", href: "/" },
    { name: "Global Registry", href: "/registry" },
    { name: "Compare", href: "/compare" },
    { name: "Community", href: "/creators" },
    { name: "Journal", href: "/blog" },
    { name: "About", href: "/about" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const desktopClass = (href: string) =>
    `relative px-3 py-1.5 text-[13px] font-medium tracking-wide transition-all duration-200 rounded-md ${
      isActive(href)
        ? "text-foreground bg-accent/10 font-semibold"
        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
    }`;

  const getTypeBadgeClass = (type: string) => {
    if (type.includes("VERIFIED")) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
    if (type.includes("STARTUP")) return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
    if (type.includes("TOOL") || type.includes("ACTION")) return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800";
    if (type.includes("PAGE")) return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800";
    return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800";
  };

  const SearchSkeleton = () => (
    <div className="animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="px-4 py-3 border-b border-border/20 last:border-0">
          <div className="flex items-start gap-3">
            <div className="w-4 h-4 bg-muted rounded shrink-0 mt-0.5" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
            <div className="w-14 h-5 bg-muted rounded shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* HEADER */}
      <header
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-border/50"
            : "bg-background border-b border-border/30"
        }`}
      >
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          
          {/* BRAND */}
          <Link 
            href="/" 
            className="flex items-center gap-2.5 group shrink-0 touch-manipulation" 
            onClick={closeAll}
          >
            <div className="relative w-8 h-8 overflow-hidden rounded-lg shadow-sm ring-1 ring-border/50 group-hover:ring-foreground/20 transition-all duration-300">
              <Image
                src="/logo.jpg"
                alt="UpForge"
                fill
                className="object-cover"
                priority
              />
            </div>
            <span
              className="text-lg tracking-tight text-foreground font-bold"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
            >
              UpForge
            </span>
          </Link>

          {/* DESKTOP SEARCH */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative" ref={dropdownRef}>
            <form onSubmit={handleSearch} className="relative w-full">
              <div className={`relative transition-all duration-300 ${
                isSearchFocused ? 'ring-2 ring-foreground/10 rounded-xl' : ''
              }`}>
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${
                  isSearchFocused ? "text-foreground" : "text-muted-foreground"
                }`} />
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedIndex(-1);
                  }}
                  onFocus={() => {
                    setIsSearchFocused(true);
                    if (searchQuery.length >= 2 && suggestions.length > 0) setShowDropdown(true);
                  }}
                  onKeyDown={handleKeyDown}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  placeholder="Search startups, tools, blogs..."
                  className="w-full pl-11 pr-12 py-2.5 text-sm bg-muted/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 focus:bg-background transition-all duration-300"
                  aria-label="Search"
                  autoComplete="off"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {isLoading && <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />}
                  {searchQuery && !isLoading && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="p-1 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all"
                      aria-label="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* Desktop Dropdown */}
            {showDropdown && (
              <div 
                className="absolute top-full mt-2 left-0 right-0 bg-background border border-border/50 rounded-xl shadow-2xl z-[110] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                {isLoading && <SearchSkeleton />}

                {!isLoading && suggestions.length > 0 && (
                  <>
                    {suggestions.map((item, idx) => (
                      <button
                        key={idx}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSuggestionClick(item.href, e);
                        }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors border-b border-border/20 last:border-0 cursor-pointer ${
                          selectedIndex === idx ? "bg-muted/50" : "hover:bg-muted/30"
                        }`}
                      >
                        <Search size={14} className="text-muted-foreground mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-foreground font-medium truncate">{item.title}</div>
                          {item.subtitle && (
                            <div className="text-xs text-muted-foreground truncate mt-0.5">{item.subtitle}</div>
                          )}
                        </div>
                        <span className={`shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getTypeBadgeClass(item.type)}`}>
                          {item.type}
                        </span>
                      </button>
                    ))}
                    <div className="px-4 py-2.5 bg-muted/20 border-t border-border/30 flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 bg-muted rounded text-[9px] border border-border font-mono">↑↓</kbd>
                        Navigate
                        <kbd className="px-1.5 py-0.5 bg-muted rounded text-[9px] border border-border font-mono ml-1">↵</kbd>
                        Select
                      </span>
                      <span className="text-[10px] text-muted-foreground">{suggestions.length} results</span>
                    </div>
                  </>
                )}

                {!isLoading && suggestions.length === 0 && searchQuery.length >= 2 && (
                  <div className="px-4 py-6 text-center">
                    <Search size={24} className="text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-1">
                      No results for &ldquo;<span className="text-foreground font-medium">{searchQuery}</span>&rdquo;
                    </p>
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push(`/registry?q=${encodeURIComponent(searchQuery)}`);
                        setSearchQuery("");
                        closeAll();
                      }}
                      className="text-[13px] text-foreground hover:underline font-medium cursor-pointer"
                    >
                      Search all startups instead →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden xl:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={desktopClass(link.href)}
                onClick={closeAll}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* RIGHT SIDE ACTIONS */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <Link
              href="/verify"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border/50 text-[11px] font-semibold uppercase rounded-lg hover:bg-muted/50 hover:border-border transition-all duration-200"
              onClick={closeAll}
            >
              <ShieldCheck className="w-3 h-3" />
              Verify UFRN
            </Link>

            <Link
              href="/submit"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-foreground text-background text-[11px] font-bold uppercase rounded-lg hover:opacity-90 transition-all duration-200 shadow-sm"
              onClick={closeAll}
            >
              <Sparkles className="w-3 h-3" />
              Submit Startup
              <ChevronRight className="w-3 h-3" />
            </Link>

            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative w-10 h-5 rounded-full bg-muted border border-border/50 transition-colors duration-300 ease-in-out hover:bg-muted/80"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-background border border-border shadow-sm transition-all duration-300 ease-in-out flex items-center justify-center ${
                    theme === "dark" ? "translate-x-5" : "translate-x-0"
                  }`}
                >
                  {theme === "dark" ? (
                    <Moon size={10} className="text-foreground" />
                  ) : (
                    <Sun size={10} className="text-foreground" />
                  )}
                </div>
              </button>
            )}
          </div>

          {/* MOBILE CONTROLS */}
          <div className="md:hidden flex items-center gap-1">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative w-10 h-5 rounded-full bg-muted border border-border/50 transition-colors duration-300 ease-in-out hover:bg-muted/80"
                aria-label={`Switch theme`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-background border border-border shadow-sm transition-all duration-300 ease-in-out flex items-center justify-center ${
                    theme === "dark" ? "translate-x-5" : "translate-x-0"
                  }`}
                >
                  {theme === "dark" ? (
                    <Moon size={10} className="text-foreground" />
                  ) : (
                    <Sun size={10} className="text-foreground" />
                  )}
                </div>
              </button>
            )}
            <button
              className="p-2.5 text-foreground hover:bg-muted/50 rounded-lg transition-all"
              onClick={() => {
                setIsOpen(!isOpen);
              }}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div
        ref={mobileMenuRef}
        className={`fixed inset-0 z-[99] md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false);
              // Do NOT close showDropdown here
            }
          }}
        />

        {/* Menu Content */}
        <div 
          className={`absolute top-14 left-0 right-0 bg-background border-b border-border/50 shadow-2xl transition-all duration-300 max-h-[calc(100vh-3.5rem)] overflow-y-auto ${
            isOpen ? "translate-y-0" : "-translate-y-4"
          }`}
        >
          
          {/* MOBILE SEARCH - Always at top */}
          <div className="px-5 py-4 border-b border-border/30 relative">
            {/* Search Input */}
            <div className="relative">
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!searchQuery.trim()) return;
                router.push(`/registry?q=${encodeURIComponent(searchQuery.trim())}`);
                setSearchQuery("");
                closeAll();
              }} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  ref={mobileSearchInputRef}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedIndex(-1);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search startups, blogs..."
                  className="w-full pl-11 pr-10 py-3 text-base bg-muted/50 border border-border/50 rounded-xl focus:outline-none focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10"
                  aria-label="Search startups"
                  autoComplete="off"
                  style={{ fontSize: '16px' }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleClearSearch();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground"
                  >
                    <X size={16} />
                  </button>
                )}
              </form>

              {/* MOBILE DROPDOWN - Positioned ABOVE menu content, stays open until X clicked or text cleared */}
              {showDropdown && (
                <div 
                  ref={mobileDropdownRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-background border border-border/50 rounded-xl shadow-2xl z-[130] overflow-hidden max-h-72 overflow-y-auto touch-manipulation"
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchEnd={(e) => e.stopPropagation()}
                >
                  {isLoading && <SearchSkeleton />}

                  {!isLoading && suggestions.length > 0 && (
                    <>
                      {suggestions.map((item, idx) => (
                        <button
                          key={idx}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.nativeEvent.stopImmediatePropagation();
                            handleSuggestionClick(item.href, e);
                          }}
                          onTouchStart={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.nativeEvent.stopImmediatePropagation();
                            handleSuggestionClick(item.href, e);
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.nativeEvent.stopImmediatePropagation();
                            handleSuggestionClick(item.href, e);
                          }}
                          className="w-full text-left px-4 py-3.5 flex items-start gap-3 transition-colors border-b border-border/20 last:border-0 hover:bg-muted/30 active:bg-muted/50 cursor-pointer touch-manipulation select-none"
                          role="option"
                          aria-selected={selectedIndex === idx}
                        >
                          <Search size={14} className="text-muted-foreground mt-0.5 shrink-0 pointer-events-none" />
                          <div className="flex-1 min-w-0 pointer-events-none">
                            <div className="text-sm text-foreground font-medium truncate">{item.title}</div>
                            {item.subtitle && (
                              <div className="text-xs text-muted-foreground truncate mt-0.5">{item.subtitle}</div>
                            )}
                          </div>
                          <span className={`shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded border pointer-events-none ${getTypeBadgeClass(item.type)}`}>
                            {item.type}
                          </span>
                        </button>
                      ))}

                      <div className="px-4 py-2.5 bg-muted/20 border-t border-border/30">
                        <span className="text-[10px] text-muted-foreground">{suggestions.length} results</span>
                      </div>
                    </>
                  )}

                  {!isLoading && suggestions.length === 0 && searchQuery.length >= 2 && (
                    <div className="px-4 py-5 text-center">
                      <Search size={20} className="text-muted-foreground/40 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        No results for &ldquo;{searchQuery}&rdquo;
                      </p>
                      <button
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push(`/registry?q=${encodeURIComponent(searchQuery)}`);
                          setSearchQuery("");
                          closeAll();
                        }}
                        className="text-[13px] text-foreground hover:underline font-medium cursor-pointer"
                      >
                        Search all startups →
                      </button>
                    </div>
                  )}

                  {/* Close button at bottom */}
                  <div className="px-4 py-2 bg-muted/10 border-t border-border/20 flex justify-between items-center">
                    <span className="text-[10px] text-muted-foreground">
                      {searchQuery.length < 2 ? "Type to search" : `${suggestions.length} results`}
                    </span>
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleClearSearch();
                      }}
                      className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 rounded hover:bg-muted/50 transition-colors"
                    >
                      <X size={12} />
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* NAV LINKS */}
          <nav className="divide-y divide-border/30">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center justify-between px-5 py-4 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-foreground bg-accent/10 border-l-2 border-foreground"
                    : "text-muted-foreground border-l-2 border-transparent"
                }`}
                onClick={closeAll}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* MOBILE ACTIONS */}
          <div className="px-5 py-4 flex flex-col gap-3 border-t border-border/30 bg-muted/10">
            <Link
              href="/verify"
              className="flex items-center justify-center gap-2 px-4 py-3 border border-border/50 rounded-lg text-sm font-semibold uppercase"
              onClick={closeAll}
            >
              <ShieldCheck size={14} />
              Verify UFRN
            </Link>
            <Link
              href="/submit"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-foreground text-background rounded-lg text-sm font-bold uppercase"
              onClick={closeAll}
            >
              <Sparkles size={14} />
              Submit Startup
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
