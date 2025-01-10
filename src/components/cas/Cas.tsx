"use client";

import { IAPIError } from "@/interfaces/ApiError";
import { FC, Fragment } from "react";
import ErrorDisplay from "../ui/errorDisplay/ErrorDisplay";
import CasTable from "./CasTable";
import { VI } from "@/types/VI";

interface IProps {
  viByCas?: VI;
  lastUpdated?: string;
  error?: IAPIError;
}

const Cas: FC<IProps> = ({ viByCas, lastUpdated, error }) => {
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
            <div className="flex flex-col items-center gap-1">
              <CasTable viByCas={viByCas} lastUpdated={lastUpdated} />
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default Cas;
