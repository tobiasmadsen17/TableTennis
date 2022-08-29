interface listRenderProps {
  parsedArray: any[];
  uniqueIndex: string;
  clickRemove: any;
}

export const ListRender = ({ parsedArray, uniqueIndex, clickRemove }: listRenderProps) => {
  const renderItem = parsedArray.map((item, index) => (
    <div className="d-flex w-100 justify-content-between" key={uniqueIndex + index}>
      <p className="mb-1">{item}</p>
      <button
        type="button"
        className="btn btn-danger btn-sm mb-1"
        onClick={() => clickRemove(item)}
      >
        X
      </button>
    </div>
  ));
  return <div className="list-group">{renderItem}</div>;
};
