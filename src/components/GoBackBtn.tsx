import { SVGProps } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function GoBackBtn() {
  const router = useRouter();

  const getGoBackUrl = () => {
    const from = router.pathname;
    const onAdminPage = from.includes("admin");
    const onDashboardPage = from.includes("dashboard");
    const onGroupPage = from.includes("group");

    if (onAdminPage) {
      return "/dashboard";
    } else if (onDashboardPage) {
      return "/app";
    } else if (onGroupPage) {
      return "/dashboard";
    } else {
      return "/app";
    }
  };

  const goBackUrl = getGoBackUrl();

  return (
    <Link
      href={goBackUrl}
      prefetch={false}
      className="flex items-center space-x-2 cursor-pointer text-white"
    >
      <ArrowLeftIcon className="h-5 w-5" />
      <span className="sr-only">Back</span>
    </Link>
  );
}

function ArrowLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}
