import { Col, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { connect, ConnectedProps } from "react-redux";
import { timeZone } from "../helpers/utils";
import { SearchKey } from "../interfaces";
import { setFilters } from "../store/actions";
import { RootState } from "../store/store";

const dateOptions = [
  {
    label: "Created after",
    value: "create_gte",
  },
  {
    label: "Created before",
    value: "create_lte",
  },
  {
    label: "Complition after",
    value: "complete_gte",
  },
  {
    label: "Complition before",
    value: "complete_lte",
  },
];

type DateTypes = "complete_lte" | "complete_gte" | "create_lte" | "create_gte";

const mapStateToProps = ({ searchingParams }: RootState) => ({
  searchingParams,
});

const mapDispatchToProps = {
  setFilters,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

function DatePick({ setFilters, searchingParams }: PropsFromRedux) {
  const handleChangeDate = (value: Date | null, name: SearchKey) =>
    setFilters(name, value ? timeZone(value) : value);

  return (
    <div>
      <Row className="d-flex mt-3 mb-3 justify-content-between">
        {dateOptions.map((option, index) => (
          <Col key={index} className="text-center" xs={12} sm={6} lg={3}>
            <DatePicker
              className="p-1 rounded border mb-2 justify-content-center w-100"
              placeholderText={option.label}
              selected={
                searchingParams[option.value as DateTypes]
                  ? new Date(
                      searchingParams[
                        option.value as keyof typeof searchingParams
                      ] as string
                    )
                  : null
              }
              autoComplete="off"
              onChange={(value) =>
                handleChangeDate(value, option.value as DateTypes)
              }
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default connector(DatePick);
