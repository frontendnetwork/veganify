import Container from "@/components/elements/container";
import { IngredientsForm } from "@/components/IngredientsCheck/IngredientsForm";

export default function IngredientsPage() {
  return (
    <>
      <Container logo={false} backButton={false}>
        <IngredientsForm />
      </Container>
    </>
  );
}
