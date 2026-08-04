import { Container } from "./Container";
import { NewsletterForm } from "./NewsletterForm";
import { ResourcesCta } from "./ResourcesCta";

export function CtaSection() {
  return (
    <section className="bg-black">
      <Container className="grid gap-6 pb-16 sm:grid-cols-2 sm:pb-20">
        <NewsletterForm />
        <ResourcesCta />
      </Container>
    </section>
  );
}
