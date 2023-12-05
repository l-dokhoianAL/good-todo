import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { RootState } from "../store/store";
import * as ActionCreators from "../store/actions";
import { useMemo } from "react";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useActions = () => {
  const dispatch = useDispatch();
  const boundActionCreators = useMemo(
    () => bindActionCreators(ActionCreators, dispatch),
    [dispatch]
  );
  return boundActionCreators;
};
