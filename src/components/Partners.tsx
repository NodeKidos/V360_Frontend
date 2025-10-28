

const partners = [
  { name: "Cinnamon Grand", location: "Colombo", image: "/path-to-image" },
  { name: "Cinnamon Grand", location: "Colombo", image: "/path-to-image" },
  // Add other partners here
];

export default function Partners() {
  return (
    <div className="py-16 bg-gray-100 text-center">
      <h2 className="text-3xl font-semibold mb-8">Our Trusted Partners</h2>
      <p className="text-xl mb-12">
        Discover Sri Lanka's magic with Vibes Lanka Travel and Tours. Where our packages suit every vibe - from romance to family adventure and beyond.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {partners.map((partner, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
            <img src={partner.image} alt={partner.name} className="w-full h-48 object-cover rounded-lg mb-4" />
            <h3 className="font-semibold text-lg">{partner.name}</h3>
            <p>{partner.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
