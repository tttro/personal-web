import { CvChat } from "./_components/CvChat";

const Page = () => (
  <div className="min-h-screen bg-white text-neutral-950">
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6 md:px-8 md:py-16">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight leading-snug sm:text-4xl sm:leading-snug">
          Hi, I&rsquo;m Tero
          <br />
          and here is my buddy
          <br />
          <span className="text-green-500">Apuälynen&trade;</span>
        </h1>

        <a
          href="/cv"
          className="inline-flex w-fit items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-100"
        >
          View full CV
        </a>
      </header>

      <main>
        <CvChat />
      </main>
    </div>
  </div>
);

export default Page;
