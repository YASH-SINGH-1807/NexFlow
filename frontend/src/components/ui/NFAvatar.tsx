interface Props {
  name: string;
}

export default function NFAvatar({
  name,
}: Props) {
  const initials = name
    .split(" ")
    .map((x) => x[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-4">
      <div
        className="
          flex h-12 w-12
          items-center justify-center
          rounded-full
          bg-blue-600
          font-bold
          text-white
          shadow-lg
        "
      >
        {initials}
      </div>

      <div>
        <p className="font-semibold text-slate-800">
          {name}
        </p>

        <p className="text-sm text-slate-500">
          Administrator
        </p>
      </div>
    </div>
  );
}