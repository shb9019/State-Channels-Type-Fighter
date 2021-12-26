import React from 'react';
import './App.css';
import Dashboard from "./Components/Dashboard";
import { DrizzleContext } from "@drizzle/react-plugin";

function App() {
  return (
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const { drizzle, drizzleState, initialized } = drizzleContext;
          if (!initialized) return 'Loading...';
          return <Dashboard drizzle={drizzle} drizzleState={drizzleState} />;
        }}
      </DrizzleContext.Consumer>
  );
}

export default App;
