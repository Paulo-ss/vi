"use client";

import { FC, Fragment, useState } from "react";
import { Label } from "../ui/Label";
import { Control, Controller, UseFieldArrayRemove } from "react-hook-form";
import { ICasForms } from "./SelectCas";
import Select from "react-select";
import { fetchResource } from "@/services/fetchService";
import { VI } from "@/types/VI";
import { useToast } from "@/hooks/use-toast";
import { IVIContent } from "@/interfaces/VI";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { IconTrash } from "@tabler/icons-react";

interface IProps {
  index: number;
  availableCas: string[];
  lastUpdated?: { lastUpdated: string };
  remove: UseFieldArrayRemove;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<ICasForms, any>;
}

const CasItem: FC<IProps> = ({
  control,
  index,
  availableCas,
  lastUpdated,
  remove,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [casVINumber, setCasVINumbers] = useState<IVIContent | null>(null);

  const { toast } = useToast();

  const fetchCasVI = async (cas: string) => {
    try {
      setIsLoading(true);

      const { data, error } = await fetchResource<VI>({
        url: `/vi/cas/${cas}`,
      });

      if (error) {
        toast({
          title: "Erro",
          description:
            error.errorMessage ??
            `Ocorreu um erro ao buscar VI para o CAS ${cas}`,
          variant: "destructive",
        });

        return;
      }

      setCasVINumbers(data![cas]);
    } catch (error) {
      console.log({ error });

      if (error instanceof Error) {
        toast({
          title: "Erro",
          description:
            error.message ?? `Ocorreu um erro ao buscar VI para o CAS ${cas}`,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Fragment>
      <div className="w-full flex items-center gap-2">
        <Controller
          control={control}
          name={`cas.${index}.casCode`}
          defaultValue={{
            value: "",
            label: "",
          }}
          render={({ field: { value, onChange, name } }) => (
            <div className="w-full">
              <div className="mb-2">
                <Label htmlFor={name}>Selecione um Número CAS</Label>
              </div>

              <Select
                value={value}
                onChange={(value) => {
                  onChange(value);

                  if (value) {
                    const selectedOption = value as unknown as {
                      value: string;
                      label: string;
                    };

                    fetchCasVI(selectedOption.value);
                  }
                }}
                options={availableCas.map((cas) => ({
                  value: cas,
                  label: cas,
                }))}
                isClearable
                placeholder="Selecione..."
              />
            </div>
          )}
        />

        <div className="self-end">
          <Button size="icon" variant="outline" onClick={() => remove(index)}>
            <IconTrash />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-8 w-full pb-2 border-b border-zinc-300">
        <div className="col-span-1 md:col-span-5 flex flex-col items-center w-full gap-2">
          <p className="mt-4 text-sm font-bold">CETESB, 2021</p>

          <Table className="text-center rounded-md overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead colSpan={5} className="text-center bg-orange-100">
                  Solos (mg/Kg)
                </TableHead>
                <TableHead
                  colSpan={1}
                  className="text-center min-w-[150px] md:min-w-[100px] bg-sky-100"
                >
                  Água Subt. (ug/L)
                </TableHead>
              </TableRow>

              <TableRow>
                <TableHead className="text-center">VRQ</TableHead>
                <TableHead className="text-center">VP</TableHead>
                <TableHead className="text-center">Agrícola</TableHead>
                <TableHead className="text-center">Residêncial</TableHead>
                <TableHead className="text-center">Industrial</TableHead>
                <TableHead className="text-center">VI</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow className="animate-pulse">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <TableCell colSpan={1} align="center" key={index}>
                      <span className="flex w-10 h-2 bg-zinc-100 rounded-md" />
                    </TableCell>
                  ))}
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell className="text-center">
                    {casVINumber && casVINumber.VRQ ? casVINumber.VRQ : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {casVINumber && casVINumber.VP ? casVINumber.VP : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {casVINumber && casVINumber.agricola
                      ? casVINumber.agricola
                      : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {casVINumber && casVINumber.residencial
                      ? casVINumber.residencial
                      : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {casVINumber && casVINumber.industrial
                      ? casVINumber.industrial
                      : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {casVINumber && casVINumber.VI ? casVINumber.VI : "-"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="col-span-1 md:col-span-3 flex flex-col items-center w-full gap-2">
          <p className="mt-4 text-sm font-bold">
            USEPA, {lastUpdated?.lastUpdated}
          </p>

          <Table className="text-center rounded-md overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead colSpan={2} className="text-center bg-orange-100">
                  Solos (mg/Kg)
                </TableHead>
                <TableHead
                  colSpan={1}
                  className="text-center min-w-[150px] md:min-w-[100px] bg-sky-100"
                >
                  Água Subt. (ug/L)
                </TableHead>
              </TableRow>

              <TableRow>
                <TableHead className="text-center">Resident Soil</TableHead>
                <TableHead className="text-center">Industrial Soil</TableHead>
                <TableHead className="text-center">Tap Water</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow className="animate-pulse">
                  {[0, 1, 2].map((index) => (
                    <TableCell colSpan={1} align="center" key={index}>
                      <span className="flex w-10 h-2 bg-zinc-100 rounded-md" />
                    </TableCell>
                  ))}
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell className="text-center">
                    {casVINumber && casVINumber.residentSoil
                      ? casVINumber.residentSoil
                      : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {casVINumber && casVINumber.industrialSoil
                      ? casVINumber.industrialSoil
                      : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {casVINumber && casVINumber.tapWater
                      ? casVINumber.tapWater
                      : "-"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Fragment>
  );
};

export default CasItem;
