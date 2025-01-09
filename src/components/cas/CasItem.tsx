"use client";

import { FC, Fragment, useState } from "react";
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

const CasItem: FC<IProps> = ({ viByCas, lastUpdated }) => {
  const { control, setValue, handleSubmit } = useForm<ICasForm>({
    defaultValues: {
      casCode: "",
    },
  });
  const { toast } = useToast();

  const [selectedCas, setSelectedCas] = useState<VI | null>(null);

  const lastUpdatedSplited = lastUpdated ? lastUpdated.split(" ") : [];

  const copyColumnToClipboard = (column: VIColumnsType) => {
    const columnText: string[] = [];

    for (const key of Object.keys(selectedCas!)) {
      const vi = selectedCas![key];

      columnText.push(vi[column] ? String(vi[column]) : "-");
    }

    navigator.clipboard.writeText(columnText.join("\r\n"));

    toast({
      title: "Copiado!",
      description: `Coluna ${column} copiada com sucesso.`,
      action: <IconCheckbox color="#39f01d" />,
    });
  };

  const onCasSubmit = (data: ICasForm) => {
    const allTypedCas = data.casCode.split(/\s+/gm);

    let foundVIByCas: VI = {};

    for (const cas of allTypedCas) {
      if (cas && cas !== "CAS No.") {
        const vi = viByCas[cas];

        if (vi) {
          foundVIByCas = {
            ...foundVIByCas,
            [cas]: vi,
          };
        }
      }
    }

    if (Object.keys(foundVIByCas).length === 0) {
      setSelectedCas(null);

      return;
    }

    setSelectedCas(foundVIByCas);
  };

  return (
    <Fragment>
      <form className="w-full flex gap-2" onSubmit={handleSubmit(onCasSubmit)}>
        {selectedCas ? (
          <div className="w-3/4 flex flex-col gap-2">
            <h2 className="text-lg">CAS encontrados</h2>

            <div className="flex items-center gap-2 overflow-auto no-scrollbar">
              {Object.keys(selectedCas).map((cas) => (
                <span
                  key={cas}
                  className="grow min-w-fit rounded-full border border-sky-600 p-2 hover:bg-sky-200 transition-all"
                >
                  {cas}
                </span>
              ))}
            </div>
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
              {Object.keys(selectedCas!).map((cas) => {
                const vi = selectedCas![cas];

                return (
                  <TableRow key={cas}>
                    <TableCell className="text-nowrap">{cas}</TableCell>
                    <TableCell className="text-center">
                      {vi.VRQ ? vi.VRQ : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {vi.VP ? vi.VP : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {vi.agricola ? vi.agricola : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {vi.residencial ? vi.residencial : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {vi.industrial ? vi.industrial : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {vi.VI ? vi.VI : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {vi.residentSoil ? vi.residentSoil : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {vi.industrialSoil ? vi.industrialSoil : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {vi.tapWater ? vi.tapWater : "-"}
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

export default CasItem;
