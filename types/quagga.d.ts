declare module "quagga" {
  // biome-ignore lint/suspicious/noExplicitAny: third-party module shim requires any
  const Quagga: any;
  export default Quagga;
}
