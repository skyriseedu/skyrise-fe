interface JoinUsCardProps {
  number: number;
  content: string;
}

export default function JoinUsCard({ number, content }: JoinUsCardProps) {
  return (
    <div className="flex items-start space-x-4 rounded-lg bg-white p-4 shadow-lg lg:p-7">
      <h2 className="text-h2 lg:text-h2 font-semibold text-gray-900">
        {number}
      </h2>
      <p className="text-h5 lg:text-body-2 mb-4 pt-1 text-gray-700">{content}</p>
    </div>
  );
}
