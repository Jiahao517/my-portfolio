import Link from "next/link";

export default function FaqPage() {
  return (
    <main className="art-static-page">
      <div className="art-static-page__inner">
        <p className="art-static-page__eyebrow">FAQ</p>
        <h1 className="art-static-page__title">Answers to the most common questions.</h1>
        <p className="art-static-page__body">
          This is a lightweight static destination added so the replicated footer behaves like the
          reference site. It can be expanded later without changing the footer contract.
        </p>
        <Link href="/" className="art-static-page__link">
          Back home
        </Link>
      </div>
    </main>
  );
}
