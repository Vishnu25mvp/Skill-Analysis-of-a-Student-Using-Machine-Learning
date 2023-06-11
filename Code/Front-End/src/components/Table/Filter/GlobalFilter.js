import React, { useState } from "react";
import { useAsyncDebounce } from "react-table";

const GlobalFilter = ({ filter, setFilter }) => {
  const [value, setValue] = useState(filter);

  const onChange = useAsyncDebounce((value) => {
    setFilter(value || undefined);
  }, 300);

  return (
    <div className="mx-3 w-25">
      <input className="table-input" type="text" value={value} placeholder="Search" style={{width: "100%"}} 
        onChange={
          (e) => { setValue(e.target.value); onChange(e.target.value); }} 
      />
    </div>
  );
};

export default GlobalFilter;
