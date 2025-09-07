interface JoinUsCardProps {
  number: number;
  content: string;
}

export default function JoinUsCard({ number, content }: JoinUsCardProps) {
  return (
    <div className="flex items-start space-x-4 rounded-lg bg-white p-6 shadow-lg">
      <h2 className="lg:text-h2 text-h2 font-semibold text-gray-900">
        {number}
      </h2>
      <p className="lg:text-h3 text-h5 mb-4 pt-1 text-gray-700">{content}</p>
    </div>
  );
}
