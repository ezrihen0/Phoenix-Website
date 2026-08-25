import Image from "next/image";
import { FileText, Globe, Home, Mail, MapPin, Phone, User } from "lucide-react";

import { FINANCE_A4_COPY, type FinanceDocumentView } from "@/lib/portal/finance-document";

import styles from "./portal-finance-a4-page.module.css";

type PortalFinanceA4PageProps = {
  document: FinanceDocumentView;
};

export function PortalFinanceA4Page({ document }: PortalFinanceA4PageProps) {
  return (
    <div className={styles.frame}>
      <article className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.brandRow}>
              <Image src="/images/brand/logo.webp" alt="" width={148} height={54} className={styles.logo} />
              <div className={styles.wordmark}>
                <p className={styles.phoenix}>PHOENIX</p>
                <p className={styles.subBrand}>CHIMNEY & FIREPLACE</p>
              </div>
            </div>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <Phone className={styles.contactIcon} size={11} aria-hidden="true" />
                <span>{document.brand.phone}</span>
              </li>
              <li className={styles.contactItem}>
                <Mail className={styles.contactIcon} size={11} aria-hidden="true" />
                <span>{document.brand.email}</span>
              </li>
              <li className={styles.contactItem}>
                <Globe className={styles.contactIcon} size={11} aria-hidden="true" />
                <span>{document.brand.website}</span>
              </li>
              <li className={styles.contactItem}>
                <MapPin className={styles.contactIcon} size={11} aria-hidden="true" />
                <span>{document.brand.address}</span>
              </li>
            </ul>
          </div>
          <div className={styles.headerRight}>
            <p className={styles.docType}>{document.documentType}</p>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>{document.numberCaption}</span>
              <span>{document.documentNumber}</span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>{document.issueDateCaption}</span>
              <span>{document.issueDateLabel}</span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>{document.dueDateCaption}</span>
              <span>{document.dueDateLabel}</span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Status</span>
              <span className={styles.statusPill}>{document.status}</span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Job #</span>
              <span>{document.jobNumber}</span>
            </div>
          </div>
        </header>

        <div className={styles.body}>
          <div className={styles.cards}>
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>
                <User size={12} aria-hidden="true" />
                BILL TO
              </h2>
              <p className={styles.cardLine}>{document.customer.name}</p>
              <p className={styles.cardLine}>{document.customer.email}</p>
              <p className={styles.cardLine}>{document.customer.phone}</p>
              <p className={styles.cardLine}>{document.customer.billingAddress}</p>
            </section>
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>
                <Home size={12} aria-hidden="true" />
                SERVICE ADDRESS
              </h2>
              <p className={styles.cardLine}>{document.serviceAddress}</p>
            </section>
          </div>

          <section className={styles.summary}>
            <p className={styles.summaryLabel}>
              <FileText size={12} aria-hidden="true" />
              SERVICE SUMMARY
            </p>
            <p className={styles.summaryText}>{document.serviceSummary}</p>
          </section>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.colDesc}>DESCRIPTION</th>
                  <th className={styles.colQty}>QTY</th>
                  <th className={styles.colPrice}>UNIT PRICE</th>
                  <th className={styles.colAmt}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {document.lineItems.map((line) => (
                  <tr key={`${line.description}-${line.amount}`}>
                    <td className={styles.colDesc}>{line.description}</td>
                    <td className={styles.colQty}>{line.quantity}</td>
                    <td className={styles.colPrice}>{line.unitPrice}</td>
                    <td className={styles.colAmt}>{line.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.bottom}>
            <section className={styles.notes}>
              <h2 className={styles.cardTitle}>
                <FileText size={12} aria-hidden="true" />
                NOTES & PAYMENT TERMS
              </h2>
              <p className={styles.cardLine}>{document.notes}</p>
              <p className={styles.cardLine}>{document.paymentTerms}</p>
            </section>
            <dl className={styles.totals}>
              <div className={styles.totalRow}>
                <dt>Subtotal</dt>
                <dd>{document.subtotal}</dd>
              </div>
              <div className={styles.totalRow}>
                <dt>{document.taxLabel}</dt>
                <dd>{document.tax}</dd>
              </div>
              <div className={styles.totalRow}>
                <dt>Total</dt>
                <dd>{document.total}</dd>
              </div>
              <div className={styles.totalRow}>
                <dt>Payments & Credits</dt>
                <dd>{document.payments}</dd>
              </div>
              <div className={styles.emphasis}>
                <dt>{document.emphasizedLabel}</dt>
                <dd>{document.emphasizedAmount}</dd>
              </div>
            </dl>
          </div>
        </div>

        <footer className={styles.footer}>
          <div className={styles.footerRule}>
            <Image src="/images/brand/logo.webp" alt="" width={22} height={22} className={styles.footerMark} />
          </div>
          <p className={styles.credentials}>{FINANCE_A4_COPY.credentials}</p>
          <p className={styles.tagline}>{FINANCE_A4_COPY.tagline}</p>
        </footer>
      </article>
    </div>
  );
}
