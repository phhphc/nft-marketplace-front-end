import {
  COLLECTION_FILTER_TITLE,
  QUANTITY_OPTIONS,
  NONE_OPTION,
  STATUS_OPTIONS,
} from "@Constants/index";
import RadioButtonList from "@Components/RadioButtonList/RadioButtonList";
import CheckboxList from "@Components/CheckboxList/CheckboxList";
import { useState } from "react";
import { IOption } from "@Interfaces/index";
import { Slider } from "primereact/slider";
import { Accordion, AccordionTab } from "primereact/accordion";

const NFTCollectionFilter = () => {
  const [quantityOption, setQuantityOption] = useState<IOption>(NONE_OPTION);
  const [statusOptions, setStatusOptions] = useState<IOption[]>([]);
  const [price, setPrice] = useState<[number, number]>([20, 80]);
  return (
    <Accordion multiple className="hidden md:block">
      <AccordionTab header={COLLECTION_FILTER_TITLE.STATUS}>
        <CheckboxList
          options={STATUS_OPTIONS}
          selectedOptions={statusOptions}
          setSelectedOptions={setStatusOptions}
          name="status"
        />
      </AccordionTab>
      <AccordionTab header={COLLECTION_FILTER_TITLE.PRICE}>
        <div className="m-3">
          <Slider
            value={price}
            onChange={(e: any) => {
              setPrice(e.value);
            }}
            range
          />
          <div className="flex justify-between mt-3">
            <span>{price[0]}</span>
            <span>{price[1]}</span>
          </div>
        </div>
      </AccordionTab>
      <AccordionTab header={COLLECTION_FILTER_TITLE.QUANTITY}>
        <RadioButtonList
          options={QUANTITY_OPTIONS}
          selectedOption={quantityOption}
          setSelectedOption={setQuantityOption}
          name="quantity"
        />
      </AccordionTab>
    </Accordion>
  );
};

export default NFTCollectionFilter;
