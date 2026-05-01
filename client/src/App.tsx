import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { MobileTabBar } from "./components/MobileTabBar";
import Home from "./pages/Home";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import About from "./pages/About";
import Disclosures from "./pages/Disclosures";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import StarterKit from "./pages/StarterKit";
import Library from "./pages/Library";
import Saved from "./pages/Saved";
import AdminDashboard from "./pages/AdminDashboard";
import Assessments from "./pages/Assessments";
import Supplements from "./pages/Supplements";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/articles" component={Articles} />
      <Route path="/articles/:slug" component={ArticleDetail} />
      <Route path="/about" component={About} />
      <Route path="/disclosures" component={Disclosures} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/contact" component={Contact} />
      <Route path="/starter-kit" component={StarterKit} />
      <Route path="/library" component={Library} />
      <Route path="/assessments" component={Assessments} />
      <Route path="/supplements" component={Supplements} />
      <Route path="/saved" component={Saved} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <div className="min-h-screen flex flex-col">
            <SiteHeader />
            <main className="flex-1">
              <Router />
            </main>
            <SiteFooter />
            <MobileTabBar />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
