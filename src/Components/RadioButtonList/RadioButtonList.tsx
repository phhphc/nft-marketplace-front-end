import { IOption } from "@Interfaces/index";
import { RadioButton } from "primereact/radiobutton";

export interface IRadioButtonListProps {
  options: IOption[];
  selectedOption: IOption;
  setSelectedOption: React.Dispatch<React.SetStateAction<IOption>>;
  name?: string;
}

const RadioButtonList = ({
  options,
  selectedOption,
  setSelectedOption,
  name = "radio",
}: IRadioButtonListProps) => {
  const handleClickRadioButton = (option: IOption) => setSelectedOption(option);

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
            <RadioButton
              inputId={option.key}
              name={name}
              value={option}
              checked={selectedOption.key === option.key}
              onChange={(e) => handleClickRadioButton(e.value)}
            />
          </label>
        );
      })}
    </div>
  );
};

export default RadioButtonList;
