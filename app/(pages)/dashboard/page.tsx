import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { inter } from "@/lib/fonts";

const DashboardPage: React.FC = () => {
  return (
    <section className={`${inter.className}`}>
      <MaxWidthWrapper>
        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 xs:flex-row xs:items-center sm:gap-0">
          <h2 className="mb-3 font-bold text-3xl text-gray-900">
            My Dashboard
          </h2>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default DashboardPage;
