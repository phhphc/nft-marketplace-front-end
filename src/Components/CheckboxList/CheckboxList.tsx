import { IOption } from "@Interfaces/index";
import { cloneDeep } from "lodash";
import { Checkbox } from "primereact/checkbox";

export interface ICheckboxList {
  options: IOption[];
  selectedOptions: IOption[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<IOption[]>>;
  name?: string;
}

const CheckboxList = ({
  options,
  selectedOptions,
  setSelectedOptions,
  name = "checkbox",
}: ICheckboxList) => {
  const handleClickCheckbox = (option: IOption) => {
    const index = selectedOptions.map((item) => item.key).indexOf(option.key);
    if (index > -1)
      setSelectedOptions((prev) => {
        const newSelectedValues = cloneDeep(prev);
        newSelectedValues.splice(index, 1);
        return newSelectedValues;
      });
    else
      setSelectedOptions((prev) => {
        const newSelectedValues = cloneDeep(prev);
        newSelectedValues.push(option);
        return newSelectedValues;
      });
  };

  return (
    <div>
      {options.map((option) => {
        return (
          <label
            htmlFor={option.key}
            key={option.key}
            className="flex justify-between hover:bg-gray-200 p-3 rounded-xl"
          >
            <span>{option.name}</span>
            <Checkbox
              inputId={option.key}
              name={name}
              value={option}
              checked={
                selectedOptions.map((item) => item.key).indexOf(option.key) > -1
              }
              onChange={(e) => handleClickCheckbox(e.value)}
            />
          </label>
        );
      })}
    </div>
  );
};

export default CheckboxList;
