declare module "quagga" {
  // eslint-disable-next-line typescript/no-explicit-any -- third-party module shim requires any
  const Quagga: any;
  export default Quagga;
}
