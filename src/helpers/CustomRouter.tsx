import { History } from "history";
import { useLayoutEffect, useState } from "react";
import { Router } from "react-router";

interface CustomRouterProps {
  basename?: string;
  children: React.ReactNode,
  history: History
}

const CustomRouter = ({ basename, children, history }: CustomRouterProps) => {
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      basename={basename}
      children={children}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  );
};

export default CustomRouter;
