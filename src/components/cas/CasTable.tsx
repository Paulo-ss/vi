"use client";

import { FC, Fragment, useEffect, useRef, useState } from "react";
import { Label } from "../ui/Label";
import { Controller, useForm } from "react-hook-form";
import { VI } from "@/types/VI";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import {
  IconCheckbox,
  IconClipboard,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { Input } from "../ui/Input";
import { useToast } from "@/hooks/use-toast";
import { IVIContent } from "@/interfaces/VI";

interface IProps {
  viByCas: VI;
  lastUpdated?: string;
}

interface ICasForm {
  casCode: string;
}

type VIColumnsType = keyof IVIContent;

const casSums = [
  "87-61-6",
  "120-82-1",
  "108-70-3",
  "156-59-2",
  "156-60-5",
  "309-00-2",
  "60-57-1",
  "72-54-8",
  "72-55-9",
  "50-29-3",
];

const formattedColumnsName = {
  VRQ: "Valor de Referência de Qualidade (VRQ)",
  VP: "Valor de Prevenção (VP)",
  agricola: "Agrícola",
  residencial: "Residêncial",
  industrial: "Industrial",
  VI: "VI",
  residentSoil: "Resident Soil",
  industrialSoil: "Industrial Soil",
  tapWater: "Tap Water",
};

const CasTable: FC<IProps> = ({ viByCas, lastUpdated }) => {
  const { control, setValue, handleSubmit } = useForm<ICasForm>({
    defaultValues: {
      casCode: "",
    },
  });
  const { toast } = useToast();

  const [selectedCas, setSelectedCas] = useState<VI[] | null>(null);

  const rowsRef = useRef<{ [key: string]: HTMLTableRowElement }[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const lastUpdatedSplited = lastUpdated ? lastUpdated.split(" ") : [];

  const copyColumnToClipboard = (column: VIColumnsType) => {
    const columnText: string[] = [];

    for (const cas of selectedCas!) {
      const casCode = Object.keys(cas)[0];
      const vi = cas[casCode];

      columnText.push(vi[column] ? String(vi[column]).replace(".", ",") : "-");
    }

    navigator.clipboard.writeText(columnText.join("\r\n"));

    toast({
      title: "Copiado!",
      description: `Coluna '${formattedColumnsName[column]}' copiada com sucesso.`,
      action: <IconCheckbox color="#39f01d" />,
    });
  };

  const scrollToCasRow = (cas: string) => {
    const casRow = rowsRef.current.find(
      (rowByCas) => Object.keys(rowByCas)[0] === cas
    );

    if (casRow) {
      const tableElement = casRow[cas];

      tableElement.scrollIntoView({ behavior: "smooth" });
      tableElement.classList.add("bg-orange-100");

      const timeout = setTimeout(() => {
        tableElement.classList.remove("bg-orange-100");
      }, 2500);

      timeoutRef.current = timeout;
    }
  };

  const onCasSubmit = (data: ICasForm) => {
    let allTypedCas = data.casCode.split(/ (?=\S)/gm);
    allTypedCas = allTypedCas.reduce((casArray, cas) => {
      const areThereSpaces = cas.match(/\s+/gm);

      if (areThereSpaces && areThereSpaces.length > 0) {
        return [...casArray, cas.replace(/\s+/gm, ""), " "];
      }

      return [...casArray, cas];
    }, [] as string[]);

    const foundVIByCas: VI[] = [];

    for (const cas of allTypedCas) {
      if (cas && cas !== "CAS No.") {
        const vi = viByCas[cas];

        if (vi) {
          foundVIByCas.push({ [cas]: vi });

          continue;
        }

        foundVIByCas.push({
          [cas]: {
            agricola: undefined,
            industrial: undefined,
            industrialSoil: undefined,
            residencial: undefined,
            residentSoil: undefined,
            tapWater: undefined,
            VI: undefined,
            VRQ: undefined,
            VP: undefined,
          },
        });
      }
    }

    if (foundVIByCas.length === 0) {
      setSelectedCas(null);

      return;
    }

    setSelectedCas(foundVIByCas);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Fragment>
      {selectedCas && (
        <h2 className="text-lg mb-2 self-start">CAS encontrados</h2>
      )}

      <form className="w-full flex gap-2" onSubmit={handleSubmit(onCasSubmit)}>
        {selectedCas ? (
          <div className="w-full flex items-center gap-2 overflow-auto flipped">
            {selectedCas.map((cas, index) => {
              const casCode = Object.keys(cas)[0];

              return (
                <span
                  key={index}
                  className="grow flex justify-center items-center min-w-fit max-w-fit rounded-md bg-zinc-50 py-2 px-4 hover:bg-zinc-100 transition-all cursor-pointer flipped"
                  onClick={() => scrollToCasRow(casCode)}
                >
                  {casCode}
                </span>
              );
            })}
          </div>
        ) : (
          <Controller
            control={control}
            name="casCode"
            defaultValue=""
            render={({ field: { value, onChange, name } }) => (
              <div className="w-full">
                <div className="mb-2">
                  <Label htmlFor={name}>
                    Digite um ou vários CAS (separe por espaços)
                  </Label>
                </div>

                <Input type="text" value={value} onChange={onChange} />
              </div>
            )}
          />
        )}

        <div className="self-end">
          {selectedCas ? (
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                setValue("casCode", "");
                setSelectedCas(null);
                rowsRef.current = [];
              }}
            >
              <IconTrash />
            </Button>
          ) : (
            <Button type="submit" size="icon" variant="outline">
              <IconSearch />
            </Button>
          )}
        </div>
      </form>

      {selectedCas && (
        <div className="flex flex-col items-center w-full gap-2 mt-4">
          <Table className="text-center rounded-md overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>

                <TableHead
                  colSpan={6}
                  className="text-center text-sm font-bold text-zinc-950"
                >
                  CETESB, 2021
                </TableHead>

                <TableHead
                  colSpan={6}
                  className="text-center text-sm font-bold text-zinc-950"
                >
                  USEPA,{" "}
                  {lastUpdated
                    ? `${lastUpdatedSplited[2].toUpperCase()} ${
                        lastUpdatedSplited[4]
                      }`
                    : "-"}
                </TableHead>
              </TableRow>

              <TableRow>
                <TableHead></TableHead>

                <TableHead colSpan={5} className="text-center bg-orange-100">
                  Solos (mg/Kg)
                </TableHead>
                <TableHead
                  colSpan={1}
                  className="text-center min-w-[150px] md:min-w-[100px] bg-sky-100"
                >
                  Água Subt. (ug/L)
                </TableHead>
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
                <TableHead className="text-center">CAS</TableHead>
                <TableHead className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => copyColumnToClipboard("VRQ")}
                  >
                    VRQ
                    <IconClipboard />
                  </Button>
                </TableHead>
                <TableHead className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => copyColumnToClipboard("VP")}
                  >
                    VP
                    <IconClipboard />
                  </Button>
                </TableHead>
                <TableHead className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => copyColumnToClipboard("agricola")}
                  >
                    Agrícola
                    <IconClipboard />
                  </Button>
                </TableHead>
                <TableHead className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => copyColumnToClipboard("residencial")}
                  >
                    Residêncial
                    <IconClipboard />
                  </Button>
                </TableHead>
                <TableHead className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => copyColumnToClipboard("industrial")}
                  >
                    Industrial
                    <IconClipboard />
                  </Button>
                </TableHead>
                <TableHead className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => copyColumnToClipboard("VI")}
                  >
                    VI
                    <IconClipboard />
                  </Button>
                </TableHead>
                <TableHead className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => copyColumnToClipboard("residentSoil")}
                  >
                    Resident Soil
                    <IconClipboard />
                  </Button>
                </TableHead>
                <TableHead className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => copyColumnToClipboard("industrialSoil")}
                  >
                    Industrial Soil
                    <IconClipboard />
                  </Button>
                </TableHead>
                <TableHead className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => copyColumnToClipboard("tapWater")}
                  >
                    Tap Water
                    <IconClipboard />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {selectedCas!.map((cas, index) => {
                const casCode = Object.keys(cas)[0];
                const vi = cas[casCode];

                return (
                  <TableRow
                    key={index}
                    ref={(element) => {
                      if (element) {
                        rowsRef.current.push({ [casCode]: element });
                      }
                    }}
                    className="transition-all"
                  >
                    <TableCell className="text-nowrap">{casCode}</TableCell>
                    <TableCell className="text-center">
                      {vi.VRQ ? String(vi.VRQ).replace(".", ",") : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {vi.VP ? String(vi.VP).replace(".", ",") : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {vi.agricola
                        ? String(vi.agricola).replace(".", ",")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {vi.residencial
                        ? String(vi.residencial).replace(".", ",")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {vi.industrial
                        ? String(vi.industrial).replace(".", ",")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {vi.VI ? String(vi.VI).replace(".", ",") : "-"}
                      {casSums.includes(casCode) && " *"}
                    </TableCell>
                    <TableCell className="text-center">
                      {vi.residentSoil
                        ? String(vi.residentSoil).replace(".", ",")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {vi.industrialSoil
                        ? String(vi.industrialSoil).replace(".", ",")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {vi.tapWater
                        ? String(vi.tapWater).replace(".", ",")
                        : "-"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </Fragment>
  );
};

export default CasTable;
