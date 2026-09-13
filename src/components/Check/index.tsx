"use client";

import { type FormEvent, useEffect, useState } from "react";

import { FetchStatus } from "@/models/FetchStatus";
import type { ProductResult } from "@/models/ProductResults";
import type { Sources } from "@/models/Sources";

import { LoadingSkeleton } from "./LoadingSkeleton";
import { ProductResultView } from "./ProductResult";
import { SearchForm } from "./SearchForm";
import { StatusMessages } from "./StatusMessages";
import { fetchProduct } from "./utils/product-actions";
import { getProductState } from "./utils/product-helpers";

export default function ProductSearch() {
  const [result, setResult] = useState<ProductResult>({
    productname: "",
    vegan: "n/a",
    vegetarian: "n/a",
    animaltestfree: "n/a",
    palmoil: "n/a",
    nutriscore: "",
    grade: "",
  });
  const [sources, setSources] = useState<Sources>({});
  const [barcode, setBarcode] = useState<string>("");
  const [showFound, setShowFound] = useState<boolean>(false);
  const [showNotFound, setShowNotFound] = useState<boolean>(false);
  const [showInvalid, setShowInvalid] = useState<boolean>(false);
  const [showTimeout, setShowTimeout] = useState<boolean>(false);
  const [showTimeoutFinal, setShowTimeoutFinal] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const eanFromURL = params.get("ean");
    if (eanFromURL) {
      setBarcode(eanFromURL);
      handleSubmit(eanFromURL);
    }
  }, []);

  const handleSubmit = async (barcode: string, event?: FormEvent) => {
    event?.preventDefault();

    setShowTimeoutFinal(false);
    setShowError(false);
    setShowTimeout(false);
    setShowFound(false);
    setShowNotFound(false);
    setShowInvalid(false);
    setLoading(true);

    try {
      const data = await fetchProduct(barcode);
      if (data.status === FetchStatus.OK && data.product && data.sources) {
        setResult({
          productname: data.product.productname,
          vegan: data.product.vegan ?? "n/a",
          vegetarian: data.product.vegetarian ?? "n/a",
          animaltestfree: data.product.animaltestfree ?? "n/a",
          palmoil: data.product.palmoil ?? "n/a",
          nutriscore: data.product.nutriscore ?? "",
          grade: data.product.grade ?? "",
        });
        setSources(data.sources);
        setShowFound(true);
      } else if (data.status === FetchStatus.NOT_FOUND) {
        setShowNotFound(true);
      } else if (data.status === FetchStatus.INVALID) {
        setShowInvalid(true);
      } else if (data.status === FetchStatus.TIMEOUT) {
        setShowTimeoutFinal(true);
      } else {
        setShowError(true);
      }
    } catch {
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SearchForm
        barcode={barcode}
        loading={loading}
        onBarcodeChange={setBarcode}
        onSubmit={handleSubmit}
      />

      {showFound && (
        <ProductResultView
          barcode={barcode}
          productState={getProductState(result)}
          result={result}
          sources={sources}
        />
      )}

      <StatusMessages
        showInvalid={showInvalid}
        showNotFound={showNotFound}
        showError={showError}
        showTimeout={showTimeout}
        showTimeoutFinal={showTimeoutFinal}
      />

      {loading && <LoadingSkeleton />}
    </>
  );
}
