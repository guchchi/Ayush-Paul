import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Link,
  Section,
  Button
} from '@react-email/components';
import * as React from 'react';

interface PurchaseReceiptEmailProps {
  customerName: string;
  productName: string;
  amount: string;
  labUrl: string;
}

export const PurchaseReceiptEmail = ({
  customerName,
  productName,
  amount,
  labUrl
}: PurchaseReceiptEmailProps) => (
  <Html>
    <Head />
    <Preview>Your blueprint has been unlocked in the Innovation Lab</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={heading}>Payment Successful 🚀</Heading>
        </Section>
        <Section style={bodyContent}>
          <Text style={text}>Hi {customerName},</Text>
          <Text style={text}>
            Thank you for your purchase. Your payment of <strong>{amount}</strong> has been successfully processed.
          </Text>
          <Text style={text}>
            Your premium asset, <strong>{productName}</strong>, is now permanently unlocked and waiting for you in your digital vault.
          </Text>
          <Button style={button} href={labUrl}>
            Access The Lab
          </Button>
          <Text style={footerText}>
            If you have any issues, reply directly to this email.
            <br />— Ayush Paul
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#0A0A0A',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
  backgroundColor: '#111111',
  borderRadius: '12px',
  border: '1px solid #333',
};

const header = {
  padding: '24px',
  backgroundColor: '#1a1a1a',
  borderTopLeftRadius: '12px',
  borderTopRightRadius: '12px',
  borderBottom: '1px solid #333',
};

const heading = {
  fontSize: '24px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#ffffff',
  margin: '0',
};

const bodyContent = {
  padding: '32px 24px',
};

const text = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#cccccc',
  margin: '0 0 20px',
};

const button = {
  backgroundColor: '#00C2FF',
  borderRadius: '8px',
  color: '#000000',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '16px',
  marginTop: '32px',
  marginBottom: '32px',
};

const footerText = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#666666',
  marginTop: '32px',
};
