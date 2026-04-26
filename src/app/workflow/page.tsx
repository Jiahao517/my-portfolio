import Link from "next/link";

export default function WorkflowPage() {
  return (
    <main className="art-static-page">
      <div className="art-static-page__inner">
        <p className="art-static-page__eyebrow">Workflow</p>
        <h1 className="art-static-page__title">A clear, iterative process from idea to launch.</h1>
        <p className="art-static-page__body">
          This placeholder page mirrors the linked structure of the reference footer. It keeps the route
          accessible while the rest of the site continues focusing on the primary portfolio experience.
        </p>
        <Link href="/" className="art-static-page__link">
          Back home
        </Link>
      </div>
    </main>
  );
}
