import { useCallback, useEffect, useState } from "react";
import { InputGroup, FormControl } from "react-bootstrap";
import { connect, ConnectedProps } from "react-redux";
import { setFilters } from "../store/actions";
import { RootState } from "../store/store";

let isFirst = true;
let oneTime = true;

const mapStateToProps = ({ searchingParams }: RootState) => ({ searchingParams });

const mapDispatchToProps = {
  setFilters,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

function Search({ setFilters, searchingParams }: PropsFromRedux) {
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (searchingParams.search && oneTime) {
      setSearchValue(searchingParams.search);
      oneTime = false;
    }
    if (!searchingParams.search) {
      setSearchValue("");
    }
  }, [searchingParams]);

  const autoSearch = useCallback(() => {
    if (!isFirst && searchingParams.search !== searchValue) {
      setFilters("search", searchValue);
    }

    isFirst = false;
  }, [searchValue, searchingParams.search, setFilters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      autoSearch();
    }, 800);
    return () => {
      clearTimeout(timer);
    };
  }, [autoSearch]);

  return (
    <div className="container-fix">
      <InputGroup>
        <FormControl
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search"
        />
      </InputGroup>
    </div>
  );
}

export default connector(Search);
