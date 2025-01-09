import SelectCas from "@/components/cas/SelectCas";
import { IVIFile } from "@/interfaces/VI";
import { fetchResource } from "@/services/fetchService";
import Image from "next/image";

export default async function Home() {
  const { data: casVI, error } = await fetchResource<IVIFile>({
    url: "/vi/cas",
  });

  return (
    <div className="flex flex-col w-full h-screen p-4 md:max-w-screen-lg">
      <title>VI - Números CAS</title>

      <Image
        width={232}
        height={90}
        src="/images/logos/geointegra-logo.jpg"
        alt="Geointegra's logo image"
        className="w-32 mt-2 mb-5"
      />

      <main className="grow">
        <SelectCas
          viByCas={casVI?.vi}
          error={error}
          lastUpdated={casVI?.lastUpdated}
        />
      </main>

      <div className="mt-4 mb-2 py-4">
        <p className="italic text-zinc-800 text-sm max-w-screen-sm">
          * Dados referente a tabela USEPA são atualizados automaticamente todo
          mês de <b>Maio e Novembro</b>, conforme site da{" "}
          <a
            href="https://www.epa.gov/risk/regional-screening-levels-rsls-generic-tables"
            target="_blank"
            className="underline"
          >
            EPA Gov
          </a>{" "}
          , baseados na tabela {"'Summary Table (TR=1E-06 THQ=1.0)'"}
        </p>

        <p className="italic text-zinc-800 text-sm max-w-screen-sm mt-2">
          * Última atualização em {casVI?.lastUpdated}
        </p>
      </div>
    </div>
  );
}
