

const packages = [
  { title: "Adventure", description: "Explore the wild side of Sri Lanka." },
  { title: "Luxury", description: "Relax in the lap of luxury with our exclusive packages." },
  { title: "Family", description: "Perfect family vacations with tons of activities." },
];

export default function ExplorePackages() {
  return (
    <div className="py-16 text-center">
      <h2 className="text-3xl font-semibold mb-8">Explore Our Packages</h2>
      <p className="text-lg mb-12">
        Embark on a thrilling journey through the wilderness with activities like trekking, zip-lining, and wildlife safaris.
      </p>
      <div className="flex justify-center space-x-6">
        {packages.map((pkg, index) => (
          <div key={index} className="bg-white p-8 rounded-xl shadow-lg w-80">
            <h3 className="text-xl font-semibold mb-4">{pkg.title}</h3>
            <p>{pkg.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
