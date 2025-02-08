interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
      <p>{message}</p>
    </div>
  );
} 