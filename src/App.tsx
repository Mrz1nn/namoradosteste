import { usePathname, parseRoute } from "./lib/router";
import Landing from "./pages/Landing";
import SitePage from "./pages/SitePage";
import EditPage from "./pages/EditPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";

function App() {
  const pathname = usePathname();
  const route = parseRoute(pathname);

  switch (route.name) {
    case "landing":
      return <Landing />;
    case "admin":
      return <AdminPage />;
    case "site":
      return <SitePage slug={route.slug} />;
    case "edit":
      return <EditPage slug={route.slug} />;
    default:
      return <NotFound />;
  }
}

export default App;
