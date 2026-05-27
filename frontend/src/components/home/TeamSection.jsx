import { TEAM_MEMBERS } from "../../utils/mockData";

export default function TeamSection() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Meet the Founder
          </h2>
          <h3 className="text-lg font-semibold text-gray-700">
            Unknown - Founder 
          </h3>
          <p className="mx-auto italic mt-4 max-w-2xl text-gray-500">
            -As an engineering student, I often struggled to find previous year question papers and study materials scattered across different sources. Notezy was created to solve that problem by providing a centralized platform where students can easily access organized academic resources and prepare more effectively for their exams
          </p>
        </div>

        <div className="mt-12 grid gap-8 w-1/2 mx-auto sm:grid-cols-1 lg:grid-cols-1">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.id}
              className="flex flex-col items-center rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm"
            >
              <img
                src={member.image}
                alt={member.name}
                className="h-24 w-24 rounded-full object-cover ring-4 ring-blue-50"
              />
              <h3 className="mt-4 text-lg font-bold text-gray-900">
                {member.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-blue-600">
                {member.title}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
