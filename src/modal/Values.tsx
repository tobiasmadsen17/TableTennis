export const Values = (props: any) => {
  return (
    <div>
      <select className="form-select mt-3" aria-label="Default select example">
        <option selected disabled>
          {props.placeholderForPlayerSelection}
        </option>
        {props.optionValues}
      </select>
      <input
        type="number"
        min="0"
        className="form-control mt-3 mb-3"
        id={props.sets}
        placeholder={props.placeholderForSets}
      ></input>
    </div>
  );
};
