import { FaStar } from "react-icons/fa";
import profilePic from "../../assets/travel.jpg"; // replace with your actual image

const testimonials = [
  {
    name: "Jane Smith",
    feedback:
      "A fantastic adventure! The tour guides were knowledgeable and the views were breathtaking.",
    rating: 5,
  },
  {
    name: "Jane Smith",
    feedback:
      "A fantastic adventure! The tour guides were knowledgeable and the views were breathtaking.",
    rating: 5,
  },
  {
    name: "Jane Smith",
    feedback:
      "A fantastic adventure! The tour guides were knowledgeable and the views were breathtaking.",
    rating: 5,
  },
  {
    name: "Jane Smith",
    feedback:
      "A fantastic adventure! The tour guides were knowledgeable and the views were breathtaking.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-white">
      {/* Heading */}
      <h2 className="text-3xl font-bold font-roboto-condensed text-gray-900 mb-10 px-10">
        Hear what our customers say,
      </h2>

      {/* Cards */}
      <div className="flex flex-wrap justify-center font-roboto-condensed gap-8 px-6">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="bg-[#B749DB] text-white rounded-2xl p-6 w-[320px] relative"
          >
            {/* Profile Image */}
            <div className="absolute -top-8 left-6">
              <img
                src={profilePic}
                alt={t.name}
                className="w-12 h-12 rounded-full border-2 border-white"
              />
            </div>

            {/* Name */}
            <div className="mt-6 font-bold text-[20px]">{t.name}</div>

            {/* Stars */}
            <div className="flex items-center space-x-1 mt-1">
              {Array.from({ length: t.rating }).map((_, index) => (
                <FaStar key={index} className="text-yellow-300" />
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-white/50 my-3"></div>

            {/* Feedback */}
            <p className="italic text-[16px] font-medium leading-relaxed">
              “{t.feedback}”
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
