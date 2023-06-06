import { DataProvider } from "@/store/GlobalContext";
import "@/styles/globals.css";

function App({ Component, pageProps }) {
  return (
    <DataProvider>
      <Component {...pageProps} />
    </DataProvider>
  );
}
export default App;
