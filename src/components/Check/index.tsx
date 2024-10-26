"use client";

import { useState, useEffect, FormEvent } from "react";

import { ErrorResponse } from "@/models/ErrorRepsonse";
import { ProductResult } from "@/models/ProductResults";
import { Sources } from "@/models/Sources";

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
    setShowTimeout(false);
    setShowFound(false);
    setShowNotFound(false);
    setShowInvalid(false);
    setLoading(true);

    try {
      const data = await fetchProduct(barcode);
      if (data.status === 200 && data.product && data.sources) {
        setResult(data.product);
        setSources(data.sources);
        setShowFound(true);
      } else if (data.status === 404) {
        setShowNotFound(true);
      } else {
        setShowInvalid(true);
      }
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        "status" in (error as ErrorResponse).response
      ) {
        if ((error as ErrorResponse).response.status === 400) {
          setShowInvalid(true);
        } else if ((error as ErrorResponse).response.status === 404) {
          setShowNotFound(true);
        }
      } else {
        console.error(error);
        setShowTimeoutFinal(true);
      }
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
          result={result}
          sources={sources}
          productState={getProductState(result)}
          barcode={barcode}
        />
      )}

      <StatusMessages
        showNotFound={showNotFound}
        showInvalid={showInvalid}
        showTimeout={showTimeout}
        showTimeoutFinal={showTimeoutFinal}
      />

      {loading && <LoadingSkeleton />}
    </>
  );
}
