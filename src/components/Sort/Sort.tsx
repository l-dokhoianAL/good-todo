import { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { setFilters } from "../../store/actions";
import { RootState } from "../../store/store";
import styles from "./sort.module.css";

const sortOptions = [
  {
    label: "Alphabet",
    value: "a-z",
    secondValue: "z-a",
  },
  {
    label: "Creation Date",
    value: "creation_date_oldest",
    secondValue: "creation_date_newest",
  },
  {
    label: "Completion Date",
    value: "completion_date_oldest",
    secondValue: "completion_date_newest",
  },
];
const defaultSelectedSort = {
  label: "",
  value: "",
  secondValue: "",
};

const mapStateToProps = ({ searchingParams }: RootState) => ({ searchingParams });

const mapDispatchToProps = {
  setFilters,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

function Sort({ searchingParams, setFilters }: PropsFromRedux) {
  const [selectedSort, setSort] = useState(defaultSelectedSort);

  let [up, setArrow] = useState(true);
  let sendingValue = "";
  // const { value, secondValue } = selectedSort;
  const selectSortOption = (option: typeof sortOptions[0]) => {
    if (option.label === selectedSort.label) {
      up = !up;
      setArrow(up);
      up ? (sendingValue = option.value) : (sendingValue = option.secondValue);
      setFilters("sort", sendingValue);
      return;
    }
    setSort(option);
    setFilters("sort", option.value);
    setArrow(true);
  };

  useEffect(() => {
    if (
      searchingParams.sort &&
      (searchingParams.sort !== selectedSort.value ||
        searchingParams.sort !== selectedSort.secondValue)
    ) {
      const selectedSortOption = sortOptions.filter((option) => {
        if (option.value === searchingParams.sort) {
          setArrow(true);
          return true;
        }
        if (option.secondValue === searchingParams.sort) {
          setArrow(false);
          return true;
        }
        return false;
      })[0];
      setSort(selectedSortOption);
    }
    if (!searchingParams.sort) {
      setSort(defaultSelectedSort);
    }
  }, [searchingParams, selectedSort.secondValue, selectedSort.value]);

  return (
    <div
      className={`justify-content-center justify-content-md-start ${styles.container}`}
    >
      <span className="me-2 d-none d-md-inline">Sort By:</span>
      <div className={`${styles.button_container}`}>
        {sortOptions.map((option, i) => (
          <button
            key={i}
            onClick={() => selectSortOption(option)}
            className={`${styles.button} ${
              option.label === selectedSort.label ? styles.active : ""
            }`}
          >
            {option.label}
            <span
              className={`ms-1 ${
                option.label === selectedSort.label && up
                  ? styles.active
                  : styles.not_active
              }`}
            >
              ↑
            </span>
            <span
              className={
                option.label === selectedSort.label && !up
                  ? styles.active
                  : styles.not_active
              }
            >
              ↓
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}


export default connector(Sort);
