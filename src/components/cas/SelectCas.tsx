"use client";

import { IAPIError } from "@/interfaces/ApiError";
import { FC, Fragment } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import ErrorDisplay from "../ui/errorDisplay/ErrorDisplay";
import { Button } from "../ui/button";
import { IconPlus } from "@tabler/icons-react";
import CasItem from "./CasItem";
import { VI } from "@/types/VI";

interface IProps {
  viByCas?: VI;
  lastUpdated?: string;
  error?: IAPIError;
}

interface ICasForm {
  casCode: { value: string; label: string };
}

export interface ICasForms {
  cas: ICasForm[];
}

const SelectCas: FC<IProps> = ({ viByCas, lastUpdated, error }) => {
  const { control } = useForm<ICasForms>({
    defaultValues: {
      cas: [
        {
          casCode: {
            value: "",
            label: "",
          },
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray<ICasForms>({
    control,
    name: "cas",
  });

  return (
    <div className="flex flex-col items-center">
      {error || !viByCas ? (
        <ErrorDisplay
          errorMessage={
            error ? error.errorMessage : "Ocorreu um erro inesperado."
          }
        />
      ) : (
        <Fragment>
          <h1 className="text-3xl font-bold">VI</h1>

          <div className="mt-2 flex flex-col gap-4 w-full">
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col items-center gap-1">
                <CasItem
                  control={control}
                  index={index}
                  viByCas={viByCas}
                  lastUpdated={lastUpdated}
                  remove={remove}
                />
              </div>
            ))}
          </div>

          <div className="mt-4 self-start">
            <Button
              size="icon"
              variant="outline"
              onClick={() =>
                append({
                  casCode: {
                    value: "",
                    label: "",
                  },
                })
              }
            >
              <IconPlus />
            </Button>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default SelectCas;
