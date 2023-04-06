import Image from "next/image";

const Country: React.FC = () => {
  return (
    <>
      <p className="text-lg text-gray-500">
        Welcome to the land down under, the beautiful country of Australia!
        Australia is the world&apos;s largest island and the smallest continent,
        situated in the southern hemisphere, between the Pacific and Indian
        Oceans. This vast and diverse country is comprised of six states and two
        territories, each with its unique landscapes, climate, and culture. The
        capital city is Canberra, while Sydney is the largest city and the
        cultural and financial center of the country.
      </p>

      <br />

      <Image
        className="absoulte"
        alt=""
        src="/pictures/australia1.jpg"
        width={1000}
        height={600}
      />
    </>
  );
};

export default Country;
