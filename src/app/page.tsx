import SelectCas from "@/components/cas/SelectCas";
import { fetchResource } from "@/services/fetchService";
import Image from "next/image";

export default async function Home() {
  const { data: availableCas, error } = await fetchResource<string[]>({
    url: "/vi/cas",
  });

  const { data: lastUpdated } = await fetchResource<{
    lastUpdated: string;
  }>({
    url: "/vi/last-updated",
  });

  return (
    <div className="flex flex-col w-full p-4 md:max-w-screen-lg">
      <title>VI - Números CAS</title>

      <Image
        width={232}
        height={90}
        src="/images/logos/geointegra-logo.jpg"
        alt="Geointegra's logo image"
        className="w-32 mt-2 mb-5"
      />

      <SelectCas
        availableCas={availableCas}
        error={error}
        lastUpdated={lastUpdated}
      />

      <div className="mt-4">
        <p className="italic text-zinc-800 text-sm max-w-screen-sm">
          * Dados referente a tabela USEPA são atualizados automaticamente todo
          mês de <b>Maio e Setembro</b>, conforme site da{" "}
          <a
            href="https://www.epa.gov/risk/regional-screening-levels-rsls-generic-tables"
            target="_blank"
            className="underline"
          >
            EPA Gov
          </a>{" "}
          , baseados na tabela {"'Summary Table (TR=1E-06 THQ=1.0)'"}
        </p>
      </div>
    </div>
  );
}
