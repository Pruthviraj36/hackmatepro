interface HackathonTagProps {
  name: string;
}

export function HackathonTag({ name }: HackathonTagProps) {
  return (
    <span className="tag-hackathon">
      {name}
    </span>
  );
}
