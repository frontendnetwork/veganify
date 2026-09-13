"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { type FormEvent, useCallback, useEffect, useState } from "react";
import { spring } from "@/lib/springs";
import { FetchStatus } from "@/models/FetchStatus";
import type { ProductResult } from "@/models/ProductResults";
import type { Sources } from "@/models/Sources";
import { EmptyState } from "./EmptyState";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { ProductResultView } from "./ProductResult";
import { RecentSearches, rememberCheck } from "./RecentSearches";
import { SearchForm } from "./SearchForm";
import { StatusMessages } from "./StatusMessages";
import { fetchProduct } from "./utils/product-actions";
import { getProductState } from "./utils/product-helpers";

type Status =
  | "idle"
  | "loading"
  | "found"
  | "notfound"
  | "invalid"
  | "timeout"
  | "error";

const INITIAL_RESULT: ProductResult = {
  animaltestfree: "n/a",
  grade: "",
  nutriscore: "",
  palmoil: "n/a",
  productname: "",
  vegan: "n/a",
  vegetarian: "n/a",
};

export default function ProductSearch() {
  const [result, setResult] = useState<ProductResult>(INITIAL_RESULT);
  const [sources, setSources] = useState<Sources>({});
  const [barcode, setBarcode] = useState<string>("");
  const t = useTranslations("Check");
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const eanFromURL = params.get("ean");
    if (eanFromURL) {
      setBarcode(eanFromURL);
      handleSubmit(eanFromURL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = useCallback(
    async (barcodeValue: string, event?: FormEvent) => {
      event?.preventDefault();
      setStatus("loading");

      try {
        const data = await fetchProduct(barcodeValue);
        if (data.status === FetchStatus.OK && data.product && data.sources) {
          setResult({
            animaltestfree: data.product.animaltestfree ?? "n/a",
            grade: data.product.grade ?? "",
            nutriscore: data.product.nutriscore ?? "",
            palmoil: data.product.palmoil ?? "n/a",
            productname: data.product.productname,
            vegan: data.product.vegan ?? "n/a",
            vegetarian: data.product.vegetarian ?? "n/a",
          });
          setSources(data.sources);
          rememberCheck({
            ean: barcodeValue,
            name:
              typeof data.product.productname === "string"
                ? data.product.productname
                : "n/a",
          });
          setStatus("found");
          return;
        }
        if (data.status === FetchStatus.NOT_FOUND) {
          setStatus("notfound");
        } else if (data.status === FetchStatus.INVALID) {
          setStatus("invalid");
        } else if (data.status === FetchStatus.TIMEOUT) {
          setStatus("timeout");
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    },
    []
  );

  const handleRecentSelect = useCallback(
    (ean: string) => {
      setBarcode(ean);
      handleSubmit(ean);
    },
    [handleSubmit]
  );

  return (
    <>
      <SearchForm
        barcode={barcode}
        loading={status === "loading"}
        onBarcodeChange={setBarcode}
        onSubmit={handleSubmit}
      />
      {status === "idle" ? (
        <>
          <EmptyState onSelectExample={handleRecentSelect} />
          <RecentSearches onSelect={handleRecentSelect} />
        </>
      ) : null}
      <div aria-live="polite" role="status">
        {status === "loading" ? (
          <p className="sr-only-focusable">{t("searching")}</p>
        ) : null}
        <AnimatePresence initial={false} mode="wait">
          {status === "loading" && (
            <motion.div
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: spring.fast.exit }}
              initial={{ opacity: 0 }}
              key="loading"
              transition={spring.moderate}
            >
              <LoadingSkeleton />
            </motion.div>
          )}
          {status === "found" && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: spring.fast.exit }}
              initial={{ opacity: 0, y: 16 }}
              key="found"
              transition={spring.moderate}
            >
              <ProductResultView
                barcode={barcode}
                productState={getProductState(result)}
                result={result}
                sources={sources}
              />
            </motion.div>
          )}
          {(status === "notfound" ||
            status === "invalid" ||
            status === "timeout" ||
            status === "error") && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: spring.fast.exit }}
              initial={{ opacity: 0, y: 16 }}
              key={status}
              transition={spring.moderate}
            >
              <StatusMessages status={status} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
