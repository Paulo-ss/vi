"use client";

import { IconAlertOctagon } from "@tabler/icons-react";
import { FC } from "react";

interface IProps {
  errorMessage: string | string[];
}

const ErrorDisplay: FC<IProps> = ({ errorMessage }) => {
  return (
    <div className="w-full p-4 flex items-center gap-4 rounded-md bg-red-100">
      <div className="flex justify-center items-center w-12 h-12">
        <IconAlertOctagon width={48} height={48} />
      </div>

      <div className="grow">
        <h2 className="text-2xl font-bold text-red-700">Erro</h2>

        <p className="text-base text-red-700">{errorMessage}</p>
      </div>
    </div>
  );
};

export default ErrorDisplay;
