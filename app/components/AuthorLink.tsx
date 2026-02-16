const LINKEDIN_URL = "https://www.linkedin.com/in/kalyan-p-b92834185";

interface AuthorLinkProps {
  showRole?: boolean;
  className?: string;
  nameClassName?: string;
  roleClassName?: string;
}

export default function AuthorLink({
  showRole = true,
  className = "",
  nameClassName = "text-zinc-900 dark:text-zinc-100 font-medium hover:text-blue-600 dark:hover:text-blue-400 hover:underline underline-offset-2 transition-colors duration-150",
  roleClassName = "text-zinc-500 dark:text-zinc-400",
}: AuthorLinkProps) {
  return (
    <span className={className}>
      <a
        href={LINKEDIN_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={nameClassName}
      >
        Kalyan Pilli
      </a>
      {showRole && (
        <span className={`block text-xs ${roleClassName}`}>
          SDET &middot; Video Infrastructure Benchmarking
        </span>
      )}
    </span>
  );
}

export { LINKEDIN_URL };
