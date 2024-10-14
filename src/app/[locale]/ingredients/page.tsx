import Container from "@/components/elements/container";
import IngredientsCheck from "@/components/ingredientscheck";
import Nav from "@/components/nav";

export default function IngredientsPage() {
  return (
    <>
      <div id="modal-root"></div>
      <Nav />
      <Container logo={false} backbutton={false}>
        <IngredientsCheck />
      </Container>
    </>
  );
}
