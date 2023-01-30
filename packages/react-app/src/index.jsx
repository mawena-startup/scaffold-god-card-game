import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import "react-tooltip/dist/react-tooltip.css";
import { Home, CreateBattle, JoinBattle, Battle, Battleground } from "./page";
import StateContext from "./context/StateContext";
import { OnboardModal } from "./components/avaxgods";

const themes = {
  dark: `${process.env.PUBLIC_URL}/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/light-theme.css`,
};

const prevTheme = window.localStorage.getItem("theme");

const subgraphUri = "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract";

const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <ThemeSwitcherProvider themeMap={themes} defaultTheme={prevTheme || "light"}>
      <BrowserRouter>
        <StateContext>
          {/* <OnboardModal /> */}
          {/* <App subgraphUri={subgraphUri} /> */}
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/test" element={<App subgraphUri={subgraphUri} />} /> */}
            <Route path="/create-battle" element={<CreateBattle />} />
            <Route path="/join-battle" element={<JoinBattle />} />
            <Route path="/battleground" element={<Battleground />} />
            <Route path="/battle/:battleName" element={<Battle />} />
          </Routes>
        </StateContext>
      </BrowserRouter>
    </ThemeSwitcherProvider>
  </ApolloProvider>,
  document.getElementById("root"),
);
