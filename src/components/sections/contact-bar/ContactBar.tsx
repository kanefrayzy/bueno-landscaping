import { ContactButtons } from '@/components/ui/ContactButtons';
import { Container } from '@/components/ui/Container';

export function ContactBar() {
  return (
    <Container className="contact-bar">
      <div className="contact-bar__card">
        <div>
          <h2 className="contact-bar__title">Tell us about your yard</h2>
          <p className="contact-bar__text">Free estimates. Call, text or send a quick request.</p>
        </div>
        <ContactButtons location="contact_bar" quoteHref="#quote" className="contact-bar__actions" />
      </div>
    </Container>
  );
}
