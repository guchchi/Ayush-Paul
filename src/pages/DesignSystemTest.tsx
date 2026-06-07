import React, { useState, useEffect } from "react";
import { 
  Sun, 
  Moon, 
  Type, 
  Play, 
  CreditCard, 
  Grid, 
  CheckSquare, 
  Compass, 
  Settings, 
  ArrowRight,
  Eye,
  Info
} from "lucide-react";

export function DesignSystemTest() {
  const [isLightMode, setIsLightMode] = useState(() => {
    return document.documentElement.classList.contains("light");
  });

  const toggleTheme = () => {
    const nextMode = !isLightMode;
    setIsLightMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  };

  // Synchronize on load
  useEffect(() => {
    setIsLightMode(document.documentElement.classList.contains("light"));
  }, []);

  return (
    <div className="min-h-screen py-12 transition-colors duration-300 bg-bg-primary text-text-primary">
      {/* Top Banner / Hero */}
      <header className="border-b border-border-color pb-12 mb-12">
        <div className="layout-container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-4">
                <Settings className="w-3.5 h-3.5 animate-spin" /> Design System Test Suite
              </div>
              <h1 className="text-display mb-4">Foundation Tokens</h1>
              <p className="text-body-lg text-text-secondary max-w-2xl">
                A verification dashboard displaying global typography scales, spacing tokens, form states, responsive layouts, and interactive buttons under both default Dark mode and Light mode.
              </p>
            </div>
            
            {/* Quick Actions Panel */}
            <div className="flex flex-col gap-3 p-6 rounded-2xl bg-bg-secondary border border-border-color md:min-w-[300px]">
              <div className="text-caption text-text-muted mb-1">Theme Toggle</div>
              <button 
                onClick={toggleTheme}
                className="btn-base btn-primary w-full flex items-center justify-center gap-2"
              >
                {isLightMode ? (
                  <>
                    <Moon className="w-4 h-4" />
                    <span>Switch to Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4 text-black" />
                    <span className="text-black">Switch to Light Mode</span>
                  </>
                )}
              </button>
              <div className="text-[11px] text-center text-text-muted mt-2">
                Active Theme: <span className="font-bold text-brand-primary">{isLightMode ? "Light Mode" : "Dark Mode"}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Checklist */}
      <main className="layout-container space-y-16">
        
        {/* SECTION 1: COLOR PALETTE */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-border-color">
            <Settings className="w-5 h-5 text-brand-primary" />
            <h2 className="text-h2">1. Color Palette System</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="p-4 rounded-xl border border-border-color bg-bg-primary">
              <div className="w-full h-16 rounded-lg bg-brand-primary mb-3 shadow-md" />
              <div className="text-body-sm font-bold">Brand Primary</div>
              <div className="text-caption text-text-muted">{isLightMode ? "#2563EB" : "#3B82F6"}</div>
            </div>
            <div className="p-4 rounded-xl border border-border-color bg-bg-primary">
              <div className="w-full h-16 rounded-lg bg-brand-secondary mb-3 shadow-md" />
              <div className="text-body-sm font-bold">Brand Secondary</div>
              <div className="text-caption text-text-muted">#1D4ED8</div>
            </div>
            <div className="p-4 rounded-xl border border-border-color bg-bg-primary">
              <div className="w-full h-16 rounded-lg bg-bg-primary mb-3 border border-border-color" />
              <div className="text-body-sm font-bold">Bg Primary</div>
              <div className="text-caption text-text-muted">{isLightMode ? "#FAFAFA" : "#000000"}</div>
            </div>
            <div className="p-4 rounded-xl border border-border-color bg-bg-primary">
              <div className="w-full h-16 rounded-lg bg-bg-secondary mb-3 border border-border-color" />
              <div className="text-body-sm font-bold">Bg Secondary</div>
              <div className="text-caption text-text-muted">{isLightMode ? "#F4F4F5" : "#050505"}</div>
            </div>
            <div className="p-4 rounded-xl border border-border-color bg-bg-primary">
              <div className="w-full h-16 rounded-lg bg-bg-elevated mb-3 border border-border-color" />
              <div className="text-body-sm font-bold">Bg Elevated</div>
              <div className="text-caption text-text-muted">{isLightMode ? "#FFFFFF" : "#0A0A0A"}</div>
            </div>
            <div className="p-4 rounded-xl border border-border-color bg-bg-primary">
              <div className="w-full h-16 rounded-lg bg-text-primary mb-3" />
              <div className="text-body-sm font-bold">Text Primary</div>
              <div className="text-caption text-text-muted">{isLightMode ? "#111111" : "#FFFFFF"}</div>
            </div>
          </div>
        </section>

        {/* SECTION 2: TYPOGRAPHY SYSTEM */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-border-color">
            <Type className="w-5 h-5 text-brand-primary" />
            <h2 className="text-h2">2. Typography scale</h2>
          </div>
          
          <div className="space-y-8 p-8 rounded-2xl bg-bg-secondary border border-border-color">
            <div>
              <span className="text-caption text-text-muted block mb-1">text-display (3rem / 4.5rem)</span>
              <p className="text-display">Display Headline Text</p>
            </div>
            <hr className="border-border-color" />
            
            <div>
              <span className="text-caption text-text-muted block mb-1">text-h1 (2.25rem / 3rem)</span>
              <h1 className="text-h1">Heading 1 Text Example</h1>
            </div>
            <hr className="border-border-color" />
            
            <div>
              <span className="text-caption text-text-muted block mb-1">text-h2 (1.75rem / 2.25rem)</span>
              <h2 className="text-h2">Heading 2 Text Example</h2>
            </div>
            <hr className="border-border-color" />
            
            <div>
              <span className="text-caption text-text-muted block mb-1">text-h3 (1.25rem / 1.5rem)</span>
              <h3 className="text-h3">Heading 3 Text Example</h3>
            </div>
            <hr className="border-border-color" />
            
            <div>
              <span className="text-caption text-text-muted block mb-1">text-body-lg (1.125rem / 1.25rem)</span>
              <p className="text-body-lg">
                Body Large copy text. Perfect for introductions and high importance reading. It is clean, readable, and uses the Inter font family scaling nicely with responsive screen widths.
              </p>
            </div>
            <hr className="border-border-color" />
            
            <div>
              <span className="text-caption text-text-muted block mb-1">text-body-md (1rem)</span>
              <p className="text-body-md">
                Body Medium copy text. This is the main body standard text for paragraphs, general details, and system components. Let's make sure it reads comfortably.
              </p>
            </div>
            <hr className="border-border-color" />
            
            <div>
              <span className="text-caption text-text-muted block mb-1">text-body-sm (0.875rem)</span>
              <p className="text-body-sm">
                Body Small copy text. Perfect for secondary alerts, secondary card explanations, metadata notes, or details that require a smaller structural footprint.
              </p>
            </div>
            <hr className="border-border-color" />
            
            <div>
              <span className="text-caption text-text-muted block mb-1">text-caption (0.75rem, upper-mono)</span>
              <p className="text-caption">Caption text / System Metadata Label</p>
            </div>
          </div>
        </section>

        {/* SECTION 3: BUTTON SYSTEM */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-border-color">
            <Play className="w-5 h-5 text-brand-primary" />
            <h2 className="text-h2">3. Button Variants</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Active Buttons */}
            <div className="p-8 rounded-2xl bg-bg-secondary border border-border-color space-y-6">
              <h3 className="text-h3">Interactive States</h3>
              <div className="flex flex-wrap gap-4">
                <button className="btn-base btn-primary">
                  <span>Primary Action</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <button className="btn-base btn-secondary">
                  <span>Secondary Action</span>
                </button>
                
                <button className="btn-base btn-outline">
                  <span>Outline Action</span>
                </button>
                
                <button className="btn-base btn-ghost">
                  <span>Ghost Action</span>
                </button>
              </div>
            </div>

            {/* Disabled Buttons */}
            <div className="p-8 rounded-2xl bg-bg-secondary border border-border-color space-y-6">
              <h3 className="text-h3">Disabled States</h3>
              <div className="flex flex-wrap gap-4">
                <button className="btn-base btn-primary" disabled>
                  <span>Primary Disabled</span>
                </button>
                
                <button className="btn-base btn-secondary" disabled>
                  <span>Secondary Disabled</span>
                </button>
                
                <button className="btn-base btn-outline" disabled>
                  <span>Outline Disabled</span>
                </button>
                
                <button className="btn-base btn-ghost" disabled>
                  <span>Ghost Disabled</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: CARD SYSTEM */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-border-color">
            <CreditCard className="w-5 h-5 text-brand-primary" />
            <h2 className="text-h2">4. Card System</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Static Card */}
            <div className="card-base bg-bg-elevated border border-border-color">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-caption text-text-muted mb-4">
                Static Card
              </div>
              <h3 className="text-h3 mb-2">Card Base</h3>
              <p className="text-body-sm text-text-secondary">
                Standard background card styled using `card-base`. It automatically inherits theme variables: `#FFFFFF` elevated container in Light theme, and `#0A0A0A` elevated container in Dark theme.
              </p>
            </div>

            {/* Interactive Card */}
            <div className="card-base card-interactive bg-bg-elevated border border-border-color">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-caption text-brand-primary mb-4">
                Interactive (Hover Enabled)
              </div>
              <h3 className="text-h3 mb-2">Card Interactive</h3>
              <p className="text-body-sm text-text-secondary">
                Interactive card layout inherits the hover transformation properties: lift translate offsets, borders highlights, and soft accent color shadows matching the theme style.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 5: FORM SYSTEM */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-border-color">
            <CheckSquare className="w-5 h-5 text-brand-primary" />
            <h2 className="text-h2">5. Form Inputs</h2>
          </div>
          
          <div className="p-8 rounded-2xl bg-bg-secondary border border-border-color max-w-3xl">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label" htmlFor="sample-name">Full Name</label>
                  <input 
                    type="text" 
                    id="sample-name" 
                    className="form-input" 
                    placeholder="Enter your full name" 
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="sample-email">Email Address</label>
                  <input 
                    type="email" 
                    id="sample-email" 
                    className="form-input" 
                    placeholder="name@company.com" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label" htmlFor="sample-select">System Preference</label>
                  <select id="sample-select" className="form-input">
                    <option value="">Select a framework...</option>
                    <option value="vite">Vite + React</option>
                    <option value="nextjs">Next.js</option>
                    <option value="tailwind">Tailwind v4</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Preferences Check</label>
                  <div className="flex items-center gap-3 pt-3">
                    <input 
                      type="checkbox" 
                      id="opt-in" 
                      className="w-4 h-4 accent-brand-primary rounded cursor-pointer"
                    />
                    <label htmlFor="opt-in" className="text-body-sm text-text-secondary cursor-pointer select-none">
                      Enable system diagnostics tracking
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="sample-comments">Additional notes</label>
                <textarea 
                  id="sample-comments" 
                  className="form-input min-h-[100px]" 
                  placeholder="Tell us what you are testing..." 
                />
              </div>

              <div className="flex justify-end">
                <button type="submit" className="btn-base btn-primary flex items-center gap-2">
                  <span>Submit Form</span>
                  <CheckSquare className="w-4 h-4 text-black" />
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* SECTION 6: NAVIGATION SYSTEM */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-border-color">
            <Compass className="w-5 h-5 text-brand-primary" />
            <h2 className="text-h2">6. Navigation System</h2>
          </div>
          
          <div className="p-4 rounded-2xl bg-bg-elevated border border-border-color">
            <nav className="nav-container bg-bg-secondary rounded-xl px-4 py-2 border border-border-color">
              <div className="text-body-sm font-bold tracking-tight text-brand-primary flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-pulse" />
                ANTIGRAVITY
              </div>
              
              <div className="flex gap-6">
                <span className="nav-link nav-link-active">Active Link</span>
                <span className="nav-link">Normal Link 1</span>
                <span className="nav-link">Normal Link 2</span>
              </div>
            </nav>
          </div>
        </section>

        {/* SECTION 7: RESPONSIVE GRID VERIFICATION */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-border-color">
            <Grid className="w-5 h-5 text-brand-primary" />
            <h2 className="text-h2">7. Layout & Responsive Grids</h2>
          </div>
          
          <div className="layout-container px-0">
            <div className="grid-responsive">
              <div className="p-6 rounded-2xl bg-bg-secondary border border-border-color">
                <div className="text-caption text-brand-primary mb-2">Column 1</div>
                <p className="text-body-sm text-text-secondary">
                  Responsively aligned grid columns. At small screen widths (mobile), this stacks as a single column.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-bg-secondary border border-border-color">
                <div className="text-caption text-brand-primary mb-2">Column 2</div>
                <p className="text-body-sm text-text-secondary">
                  At medium width (`md: 768px`), this expands to 2 columns for a balanced tablet landscape view.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-bg-secondary border border-border-color">
                <div className="text-caption text-brand-primary mb-2">Column 3</div>
                <p className="text-body-sm text-text-secondary">
                  At large width (`lg: 1024px`), this reaches its final responsive alignment of 3 equal columns.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-border-color text-center">
        <div className="layout-container text-caption text-text-muted">
          Antigravity Design System Verification Suite &bull; Built with Tailwind CSS v4 & React
        </div>
      </footer>
    </div>
  );
}
