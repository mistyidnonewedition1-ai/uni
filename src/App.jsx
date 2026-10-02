import { HashRouter, Route, Routes } from "react-router-dom";
import { ProgressProvider } from "./context/ProgressContext.jsx";
import { Shell } from "./components/Shell.jsx";
import { Hub } from "./pages/Hub.jsx";
import { SharePage } from "./pages/Share.jsx";
import { TastesGame } from "./games/TastesGame.jsx";
import { PassionsGame } from "./games/PassionsGame.jsx";
import { StudiesGame } from "./games/StudiesGame.jsx";
import { PersonalityGame } from "./games/PersonalityGame.jsx";
import { LanguagesGame } from "./games/LanguagesGame.jsx";
import { UniverseGame } from "./games/UniverseGame.jsx";

export default function App() {
  return (
    <ProgressProvider>
      <HashRouter>
        <Shell>
          <Routes>
            <Route path="/" element={<Hub />} />
            <Route path="/gouts" element={<TastesGame />} />
            <Route path="/passions" element={<PassionsGame />} />
            <Route path="/etudes" element={<StudiesGame />} />
            <Route path="/personnalite" element={<PersonalityGame />} />
            <Route path="/langues" element={<LanguagesGame />} />
            <Route path="/univers" element={<UniverseGame />} />
            <Route path="/partager" element={<SharePage />} />
            <Route path="/final" element={<div />} />
          </Routes>
        </Shell>
      </HashRouter>
    </ProgressProvider>
  );
}
